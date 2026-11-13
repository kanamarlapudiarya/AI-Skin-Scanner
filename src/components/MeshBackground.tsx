import React from 'react'

export const MeshBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* 1. Base Mesh Gradient Blobs (Blush pink, Lavender, Mint, Sky blue) */}
      
      {/* Blush Pink Blob (Top Left / Center) */}
      <div
        className="absolute -top-[12%] left-[10%] w-[520px] h-[520px] rounded-full blur-[110px] opacity-40 dark:opacity-30 animate-drift-1 transition-opacity"
        style={{
          background: 'radial-gradient(circle, #F472B6 0%, #FBCFE8 70%, transparent 100%)',
        }}
      />

      {/* Lavender / Indigo Orb (Top Right) */}
      <div
        className="absolute top-[5%] -right-[8%] w-[580px] h-[580px] rounded-full blur-[130px] opacity-45 dark:opacity-35 animate-drift-2 transition-opacity"
        style={{
          background: 'radial-gradient(circle, #818CF8 0%, #C4B5FD 65%, transparent 100%)',
        }}
      />

      {/* Mint / Soft Teal Blob (Middle Left) */}
      <div
        className="absolute top-[42%] -left-[10%] w-[540px] h-[540px] rounded-full blur-[125px] opacity-35 dark:opacity-25 animate-drift-3 transition-opacity"
        style={{
          background: 'radial-gradient(circle, #2DD4BF 0%, #A7F3D0 70%, transparent 100%)',
        }}
      />

      {/* Sky Blue / Soft Violet Blob (Middle Right) */}
      <div
        className="absolute top-[60%] right-[5%] w-[480px] h-[480px] rounded-full blur-[120px] opacity-40 dark:opacity-30 animate-drift-1 transition-opacity"
        style={{
          background: 'radial-gradient(circle, #38BDF8 0%, #BAE6FD 70%, transparent 100%)',
        }}
      />

      {/* Warm Amber / Peach Glow (Bottom Left) */}
      <div
        className="absolute -bottom-[8%] left-[20%] w-[500px] h-[500px] rounded-full blur-[130px] opacity-30 dark:opacity-20 animate-drift-2 transition-opacity"
        style={{
          background: 'radial-gradient(circle, #FBBF24 0%, #FED7AA 70%, transparent 100%)',
        }}
      />

      {/* Subtle Noise / Radial Vignette for Depth */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-bg/40 dark:to-bg-dark/60 pointer-events-none" />
    </div>
  )
}
