import { useEffect, useRef } from "react";
import * as THREE from "three";
import { usePrefersReducedMotion } from "../hooks/useMediaQuery";

/**
 * The persistent "data world" backdrop.
 * A WebGL particle constellation (nodes + edges that breathe) wrapped around a
 * rotating wireframe data-core. Mouse drives parallax, scroll dollies the camera.
 * Falls back gracefully to the CSS gradient + grid if WebGL is unavailable or
 * the user prefers reduced motion.
 */
export default function DataBackground() {
  const mountRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch (e) {
      return; // No WebGL — CSS layers still provide atmosphere.
    }

    const W = () => mount.clientWidth;
    const H = () => mount.clientHeight;
    const isSmall = window.innerWidth < 768;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W(), H());
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x04050a, 0.04);

    const camera = new THREE.PerspectiveCamera(60, W() / H(), 0.1, 100);
    camera.position.set(0, 0, 16);

    // ---- palette ----
    const palette = [
      new THREE.Color("#22d3ee"),
      new THREE.Color("#38bdf8"),
      new THREE.Color("#6366f1"),
      new THREE.Color("#a78bfa"),
    ];

    // ---- particle field (nodes) ----
    const COUNT = isSmall ? 90 : 170;
    const SPREAD_X = 30;
    const SPREAD_Y = 18;
    const SPREAD_Z = 14;

    const base = new Float32Array(COUNT * 3); // original positions for breathing
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const phase = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * SPREAD_X;
      const y = (Math.random() - 0.5) * SPREAD_Y;
      const z = (Math.random() - 0.5) * SPREAD_Z;
      base[i * 3] = x;
      base[i * 3 + 1] = y;
      base[i * 3 + 2] = z;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      const c = palette[(Math.random() * palette.length) | 0];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      phase[i] = Math.random() * Math.PI * 2;
    }

    // round glowing sprite for the points
    const makeSprite = () => {
      const s = 64;
      const cv = document.createElement("canvas");
      cv.width = cv.height = s;
      const ctx = cv.getContext("2d");
      const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.3, "rgba(190,240,255,0.85)");
      g.addColorStop(1, "rgba(190,240,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, s, s);
      const t = new THREE.CanvasTexture(cv);
      return t;
    };
    const sprite = makeSprite();

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const pMat = new THREE.PointsMaterial({
      size: isSmall ? 0.34 : 0.42,
      map: sprite,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(pGeo, pMat);

    // ---- edges (the network) ----
    const edges = [];
    const maxDist = isSmall ? 5.2 : 5.8;
    for (let i = 0; i < COUNT; i++) {
      let links = 0;
      for (let j = i + 1; j < COUNT && links < 3; j++) {
        const dx = base[i * 3] - base[j * 3];
        const dy = base[i * 3 + 1] - base[j * 3 + 1];
        const dz = base[i * 3 + 2] - base[j * 3 + 2];
        if (Math.sqrt(dx * dx + dy * dy + dz * dz) < maxDist) {
          edges.push(i, j);
          links++;
        }
      }
    }
    const linePos = new Float32Array(edges.length * 3);
    const lineCol = new Float32Array(edges.length * 3);
    for (let e = 0; e < edges.length; e++) {
      const idx = edges[e];
      lineCol[e * 3] = 0.18;
      lineCol[e * 3 + 1] = 0.55;
      lineCol[e * 3 + 2] = 0.85;
      void idx;
    }
    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
    lGeo.setAttribute("color", new THREE.BufferAttribute(lineCol, 3));
    const lMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const lines = new THREE.LineSegments(lGeo, lMat);

    const field = new THREE.Group();
    field.add(points, lines);
    scene.add(field);

    // ---- data core (rotating wireframe icosahedra) ----
    const core = new THREE.Group();
    const mkShell = (radius, detail, color, opacity) => {
      const geo = new THREE.IcosahedronGeometry(radius, detail);
      const wire = new THREE.WireframeGeometry(geo);
      const mat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      geo.dispose();
      return new THREE.LineSegments(wire, mat);
    };
    const shellA = mkShell(2.6, 1, 0x22d3ee, 0.55);
    const shellB = mkShell(3.6, 0, 0x8b8cf8, 0.32);
    // glowing core nodes
    const coreNodeGeo = new THREE.IcosahedronGeometry(2.6, 1);
    const coreNodes = new THREE.Points(
      coreNodeGeo,
      new THREE.PointsMaterial({
        size: 0.5,
        map: sprite,
        color: 0x9af2ff,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    core.add(shellA, shellB, coreNodes);
    core.position.set(isSmall ? 0 : 5.2, isSmall ? 7.4 : 1.2, isSmall ? -2 : 0);
    core.scale.setScalar(isSmall ? 0.55 : 1);
    scene.add(core);

    // ---- interaction state ----
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let scrollY = window.scrollY || 0;

    const onMove = (e) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      scrollY = window.scrollY || 0;
    };
    const onResize = () => {
      camera.aspect = W() / H();
      camera.updateProjectionMatrix();
      renderer.setSize(W(), H());
    };

    if (!reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let raf;
    let running = true;

    const updateEdges = () => {
      const pos = pGeo.attributes.position.array;
      for (let e = 0; e < edges.length; e += 2) {
        const a = edges[e] * 3;
        const b = edges[e + 1] * 3;
        const o = e * 3;
        linePos[o] = pos[a];
        linePos[o + 1] = pos[a + 1];
        linePos[o + 2] = pos[a + 2];
        linePos[o + 3] = pos[b];
        linePos[o + 4] = pos[b + 1];
        linePos[o + 5] = pos[b + 2];
      }
      lGeo.attributes.position.needsUpdate = true;
    };

    const render = () => {
      const t = clock.getElapsedTime();

      // breathe the nodes
      const pos = pGeo.attributes.position.array;
      for (let i = 0; i < COUNT; i++) {
        pos[i * 3 + 1] = base[i * 3 + 1] + Math.sin(t * 0.6 + phase[i]) * 0.5;
        pos[i * 3] = base[i * 3] + Math.cos(t * 0.4 + phase[i]) * 0.35;
      }
      pGeo.attributes.position.needsUpdate = true;
      updateEdges();

      // parallax
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      field.rotation.y = t * 0.03 + mouse.x * 0.3;
      field.rotation.x = mouse.y * 0.18;

      core.rotation.y = t * 0.18 + mouse.x * 0.4;
      core.rotation.x = t * 0.12 + mouse.y * 0.25;
      const pulse = 1 + Math.sin(t * 1.2) * 0.04;
      shellA.scale.setScalar(pulse);
      coreNodes.scale.setScalar(pulse);

      // scroll dolly + fade the core as you leave the hero
      const sp = scrollY;
      camera.position.z = 16 + Math.min(sp / 120, 8);
      camera.position.y = -sp / 400;
      const coreFade = Math.max(0, 1 - sp / 700);
      shellA.material.opacity = 0.55 * coreFade;
      shellB.material.opacity = 0.32 * coreFade;
      coreNodes.material.opacity = 0.9 * coreFade;

      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      if (running) raf = requestAnimationFrame(render);
    };

    if (reduced) {
      // single static frame
      updateEdges();
      renderer.render(scene, camera);
    } else {
      raf = requestAnimationFrame(render);
    }

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!reduced && !running) {
        running = true;
        clock.start();
        raf = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      pGeo.dispose();
      pMat.dispose();
      lGeo.dispose();
      lMat.dispose();
      coreNodeGeo.dispose();
      shellA.geometry.dispose();
      shellA.material.dispose();
      shellB.geometry.dispose();
      shellB.material.dispose();
      coreNodes.material.dispose();
      sprite.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount)
        mount.removeChild(renderer.domElement);
    };
  }, [reduced]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-void-950">
      {/* deep-space gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_-10%,rgba(99,102,241,0.22),rgba(4,5,10,0)_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_85%_15%,rgba(34,211,238,0.12),rgba(4,5,10,0)_60%)]" />
      {/* grid floor */}
      <div className="data-floor absolute bottom-0 left-0 right-0 h-[55vh] opacity-60" />
      {/* webgl mount */}
      <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />
      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_120%_at_50%_50%,transparent_55%,rgba(4,5,10,0.85))]" />
    </div>
  );
}
