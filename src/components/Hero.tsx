import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, ShieldCheck, Clock, CheckCircle2, ChevronRight, Activity, Star } from 'lucide-react'

export const Hero: React.FC = () => {
  const [concordanceWidth, setConcordanceWidth] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setConcordanceWidth(76)
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  const scrollToScan = () => {
    const el = document.getElementById('scan')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const steps = [
    { num: '01', title: 'Upload Photo', desc: 'Sharp close-up' },
    { num: '02', title: 'Add Context', desc: 'Location & symptoms' },
    { num: '03', title: 'Sonar Analysis', desc: 'Pattern mapping' },
    { num: '04', title: 'Clinical Report', desc: 'Structured guidance' },
  ]

  // Staggered fade-up variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  }

  return (
    <section id="home" className="pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden relative">
      
      {/* 2-3 Floating Blurred Gradient Orbs Behind Hero */}
      <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full blur-[100px] opacity-35 dark:opacity-25 bg-gradient-to-tr from-pink-400 to-indigo-400 animate-drift-1 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full blur-[115px] opacity-30 dark:opacity-20 bg-gradient-to-bl from-teal-300 to-indigo-500 animate-drift-2 pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-64 h-64 rounded-full blur-[90px] opacity-25 dark:opacity-15 bg-gradient-to-r from-amber-300 to-pink-400 animate-drift-3 pointer-events-none" />

      <div className="max-w-content mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Main Two-Column Hero Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"
        >
          
          {/* Left Column (Content & CTAs) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Eyebrow Pill */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-white/10 backdrop-blur-md text-primary dark:text-primary-light border border-indigo-200/50 dark:border-indigo-500/20 text-xs font-semibold mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
              <span>AI-powered skin analysis · Educational</span>
            </motion.div>

            {/* H1 Heading with Decorative Sparkles */}
            <motion.div variants={itemVariants} className="relative">
              {/* Decorative floating sparkles/dots */}
              <motion.span
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.15, 0.9, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 -left-4 text-pink-400 dark:text-pink-300 opacity-80 pointer-events-none"
              >
                <Sparkles className="w-5 h-5" />
              </motion.span>
              <motion.span
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute top-2 right-10 text-amber-400 opacity-70 pointer-events-none hidden sm:inline-block"
              >
                <Star className="w-4 h-4 fill-amber-400" />
              </motion.span>
              
              <h1 className="text-[44px] sm:text-[56px] lg:text-[70px] font-heading font-extrabold tracking-tight text-text leading-[1.06] mb-6">
                Know your skin.{' '}
                <span className="text-gradient-act block sm:inline">Act with clarity.</span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p variants={itemVariants} className="text-base sm:text-lg text-text-body max-w-xl leading-relaxed mb-8">
              Upload a close-up photo, add a little context, and get a structured classification of your skin lesion or rash in seconds.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
              {/* Primary Button */}
              <button
                onClick={scrollToScan}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold text-sm shadow-glowPrimary hover:shadow-glowPrimaryHover hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 group"
              >
                <Sparkles className="w-4 h-4 text-white/95 group-hover:rotate-12 transition-transform" />
                <span>Analyze my skin</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Stats Row (3 small soft tinted cards with coloured icon circles) */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
              {/* Stat 1: Teal */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-xs hover:shadow-sm transition-all">
                <div className="w-8 h-8 rounded-full bg-teal-500/15 text-teal flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-teal" />
                </div>
                <div className="text-xs">
                  <span className="font-heading font-extrabold text-text text-sm block">85+</span>
                  <span className="text-text-muted text-[11px]">conditions</span>
                </div>
              </div>

              {/* Stat 2: Indigo */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-xs hover:shadow-sm transition-all">
                <div className="w-8 h-8 rounded-full bg-indigo-500/15 text-primary flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div className="text-xs">
                  <span className="font-heading font-extrabold text-text text-sm block">~10 sec</span>
                  <span className="text-text-muted text-[11px]">analysis</span>
                </div>
              </div>

              {/* Stat 3: Pink */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-xs hover:shadow-sm transition-all">
                <div className="w-8 h-8 rounded-full bg-pink-500/15 text-pink flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-pink" />
                </div>
                <div className="text-xs">
                  <span className="font-heading font-extrabold text-text text-sm block">0 stored</span>
                  <span className="text-text-muted text-[11px]">images kept</span>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Result Card with Glassmorphism & Coloured Top Accent Strip */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Glowing Backdrop Ring behind card */}
            <div className="absolute inset-0 -m-6 rounded-full bg-gradient-to-tr from-indigo-500/20 via-pink-500/20 to-teal-400/20 blur-2xl pointer-events-none" />

            {/* Frosted Mock Card with gentle float & 24px radius */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-full max-w-[390px] backdrop-blur-xl bg-white/80 dark:bg-[#1a1444]/80 rounded-card-24 p-6 border border-white/90 dark:border-white/15 shadow-2xl hover:shadow-cardHover hover:scale-[1.01] transition-all z-10 animate-float overflow-hidden"
            >
              {/* Coloured Top Accent Strip */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-400 via-indigo-500 to-pink-500" />

              {/* Badges Row */}
              <div className="flex items-center justify-between gap-2 mb-4 pt-1">
                {/* Chip 1: SIMULATED ANALYSIS in amber */}
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                  SIMULATED ANALYSIS
                </span>
                
                {/* Chip 2: MODERATE in orange to pink gradient */}
                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-pink-500 text-white shadow-sm shadow-pink-500/25">
                  MODERATE
                </span>
              </div>

              {/* Classification Title & Summary */}
              <div className="mb-4">
                <span className="text-[11px] font-mono text-text-muted uppercase tracking-wider block mb-1">
                  Primary Classification
                </span>
                <h3 className="text-xl font-heading font-extrabold text-text">
                  Seborrheic Dermatitis
                </h3>
                <p className="text-xs text-text-body mt-1 line-clamp-2">
                  Erythematous scaly plaques localized along facial sebum-dense zones.
                </p>
              </div>

              {/* Concordance Bar with Animated Gradient Fill (teal -> indigo -> pink) */}
              <div className="mb-5 bg-surface-2/70 dark:bg-white/5 p-3.5 rounded-2xl border border-border/60">
                <div className="flex justify-between items-center text-xs font-mono mb-2">
                  <span className="text-text-muted">Concordance</span>
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal via-indigo-500 to-pink">
                    76%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-border/40 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal via-primary to-pink rounded-full transition-all duration-1200 ease-out shadow-sm"
                    style={{ width: `${concordanceWidth}%` }}
                  />
                </div>
              </div>

              {/* Metadata Micro-grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-text-muted border-t border-border/60 pt-3">
                <div className="p-2 rounded-xl bg-surface-2/40 dark:bg-white/5">
                  <span className="text-text-muted/80 block text-[10px]">ANATOMY</span>
                  <span className="text-text font-semibold">Head / Face</span>
                </div>
                <div className="p-2 rounded-xl bg-surface-2/40 dark:bg-white/5">
                  <span className="text-text-muted/80 block text-[10px]">DURATION</span>
                  <span className="text-text font-semibold">1-4 weeks</span>
                </div>
              </div>

              {/* Floating Mini-Badge 1: ICD-10 Chip in Indigo */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-3.5 -right-2 px-3 py-1 bg-white/90 dark:bg-[#1a1444]/90 backdrop-blur-md rounded-full shadow-lg border border-indigo-200/60 dark:border-indigo-500/30 text-[11px] font-mono font-semibold text-primary dark:text-primary-light flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-primary" />
                ICD-10: L21.9
              </motion.div>

              {/* Floating Mini-Badge 2: Confidence in Teal/Emerald */}
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                className="absolute -bottom-3.5 -left-2 px-3.5 py-1 bg-white/90 dark:bg-[#1a1444]/90 backdrop-blur-md rounded-full shadow-lg border border-teal-200/60 dark:border-teal-500/30 text-[11px] font-mono font-semibold text-teal flex items-center gap-1.5"
              >
                <Activity className="w-3.5 h-3.5 text-teal" />
                Confidence: High (76%)
              </motion.div>
            </motion.div>
          </div>

        </motion.div>

        {/* 4-Step Sequence Strip Below Hero */}
        <div className="mt-16 md:mt-20 pt-8 border-t border-border/60">
          <div
            onClick={scrollToScan}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && scrollToScan()}
            className="group cursor-pointer rounded-3xl p-5 md:p-6 glass-panel hover:bg-white/90 dark:hover:bg-[#1a1444]/90 shadow-sm hover:shadow-cardHover transition-all"
          >
            <div className="text-center sm:text-left text-xs font-mono font-bold text-primary uppercase tracking-wider mb-4 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                Standard Clinical Workflow
              </span>
              <span className="text-[11px] text-text-muted font-normal group-hover:text-primary transition-colors flex items-center gap-1">
                Jump to scan studio <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
              {steps.map((st, idx) => (
                <div key={st.num} className="relative flex flex-col">
                  {/* Dashed connector line between items on desktop */}
                  {idx < steps.length - 1 && (
                    <div
                      className="hidden md:block absolute top-4 left-[60%] w-[80%] border-t-2 border-dashed border-border/80 group-hover:border-primary/50 transition-colors z-0"
                      aria-hidden="true"
                    />
                  )}

                  <div className="relative z-10 flex items-center gap-2.5 mb-1.5">
                    <div className="w-8 h-8 rounded-xl bg-surface-2/80 dark:bg-white/10 group-hover:bg-gradient-to-r group-hover:from-indigo-500 group-hover:to-violet-600 group-hover:text-white border border-border text-xs font-mono font-bold flex items-center justify-center text-text transition-all shadow-xs">
                      {st.num}
                    </div>
                    <span className="font-heading font-bold text-xs sm:text-sm text-text">
                      {st.title}
                    </span>
                  </div>
                  <span className="text-[11px] text-text-muted pl-10.5">
                    {st.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
