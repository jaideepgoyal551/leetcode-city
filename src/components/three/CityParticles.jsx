/**
 * CityParticles — floating neon particles for atmosphere.
 * Represents submission activity and energy of the city.
 */
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function CityParticles({ count = 600, streak = 0 }) {
  const meshRef = useRef()

  const { positions, colors, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const speeds = new Float32Array(count)

    const palette = [
      new THREE.Color('#00f5d4'),
      new THREE.Color('#ff2d9b'),
      new THREE.Color('#7b2fff'),
      new THREE.Color('#ffaa00'),
    ]

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 5 + Math.random() * 90
      positions[i * 3 + 0] = Math.cos(angle) * radius
      positions[i * 3 + 1] = Math.random() * 60
      positions[i * 3 + 2] = Math.sin(angle) * radius

      const col = palette[Math.floor(Math.random() * palette.length)]
      colors[i * 3 + 0] = col.r
      colors[i * 3 + 1] = col.g
      colors[i * 3 + 2] = col.b

      speeds[i] = 0.5 + Math.random() * 1.5
    }

    return { positions, colors, speeds }
  }, [count])

  const geomRef = useRef()

  useFrame(({ clock }) => {
    if (!geomRef.current) return
    const pos = geomRef.current.attributes.position
    const t = clock.getElapsedTime()

    for (let i = 0; i < count; i++) {
      pos.array[i * 3 + 1] += 0.02 * speeds[i]
      if (pos.array[i * 3 + 1] > 65) {
        pos.array[i * 3 + 1] = 0
      }
      // Slight drift
      pos.array[i * 3 + 0] += Math.sin(t * 0.5 + i) * 0.005
      pos.array[i * 3 + 2] += Math.cos(t * 0.4 + i) * 0.005
    }
    pos.needsUpdate = true
  })

  const intensity = 0.4 + (streak / 100) * 0.6

  return (
    <points>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.25}
        vertexColors
        transparent
        opacity={intensity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}
