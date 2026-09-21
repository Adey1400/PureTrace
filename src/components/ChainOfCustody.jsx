import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Copy, 
  Check, 
  Bug, 
  RotateCcw,
  Building2, 
  Layers, 
  Snowflake, 
  Truck, 
  Factory, 
  FlaskConical, 
  Package, 
  FileEdit,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { verifyBatchLedger, simulateTamper } from '../utils/blockchain';

const STAGE_ICONS = {
  GENESIS: Building2,
  COLLECTION: Layers,
  CHILLING: Snowflake,
  TRANSPORT: Truck,
  PROCESSING_INTAKE: Factory,
  QUALITY_INSPECTION: FlaskConical,
  PACKAGING: Package,
  STATUS_UPDATE: FileEdit
};

const STAGE_TITLES = {
  GENESIS: 'Block 0: Genesis & Farm Origin',
  COLLECTION: 'Block 1: Village Co-op Collection',
  CHILLING: 'Block 2: Bulk Milk Chilling (BMC)',
  TRANSPORT: 'Block 3: Cold-Chain Transport',
  PROCESSING_INTAKE: 'Block 4: Processing Plant Intake',
  QUALITY_INSPECTION: 'Block 5: Quality & NIR Inspection',
  PACKAGING: 'Block 6: Bottling & QR Serialization',
  STATUS_UPDATE: 'Block 7: Batch Custody Action'
};

