import React, { useState } from 'react';
import { 
  Shield, 
  Volume2, 
  VolumeX, 
  Mic, 
  Radio, 
  Activity, 
  Cpu, 
  Layers, 
  Sparkles, 
  BellRing,
  Globe
} from 'lucide-react';
import { ArcReactor } from './components/ArcReactor';
import { RegionalWidget } from './components/RegionalWidget';
import { SystemTelemetry } from './components/SystemTelemetry';
import { TaskManager } from './components/TaskManager';
import { ChatInterface } from './components/ChatInterface';
import { NotesVault } from './components/NotesVault';
import { DevelopmentTerminal } from './components/DevelopmentTerminal';
import { playSound } from './utils/audio';

export function App() {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [voiceState, setVoiceState] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TASKS' | 'TERMINAL' | 'VAULT'>('OVERVIEW');
  const [statusMessage, setStatusMessage] = useState<string>('SYSTEM PROTOCOLS RUNNING AT 100% NOMINAL EFFICIENCY');

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) playSound('beep', true);
  };

  const toggleVoice = () => {
    const next = !voiceEnabled;
    setVoiceEnabled(next);
    playSound('beep', soundEnabled);
  };

  const handleTriggerAction = (actionName: string) => {
    setStatusMessage(`PROTOCOL EXECUTED: ${actionName.toUpperCase()} CYCLE COMPLETE`);
    playSound('acknowledge', soundEnabled);
    setTimeout(() => {
      setStatusMessage('SYSTEM PROTOCOLS RUNNING AT 100% NOMINAL EFFICIENCY');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#030611] text-cyan-100 hud-grid-bg flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Stark Navigation HUD Bar */}
      <header className="border-b border-cyan-500/30 bg-[#040816]/90 backdrop-blur-md sticky top-0 z-50 px-4 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logo & System ID */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-cyan-950 border border-cyan-400 shadow-[0_0_12px_#22d3ee]">
              <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-hud text-base sm:text-lg font-black tracking-widest text-cyan-300 hud-glow-text">
                  JARVES
                </span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                  MARK IV // MY-NODE
                </span>
              </div>
              <div className="text-[10px] font-tech text-cyan-400/70 tracking-wider">
                EXECUTIVE INTELLIGENCE & PRODUCTIVITY SYSTEM
              </div>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <div className="flex items-center bg-[#020713] p-1 rounded-lg border border-cyan-500/20">
            {(['OVERVIEW', 'TASKS', 'TERMINAL', 'VAULT'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  playSound('beep', soundEnabled);
                }}
                className={`px-3 py-1 rounded font-hud text-[11px] tracking-wider transition-all ${
                  activeTab === tab
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.3)] font-semibold'
                    : 'text-cyan-400/60 hover:text-cyan-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Quick Controls & Status Toggles */}
          <div className="flex items-center gap-2">
            {/* Audio SFX Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-lg border transition-all ${
                soundEnabled
                  ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300 hover:border-cyan-400'
                  : 'bg-[#030814] border-cyan-500/10 text-cyan-500/40 hover:text-cyan-400'
              }`}
              title={soundEnabled ? 'Disable SFX' : 'Enable SFX'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Voice Speech Toggle */}
            <button
              onClick={toggleVoice}
              className={`p-2 rounded-lg border transition-all ${
                voiceEnabled
                  ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.3)]'
                  : 'bg-[#030814] border-cyan-500/10 text-cyan-500/40 hover:text-cyan-400'
              }`}
              title={voiceEnabled ? 'British Voice Synthesis Active' : 'Voice Synthesis Muted'}
            >
              <Radio className="w-4 h-4" />
            </button>

            {/* Online Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 bg-[#030a18] px-2.5 py-1.5 rounded-lg border border-cyan-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
              <span className="font-hud text-[10px] text-cyan-300 tracking-wider">
                ONLINE // KL NODE
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Command Dashboard */}
      <main className="max-w-7xl mx-auto w-full p-3 sm:p-5 flex-1 space-y-4">
        {/* Holographic Arc Reactor Hero Banner */}
        <section className="hud-panel p-4 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Hero Context */}
          <div className="flex-1 text-center md:text-left z-10">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin-slow" />
              <span className="font-hud text-xs tracking-widest text-cyan-400 uppercase font-semibold">
                Autonomous Executive Assistant
              </span>
            </div>
            <h1 className="font-hud text-xl sm:text-3xl font-black text-cyan-100 tracking-wider mb-2">
              WELCOME BACK, <span className="text-cyan-400 hud-glow-text">COMMANDER</span>.
            </h1>
            <p className="text-xs sm:text-sm text-cyan-200/80 font-tech leading-relaxed max-w-xl">
              Jarves is configured with the Tony Stark executive protocol, integrating live voice synthesis, Malaysian regional time & telemetry, proactive task matrix management, and real-time neural diagnostics.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-2">
              <button
                onClick={() => handleTriggerAction('Morning Executive Briefing')}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#030814] font-hud text-xs font-bold tracking-wider transition-all shadow-[0_0_12px_rgba(34,211,238,0.5)] cursor-pointer"
              >
                DAILY BRIEFING
              </button>
              <button
                onClick={() => handleTriggerAction('Security & Thermal Scan')}
                className="px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-200 font-hud text-xs tracking-wider transition-all cursor-pointer"
              >
                RUN SCAN
              </button>
              <button
                onClick={() => {
                  setActiveTab('TERMINAL');
                  playSound('activate', soundEnabled);
                }}
                className="px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-200 font-hud text-xs tracking-wider transition-all cursor-pointer"
              >
                CODE TERMINAL
              </button>
            </div>
          </div>

          {/* Interactive Arc Reactor Core */}
          <div className="z-10 flex-shrink-0">
            <ArcReactor
              status={voiceState}
              onClick={() => {
                playSound('activate', soundEnabled);
                setVoiceState(prev => (prev === 'idle' ? 'speaking' : 'idle'));
              }}
            />
          </div>

          {/* Subtle Ambient Decorative Grid Accents */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-cyan-500/5 to-transparent pointer-events-none" />
        </section>

        {/* Dynamic View Router */}
        {activeTab === 'OVERVIEW' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Column: Regional & System Telemetry */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              <RegionalWidget soundEnabled={soundEnabled} />
              <SystemTelemetry
                soundEnabled={soundEnabled}
                onTriggerAction={handleTriggerAction}
              />
            </div>

            {/* Right Column: Interactive AI Terminal */}
            <div className="lg:col-span-7 flex flex-col">
              <ChatInterface
                soundEnabled={soundEnabled}
                voiceEnabled={voiceEnabled}
                onVoiceStateChange={setVoiceState}
                onAddTaskRequested={title => {
                  setStatusMessage(`DIRECTIVE DETECTED VIA VOICE: "${title}"`);
                  playSound('acknowledge', soundEnabled);
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'TASKS' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8">
              <TaskManager soundEnabled={soundEnabled} />
            </div>
            <div className="lg:col-span-4 space-y-4">
              <RegionalWidget soundEnabled={soundEnabled} />
              <SystemTelemetry
                soundEnabled={soundEnabled}
                onTriggerAction={handleTriggerAction}
              />
            </div>
          </div>
        )}

        {activeTab === 'TERMINAL' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8">
              <DevelopmentTerminal soundEnabled={soundEnabled} />
            </div>
            <div className="lg:col-span-4 space-y-4">
              <SystemTelemetry
                soundEnabled={soundEnabled}
                onTriggerAction={handleTriggerAction}
              />
              <RegionalWidget soundEnabled={soundEnabled} />
            </div>
          </div>
        )}

        {activeTab === 'VAULT' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8">
              <NotesVault soundEnabled={soundEnabled} />
            </div>
            <div className="lg:col-span-4 space-y-4">
              <SystemTelemetry
                soundEnabled={soundEnabled}
                onTriggerAction={handleTriggerAction}
              />
              <RegionalWidget soundEnabled={soundEnabled} />
            </div>
          </div>
        )}
      </main>

      {/* Futuristic Telemetry Footer Status Ticker */}
      <footer className="border-t border-cyan-500/20 bg-[#020510]/95 px-4 py-2 text-[10px] font-mono text-cyan-400/70">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-cyan-300 font-semibold">{statusMessage}</span>
          </div>
          <div className="flex items-center gap-4 text-cyan-500/60">
            <span>NODE: ASIA-SE1 (KUALA LUMPUR)</span>
            <span>ENCRYPTION: AES-256-GCM</span>
            <span>CORE: ACTIVE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
