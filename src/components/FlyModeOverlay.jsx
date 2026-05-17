/**
 * FlyModeOverlay — cinematic banner when fly-through is active.
 */
import { motion, AnimatePresence } from 'framer-motion'
import useCityStore from '../store/useCityStore'

export default function FlyModeOverlay() {
  const flyMode = useCityStore(s => s.flyMode)
  const toggleFlyMode = useCityStore(s => s.toggleFlyMode)
  const username = useCityStore(s => s.username)

  return (
    <AnimatePresence>
      {flyMode && (
        <>
          {/* Top letterbox */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              height: 60,
              background: 'black',
              zIndex: 80,
              transformOrigin: 'top',
            }}
          />

          {/* Bottom letterbox */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              height: 60,
              background: 'black',
              zIndex: 80,
              transformOrigin: 'bottom',
            }}
          />

          {/* Title card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              position: 'fixed',
              bottom: 70,
              left: 40,
              zIndex: 81,
            }}
          >
            <div style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: 10,
              color: '#00f5d4',
              letterSpacing: '0.15em',
              opacity: 0.7,
              marginBottom: 3,
            }}>
              CINEMATIC FLY-THROUGH
            </div>
            <div style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: 18,
              fontWeight: 700,
              color: 'white',
              textShadow: '0 0 20px rgba(0,245,212,0.4)',
            }}>
              {username}'s Leetropolis
            </div>
          </motion.div>

          {/* Exit button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            onClick={toggleFlyMode}
            style={{
              position: 'fixed',
              bottom: 70,
              right: 40,
              zIndex: 81,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 8,
              color: 'white',
              fontFamily: 'Inter, sans-serif',
              fontSize: 12,
              padding: '6px 14px',
              cursor: 'pointer',
            }}
          >
            EXIT CINEMATIC
          </motion.button>
        </>
      )}
    </AnimatePresence>
  )
}
