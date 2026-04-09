'use client'
import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { Preload } from '@react-three/drei'
import * as THREE from 'three'
import { BlendFunction } from 'postprocessing'

/* ─── Dark Nebula Background Shader (simplified — 3 octaves) ─────────────── */
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

    // 3-octave layered noise (removed 4th for perf)
    float n1 = snoise(vec3(uv * 2.2, t));
    float n2 = snoise(vec3(uv * 4.8 + 0.5, t * 0.7));
    float n3 = snoise(vec3(uv * 9.0 + 1.1, t * 1.3));
    float n  = n1 * 0.5 + n2 * 0.32 + n3 * 0.18;

    // Radial vignette
    float dist = length(uv - 0.5) * 1.8;
    float vig  = 1.0 - smoothstep(0.3, 1.0, dist);

    // Base dark void
    vec3 col = vec3(0.008, 0.008, 0.018);

    // Gold vein highlights
    float vein = pow(max(n * 0.5 + 0.5, 0.0), 5.5);
    col += vec3(0.82, 0.68, 0.32) * vein * 0.28;

    // Deep indigo depth tints
    col += vec3(0.05, 0.02, 0.14) * (n * 0.5 + 0.5) * 0.45;

    // Soft horizon glow
    float horizon = pow(1.0 - uv.y, 3.0) * 0.18;
    col += vec3(0.82, 0.68, 0.32) * horizon;

    col *= vig;
    gl_FragColor = vec4(col, 1.0);
  }
`

function NebulaBG() {
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
    matRef.current.uniforms.uMouse.value.set(mouse.current.x, mouse.current.y)
  })

  const uniforms = useMemo(() => ({
    uTime:  { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
  }), [])

  return (
    <mesh position={[0, 0, -6]}>
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
    pos.x += sin(uTime * 0.18 + aRandom * 6.28) * 0.15;
    pos.y += cos(uTime * 0.22 + aRandom * 6.28) * 0.12;
    pos.z += sin(uTime * 0.15 + aRandom * 3.14) * 0.08;

    float depth = smoothstep(-10.0, 10.0, position.z);
    pos.x += uMouse.x * depth * 0.3;
    pos.y += uMouse.y * depth * 0.2;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPos;
    gl_PointSize = aScale * (450.0 / -mvPos.z);
    vAlpha = aScale * 0.65;
  }
`

const particleFrag = /* glsl */ `
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float a = 1.0 - smoothstep(0.4, 1.0, d);
    gl_FragColor = vec4(0.92, 0.78, 0.44, a * vAlpha);
  }
`

function GoldParticleField({ count = 2000 }: { count?: number }) {
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
      positions[i * 3]     = (Math.random() - 0.5) * 28
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16
      scales[i]   = Math.random() * 1.8 + 0.2
      randoms[i]  = Math.random()
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
    matRef.current.uniforms.uMouse.value.set(mouse.current.x, mouse.current.y)
  })

  return (
    <points>
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

/* ─── Scene (simplified: nebula + particles + camera only) ────────────────── */
function Scene() {
  return (
    <>
      <NebulaBG />
      <GoldParticleField />
      <CameraController />

      <EffectComposer multisampling={0}>
        <Bloom
          luminanceThreshold={0.55}
          luminanceSmoothing={0.02}
          intensity={0.8}
          mipmapBlur
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
