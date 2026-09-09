import React, { useState } from 'react';
import { 
  FlaskConical, 
  Download, 
  Printer, 
  CheckCircle2, 
  BarChart3, 
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ADULTERANT_TEST_PANEL } from '../../data/mockData';

export default function LabResultsView() {
  const [selectedStandard, setSelectedStandard] = useState('FSSAI');
  const [showCoAModal, setShowCoAModal] = useState(false);
  const [isGeneratingCoA, setIsGeneratingCoA] = useState(false);

  const handleGenerateCoA = () => {
    setIsGeneratingCoA(true);
    setTimeout(() => {
      setIsGeneratingCoA(false);
      setShowCoAModal(true);
    }, 600);
  };

  return (
    <div className="space-y-6 text-slate-800">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-blue-950 flex items-center gap-3">
            <FlaskConical className="w-7 h-7 text-blue-600" />
            Advanced Spectrometry & Chemical Adulteration Panel
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Near-Infrared (NIR) 400-2500nm multi-channel optical absorption and enzymatic verification matrix.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerateCoA}
            disabled={isGeneratingCoA}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all"
          >
            <Award className="w-4 h-4 text-blue-200" />
            {isGeneratingCoA ? 'Compiling Spectral Signatures...' : 'Generate Official Certificate (CoA)'}
          </button>
        </div>
      </div>

      {/* NIR Spectral Graph Simulation */}
      <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">NIR Wavelength Optical Absorbance Fingerprint</h2>
              <p className="text-xs text-slate-500">Sample vs Pure Bovine Milk Reference Baseline (Confidence 99.4%)</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 text-blue-700 font-bold">
              <span className="w-3 h-0.5 bg-blue-600"></span> Current Batch #PT-8842
            </span>
            <span className="flex items-center gap-1.5 text-slate-400 ml-3 font-medium">
              <span className="w-3 h-0.5 bg-slate-300 border-dashed border-t"></span> Gold Baseline
            </span>
          </div>
        </div>

        {/* Spectral SVG Wave in Fresh Dairy Blue */}
        <div className="relative h-48 sm:h-56 w-full pt-4 flex items-end justify-center bg-blue-50/20 rounded-2xl">
          {/* Gridlines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
            <div className="border-b border-blue-200 w-full"></div>
            <div className="border-b border-blue-200 w-full"></div>
            <div className="border-b border-blue-200 w-full"></div>
            <div className="border-b border-blue-200 w-full"></div>
          </div>

          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 200">
            <defs>
              <linearGradient id="waveGradientLight" x1="0%" y1="0%" x2="0%" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            
            {/* Reference baseline */}
            <path
              d="M0,140 Q100,60 200,120 T400,90 T600,40 T800,100"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Active Sample Wave */}
            <path
              d="M0,140 Q100,58 200,118 T400,88 T600,38 T800,98 L800,200 L0,200 Z"
              fill="url(#waveGradientLight)"
            />
            <path
              d="M0,140 Q100,58 200,118 T400,88 T600,38 T800,98"
              fill="none"
              stroke="#2563eb"
              strokeWidth="3"
            />

            {/* Peaks */}
            <circle cx="200" cy="118" r="4" fill="#3b82f6" />
            <circle cx="600" cy="38" r="5" fill="#2563eb" className="animate-ping" />
            <circle cx="600" cy="38" r="4" fill="#2563eb" />
          </svg>
        </div>

        {/* Wavelength axis */}
        <div className="flex justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-100 font-semibold">
          <span>900 nm (Fat Peak)</span>
          <span>1200 nm (Water Band)</span>
          <span>1450 nm (Protein O-H)</span>
          <span>1730 nm (C-H Triglyceride)</span>
          <span>2100 nm (Lactose)</span>
          <span>2400 nm</span>
        </div>
      </div>

      {/* Adulterant Test Matrix */}
      <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Specific Adulterant & Contaminant Assay Panel</h2>
            <p className="text-xs text-slate-500">Automated chemical reagents and microfluidic assay outputs</p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Benchmark Standard:</span>
            {['FSSAI', 'CODEX', 'A2_GOLD'].map((std) => (
              <button
                key={std}
                onClick={() => setSelectedStandard(std)}
                className={`px-3 py-1 rounded-xl font-bold transition-all ${
                  selectedStandard === std
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {std === 'A2_GOLD' ? 'PureTrace Organic' : std}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
          {ADULTERANT_TEST_PANEL.map((test, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 transition-all flex flex-col justify-between space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{test.name}</h3>
                  <span className="text-[11px] text-blue-700 font-mono font-bold">{test.method}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> PASSED
                </span>
              </div>

              <p className="text-xs text-slate-600">{test.description}</p>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">Limit: <span className="text-slate-800 font-mono font-bold">{test.threshold}</span></span>
                <span className="text-slate-500">Observed: <span className="text-emerald-700 font-bold font-mono">{test.current}</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certificate of Analysis (CoA) Modal in White/Blue Theme */}
      {showCoAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-white border border-blue-100 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
          >
            {/* CoA Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-blue-600" />
                  <span className="text-lg font-black text-blue-950 tracking-tight">PureTrace Certificate of Analysis (CoA)</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  ISO 17025 Compliant Automated Analytical Certification
                </p>
              </div>

              <button
                onClick={() => setShowCoAModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            {/* CoA Details */}
            <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 space-y-4 text-xs font-mono text-slate-800">
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-blue-200/60">
                <div>
                  <span className="text-slate-500 block">Certificate Ref:</span>
                  <span className="text-blue-700 font-black">COA-2026-PT-8842-A2</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Date of Testing:</span>
                  <span className="font-bold">2026-09-09 23:48 IST</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Batch Identification:</span>
                  <span className="text-slate-900 font-black">PT-8842-A2 (14,200 Liters)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Origin:</span>
                  <span className="font-bold">GreenMeadow Co-op #14</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-slate-900 font-black uppercase tracking-wider block">Analytical Results:</span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-blue-100">
                    <span className="text-slate-500 text-[10px] block font-bold">Milk Fat</span>
                    <span className="text-emerald-700 font-black text-sm">4.52%</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-blue-100">
                    <span className="text-slate-500 text-[10px] block font-bold">SNF</span>
                    <span className="text-emerald-700 font-black text-sm">8.85%</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-blue-100">
                    <span className="text-slate-500 text-[10px] block font-bold">Freezing Point</span>
                    <span className="text-emerald-700 font-black text-sm">-0.548°C</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-slate-700 leading-relaxed font-sans text-xs">
                <span className="text-emerald-700 font-bold">CONCLUSION: </span>
                Sample meets and exceeds all national {selectedStandard} specifications for unadulterated, whole bovine milk. Negative for chemical additives, water dilution, and foreign nitrogenous compounds.
              </div>

              <div className="pt-3 border-t border-blue-200/60 flex items-center justify-between text-[11px] font-sans">
                <span>Validated by: <strong className="text-slate-900 font-bold">PureTrace Neural Core v3.4</strong></span>
                <span>Chief Quality Lead: <strong className="text-blue-700 font-bold">Dr. Sarah Chen</strong></span>
              </div>
            </div>

            {/* Modal actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => alert("Printing Certificate...")}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
              <button
                onClick={() => {
                  alert("Certificate PDF downloaded successfully.");
                  setShowCoAModal(false);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download Signed PDF
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
