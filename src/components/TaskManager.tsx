import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Plus, Trash2, Calendar, Clock, AlertCircle, Filter, Tag, CheckSquare } from 'lucide-react';
import { TaskItem, PriorityLevel } from '../types';
import { playSound } from '../utils/audio';

interface TaskManagerProps {
  soundEnabled: boolean;
  onTaskCountChange?: (count: number) => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({
  soundEnabled,
  onTaskCountChange,
}) => {
  // Load initial tasks from local storage with realistic executive defaults
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const saved = localStorage.getItem('jarves_tasks');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not load tasks from storage', e);
    }
    return [
      {
        id: '1',
        title: 'Review Quarterly Malaysia Operations & Tech Hub Budget',
        priority: 'CRITICAL',
        completed: false,
        dueDate: 'Today',
        dueTime: '14:30',
        category: 'EXECUTIVE',
        createdAt: Date.now() - 3600000,
      },
      {
        id: '2',
        title: 'Verify Mark IV Arc Reactor Telemetry & Quantum Security Keys',
        priority: 'HIGH',
        completed: false,
        dueDate: 'Today',
        dueTime: '17:00',
        category: 'TECH',
        createdAt: Date.now() - 7200000,
      },
      {
        id: '3',
        title: 'Sync briefing with regional directors (KL & Singapore nodes)',
        priority: 'NORMAL',
        completed: true,
        dueDate: 'Today',
        dueTime: '10:00',
        category: 'MISSION',
        createdAt: Date.now() - 14400000,
      },
      {
        id: '4',
        title: 'Audit AI Studio deployment container specifications',
        priority: 'NORMAL',
        completed: false,
        dueDate: 'Tomorrow',
        dueTime: '11:00',
        category: 'TECH',
        createdAt: Date.now() - 86400000,
      },
    ];
  });

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<PriorityLevel>('HIGH');
  const [newTaskCategory, setNewTaskCategory] = useState<'MISSION' | 'TECH' | 'PERSONAL' | 'EXECUTIVE'>('EXECUTIVE');
  const [newTaskTime, setNewTaskTime] = useState('15:00');
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED' | 'CRITICAL'>('ALL');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('jarves_tasks', JSON.stringify(tasks));
      if (onTaskCountChange) {
        onTaskCountChange(tasks.filter(t => !t.completed).length);
      }
    } catch (e) {
      console.warn('Failed to save tasks', e);
    }
  }, [tasks, onTaskCountChange]);

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const updated = !t.completed;
          playSound(updated ? 'acknowledge' : 'beep', soundEnabled);
          return { ...t, completed: updated };
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    playSound('beep', soundEnabled);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: TaskItem = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      priority: newTaskPriority,
      completed: false,
      dueDate: 'Today',
      dueTime: newTaskTime,
      category: newTaskCategory,
      createdAt: Date.now(),
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');
    setShowAddForm(false);
    playSound('activate', soundEnabled);
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'PENDING') return !t.completed;
    if (filter === 'COMPLETED') return t.completed;
    if (filter === 'CRITICAL') return t.priority === 'CRITICAL';
    return true;
  });

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-300 border-red-500/40 shadow-[0_0_8px_rgba(239,68,68,0.3)]';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'NORMAL':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'ROUTINE':
        return 'bg-slate-700/30 text-slate-300 border-slate-600/40';
    }
  };

  return (
    <div className="hud-panel hud-corner-tl p-4 rounded-xl border border-cyan-500/20 text-xs flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-cyan-400" />
          <span className="font-hud tracking-wider text-cyan-300 font-semibold text-xs">
            EXECUTIVE AGENDA & OBJECTIVES // TASK MATRIX
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-cyan-400/80">
            {tasks.filter(t => !t.completed).length} PENDING
          </span>
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              playSound('beep', soundEnabled);
            }}
            className="flex items-center gap-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/30 px-2 py-1 rounded font-hud text-[10px] transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>NEW DIRECTIVE</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between mb-3 bg-[#030914] p-1.5 rounded-lg border border-cyan-500/10">
        <div className="flex items-center gap-1">
          <Filter className="w-3 h-3 text-cyan-400/60 ml-1 mr-1" />
          {(['ALL', 'PENDING', 'CRITICAL', 'COMPLETED'] as const).map(f => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                playSound('beep', soundEnabled);
              }}
              className={`px-2 py-0.5 rounded font-hud text-[10px] tracking-wider transition-colors ${
                filter === f
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40'
                  : 'text-cyan-400/60 hover:text-cyan-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <span className="text-[10px] text-cyan-400/60 font-mono pr-1">
          {filteredTasks.length} ITEMS
        </span>
      </div>

      {/* Add Task Collapsible Form */}
      {showAddForm && (
        <form onSubmit={handleAddTask} className="bg-[#030a18] p-3 rounded-lg border border-cyan-500/30 mb-3 space-y-2">
          <div>
            <label className="block text-[10px] font-hud text-cyan-400/80 mb-1">
              DIRECTIVE / ACTION ITEM
            </label>
            <input
              type="text"
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              placeholder="e.g. Schedule quantum security review with engineering lead"
              className="w-full bg-[#040814] border border-cyan-500/30 rounded p-2 text-cyan-100 placeholder:text-cyan-800 focus:outline-none focus:border-cyan-400 text-xs"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[9px] font-hud text-cyan-400/60 mb-1">PRIORITY</label>
              <select
                value={newTaskPriority}
                onChange={e => setNewTaskPriority(e.target.value as PriorityLevel)}
                className="w-full bg-[#040814] border border-cyan-500/30 rounded p-1 text-cyan-200 text-xs"
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="NORMAL">NORMAL</option>
                <option value="ROUTINE">ROUTINE</option>
              </select>
            </div>

            <div>
              <label className="block text-[9px] font-hud text-cyan-400/60 mb-1">SECTOR</label>
              <select
                value={newTaskCategory}
                onChange={e => setNewTaskCategory(e.target.value as any)}
                className="w-full bg-[#040814] border border-cyan-500/30 rounded p-1 text-cyan-200 text-xs"
              >
                <option value="EXECUTIVE">EXECUTIVE</option>
                <option value="TECH">TECH</option>
                <option value="MISSION">MISSION</option>
                <option value="PERSONAL">PERSONAL</option>
              </select>
            </div>

            <div>
              <label className="block text-[9px] font-hud text-cyan-400/60 mb-1">TIME (MYT)</label>
              <input
                type="text"
                value={newTaskTime}
                onChange={e => setNewTaskTime(e.target.value)}
                placeholder="14:00"
                className="w-full bg-[#040814] border border-cyan-500/30 rounded p-1 text-cyan-200 text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-2.5 py-1 text-cyan-400/70 hover:text-cyan-300 text-[10px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-[#030814] font-bold rounded font-hud text-[10px] tracking-wider transition-colors shadow-[0_0_10px_rgba(34,211,238,0.5)]"
            >
              COMMIT DIRECTIVE
            </button>
          </div>
        </form>
      )}

      {/* Task List */}
      <div className="space-y-2 overflow-y-auto max-h-[320px] pr-1 flex-1">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center text-cyan-500/40 font-mono text-xs">
            No active directives matching filter. All systems clear.
          </div>
        ) : (
          filteredTasks.map(task => (
            <div
              key={task.id}
              className={`p-2.5 rounded-lg border transition-all flex items-start gap-2.5 ${
                task.completed
                  ? 'bg-[#030814]/40 border-cyan-500/10 opacity-60'
                  : 'bg-[#030b1c]/90 border-cyan-500/25 hover:border-cyan-400/50'
              }`}
            >
              <button
                onClick={() => toggleTask(task.id)}
                className="mt-0.5 text-cyan-400 hover:text-cyan-300 transition-colors"
                title={task.completed ? 'Mark pending' : 'Mark completed'}
              >
                {task.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shadow-[0_0_6px_#34d399]" />
                ) : (
                  <Circle className="w-4 h-4 hover:fill-cyan-500/20" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span
                    className={`font-mono text-[9px] px-1.5 py-0.2 rounded border font-semibold ${getPriorityBadge(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                  <span className="text-[9px] text-cyan-400/60 font-mono bg-cyan-950/40 px-1.5 rounded">
                    {task.category}
                  </span>
                  {task.dueTime && (
                    <span className="flex items-center gap-1 text-[9px] text-cyan-400/70 font-mono">
                      <Clock className="w-2.5 h-2.5" />
                      {task.dueTime}
                    </span>
                  )}
                </div>

                <div
                  className={`text-xs font-medium leading-relaxed ${
                    task.completed ? 'line-through text-cyan-500/50' : 'text-cyan-100'
                  }`}
                >
                  {task.title}
                </div>
              </div>

              <button
                onClick={() => deleteTask(task.id)}
                className="text-cyan-500/30 hover:text-red-400 transition-colors p-1"
                title="Purge Task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
