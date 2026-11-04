import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, Sparkles, Terminal, RotateCcw, Copy, Check } from 'lucide-react';
import { ChatMessage } from '../types';
import { playSound, speakText, stopSpeech } from '../utils/audio';

interface ChatInterfaceProps {
  soundEnabled: boolean;
  voiceEnabled: boolean;
  onVoiceStateChange: (state: 'idle' | 'listening' | 'processing' | 'speaking') => void;
  onAddTaskRequested?: (title: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  soundEnabled,
  voiceEnabled,
  onVoiceStateChange,
  onAddTaskRequested,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'jarves',
      text: `Good day, sir. JARVES Mark IV is online and primed. All telemetry systems across the Malaysia regional node and quantum subroutines report nominal.\n\nHow may I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize SpeechRecognition if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        const recognition = new SpeechRecognitionClass();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          onVoiceStateChange('listening');
          playSound('activate', soundEnabled);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInput(transcript);
            handleSubmit(undefined, transcript);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition notice:', event.error);
          setIsListening(false);
          onVoiceStateChange('idle');
        };

        recognition.onend = () => {
          setIsListening(false);
          onVoiceStateChange('idle');
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      stopSpeech();
    };
  }, [soundEnabled, onVoiceStateChange]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use text input.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      onVoiceStateChange('idle');
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Could not start recognition:', err);
      }
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    playSound('beep', soundEnabled);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleReplayVoice = (text: string) => {
    onVoiceStateChange('speaking');
    speakText(
      text,
      voiceEnabled,
      () => onVoiceStateChange('speaking'),
      () => onVoiceStateChange('idle')
    );
  };

  const handleSubmit = async (e?: React.FormEvent, directMessage?: string) => {
    if (e) e.preventDefault();
    const query = (directMessage || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    onVoiceStateChange('processing');
    playSound('beep', soundEnabled);

    // Check if user is asking to add a task directly
    if (query.toLowerCase().startsWith('add task') || query.toLowerCase().startsWith('remind me to')) {
      const cleanTaskTitle = query.replace(/^(add task:?|remind me to)\s*/i, '');
      if (onAddTaskRequested && cleanTaskTitle) {
        onAddTaskRequested(cleanTaskTitle);
      }
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-4),
        }),
      });

      const data = await res.json();
      const replyText = data.reply || "I apologize, sir. An anomaly prevented signal resolution.";

      const jarvesMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'jarves',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, jarvesMsg]);
      playSound('acknowledge', soundEnabled);

      if (voiceEnabled) {
        onVoiceStateChange('speaking');
        speakText(
          replyText,
          true,
          () => onVoiceStateChange('speaking'),
          () => onVoiceStateChange('idle')
        );
      } else {
        onVoiceStateChange('idle');
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'jarves',
        text: "My apologies, sir. Communication relay timed out. Telemetry backup systems remain active.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
      onVoiceStateChange('idle');
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    { label: 'Morning Briefing', query: 'Jarves, give me a comprehensive morning executive briefing.' },
    { label: 'System Scan', query: 'Jarves, run a diagnostic scan on quantum telemetry and security.' },
    { label: 'Malaysia Weather', query: 'What is the current atmospheric status for Kuala Lumpur and Penang?' },
    { label: 'Tech Capabilities', query: 'Who are you and what systems do you manage?' },
  ];

  return (
    <div className="hud-panel hud-corner-tl p-4 rounded-xl border border-cyan-500/20 text-xs flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-hud tracking-wider text-cyan-300 font-semibold text-xs">
            JARVES PROTOCOL TERMINAL // VOICE & TEXT HUD
          </span>
        </div>
        <div className="flex items-center gap-2">
          {voiceEnabled ? (
            <span className="flex items-center gap-1 font-mono text-[9px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              <Volume2 className="w-3 h-3" />
              VOICE ACTIVE
            </span>
          ) : (
            <span className="flex items-center gap-1 font-mono text-[9px] text-cyan-400/50 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
              <VolumeX className="w-3 h-3" />
              MUTED
            </span>
          )}
          <button
            onClick={() => {
              setMessages([
                {
                  id: Date.now().toString(),
                  sender: 'jarves',
                  text: 'Console history purged, sir. Standing by for fresh instructions.',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ]);
              playSound('beep', soundEnabled);
            }}
            className="text-cyan-400/60 hover:text-cyan-300 p-1 transition-colors"
            title="Reset Terminal Buffer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-3 max-h-[360px] min-h-[220px]">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1 px-1">
              <span className="font-hud text-[9px] font-bold tracking-wider text-cyan-400/70">
                {msg.sender === 'user' ? 'COMMANDER' : 'JARVES AI'}
              </span>
              <span className="text-[9px] font-mono text-cyan-500/50">{msg.timestamp}</span>
            </div>

            <div
              className={`p-3 rounded-lg max-w-[88%] text-xs leading-relaxed group relative transition-all ${
                msg.sender === 'user'
                  ? 'bg-cyan-950/60 text-cyan-100 border border-cyan-400/40 rounded-br-none shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                  : 'bg-[#030d22]/90 text-cyan-100 border border-cyan-500/25 rounded-bl-none shadow-[0_0_12px_rgba(34,211,238,0.1)]'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* Action Toolbar on Message Hover */}
              {msg.sender === 'jarves' && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 bottom-1.5 flex items-center gap-1 bg-[#030914]/90 px-1.5 py-0.5 rounded border border-cyan-500/30">
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="text-cyan-400 hover:text-cyan-200 p-0.5"
                    title="Copy response"
                  >
                    {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => handleReplayVoice(msg.text)}
                    className="text-cyan-400 hover:text-cyan-200 p-0.5"
                    title="Speak response"
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start flex-col">
            <div className="flex items-center gap-1.5 mb-1 px-1">
              <span className="font-hud text-[9px] font-bold tracking-wider text-cyan-400/70">JARVES AI</span>
              <span className="text-[9px] font-mono text-cyan-500/50">Processing</span>
            </div>
            <div className="bg-[#030d22] p-3 rounded-lg border border-cyan-500/25 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-mono text-cyan-300 text-xs tracking-wider">
                Consulting neural matrix...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none">
        <Sparkles className="w-3 h-3 text-cyan-400/60 shrink-0 ml-1" />
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSubmit(undefined, p.query)}
            disabled={loading}
            className="shrink-0 px-2.5 py-1 rounded-full bg-[#030b1c] hover:bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 font-hud text-[9px] tracking-wider transition-colors hover:border-cyan-400"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input Console Bar */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleListening}
          className={`p-2.5 rounded-lg border transition-all ${
            isListening
              ? 'bg-red-500/30 border-red-500 text-red-200 animate-pulse shadow-[0_0_12px_#ef4444]'
              : 'bg-[#030914] border-cyan-500/30 text-cyan-300 hover:text-cyan-100 hover:border-cyan-400'
          }`}
          title={isListening ? 'Listening (Click to stop)' : 'Click to speak (Voice Recognition)'}
        >
          {isListening ? <Mic className="w-4 h-4 text-red-400" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={isListening ? "Listening to your voice..." : "Direct JARVES command or inquiry..."}
          disabled={loading}
          className="flex-1 bg-[#030a18] border border-cyan-500/30 rounded-lg px-3 py-2 text-cyan-100 placeholder:text-cyan-800 focus:outline-none focus:border-cyan-400 text-xs"
        />

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-[#030814] p-2.5 rounded-lg font-bold transition-all shadow-[0_0_12px_rgba(34,211,238,0.5)] cursor-pointer disabled:cursor-not-allowed"
          title="Transmit Command"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
