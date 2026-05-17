/**
 * Minimap — top-right overview of the city layout.
 */
import { useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useCityStore from '../store/useCityStore'
import { DISTRICTS } from '../utils/cityGenerator'

export default function Minimap() {
  const canvasRef = useRef()
  const cityData = useCityStore(s => s.cityData)
  const showMinimap = useCityStore(s => s.showMinimap)

  const scale = 1.0 // world unit to canvas px ratio
  const SIZE = 140
  const CENTER = SIZE / 2

  function worldToCanvas(x, z) {
    return {
      cx: CENTER + x * (SIZE / 200),
      cy: CENTER + z * (SIZE / 200),
    }
  }

  useEffect(() => {
    if (!canvasRef.current || !cityData) return
    const ctx = canvasRef.current.getContext('2d')
    const { buildings, tower } = cityData

    // Background
    ctx.fillStyle = '#050510'
    ctx.fillRect(0, 0, SIZE, SIZE)

    // Grid
    ctx.strokeStyle = 'rgba(0,245,212,0.08)'
    ctx.lineWidth = 0.5
    const step = SIZE / 10
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath()
      ctx.moveTo(i * step, 0); ctx.lineTo(i * step, SIZE)
      ctx.moveTo(0, i * step); ctx.lineTo(SIZE, i * step)
      ctx.stroke()
    }

    // District circles
    Object.values(DISTRICTS).forEach(d => {
      const { cx, cy } = worldToCanvas(d.center[0], d.center[2])
      const r = d.radius * (SIZE / 200)
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.strokeStyle = d.color + '40'
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.fillStyle = d.color + '08'
      ctx.fill()
    })

    // Buildings
    buildings.forEach(b => {
      const { cx, cy } = worldToCanvas(b.position[0], b.position[2])
      const r = b.difficulty === 'hard' ? 2 : b.difficulty === 'medium' ? 1.5 : 1
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fillStyle = b.color + 'cc'
      ctx.fill()
    })

    // Tower (center)
    ctx.beginPath()
    ctx.arc(CENTER, CENTER, 4, 0, Math.PI * 2)
    ctx.fillStyle = '#00f5d4'
    ctx.fill()
    ctx.beginPath()
    ctx.arc(CENTER, CENTER, 6, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(0,245,212,0.4)'
    ctx.lineWidth = 1
    ctx.stroke()

  }, [cityData, showMinimap])

  if (!cityData) return null

  return (
    <AnimatePresence>
      {showMinimap && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{
            position: 'fixed',
            right: 16,
            bottom: 80,
            zIndex: 50,
            background: 'rgba(5,5,16,0.88)',
            border: '1px solid rgba(0,245,212,0.15)',
            borderRadius: 10,
            overflow: 'hidden',
          }}
        >
          <div style={{
            padding: '5px 8px',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 8,
            color: '#00f5d4',
            letterSpacing: '0.12em',
            borderBottom: '1px solid rgba(0,245,212,0.1)',
          }}>
            CITY MAP
          </div>
          <canvas
            ref={canvasRef}
            width={SIZE}
            height={SIZE}
            style={{ display: 'block' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
