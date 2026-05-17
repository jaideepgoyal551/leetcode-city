/**
 * DistrictZones — holographic district boundary rings + labels.
 */
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Ring, Text } from '@react-three/drei'
import * as THREE from 'three'
import useCityStore from '../../store/useCityStore'

function DistrictRing({ district }) {
  const meshRef = useRef()
  const { center, color, radius, name, problems } = district

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.material.opacity = 0.12 + Math.sin(clock.getElapsedTime() * 0.8 + center[0]) * 0.05
    }
  })

  if (!problems || problems === 0) return null

  return (
    <group position={center}>
      {/* Ground ring */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[radius - 0.5, radius, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} depthWrite={false} />
      </mesh>

      {/* Fill area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[radius, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.03} depthWrite={false} />
      </mesh>

      {/* District label */}
      <Html
        position={[0, 0.5, -radius + 2]}
        center
        distanceFactor={100}
        style={{ pointerEvents: 'none' }}
      >
        <div style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 9,
          fontWeight: 600,
          color: color,
          textShadow: `0 0 10px ${color}`,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          background: 'rgba(5,5,16,0.6)',
          padding: '2px 8px',
          borderRadius: 4,
          border: `1px solid ${color}40`,
          whiteSpace: 'nowrap',
        }}>
          {name} · {problems}
        </div>
      </Html>
    </group>
  )
}

export default function DistrictZones({ zones }) {
  const showDistricts = useCityStore(s => s.showDistricts)
  if (!showDistricts) return null

  return (
    <group>
      {zones.map(zone => (
        <DistrictRing key={zone.key} district={zone} />
      ))}
    </group>
  )
}
