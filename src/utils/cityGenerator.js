/**
 * Procedural City Generator — converts raw LeetCode data into city data.
 *
 * City Layout:
 *  - Center: Contest Tower (rating-based)
 *  - Inner Ring: Hard skyscrapers
 *  - Mid Ring: Medium buildings (districts by topic)
 *  - Outer Ring: Easy houses
 *  - Roads: Grid + radial system connecting districts
 */

// ─── District Definitions ──────────────────────────────────────────────────

export const DISTRICTS = {
  dp: {
    name: 'DP District',
    tags: ['dynamic-programming', 'memoization'],
    color: '#7b2fff',
    neon: '#a855f7',
    center: [-40, 0, -40],
    radius: 28,
  },
  graph: {
    name: 'Graph District',
    tags: ['graph', 'bfs', 'dfs', 'union-find', 'topological-sort'],
    color: '#ff2d9b',
    neon: '#f472b6',
    center: [40, 0, -40],
    radius: 28,
  },
  tree: {
    name: 'Tree District',
    tags: ['tree', 'binary-tree', 'binary-search-tree', 'trie'],
    color: '#00f5d4',
    neon: '#5eead4',
    center: [-40, 0, 40],
    radius: 28,
  },
  greedy: {
    name: 'Greedy District',
    tags: ['greedy', 'sorting', 'two-pointers', 'sliding-window'],
    color: '#ffaa00',
    neon: '#fbbf24',
    center: [40, 0, 40],
    radius: 28,
  },
  math: {
    name: 'Math District',
    tags: ['math', 'bit-manipulation', 'number-theory'],
    color: '#00aaff',
    neon: '#38bdf8',
    center: [0, 0, -60],
    radius: 22,
  },
  array: {
    name: 'Array District',
    tags: ['array', 'hash-table', 'string'],
    color: '#ff6b35',
    neon: '#fb923c',
    center: [0, 0, 60],
    radius: 25,
  },
}

// ─── Building Config ───────────────────────────────────────────────────────

const BUILDING_CONFIG = {
  easy: {
    minHeight: 1.5,
    maxHeight: 4,
    width: 1.2,
    color: '#00f5d4',
    emissive: '#00b89f',
    emissiveIntensity: 0.4,
    type: 'house',
  },
  medium: {
    minHeight: 5,
    maxHeight: 14,
    width: 1.6,
    color: '#ffaa00',
    emissive: '#ff8800',
    emissiveIntensity: 0.5,
    type: 'office',
  },
  hard: {
    minHeight: 15,
    maxHeight: 35,
    width: 2,
    color: '#ff2d9b',
    emissive: '#cc0066',
    emissiveIntensity: 0.7,
    type: 'skyscraper',
  },
}

// ─── Seeded Random (deterministic from username) ───────────────────────────

function seededRandom(seed) {
  let s = seed
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function hashString(str) {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash)
}

// ─── Grid Placement ────────────────────────────────────────────────────────

class GridPlacer {
  constructor(cellSize = 3.5, spacing = 0.8) {
    this.cellSize = cellSize
    this.spacing = spacing
    this.occupied = new Set()
  }

  key(x, z) {
    return `${Math.round(x / this.cellSize)}_${Math.round(z / this.cellSize)}`
  }

  isOccupied(x, z, radius = 1) {
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dz = -radius; dz <= radius; dz++) {
        const cx = Math.round((x + dx * this.cellSize) / this.cellSize)
        const cz = Math.round((z + dz * this.cellSize) / this.cellSize)
        if (this.occupied.has(`${cx}_${cz}`)) return true
      }
    }
    return false
  }

  place(x, z) {
    this.occupied.add(this.key(x, z))
  }

  findFreeSpot(centerX, centerZ, rand, maxRadius = 25) {
    for (let r = 0; r < maxRadius; r++) {
      const angle = rand() * Math.PI * 2
      const dist = rand() * r * this.cellSize
      const x = centerX + Math.cos(angle) * dist
      const z = centerZ + Math.sin(angle) * dist
      const snapped = this.snap(x, z)
      if (!this.isOccupied(snapped.x, snapped.z)) {
        this.place(snapped.x, snapped.z)
        return snapped
      }
    }
    return this.snap(centerX + rand() * 60 - 30, centerZ + rand() * 60 - 30)
  }

  snap(x, z) {
    return {
      x: Math.round(x / this.cellSize) * this.cellSize,
      z: Math.round(z / this.cellSize) * this.cellSize,
    }
  }
}

