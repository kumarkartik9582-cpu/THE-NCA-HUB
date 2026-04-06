'use client'
import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { Float, Environment, Preload } from '@react-three/drei'
import * as THREE from 'three'
import { BlendFunction } from 'postprocessing'

/* ─── Dark Nebula Background Shader ──────────────────────────────────────── */
const nebulaVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const nebulaFrag = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;

  // --- Noise helpers ---------------------------------------------------------
  vec3 mod289(vec3 x){return x - floor(x*(1./289.))*289.;}
  vec4 mod289(vec4 x){return x - floor(x*(1./289.))*289.;}
  vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1./6.,1./3.);
    const vec4 D=vec4(0.,0.5,1.,2.);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
    float n_=0.142857142857;
    vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.*x_);
    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.+1.;
    vec4 s1=floor(b1)*2.+1.;
    vec4 sh=-step(h,vec4(0.));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
    m=m*m;
    return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }
  // --------------------------------------------------------------------------

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.12;

    // Mouse-reactive distortion
    vec2 mouse = uMouse * 0.15;
    uv += mouse * (1.0 - length(uv - 0.5));

    // Layered noise
    float n1 = snoise(vec3(uv * 2.2, t));
    float n2 = snoise(vec3(uv * 4.8 + 0.5, t * 0.7));
    float n3 = snoise(vec3(uv * 9.0 + 1.1, t * 1.3));
    float n  = n1 * 0.55 + n2 * 0.30 + n3 * 0.15;

    // Radial vignette — darker at edges
    float dist = length(uv - 0.5) * 1.8;
    float vig  = 1.0 - smoothstep(0.3, 1.0, dist);

    // Base dark void colour
    vec3 col = vec3(0.008, 0.008, 0.016);

    // Gold vein highlights
    float vein = pow(max(n * 0.5 + 0.5, 0.0), 6.0);
    col += vec3(0.79, 0.66, 0.30) * vein * 0.22;

    // Deep purple/indigo tints for depth
    col += vec3(0.05, 0.02, 0.12) * (n * 0.5 + 0.5) * 0.4;

    // Soft horizon glow at bottom
    float horizon = pow(1.0 - uv.y, 3.0) * 0.15;
    col += vec3(0.79, 0.66, 0.30) * horizon;

    col *= vig;
    gl_FragColor = vec4(col, 1.0);
  }
`

function NebulaBG() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const matRef = useRef<THREE.ShaderMaterial>(null!)
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame((state) => {
    if (!matRef.current) return
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime
    matRef.current.uniforms.uMouse.value = new THREE.Vector2(
      mouse.current.x, mouse.current.y
    )
  })

  const uniforms = useMemo(() => ({
    uTime:  { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
  }), [])

  return (
    <mesh ref={meshRef} position={[0, 0, -6]}>
      <planeGeometry args={[30, 18]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={nebulaVert}
        fragmentShader={nebulaFrag}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  )
}

/* ─── Instanced Gold Particle Field ──────────────────────────────────────── */
const particleVert = /* glsl */ `
  attribute float aScale;
  attribute float aRandom;
  uniform float uTime;
  uniform vec2  uMouse;
  varying float vAlpha;

  void main() {
    vec3 pos = position;

    // Slow drift
    pos.x += sin(uTime * 0.18 + aRandom * 6.28) * 0.12;
    pos.y += cos(uTime * 0.22 + aRandom * 6.28) * 0.10;
    pos.z += sin(uTime * 0.15 + aRandom * 3.14) * 0.06;

    // Mouse parallax offset (foreground particles move more)
    float depth = smoothstep(-10.0, 10.0, position.z);
    pos.x += uMouse.x * depth * 0.25;
    pos.y += uMouse.y * depth * 0.15;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPos;

    // Depth-attenuated point size
    float dist = -mvPos.z;
    gl_PointSize = aScale * (400.0 / dist);
    vAlpha = aScale * 0.6;
  }
`

const particleFrag = /* glsl */ `
  varying float vAlpha;
  void main() {
    // Soft circular sprite
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float a = 1.0 - smoothstep(0.5, 1.0, d);
    gl_FragColor = vec4(0.90, 0.76, 0.42, a * vAlpha);
  }
