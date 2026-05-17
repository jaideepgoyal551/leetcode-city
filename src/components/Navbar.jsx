/**
 * Navbar — glassmorphism top bar with logo, search, and controls.
 */
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, GitBranch, MapPin, Layers, Loader2 } from 'lucide-react'
import useCityStore from '../store/useCityStore'

export default function Navbar() {
  const [input, setInput] = useState('')
  const { fetchUser, loading, screen, backToLanding, username } = useCityStore()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) fetchUser(input.trim())
  }

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: 'rgba(5,5,16,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,245,212,0.12)',
      }}
    >
      {/* Logo */}
      <button
        onClick={backToLanding}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          marginRight: 8,
        }}
      >
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #00f5d4, #7b2fff)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Orbitron, sans-serif',
          fontWeight: 900,
          fontSize: 14,
          color: '#050510',
          boxShadow: '0 0 16px rgba(0,245,212,0.4)',
        }}>L</div>
        <span style={{
          fontFamily: 'Orbitron, sans-serif',
          fontWeight: 700,
          fontSize: 14,
          color: '#00f5d4',
          letterSpacing: '0.08em',
          textShadow: '0 0 12px rgba(0,245,212,0.5)',
        }}>
          LEETROPOLIS
        </span>
      </button>

      {/* Search */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flex: 1, maxWidth: 360, gap: 8 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={14} style={{
            position: 'absolute',
            left: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#00f5d4',
            opacity: 0.6,
          }} />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="LeetCode username..."
            disabled={loading}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(0,245,212,0.2)',
              borderRadius: 8,
              padding: '8px 12px 8px 32px',
              color: 'white',
              fontSize: 13,
              fontFamily: 'Inter, sans-serif',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(0,245,212,0.6)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(0,245,212,0.2)'}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            padding: '8px 16px',
            background: 'linear-gradient(135deg, #00f5d4, #00b89f)',
            border: 'none',
            borderRadius: 8,
            color: '#050510',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 11,
            fontWeight: 700,
            cursor: loading ? 'wait' : 'pointer',
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            opacity: !input.trim() ? 0.5 : 1,
            transition: 'all 0.2s',
          }}
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : 'BUILD'}
        </button>
      </form>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Current city badge */}
      {screen === 'city' && username && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(0,245,212,0.08)',
            border: '1px solid rgba(0,245,212,0.2)',
            borderRadius: 20,
            padding: '4px 12px',
            fontSize: 12,
            color: '#00f5d4',
            fontFamily: 'Space Mono, monospace',
          }}
        >
          <MapPin size={12} />
          @{username}
        </motion.div>
      )}

      {/* GitHub */}
      <a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8,
          padding: '6px 12px',
          color: '#888',
          fontSize: 12,
          textDecoration: 'none',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}
        onMouseLeave={e => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
      >
        <GitBranch size={14} />
        <span style={{ fontFamily: 'Inter, sans-serif' }}>GitHub</span>
      </a>
    </motion.nav>
  )
}
