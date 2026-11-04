import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Tag, Save, FileText } from 'lucide-react';
import { NoteItem } from '../types';
import { playSound } from '../utils/audio';

interface NotesVaultProps {
  soundEnabled: boolean;
}

export const NotesVault: React.FC<NotesVaultProps> = ({ soundEnabled }) => {
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    try {
      const saved = localStorage.getItem('jarves_notes');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not load notes', e);
    }
    return [
      {
        id: '1',
        title: 'Project Astrella - Regional Core Expansion',
        content: `Target: Deploy distributed AI inference nodes across Kuala Lumpur and Cyberjaya datacenters.\nLatency target: < 15ms.\nEncryption standard: Quantum-resistant Kyber-1024.`,
        tags: ['Architecture', 'Malaysia', 'Core'],
        updatedAt: Date.now() - 10000000,
      },
      {
        id: '2',
        title: 'Mark IV Telemetry Calibration Parameters',
        content: `Arc Reactor pulse frequency: 432 Hz\nThermal stabilization coolant flow: 1.4 L/min\nDefense threshold: Level 2 Elevated`,
        tags: ['Diagnostics', 'Hardware'],
        updatedAt: Date.now() - 40000000,
      },
    ];
  });

  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || '');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('jarves_notes', JSON.stringify(notes));
    } catch (e) {
      console.warn('Failed to save notes', e);
    }
  }, [notes]);

  const activeNote = notes.find(n => n.id === activeNoteId) || notes[0];

  const handleCreateNote = () => {
    const newNote: NoteItem = {
      id: Date.now().toString(),
      title: 'New Executive Directive',
      content: 'Enter classified intel or directive details here...',
      tags: ['General'],
      updatedAt: Date.now(),
    };

    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    setIsEditing(true);
    playSound('activate', soundEnabled);
  };

  const handleUpdateActiveNote = (updates: Partial<NoteItem>) => {
    if (!activeNote) return;
    setNotes(prev =>
      prev.map(n =>
        n.id === activeNote.id
          ? { ...n, ...updates, updatedAt: Date.now() }
          : n
      )
    );
  };

  const handleDeleteNote = (id: string) => {
    playSound('beep', soundEnabled);
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    if (activeNoteId === id && updated.length > 0) {
      setActiveNoteId(updated[0].id);
    }
  };

  return (
    <div className="hud-panel hud-corner-tl p-4 rounded-xl border border-cyan-500/20 text-xs flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span className="font-hud tracking-wider text-cyan-300 font-semibold text-xs">
            INTELLIGENCE VAULT // EXECUTIVE LOGS
          </span>
        </div>
        <button
          onClick={handleCreateNote}
          className="flex items-center gap-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/30 px-2 py-1 rounded font-hud text-[10px] transition-colors"
        >
          <Plus className="w-3 h-3" />
          <span>NEW LOG</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1 min-h-[220px]">
        {/* Note List sidebar */}
        <div className="space-y-1.5 overflow-y-auto max-h-[260px] pr-1 border-r border-cyan-500/10 md:pr-2">
          {notes.map(note => (
            <div
              key={note.id}
              onClick={() => {
                setActiveNoteId(note.id);
                playSound('beep', soundEnabled);
              }}
              className={`p-2 rounded cursor-pointer transition-all border text-left ${
                activeNote?.id === note.id
                  ? 'bg-cyan-950/60 border-cyan-400/50 text-cyan-200 shadow-[0_0_8px_rgba(6,182,212,0.2)]'
                  : 'bg-[#030914] border-cyan-500/10 text-cyan-400/70 hover:border-cyan-500/30'
              }`}
            >
              <div className="font-hud text-[11px] truncate font-semibold mb-0.5">
                {note.title}
              </div>
              <div className="text-[10px] text-cyan-500/50 truncate font-mono">
                {note.content}
              </div>
            </div>
          ))}
        </div>

        {/* Note Content display/edit */}
        <div className="md:col-span-2 flex flex-col justify-between bg-[#030914] p-3 rounded-lg border border-cyan-500/20">
          {activeNote ? (
            <>
              <div>
                <div className="flex items-center justify-between border-b border-cyan-500/10 pb-2 mb-2">
                  <input
                    type="text"
                    value={activeNote.title}
                    onChange={e => handleUpdateActiveNote({ title: e.target.value })}
                    className="font-hud text-xs sm:text-sm font-bold text-cyan-200 bg-transparent border-none focus:outline-none w-full"
                  />
                  <button
                    onClick={() => handleDeleteNote(activeNote.id)}
                    className="text-cyan-500/40 hover:text-red-400 transition-colors p-1"
                    title="Delete log"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <textarea
                  value={activeNote.content}
                  onChange={e => handleUpdateActiveNote({ content: e.target.value })}
                  rows={8}
                  className="w-full bg-transparent text-cyan-100/90 text-xs font-mono leading-relaxed resize-none focus:outline-none"
                  placeholder="Record executive intelligence..."
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-cyan-500/10 text-[10px] font-mono text-cyan-500/60">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {activeNote.tags.join(', ')}
                </span>
                <span>AUTO-SAVED IN SECURE ENCLAVE</span>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-cyan-500/40 font-mono">
              Vault empty. Create a new directive log.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
