/**
 * CityControls — bottom control bar for camera modes, theme, and toggles.
 */
import { motion } from 'framer-motion'
import { BarChart2, Layers, Video, Sun, CloudRain, Moon, Map } from 'lucide-react'
import useCityStore from '../store/useCityStore'

function ControlBtn({ icon, label, active, onClick, color = '#00f5d4' }) {
  return (
    <button
      onClick={onClick}
      title={label}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        background: active ? `${color}15` : 'rgba(255,255,255,0.04)',
        border: `1px solid ${active ? color + '50' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 10,
        padding: '8px 12px',
        color: active ? color : '#666',
        cursor: 'pointer',
        transition: 'all 0.2s',
        minWidth: 52,
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.color = color
          e.currentTarget.style.borderColor = `${color}40`
          e.currentTarget.style.background = `${color}08`
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.color = '#666'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
          e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
        }
      }}
    >
      {icon}
      <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 7, letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
        {label}
      </span>
    </button>
  )
}

export default function CityControls() {
  const { showStats, toggleStats, showDistricts, toggleDistricts, flyMode, toggleFlyMode, theme, setTheme, showMinimap, toggleMinimap } = useCityStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        display: 'flex',
        gap: 6,
        background: 'rgba(5,5,16,0.9)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(0,245,212,0.12)',
        borderRadius: 14,
        padding: '8px 10px',
      }}
    >
      <ControlBtn icon={<BarChart2 size={14} />} label="STATS" active={showStats} onClick={toggleStats} />
      <ControlBtn icon={<Layers size={14} />} label="ZONES" active={showDistricts} onClick={toggleDistricts} />
      <ControlBtn icon={<Map size={14} />} label="MAP" active={showMinimap} onClick={toggleMinimap} />

      <div style={{ width: 1, background: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />

      <ControlBtn
        icon={<Video size={14} />}
        label="FLY"
        active={flyMode}
        onClick={toggleFlyMode}
        color="#ff2d9b"
      />

      <div style={{ width: 1, background: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />

      <ControlBtn icon={<Moon size={14} />} label="NIGHT" active={theme === 'night'} onClick={() => setTheme('night')} color="#7b2fff" />
      <ControlBtn icon={<Sun size={14} />} label="DAY" active={theme === 'day'} onClick={() => setTheme('day')} color="#ffaa00" />
      <ControlBtn icon={<CloudRain size={14} />} label="RAIN" active={theme === 'rain'} onClick={() => setTheme('rain')} color="#38bdf8" />

      {/* Keyboard hint */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 8,
        fontFamily: 'Space Mono, monospace',
        fontSize: 8,
        color: '#333',
        whiteSpace: 'nowrap',
      }}>
        WASD/↑↓←→
      </div>
    </motion.div>
  )
}
