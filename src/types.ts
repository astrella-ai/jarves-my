export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'NORMAL' | 'ROUTINE';

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  priority: PriorityLevel;
  completed: boolean;
  dueDate?: string;
  dueTime?: string;
  category: 'MISSION' | 'TECH' | 'PERSONAL' | 'EXECUTIVE';
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'jarves';
  text: string;
  timestamp: string;
  audioPlayed?: boolean;
}

export interface SystemTelemetryState {
  coreTemp: number; // Celsius
  reactorOutput: number; // GW
  memoryLoad: number; // Percentage
  networkLatency: number; // ms
  neuralCoherence: number; // Percentage
  defenseProtocol: 'OPTIMAL' | 'ELEVATED' | 'STANDBY';
  activeNodes: number;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  tags: string[];
  updatedAt: number;
}

export interface WeatherData {
  city: string;
  region: string;
  temp: number;
  condition: string;
  humidity: number;
  pressure: number;
  windSpeed: number;
  uvIndex: number;
}
