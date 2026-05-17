/**
 * LoadingScreen — animated progress screen shown while fetching + generating city.
 */
import { motion, AnimatePresence } from 'framer-motion'
import useCityStore from '../store/useCityStore'

const STAGES = [
  'Connecting to LeetCode...',
  'Fetching profile data...',
  'Generating city districts...',
  'Rendering skyline...',
  'Loading demo city...',
]

export default function LoadingScreen() {
  const loading = useCityStore(s => s.loading)
  const stage = useCityStore(s => s.loadingStage)
  const username = useCityStore(s => s.username)

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#050510',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          {/* Hex rings */}
          <div style={{ position: 'relative', width: 120, height: 120, marginBottom: 40 }}>
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  inset: i * 15,
                  border: `2px solid`,
                  borderColor: ['#00f5d4', '#7b2fff', '#ff2d9b'][i],
                  borderRadius: 8,
                  opacity: 0.7,
                }}
                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                transition={{ duration: 3 + i, repeat: Infinity, ease: 'linear' }}
              />
            ))}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Orbitron, sans-serif',
              fontSize: 24,
              color: '#00f5d4',
              textShadow: '0 0 20px #00f5d4',
            }}>
              L
            </div>
          </div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: 20,
              fontWeight: 700,
              color: '#00f5d4',
              textShadow: '0 0 20px rgba(0,245,212,0.6)',
              marginBottom: 8,
              letterSpacing: '0.15em',
            }}
          >
            LEETROPOLIS
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: 12,
              color: '#888',
              marginBottom: 32,
            }}
          >
            {username ? `Building city for @${username}` : 'Initializing...'}
          </motion.div>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {[0, 1, 2, 3, 4].map(i => (
              <motion.div
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#00f5d4',
                }}
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>

          {/* Stage text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: 11,
                color: '#00f5d4',
                letterSpacing: '0.05em',
                opacity: 0.8,
              }}
            >
              {stage || '...'}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