`

function GoldParticleField({ count = 3500 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null!)
  const matRef = useRef<THREE.ShaderMaterial>(null!)
  const mouse = useRef({ x: 0, y: 0 })
  const targetMouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      targetMouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      targetMouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const { positions, scales, randoms } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const randoms = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const r = Math.random()
      positions[i * 3]     = (Math.random() - 0.5) * 24
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14
      scales[i]   = Math.random() * 1.6 + 0.3
      randoms[i]  = r
    }
    return { positions, scales, randoms }
  }, [count])

  const uniforms = useMemo(() => ({
    uTime:  { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
  }), [])

  useFrame((state) => {
    if (!matRef.current) return
    mouse.current.x += (targetMouse.current.x - mouse.current.x) * 0.04
    mouse.current.y += (targetMouse.current.y - mouse.current.y) * 0.04
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime
    matRef.current.uniforms.uMouse.value = new THREE.Vector2(
      mouse.current.x, mouse.current.y
    )
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aRandom" args={[randoms, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={particleVert}
        fragmentShader={particleFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* ─── Gold Metallic Objects ───────────────────────────────────────────────── */
function GoldObjects() {
  const icoRef = useRef<THREE.Mesh>(null!)
  const ringRef = useRef<THREE.Mesh>(null!)
  const torusRef = useRef<THREE.Mesh>(null!)

  const goldMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#C9A84C'),
    metalness: 1.0,
    roughness: 0.05,
    emissive: new THREE.Color('#5A3A08'),
    emissiveIntensity: 0.3,
    envMapIntensity: 2.5,
  }), [])

  const darkGoldMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#9E7B30'),
    metalness: 0.95,
    roughness: 0.15,
    emissive: new THREE.Color('#3A2A06'),
    emissiveIntensity: 0.2,
    envMapIntensity: 2.0,
    wireframe: false,
  }), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (icoRef.current) {
      icoRef.current.rotation.x = t * 0.12
      icoRef.current.rotation.y = t * 0.09
    }
    if (ringRef.current) {
      ringRef.current.rotation.y = t * 0.07
      ringRef.current.rotation.x = Math.sin(t * 0.13) * 0.4
    }
    if (torusRef.current) {
      torusRef.current.rotation.z = t * 0.06
      torusRef.current.rotation.x = t * 0.04
    }
  })

  return (
    <>
      {/* Primary — refined icosahedron */}
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.6}>
        <mesh ref={icoRef} position={[3.2, 0.2, -1.5]} material={goldMat} castShadow>
          <icosahedronGeometry args={[1.05, 2]} />
        </mesh>
      </Float>

      {/* Secondary — large torus ring */}
      <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.4}>
        <mesh ref={ringRef} position={[-3.0, -0.4, -2.5]} material={darkGoldMat}>
          <torusGeometry args={[1.1, 0.18, 32, 80]} />
        </mesh>
      </Float>

      {/* Tertiary — small twisted knot */}
      <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.8}>
        <mesh ref={torusRef} position={[1.0, -2.2, -0.8]} material={goldMat}>
          <torusKnotGeometry args={[0.45, 0.12, 128, 24, 2, 3]} />
        </mesh>
      </Float>

      {/* Wireframe octahedron — background accent */}
      <Float speed={0.6} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh position={[-1.5, 2.0, -4.0]}>
          <octahedronGeometry args={[1.8]} />
          <meshStandardMaterial
            color="#C9A84C"
            metalness={0.9}
            roughness={0.1}
            wireframe
            transparent
            opacity={0.18}
          />
        </mesh>
      </Float>
    </>
  )
}

/* ─── Camera Controller ───────────────────────────────────────────────────── */
function CameraController() {
  const { camera, size } = useThree()
  const mouse = useRef({ x: 0, y: 0 })
  const targetMouse = useRef({ x: 0, y: 0 })
  const scrollRef = useRef(0)

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      targetMouse.current.x = (e.clientX / size.width - 0.5) * 2
      targetMouse.current.y = -(e.clientY / size.height - 0.5) * 2
    }
    const onScroll = () => { scrollRef.current = window.scrollY }
    window.addEventListener('mousemove', onMouse, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('scroll', onScroll)
    }
  }, [size])

  useFrame(() => {
    mouse.current.x += (targetMouse.current.x - mouse.current.x) * 0.04
    mouse.current.y += (targetMouse.current.y - mouse.current.y) * 0.04
    camera.position.x += (mouse.current.x * 0.4 - camera.position.x) * 0.05
    camera.position.y += (mouse.current.y * 0.25 - camera.position.y) * 0.05
    const targetZ = 5 + scrollRef.current * 0.003
    camera.position.z += (targetZ - camera.position.z) * 0.04
    camera.lookAt(0, 0, 0)
  })

  return null
}

/* ─── Scene ───────────────────────────────────────────────────────────────── */
function Scene() {
  return (
    <>
      <ambientLight color="#9E7B30" intensity={0.5} />
      <pointLight position={[6, 6, 4]}  color="#F0D878" intensity={3} />
      <pointLight position={[-6, -4, -2]} color="#C9A84C" intensity={2} />
      <pointLight position={[0, 10, 2]} color="#ffffff"  intensity={0.6} />
      <Environment preset="city" />

      <NebulaBG />
      <GoldParticleField />
      <GoldObjects />
      <CameraController />

      <EffectComposer multisampling={0}>
        <Bloom
          luminanceThreshold={0.6}
          luminanceSmoothing={0.02}
          intensity={1.4}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.0008, 0.0008)}
        />
        <Vignette
          offset={0.3}
          darkness={0.7}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </>
  )
}

/* ─── Export ──────────────────────────────────────────────────────────────── */
export default function HeroScene() {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 70 }}
        gl={{
          antialias: false,   // off for perf — post-processing handles AA
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={[1, 1.5]}        // cap at 1.5× — sweet spot quality/perf
        shadows={false}
      >
        <Scene />
        <Preload all />
      </Canvas>
    </div>
  )
}
