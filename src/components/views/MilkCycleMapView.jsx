import React, { useState } from 'react';
import { 
  Route, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  Radio
} from 'lucide-react';
import { motion } from 'framer-motion';
import { MILK_CYCLE_STAGES } from '../../data/mockData';
import BatchPipelineTimeline from '../BatchPipelineTimeline';

export default function MilkCycleMapView() {
  const [selectedStage, setSelectedStage] = useState(MILK_CYCLE_STAGES[2]); // Default Tanker stage

  return (
    <div className="space-y-6 text-slate-800">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-blue-950 flex items-center gap-3">
            <Route className="w-7 h-7 text-blue-600" />
            Milk-Cycle Traceability & Cold-Chain Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            End-to-end provenance mapping from pasture to consumer carton with verifiable IoT milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
            Live GPS Telematics Active
          </span>
        </div>
      </div>

      {/* Pipeline Stages Visualizer Bar */}
      <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-sm overflow-x-auto">
        <div className="min-w-[700px] flex items-center justify-between relative">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
          <div className="absolute top-1/2 left-8 w-3/5 h-1 bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-500 -translate-y-1/2 z-0 shadow-xs"></div>

          {MILK_CYCLE_STAGES.map((stage, idx) => {
            const isSelected = selectedStage.id === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setSelectedStage(stage)}
                className={`relative z-10 flex flex-col items-center group transition-all ${
                  isSelected ? 'scale-105' : 'hover:scale-102'
                }`}
              >
                {/* Node circle */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isSelected
                    ? 'bg-blue-600 text-white font-black shadow-lg shadow-blue-600/30 border-2 border-white'
                    : 'bg-white border border-slate-300 text-slate-600 group-hover:text-blue-600 group-hover:border-blue-400'
                }`}>
                  <span className="text-sm font-black font-mono">0{idx + 1}</span>
                </div>

                <span className={`text-xs font-bold mt-2.5 max-w-[120px] text-center leading-tight transition-colors ${
                  isSelected ? 'text-blue-900' : 'text-slate-600 group-hover:text-blue-900'
                }`}>
                  {stage.title.split('. ')[1]}
                </span>

                <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {stage.timestamp.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stage Detail Deep-Dive Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Stage Telematics & Verification */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-blue-100 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded border border-blue-200">
                  Checkpoint {selectedStage.id.toUpperCase()}
                </span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {selectedStage.status}
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mt-1.5">{selectedStage.title}</h2>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-blue-600" /> {selectedStage.location}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 font-medium">Timestamp Log</span>
              <p className="text-sm font-black font-mono text-blue-700">{selectedStage.timestamp}</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed bg-blue-50/50 p-4 rounded-2xl border border-blue-100 font-medium">
            {selectedStage.description}
          </p>

          {/* Key Metrics Grid */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Live Telematics & Safeguards</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {selectedStage.metrics.map((metric, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold block truncate">{metric.label}</span>
                  <p className="text-sm font-black font-mono text-slate-900 mt-1">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hardware Node Info */}
          <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100 space-y-2.5 text-xs">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Hardware Telemetry Node</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 font-medium">
              <div className="flex justify-between">
                <span className="text-slate-500">Supervisor / Operator:</span>
                <span className="font-bold text-slate-900">{selectedStage.telematics.operator}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">IoT Device ID:</span>
                <span className="font-mono font-bold text-blue-700">{selectedStage.telematics.deviceId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">GPS Coordinates:</span>
                <span className="font-mono text-slate-900">{selectedStage.telematics.lat}, {selectedStage.telematics.lng}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Audit Status:</span>
                <span className="text-emerald-700 font-bold">{selectedStage.telematics.compliance}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Simulated Geographic Radar / Corridor Tracker */}
        <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-blue-600 animate-pulse" />
                <h3 className="text-sm font-bold text-slate-900">Cryo-Corridor Radar</h3>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">13.1205° N</span>
            </div>

            {/* Radar Simulation Display in Light Blue Theme */}
            <div className="mt-4 relative h-56 rounded-2xl bg-blue-50/70 border border-blue-200 overflow-hidden flex items-center justify-center">
              {/* Concentric radar rings */}
              <div className="absolute w-44 h-44 rounded-full border border-blue-200 animate-ping opacity-30"></div>
              <div className="absolute w-32 h-32 rounded-full border border-blue-300"></div>
              <div className="absolute w-16 h-16 rounded-full border border-blue-400"></div>

              {/* Waypoints */}
              <div className="absolute top-10 left-12 flex flex-col items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></span>
                <span className="text-[9px] font-mono font-bold text-emerald-800 mt-1">BMC 03</span>
              </div>

              <div className="absolute bottom-10 right-12 flex flex-col items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-sm"></span>
                <span className="text-[9px] font-mono font-bold text-blue-800 mt-1">Mega Complex</span>
              </div>

              {/* Moving Tanker representation */}
              <motion.div 
                animate={{ 
                  x: [-20, 20, -20],
                  y: [-10, 10, -10]
                }}
                transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                className="relative z-10 flex flex-col items-center"
              >
                <div className="w-9 h-9 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center shadow-md">
                  <Truck className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-[10px] font-mono font-bold text-blue-900 bg-white px-1.5 py-0.5 rounded mt-1 border border-blue-200 shadow-xs">
                  TK-701
                </span>
              </motion.div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Next Checkpoint:</span>
              <span className="text-slate-900 font-bold">Bay 01 Intake Manifold</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Estimated Arrival:</span>
              <span className="text-blue-700 font-mono font-bold">18 minutes</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Cryogenic Tank Temp:</span>
              <span className="text-emerald-700 font-mono font-bold">3.6°C (Optimal)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Incident Trace Investigation for Batch #B10291 */}
      <BatchPipelineTimeline batchId="Batch #B10291" />
    </div>
  );
}
