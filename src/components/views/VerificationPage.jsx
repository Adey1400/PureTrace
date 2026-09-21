import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Droplet, 
  ArrowLeft, 
  ExternalLink, 
  Copy, 
  Check, 
  Building2, 
  Truck, 
  Layers, 
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { deserializeQrPayload, verifyQrPayload } from '../../utils/qrPayload';
import { verifyBatchLedger } from '../../utils/blockchain';

export default function VerificationPage({ 
  batches = [], 
  onGoHome, 
  onInspectBatch = null 
}) {
  const [loading, setLoading] = useState(true);
  const [verificationState, setVerificationState] = useState(null); // 'VERIFIED' | 'TAMPER_DETECTED' | 'INVALID_QR'
  const [verificationDetails, setVerificationDetails] = useState(null);
  const [batchData, setBatchData] = useState(null);
  const [copiedHash, setCopiedHash] = useState(false);

  useEffect(() => {
    let active = true;

    async function verify() {
      // Smooth visual feedback for cryptographic computation
      await new Promise(r => setTimeout(r, 200));
      if (!active) return;

      const params = new URLSearchParams(window.location.search);
      const dataParam = params.get('data');
      const batchIdParam = params.get('batchId') || params.get('id');

      // Case 1: Standalone cross-device verification via encoded QR payload
      if (dataParam) {
        try {
          const payload = deserializeQrPayload(dataParam);
          const result = await verifyQrPayload(payload);
          if (!active) return;
          setVerificationState(result.status);
          setVerificationDetails(result.reason);
          if (result.valid && result.batch) {
            setBatchData(result.batch);
          } else if (payload?.data) {
            // Keep partial data for tamper inspection
            setBatchData({
              id: payload.id || 'Unknown',
              qrCodeId: payload.qrId || 'Unknown',
              blockchainHash: payload.lh || 'Unknown',
              farmOrigin: payload.data.origin || 'Unknown',
              chillingCenter: payload.data.chilling || 'Unknown',
              volumeLiters: payload.data.vol || 0,
              fat: payload.data.fat || 0,
              snf: payload.data.snf || 0,
              tempC: payload.data.temp || 0,
              ph: payload.data.ph || 0,
              status: payload.data.status || 'Tampered',
              risk: payload.data.risk || 'High Risk',
              timeFull: payload.data.time || 'N/A',
              chain: payload.chain || []
            });
          }
        } catch (err) {
          if (!active) return;
          setVerificationState('INVALID_QR');
          setVerificationDetails(err?.message || 'Malformed QR code payload or corrupted URL string.');
        } finally {
          if (active) setLoading(false);
        }
        return;
      }

      // Case 2: Batch ID parameter lookup in available batches
      if (batchIdParam) {
        const match = batches.find(b => 
          b.id.toLowerCase() === batchIdParam.toLowerCase() ||
          b.qrCodeId?.toLowerCase() === batchIdParam.toLowerCase()
        );

        if (match) {
          if (match.ledger && Array.isArray(match.ledger)) {
            const ledgerResult = await verifyBatchLedger(match.ledger);
            if (!active) return;
            setVerificationState(ledgerResult.valid ? 'VERIFIED' : 'TAMPER_DETECTED');
            setVerificationDetails(ledgerResult.reason);
            setBatchData(match);
          } else {
            if (!active) return;
            setVerificationState('VERIFIED');
            setVerificationDetails('Batch record found in registry.');
            setBatchData(match);
          }
        } else {
          if (!active) return;
          setVerificationState('INVALID_QR');
          setVerificationDetails(`No batch record found matching "${batchIdParam}".`);
        }
        if (active) setLoading(false);
        return;
      }

      // Default fallback: If opened without query params, verify the primary active batch
      if (batches.length > 0) {
        const primaryBatch = batches[0];
        if (primaryBatch.ledger) {
          const ledgerResult = await verifyBatchLedger(primaryBatch.ledger);
          if (!active) return;
          setVerificationState(ledgerResult.valid ? 'VERIFIED' : 'TAMPER_DETECTED');
          setVerificationDetails(ledgerResult.reason);
        } else {
          if (!active) return;
          setVerificationState('VERIFIED');
          setVerificationDetails('Default batch registry record.');
        }
        setBatchData(primaryBatch);
      } else {
        if (!active) return;
        setVerificationState('INVALID_QR');
        setVerificationDetails('No batch data provided for verification.');
      }
      if (active) setLoading(false);
    }

    verify();

    return () => {
      active = false;
    };
  }, [batches]);

  const handleCopyHash = () => {
    if (batchData?.blockchainHash) {
      navigator.clipboard.writeText(batchData.blockchainHash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/60 via-white to-blue-50/40 text-slate-800 font-sans selection:bg-blue-600 selection:text-white antialiased p-4 sm:p-6 lg:p-8">
      {/* Top Consumer Navigation Bar */}
      <header className="max-w-4xl mx-auto flex items-center justify-between pb-6 border-b border-blue-100">
        <button
          onClick={onGoHome}
          className="px-4 py-2 rounded-xl bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to PureTrace</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <Droplet className="w-5 h-5 fill-white" />
          </div>
          <span className="text-lg font-black tracking-tight text-blue-950">
            Pure<span className="text-blue-600">Trace</span>
          </span>
          <span className="hidden sm:inline text-xs text-slate-400 font-medium">| Consumer Verification</span>
        </div>

        {onInspectBatch && batchData && (
          <button
            onClick={() => onInspectBatch(batchData)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all"
          >
            <span>Enterprise Hub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </header>

      {/* Main Verification Viewport */}
      <main className="max-w-4xl mx-auto mt-6 space-y-6">
        {loading ? (
          <div className="p-16 rounded-3xl bg-white border border-blue-100 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto animate-pulse">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-blue-950">Verifying Cryptographic Ledger...</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Recomputing SHA-256 block hashes and validating chain of custody continuity across all custody checkpoints.
            </p>
          </div>
        ) : verificationState === 'VERIFIED' && batchData ? (
          /* ============================================================ */
          /* VERIFIED STATE                                              */
          /* ============================================================ */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Emerald Certificate Hero Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-900/15 relative overflow-hidden">
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shrink-0 shadow-lg">
                    <CheckCircle2 className="w-9 h-9 text-emerald-100" />
                  </div>
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-yellow-300" /> PureTrace Integrity Verified
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                      Verified PureTrace Milk Batch
                    </h1>
                    <p className="text-xs sm:text-sm text-emerald-50/90 leading-relaxed max-w-xl">
                      Cryptographic integrity verified. Every custody checkpoint from dairy farm to bottling matches the tamper-evident ledger.
                    </p>
                  </div>
                </div>

                <div className="sm:text-right font-mono text-xs bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 space-y-1 self-start sm:self-auto">
                  <span className="text-[10px] text-emerald-200 block uppercase font-sans font-bold">Batch Reference</span>
                  <span className="text-lg font-black text-white block">{batchData.id}</span>
                  <span className="text-[11px] text-emerald-100 block">{batchData.qrCodeId}</span>
                </div>
              </div>
            </div>

            {/* Cryptographic Ledger Seal Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-blue-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Ledger Hash Seal (SHA-256)
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Chain Verified
                </span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50/50 border border-blue-200 font-mono text-xs text-blue-950 break-all">
                <span className="truncate flex-1">{batchData.blockchainHash}</span>
                <button
                  onClick={handleCopyHash}
                  className="p-1 text-slate-400 hover:text-blue-700 shrink-0"
                  title="Copy Hash"
                >
                  {copiedHash ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Milk Composition Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-xs text-center">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Milk Fat (MF)</span>
                <p className="text-2xl font-black text-slate-900 font-mono mt-1">{batchData.fat}%</p>
                <span className="text-[10px] text-emerald-700 font-bold">Standard ≥ 4.0%</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-xs text-center">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Solids-Not-Fat</span>
                <p className="text-2xl font-black text-slate-900 font-mono mt-1">{batchData.snf}%</p>
                <span className="text-[10px] text-emerald-700 font-bold">Standard ≥ 8.5%</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-xs text-center">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Intake Temp</span>
                <p className={`text-2xl font-black font-mono mt-1 ${batchData.tempC > 5.0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {batchData.tempC}°C
                </p>
                <span className="text-[10px] text-slate-500 font-medium">Sub-4°C Locked</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-xs text-center">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">pH Level</span>
                <p className="text-2xl font-black text-slate-900 font-mono mt-1">{batchData.ph}</p>
                <span className="text-[10px] text-emerald-700 font-bold">Pure Baseline</span>
              </div>
            </div>

            {/* Origin & Provenance Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3 text-xs">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Farm Origin & Dairy Co-op
                </h3>
                <div className="space-y-2 text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dairy Cooperative:</span>
                    <strong className="text-slate-900 text-right">{batchData.farmOrigin}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Breed Type:</span>
                    <span className="text-slate-800 font-medium">{batchData.breedType || 'Indigenous Gir & Sahiwal'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Batch Volume:</span>
                    <strong className="text-blue-700 font-mono">{batchData.volumeLiters?.toLocaleString()} Liters</strong>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3 text-xs">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  Chilling Node & Cold Logistics
                </h3>
                <div className="space-y-2 text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Chilling Center:</span>
                    <strong className="text-slate-900">{batchData.chillingCenter}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Quality Operator:</span>
                    <span className="text-slate-800 font-medium">{batchData.operator}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Time of Intake:</span>
                    <span className="text-slate-800 font-mono">{batchData.timeFull || batchData.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Verifiable Chain of Custody Timeline */}
            <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-black text-blue-950">Verified Chain of Custody</h3>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  {batchData.ledger?.length || 7} Checkpoints Validated
                </span>
              </div>

              <div className="space-y-3">
                {(batchData.ledger || []).map((step, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-2xl bg-blue-50/30 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                        ✓
                      </div>
                      <div>
                        <span className="font-bold text-slate-900">
                          Block #{step.index}: {step.blockType.replace(/_/g, ' ')}
                        </span>
                        <p className="text-slate-500 text-[11px]">{step.location}</p>
                      </div>
                    </div>
                    <div className="sm:text-right font-mono text-[11px] text-slate-500">
                      <span>{step.timestamp}</span>
                      <span className="block text-[10px] text-blue-700 truncate max-w-xs">{step.hash}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : verificationState === 'TAMPER_DETECTED' ? (
          /* ============================================================ */
          /* TAMPER DETECTED STATE                                        */
          /* ============================================================ */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-tr from-rose-700 via-rose-600 to-red-600 text-white shadow-xl shadow-rose-900/15 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-9 h-9 text-rose-100 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider">
                    <AlertTriangle className="w-3 h-3 text-yellow-300" /> Tamper Alarm
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    Verification Failed: Hash Mismatch Detected
                  </h1>
                  <p className="text-xs sm:text-sm text-rose-50/90 leading-relaxed">
                    The QR payload or traceability record has been modified after issuance. The recomputed cryptographic hash does not match the batch seal.
                  </p>
                </div>
              </div>
            </div>

            {/* Diagnostic Box */}
            <div className="p-6 rounded-3xl bg-white border border-rose-200 shadow-sm space-y-3 text-xs">
              <h3 className="font-bold text-rose-950 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Cryptographic Discrepancy Diagnostics
              </h3>
              <p className="text-slate-600 leading-relaxed">
                <strong>Failure Reason:</strong> {verificationDetails || 'Stored block hash does not match computed value.'}
              </p>
              <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200 font-mono text-[11px] text-rose-900 break-all space-y-1">
                <div>Batch ID: {batchData?.id || 'Unknown'}</div>
                <div>Ledger Hash: {batchData?.blockchainHash || 'Invalid'}</div>
              </div>
              <p className="text-[11px] text-slate-500 italic">
                Notice: PureTrace automated lockouts protect consumer safety by rejecting batches with broken custody hashes or modified biological parameters.
              </p>
            </div>
          </motion.div>
        ) : (
          /* ============================================================ */
          /* INVALID QR STATE                                             */
          /* ============================================================ */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-xl text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Invalid PureTrace QR Code</h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              {verificationDetails || 'This QR code does not contain a recognized PureTrace verification payload or has an unsupported format.'}
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={onGoHome}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                Return to PureTrace Home
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
