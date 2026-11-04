import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = '0.0.0.0';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    system: 'JARVES OS v4.2',
    model: process.env.GEMINI_API_KEY ? 'gemini-3.8-flash' : 'simulated-neural-matrix',
    timestamp: new Date().toISOString(),
  });
});

// JARVES Persona System Instruction
const SYSTEM_INSTRUCTION = `You are JARVES (Just A Rather Very Efficient System), the highly advanced AI personal assistant modeled after Tony Stark's iconic system JARVIS, operating from an executive hub with a primary node in Malaysia (UTC+8).
You speak with refined British wit, immaculate poise, and unwavering loyalty. Address the user with dignified courtesy (e.g., "sir", "madam", or "boss" when appropriate).
Your responses should be sharp, clear, informative, slightly dry, highly capable, and immediately actionable.
You assist with task prioritization, daily executive briefings, technical calculations, system telemetry diagnostics, regional Malaysian updates (Kuala Lumpur time/weather/finance), and general knowledge.
Always maintain your sophisticated persona. Keep responses concise and formatted cleanly with markdown where helpful.`;

// Pre-programmed witty, high-fidelity Jarves responses when API key is not present or offline
function generateLocalJarvesResponse(prompt: string): string {
  const lower = prompt.toLowerCase();
  
  if (lower.includes('brief') || lower.includes('morning') || lower.includes('status report')) {
    return `Good day, sir. Systems are running at peak efficiency. All neural subroutines report green across the board. 

**Executive Briefing:**
- **Primary Node**: Kuala Lumpur Core (MYT / UTC+8)
- **Defense Protocols**: Active & Nominal
- **Telemetry**: Core temperature 34°C, Quantum buffer load 14%
- **Agenda**: You have 3 critical objectives scheduled today. 

Shall I prepare the workshop, or would you prefer me to review your high-priority action items first?`;
  }

  if (lower.includes('weather') || lower.includes('temperature') || lower.includes('malaysia') || lower.includes('kuala lumpur')) {
    return `Current meteorological telemetry for Kuala Lumpur and surrounding regions indicates 31°C with 78% humidity and scattered tropical cloud cover. Atmospheric pressure stands steady at 1012 hPa. 

I would recommend an umbrella if you plan on stepping outside the perimeter, sir.`;
  }

  if (lower.includes('task') || lower.includes('todo') || lower.includes('agenda') || lower.includes('schedule')) {
    return `I have cataloged your current priorities in the Task Manager module, sir. 

Your critical objectives are highlighted in the HUD. You may instruct me to add, prioritize, or check off tasks at your convenience, or use the tactile interface on your display.`;
  }

  if (lower.includes('diagnostics') || lower.includes('system') || lower.includes('scan')) {
    return `Diagnostic scan complete, sir. 
- Neural Processing Node: 99.4% coherence
- Arc Reactor output: 3.2 Terawatts (Nominal)
- Network Latency: 12ms to Asia-Pacific edge nodes
- Sub-protocols: Encryption keys cycled, firewall perimeter fortified.

Everything is in immaculate order.`;
  }

  if (lower.includes('who are you') || lower.includes('jarvis') || lower.includes('jarves')) {
    return `I am **JARVES**—Just A Rather Very Efficient System. 
I serve as your executive assistant, chief diagnostics coordinator, and strategic advisor. Whether managing complex flight trajectories or your afternoon calendar, I remain entirely at your disposal.`;
  }

  return `At your service, sir. I have processed your inquiry: "${prompt}". 

Telemetry indicates all parameters are aligned. If you need me to log this as a priority task, trigger a comprehensive system diagnostic, or draft an executive note, simply give the word.`;
}

// Chat API Route with Gemini SDK Integration
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        
        // Build chat context
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: message,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
            maxOutputTokens: 800,
          },
        });

        const reply = response.text || generateLocalJarvesResponse(message);
        return res.json({ reply, source: 'gemini-3.8-flash' });
      } catch (geminiError: any) {
        console.warn('[JARVES Server] Gemini API error, falling back to neural matrix:', geminiError?.message || geminiError);
        const reply = generateLocalJarvesResponse(message);
        return res.json({ reply, source: 'neural-matrix-fallback' });
      }
    } else {
      // Local fallback persona response
      const reply = generateLocalJarvesResponse(message);
      return res.json({ reply, source: 'neural-matrix' });
    }
  } catch (error: any) {
    console.error('[JARVES Server] Error in /api/chat:', error);
    res.status(500).json({ error: 'Internal system anomaly', details: error?.message });
  }
});

// Setup Vite Dev Middleware or Static Production Serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[JARVES Server] Vite dev middleware attached');
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
    console.log('[JARVES Server] Serving production build from dist');
  }

  app.listen(PORT, HOST, () => {
    console.log(`[JARVES Server] Ready and operational at http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[JARVES Server] Failed to initiate:', err);
  process.exit(1);
});
