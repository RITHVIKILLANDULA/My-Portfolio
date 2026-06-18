import { useEffect, useMemo, useRef } from "react";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { SNOISE, CURL } from "./glsl/snoise.glsl";
import { DROPLET_VERT } from "./glsl/droplet.vert";
import { DROPLET_FRAG } from "./glsl/droplet.frag";

const DropletMaterial = shaderMaterial(
  {
    uTime: 0,
    uResolve: 0.62,
    uAmp: 0.2,
    uFreq: 0.85,
    uFlowSpeed: 0.16,
    uMouseDir: new THREE.Vector3(99, 99, 99),
    uMouseStrength: 0,
    uChurn: 0,
    uPulse: 0,
    uPulseT: 0,
    uFacet: 0,
    uOpacity: 0,
  },
  SNOISE + CURL + DROPLET_VERT,
  DROPLET_FRAG
);
extend({ DropletMaterial });

const damp = (a, b, l, dt) => a + (b - a) * (1 - Math.exp(-l * dt));
const clamp = THREE.MathUtils.clamp;

function scrollProgress() {
  if (window.lenis && typeof window.lenis.progress === "number") return window.lenis.progress;
  const h = document.documentElement.scrollHeight - window.innerHeight;
  return h > 0 ? clamp(window.scrollY / h, 0, 1) : 0;
}

const POS = [1.15, 0.05, 0];
const SCALE = 1.5;

export default function DistillationField({ detail = 48, reduced = false, interactive = true }) {
  const mat = useRef();
  const { camera } = useThree();

  const refs = useMemo(
    () => ({
      mouseNDC: new THREE.Vector2(0, 0),
      mouseTarget: new THREE.Vector2(0, 0),
      strength: { v: 0 },
      churn: { v: 0, t: 0 },
      pulse: { v: 0 },
      plane: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
      ray: new THREE.Raycaster(),
      hit: new THREE.Vector3(),
    }),
    []
  );

  useEffect(() => {
    if (reduced) return;
    const onMove = (e) => {
      refs.mouseTarget.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
      refs.strength.v = 1;
    };
    const onChurn = (e) => { refs.churn.t = typeof e.detail === "number" ? e.detail : 0; };
    const onRag = () => { refs.pulse.v = 1; };
    if (interactive) window.addEventListener("pointermove", onMove);
    window.addEventListener("ri:churn", onChurn);
    window.addEventListener("ri:rag", onRag);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("ri:churn", onChurn);
      window.removeEventListener("ri:rag", onRag);
    };
  }, [reduced, interactive, refs]);

  useFrame((_, dt) => {
    const m = mat.current;
    if (!m) return;
    const d = Math.min(dt, 0.05);

    if (!reduced) m.uTime += d;

    const p = scrollProgress();
    // chaos -> calm as you scroll off the hero into the statement band
    const target = reduced ? 0.32 : clamp(0.62 - (p / 0.22) * 0.5, 0.1, 0.62);
    m.uResolve = damp(m.uResolve, target, 2.5, d);

    // full presence in the hero, then recede to a faint ghost so text stays crisp
    const opTarget = clamp(1.0 - ((p - 0.08) / 0.14) * 0.66, 0.34, 1.0);
    m.uOpacity = damp(m.uOpacity, opTarget, 3, d);

    if (!reduced && interactive) {
      refs.mouseNDC.lerp(refs.mouseTarget, 0.08);
      refs.ray.setFromCamera(refs.mouseNDC, camera);
      refs.ray.ray.intersectPlane(refs.plane, refs.hit);
      m.uMouseDir.set(
        (refs.hit.x - POS[0]) / SCALE,
        (refs.hit.y - POS[1]) / SCALE,
        refs.hit.z / SCALE
      );
      refs.strength.v = damp(refs.strength.v, 0, 1.2, d);
      m.uMouseStrength = refs.strength.v * 0.9;
    }

    refs.churn.v = damp(refs.churn.v, refs.churn.t, 2, d);
    m.uChurn = refs.churn.v;

    if (refs.pulse.v > 0.001) {
      refs.pulse.v = damp(refs.pulse.v, 0, 1.6, d);
      m.uPulse = refs.pulse.v;
      m.uPulseT += d;
    }
  });

  return (
    <group position={POS} scale={SCALE}>
      <mesh>
        <icosahedronGeometry args={[1, detail]} />
        <dropletMaterial ref={mat} transparent depthWrite={true} />
      </mesh>
    </group>
  );
}
