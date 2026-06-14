import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

/* ------------------------------ GLSL ------------------------------ */
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
vec3 snoiseVec3(vec3 x){
  return vec3(
    snoise(x),
    snoise(vec3(x.y - 19.1, x.z + 33.4, x.x + 47.2)),
    snoise(vec3(x.z + 74.2, x.x - 124.5, x.y + 99.4))
  );
}
vec3 curl(vec3 p){
  const float e = 0.1;
  vec3 dx = vec3(e,0.0,0.0), dy = vec3(0.0,e,0.0), dz = vec3(0.0,0.0,e);
  vec3 px0 = snoiseVec3(p - dx), px1 = snoiseVec3(p + dx);
  vec3 py0 = snoiseVec3(p - dy), py1 = snoiseVec3(p + dy);
  vec3 pz0 = snoiseVec3(p - dz), pz1 = snoiseVec3(p + dz);
  float x = (py1.z - py0.z) - (pz1.y - pz0.y);
  float y = (pz1.x - pz0.x) - (px1.z - px0.z);
  float z = (px1.y - px0.y) - (py1.x - py0.x);
  return normalize(vec3(x, y, z) * (1.0 / (2.0 * e)) + 1e-5);
}`;

const POSITION_FRAG = /* glsl */ `
uniform float uDelta;
void main(){
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 pos = texture2D( texturePosition, uv );
  vec4 vel = texture2D( textureVelocity, uv );
  pos.xyz += vel.xyz * uDelta;
  gl_FragColor = pos;
}`;

const VELOCITY_FRAG =
  NOISE +
  /* glsl */ `
