'use client'
import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Environment, Float } from '@react-three/drei'
import * as THREE from 'three'

// Particle field
function GoldParticles({ count = 5000 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null!)
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return pos
  }, [count])

  useFrame((state) => {
    if (!mesh.current) return
    mesh.current.rotation.y = state.clock.elapsedTime * 0.03
    mesh.current.rotation.x = state.clock.elapsedTime * 0.01
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color={new THREE.Color('#C9A84C')}
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  )
}

// Gold floating meshes
function GoldMesh() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const torusRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.15
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
    if (torusRef.current) {
      torusRef.current.rotation.x = state.clock.elapsedTime * 0.08
      torusRef.current.rotation.z = state.clock.elapsedTime * 0.05
    }
  })

  const goldMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#C9A84C'),
    metalness: 0.95,
    roughness: 0.08,
    emissive: new THREE.Color('#4E3A14'),
    emissiveIntensity: 0.15,
  }), [])

  return (
    <>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
        <mesh ref={meshRef} position={[2.5, 0, -2]} material={goldMat}>
          <icosahedronGeometry args={[1, 1]} />
        </mesh>
      </Float>
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh ref={torusRef} position={[-2.5, 0.5, -3]} material={goldMat}>
          <torusKnotGeometry args={[0.6, 0.2, 128, 32]} />
        </mesh>
      </Float>
    </>
  )
}

// Scene wrapper with mouse parallax + scroll-driven camera
function Scene() {
  const { camera, size } = useThree()
  const mouse = useRef({ x: 0, y: 0 })
  const targetMouse = useRef({ x: 0, y: 0 })
  const scrollRef = useRef(0)

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      targetMouse.current.x = (e.clientX / size.width - 0.5) * 2
      targetMouse.current.y = -(e.clientY / size.height - 0.5) * 2
    }
    const onScroll = () => {
      scrollRef.current = window.scrollY
    }
    window.addEventListener('mousemove', onMouse, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('scroll', onScroll)
    }
  }, [size])

  useFrame(() => {
    // Smooth lerp towards mouse target
    mouse.current.x += (targetMouse.current.x - mouse.current.x) * 0.05
    mouse.current.y += (targetMouse.current.y - mouse.current.y) * 0.05

    // Camera parallax tilt (2-3° range)
    camera.position.x = mouse.current.x * 0.3
    camera.position.y = mouse.current.y * 0.2

    // Scroll-driven zoom-out
    const targetZ = 5 + scrollRef.current * 0.004
    camera.position.z += (targetZ - camera.position.z) * 0.05

    camera.lookAt(0, 0, 0)
  })

  return (
    <>
      <ambientLight color={new THREE.Color('#9E7B30')} intensity={0.4} />
      <pointLight position={[5, 5, 5]} color={new THREE.Color('#F0D878')} intensity={2} />
      <pointLight position={[-5, -3, -2]} color={new THREE.Color('#C9A84C')} intensity={1.5} />
      <pointLight position={[0, 8, 0]} color={new THREE.Color('#ffffff')} intensity={0.5} />
      <Environment preset="city" />
      <GoldParticles />
      <GoldMesh />
      <EffectComposer>
        <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.025} intensity={1.2} />
      </EffectComposer>
    </>
  )
}

export default function HeroScene() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
