/**
 * CameraController — smooth camera with orbit, keyboard nav, and cinematic fly-through.
 */
import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import useCityStore from '../../store/useCityStore'

// Cinematic waypoints for fly-through
const FLY_WAYPOINTS = [
  { pos: [0, 80, 120], target: [0, 10, 0], duration: 4 },
  { pos: [80, 40, 60], target: [0, 20, 0], duration: 4 },
  { pos: [-60, 25, -60], target: [0, 15, 0], duration: 4 },
  { pos: [10, 10, 20], target: [0, 40, 0], duration: 3 },
  { pos: [40, 15, -40], target: [-40, 5, 40], duration: 4 },
  { pos: [-20, 50, -80], target: [0, 0, 0], duration: 4 },
]

export default function CameraController() {
  const orbitRef = useRef()
  const { camera } = useThree()
  const flyMode = useCityStore(s => s.flyMode)
  const selectedBuilding = useCityStore(s => s.selectedBuilding)
  const setCamera = useCityStore(s => s.setCamera)

  const flyState = useRef({
    waypointIdx: 0,
    progress: 0,
    active: false,
  })

  const targetPos = useRef(new THREE.Vector3(80, 60, 80))
  const targetLook = useRef(new THREE.Vector3(0, 10, 0))
  const currentPos = useRef(new THREE.Vector3(80, 60, 80))
  const currentLook = useRef(new THREE.Vector3(0, 10, 0))

  // Focus on selected building
  useEffect(() => {
    if (selectedBuilding && !flyMode) {
      const [x, y, z] = selectedBuilding.position
      targetPos.current.set(x + 8, y + selectedBuilding.height * 0.5 + 5, z + 8)
      targetLook.current.set(x, y, z)
    }
  }, [selectedBuilding, flyMode])

  // Fly-through mode
  useEffect(() => {
    if (flyMode) {
      flyState.current = { waypointIdx: 0, progress: 0, active: true }
    } else {
      flyState.current.active = false
      targetPos.current.set(80, 60, 80)
      targetLook.current.set(0, 10, 0)
    }
  }, [flyMode])

  // Keyboard controls
  useEffect(() => {
    const keys = {}
    const onKey = (e) => { keys[e.code] = e.type === 'keydown' }
    window.addEventListener('keydown', onKey)
    window.addEventListener('keyup', onKey)

    const interval = setInterval(() => {
      if (!orbitRef.current) return
      const speed = 0.8
      const controls = orbitRef.current
      if (keys['KeyW'] || keys['ArrowUp']) controls.dollyIn(1 - speed * 0.03)
      if (keys['KeyS'] || keys['ArrowDown']) controls.dollyOut(1 - speed * 0.03)
      if (keys['KeyA'] || keys['ArrowLeft']) controls.rotateLeft(0.015)
      if (keys['KeyD'] || keys['ArrowRight']) controls.rotateLeft(-0.015)
    }, 16)

    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('keyup', onKey)
      clearInterval(interval)
    }
  }, [])

  useFrame((_, delta) => {
    if (flyState.current.active) {
      const { waypointIdx, progress } = flyState.current
      const from = FLY_WAYPOINTS[waypointIdx]
      const to = FLY_WAYPOINTS[(waypointIdx + 1) % FLY_WAYPOINTS.length]

      const t = Math.min(progress / from.duration, 1)
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

      targetPos.current.set(
        THREE.MathUtils.lerp(from.pos[0], to.pos[0], ease),
        THREE.MathUtils.lerp(from.pos[1], to.pos[1], ease),
        THREE.MathUtils.lerp(from.pos[2], to.pos[2], ease),
      )
      targetLook.current.set(
        THREE.MathUtils.lerp(from.target[0], to.target[0], ease),
        THREE.MathUtils.lerp(from.target[1], to.target[1], ease),
        THREE.MathUtils.lerp(from.target[2], to.target[2], ease),
      )

      flyState.current.progress += delta
      if (flyState.current.progress >= from.duration) {
        flyState.current.progress = 0
        flyState.current.waypointIdx = (waypointIdx + 1) % FLY_WAYPOINTS.length
      }

      // Smooth camera movement in fly mode
      currentPos.current.lerp(targetPos.current, delta * 1.5)
      currentLook.current.lerp(targetLook.current, delta * 1.5)
      camera.position.copy(currentPos.current)
      camera.lookAt(currentLook.current)

      if (orbitRef.current) {
        orbitRef.current.target.copy(currentLook.current)
        orbitRef.current.update()
      }
    } else {
      // Smooth lerp to target in orbit mode
      if (selectedBuilding) {
        currentPos.current.lerp(targetPos.current, delta * 2)
        currentLook.current.lerp(targetLook.current, delta * 2)
        camera.position.copy(currentPos.current)
        if (orbitRef.current) {
          orbitRef.current.target.copy(currentLook.current)
          orbitRef.current.update()
        }
      }
    }
  })

  return (
    <OrbitControls
      ref={orbitRef}
      enabled={!flyMode}
      makeDefault
      minDistance={8}
      maxDistance={200}
      maxPolarAngle={Math.PI / 2.05}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.6}
      zoomSpeed={1.2}
    />
  )
}
