/**
 * CityScene — main R3F Canvas that composes all 3D elements.
 * Uses Suspense for lazy loading heavy resources.
 */
import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor, AdaptiveDpr } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import * as THREE from 'three'

import CameraController from './three/CameraController'
import CityEnvironment from './three/CityEnvironment'
import CityGround from './three/CityGround'
import BuildingInstances from './three/BuildingInstances'
import ContestTower from './three/ContestTower'
import DistrictZones from './three/DistrictZones'
import CityParticles from './three/CityParticles'
import useCityStore from '../store/useCityStore'

function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom
        intensity={1.2}
        luminanceThreshold={0.3}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <ChromaticAberration offset={[0.0005, 0.0005]} />
    </EffectComposer>
  )
}

function CityContent({ cityData }) {
  const selectBuilding = useCityStore(s => s.selectBuilding)

  return (
    <>
      <CameraController />
      <CityEnvironment />
      <CityGround />

      <DistrictZones zones={cityData.districtZones} />
      <BuildingInstances buildings={cityData.buildings} />
      <CityParticles count={500} streak={cityData.stats.streak} />

      <ContestTower
        tower={cityData.tower}
        onClick={selectBuilding}
        isSelected={false}
      />

      <PostProcessing />
    </>
  )
}

export default function CityScene() {
  const cityData = useCityStore(s => s.cityData)

  if (!cityData) return null

  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [80, 60, 80], fov: 55, near: 0.5, far: 1000 }}
        shadows
        gl={{
          antialias: false, // disabled for performance (postprocessing adds AA)
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
          depth: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.4,
        }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <AdaptiveDpr pixelated />
        <PerformanceMonitor
          onDecline={() => console.log('Performance degraded — reducing quality')}
        />
        <Suspense fallback={null}>
          <CityContent cityData={cityData} />
        </Suspense>
      </Canvas>
    </div>
  )
}
