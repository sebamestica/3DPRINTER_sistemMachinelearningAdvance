/**
 * MECHANICAL PROTOCOLS PANEL
 * Test type configuration
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowDown, ArrowUp, Move, Zap, Clock, Thermometer } from 'lucide-react';
import { useSimulationStore } from '../../../store';
import type { TestType } from '../../../domain/simulation/types';

interface Protocol {
  id: TestType;
  name: string;
  icon: React.ReactNode;
  description: string;
  units: string;
}

const PROTOCOLS: Protocol[] = [
  {
    id: 'compression',
    name: 'Compression Test',
    icon: <ArrowDown className="h-5 w-5" />,
    description: 'Uniaxial compression loading',
    units: 'MPa'
  },
  {
    id: 'tension',
    name: 'Tension Test',
    icon: <ArrowUp className="h-5 w-5" />,
    description: 'Uniaxial tensile loading',
    units: 'MPa'
  },
  {
    id: 'flexion',
    name: 'Flexion Test',
    icon: <Move className="h-5 w-5" />,
    description: 'Three-point bending',
    units: 'MPa'
  },
  {
    id: 'impact',
    name: 'Impact Test',
    icon: <Zap className="h-5 w-5" />,
    description: 'Charpy/Izod impact',
    units: 'J'
  }
];

export function MechanicalProtocolsPanel() {
  const { testType, setTestType, testConfig, setTestConfig } = useSimulationStore();
  const [activeProtocol, setActiveProtocol] = useState<TestType>(testType);

  const handleProtocolSelect = (id: TestType) => {
    setActiveProtocol(id);
    setTestType(id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
          <Activity className="h-5 w-5 text-emerald-500" />
        </div>
        <div>
          <h2 className="text-lg font-black text-white uppercase tracking-tight">
            Mechanical Protocols
          </h2>
          <p className="text-xs text-zinc-500">Configure test type and parameters</p>
        </div>
      </div>

      {/* Protocol Selection */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {PROTOCOLS.map((protocol) => (
          <motion.button
            key={protocol.id}
            onClick={() => handleProtocolSelect(protocol.id)}
            className={`
              p-4 rounded-xl border transition-all text-left
              ${activeProtocol === protocol.id
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-zinc-900/50 border-white/5 hover:border-white/10'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`p-2 rounded-lg inline-flex mb-3 ${
              activeProtocol === protocol.id ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-600'
            }`}>
              {protocol.icon}
            </div>
            <h3 className="text-xs font-bold text-white block">{protocol.name}</h3>
            <p className="text-[10px] text-zinc-500 mt-1">{protocol.description}</p>
          </motion.button>
        ))}
      </div>

      {/* Test Configuration */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 space-y-6">
        <h3 className="text-sm font-bold text-white">Test Configuration</h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Strain Rate */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
              <Clock className="h-3.5 w-3.5" />
              Strain Rate
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={testConfig.strainRate}
                onChange={(e) => setTestConfig({ strainRate: parseFloat(e.target.value) })}
                className="flex-1 h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer"
              />
              <span className="w-16 text-right text-sm font-mono text-white">
                {testConfig.strainRate} mm/min
              </span>
            </div>
          </div>

          {/* Temperature */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
              <Thermometer className="h-3.5 w-3.5" />
              Temperature
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="-20"
                max="80"
                step="1"
                value={testConfig.temperature}
                onChange={(e) => setTestConfig({ temperature: parseInt(e.target.value) })}
                className="flex-1 h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer"
              />
              <span className="w-16 text-right text-sm font-mono text-white">
                {testConfig.temperature}°C
              </span>
            </div>
          </div>

          {/* Humidity */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
              <span className="h-3.5 w-3.5 flex items-center justify-center text-[10px]">H</span>
              Humidity
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={testConfig.humidity}
                onChange={(e) => setTestConfig({ humidity: parseInt(e.target.value) })}
                className="flex-1 h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer"
              />
              <span className="w-16 text-right text-sm font-mono text-white">
                {testConfig.humidity}%
              </span>
            </div>
          </div>
        </div>

        {/* Protocol-specific settings */}
        {activeProtocol === 'compression' && (
          <div className="pt-4 border-t border-white/5">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3">
              Compression Settings
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-zinc-900/50">
                <span className="text-[9px] text-zinc-600 uppercase block mb-1">Max Strain</span>
                <input type="number" defaultValue={60} className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white" />
                <span className="text-[9px] text-zinc-600">%</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/50">
                <span className="text-[9px] text-zinc-600 uppercase block mb-1">Loading Rate</span>
                <input type="number" defaultValue={1.5} className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white" />
                <span className="text-[9px] text-zinc-600">mm/min</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}