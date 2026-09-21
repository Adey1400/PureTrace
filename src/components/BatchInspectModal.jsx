import React, { useState, useMemo } from 'react';
import { 
  X, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Thermometer, 
  FlaskConical, 
  CheckCircle2, 
  Truck, 
  Building2, 
  Copy, 
  Check 
} from 'lucide-react';
import { motion } from 'framer-motion';
import BatchQRCode from './BatchQRCode';
import ChainOfCustody from './ChainOfCustody';
import { getVerificationUrl } from '../utils/qrPayload';

export default function BatchInspectModal({ 
  batch, 
  onClose, 
  onUpdateStatus, 
  onOpenVerification = null 
}) {
  const [copiedHash, setCopiedHash] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'adulterants' | 'blockchain'

  const verificationUrl = useMemo(() => {
    if (!batch) return '';
    return getVerificationUrl(batch);
  }, [batch]);

  if (!batch) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(batch.blockchainHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const getRiskBadge = (risk) => {
    if (risk === 'Normal') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
          <CheckCircle2 className="w-3.5 h-3.5" /> Normal / Pure
        </span>
      );
    }
    if (risk === 'Suspicious') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-xs">
          <AlertTriangle className="w-3.5 h-3.5" /> Suspicious Anomaly
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-xs animate-pulse">
        <ShieldAlert className="w-3.5 h-3.5" /> High Risk / Adulterated
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-4xl max-h-[90vh] bg-white border border-blue-100 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-800"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-blue-50/40">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
              <FlaskConical className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-black tracking-tight text-blue-950">{batch.id}</h2>
                {getRiskBadge(batch.risk)}
              </div>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 font-medium">
                <span>{batch.breedType}</span>
                <span>•</span>
                <span className="text-blue-700 font-bold">{batch.volumeLiters.toLocaleString()} Liters</span>
                <span>•</span>
                <span>Logged {batch.timestamp}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Subnav Tabs */}
        <div className="flex border-b border-slate-100 px-6 bg-slate-50/50 text-sm font-semibold">
          {[
            { id: 'overview', label: 'Overview & Composition' },
            { id: 'adulterants', label: `Foreign Adulterants (${batch.adulterants.filter(a => a.detected).length} Flagged)` },
            { id: 'blockchain', label: 'Chain of Custody & QR' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 font-bold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-700 bg-white shadow-xs'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-sm">
          {activeTab === 'overview' && (
            <>
              {/* Summary Notes */}
              <div className={`p-4 rounded-2xl border ${
                batch.risk === 'Normal' 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : batch.risk === 'Suspicious'
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded bg-white mt-0.5 shadow-xs">
                    {batch.risk === 'Normal' ? <ShieldCheck className="w-4 h-4 text-emerald-600" /> : <ShieldAlert className="w-4 h-4 text-rose-600" />}
                  </div>
                  <div>
                    <span className="font-bold text-xs tracking-wide uppercase">AI Diagnostics Report:</span>
                    <p className="text-xs mt-1 leading-relaxed font-medium">{batch.notes}</p>
                  </div>
                </div>
              </div>

              {/* Chemical Breakdown Cards */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Core Biochemical Parameters</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100">
                    <span className="text-[11px] text-slate-500 font-bold">Milk Fat (MF)</span>
                    <p className="text-xl font-black text-slate-900 mt-1 font-mono">{batch.fat}%</p>
                    <span className="text-[10px] text-blue-700 font-bold">Standard: ≥ 4.0%</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100">
                    <span className="text-[11px] text-slate-500 font-bold">Solids-Not-Fat (SNF)</span>
                    <p className="text-xl font-black text-slate-900 mt-1 font-mono">{batch.snf}%</p>
                    <span className="text-[10px] text-blue-700 font-bold">Standard: ≥ 8.5%</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100">
                    <span className="text-[11px] text-slate-500 font-bold">Cryo Freezing Point</span>
                    <p className="text-xl font-black text-slate-900 mt-1 font-mono">{batch.freezingPoint}°C</p>
                    <span className={`text-[10px] font-bold ${batch.freezingPoint > -0.52 ? 'text-rose-600' : 'text-emerald-700'}`}>
                      Normal: &lt; -0.540°C
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100">
                    <span className="text-[11px] text-slate-500 font-bold">Added Water Anomaly</span>
                    <p className={`text-xl font-black mt-1 font-mono ${batch.addedWater > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {batch.addedWater}%
                    </p>
                    <span className="text-[10px] text-slate-500 font-bold">Tolerance: &lt; 0.5%</span>
                  </div>
                </div>
              </div>

              {/* Extended Physical Profile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Origin & Cold Chain</h4>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-blue-600" /> Origin:</span>
                      <span className="text-slate-900 font-bold text-right">{batch.farmOrigin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-blue-600" /> Tanker:</span>
                      <span className="text-slate-900 font-bold">{batch.tankerId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5"><Thermometer className="w-3.5 h-3.5 text-blue-600" /> Current Temp:</span>
                      <span className={`font-mono font-bold ${batch.tempC > 5.0 ? 'text-rose-600' : 'text-emerald-700'}`}>{batch.tempC}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Cold Chain Compliance:</span>
                      <span className="text-emerald-700 font-mono font-bold">{batch.coldChainCompliance}%</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Microbiological & Physical</h4>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">pH Electrode:</span>
                      <span className="font-mono font-bold text-slate-900">{batch.ph} (std 6.60 - 6.80)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Conductivity:</span>
                      <span className="font-mono font-bold text-slate-900">{batch.conductivity} mS/cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">MBRT Dye Bleach Time:</span>
                      <span className="font-mono font-bold text-slate-900">{batch.mbrtMinutes} mins</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Somatic Cell Count (SCC):</span>
                      <span className="font-mono font-bold text-slate-900">{batch.scc.toLocaleString()} cells/mL</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'adulterants' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Multi-wavelength spectroscopic & enzymatic assays tested in receiving laboratory.
              </p>
              <div className="divide-y divide-slate-100 rounded-2xl bg-white border border-slate-200 overflow-hidden">
                {batch.adulterants.map((item, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <span className="text-sm font-bold text-slate-900">{item.name}</span>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{item.value}</p>
                    </div>
                    <div>
                      {item.detected ? (
                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5 animate-pulse">
                          <ShieldAlert className="w-3.5 h-3.5" /> POSITIVE DETECTED
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Clean / Undetected
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'blockchain' && (
            <div className="space-y-6">
              {/* QR Verification Seal Card */}
              <div className="p-5 rounded-2xl bg-blue-50/40 border border-blue-200 flex flex-col sm:flex-row items-center gap-6">
                <BatchQRCode
                  value={verificationUrl}
                  size={190}
                  batchId={batch.id}
                  onOpenVerify={onOpenVerification ? () => onOpenVerification(verificationUrl) : null}
                />

                <div className="space-y-2 flex-1 w-full">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-black text-blue-950">Cryptographic Traceability Ledger</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
                      Integrity Verified Seal
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    This milk batch is cryptographically serialized with an immutable chain of custody. Scan the QR code with any mobile camera to independently verify batch integrity.
                  </p>
                  
                  <div className="pt-2">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Ledger Head Hash (SHA-256)</span>
                    <div className="mt-1 flex items-center gap-2 p-2.5 rounded-xl bg-white border border-blue-200 text-xs font-mono text-blue-900 break-all">
                      <span className="truncate">{batch.blockchainHash}</span>
                      <button
                        onClick={handleCopyHash}
                        className="p-1 text-slate-400 hover:text-blue-600 shrink-0"
                        title="Copy Hash"
                      >
                        {copiedHash ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">QR Identifier</span>
                      <span className="font-mono text-blue-900 font-bold">{batch.qrCodeId}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Signed By</span>
                      <span className="text-slate-800 font-bold">{batch.operator}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Chain of Custody & Verification Module */}
              <ChainOfCustody batch={batch} />
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Status:</span>
            <span className="font-black text-slate-900 uppercase">{batch.status}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onUpdateStatus(batch.id, 'Quarantined')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                batch.status === 'Quarantined'
                  ? 'bg-rose-100 border-rose-300 text-rose-800'
                  : 'bg-white border-rose-200 text-rose-600 hover:bg-rose-50'
              }`}
            >
              Quarantine Batch
            </button>

            <button
              onClick={() => onUpdateStatus(batch.id, 'Approved')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                batch.status === 'Approved'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20'
              }`}
            >
              Approve for Bottling
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