uniform sampler2D targetA;
uniform sampler2D targetB;
uniform float uDelta, uTime, uMorph, uMouseStrength, uFlingMag, uSpring;
uniform vec3  uMouse, uFlingDir;
void main(){
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 pos = texture2D( texturePosition, uv ).xyz;
  vec3 vel = texture2D( textureVelocity, uv ).xyz;

  vec3 tA = texture2D( targetA, uv ).xyz;
  vec3 tB = texture2D( targetB, uv ).xyz;
  vec3 target = mix( tA, tB, smoothstep(0.0,1.0,uMorph) );

  // spring toward target (the "heal")
  vel += (target - pos) * uSpring * uDelta;

  // organic curl drift
  vel += curl( pos * 0.18 + uTime * 0.05 ) * 0.30 * uDelta;

  // cursor inverse-square repulsion (sculpt)
  vec3 d = pos - uMouse;
  float dist2 = max(dot(d,d), 0.06);
  vel += normalize(d) * (uMouseStrength / dist2) * uDelta;

  // global fling impulse
  vel += uFlingDir * uFlingMag * uDelta;

  vel *= 0.90;
  gl_FragColor = vec4( vel, 1.0 );
}`;

const RENDER_VERT = /* glsl */ `
uniform sampler2D uPosTex;
uniform sampler2D uVelTex;
uniform float uSize, uPixelRatio, uTime;
attribute vec2 ref;
varying float vSpeed;
varying float vDepth;
void main(){
  vec3 pos = texture2D( uPosTex, ref ).xyz;
  vec3 vel = texture2D( uVelTex, ref ).xyz;
  vec4 mv = modelViewMatrix * vec4( pos, 1.0 );
  float breathe = 1.0 + 0.03 * sin(uTime * 1.2);
  gl_PointSize = clamp(uSize * uPixelRatio * breathe * (300.0 / -mv.z), 1.0, 14.0);
  gl_Position = projectionMatrix * mv;
  vSpeed = clamp( length(vel) * 0.16, 0.0, 1.0 );
  vDepth = -mv.z;
}`;

const RENDER_FRAG = /* glsl */ `
precision highp float;
uniform vec3 uColorCool, uColorHot;
uniform float uFade;
varying float vSpeed;
varying float vDepth;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float a = smoothstep(0.5, 0.0, length(c));
  if(a < 0.01) discard;
  float depthFade = clamp(1.0 - (vDepth - 6.0) / 30.0, 0.12, 1.0);
  vec3 col = mix(uColorCool, uColorHot, vSpeed);
  gl_FragColor = vec4(col, a * depthFade * 0.9 * uFade);
}`;

/* --------------------- procedural morph targets --------------------- */
function buildTargets(count) {
  const head = new Float32Array(count * 4);
  const brain = new Float32Array(count * 4);
  const globe = new Float32Array(count * 4);
  const mono = new Float32Array(count * 4);

  // "RI" text → points sampled from a 2D canvas
  const cv = document.createElement("canvas");
  cv.width = 256;
  cv.height = 128;
  const ctx = cv.getContext("2d");
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, 256, 128);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 110px Inter, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("RI", 128, 70);
  const img = ctx.getImageData(0, 0, 256, 128).data;
  const pts = [];
  for (let y = 0; y < 128; y += 2) {
    for (let x = 0; x < 256; x += 2) {
      if (img[(y * 256 + x) * 4] > 128) pts.push([x, y]);
    }
  }

  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * Math.PI * 2;
    const phi = Math.acos(2 * v - 1);
    const st = Math.sin(phi);

    // HEAD — ellipsoid skull + jaw
    let r = 2.0 + (Math.random() - 0.5) * 0.12;
    let hx = Math.cos(theta) * st * 1.5 * r * 0.5;
    let hy = Math.cos(phi) * 1.9 * r * 0.5;
    let hz = Math.sin(theta) * st * 1.6 * r * 0.5;
    if (hy < -0.6) { hx *= 0.8; hz *= 0.85; hy *= 1.1; }
    head[i * 4] = hx; head[i * 4 + 1] = hy + 0.2; head[i * 4 + 2] = hz; head[i * 4 + 3] = 1;

    // BRAIN — folded sphere
    const fold = 0.35 * Math.sin(theta * 8.0) * Math.sin(phi * 6.0);
    const br = 1.7 + fold;
    brain[i * 4] = Math.cos(theta) * st * br * 1.1;
    brain[i * 4 + 1] = Math.cos(phi) * br;
    brain[i * 4 + 2] = Math.sin(theta) * st * br;
    brain[i * 4 + 3] = 1;

    // GLOBE — thin shell + slight wobble (a data planet)
    const gr = 2.3 + (Math.random() - 0.5) * 0.06;
    globe[i * 4] = Math.cos(theta) * st * gr;
    globe[i * 4 + 1] = Math.cos(phi) * gr;
    globe[i * 4 + 2] = Math.sin(theta) * st * gr;
    globe[i * 4 + 3] = 1;

    // MONOGRAM — "RI"
    if (pts.length) {
      const p = pts[(Math.random() * pts.length) | 0];
      mono[i * 4] = (p[0] / 256 - 0.5) * 8.0;
      mono[i * 4 + 1] = -(p[1] / 128 - 0.5) * 4.0;
      mono[i * 4 + 2] = (Math.random() - 0.5) * 0.5;
      mono[i * 4 + 3] = 1;
    } else {
      mono[i * 4] = globe[i * 4];
      mono[i * 4 + 1] = globe[i * 4 + 1];
      mono[i * 4 + 2] = globe[i * 4 + 2];
      mono[i * 4 + 3] = 1;
    }
  }
  return [head, brain, globe, mono];
}

export default function DataObservatory() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    try {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    const gl2 = document.createElement("canvas").getContext("webgl2");
    if (!gl2) {
      mount.classList.add("observatory-poster");
      return;
    }

    const SIDE = isMobile ? 150 : 300;
    const COUNT = SIDE * SIDE;
    const DPR = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
    const W = () => mount.clientWidth;
    const H = () => mount.clientHeight;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: "high-performance" });
    } catch (e) {
      mount.classList.add("observatory-poster");
      return;
    }
    renderer.setPixelRatio(DPR);
    renderer.setSize(W(), H());
    renderer.setClearColor(0x06060c, 1);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06060c, 0.03);
    const camera = new THREE.PerspectiveCamera(55, W() / H(), 0.1, 100);
    camera.position.set(0, 0, 9);

    // ---- GPGPU ----
    const gpu = new GPUComputationRenderer(SIDE, SIDE, renderer);
    const pos0 = gpu.createTexture();
    const vel0 = gpu.createTexture();
    const targets = buildTargets(COUNT);
    const targetTex = targets.map((arr) => {
      const t = gpu.createTexture();
      t.image.data.set(arr);
      t.needsUpdate = true;
      return t;
    });

    const pd = pos0.image.data;
    const head = targets[0];
    for (let i = 0; i < COUNT; i++) {
      pd[i * 4] = head[i * 4] + (Math.random() - 0.5) * 4;
      pd[i * 4 + 1] = head[i * 4 + 1] + (Math.random() - 0.5) * 4;
      pd[i * 4 + 2] = head[i * 4 + 2] + (Math.random() - 0.5) * 4;
      pd[i * 4 + 3] = 1;
    }
    pos0.needsUpdate = true;
    vel0.image.data.fill(0);
    vel0.needsUpdate = true;

    const posVar = gpu.addVariable("texturePosition", POSITION_FRAG, pos0);
    const velVar = gpu.addVariable("textureVelocity", VELOCITY_FRAG, vel0);
    gpu.setVariableDependencies(posVar, [posVar, velVar]);
    gpu.setVariableDependencies(velVar, [posVar, velVar]);
    posVar.material.uniforms.uDelta = { value: 0 };
    Object.assign(velVar.material.uniforms, {
      uDelta: { value: 0 },
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uSpring: { value: 6.0 },
      uMouse: { value: new THREE.Vector3(999, 999, 999) },
      uMouseStrength: { value: 0 },
      uFlingDir: { value: new THREE.Vector3() },
      uFlingMag: { value: 0 },
      targetA: { value: targetTex[0] },
      targetB: { value: targetTex[1] },
    });
    const err = gpu.init();
    if (err) {
      console.error("[observatory]", err);
      mount.classList.add("observatory-poster");
      renderer.dispose();
      if (renderer.domElement.parentNode) mount.removeChild(renderer.domElement);
      return;
    }

    // ---- points ----
    const geo = new THREE.BufferGeometry();
    const refs = new Float32Array(COUNT * 2);
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      refs[i * 2] = (i % SIDE) / SIDE;
      refs[i * 2 + 1] = Math.floor(i / SIDE) / SIDE;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("ref", new THREE.BufferAttribute(refs, 2));
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uPosTex: { value: null },
        uVelTex: { value: null },
        uSize: { value: isMobile ? 0.07 : 0.09 },
        uPixelRatio: { value: DPR },
        uTime: { value: 0 },
        uColorCool: { value: new THREE.Color(0x6366f1) },
        uColorHot: { value: new THREE.Color(0xd8b4fe) },
        uFade: { value: 1.0 },
      },
      vertexShader: RENDER_VERT,
      fragmentShader: RENDER_FRAG,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
    });
    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    scene.add(points);

    // ---- bloom (desktop) ----
    let composer = null;
    if (!isMobile) {
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      composer.addPass(
        new UnrealBloomPass(new THREE.Vector2(W() * 0.5, H() * 0.5), 1.0, 0.6, 0.0)
      );
    }

    // ---- interaction ----
    const ndc = new THREE.Vector2();
    const ray = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const mouseWorld = new THREE.Vector3();
    let mouseActive = false;
    let dragging = false;
    const lastMouse = new THREE.Vector2();
    const mouseVel = new THREE.Vector2();
    let scrollTarget = 0;
    let scrollCurr = 0;

    const onMove = (e) => {
      const r = renderer.domElement.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = -((e.clientY - r.top) / r.height) * 2 + 1;
      mouseVel.set(nx - lastMouse.x, ny - lastMouse.y);
      lastMouse.set(nx, ny);
      ndc.set(nx, ny);
      ray.setFromCamera(ndc, camera);
      ray.ray.intersectPlane(plane, mouseWorld);
      mouseActive = true;
      points.rotation.y = nx * 0.12;
      points.rotation.x = -ny * 0.07;
    };
    const onDown = () => { dragging = true; };
    const onUp = () => {
      if (dragging && mouseVel.length() > 0.012) {
        velVar.material.uniforms.uFlingDir.value.set(mouseVel.x, mouseVel.y, 0).normalize();
        velVar.material.uniforms.uFlingMag.value = Math.min(mouseVel.length() * 55, 13);
      }
      dragging = false;
    };
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      scrollTarget = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    };
    const onResize = () => {
      renderer.setSize(W(), H());
      camera.aspect = W() / H();
      camera.updateProjectionMatrix();
      if (composer) composer.setSize(W(), H());
    };

    if (!reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    window.addEventListener("resize", onResize);
    onScroll();

    const clock = new THREE.Clock();
    let raf = 0;
    let acc = 0;
    let frames = 0;
    const NT = targetTex.length;

    const renderOnce = () => {
      mat.uniforms.uPosTex.value = gpu.getCurrentRenderTarget(posVar).texture;
      mat.uniforms.uVelTex.value = gpu.getCurrentRenderTarget(velVar).texture;
      if (composer) composer.render();
      else renderer.render(scene, camera);
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(clock.getDelta(), 0.033);
      const t = clock.elapsedTime;

      scrollCurr += (scrollTarget - scrollCurr) * 0.07;

      // map scroll → target pair + morph weight
      const seg = scrollCurr * (NT - 1);
      const idx = Math.min(NT - 2, Math.floor(seg));
      const u = velVar.material.uniforms;
      u.targetA.value = targetTex[idx];
      u.targetB.value = targetTex[idx + 1];
      u.uMorph.value = seg - idx;
      u.uDelta.value = dt;
      u.uTime.value = t;
      posVar.material.uniforms.uDelta.value = dt;
      if (mouseActive) {
        u.uMouse.value.copy(mouseWorld);
        u.uMouseStrength.value = dragging ? 8.0 : 3.2;
      } else u.uMouseStrength.value = 0;
      u.uFlingMag.value *= 0.92;

      camera.position.z = 9 - scrollCurr * 2.5;

      gpu.compute();
      mat.uniforms.uTime.value = t;
      mat.uniforms.uFade.value = 1.0 - Math.min(scrollCurr / 0.12, 1) * 0.6;
      renderOnce();

      acc += dt;
      frames++;
      if (acc >= 1.0) {
        const fps = frames / acc;
        if (fps < 42 && composer && composer.passes.length > 2) composer.passes.pop();
        frames = 0;
        acc = 0;
      }
    };

    if (reduced) {
      gpu.compute();
      renderOnce();
    } else {
      frame();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      geo.dispose();
      mat.dispose();
      composer?.dispose?.();
      renderer.dispose();
      if (renderer.domElement.parentNode) mount.removeChild(renderer.domElement);
    };
    } catch (e) {
      console.error("[observatory] init failed:", e);
      mount.classList.add("observatory-poster");
      return () => {};
    }
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="observatory fixed inset-0 -z-10 bg-[#06060c]"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 50% 40%, #0c0c1a 0%, #06060c 70%)",
      }}
    />
  );
}
