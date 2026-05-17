/**
 * LandingPage — hero section with search and demo button.
 */
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Zap, Globe, Star, ArrowRight, Loader2 } from 'lucide-react'
import useCityStore from '../store/useCityStore'

const DEMO_USERNAMES = ['leetcode_master', 'code_ninja_99', 'algorithm_ace', 'devhero_42']

const FEATURES = [
  { icon: '🏙️', title: 'Living City', desc: 'Every solved problem becomes a building' },
  { icon: '⚡', title: 'Contest Tower', desc: 'Your rating shapes the central spire' },
  { icon: '🎯', title: 'Topic Districts', desc: 'DP, Graphs, Trees - all have their zone' },
  { icon: '✨', title: 'Cinematic Mode', desc: 'Auto fly-through your city skyline' },
]

function FloatingBuildings() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {[...Array(20)].map((_, i) => {
        const x = 5 + (i * 4.8) % 90
        const delay = i * 0.3
        const h = 60 + (i * 37) % 200
        const colors = ['#00f5d4', '#ff2d9b', '#7b2fff', '#ffaa00']
        const color = colors[i % 4]
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: [0, 0.15, 0.08, 0.15],
              y: [20, 0, -5, 0],
            }}
            transition={{
              duration: 4 + i * 0.5,
              delay,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            style={{
              position: 'absolute',
              bottom: 0,
              left: `${x}%`,
              width: 24 + (i * 7) % 40,
              height: h,
              background: `linear-gradient(to top, ${color}20, transparent)`,
              border: `1px solid ${color}30`,
              borderBottom: 'none',
            }}
          />
        )
      })}
    </div>
  )
}

export default function LandingPage() {
  const [input, setInput] = useState('')
  const [demoIdx, setDemoIdx] = useState(0)
  const { fetchUser, loadDemo, loading, error } = useCityStore()

  useEffect(() => {
    const t = setInterval(() => setDemoIdx(i => (i + 1) % DEMO_USERNAMES.length), 2500)
    return () => clearInterval(t)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) fetchUser(input.trim())
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050510',
        overflow: 'hidden',
      }}
    >
      {/* Animated background buildings */}
      <FloatingBuildings />

      {/* Grid background */}
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.6 }} />

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,245,212,0.06) 0%, transparent 70%)',
      }} />

      {/* Main content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: 680,
        width: '90%',
        textAlign: 'center',
        padding: '0 20px',
      }}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(0,245,212,0.08)',
            border: '1px solid rgba(0,245,212,0.25)',
            borderRadius: 20,
            padding: '5px 14px',
            marginBottom: 28,
            fontSize: 11,
            color: '#00f5d4',
            fontFamily: 'Space Mono, monospace',
            letterSpacing: '0.05em',
          }}
        >
          <Star size={10} fill="#00f5d4" />
          Open Source · Free Forever
          <Star size={10} fill="#00f5d4" />
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 'clamp(28px, 5vw, 52px)',
            fontWeight: 900,
            lineHeight: 1.15,
            marginBottom: 20,
            letterSpacing: '-0.01em',
          }}
        >
          <span style={{ color: 'white' }}>Turn Your </span>
          <span style={{
            color: '#00f5d4',
            textShadow: '0 0 30px rgba(0,245,212,0.6), 0 0 60px rgba(0,245,212,0.3)',
          }}>
            LeetCode
          </span>
          <br />
          <span style={{ color: 'white' }}>Into A </span>
          <span style={{
            color: '#ff2d9b',
            textShadow: '0 0 30px rgba(255,45,155,0.6)',
          }}>
            Living City
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          style={{
            color: '#888',
            fontSize: 15,
            lineHeight: 1.7,
            marginBottom: 36,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Every problem you solve becomes a building in your{' '}
          <span style={{ color: '#00f5d4' }}>procedural 3D cyberpunk city</span>.
          Easy problems are houses, Hard problems are{' '}
          <span style={{ color: '#ff2d9b' }}>skyscrapers</span>.
        </motion.p>

        {/* Search form */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            gap: 10,
            marginBottom: 12,
          }}
        >
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={16} style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#00f5d4',
              opacity: 0.5,
            }} />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Try "${DEMO_USERNAMES[demoIdx]}"...`}
              disabled={loading}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(0,245,212,0.25)',
                borderRadius: 12,
                padding: '14px 14px 14px 44px',
                color: 'white',
                fontSize: 15,
                fontFamily: 'Inter, sans-serif',
                outline: 'none',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#00f5d4'
                e.target.style.boxShadow = '0 0 24px rgba(0,245,212,0.15)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(0,245,212,0.25)'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              padding: '14px 24px',
              background: !input.trim() ? 'rgba(0,245,212,0.3)' : 'linear-gradient(135deg, #00f5d4, #00b89f)',
              border: 'none',
              borderRadius: 12,
              color: '#050510',
              fontFamily: 'Orbitron, sans-serif',
              fontSize: 13,
              fontWeight: 700,
              cursor: loading ? 'wait' : input.trim() ? 'pointer' : 'not-allowed',
              letterSpacing: '0.08em',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              boxShadow: input.trim() ? '0 0 24px rgba(0,245,212,0.3)' : 'none',
            }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" style={{ color: '#050510' }} /> : (
              <>BUILD CITY <ArrowRight size={16} /></>
            )}
          </button>
        </motion.form>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                color: '#ff2d9b',
                fontSize: 12,
                fontFamily: 'Space Mono, monospace',
                marginBottom: 8,
                padding: '8px 16px',
                background: 'rgba(255,45,155,0.08)',
                border: '1px solid rgba(255,45,155,0.2)',
                borderRadius: 8,
              }}
            >
              ⚠ {error} — API may be blocked, try Demo Mode
            </motion.div>
          )}
        </AnimatePresence>

        {/* Demo button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ marginBottom: 48 }}
        >
          <button
            onClick={loadDemo}
            disabled={loading}
            style={{
              background: 'none',
              border: '1px solid rgba(123,47,255,0.4)',
              borderRadius: 8,
              color: '#a78bfa',
              fontFamily: 'Inter, sans-serif',
              fontSize: 13,
              padding: '8px 20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(123,47,255,0.1)'; e.currentTarget.style.borderColor = '#7b2fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'rgba(123,47,255,0.4)' }}
          >
            ✨ Try Demo City
          </button>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 10,
          }}
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                padding: '14px 16px',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
              whileHover={{ borderColor: 'rgba(0,245,212,0.2)', scale: 1.02 }}
            >
              <div style={{ fontSize: 20, marginBottom: 6 }}>{f.icon}</div>
              <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 11, color: '#00f5d4', marginBottom: 3, letterSpacing: '0.08em' }}>
                {f.title}
              </div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#666' }}>
                {f.desc}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ delay: 2, duration: 2, repeat: Infinity }}
        style={{
          position: 'absolute',
          bottom: 24,
          fontFamily: 'Space Mono, monospace',
          fontSize: 10,
          color: '#444',
          letterSpacing: '0.1em',
        }}
      >
        LEETROPOLIS v1.0 — BUILT WITH THREE.JS + R3F
      </motion.div>
    </motion.div>
  )
}
