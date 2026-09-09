import React, { useState } from 'react';
import { 
  Droplet, 
  ShieldCheck, 
  Snowflake, 
  QrCode, 
  ArrowRight, 
  Search, 
  CheckCircle2, 
  Award, 
  Heart, 
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage({ onEnterHub, onVerifyBatchId }) {
  const [quickSearchId, setQuickSearchId] = useState('');

  const handleVerify = (e) => {
    e.preventDefault();
    const query = quickSearchId.trim() || 'PT-8842-A2';
    onVerifyBatchId(query);
  };

  const sampleBatches = [
    { id: 'PT-8842-A2', label: 'Amul Gold A2 Cow Milk', farm: 'GreenMeadow Co-op' },
    { id: 'PT-8840-BT', label: 'Buffalo Special Rich Cream', farm: 'Kaveri Aggregator' },
    { id: 'PT-8838-PR', label: 'Organic Pasture Blend', farm: 'BioPure Organic' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Dairy Header Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm shadow-blue-900/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Logo with Amul-style Royal Blue & White Badge */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 p-1 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                <Droplet className="w-7 h-7 text-blue-600 fill-blue-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-blue-700">Pure<span className="text-blue-500">Trace</span></span>
                <span className="px-2 py-0.5 text-[11px] font-bold bg-red-600 text-white rounded-full uppercase tracking-wider shadow-sm">
                  100% PURE
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">The Taste of Pure Trust • Dairy Intelligence</p>
            </div>
          </div>

          {/* Right Header Navigation & Enterprise Launch */}
          <div className="flex items-center gap-4">
            <button
              onClick={onEnterHub}
              className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/30 flex items-center gap-2 transition-all hover:translate-y-[-1px]"
            >
              <span>Enterprise Hub</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero Section with Amul Blue & White Packet Style + Milk Splash Vector */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-700 via-blue-600 to-blue-800 text-white pt-12 pb-20 px-4 sm:px-6">
        {/* Decorative wave background accents */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-blue-100 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>India's AI Milk Quality & Traceability Movement</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
              Pure Milk, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-white to-blue-100">
                Guaranteed from Farm
              </span> <br />
              to Your Kitchen Table.
            </h1>

            <p className="text-base sm:text-lg text-blue-100/90 max-w-xl leading-relaxed">
              Every drop is tracked across dairy farms, chilling centers, and cryogenic tankers. Powered by instant spectroscopic adulterant audits and tamper-proof blockchain certificates.
            </p>

            {/* Quick Bottle Verification Search */}
            <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-2xl border border-blue-200 text-slate-800 max-w-xl space-y-3">
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-blue-600" /> Verify Your Milk Pouch / Bottle
              </span>

              <form onSubmit={handleVerify} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={quickSearchId}
                    onChange={(e) => setQuickSearchId(e.target.value)}
                    placeholder="Enter Batch ID (e.g. PT-8842-A2)..."
                    className="w-full bg-blue-50/50 border border-blue-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-800 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/30 flex items-center gap-1.5 transition-all shrink-0"
                >
                  <Search className="w-4 h-4" /> Check Purity
                </button>
              </form>

              {/* Sample Batch Quick Links */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-500 font-medium">Try Sample:</span>
                {sampleBatches.map(sample => (
                  <button
                    key={sample.id}
                    onClick={() => {
                      setQuickSearchId(sample.id);
                      onVerifyBatchId(sample.id);
                    }}
                    className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-lg bg-blue-100/70 hover:bg-blue-200/80 text-blue-800 transition-colors"
                  >
                    {sample.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Dairy Standards Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-blue-100 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> FSSAI & Codex Compliant
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Sub-4°C Cold Chain Locked
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Zero Chemical Adulterants
              </span>
            </div>
          </div>

          {/* Hero Right: Milk Splash on Blue Background Image */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div 
              animate={{ y: [-6, 6, -6] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30 bg-blue-900 group"
            >
              {/* Milk Splash Graphic */}
              <img
                src="/milk-splash-on-blue-background-vector-23654072.webp"
                alt="Fresh Milk Splash on Blue Background"
                className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
              />

              {/* Quality Seal Overlay */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-blue-100 text-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-blue-900 block leading-tight">100% PURE MILK</span>
                  <span className="text-[10px] text-slate-500 font-medium">ISO 17025 Certified</span>
                </div>
              </div>

              {/* Floating Batch Card Overlay at bottom */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-blue-100 text-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="font-mono text-xs font-bold text-blue-900">Batch #PT-8842-A2</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    99.2% Purity
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-100 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Fat</span>
                    <strong className="text-blue-900 font-mono">4.52%</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">SNF</span>
                    <strong className="text-blue-900 font-mono">8.85%</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Chilled</span>
                    <strong className="text-blue-900 font-mono">3.4°C</strong>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Dairy Quality */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Trust in Every Glass
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            How PureTrace Protects Dairy Purity
          </h2>
          <p className="text-sm text-slate-600">
            A cooperative model engineered with multi-spectral intelligence and tamper-proof traceability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">1. Ethically Farmed</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Sourced from verified rural dairy cooperatives. Automated somatic cell checks ensure indigenous Gir and Sahiwal herd health.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Snowflake className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">2. Chilled Sub-4°C</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Rapid bulk chilling within 90 minutes of milking arrests bacterial multiplication and preserves natural creamy goodness.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">3. Multi-Assay Audit</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Automated near-infrared spectrometry immediately flags foreign adulterants: urea, synthetic detergents, or added water dilution.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">4. QR Provenance</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Consumers scan the packaging QR to view the exact farmer cooperative, chilling logs, and ISO lab certificate.
            </p>
          </div>
        </div>
      </section>

      {/* Enterprise CTA Banner */}
      <section className="bg-blue-50 border-y border-blue-100 py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-blue-900">Are you a Dairy Plant Manager or QC Officer?</h3>
            <p className="text-sm text-slate-600">Access the full telemetry grid, batch management, and automated valve lockout controls.</p>
          </div>
          <button
            onClick={onEnterHub}
            className="px-6 py-3 rounded-2xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-105 shrink-0"
          >
            <span>Launch Intelligence Hub</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Dairy Footer */}
      <footer className="bg-white border-t border-slate-100 py-8 px-4 sm:px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-blue-900">
            <Droplet className="w-4 h-4 text-blue-600 fill-blue-600" />
            <span>PureTrace • White & Blue Dairy Intelligence</span>
          </div>
          <p>© 2026 PureTrace Dairy Federation. Built with pride for Indian Dairy Cooperatives.</p>
        </div>
      </footer>
    </div>
  );
}