export default function ChainOfCustody({ batch }) {
  const [tamperedLedger, setTamperedLedger] = useState(null);
  const [tamperedBatchId, setTamperedBatchId] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [expandedBlocks, setExpandedBlocks] = useState({ 0: true, 6: true, 7: true });
  const [copiedHash, setCopiedHash] = useState(null);

  const isTampered = tamperedLedger !== null && tamperedBatchId === batch?.id;
  const activeLedger = isTampered ? tamperedLedger : (batch?.ledger || []);

  // Run cryptographic verification
  const handleVerify = async (ledgerToTest = activeLedger) => {
    setIsVerifying(true);
    // Minimal delay for smooth visual feedback
    await new Promise(r => setTimeout(r, 250));
    try {
      const result = await verifyBatchLedger(ledgerToTest);
      setVerificationResult(result);
    } catch (err) {
      setVerificationResult({
        valid: false,
        checkedBlocks: 0,
        invalidBlockIndex: 0,
        reason: err.message
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Simulate deliberate tampering on Block 2 (Chilling)
  const handleSimulateTamper = async () => {
    const tampered = simulateTamper(activeLedger, 2, 'measuredTempC', 12.8);
    setTamperedLedger(tampered);
    setTamperedBatchId(batch?.id);
    await handleVerify(tampered);
  };

  // Restore untouched original ledger
  const handleRestore = async () => {
    setTamperedLedger(null);
    setTamperedBatchId(null);
    if (batch?.ledger) {
      await handleVerify(batch.ledger);
    }
  };

  const toggleExpand = (idx) => {
    setExpandedBlocks(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(key);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  if (!activeLedger || activeLedger.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 bg-blue-50/50 rounded-2xl border border-blue-100">
        No cryptographic ledger recorded for this batch.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Top Ledger Verification Control Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 via-slate-50 to-blue-50/70 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-xs ${
            verificationResult?.valid 
              ? 'bg-emerald-600 text-white' 
              : verificationResult && !verificationResult.valid
                ? 'bg-rose-600 text-white'
                : 'bg-blue-600 text-white'
          }`}>
            {verificationResult?.valid ? (
              <ShieldCheck className="w-5 h-5" />
            ) : verificationResult && !verificationResult.valid ? (
              <ShieldAlert className="w-5 h-5" />
            ) : (
              <ShieldCheck className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
                Cryptographic Traceability Ledger
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-100/70 text-blue-800 font-bold">
                {activeLedger.length} Linked Blocks
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {verificationResult 
                ? verificationResult.reason 
                : 'Deterministic SHA-256 block ledger with previousHash continuity.'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-end">
          <button
            onClick={() => handleVerify(activeLedger)}
            disabled={isVerifying}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>{isVerifying ? 'Recomputing Hashes...' : 'Verify Ledger'}</span>
          </button>

          {!isTampered ? (
            <button
              onClick={handleSimulateTamper}
              title="Tamper with Block #2 temperature to demonstrate real hash mismatch detection"
              className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5 transition-colors"
            >
              <Bug className="w-3.5 h-3.5 text-amber-600" />
              <span>Simulate Tamper</span>
            </button>
          ) : (
            <button
              onClick={handleRestore}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 transition-colors animate-pulse"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
              <span>Restore Integrity</span>
            </button>
          )}
        </div>
      </div>

      {/* Verification Status Banner */}
      {verificationResult && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
            verificationResult.valid
              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
              : 'bg-rose-50/90 border-rose-300 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-2 font-medium">
            {verificationResult.valid ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>
              <strong>{verificationResult.valid ? 'Chain Verified:' : 'Integrity Failed:'}</strong> {verificationResult.reason}
            </span>
          </div>
          <span className="font-mono text-[11px] font-bold shrink-0">
            {verificationResult.checkedBlocks} / {activeLedger.length} Verified
          </span>
        </motion.div>
      )}

      {/* Vertical Stepped Blocks Timeline */}
      <div className="space-y-3 relative before:absolute before:top-4 before:bottom-4 before:left-5 before:w-0.5 before:bg-blue-100">
        {activeLedger.map((block, idx) => {
          const Icon = STAGE_ICONS[block.blockType] || Layers;
          const isInvalid = verificationResult && !verificationResult.valid && idx >= verificationResult.invalidBlockIndex;
          const isDirectlyTampered = verificationResult && !verificationResult.valid && idx === verificationResult.invalidBlockIndex;
          const isExpanded = expandedBlocks[idx];

          return (
            <div 
              key={`${block.batchId}-${block.index}`}
              className={`relative pl-12 transition-all`}
            >
              {/* Node Bullet Icon */}
              <div 
                className={`absolute left-2.5 top-3.5 -translate-x-1/2 w-8 h-8 rounded-xl border flex items-center justify-center shadow-xs z-10 transition-colors ${
                  isDirectlyTampered
                    ? 'bg-rose-600 border-rose-700 text-white animate-bounce'
                    : isInvalid
                      ? 'bg-amber-100 border-amber-300 text-amber-800'
                      : verificationResult?.valid
                        ? 'bg-emerald-600 border-emerald-700 text-white'
                        : 'bg-white border-blue-200 text-blue-700'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              {/* Block Card */}
              <div className={`p-4 rounded-2xl bg-white border transition-all shadow-xs ${
                isDirectlyTampered
                  ? 'border-rose-400 ring-2 ring-rose-200 bg-rose-50/20'
                  : isInvalid
                    ? 'border-amber-300 bg-amber-50/20'
                    : 'border-slate-200 hover:border-blue-300'
              }`}>
                {/* Block Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      BLOCK #{block.index}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {STAGE_TITLES[block.blockType] || block.blockType}
                    </span>
                    {isDirectlyTampered ? (
                      <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded border border-rose-300 animate-pulse">
                        Tamper Detected
                      </span>
                    ) : isInvalid ? (
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-300">
                        Chain Broken
                      </span>
                    ) : verificationResult?.valid ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300">
                        ✓ Hash Verified
                      </span>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="font-mono">{block.timestamp}</span>
                    <button
                      onClick={() => toggleExpand(idx)}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Block Metadata Bar */}
                <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-medium">
                  <div>
                    <span className="text-slate-400">Actor:</span> <strong>{block.actor}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Location:</span> <span>{block.location}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 mt-1.5 leading-relaxed">
                  {block.description}
                </p>

                {/* Expandable Technical Ledger Hashes & Data */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-xs overflow-hidden"
                    >
                      {/* Event Data Snapshot */}
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                          Block Data Payload
                        </span>
                        <pre className="font-mono text-[11px] text-slate-800 whitespace-pre-wrap break-all">
                          {JSON.stringify(block.data, null, 2)}
                        </pre>
                      </div>

                      {/* Cryptographic Hashes Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono">
                        {/* Previous Block Hash */}
                        <div className="p-2 rounded-xl bg-blue-50/40 border border-blue-100 flex items-center justify-between gap-2">
                          <div className="truncate">
                            <span className="text-[10px] text-slate-400 block uppercase font-sans font-bold">previousHash</span>
                            <span className="text-slate-700 truncate block">{block.previousHash}</span>
                          </div>
                          <button
                            onClick={() => copyToClipboard(block.previousHash, `ph-${idx}`)}
                            className="text-slate-400 hover:text-blue-600 shrink-0"
                            title="Copy previousHash"
                          >
                            {copiedHash === `ph-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        {/* Current Block Hash */}
                        <div className="p-2 rounded-xl bg-blue-50/40 border border-blue-100 flex items-center justify-between gap-2">
                          <div className="truncate">
                            <span className="text-[10px] text-slate-400 block uppercase font-sans font-bold">blockHash (SHA-256)</span>
                            <span className="text-blue-900 font-bold truncate block">{block.hash}</span>
                          </div>
                          <button
                            onClick={() => copyToClipboard(block.hash, `bh-${idx}`)}
                            className="text-slate-400 hover:text-blue-600 shrink-0"
                            title="Copy blockHash"
                          >
                            {copiedHash === `bh-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
