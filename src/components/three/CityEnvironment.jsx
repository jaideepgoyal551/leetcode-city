/**
 * CityEnvironment — skybox, fog, ambient lighting, stars, and rain mode.
 */
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars, Cloud } from '@react-three/drei'
import * as THREE from 'three'
import useCityStore from '../../store/useCityStore'

function RainDrops({ count = 300 }) {
  const meshRef = useRef()
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 200
    positions[i * 3 + 1] = Math.random() * 80
    positions[i * 3 + 2] = (Math.random() - 0.5) * 200
  }

  useFrame(() => {
    if (!meshRef.current) return
    const pos = meshRef.current.geometry.attributes.position
    for (let i = 0; i < count; i++) {
      pos.array[i * 3 + 1] -= 1.5
      if (pos.array[i * 3 + 1] < -2) pos.array[i * 3 + 1] = 80
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#aaddff" transparent opacity={0.4} />
    </points>
  )
}

export default function CityEnvironment() {
  const theme = useCityStore(s => s.theme)

  const fogColor = theme === 'day' ? '#1a1a3a' : '#050510'
  const fogNear = 60
  const fogFar = 220

  const ambientIntensity = theme === 'day' ? 0.4 : 0.12

  return (
    <>
      {/* Fog */}
      <fog attach="fog" args={[fogColor, fogNear, fogFar]} />

      {/* Ambient */}
      <ambientLight intensity={ambientIntensity} color="#1a1a4a" />

      {/* Key light (directional) */}
      <directionalLight
        position={[30, 60, 20]}
        intensity={theme === 'day' ? 1.2 : 0.3}
        color={theme === 'day' ? '#ffffff' : '#4466ff'}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={200}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />

      {/* Fill light */}
      <directionalLight
        position={[-30, 20, -30]}
        intensity={0.2}
        color="#ff2d9b"
      />

      {/* Stars */}
      <Stars
        radius={150}
        depth={60}
        count={theme === 'day' ? 500 : 3000}
        factor={4}
        saturation={0.8}
        fade
        speed={0.5}
      />

      {/* Rain */}
      {theme === 'rain' && <RainDrops />}
    </>
  )
}
