import React from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  Route, 
  FlaskConical, 
  Settings, 
  Droplet, 
  ShieldCheck,
  X,
  Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * PureTrace Navigation Sidebar Component (White & Blue Dairy Theme)
 * - Fresh, crisp white-and-blue palette inspired by iconic milk packaging
 * - Mobile slide-over drawer with responsive hamburger toggle
 * - Active view highlighted with bold royal-blue border and soft blue background
 */
export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  batchCount, 
  flaggedCount, 
  isOpen, 
  onClose,
  onGoToLanding
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'batches', label: 'Batches', icon: Layers, badge: batchCount },
    { id: 'map', label: 'Milk-Cycle Map', icon: Route, badge: 'Live GPS' },
    { id: 'lab', label: 'Lab Results', icon: FlaskConical, badge: flaggedCount > 0 ? `${flaggedCount} Alert` : null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Panel */}
      <aside 
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-blue-100 z-50 flex flex-col justify-between select-none shadow-sm transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Section: Branding & Navigation */}
        <div>
          {/* Header & Logo */}
          <div className="p-5 border-b border-blue-100 flex items-center justify-between bg-white">
            <button
              onClick={() => {
                onGoToLanding();
                if (onClose) onClose();
              }}
              className="flex items-center gap-3 text-left group cursor-pointer hover:opacity-90 transition-opacity"
              title="Go to PureTrace Landing Page"
            >
              {/* Fresh Blue Milk Drop Logo */}
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 flex items-center justify-center p-0.5 shadow-md shadow-blue-500/20 shrink-0 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center relative overflow-hidden">
                  <Droplet className="w-6 h-6 text-blue-600 fill-blue-600 relative z-10" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black tracking-tight text-blue-900 group-hover:text-blue-700 transition-colors">Pure<span className="text-blue-600">Trace</span></span>
                  <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200 rounded">DAIRY</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium tracking-tight">Milk Quality & Provenance</p>
              </div>
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Landing Page Link */}
          <div className="p-3 pb-0">
            <button
              onClick={onGoToLanding}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold text-blue-800 bg-blue-50 hover:bg-blue-100/80 border border-blue-200 transition-all group"
            >
              <span className="flex items-center gap-2">
                <Home className="w-3.5 h-3.5 text-blue-600" />
                <span>Consumer Portal / Home</span>
              </span>
              <span className="text-[10px] bg-white px-1.5 py-0.5 rounded text-blue-600 font-bold shadow-xs">View</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'border-l-4 border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50 border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'
                    }`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== null && item.badge !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      String(item.badge).includes('Alert') 
                        ? 'bg-rose-100 text-rose-700 border border-rose-200'
                        : isActive 
                          ? 'bg-blue-600 text-white shadow-xs' 
                          : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Telemetry Status Card & Compliance */}
        <div className="p-4 border-t border-blue-100 bg-blue-50/50">
          <div className="p-3 rounded-2xl bg-white border border-blue-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-bold text-slate-700">Cold Chain Active</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">99.8%</span>
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between text-slate-500">
                <span>Intake Baseline:</span>
                <span className="text-emerald-700 font-bold">Sub-4°C Locked</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>NIR Spectrometers:</span>
                <span className="text-slate-800 font-bold">18 / 18 Online</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                <div className="bg-blue-600 h-full w-[99.8%] rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Trust Seal */}
          <div className="mt-3 flex items-center justify-between px-1 text-[11px] text-slate-500">
            <span>FSSAI Certified System</span>
            <span className="flex items-center gap-1 text-blue-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Tamper-Proof
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
