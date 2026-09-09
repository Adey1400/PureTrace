import React, { useState } from 'react';
import { 
  Settings, 
  Sliders, 
  ShieldAlert, 
  Database, 
  Check, 
  Save, 
  Lock
} from 'lucide-react';

export default function SettingsView() {
  const [standard, setStandard] = useState('FSSAI');
  const [waterTolerance, setWaterTolerance] = useState(0.5);
  const [ureaThreshold, setUreaThreshold] = useState(45);
  const [autoQuarantine, setAutoQuarantine] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 text-slate-800">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-blue-950 flex items-center gap-3">
            <Settings className="w-7 h-7 text-blue-600" />
            Platform & Dairy Quality Calibration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure neural detection sensitivity, legal compliance benchmarks, and automated emergency lockouts.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Parameters Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Configurations</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: AI Thresholds & Calibration */}
        <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">AI Detection Sensitivity</h2>
              <p className="text-xs text-slate-500">Set limits for neural outlier triggers</p>
            </div>
          </div>

          <div className="space-y-5 text-xs">
            {/* Standard Selection */}
            <div>
              <label className="text-slate-700 font-bold block mb-2">Compliance Jurisdiction Standard</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'FSSAI', label: 'FSSAI (India)' },
                  { id: 'CODEX', label: 'Codex Standard' },
                  { id: 'FDA', label: 'US FDA Grade A' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStandard(s.id)}
                    className={`py-2.5 px-3 rounded-xl font-bold border text-center transition-all ${
                      standard === s.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Water Tolerance Slider */}
            <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-slate-800 font-bold">Added Water Tolerance Ceiling</span>
                <span className="font-mono text-blue-700 font-black text-sm">{waterTolerance}%</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="3.0"
                step="0.1"
                value={waterTolerance}
                onChange={(e) => setWaterTolerance(parseFloat(e.target.value))}
                className="w-full accent-blue-600 bg-white rounded-lg cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Cryoscopic deviation exceeding {waterTolerance}% triggers immediate suspicious status.
              </span>
            </div>

            {/* Urea Threshold Slider */}
            <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-slate-800 font-bold">Urea Upper Cutoff Limit</span>
                <span className="font-mono text-blue-700 font-black text-sm">{ureaThreshold} mg/dL</span>
              </div>
              <input
                type="range"
                min="20"
                max="70"
                step="1"
                value={ureaThreshold}
                onChange={(e) => setUreaThreshold(parseInt(e.target.value))}
                className="w-full accent-blue-600 bg-white rounded-lg cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Values above {ureaThreshold} mg/dL indicate artificial non-protein nitrogen enrichment.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Automated Actions & Security */}
        <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Automated Safeguards & Webhooks</h2>
              <p className="text-xs text-slate-500">Lockout protocols and dispatch webhooks</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100 flex items-center justify-between">
              <div className="space-y-0.5 max-w-[280px]">
                <span className="text-slate-900 font-bold block">Robotic Valve Lockout on High Risk</span>
                <p className="text-[11px] text-slate-500">
                  Physically diverts tanker flow to isolated quarantine holding tank if detergent or urea is positive.
                </p>
              </div>
              <button
                onClick={() => setAutoQuarantine(!autoQuarantine)}
                className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                  autoQuarantine ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-xs ${
                  autoQuarantine ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100 flex items-center justify-between">
              <div className="space-y-0.5 max-w-[280px]">
                <span className="text-slate-900 font-bold block">Instant SMS to Lead Chemist & QC</span>
                <p className="text-[11px] text-slate-500">
                  Broadcasts cryptographic failure hash to Dr. Sarah Chen and Plant Operations Director.
                </p>
              </div>
              <button
                onClick={() => setSmsAlerts(!smsAlerts)}
                className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                  smsAlerts ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-xs ${
                  smsAlerts ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Blockchain Node Telemetry */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-slate-500 font-bold uppercase text-[10px] tracking-wider block">
                Immutable Ledger Node Health
              </span>
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5 font-medium">
                  <Database className="w-3.5 h-3.5 text-blue-600" /> Peer Node 01:
                </span>
                <span className="text-emerald-700 font-mono font-bold">Synchronized (Block #948,102)</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5 font-medium">
                  <Lock className="w-3.5 h-3.5 text-blue-600" /> Smart Contract:
                </span>
                <span className="font-mono text-blue-700 text-[11px] font-bold">0xPureTraceGov.sol</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
