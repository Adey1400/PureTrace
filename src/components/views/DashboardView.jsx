import React, { useState } from 'react';
import { 
  Activity, 
  ShieldAlert, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  ArrowUpRight, 
  Sparkles, 
  Microscope, 
  RotateCw, 
  Zap, 
  Layers
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SAMPLE_SIMULATIONS } from '../../data/mockData';
import BatchPipelineTimeline from '../BatchPipelineTimeline';

export default function DashboardView({ 
  batches, 
  onInspectBatch, 
  telemetryStream, 
  onAddNewBatch
}) {
  const [selectedSimSample, setSelectedSimSample] = useState(SAMPLE_SIMULATIONS[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  // Calculate high-level KPIs
  const totalVolume = batches.reduce((acc, b) => acc + b.volumeLiters, 0);
  const avgFat = (batches.reduce((acc, b) => acc + b.fat, 0) / batches.length).toFixed(2);
  const avgSnf = (batches.reduce((acc, b) => acc + b.snf, 0) / batches.length).toFixed(2);
  const normalBatches = batches.filter(b => b.risk === 'Normal').length;
  const purityPercentage = ((normalBatches / batches.length) * 100).toFixed(1);

  const runSampleScan = () => {
    setIsScanning(true);
    setScanCompleted(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanCompleted(true);
      setScanResult(selectedSimSample);
    }, 1200);
  };

  const getRiskBadge = (risk) => {
    if (risk === 'Normal') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" /> Normal
        </span>
      );
    }
    if (risk === 'Suspicious') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
          <AlertTriangle className="w-3 h-3" /> Suspicious
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
        <ShieldAlert className="w-3 h-3" /> High Risk
      </span>
    );
  };

  return (
    <div className="space-y-8 text-slate-800">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl bg-white border border-blue-100 p-6 sm:p-7 shadow-sm shadow-blue-900/5"
      >
        {/* Soft blue pulsing depth orb */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: "easeInOut",
          }}
          className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-blue-100 blur-[90px] pointer-events-none"
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wider">
                Amul Federation Model
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-blue-950 mt-1">
              PureTrace Intelligence Hub
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Real-time milk traceability and anomaly detection.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              All 18 Stations Online
            </span>
          </div>
        </div>
      </motion.div>

      {/* 4 Metric Cards Grid with Weightless Hover */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Batches */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -5 }}
          className="p-5 rounded-3xl bg-white border border-blue-100 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-600/10 transition-all group cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Active Batches</span>
            <div className="p-2 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-blue-950 tracking-tight">1,240</div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-slate-500">In collection & chilling</span>
            <span className="text-blue-700 font-bold font-mono">+18 this hour</span>
          </div>
        </motion.div>

        {/* Card 2: Normal (0-29 Risk) with green sparkline and icon */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -5 }}
          className="p-5 rounded-3xl bg-white border border-emerald-100 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-600/10 transition-all group cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Normal (0-29 Risk)</span>
            <div className="p-2 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-black font-mono text-emerald-700 tracking-tight">1,182</div>
              <span className="text-xs text-slate-500 mt-0.5 block font-medium">95.3% pure certified</span>
            </div>
            {/* Green Sparkline */}
            <div className="w-20 h-9">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 80 32">
                <path
                  d="M0,24 Q15,20 30,12 T50,14 T70,4 L80,2"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="80" cy="2" r="3.5" fill="#10b981" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Card 3: Suspicious (30-69 Risk) with yellow warning icon */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -5 }}
          className="p-5 rounded-3xl bg-white border border-amber-100 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-600/10 transition-all group cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Suspicious (30-69 Risk)</span>
            <div className="p-2 rounded-2xl bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-xs">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-amber-700 tracking-tight">46</div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-slate-500">Under secondary audit</span>
            <span className="text-amber-800 font-bold font-mono">3.7% rate</span>
          </div>
        </motion.div>

        {/* Card 4: Quarantined (>70 Risk) with red alert icon */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -5 }}
          className="p-5 rounded-3xl bg-white border border-rose-100 hover:border-rose-400 hover:shadow-xl hover:shadow-rose-600/10 transition-all group cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800">Quarantined (&gt;70 Risk)</span>
            <div className="p-2 rounded-2xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-xs animate-pulse">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-rose-600 tracking-tight">12</div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-slate-500">Valves locked & isolated</span>
            <span className="text-rose-700 font-bold font-mono">1.0% rate</span>
          </div>
        </motion.div>
      </div>

      {/* Simulated Batch Traceability Pipeline (Batch #B10291) */}
      <BatchPipelineTimeline batchId="Batch #B10291" />

      {/* Amul-Inspired Royal Blue Hero Card */}
      <div className="relative">
        <motion.div
          animate={{ y: [-3, 3, -3] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="relative rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white p-6 sm:p-8 shadow-xl shadow-blue-600/20 overflow-hidden"
        >
          {/* Subtle wave light reflections */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-blue-100 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Continuous Cooperative Quality Assurance</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                AI-Powered Milk Quality <br />
                <span className="text-sky-200">Intelligence & Zero-Tamper</span> Traceability
              </h2>
              <p className="text-sm text-blue-100/90 leading-relaxed">
                Autonomous real-time monitoring across dairy farms, collection centers, and insulated cryogenic tankers. Instant adulteration classification with multi-band optical & osmolality verification.
              </p>
            </div>

            {/* Score Ring Badge */}
            <div className="flex items-center gap-4 bg-white p-5 rounded-3xl shadow-xl text-slate-800 shrink-0">
              <div className="relative flex items-center justify-center">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#e2e8f0"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#2563eb"
                    strokeWidth="8"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 * (1 - 0.984)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-black font-mono text-blue-900">98.4%</span>
                  <span className="text-[9px] uppercase tracking-wider text-blue-600 font-extrabold">Integrity</span>
                </div>
              </div>

              <div className="space-y-1 border-l border-slate-200 pl-4">
                <div className="text-[11px] text-slate-500 font-medium">Volume: <strong className="text-slate-900 font-mono">{totalVolume.toLocaleString()} L</strong></div>
                <div className="text-[11px] text-slate-500 font-medium">Avg Fat/SNF: <strong className="text-blue-700 font-mono">{avgFat}% / {avgSnf}%</strong></div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold">
                  <TrendingUp className="w-3.5 h-3.5" /> {purityPercentage}% Pure Batches
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Split: Real-Time Telemetry Feed + Interactive Rapid AI Scan Bench */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Telemetry Stream */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-blue-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Active Sensor Telemetry Stream</h2>
                <p className="text-xs text-slate-500">Autonomous multi-probe reading from Receiving Bay 01</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live Sensor Bus
            </span>
          </div>

          {/* Grid of parameters */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {telemetryStream.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100 space-y-1">
                <div className="text-[11px] text-slate-600 font-semibold truncate">{item.parameter}</div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black font-mono text-blue-950">{item.value}</span>
                  <span className="text-xs text-slate-500 font-bold">{item.unit}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>Target: {item.baseline}</span>
                  <span className="text-emerald-700 font-bold">{item.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100">
            <span>Sensors auto-refresh every 3.5s with micro-variance simulation</span>
            <span className="text-blue-700 font-mono font-bold">NIR Multi-channel 400-2500nm</span>
          </div>
        </div>

        {/* Right 1 Col: Quick AI Scan Simulator Bench */}
        <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
              <Microscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Rapid Dairy Test Bench</h2>
              <p className="text-xs text-slate-500">Simulate sample intake & spectral audit</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 block">Select Sample Lot to Test:</label>
            <div className="space-y-2">
              {SAMPLE_SIMULATIONS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => {
                    setSelectedSimSample(sample);
                    setScanCompleted(false);
                    setScanResult(null);
                  }}
                  className={`w-full text-left p-3 rounded-2xl border text-xs transition-all ${
                    selectedSimSample.id === sample.id
                      ? 'bg-blue-50 border-blue-400 text-blue-950 shadow-xs'
                      : 'bg-slate-50/60 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-900">{sample.name}</span>
                    {getRiskBadge(sample.predictedRisk)}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 font-mono">
                    Fat: {sample.fat}% • SNF: {sample.snf}% • Temp: {sample.temp}°C
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={runSampleScan}
              disabled={isScanning}
              className="w-full mt-3 py-3 px-4 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin text-white" />
                  <span>Analyzing Spectral NIR Fingerprint...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-blue-200" />
                  <span>Run AI Adulteration Analysis</span>
                </>
              )}
            </button>

            {/* Scan Output */}
            {scanCompleted && scanResult && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                  scanResult.predictedRisk === 'Normal'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : scanResult.predictedRisk === 'Suspicious'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <div className="flex items-center justify-between font-extrabold">
                  <span>AI Verdict: {scanResult.predictedRisk}</span>
                  <span className="font-mono">Score: {scanResult.riskScore}%</span>
                </div>
                <p className="text-[11px] text-slate-700 leading-relaxed font-medium">{scanResult.notes}</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Batches Overview Section */}
      <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Milk Delivery Stream</h2>
            <p className="text-xs text-slate-500">Click any batch to inspect chemical assays, cold-chain logs & ledger QR</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onAddNewBatch}
              className="px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-all flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-blue-600" /> + Simulate Intake Batch
            </button>
          </div>
        </div>

        {/* Batches Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-blue-100 text-slate-500 uppercase tracking-wider font-bold bg-slate-50/50">
                <th className="py-3 px-3.5">Batch ID</th>
                <th className="py-3 px-3.5">Origin / Chilling Node</th>
                <th className="py-3 px-3.5">Volume</th>
                <th className="py-3 px-3.5">Fat / SNF</th>
                <th className="py-3 px-3.5">Temp</th>
                <th className="py-3 px-3.5">Risk Assessment</th>
                <th className="py-3 px-3.5">Status</th>
                <th className="py-3 px-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {batches.map((batch) => (
                <tr 
                  key={batch.id} 
                  onClick={() => onInspectBatch(batch)}
                  className="hover:bg-blue-50/40 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 px-3.5 font-mono font-bold text-blue-700 group-hover:text-blue-900">
                    {batch.id}
                  </td>
                  <td className="py-3.5 px-3.5">
                    <div className="font-bold text-slate-800 truncate max-w-[200px]">{batch.farmOrigin}</div>
                    <div className="text-[11px] text-slate-500">{batch.chillingCenter}</div>
                  </td>
                  <td className="py-3.5 px-3.5 font-mono text-slate-700 font-bold">
                    {batch.volumeLiters.toLocaleString()} L
                  </td>
                  <td className="py-3.5 px-3.5 font-mono text-slate-700">
                    {batch.fat}% / {batch.snf}%
                  </td>
                  <td className="py-3.5 px-3.5 font-mono">
                    <span className={batch.tempC > 5.0 ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold'}>
                      {batch.tempC}°C
                    </span>
                  </td>
                  <td className="py-3.5 px-3.5">
                    {getRiskBadge(batch.risk)}
                  </td>
                  <td className="py-3.5 px-3.5">
                    <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                      {batch.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3.5 text-right">
                    <span className="text-blue-600 group-hover:underline text-[11px] font-bold inline-flex items-center gap-1">
                      Inspect <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
