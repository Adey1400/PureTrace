import React, { useState } from 'react';
import { 
  Building2, 
  Layers, 
  Truck, 
  Snowflake, 
  Factory, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  MapPin, 
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Batch Pipeline Timeline (White & Blue Dairy Theme)
 * - Highlights the journey of Batch #B10291: Farm → Collection → Transport → Chilling → Processing
 * - Clean white card with crisp dairy blue typography
 * - Green glowing nodes for first three stages, amber deviation for Chilling, red for Processing
 * - Smooth animated dashed connection line
 */
export default function BatchPipelineTimeline({ batchId = "Batch #B10291" }) {
  const [selectedStageId, setSelectedStageId] = useState('chilling');

  const stages = [
    {
      id: 'farm',
      title: 'Farm',
      fullName: 'Farm Milking & Extraction',
      location: 'Kaveri Agro Valley #12',
      time: '04:30 AM',
      status: 'Normal',
      temp: '36.2°C → 28°C',
      color: 'emerald',
      icon: Building2,
      metrics: 'Mastitis SCC: 110k/mL • Fat 4.3% • pH 6.68',
      log: 'Raw milk harvested via automated vacuum parlor. Inline conductivity check optimal. No mastitis detected.'
    },
    {
      id: 'collection',
      title: 'Collection',
      fullName: 'Village Aggregator Intake',
      location: 'Collection Center Alpha-04',
      time: '06:15 AM',
      status: 'Normal',
      temp: '18.4°C Initial',
      color: 'emerald',
      icon: Layers,
      metrics: 'Density 1.031 g/cm³ • SNF 8.75% • Clean',
      log: 'Rapid NIR milk analyzer verified baseline density. Zero added starch or synthetic adulterants.'
    },
    {
      id: 'transport',
      title: 'Transport',
      fullName: 'Cryo-Insulated Tanker #TK-308',
      location: 'National Highway 44 (Transit)',
      time: '08:00 AM',
      status: 'Normal',
      temp: '3.8°C Steady',
      color: 'emerald',
      icon: Truck,
      metrics: 'Speed 58 km/h • GPS Lock • Tamper Seal OK',
      log: 'Cold chain integrity maintained at 3.8°C. GPS telemetry steady with zero unauthorized stops.'
    },
    {
      id: 'chilling',
      title: 'Chilling',
      fullName: 'BMC Bulk Chilling Node Delta',
      location: 'BMC Regional Hub 02',
      time: '09:45 AM',
      status: 'Suspicious',
      temp: '7.8°C (BREACH)',
      color: 'amber',
      icon: Snowflake,
      deviationLabel: 'First Detected Deviation',
      metrics: 'Freezing Point: -0.510°C • Added Water ~5.2%',
      log: 'CRITICAL WARNING: Chilling compressor circuit fault. Temperature rose to 7.8°C for 38 min. Cryoscopic depression shifted to -0.510°C, indicating potential unauthorized dilution during holding.'
    },
    {
      id: 'processing',
      title: 'Processing',
      fullName: 'Mega Dairy Complex Intake Bay',
      location: 'Plant Manifold Unit 01',
      time: '11:15 AM',
      status: 'High Risk',
      temp: '9.4°C (Quarantined)',
      color: 'rose',
      icon: Factory,
      metrics: 'Risk Score 24/100 • Automated Valve Lockout',
      log: 'HIGH RISK LOCKOUT: Elevated temperature confirmed alongside alkaline pH (7.32) and suspected neutralizing soda added to mask souring. Batch locked from pasteurization manifold and routed to Quarantine Holding Tank C.'
    },
  ];

  const currentStage = stages.find(s => s.id === selectedStageId) || stages[3];

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-white border border-blue-100 shadow-sm space-y-6 relative overflow-hidden text-slate-800">
      {/* Background subtle tint */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-48 bg-amber-50/50 blur-[80px] pointer-events-none rounded-full"></div>
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-72 h-48 bg-rose-50/50 blur-[80px] pointer-events-none rounded-full"></div>

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-base font-bold text-slate-900 tracking-tight">Traceability Pipeline:</span>
              <span className="font-mono font-extrabold text-blue-700 text-sm px-2.5 py-0.5 rounded-lg bg-blue-50 border border-blue-200">
                {batchId}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulated end-to-end provenance route with IoT anomaly markers & automated gate audit
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" /> Quarantined at Intake
          </span>
        </div>
      </div>

      {/* Horizontal Interactive Pipeline Visualizer */}
      <div className="relative py-8 px-2 sm:px-6 z-10 overflow-x-auto">
        <div className="min-w-[700px] flex items-center justify-between relative">
          
          {/* Animated Dashed Connecting Line SVG */}
          <div className="absolute top-7 left-10 right-10 h-4 -translate-y-1/2 pointer-events-none z-0">
            <svg className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="pipelineGradLight" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#10b981" />
                  <stop offset="72%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
              <line
                x1="0"
                y1="8"
                x2="100%"
                y2="8"
                stroke="url(#pipelineGradLight)"
                strokeWidth="3"
                strokeDasharray="8 6"
                className="animate-[dash_12s_linear_infinite]"
              />
            </svg>
          </div>

          {/* Inline animation keyframe for dash */}
          <style>{`
            @keyframes dash {
              to {
                stroke-dashoffset: -1000;
              }
            }
          `}</style>

          {/* Stage Nodes */}
          {stages.map((stage) => {
            const Icon = stage.icon;
            const isSelected = selectedStageId === stage.id;

            let nodeStyle = '';
            let glowBadgeStyle = '';
            let dotGlow = '';

            if (stage.color === 'emerald') {
              nodeStyle = 'border-emerald-500 text-emerald-600 bg-white shadow-lg shadow-emerald-500/20';
              glowBadgeStyle = 'text-emerald-800 bg-emerald-50 border-emerald-200 font-bold';
              dotGlow = 'bg-emerald-500';
            } else if (stage.color === 'amber') {
              nodeStyle = 'border-amber-500 text-amber-600 bg-white shadow-lg shadow-amber-500/25';
              glowBadgeStyle = 'text-amber-800 bg-amber-50 border-amber-200 font-bold';
              dotGlow = 'bg-amber-500 animate-ping';
            } else {
              nodeStyle = 'border-rose-500 text-rose-600 bg-white shadow-lg shadow-rose-500/30 animate-pulse';
              glowBadgeStyle = 'text-rose-800 bg-rose-50 border-rose-200 font-bold';
              dotGlow = 'bg-rose-500 animate-ping';
            }

            return (
              <div 
                key={stage.id}
                className="relative flex flex-col items-center group cursor-pointer z-10"
                onClick={() => setSelectedStageId(stage.id)}
              >
                {/* Tooltip / Badge for "Chilling": First Detected Deviation */}
                {stage.deviationLabel && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                    className="absolute -top-10 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide bg-amber-100 text-amber-900 border border-amber-300 shadow-sm whitespace-nowrap flex items-center gap-1.5 z-20"
                  >
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    <span>{stage.deviationLabel}</span>
                  </motion.div>
                )}

                {/* High Risk indicator badge for "Processing" */}
                {stage.id === 'processing' && (
                  <div className="absolute -top-10 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide bg-rose-100 text-rose-900 border border-rose-300 shadow-sm whitespace-nowrap flex items-center gap-1.5 z-20 animate-pulse">
                    <ShieldAlert className="w-3 h-3 text-rose-600" />
                    <span>High Risk Breach</span>
                  </div>
                )}

                {/* Glowing Node Button */}
                <motion.div
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 relative ${nodeStyle} ${
                    isSelected ? 'ring-4 ring-blue-400 ring-offset-2 ring-offset-white' : ''
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  
                  {/* Status dot in top corner */}
                  <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${dotGlow}`}></span>
                </motion.div>

                {/* Node Title & Time */}
                <div className="text-center mt-3 space-y-0.5">
                  <span className={`text-xs font-bold block transition-colors ${
                    isSelected ? 'text-blue-900 font-extrabold' : 'text-slate-700 group-hover:text-blue-900'
                  }`}>
                    {stage.title}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 block">{stage.time}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border inline-block mt-1 ${glowBadgeStyle}`}>
                    {stage.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Stage Inspection Details Box */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStage.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={`p-5 rounded-2xl border relative ${
            currentStage.color === 'emerald'
              ? 'bg-emerald-50/40 border-emerald-200'
              : currentStage.color === 'amber'
                ? 'bg-amber-50/50 border-amber-200'
                : 'bg-rose-50/50 border-rose-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500">
                  Pipeline Stage:
                </span>
                <span className="text-sm font-black text-slate-900">{currentStage.fullName}</span>
                {currentStage.deviationLabel && (
                  <span className="text-[10px] bg-amber-500 text-white font-black px-2 py-0.5 rounded">
                    {currentStage.deviationLabel}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600 mt-1">
                <span className="flex items-center gap-1 font-medium"><MapPin className="w-3.5 h-3.5 text-blue-600" /> {currentStage.location}</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium"><Clock className="w-3.5 h-3.5 text-blue-600" /> {currentStage.time}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Temperature Log</span>
                <p className={`text-sm font-mono font-black ${
                  currentStage.color === 'emerald' ? 'text-emerald-700' : currentStage.color === 'amber' ? 'text-amber-800' : 'text-rose-700'
                }`}>
                  {currentStage.temp}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 text-xs">
            <div className="md:col-span-2 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Telemetry Diagnostic Log:</span>
              <p className="text-slate-800 leading-relaxed bg-white p-3 rounded-xl border border-slate-200 font-mono text-[11px]">
                {currentStage.log}
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Key Assay Metrics:</span>
              <div className="bg-white p-3 rounded-xl border border-slate-200 text-slate-800 font-mono text-[11px] space-y-1">
                {currentStage.metrics.split(' • ').map((m, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
