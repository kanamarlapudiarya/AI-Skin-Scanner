import React, { useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { ScanStudio } from '@/components/ScanStudio'
import { ConditionDetailModal } from '@/components/ConditionDetailModal'
import { Footer } from '@/components/Footer'
import { ToastContainer } from '@/components/ToastContainer'
import { MeshBackground } from '@/components/MeshBackground'
import { useScanStore } from '@/store/useScanStore'

export function App() {
  const { theme, selectedConditionId, setSelectedConditionId } = useScanStore()

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  // Sync URL hash with condition detail (/learn/:id or #learn/:id)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      const match = hash.match(/#learn\/([a-z0-9-]+)/i)
      if (match && match[1]) {
        setSelectedConditionId(match[1])
      }
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [setSelectedConditionId])

  return (
    <div className="min-h-screen bg-bg dark:bg-bg-dark text-text selection:bg-pink/20 selection:text-primary flex flex-col font-sans relative">
      {/* Soft Multi-Colour Mesh Gradient Overlay */}
      <MeshBackground />

      {/* Floating Glass Navbar */}
      <Navbar />

      {/* Main Single-Page Scrolling Content */}
      <main className="flex-1 relative z-10">
        {/* #home: Hero with CTA, stats, frosted card, 4-step sequence */}
        <Hero />

        {/* #scan: Scan Studio (wizard -> analyzing -> results, all in place) */}
        <ScanStudio />
      </main>

      {/* Footer with Disclaimer banner + credits */}
      <Footer />

      {/* Modals & Portals */}
      <ConditionDetailModal />
      <ToastContainer />
    </div>
  )
}

export default App
