/**
 * ContestTower — the central landmark representing contest rating.
 * Uses custom holographic shader with animated rings and glow.
 */
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

export default function ContestTower({ tower, onClick, isSelected }) {
  const groupRef = useRef()
  const ringRefs = useRef([])
  const glowRef = useRef()

  const { height, width, rating, rings, badge, position } = tower

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Slow rotation
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.08
    }

    // Spin rings at different speeds
    ringRefs.current.forEach((ring, i) => {
      if (ring) ring.rotation.y = t * (0.3 + i * 0.15) * (i % 2 === 0 ? 1 : -1)
    })

    // Pulse glow
    if (glowRef.current) {
      glowRef.current.intensity = 3 + Math.sin(t * 2) * 1.5
    }
  })

  const ringHeights = useMemo(() => {
    return Array.from({ length: Math.max(1, Math.min(rings, 6)) }, (_, i) =>
      height * ((i + 1) / (rings + 1))
    )
  }, [height, rings])

  const towerColor = useMemo(() => {
    if (rating >= 2400) return '#ff2d9b'
    if (rating >= 2000) return '#ffaa00'
    if (rating >= 1600) return '#00f5d4'
    return '#7b2fff'
  }, [rating])

  return (
    <group position={[0, 0, 0]}>
      {/* Tower body */}
      <group ref={groupRef}>
        {/* Main spire */}
        <mesh
          castShadow
          receiveShadow
          position={[0, height / 2, 0]}
          onClick={(e) => { e.stopPropagation(); onClick(tower) }}
        >
          <boxGeometry args={[width, height, width, 2, 8, 2]} />
          <MeshDistortMaterial
            color={towerColor}
            emissive={towerColor}
            emissiveIntensity={isSelected ? 1.2 : 0.6}
            metalness={0.8}
            roughness={0.1}
            distort={0.05}
            speed={2}
            transparent
            opacity={0.95}
          />
        </mesh>

        {/* Antenna tip */}
        <mesh position={[0, height + 4, 0]}>
          <coneGeometry args={[0.3, 8, 8]} />
          <meshStandardMaterial
            color={towerColor}
            emissive={towerColor}
            emissiveIntensity={1.5}
          />
        </mesh>

        {/* Horizontal rings */}
        {ringHeights.map((y, i) => (
          <mesh
            key={i}
            ref={el => { ringRefs.current[i] = el }}
            position={[0, y, 0]}
          >
            <torusGeometry args={[width * 1.2 + i * 0.3, 0.15, 8, 32]} />
            <meshStandardMaterial
              color={towerColor}
              emissive={towerColor}
              emissiveIntensity={1}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}

        {/* Base plinth */}
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[width * 2, width * 2.5, 1.2, 8]} />
          <meshStandardMaterial
            color="#0d0d1a"
            emissive={towerColor}
            emissiveIntensity={0.3}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Glow light at tower top */}
      <pointLight
        ref={glowRef}
        position={[0, height + 2, 0]}
        color={towerColor}
        intensity={4}
        distance={40}
        decay={2}
      />

      {/* Ground glow */}
      <pointLight
        position={[0, 1, 0]}
        color={towerColor}
        intensity={2}
        distance={20}
        decay={2}
      />

      {/* Label */}
      <Html
        position={[0, height + 10, 0]}
        center
        distanceFactor={80}
        style={{ pointerEvents: 'none' }}
      >
        <div style={{
          background: 'rgba(5,5,16,0.9)',
          border: `1px solid ${towerColor}`,
          borderRadius: 6,
          padding: '4px 10px',
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 10,
          color: towerColor,
          whiteSpace: 'nowrap',
          textShadow: `0 0 8px ${towerColor}`,
          boxShadow: `0 0 12px ${towerColor}40`,
        }}>
          ⚡ {rating} RATING
          {badge && <span style={{ marginLeft: 6, opacity: 0.7 }}>· {badge}</span>}
        </div>
      </Html>
    </group>
  )
}
