import React, { useState, useMemo } from 'react';
import { QrCode, Copy, Check, ExternalLink, Download } from 'lucide-react';
import { generateQrSvg } from '../utils/qrcode';

/**
 * High-fidelity, standards-compatible SVG QR code component for PureTrace batches.
 */
export default function BatchQRCode({ 
  value, 
  size = 180, 
  batchId = '', 
  showActions = true,
  onOpenVerify = null 
}) {
  const [copied, setCopied] = useState(false);

  // Generate SVG markup deterministically
  const svgMarkup = useMemo(() => {
    if (!value) return null;
    try {
      return generateQrSvg(value, {
        quietZone: 4,
        fgColor: '#0f172a',
        bgColor: '#ffffff'
      });
    } catch (err) {
      console.error('QR code generation error:', err);
      return null;
    }
  }, [value]);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!svgMarkup) return;
    const blob = new Blob([svgMarkup], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PureTrace-QR-${batchId || 'batch'}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!svgMarkup) {
    return (
      <div 
        style={{ width: size, height: size }}
        className="rounded-2xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center p-3 text-center text-xs text-slate-400"
      >
        <QrCode className="w-8 h-8 mb-1 text-slate-300 animate-pulse" />
        <span>Generating QR...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-3">
      {/* Crisp SVG QR Code Card */}
      <div 
        className="p-3.5 bg-white rounded-2xl border-2 border-blue-200 shadow-lg shadow-blue-900/5 transition-transform hover:scale-[1.02]"
        style={{ width: size, height: size }}
      >
        <div 
          className="w-full h-full [&>svg]:w-full [&>svg]:h-full select-none"
          dangerouslySetInnerHTML={{ __html: svgMarkup }}
        />
      </div>

      {showActions && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
          <button
            onClick={handleCopy}
            type="button"
            className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold flex items-center gap-1 border border-blue-200 transition-colors"
            title="Copy Verification Link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy URL'}</span>
          </button>

          <button
            onClick={handleDownload}
            type="button"
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold flex items-center gap-1 border border-slate-200 transition-colors"
            title="Download Vector SVG"
          >
            <Download className="w-3.5 h-3.5" />
            <span>SVG</span>
          </button>

          {onOpenVerify && (
            <button
              onClick={onOpenVerify}
              type="button"
              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1 border border-emerald-200 transition-colors"
              title="Open Consumer Verification Screen"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Verify</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
