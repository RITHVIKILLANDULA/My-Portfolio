import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Edges, Float } from "@react-three/drei";
import {
  CORE_POS,
  PALETTE,
  buildCoreLayouts,
  sectionT,
} from "../../constants/world";
import { readProgress } from "../../state/scroll";

const VERT = /* glsl */ `
  uniform float uProgress;
  uniform float uSize;
  uniform float uTime;
  attribute vec3 aLattice;
  attribute vec3 aClassifier;
  attribute float aClass;
  varying float vClass;
  varying float vGlow;
  void main() {
    vClass = aClass;
    float s1 = smoothstep(0.0, 0.55, uProgress);
    float s2 = smoothstep(0.5, 1.0, uProgress);
    vec3 p = mix(position, aLattice, s1);
    p = mix(p, aClassifier, s2);
    p += 0.015 * sin(uTime * 1.4 + p.y * 6.0);
    vGlow = 0.45 + 0.55 * uProgress;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (340.0 / -mv.z);
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vClass;
  varying float vGlow;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = dot(c, c);
    if (d > 0.25) discard;
    float a = smoothstep(0.25, 0.0, d);
    vec3 col = mix(uColorA, uColorB, vClass);
    gl_FragColor = vec4(col * vGlow * 1.4, a);
  }
`;

export default function DataCore() {
  const cage = useRef();
  const shell = useRef();

  const geom = useMemo(() => {
    const L = buildCoreLayouts(950);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(L.cloud, 3));
    g.setAttribute("aLattice", new THREE.BufferAttribute(L.lattice, 3));
    g.setAttribute("aClassifier", new THREE.BufferAttribute(L.classifier, 3));
    g.setAttribute("aClass", new THREE.BufferAttribute(L.cls, 1));
    return g;
  }, []);

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uProgress: { value: 0 },
          uSize: { value: 6 },
          uTime: { value: 0 },
          uColorA: { value: new THREE.Color(PALETTE.indigo) },
          uColorB: { value: new THREE.Color(PALETTE.cyan) },
        },
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
      }),
    []
  );

  useFrame((state, dt) => {
    const cp = sectionT(readProgress(), 0.7, 1.0); // core charges as you arrive
    mat.uniforms.uProgress.value = cp;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    if (cage.current) {
      cage.current.rotation.y += dt * 0.25;
      cage.current.rotation.x += dt * 0.1;
    }
    if (shell.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.02;
      shell.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={CORE_POS}>
      <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.35}>
        {/* glass-ish faceted shell */}
        <mesh ref={shell}>
          <octahedronGeometry args={[2.3, 0]} />
          <meshStandardMaterial
            color="#1b2150"
            emissive={PALETTE.indigo}
            emissiveIntensity={0.18}
            roughness={0.55}
            metalness={0.2}
            transparent
            opacity={0.18}
            side={THREE.DoubleSide}
            flatShading
          />
          <Edges threshold={1} color="#aab6ff" />
        </mesh>

        {/* inner morphing data field */}
        <points geometry={geom} material={mat} />

        {/* counter-rotating ring cage */}
        <group ref={cage}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} rotation={[(i * Math.PI) / 3, i * 0.5, 0]}>
              <torusGeometry args={[2.8 + i * 0.16, 0.018, 8, 90]} />
              <meshStandardMaterial
                color={PALETTE.indigo}
                emissive={PALETTE.indigo}
                emissiveIntensity={0.85}
                toneMapped={false}
              />
            </mesh>
          ))}
        </group>
      </Float>

      {/* the core's own key light */}
      <pointLight color={PALETTE.indigo} intensity={1.6} distance={16} />
    </group>
  );
}
