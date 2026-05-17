/**
 * StatsPanel — floating side panel showing live city statistics.
 */
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trophy, Flame, Calendar, TrendingUp, Award, CheckCircle2 } from 'lucide-react'
import useCityStore from '../store/useCityStore'

function StatRow({ label, value, color = '#888', icon }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#666', fontSize: 12, fontFamily: 'Inter, sans-serif' }}>
        {icon && <span style={{ color }}>{icon}</span>}
        {label}
      </div>
      <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 12, fontWeight: 700, color }}>
        {value}
      </div>
    </div>
  )
}

function DifficultyBar({ label, count, total, color }) {
  const pct = total ? Math.round((count / total) * 100) : 0
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 11, fontFamily: 'Inter, sans-serif' }}>
        <span style={{ color: '#666' }}>{label}</span>
        <span style={{ color, fontFamily: 'Orbitron, sans-serif', fontWeight: 700 }}>{count}</span>
      </div>
      <div className="progress-bar">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{ background: color, boxShadow: `0 0 6px ${color}` }}
        />
      </div>
    </div>
  )
}

export default function StatsPanel() {
  const stats = useCityStore(s => s.cityData?.stats)
  const showStats = useCityStore(s => s.showStats)
  const toggleStats = useCityStore(s => s.toggleStats)
  const userData = useCityStore(s => s.userData)
  const isDemo = useCityStore(s => s.isDemo)

  if (!stats) return null

  const username = userData?.user?.username || 'user'

  return (
    <AnimatePresence>
      {showStats && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            left: 16,
            top: 72,
            width: 240,
            zIndex: 50,
            background: 'rgba(5,5,16,0.9)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(0,245,212,0.15)',
            borderRadius: 12,
            padding: 16,
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 11, color: '#00f5d4', fontWeight: 700, letterSpacing: '0.1em' }}>
                CITY STATS
              </div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: '#666', marginTop: 2 }}>
                @{username} {isDemo && <span style={{ color: '#7b2fff' }}>· DEMO</span>}
              </div>
            </div>
            <button onClick={toggleStats} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', padding: 4 }}>
              <X size={14} />
            </button>
          </div>

          {/* Total solved */}
          <div style={{
            background: 'rgba(0,245,212,0.06)',
            border: '1px solid rgba(0,245,212,0.15)',
            borderRadius: 10,
            padding: '12px',
            textAlign: 'center',
            marginBottom: 14,
          }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 32, fontWeight: 900, color: '#00f5d4', textShadow: '0 0 20px rgba(0,245,212,0.5)' }}
            >
              {stats.total}
            </motion.div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#666', marginTop: 2 }}>
              PROBLEMS SOLVED
            </div>
          </div>

          {/* Difficulty breakdown */}
          <div style={{ marginBottom: 14 }}>
            <DifficultyBar label="Easy" count={stats.easy} total={stats.total} color="#00f5d4" />
            <DifficultyBar label="Medium" count={stats.medium} total={stats.total} color="#ffaa00" />
            <DifficultyBar label="Hard" count={stats.hard} total={stats.total} color="#ff2d9b" />
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 12 }} />

          {/* Other stats */}
          <StatRow label="Contest Rating" value={stats.contestRating || 'N/A'} color="#ffaa00" icon={<Trophy size={11} />} />
          <StatRow label="Daily Streak" value={`${stats.streak}d`} color="#ff2d9b" icon={<Flame size={11} />} />
          <StatRow label="Active Days" value={stats.totalActiveDays} color="#7b2fff" icon={<Calendar size={11} />} />
          <StatRow label="Acceptance" value={`${stats.acceptanceRate}%`} color="#00f5d4" icon={<CheckCircle2 size={11} />} />
          <StatRow label="Global Rank" value={stats.ranking ? `#${stats.ranking.toLocaleString()}` : 'N/A'} color="#888" icon={<TrendingUp size={11} />} />
          {stats.contestsAttended && (
            <StatRow label="Contests" value={stats.contestsAttended} color="#888" icon={<Award size={11} />} />
          )}

          {/* Top % badge */}
          {stats.topPercentage && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              style={{
                marginTop: 12,
                background: 'rgba(123,47,255,0.1)',
                border: '1px solid rgba(123,47,255,0.25)',
                borderRadius: 8,
                padding: '8px 10px',
                textAlign: 'center',
                fontFamily: 'Orbitron, sans-serif',
                fontSize: 10,
                color: '#a78bfa',
              }}
            >
              TOP {stats.topPercentage.toFixed(1)}% GLOBALLY
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
