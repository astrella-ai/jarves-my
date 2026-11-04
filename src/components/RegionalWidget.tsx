import React, { useState, useEffect } from 'react';
import { Clock, CloudSun, MapPin, TrendingUp, ShieldCheck, RefreshCw } from 'lucide-react';
import { WeatherData } from '../types';
import { playSound } from '../utils/audio';

interface RegionalWidgetProps {
  soundEnabled: boolean;
}

export const RegionalWidget: React.FC<RegionalWidgetProps> = ({ soundEnabled }) => {
  const [mytTime, setMytTime] = useState<string>('');
  const [mytDate, setMytDate] = useState<string>('');
  const [localTime, setLocalTime] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<'Kuala Lumpur' | 'Penang' | 'Johor Bahru'>('Kuala Lumpur');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Regional weather records
  const weatherPresets: Record<'Kuala Lumpur' | 'Penang' | 'Johor Bahru', WeatherData> = {
    'Kuala Lumpur': {
      city: 'Kuala Lumpur',
      region: 'Wilayah Persekutuan, MY',
      temp: 31,
      condition: 'Scattered Showers',
      humidity: 78,
      pressure: 1012,
      windSpeed: 14,
      uvIndex: 7,
    },
    'Penang': {
      city: 'George Town',
      region: 'Penang, MY',
      temp: 32,
      condition: 'Coastal Breezes / Fair',
      humidity: 72,
      pressure: 1011,
      windSpeed: 18,
      uvIndex: 8,
    },
    'Johor Bahru': {
      city: 'Johor Bahru',
      region: 'Johor, MY',
      temp: 30,
      condition: 'Tropical Humid',
      humidity: 82,
      pressure: 1013,
      windSpeed: 12,
      uvIndex: 6,
    },
  };

  const weather = weatherPresets[selectedCity];

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();

      // Kuala Lumpur MYT (UTC+8)
      const mytOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kuala_Lumpur',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      const mytDateOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kuala_Lumpur',
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      };

      setMytTime(new Intl.DateTimeFormat('en-GB', mytOptions).format(now));
      setMytDate(new Intl.DateTimeFormat('en-GB', mytDateOptions).format(now));

      // Local system time
      setLocalTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
      );
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    playSound('scan', soundEnabled);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="hud-panel hud-corner-tl p-4 rounded-xl flex flex-col justify-between border border-cyan-500/20 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-hud tracking-wider text-cyan-300 font-semibold text-xs">
            REGIONAL TIME & TELEMETRY // MALAYSIA
          </span>
        </div>
        <button
          onClick={handleRefresh}
          className="text-cyan-400 hover:text-cyan-200 transition-colors p-1"
          title="Refresh Telemetry"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-300' : ''}`} />
        </button>
      </div>

      {/* Dual Clocks */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-[#030a16]/80 p-2.5 rounded-lg border border-cyan-500/20">
          <div className="flex items-center justify-between text-cyan-400/80 mb-1">
            <span className="font-hud text-[10px] tracking-wider">KUALA LUMPUR (MYT)</span>
            <span className="text-[9px] bg-cyan-950/80 px-1.5 py-0.5 rounded text-cyan-300 font-mono">UTC+8</span>
          </div>
          <div className="font-hud text-xl sm:text-2xl font-bold text-cyan-300 tracking-wider">
            {mytTime || '00:00:00'}
          </div>
          <div className="text-[10px] text-cyan-400/60 font-mono mt-0.5">
            {mytDate || 'Syncing...'}
          </div>
        </div>

        <div className="bg-[#030a16]/80 p-2.5 rounded-lg border border-cyan-500/20">
          <div className="flex items-center justify-between text-cyan-400/80 mb-1">
            <span className="font-hud text-[10px] tracking-wider">LOCAL CLIENT NODE</span>
            <span className="text-[9px] bg-cyan-950/80 px-1.5 py-0.5 rounded text-cyan-300 font-mono">SYS</span>
          </div>
          <div className="font-hud text-xl sm:text-2xl font-bold text-cyan-100 tracking-wider">
            {localTime || '00:00:00'}
          </div>
          <div className="text-[10px] text-cyan-400/60 font-mono mt-0.5">
            Browser Host Sync
          </div>
        </div>
      </div>

      {/* Weather & Environmental Telemetry */}
      <div className="bg-[#030a16]/80 p-3 rounded-lg border border-cyan-500/20 mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-cyan-300">
            <CloudSun className="w-3.5 h-3.5" />
            <span className="font-hud text-[10px] tracking-wider">METEOROLOGICAL SENSORS</span>
          </div>
          {/* City selector */}
          <div className="flex gap-1">
            {(['Kuala Lumpur', 'Penang', 'Johor Bahru'] as const).map(city => (
              <button
                key={city}
                onClick={() => {
                  setSelectedCity(city);
                  playSound('beep', soundEnabled);
                }}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                  selectedCity === city
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 font-semibold'
                    : 'text-cyan-400/60 hover:text-cyan-300'
                }`}
              >
                {city.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-hud text-2xl font-bold text-cyan-200">{weather.temp}°C</span>
              <span className="text-cyan-400/90 text-xs">{weather.condition}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-cyan-400/60 mt-0.5">
              <MapPin className="w-3 h-3 text-cyan-500" />
              <span>{weather.region}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] font-mono border-l border-cyan-500/20 pl-3">
            <div>
              <span className="text-cyan-400/60">HUMIDITY:</span>{' '}
              <span className="text-cyan-200 font-bold">{weather.humidity}%</span>
            </div>
            <div>
              <span className="text-cyan-400/60">PRESSURE:</span>{' '}
              <span className="text-cyan-200 font-bold">{weather.pressure} hPa</span>
            </div>
            <div>
              <span className="text-cyan-400/60">WIND:</span>{' '}
              <span className="text-cyan-200 font-bold">{weather.windSpeed} km/h</span>
            </div>
            <div>
              <span className="text-cyan-400/60">UV INDEX:</span>{' '}
              <span className="text-cyan-200 font-bold">{weather.uvIndex} (High)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Market & Financial Diagnostics */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#030914] p-2 rounded border border-cyan-500/20">
          <div className="flex items-center justify-between text-[10px] text-cyan-400/60">
            <span>FBM KLCI</span>
            <TrendingUp className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="font-mono font-bold text-emerald-400 text-xs mt-0.5">1,618.42</div>
          <div className="text-[9px] text-emerald-400/80">+0.48%</div>
        </div>

        <div className="bg-[#030914] p-2 rounded border border-cyan-500/20">
          <div className="flex items-center justify-between text-[10px] text-cyan-400/60">
            <span>USD / MYR</span>
            <ShieldCheck className="w-3 h-3 text-cyan-400" />
          </div>
          <div className="font-mono font-bold text-cyan-200 text-xs mt-0.5">4.4250</div>
          <div className="text-[9px] text-cyan-400/70">STABLE</div>
        </div>

        <div className="bg-[#030914] p-2 rounded border border-cyan-500/20">
          <div className="flex items-center justify-between text-[10px] text-cyan-400/60">
            <span>MYR / SGD</span>
            <ShieldCheck className="w-3 h-3 text-cyan-400" />
          </div>
          <div className="font-mono font-bold text-cyan-200 text-xs mt-0.5">3.3120</div>
          <div className="text-[9px] text-cyan-400/70">NOMINAL</div>
        </div>
      </div>
    </div>
  );
};
