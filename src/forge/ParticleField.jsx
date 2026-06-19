import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Ambient cinematic bokeh — two layers of additive, soft, drifting embers that
 * rise like sparks off a forge, with gentle mouse parallax. Vanilla three.js,
 * transparent, pointer-events:none, self-cleaning. Pauses when off-screen.
 */
function emberSprite() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.6)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

const PALETTE = [
  new THREE.Color("#ffd9a8"),
  new THREE.Color("#ffb061"),
  new THREE.Color("#ff7a2f"),
  new THREE.Color("#fff2e0"),
];
const pick = () => PALETTE[Math.floor(Math.random() * PALETTE.length)];

export default function ParticleField() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let W = mount.clientWidth || window.innerWidth;
    let H = mount.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;";
    mount.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 200);
    camera.position.z = 9;
    const scene = new THREE.Scene();
    const tex = emberSprite();

    function makeLayer(count, range, size, opacity, baseSpeed) {
      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);
      const spd = new Float32Array(count);
      const off = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * range[0];
        pos[i * 3 + 1] = (Math.random() - 0.5) * range[1];
        pos[i * 3 + 2] = (Math.random() - 0.5) * range[2];
        const c = pick();
        col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
        spd[i] = Math.random() * baseSpeed + baseSpeed * 0.3;
        off[i] = Math.random() * Math.PI * 2;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
      const mat = new THREE.PointsMaterial({
        size, map: tex, vertexColors: true, transparent: true, opacity,
        depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
      });
      const points = new THREE.Points(geo, mat);
      scene.add(points);
      return { geo, mat, pos, spd, off, count };
    }

    const l1 = makeLayer(70, [18, 11, 5], 0.08, 0.7, 0.4);
    const l2 = makeLayer(24, [16, 10, 3], 0.6, 0.14, 0.16);

    const mouse = { x: 0, y: 0 };
    const cam = { x: 0, y: 0 };
    const onMove = (e) => {
      const r = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      mouse.y = -((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);

    let visible = true;
    const io = new IntersectionObserver((es) => { visible = es[0].isIntersecting; }, { threshold: 0 });
    io.observe(mount);

    let last = performance.now();
    let elapsed = 0;
    let raf;
    const drift = (L, dt, t, sx) => {
      for (let i = 0; i < L.count; i++) {
        L.pos[i * 3 + 1] += L.spd[i] * dt * 0.7;
        L.pos[i * 3] += Math.sin(t * L.spd[i] * 0.7 + L.off[i]) * dt * sx;
        if (L.pos[i * 3 + 1] > 6) L.pos[i * 3 + 1] = -6;
      }
      L.geo.attributes.position.needsUpdate = true;
    };
    function tick() {
      raf = requestAnimationFrame(tick);
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visible) return;
      elapsed += dt;
      const t = elapsed;
      cam.x += (mouse.x * 0.55 - cam.x) * 0.05;
      cam.y += (mouse.y * 0.32 - cam.y) * 0.05;
      camera.position.x = cam.x;
      camera.position.y = cam.y;
      drift(l1, dt, t, 0.12);
      drift(l2, dt, t, 0.09);
      renderer.render(scene, camera);
    }
    tick();

    const ro = new ResizeObserver(() => {
      W = mount.clientWidth; H = mount.clientHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    });
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("mousemove", onMove);
      l1.geo.dispose(); l1.mat.dispose();
      l2.geo.dispose(); l2.mat.dispose();
      tex.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="pointer-events-none absolute inset-0" style={{ zIndex: 0 }} />;
}
