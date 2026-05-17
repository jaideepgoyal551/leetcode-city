/**
 * Zustand global state store for Leetropolis.
 * Manages: user data, city state, UI state, camera state
 */
import { create } from 'zustand'
import { fetchLeetCodeProfile } from '../api/leetcode'
import { MOCK_USER_DATA } from '../data/mockData'
import { processLeetCodeData } from '../utils/cityGenerator'

const useCityStore = create((set, get) => ({
  // ─── User Data ───────────────────────────────────────
  userData: null,
  cityData: null,
  username: '',
  isDemo: false,

  // ─── Loading / Error ──────────────────────────────────
  loading: false,
  error: null,
  loadingStage: '',

  // ─── UI State ────────────────────────────────────────
  screen: 'landing', // 'landing' | 'city'
  selectedBuilding: null,
  hoveredBuilding: null,
  showStats: true,
  showDistricts: true,
  theme: 'night', // 'night' | 'day' | 'rain'
  flyMode: false,
  showMinimap: true,

  // ─── Camera ──────────────────────────────────────────
  cameraTarget: [0, 0, 0],
  cameraPosition: [80, 60, 80],

  // ─── Actions ─────────────────────────────────────────
  setUsername: (name) => set({ username: name }),

  fetchUser: async (username) => {
    set({ loading: true, error: null, loadingStage: 'Connecting to LeetCode...' })
    try {
      await new Promise(r => setTimeout(r, 500))
      set({ loadingStage: 'Fetching profile data...' })

      let rawData
      try {
        rawData = await fetchLeetCodeProfile(username)
      } catch (apiErr) {
        console.warn('API failed, using demo data:', apiErr.message)
        rawData = { ...MOCK_USER_DATA, isDemo: true }
        set({ isDemo: true })
      }

      set({ loadingStage: 'Generating city districts...' })
      await new Promise(r => setTimeout(r, 400))

      const cityData = processLeetCodeData(rawData)

      set({ loadingStage: 'Rendering skyline...' })
      await new Promise(r => setTimeout(r, 300))

      set({
        userData: rawData,
        cityData,
        username,
        loading: false,
        loadingStage: '',
        screen: 'city',
        error: null,
      })
    } catch (err) {
      set({
        loading: false,
        error: err.message || 'Failed to fetch profile',
        loadingStage: '',
      })
    }
  },

  loadDemo: async () => {
    set({ loading: true, loadingStage: 'Loading demo city...', isDemo: true })
    await new Promise(r => setTimeout(r, 800))
    set({ loadingStage: 'Generating skyline...' })
    await new Promise(r => setTimeout(r, 600))
    const cityData = processLeetCodeData(MOCK_USER_DATA)
    set({
      userData: MOCK_USER_DATA,
      cityData,
      username: 'leetropolis_demo',
      loading: false,
      loadingStage: '',
      screen: 'city',
      error: null,
    })
  },

  selectBuilding: (building) => set({ selectedBuilding: building }),
  hoverBuilding: (building) => set({ hoveredBuilding: building }),
  clearSelection: () => set({ selectedBuilding: null }),

  setCamera: (position, target) => set({ cameraPosition: position, cameraTarget: target }),
  toggleFlyMode: () => set(s => ({ flyMode: !s.flyMode })),
  toggleStats: () => set(s => ({ showStats: !s.showStats })),
  toggleDistricts: () => set(s => ({ showDistricts: !s.showDistricts })),
  toggleMinimap: () => set(s => ({ showMinimap: !s.showMinimap })),
  setTheme: (theme) => set({ theme }),

  backToLanding: () => set({
    screen: 'landing',
    selectedBuilding: null,
    hoveredBuilding: null,
    userData: null,
    cityData: null,
    error: null,
    isDemo: false,
  }),
}))

export default useCityStore
