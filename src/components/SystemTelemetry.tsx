import React, { useState, useEffect } from 'react';
import { Activity, Cpu, Database, Wifi, Shield, Zap, AlertTriangle } from 'lucide-react';
import { SystemTelemetryState } from '../types';
import { playSound } from '../utils/audio';

interface SystemTelemetryProps {
  soundEnabled: boolean;
  onTriggerAction?: (actionName: string) => void;
}

export const SystemTelemetry: React.FC<SystemTelemetryProps> = ({
  soundEnabled,
  onTriggerAction,
}) => {
  const [telemetry, setTelemetry] = useState<SystemTelemetryState>({
    coreTemp: 34.2,
    reactorOutput: 3.25,
    memoryLoad: 18.4,
    networkLatency: 14,
    neuralCoherence: 99.8,
    defenseProtocol: 'OPTIMAL',
    activeNodes: 12,
  });

  const [isScanning, setIsScanning] = useState<boolean>(false);

  // Subtle real-time dynamic jitter to simulate live sensors
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        ...prev,
        coreTemp: +(34 + (Math.random() * 1.8 - 0.9)).toFixed(1),
        reactorOutput: +(3.2 + (Math.random() * 0.1 - 0.05)).toFixed(2),
        memoryLoad: +(18 + (Math.random() * 3 - 1.5)).toFixed(1),
        networkLatency: Math.floor(12 + Math.random() * 5),
        neuralCoherence: +(99.5 + (Math.random() * 0.4)).toFixed(1),
      }));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const handleRunDiagnostics = () => {
    setIsScanning(true);
    playSound('scan', soundEnabled);
    setTimeout(() => {
      setIsScanning(false);
      playSound('acknowledge', soundEnabled);
      if (onTriggerAction) onTriggerAction('Diagnostics');
    }, 1200);
  };

  const toggleDefenseProtocol = () => {
    playSound('alert', soundEnabled);
    setTelemetry(prev => ({
      ...prev,
      defenseProtocol:
        prev.defenseProtocol === 'OPTIMAL'
          ? 'ELEVATED'
          : prev.defenseProtocol === 'ELEVATED'
          ? 'STANDBY'
          : 'OPTIMAL',
    }));
  };

  return (
    <div className="hud-panel hud-corner-tl p-4 rounded-xl border border-cyan-500/20 text-xs">
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="font-hud tracking-wider text-cyan-300 font-semibold text-xs">
            LIVE SYSTEM DIAGNOSTICS // PROTOCOL MK-IV
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[10px] text-emerald-400">TELEMETRY NOMINAL</span>
        </div>
      </div>

      {/* Grid of Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
        {/* Core Temp */}
        <div className="bg-[#030914] p-2.5 rounded-lg border border-cyan-500/20">
          <div className="flex items-center justify-between text-cyan-400/70 mb-1">
            <span className="font-hud text-[10px]">CORE TEMP</span>
            <Zap className="w-3 h-3 text-amber-400" />
          </div>
          <div className="font-hud text-lg font-bold text-cyan-200">
            {telemetry.coreTemp}°C
          </div>
          <div className="w-full bg-cyan-950/60 h-1.5 rounded-full overflow-hidden mt-1.5">
            <div
              className="bg-gradient-to-r from-cyan-400 to-amber-400 h-full transition-all duration-500"
              style={{ width: `${(telemetry.coreTemp / 70) * 100}%` }}
            />
          </div>
        </div>

        {/* Reactor Output */}
        <div className="bg-[#030914] p-2.5 rounded-lg border border-cyan-500/20">
          <div className="flex items-center justify-between text-cyan-400/70 mb-1">
            <span className="font-hud text-[10px]">ARC OUTPUT</span>
            <Zap className="w-3 h-3 text-cyan-400" />
          </div>
          <div className="font-hud text-lg font-bold text-cyan-200">
            {telemetry.reactorOutput} TW
          </div>
          <div className="w-full bg-cyan-950/60 h-1.5 rounded-full overflow-hidden mt-1.5">
            <div
              className="bg-cyan-400 h-full transition-all duration-500 shadow-[0_0_8px_#22d3ee]"
              style={{ width: `${(telemetry.reactorOutput / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Memory Load */}
        <div className="bg-[#030914] p-2.5 rounded-lg border border-cyan-500/20">
          <div className="flex items-center justify-between text-cyan-400/70 mb-1">
            <span className="font-hud text-[10px]">BUFFER LOAD</span>
            <Database className="w-3 h-3 text-cyan-400" />
          </div>
          <div className="font-hud text-lg font-bold text-cyan-200">
            {telemetry.memoryLoad}%
          </div>
          <div className="w-full bg-cyan-950/60 h-1.5 rounded-full overflow-hidden mt-1.5">
            <div
              className="bg-emerald-400 h-full transition-all duration-500"
              style={{ width: `${telemetry.memoryLoad}%` }}
            />
          </div>
        </div>

        {/* Latency */}
        <div className="bg-[#030914] p-2.5 rounded-lg border border-cyan-500/20">
          <div className="flex items-center justify-between text-cyan-400/70 mb-1">
            <span className="font-hud text-[10px]">PING / ASIA-PAC</span>
            <Wifi className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="font-hud text-lg font-bold text-cyan-200">
            {telemetry.networkLatency} ms
          </div>
          <div className="w-full bg-cyan-950/60 h-1.5 rounded-full overflow-hidden mt-1.5">
            <div
              className="bg-emerald-400 h-full transition-all duration-500"
              style={{ width: `${Math.min(100, (telemetry.networkLatency / 50) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Protocol Bar & Quick Triggers */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-cyan-500/10">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDefenseProtocol}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-hud text-[10px] tracking-wider transition-all border ${
              telemetry.defenseProtocol === 'OPTIMAL'
                ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
                : telemetry.defenseProtocol === 'ELEVATED'
                ? 'bg-amber-950/50 border-amber-500/40 text-amber-300 hover:bg-amber-900/50'
                : 'bg-red-950/50 border-red-500/40 text-red-300 hover:bg-red-900/50'
            }`}
          >
            <Shield className="w-3 h-3" />
            <span>SECURITY: {telemetry.defenseProtocol}</span>
          </button>

          <span className="font-mono text-[10px] text-cyan-400/60 hidden sm:inline">
            NEURAL COHERENCE: <strong className="text-cyan-200">{telemetry.neuralCoherence}%</strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleRunDiagnostics}
            disabled={isScanning}
            className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/30 font-hud text-[10px] tracking-wider flex items-center gap-1 transition-colors"
          >
            <Cpu className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'DIAGNOSTIC RUNNING...' : 'SYSTEM SCAN'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
