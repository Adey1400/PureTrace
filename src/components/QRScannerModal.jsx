import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Sparkles, 
  Search, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  ScanLine
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getVerificationUrl } from '../utils/qrPayload';

export default function QRScannerModal({ 
  isOpen, 
  onClose, 
  onScanSuccess, 
  batches = [] 
}) {
  const [activeTab, setActiveTab] = useState('camera'); // 'camera' | 'demo' | 'manual'
  const [cameraError, setCameraError] = useState(null);
  const [manualQuery, setManualQuery] = useState('');
  const [manualError, setManualError] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    let active = true;
    let stream = null;
    let scanInterval = null;

    async function initCamera() {
      if (!isOpen || activeTab !== 'camera') return;
      setCameraError(null);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (active) {
          setCameraError('Camera access is not supported by your browser environment. Please use the Demo Scan or Manual Search tabs.');
        }
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        if (!active) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');
          await videoRef.current.play();
        }

        if ('BarcodeDetector' in window) {
          try {
            const barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
            scanInterval = setInterval(async () => {
              if (!videoRef.current || videoRef.current.readyState < 2) return;
              try {
                const barcodes = await barcodeDetector.detect(videoRef.current);
                if (barcodes.length > 0 && active) {
                  clearInterval(scanInterval);
                  onScanSuccess(barcodes[0].rawValue);
                }
              } catch {
                // ignore frame detection error
              }
            }, 300);
          } catch {
            // BarcodeDetector not available
          }
        }
      } catch {
        if (active) {
          setCameraError('Camera permission denied or camera device busy. Use Demo Scan or Manual Input below.');
        }
      }
    }

    initCamera();

    return () => {
      active = false;
      if (scanInterval) clearInterval(scanInterval);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, activeTab, onScanSuccess]);

  const handleDemoSelect = (batch) => {
    const url = getVerificationUrl(batch);
    onScanSuccess(url);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    setManualError(null);
    const q = manualQuery.trim();
    if (!q) return;

    const match = batches.find(b => 
      b.id.toLowerCase() === q.toLowerCase() ||
      b.qrCodeId?.toLowerCase() === q.toLowerCase()
    );

    if (match) {
      const url = getVerificationUrl(match);
      onScanSuccess(url);
    } else {
      setManualError(`No batch found with ID "${q}". Please check the ID or try a sample batch.`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-white rounded-3xl border border-blue-100 shadow-2xl overflow-hidden flex flex-col text-slate-800"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-blue-50/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-blue-950">Verify PureTrace Milk Batch</h3>
              <p className="text-xs text-slate-500 font-medium">Scan QR code or look up cryptographic batch identity</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 border-b border-slate-100 bg-slate-50/50 text-xs font-bold text-center">
          <button
            onClick={() => setActiveTab('camera')}
            className={`py-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'camera'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Camera className="w-4 h-4" /> Camera
          </button>
          <button
            onClick={() => setActiveTab('demo')}
            className={`py-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'demo'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-blue-600" /> Demo Scan
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`py-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'manual'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Search className="w-4 h-4" /> Batch ID
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* CAMERA TAB */}
          {activeTab === 'camera' && (
            <div className="space-y-4 text-center">
              {cameraError ? (
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-3">
                  <AlertCircle className="w-6 h-6 text-amber-600 mx-auto" />
                  <p className="font-medium">{cameraError}</p>
                  <button
                    onClick={() => setActiveTab('demo')}
                    className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 transition-colors shadow-xs"
                  >
                    Use Interactive Demo Scan →
                  </button>
                </div>
              ) : (
                <div className="relative w-full aspect-square max-w-[280px] mx-auto rounded-3xl overflow-hidden bg-slate-950 border-4 border-blue-600 shadow-inner flex items-center justify-center">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                  />
                  {/* Targeting Reticle */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-dashed border-sky-400 rounded-2xl relative animate-pulse">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-white rounded-tl"></div>
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-white rounded-tr"></div>
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-white rounded-bl"></div>
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-white rounded-br"></div>
                    </div>
                  </div>
                </div>
              )}
              <p className="text-xs text-slate-500">
                Point your camera at a PureTrace bottle or intake seal QR code.
              </p>
            </div>
          )}

          {/* DEMO SCAN TAB (Progressive fallback) */}
          {activeTab === 'demo' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-blue-50/50 border border-blue-200 text-xs text-blue-900">
                <span className="font-bold block">One-Click QR Simulation:</span>
                Select any active batch below to simulate an immediate camera barcode scan and trigger cryptographic verification.
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {batches.slice(0, 5).map(b => (
                  <button
                    key={b.id}
                    onClick={() => handleDemoSelect(b)}
                    className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition-all flex items-center justify-between group shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-blue-700">{b.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          b.risk === 'Normal' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{b.farmOrigin}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{b.qrCodeId}</span>
                    </div>
                    <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                      Scan →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MANUAL BATCH ID TAB */}
          {activeTab === 'manual' && (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Enter PureTrace Batch ID or QR Identifier
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={manualQuery}
                    onChange={(e) => setManualQuery(e.target.value)}
                    placeholder="e.g. PT-8842-A2 or PT-QR-8842-A2"
                    className="w-full bg-blue-50/50 border border-blue-200 focus:border-blue-600 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 font-mono outline-none"
                    autoFocus
                  />
                </div>
              </div>

              {manualError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{manualError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify Batch Integrity</span>
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
