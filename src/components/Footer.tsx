import React from 'react'
import { AlertTriangle, Activity } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="glass-panel border-t border-border/80 pt-14 pb-16 relative z-10">
      <div className="max-w-content mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Prominent Amber Disclaimer Banner with Warm Glass Styling */}
        <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/25 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-700 dark:text-amber-300 shrink-0">
            <AlertTriangle className="w-6 h-6 text-amber" />
          </div>
          <div className="space-y-1 text-xs text-amber-950 dark:text-amber-100">
            <h4 className="font-heading font-extrabold text-sm sm:text-base tracking-tight text-amber-950 dark:text-amber-100">
              Mandatory Clinical Disclaimer · For Educational & Research Use Only
            </h4>
            <p className="leading-relaxed text-amber-900/90 dark:text-amber-200/90">
              AI Skin Scanner is an experimental clinical decision-support and educational interface. The generated reports represent visual AI classification hypotheses and must never substitute for an in-person medical evaluation, dermatoscopic inspection, or histological biopsy by a licensed physician or board-certified dermatologist. If you have an acute rash or suspect a serious infection, seek immediate healthcare assistance.
            </p>
          </div>
        </div>

        {/* Footer Meta Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-6 border-t border-border/60 text-xs">
          
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-glowPrimary">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading font-extrabold text-lg text-text">
                AI Skin Scanner
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-violet-500/10 text-primary border border-primary/20 dark:text-primary-light font-semibold">
                CLINICAL v2.4
              </span>
            </div>
            <p className="text-text-muted text-xs leading-relaxed max-w-md">
              A calm, localized skin lesion and rash classification system. Engineered with Claude Vision, TypeScript, Zustand, and Supabase.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-muted block">
              Navigation
            </span>
            <ul className="space-y-2 text-text-body font-medium">
              <li>
                <a href="#home" className="hover:text-primary transition-colors">
                  Home & Overview
                </a>
              </li>
              <li>
                <a href="#scan" className="hover:text-primary transition-colors">
                  Scan Studio
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-muted block">
              Ethical AI Standard
            </span>
            <ul className="space-y-1.5 text-text-muted text-[11px]">
              <li>Zero raw imagery stored</li>
              <li>Encrypted in-memory payload</li>
              <li>Session-isolated RLS security</li>
              <li>WCAG AA accessible interface</li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted font-mono">
          <div className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} AI Skin Scanner. For educational use only.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Calm & Precise Clinical SaaS</span>
            <span>·</span>
            <span>All algorithms simulated</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
