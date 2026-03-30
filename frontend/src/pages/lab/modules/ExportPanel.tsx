/**
 * EXPORT & RESEARCH OUTPUT PANEL
 * Generate reports and technical documentation
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileDown, FileText, Table, Image, Share2, Mail, Link2, CheckCircle2 } from 'lucide-react';
import { useProductStore, useSimulationStore, useUIStore } from '../../../store';

interface ExportFormat {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  available: boolean;
}

const EXPORT_FORMATS: ExportFormat[] = [
  {
    id: 'pdf',
    name: 'Technical Report',
    icon: <FileText className="h-5 w-5" />,
    description: 'Complete PDF with methodology and results',
    available: true
  },
  {
    id: 'csv',
    name: 'Experimental Data',
    icon: <Table className="h-5 w-5" />,
    description: 'Raw data in CSV format',
    available: true
  },
  {
    id: 'images',
    name: 'Visual Assets',
    icon: <Image className="h-5 w-5" />,
    description: 'PNG/JPG of geometry and results',
    available: true
  },
  {
    id: 'preset',
    name: 'Fabrication Preset',
    icon: <FileDown className="h-5 w-5" />,
    description: 'Slicer configuration file',
    available: true
  }
];

export function ExportPanel() {
  const [selectedFormats, setSelectedFormats] = useState<string[]>(['pdf']);
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const { prediction, metrics } = useSimulationStore();
  const { dimensions, architecture, material, cellSize, strutThickness, infillDensity } = useProductStore();
  const { addToast } = useUIStore();

  const toggleFormat = (id: string) => {
    setSelectedFormats(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleExport = async () => {
    if (selectedFormats.length === 0) return;

    setExporting(true);

    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 2000));

    setExporting(false);
    setExported(true);
    addToast({
      type: 'success',
      message: `Exported ${selectedFormats.length} file(s) successfully`
    });

    setTimeout(() => setExported(false), 3000);
  };

  const handleShare = () => {
    addToast({
      type: 'info',
      message: 'Share link copied to clipboard'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
          <FileDown className="h-5 w-5 text-cyan-500" />
        </div>
        <div>
          <h2 className="text-lg font-black text-white uppercase tracking-tight">
            Export & Research Output
          </h2>
          <p className="text-xs text-zinc-500">Generate reports and technical documentation</p>
        </div>
      </div>

      {/* Export Formats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {EXPORT_FORMATS.map((format) => (
          <motion.button
            key={format.id}
            onClick={() => toggleFormat(format.id)}
            className={`
              p-4 rounded-xl border transition-all text-left flex items-start gap-4
              ${selectedFormats.includes(format.id)
                ? 'bg-cyan-500/10 border-cyan-500/30'
                : 'bg-zinc-900/50 border-white/5 hover:border-white/10'
              }
              ${!format.available ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            disabled={!format.available}
            whileHover={format.available ? { scale: 1.01 } : {}}
            whileTap={format.available ? { scale: 0.99 } : {}}
          >
            <div className={`p-2 rounded-lg ${
              selectedFormats.includes(format.id) ? 'bg-cyan-500/20 text-cyan-400' : 'bg-zinc-800 text-zinc-600'
            }`}>
              {format.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">{format.name}</h3>
                {selectedFormats.includes(format.id) && (
                  <CheckCircle2 className="h-4 w-4 text-cyan-500" />
                )}
              </div>
              <p className="text-[10px] text-zinc-500 mt-1">{format.description}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Preview */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
        <h3 className="text-sm font-bold text-white mb-4">Export Preview</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-zinc-600 uppercase tracking-widest text-[9px] block mb-1">Dimensions</span>
              <span className="text-white font-mono">{dimensions.x}×{dimensions.y}×{dimensions.z} mm</span>
            </div>
            <div>
              <span className="text-zinc-600 uppercase tracking-widest text-[9px] block mb-1">Architecture</span>
              <span className="text-white uppercase">{architecture}</span>
            </div>
            <div>
              <span className="text-zinc-600 uppercase tracking-widest text-[9px] block mb-1">Material</span>
              <span className="text-white">{material}</span>
            </div>
            <div>
              <span className="text-zinc-600 uppercase tracking-widest text-[9px] block mb-1">Cell Size</span>
              <span className="text-white font-mono">{cellSize} mm</span>
            </div>
          </div>

          {prediction && (
            <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-zinc-600 uppercase tracking-widest text-[9px] block mb-1">Yield Estimate</span>
                <span className="text-white font-mono">{prediction.yieldEstimate} MPa</span>
              </div>
              <div>
                <span className="text-zinc-600 uppercase tracking-widest text-[9px] block mb-1">Domain Fit</span>
                <span className="text-white font-mono">{prediction.domainFit}%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <motion.button
          onClick={handleExport}
          disabled={selectedFormats.length === 0 || exporting}
          className={`
            flex-1 h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-black uppercase tracking-widest transition-all
            ${exported
              ? 'bg-emerald-600 text-white'
              : exporting
                ? 'bg-zinc-700 text-zinc-400 cursor-wait'
                : 'bg-cyan-600 text-white hover:bg-cyan-500'
            }
          `}
          whileHover={!exporting && !exported ? { scale: 1.01 } : {}}
          whileTap={!exporting && !exported ? { scale: 0.99 } : {}}
        >
          {exported ? (
            <>
              <CheckCircle2 className="h-5 w-5" /> Exported
            </>
          ) : exporting ? (
            <>
              <motion.div
                className="h-4 w-4 border-2 border-zinc-400 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              Exporting...
            </>
          ) : (
            <>
              <FileDown className="h-5 w-5" /> Export {selectedFormats.length} File(s)
            </>
          )}
        </motion.button>

        <button
          onClick={handleShare}
          className="h-12 px-6 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white hover:border-white/20 transition-all"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}