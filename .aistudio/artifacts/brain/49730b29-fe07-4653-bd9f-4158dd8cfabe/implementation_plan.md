# Implementation Plan: Jarves AI Executive Command Center

Build and launch **Jarves (jarves-my)** as a Stark Industries-inspired AI executive productivity and personal assistant dashboard running on Express + Vite + React (Node.js 22 runtime, port 3000).

---

## 1. Architecture & Dev Server Startup
- **Dev Server (`server.ts`)**:
  - Express server binding to `0.0.0.0:3000`.
  - In development: integrates `vite.createServer` with Vite middlewares.
  - In production: serves static dist assets.
  - Server-side Gemini API proxy route (`POST /api/chat`) with fallback responses when `GEMINI_API_KEY` is not configured, ensuring seamless functionality.
- **Build & Config**:
  - `vite.config.ts` configured with `@vitejs/plugin-react` and `@tailwindcss/vite`.
  - `index.html` with title "Jarves - AI Personal Assistant" and Stark HUD fonts/styles.
  - Tailwind v4 styling with obsidian/slate backdrop, holographic cyan/teal glow, glassmorphism panels, and sci-fi telemetry indicators.

---

## 2. Core Functional Modules

### A. Jarves Holographic Core & Voice HUD
- **Circular Arc Reactor / Neural Core**:
  - Animated pulsing audio reactive holographic ring with state indicators (Idle, Listening, Processing, Speaking).
- **Web Speech Integration**:
  - Speech Recognition (voice command dictation: "Jarves, what's my agenda?", "Add task...", "Give me a system briefing").
  - Speech Synthesis: British executive voice persona ("Very good, sir/ma'am. Initializing protocol.") with mute/unmute and volume controls.
  - Web Audio API subtle futuristic UI chime/click sound effects.

### B. Malaysian & Local Telemetry Panel
- **Dual-Clock & Regional Data**:
  - Live Kuala Lumpur (MYT, UTC+8) and local browser time with high-precision seconds.
  - Live weather simulation for Kuala Lumpur / Penang / Johor Bahru / user location with conditions, humidity, and atmospheric pressure.
  - Key regional indicators (KLCI Market index status, Ringgit MYR exchange benchmark).

### C. Task & Daily Agenda Manager
- **Smart Task Execution**:
  - Add tasks via UI or voice command ("Add urgent task: Review quarterly financial report").
  - Priority levels (`CRITICAL`, `HIGH`, `NORMAL`, `ROUTINE`) with holographic status badges.
  - Due dates, category tags, filter by status, and completion toggles.
  - Daily Schedule view (timeline with hourly slots).

### D. System Diagnostics & Neural Telemetry
- **Live System Telemetry HUD**:
  - Real-time simulated CPU core utilization, RAM allocation, network latency (ms), and neural processing activity.
  - Security status and protocols toggle ("DEFENSE PROTOCOL: OPTIMAL").
  - Quick action buttons (Morning Briefing, Run Diagnostics, Clear Buffer, Export Log).

### E. AI Chat & Executive Scratchpad
- Full conversation history with Jarves.
- Quick command prompt pills (Morning Briefing, Summarize Tasks, Malaysian Tech News overview, Code assistant).
- Markdown-ready executive notes vault.

---

## 3. Verification & Launch
1. Write configuration files (`vite.config.ts`, `server.ts`, `index.html`, `src/*`).
2. Run `compile_applet` to verify compilation and build integrity.
3. Dev server verified running on port 3000.
