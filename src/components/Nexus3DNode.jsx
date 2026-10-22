import React from 'react';

export default function Nexus3DNode() {
  return (
    <div className="w-full h-full relative flex items-center justify-center select-none pointer-events-none" style={{ minHeight: '380px' }}>
      
      {/* Radial Ambient Core Glow */}
      <div className="absolute w-72 h-72 rounded-full bg-nexus-emerald/15 blur-3xl animate-pulse" />
      <div className="absolute w-56 h-56 rounded-full bg-nexus-cyan/20 blur-2xl" />

      {/* Outer Counter-Rotating Ring */}
      <div className="absolute w-80 h-80 rounded-full border border-nexus-emerald/20 border-dashed animate-[spin_24s_linear_infinite]" />
      
      {/* Middle Orbital Ring (Cyan) */}
      <div className="absolute w-64 h-64 rounded-full border border-nexus-cyan/35 border-t-nexus-cyan animate-[spin_12s_linear_infinite]" 
           style={{ transform: 'rotateX(65deg) rotateY(20deg)' }} />

      {/* Cross-Axis Orbital Ring (Emerald) */}
      <div className="absolute w-64 h-64 rounded-full border border-nexus-emerald/40 border-b-nexus-emerald animate-[spin_16s_linear_infinite_reverse]" 
           style={{ transform: 'rotateX(-60deg) rotateY(-30deg)' }} />

      {/* Central Holographic Geodesic Core */}
      <div className="relative w-44 h-44 flex items-center justify-center">
        
        {/* Core Glowing Sphere */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#00F0FF]/30 via-[#00FF9D]/20 to-transparent backdrop-blur-md border border-nexus-emerald/40 shadow-[0_0_35px_rgba(0,255,157,0.35)]" />
        
        {/* Inner Pulsing Node */}
        <div className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-[#00FF9D] to-[#00F0FF] opacity-80 blur-sm animate-pulse" />
        <div className="absolute w-16 h-16 rounded-full bg-[#040B0E]/80 border border-white/20 flex items-center justify-center shadow-inner">
          <div className="w-6 h-6 rounded-full bg-nexus-emerald animate-ping opacity-75" />
          <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_12px_#00FF9D]" />
        </div>

        {/* 3D Wireframe Polyhedron Simulation (SVG Matrix) */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-nexus-emerald/40 animate-[spin_30s_linear_infinite]" fill="none" stroke="currentColor" strokeWidth="1">
          <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" stroke="currentColor" strokeOpacity="0.4" />
          <polygon points="50,20 80,35 80,65 50,80 20,65 20,35" stroke="#00F0FF" strokeOpacity="0.5" strokeDasharray="2,2" />
          <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeOpacity="0.25" />
          <line x1="10" y1="25" x2="90" y2="75" stroke="currentColor" strokeOpacity="0.25" />
          <line x1="10" y1="75" x2="90" y2="25" stroke="currentColor" strokeOpacity="0.25" />
        </svg>

        {/* Orbiting Satellite Data Beads */}
        <div className="absolute w-full h-full animate-[spin_8s_linear_infinite]">
          <div className="w-2.5 h-2.5 rounded-full bg-nexus-cyan shadow-[0_0_10px_#00F0FF] absolute top-1 left-1/2 -translate-x-1/2" />
        </div>
        <div className="absolute w-full h-full animate-[spin_10s_linear_infinite_reverse]">
          <div className="w-2 h-2 rounded-full bg-nexus-emerald shadow-[0_0_8px_#00FF9D] absolute bottom-2 right-4" />
        </div>
      </div>

      {/* Floating RAM Forensics HUD Badge */}
      <div className="absolute bottom-2 px-3 py-1 rounded-full bg-black/60 border border-nexus-emerald/30 text-[10px] font-mono text-nexus-emerald flex items-center gap-1.5 shadow-lg backdrop-blur-md">
        <span className="w-1.5 h-1.5 rounded-full bg-nexus-emerald animate-ping" />
        <span>LOCAL IN-RAM CRYPTOGRAPHIC NODE</span>
      </div>

    </div>
  );
}
