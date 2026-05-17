/**
 * BuildingDetail — right-side panel shown when a building is clicked.
 * Shows difficulty, height, district, and recent submissions.
 */
import { motion, AnimatePresence } from 'framer-motion'
import { X, Building2, Hash, Clock, Cpu } from 'lucide-react'
import useCityStore from '../store/useCityStore'

const DIFFICULTY_CONFIG = {
  easy: { label: 'EASY', color: '#00f5d4', glow: 'rgba(0,245,212,0.2)' },
  medium: { label: 'MEDIUM', color: '#ffaa00', glow: 'rgba(255,170,0,0.2)' },
  hard: { label: 'HARD', color: '#ff2d9b', glow: 'rgba(255,45,155,0.2)' },
  tower: { label: 'CONTEST TOWER', color: '#7b2fff', glow: 'rgba(123,47,255,0.2)' },
}

const TYPE_LABELS = {
  house: 'Residential Block',
  office: 'Corporate Tower',
  skyscraper: 'Mega Skyscraper',
  tower: 'Contest Spire',
}

export default function BuildingDetail() {
  const building = useCityStore(s => s.selectedBuilding)
  const clearSelection = useCityStore(s => s.clearSelection)
  const stats = useCityStore(s => s.cityData?.stats)

  if (!building) return null

  const diff = building.difficulty || building.type
  const cfg = DIFFICULTY_CONFIG[diff] || DIFFICULTY_CONFIG.easy

  const isContestTower = building.id === 'contest_tower'

  return (
    <AnimatePresence>
      <motion.div
        key={building.id}
        initial={{ opacity: 0, x: 20, scale: 0.98 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.25 }}
        style={{
          position: 'fixed',
          right: 16,
          top: 72,
          width: 260,
          zIndex: 50,
          background: 'rgba(5,5,16,0.92)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${cfg.color}30`,
          borderRadius: 12,
          padding: 16,
          boxShadow: `0 0 30px ${cfg.glow}`,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{
              display: 'inline-block',
              background: `${cfg.color}15`,
              border: `1px solid ${cfg.color}30`,
              borderRadius: 6,
              padding: '2px 8px',
              fontFamily: 'Orbitron, sans-serif',
              fontSize: 9,
              color: cfg.color,
              fontWeight: 700,
              letterSpacing: '0.12em',
              marginBottom: 6,
            }}>
              {cfg.label}
            </div>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 13, color: 'white', fontWeight: 700 }}>
              {TYPE_LABELS[building.type] || 'Building'}
            </div>
          </div>
          <button
            onClick={clearSelection}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', padding: 4 }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Building visualization */}
        <div style={{
          height: 80,
          background: 'rgba(0,0,0,0.3)',
          borderRadius: 8,
          marginBottom: 14,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          padding: '0 20px 8px',
          gap: 4,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Grid bg */}
          <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />

          {/* Main building */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
              width: 28,
              height: Math.min(60, building.height * 1.5),
              background: `linear-gradient(to top, ${cfg.color}80, ${cfg.color}20)`,
              border: `1px solid ${cfg.color}60`,
              borderRadius: '3px 3px 0 0',
              transformOrigin: 'bottom',
              boxShadow: `0 0 12px ${cfg.color}40`,
              position: 'relative',
              zIndex: 1,
            }}
          />

          {/* Neighbor buildings */}
          {[0.4, 0.6, 0.5].map((h, i) => (
            <div
              key={i}
              style={{
                width: 14,
                height: Math.min(60, building.height * h),
                background: `rgba(255,255,255,0.05)`,
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '2px 2px 0 0',
              }}
            />
          ))}
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
          {[
            { label: 'HEIGHT', value: `${building.height?.toFixed(1) || '–'}u`, icon: <Building2 size={10} /> },
            { label: 'DISTRICT', value: building.district || 'General', icon: <Hash size={10} /> },
            isContestTower && { label: 'RATING', value: building.rating, icon: <Cpu size={10} /> },
            isContestTower && { label: 'CONTESTS', value: building.contestsAttended || '–', icon: <Clock size={10} /> },
          ].filter(Boolean).map((item, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 8,
              padding: '8px 10px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#555', fontSize: 9, fontFamily: 'Inter, sans-serif', marginBottom: 4 }}>
                {item.icon} {item.label}
              </div>
              <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 12, fontWeight: 700, color: cfg.color }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Contest tower details */}
        {isContestTower && (
          <>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 12 }} />
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#666', marginBottom: 8 }}>
              Contest Performance
            </div>
            {building.badge && (
              <div style={{
                background: 'rgba(123,47,255,0.1)',
                border: '1px solid rgba(123,47,255,0.25)',
                borderRadius: 8,
                padding: '8px 12px',
                fontFamily: 'Orbitron, sans-serif',
                fontSize: 10,
                color: '#a78bfa',
                textAlign: 'center',
                marginBottom: 8,
              }}>
                🏆 {building.badge}
              </div>
            )}
            {building.rank && (
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: '#666', textAlign: 'center' }}>
                Rank #{building.rank?.toLocaleString()} of {(building.totalParticipants || 0).toLocaleString()}
              </div>
            )}
          </>
        )}

        {/* Recent submissions (for regular buildings) */}
        {!isContestTower && stats?.recentSubmissions?.length > 0 && (
          <>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 10 }} />
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#555', marginBottom: 8, letterSpacing: '0.05em' }}>
              RECENT SUBMISSIONS
            </div>
            {stats.recentSubmissions.slice(0, 3).map(sub => (
              <div key={sub.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '5px 0',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                fontSize: 11,
              }}>
                <div style={{ color: '#bbb', fontFamily: 'Inter, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>
                  {sub.title}
                </div>
                <div style={{ color: '#555', fontFamily: 'Space Mono, monospace', fontSize: 9, flexShrink: 0 }}>
                  {sub.runtime || '–'}
                </div>
              </div>
            ))}
          </>
        )}

        {/* Navigation hint */}
        <div style={{ marginTop: 12, textAlign: 'center', fontFamily: 'Space Mono, monospace', fontSize: 9, color: '#333' }}>
          Click elsewhere to deselect
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
