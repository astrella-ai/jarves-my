import React from 'react';

interface ArcReactorProps {
  status: 'idle' | 'listening' | 'processing' | 'speaking';
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const ArcReactor: React.FC<ArcReactorProps> = ({
  status,
  onClick,
  size = 'md',
}) => {
  const sizeMap = {
    sm: 'w-24 h-24',
    md: 'w-44 h-44 sm:w-52 sm:h-52',
    lg: 'w-64 h-64 sm:w-72 sm:h-72',
  };

  const getStatusColor = () => {
    switch (status) {
      case 'listening':
        return {
          glow: 'rgba(239, 68, 68, 0.7)',
          accent: '#ef4444',
          border: 'border-red-500',
          text: 'text-red-400',
          label: 'VOICE CAPTURE ACTIVE',
        };
      case 'processing':
        return {
          glow: 'rgba(168, 85, 247, 0.7)',
          accent: '#c084fc',
          border: 'border-purple-500',
          text: 'text-purple-400',
          label: 'NEURAL COMPUTATION',
        };
      case 'speaking':
        return {
          glow: 'rgba(34, 197, 94, 0.7)',
          accent: '#4ade80',
          border: 'border-emerald-500',
          text: 'text-emerald-400',
          label: 'AUDIO TRANSMISSION',
        };
      case 'idle':
      default:
        return {
          glow: 'rgba(6, 182, 212, 0.6)',
          accent: '#22d3ee',
          border: 'border-cyan-500',
          text: 'text-cyan-400',
          label: 'SYSTEM NOMINAL',
        };
    }
  };

  const config = getStatusColor();

  return (
    <div className="flex flex-col items-center justify-center p-3 relative group">
      {/* Outer Glow Halo */}
      <div 
        className={`relative ${sizeMap[size]} flex items-center justify-center cursor-pointer select-none transition-transform duration-300 group-hover:scale-105`}
        onClick={onClick}
        title="JARVES Core Reactor (Click to test interaction)"
      >
        {/* Background Radial Glow */}
        <div 
          className="absolute inset-0 rounded-full blur-xl transition-all duration-700 opacity-60"
          style={{ backgroundColor: config.accent }}
        />

        {/* Outer Ring with Segments */}
        <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-spin-slow">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-1 bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-1 bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2 bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-2 bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
        </div>

        {/* Concentric Dashed Ring */}
        <div className="absolute inset-3 rounded-full border border-dashed border-cyan-400/40 animate-spin-reverse" />

        {/* Primary Stator Ring with 8 Segments */}
        <div className="absolute inset-6 rounded-full border-2 border-cyan-500/30 bg-[#040916]/80 backdrop-blur-sm flex items-center justify-center shadow-[inset_0_0_20px_rgba(6,182,212,0.3)]">
          {/* Inner Geometric Arcs */}
          <svg className="w-full h-full p-2" viewBox="0 0 100 100">
            {/* 8 Arc segments representing the reactor coils */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
              <g key={idx} transform={`rotate(${angle} 50 50)`}>
                <rect
                  x="47"
                  y="12"
                  width="6"
                  height="12"
                  rx="1"
                  fill={config.accent}
                  opacity={status === 'speaking' || status === 'processing' ? '0.9' : '0.65'}
                  className="transition-all duration-300"
                />
              </g>
            ))}

            {/* Inner Circular Track */}
            <circle
              cx="50"
              cy="50"
              r="22"
              fill="none"
              stroke={config.accent}
              strokeWidth="1.5"
              strokeDasharray="6 3"
              opacity="0.8"
            />
          </svg>

          {/* Core Center Lens */}
          <div className="absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-cyan-950 via-[#062438] to-cyan-500/40 border border-cyan-300/80 shadow-[0_0_25px_rgba(34,211,238,0.8)] flex items-center justify-center overflow-hidden">
            <div 
              className={`w-6 h-6 rounded-full transition-all duration-500 ${
                status === 'listening' ? 'bg-red-400 scale-125 animate-ping' :
                status === 'processing' ? 'bg-purple-400 animate-pulse' :
                status === 'speaking' ? 'bg-emerald-400 scale-110 shadow-[0_0_15px_#4ade80]' :
                'bg-cyan-300 shadow-[0_0_15px_#22d3ee] animate-pulse'
              }`}
            />
            {/* Center Grid Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
              <div className="w-full h-[1px] bg-cyan-200" />
              <div className="h-full w-[1px] bg-cyan-200 absolute" />
            </div>
          </div>
        </div>
      </div>

      {/* Telemetry Tag */}
      <div className="mt-3 flex flex-col items-center">
        <span className="font-hud text-[11px] tracking-widest text-cyan-400/80">
          MARK IV // QUANTUM CORE
        </span>
        <span className={`font-hud text-xs font-bold tracking-wider ${config.text} transition-colors duration-300 flex items-center gap-1.5`}>
          <span className={`inline-block w-2 h-2 rounded-full ${
            status === 'listening' ? 'bg-red-500 animate-ping' :
            status === 'processing' ? 'bg-purple-500 animate-pulse' :
            status === 'speaking' ? 'bg-emerald-500 animate-bounce' :
            'bg-cyan-400'
          }`} />
          {config.label}
        </span>
      </div>
    </div>
  );
};
