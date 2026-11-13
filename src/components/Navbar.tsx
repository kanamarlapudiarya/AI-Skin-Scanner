import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Copy, Check, Sparkles, Activity, Sun, Moon } from 'lucide-react'
import { useScanStore } from '@/store/useScanStore'

interface NavItem {
  id: string
  label: string
  href: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'scan', label: 'Scan', href: '#scan' },
]

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const { sessionId, activeSection, setActiveSection, copySessionId, theme, toggleTheme } = useScanStore()

  // Scroll-spy to detect active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140
      const sections = ['home', 'scan']

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const top = element.offsetTop
          const height = element.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [setActiveSection])

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.replace('#', '')
    const targetEl = document.getElementById(targetId)
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveSection(targetId)
      setMobileMenuOpen(false)
    }
  }

  const handleStartScanClick = () => {
    const scanEl = document.getElementById('scan')
    if (scanEl) {
      scanEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setMobileMenuOpen(false)
  }

  const handleCopySession = () => {
    copySessionId()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <header className="sticky top-3 z-40 w-full px-4 sm:px-6 transition-all duration-300">
      {/* Floating Glass Pill Container */}
      <div className="max-w-content mx-auto h-16 px-4 sm:px-6 rounded-full glass-pill shadow-glass border border-white/70 dark:border-white/10 flex items-center justify-between transition-colors">
        
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => scrollToSection(e, '#home')}
          className="flex items-center gap-2.5 focus:outline-none group select-none"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-glowPrimary group-hover:scale-105 group-hover:shadow-glowPrimaryHover transition-all">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-base sm:text-lg text-text tracking-tight flex items-center gap-1.5">
              <span>AI Skin Scanner</span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-violet-500/10 text-primary border border-primary/20 dark:text-primary-light">
                CLINICAL
              </span>
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-surface-2/60 dark:bg-white/5 p-1 rounded-full border border-border/60">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className={`relative px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'text-white'
                    : 'text-text-body hover:text-text-heading'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 rounded-full shadow-glowPrimary"
                    transition={{ type: 'spring', bounce: 0.25, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </a>
            )
          })}
        </nav>

        {/* Right Actions: Dark Mode + Session Pill + Start Scan */}
        <div className="hidden md:flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-text-body hover:text-text-heading bg-surface-2/60 dark:bg-white/5 hover:bg-surface-2 border border-border/60 transition-colors"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber" />
            ) : (
              <Moon className="w-4 h-4 text-primary" />
            )}
          </button>

          {/* Anonymous Session Badge */}
          <button
            onClick={handleCopySession}
            title="Click to copy your private anonymous session ID"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-text-muted hover:text-text-heading bg-surface-2/60 dark:bg-white/5 rounded-full border border-border/60 hover:border-primary/40 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-teal animate-pulse"></span>
            <span>ID: {sessionId.substring(0, 8)}</span>
            {copied ? (
              <Check className="w-3.5 h-3.5 text-risk-low" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-text-muted" />
            )}
          </button>

          {/* Primary CTA: Start Scan with gradient & glow */}
          <button
            onClick={handleStartScanClick}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 rounded-2xl shadow-glowPrimary hover:shadow-glowPrimaryHover hover:-translate-y-0.5 transition-all flex items-center gap-2 group"
          >
            <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform text-white/90" />
            <span>Start Scan</span>
          </button>
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-2">
          {/* Dark Mode Toggle Mobile */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-text-body bg-surface-2/70 dark:bg-white/5 border border-border/60"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber" /> : <Moon className="w-4 h-4 text-primary" />}
          </button>

          <button
            onClick={handleCopySession}
            className="px-2.5 py-1 text-[11px] font-mono text-text-muted bg-surface-2/70 dark:bg-white/5 rounded-full border border-border/60 flex items-center gap-1"
          >
            {sessionId.substring(0, 6)}..
            {copied ? <Check className="w-3 h-3 text-risk-low" /> : <Copy className="w-3 h-3" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-text-body hover:text-text-heading hover:bg-surface-2/60 transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-2 max-w-content mx-auto rounded-3xl glass-panel p-4 shadow-modal border border-white/60 dark:border-white/10"
          >
            <div className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-glowPrimary'
                      : 'text-text-body hover:bg-surface-2/60'
                  }`}
                >
                  {item.label}
                </a>
              ))}

              <div className="pt-3 border-t border-border/60 mt-1 flex flex-col gap-2.5">
                <button
                  onClick={handleStartScanClick}
                  className="w-full py-3 text-center text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 rounded-2xl shadow-glowPrimary"
                >
                  Start Scan
                </button>
                <div className="text-[11px] font-mono text-text-muted text-center flex items-center justify-center gap-1.5 py-1">
                  <span>Session: {sessionId}</span>
                  <button onClick={handleCopySession} className="text-primary hover:underline font-semibold">
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
