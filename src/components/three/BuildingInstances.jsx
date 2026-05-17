/**
 * BuildingInstances — renders all city buildings using THREE.InstancedMesh
 * for maximum GPU performance (supports 10,000+ buildings at 60fps).
 *
 * Separate InstancedMesh per difficulty tier for material flexibility.
 */
import { useRef, useEffect, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import useCityStore from '../../store/useCityStore'

// ─── Single building mesh (for hover/selection, rendered on top of instanced) ─

function SelectedBuilding({ building }) {
  const meshRef = useRef()
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.material.emissiveIntensity = 0.8 + Math.sin(clock.getElapsedTime() * 4) * 0.4
    }
  })
  if (!building) return null
  const [x, y, z] = building.position
  return (
    <mesh ref={meshRef} position={[x, y, z]} castShadow>
      <boxGeometry args={[building.width, building.height, building.width]} />
      <meshStandardMaterial
        color={building.color}
        emissive={building.emissive}
        emissiveIntensity={1.2}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  )
}

// ─── Instanced renderer for one difficulty tier ────────────────────────────

function BuildingTier({ buildings, color, emissive, onHover, onClick }) {
  const meshRef = useRef()
  const hoverRef = useRef(new Set())
  const selectedBuilding = useCityStore(s => s.selectedBuilding)

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useEffect(() => {
    if (!meshRef.current || buildings.length === 0) return
    buildings.forEach((bld, i) => {
      const [x, y, z] = bld.position
      dummy.position.set(x, y, z)
      dummy.scale.set(bld.width, bld.height, bld.width)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [buildings, dummy])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    // Animate emissive of whole material slightly
    meshRef.current.material.emissiveIntensity =
      0.4 + Math.sin(t * 0.8) * 0.05
  })

  if (buildings.length === 0) return null

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, buildings.length]}
      castShadow
      receiveShadow
      onPointerMove={(e) => {
        e.stopPropagation()
        const idx = e.instanceId
        if (idx !== undefined && buildings[idx]) {
          onHover(buildings[idx], e.point)
        }
      }}
      onPointerOut={() => onHover(null, null)}
      onClick={(e) => {
        e.stopPropagation()
        const idx = e.instanceId
        if (idx !== undefined && buildings[idx]) onClick(buildings[idx])
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={0.45}
        metalness={0.7}
        roughness={0.3}
      />
    </instancedMesh>
  )
}

// ─── Floating Tooltip ─────────────────────────────────────────────────────

function BuildingTooltip({ building, point }) {
  if (!building || !point) return null
  const label = {
    easy: { text: 'EASY', color: '#00f5d4' },
    medium: { text: 'MEDIUM', color: '#ffaa00' },
    hard: { text: 'HARD', color: '#ff2d9b' },
  }[building.difficulty] || { text: 'BUILDING', color: '#fff' }

  return (
    <Html
      position={[point.x, point.y + 3, point.z]}
      center
      style={{ pointerEvents: 'none', zIndex: 100 }}
      distanceFactor={60}
    >
      <div className="tooltip-enter" style={{
        background: 'rgba(5,5,16,0.92)',
        border: `1px solid ${label.color}`,
        borderRadius: 6,
        padding: '6px 12px',
        fontFamily: 'Orbitron, sans-serif',
        fontSize: 9,
        color: label.color,
        whiteSpace: 'nowrap',
        textShadow: `0 0 8px ${label.color}`,
        boxShadow: `0 0 16px ${label.color}30`,
        minWidth: 90,
        textAlign: 'center',
      }}>
        <div style={{ fontWeight: 700, letterSpacing: '0.1em' }}>{label.text}</div>
        <div style={{ color: '#888', fontSize: 8, marginTop: 2 }}>
          h:{building.height.toFixed(1)} · {building.district}
        </div>
      </div>
    </Html>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────

export default function BuildingInstances({ buildings }) {
  const [hovered, setHovered] = useState(null)
  const [hoverPoint, setHoverPoint] = useState(null)
  const selectBuilding = useCityStore(s => s.selectBuilding)
  const selectedBuilding = useCityStore(s => s.selectedBuilding)

  const easy = useMemo(() => buildings.filter(b => b.difficulty === 'easy'), [buildings])
  const medium = useMemo(() => buildings.filter(b => b.difficulty === 'medium'), [buildings])
  const hard = useMemo(() => buildings.filter(b => b.difficulty === 'hard'), [buildings])

  const handleHover = (building, point) => {
    setHovered(building)
    setHoverPoint(point)
    document.body.style.cursor = building ? 'pointer' : 'auto'
  }

  const handleClick = (building) => {
    selectBuilding(building)
  }

  return (
    <group>
      <BuildingTier
        buildings={easy}
        color="#00f5d4"
        emissive="#00b89f"
        onHover={handleHover}
        onClick={handleClick}
      />
      <BuildingTier
        buildings={medium}
        color="#ffaa00"
        emissive="#cc7700"
        onHover={handleHover}
        onClick={handleClick}
      />
      <BuildingTier
        buildings={hard}
        color="#ff2d9b"
        emissive="#cc005e"
        onHover={handleHover}
        onClick={handleClick}
      />

      {hovered && <BuildingTooltip building={hovered} point={hoverPoint} />}
      <SelectedBuilding building={selectedBuilding} />
    </group>
  )
}
