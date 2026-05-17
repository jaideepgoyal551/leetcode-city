/**
 * App — root component orchestrating screens and overlays.
 */
import { AnimatePresence } from 'framer-motion'
import useCityStore from './store/useCityStore'

import Navbar from './components/Navbar'
import LandingPage from './components/LandingPage'
import LoadingScreen from './components/LoadingScreen'
import CityScene from './components/CityScene'
import StatsPanel from './components/StatsPanel'
import BuildingDetail from './components/BuildingDetail'
import CityControls from './components/CityControls'
import Minimap from './components/Minimap'
import FlyModeOverlay from './components/FlyModeOverlay'

export default function App() {
  const screen = useCityStore(s => s.screen)
  const clearSelection = useCityStore(s => s.clearSelection)

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#050510' }}>
      {/* Loading overlay — always present, animated in/out */}
      <LoadingScreen />

      {/* Navbar — always visible */}
      <Navbar />

      {/* Landing / City screens */}
      <AnimatePresence mode="wait">
        {screen === 'landing' && <LandingPage key="landing" />}
      </AnimatePresence>

      {/* 3D City — always mounted when cityData exists, for smooth transitions */}
      {screen === 'city' && (
        <div
          style={{ position: 'absolute', inset: 0 }}
          onClick={(e) => {
            // Click outside a building to deselect
            if (e.target.tagName === 'CANVAS') clearSelection()
          }}
        >
          <CityScene />
        </div>
      )}

      {/* HUD overlays — only in city mode */}
      {screen === 'city' && (
        <>
          <StatsPanel />
          <BuildingDetail />
          <CityControls />
          <Minimap />
          <FlyModeOverlay />
        </>
      )}
    </div>
  )
}
