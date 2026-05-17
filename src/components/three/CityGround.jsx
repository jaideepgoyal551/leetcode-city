/**
 * CityGround — animated grid floor with pulsing outward rings.
 */
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { groundVertexShader, groundFragmentShader } from '../../shaders/CityShaders'

export default function CityGround() {
  const matRef = useRef()

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.getElapsedTime()
    }
  })

  const uniforms = {
    uTime: { value: 0 },
    uGridColor: { value: new THREE.Color('#00f5d4') },
  }

  return (
    <group>
      {/* Main ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[300, 300, 1, 1]} />
        <meshStandardMaterial color="#050510" roughness={0.95} metalness={0.05} />
      </mesh>

      {/* Animated grid overlay */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[300, 300, 1, 1]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={groundVertexShader}
          fragmentShader={groundFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </mesh>

      {/* Reflective center disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[18, 64]} />
        <meshStandardMaterial
          color="#0d0d1a"
          metalness={0.95}
          roughness={0.05}
          envMapIntensity={0.5}
        />
      </mesh>
    </group>
  )
}