// ─── Main Processor ────────────────────────────────────────────────────────

export function processLeetCodeData(rawData) {
  const { user, contestRanking, topics, recentSubmissions } = rawData
  const username = user?.username || 'demo'
  const rand = seededRandom(hashString(username))

  const submitStats = user?.submitStats?.acSubmissionNum || []
  const easySolved = submitStats.find(s => s.difficulty === 'Easy')?.count || 0
  const mediumSolved = submitStats.find(s => s.difficulty === 'Medium')?.count || 0
  const hardSolved = submitStats.find(s => s.difficulty === 'Hard')?.count || 0
  const totalSolved = submitStats.find(s => s.difficulty === 'All')?.count || 0
  const totalSubmissions = submitStats.find(s => s.difficulty === 'All')?.submissions || 1

  const contestRating = contestRanking?.rating || 1500
  const streak = user?.userCalendar?.streak || 0
  const totalActiveDays = user?.userCalendar?.totalActiveDays || 0
  const acceptanceRate = Math.round((totalSolved / totalSubmissions) * 100)
  const ranking = user?.profile?.ranking || 999999

  // ─── Contest Tower ─────────────────────────────────────────────────────
  const towerHeight = Math.max(40, Math.min(100, (contestRating - 1200) / 10 + 40))
  const towerRings = Math.floor((contestRating - 1200) / 200)

  const tower = {
    id: 'contest_tower',
    type: 'tower',
    position: [0, towerHeight / 2, 0],
    height: towerHeight,
    width: 4.5,
    rating: contestRating,
    badge: contestRanking?.badge?.name,
    rank: contestRanking?.globalRanking,
    topPercentage: contestRanking?.topPercentage,
    contestsAttended: contestRanking?.attendedContestsCount,
    rings: towerRings,
    color: '#00f5d4',
    label: 'Contest Tower',
  }

  // ─── Generate Buildings ────────────────────────────────────────────────
  const placer = new GridPlacer(3.5, 0.8)
  placer.place(0, 0) // reserve center for tower
  placer.place(0, 3.5)
  placer.place(3.5, 0)
  placer.place(-3.5, 0)
  placer.place(0, -3.5)

  const buildings = []

  // Assign topics to buildings
  const allTopicTags = []
  if (topics) {
    const allTags = [
      ...(topics.advanced || []),
      ...(topics.intermediate || []),
      ...(topics.fundamental || []),
    ]
    allTags.forEach(tag => {
      allTopicTags.push(tag)
    })
  }

  function getDistrictForTag(tagSlug) {
    for (const [key, district] of Object.entries(DISTRICTS)) {
      if (district.tags.some(t => tagSlug.includes(t) || t.includes(tagSlug))) {
        return key
      }
    }
    return null
  }

  function buildingFromDifficulty(difficulty, idx, totalCount) {
    const cfg = BUILDING_CONFIG[difficulty]
    const t = idx / Math.max(totalCount, 1)
    const height = cfg.minHeight + (cfg.maxHeight - cfg.minHeight) * (rand() * 0.7 + t * 0.3)
    const windowLit = 0.3 + (streak / 100) * 0.7

    return {
      height: parseFloat(height.toFixed(2)),
      width: cfg.width * (0.85 + rand() * 0.3),
      color: cfg.color,
      emissive: cfg.emissive,
      emissiveIntensity: cfg.emissiveIntensity * (0.6 + windowLit * 0.4),
      type: cfg.type,
      difficulty,
      windowLit,
    }
  }

  // ─── Hard buildings (inner ring, 9–18 units from center) ──────────────
  for (let i = 0; i < hardSolved; i++) {
    const angle = (i / hardSolved) * Math.PI * 2 + rand() * 0.5
    const dist = 10 + rand() * 12
    const cx = Math.cos(angle) * dist
    const cz = Math.sin(angle) * dist
    const pos = placer.findFreeSpot(cx, cz, rand, 8)
    const bld = buildingFromDifficulty('hard', i, hardSolved)
    buildings.push({
      id: `hard_${i}`,
      ...bld,
      position: [pos.x, bld.height / 2, pos.z],
      district: 'center',
    })
  }

  // ─── Medium buildings (mid ring + districts) ───────────────────────────
  for (let i = 0; i < mediumSolved; i++) {
    let cx, cz, districtKey

    // 60% go into topic districts
    if (rand() < 0.6 && allTopicTags.length > 0) {
      const tag = allTopicTags[Math.floor(rand() * allTopicTags.length)]
      districtKey = getDistrictForTag(tag.tagSlug) || Object.keys(DISTRICTS)[Math.floor(rand() * Object.keys(DISTRICTS).length)]
      const district = DISTRICTS[districtKey]
      cx = district.center[0] + (rand() - 0.5) * district.radius * 1.5
      cz = district.center[2] + (rand() - 0.5) * district.radius * 1.5
    } else {
      const angle = (i / mediumSolved) * Math.PI * 2 + rand() * 0.8
      const dist = 22 + rand() * 20
      cx = Math.cos(angle) * dist
      cz = Math.sin(angle) * dist
    }

    const pos = placer.findFreeSpot(cx, cz, rand, 10)
    const bld = buildingFromDifficulty('medium', i, mediumSolved)
    buildings.push({
      id: `medium_${i}`,
      ...bld,
      position: [pos.x, bld.height / 2, pos.z],
      district: districtKey || 'general',
    })
  }

  // ─── Easy buildings (outer ring, suburban) ────────────────────────────
  for (let i = 0; i < easySolved; i++) {
    const angle = (i / easySolved) * Math.PI * 2 + rand() * 1.2
    const dist = 45 + rand() * 30
    const cx = Math.cos(angle) * dist
    const cz = Math.sin(angle) * dist
    const pos = placer.findFreeSpot(cx, cz, rand, 6)
    const bld = buildingFromDifficulty('easy', i, easySolved)
    buildings.push({
      id: `easy_${i}`,
      ...bld,
      position: [pos.x, bld.height / 2, pos.z],
      district: 'suburbs',
    })
  }

  // ─── Roads ─────────────────────────────────────────────────────────────
  const roads = generateRoads(rand)

  // ─── Particle Lights (street lamps = active days) ──────────────────────
  const lights = generateStreetLights(totalActiveDays, rand)

  // ─── District Zones ────────────────────────────────────────────────────
  const districtZones = Object.entries(DISTRICTS).map(([key, d]) => {
    const relatedTags = allTopicTags.filter(t =>
      d.tags.some(dt => t.tagSlug.includes(dt) || dt.includes(t.tagSlug))
    )
    const totalProblems = relatedTags.reduce((s, t) => s + t.problemsSolved, 0)
    return {
      key,
      ...d,
      problems: totalProblems,
      active: totalProblems > 0,
    }
  })

  // ─── Stats ─────────────────────────────────────────────────────────────
  const stats = {
    easy: easySolved,
    medium: mediumSolved,
    hard: hardSolved,
    total: totalSolved,
    totalSubmissions,
    acceptanceRate,
    contestRating,
    streak,
    totalActiveDays,
    ranking,
    topPercentage: contestRanking?.topPercentage,
    contestsAttended: contestRanking?.attendedContestsCount,
    badges: user?.badges?.length || 0,
    reputation: user?.profile?.reputation || 0,
    recentSubmissions: recentSubmissions || [],
    submissionCalendar: (() => {
      try {
        return JSON.parse(user?.userCalendar?.submissionCalendar || '{}')
      } catch { return {} }
    })(),
  }

  return { tower, buildings, roads, lights, districtZones, stats }
}

function generateRoads(rand) {
  const roads = []

  // Main radial roads from center
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2
    roads.push({
      type: 'radial',
      start: [0, 0.05, 0],
      end: [Math.cos(angle) * 80, 0.05, Math.sin(angle) * 80],
      width: 1.2,
    })
  }

  // Concentric ring roads
  for (const radius of [14, 28, 50, 72]) {
    roads.push({ type: 'ring', radius, segments: 64, width: 0.8 })
  }

  return roads
}

function generateStreetLights(activeDays, rand) {
  const lights = []
  const count = Math.min(activeDays * 2, 400)
  for (let i = 0; i < count; i++) {
    const angle = rand() * Math.PI * 2
    const dist = 8 + rand() * 80
    lights.push({
      position: [Math.cos(angle) * dist, 0.5, Math.sin(angle) * dist],
      intensity: 0.3 + rand() * 0.7,
      color: rand() > 0.7 ? '#ff2d9b' : rand() > 0.5 ? '#ffaa00' : '#00f5d4',
    })
  }
  return lights
}
