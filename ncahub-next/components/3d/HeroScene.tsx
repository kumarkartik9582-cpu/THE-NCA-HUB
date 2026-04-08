'use client'
import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { Float, Preload } from '@react-three/drei'
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

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.12;

    // Mouse-reactive distortion
    vec2 mouse = uMouse * 0.15;
    uv += mouse * (1.0 - length(uv - 0.5));

    // Layered noise — more octaves for richer texture
    float n1 = snoise(vec3(uv * 2.2, t));
    float n2 = snoise(vec3(uv * 4.8 + 0.5, t * 0.7));
    float n3 = snoise(vec3(uv * 9.0 + 1.1, t * 1.3));
    float n4 = snoise(vec3(uv * 16.0 + 2.3, t * 1.8));
    float n  = n1 * 0.45 + n2 * 0.28 + n3 * 0.17 + n4 * 0.10;

    // Radial vignette
    float dist = length(uv - 0.5) * 1.8;
    float vig  = 1.0 - smoothstep(0.3, 1.0, dist);

    // Base dark void
    vec3 col = vec3(0.008, 0.008, 0.018);

    // Gold vein highlights — more intense
    float vein = pow(max(n * 0.5 + 0.5, 0.0), 5.5);
    col += vec3(0.82, 0.68, 0.32) * vein * 0.28;

    // Deep indigo depth tints
    col += vec3(0.05, 0.02, 0.14) * (n * 0.5 + 0.5) * 0.45;

    // Subtle cyan accent for futuristic feel
    float accent = pow(max(n3 * 0.5 + 0.5, 0.0), 4.0);
    col += vec3(0.12, 0.18, 0.28) * accent * 0.08;

    // Energy pulse ring (mouse-centered)
    vec2 center = vec2(0.5) + uMouse * 0.08;
    float ring = abs(length(uv - center) - 0.25 - sin(t * 2.0) * 0.05);
    float ringGlow = smoothstep(0.02, 0.0, ring) * 0.15;
    col += vec3(0.82, 0.68, 0.32) * ringGlow;

    // Soft horizon glow
    float horizon = pow(1.0 - uv.y, 3.0) * 0.18;
    col += vec3(0.82, 0.68, 0.32) * horizon;

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

/* ─── Instanced Gold Particle Field — more particles ─────────────────────── */
const particleVert = /* glsl */ `
  attribute float aScale;
  attribute float aRandom;
  uniform float uTime;
  uniform vec2  uMouse;
  varying float vAlpha;

  void main() {
    vec3 pos = position;

    // Slow drift with more variation
    pos.x += sin(uTime * 0.18 + aRandom * 6.28) * 0.15;
    pos.y += cos(uTime * 0.22 + aRandom * 6.28) * 0.12;
    pos.z += sin(uTime * 0.15 + aRandom * 3.14) * 0.08;

    // Mouse parallax (foreground particles move more)
    float depth = smoothstep(-10.0, 10.0, position.z);
    pos.x += uMouse.x * depth * 0.3;
    pos.y += uMouse.y * depth * 0.2;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPos;

    float dist = -mvPos.z;
    gl_PointSize = aScale * (450.0 / dist);
    vAlpha = aScale * 0.65;
  }
`

const particleFrag = /* glsl */ `
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float a = 1.0 - smoothstep(0.4, 1.0, d);
    // Gold with slight warm variation
    gl_FragColor = vec4(0.92, 0.78, 0.44, a * vAlpha);
  }
`

function GoldParticleField({ count = 4500 }: { count?: number }) {
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
      positions[i * 3]     = (Math.random() - 0.5) * 28
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16
      scales[i]   = Math.random() * 1.8 + 0.2
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
    roughness: 0.04,
    emissive: new THREE.Color('#5A3A08'),
    emissiveIntensity: 0.35,
    envMapIntensity: 2.8,
  }), [])

  const darkGoldMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#9E7B30'),
    metalness: 0.95,
    roughness: 0.12,
    emissive: new THREE.Color('#3A2A06'),
    emissiveIntensity: 0.25,
    envMapIntensity: 2.2,
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

      {/* Additional — wireframe dodecahedron far background */}
      <Float speed={0.4} rotationIntensity={0.08} floatIntensity={0.15}>
        <mesh position={[4.0, 2.5, -5.5]}>
          <dodecahedronGeometry args={[1.2]} />
          <meshStandardMaterial
            color="#F0D878"
            metalness={0.85}
            roughness={0.15}
            wireframe
            transparent
            opacity={0.1}
          />
        </mesh>
      </Float>
    </>
  )
}

/* ─── Holographic Grid Floor ─────────────────────────────────────────────── */
function HoloGrid() {
  const matRef = useRef<THREE.ShaderMaterial>(null!)

  const gridVert = /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const gridFrag = /* glsl */ `
    precision highp float;
    uniform float uTime;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv * 20.0;
      vec2 grid = abs(fract(uv - 0.5) - 0.5);
      float line = min(grid.x, grid.y);
      float g = 1.0 - smoothstep(0.0, 0.04, line);

      // Fade at edges
      float fade = smoothstep(0.0, 0.15, vUv.y) * (1.0 - smoothstep(0.85, 1.0, vUv.y));
      fade *= smoothstep(0.0, 0.2, vUv.x) * (1.0 - smoothstep(0.8, 1.0, vUv.x));

      // Scan line moving across
      float scan = smoothstep(0.0, 0.01, abs(vUv.y - fract(uTime * 0.08)));
      scan = 1.0 - (1.0 - scan) * 0.5;

      float alpha = g * fade * scan * 0.12;
      gl_FragColor = vec4(0.82, 0.68, 0.32, alpha);
    }
  `

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), [])

  useFrame((state) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <mesh rotation={[-Math.PI * 0.45, 0, 0]} position={[0, -3.5, -3]}>
      <planeGeometry args={[30, 20]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={gridVert}
        fragmentShader={gridFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

/* ─── Energy Ring ────────────────────────────────────────────────────────── */
function EnergyRing() {
  const ringRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (!ringRef.current) return
    const t = state.clock.elapsedTime
    ringRef.current.rotation.x = t * 0.05
    ringRef.current.rotation.z = t * 0.03
    ringRef.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.05)
  })

  return (
    <Float speed={0.3} rotationIntensity={0.05} floatIntensity={0.1}>
      <mesh ref={ringRef} position={[0, 0, -2]}>
        <torusGeometry args={[3.5, 0.015, 16, 128]} />
        <meshStandardMaterial
          color="#F0D878"
          emissive="#C9A84C"
          emissiveIntensity={0.8}
          metalness={1}
          roughness={0}
          transparent
          opacity={0.2}
        />
      </mesh>
    </Float>
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
      <pointLight position={[6, 6, 4]}  color="#F0D878" intensity={3.5} />
      <pointLight position={[-6, -4, -2]} color="#C9A84C" intensity={2.5} />
      <pointLight position={[0, 10, 2]} color="#ffffff"  intensity={0.6} />

      <NebulaBG />
      <GoldParticleField />
      <GoldObjects />
      <HoloGrid />
      <EnergyRing />
      <CameraController />

      <EffectComposer multisampling={0}>
        <Bloom
          luminanceThreshold={0.5}
          luminanceSmoothing={0.015}
          intensity={1.6}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.001, 0.001)}
        />
        <Vignette
          offset={0.25}
          darkness={0.75}
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
          antialias: false,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={[1, 1.5]}
        shadows={false}
      >
        <Scene />
        <Preload all />
      </Canvas>
    </div>
  )
}
