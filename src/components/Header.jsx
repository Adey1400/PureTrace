import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Wifi, 
  QrCode, 
  X,
  Menu,
  Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


export default function Header({ 
  searchQuery, 
  setSearchQuery, 
  notifications, 
  markAllNotificationsRead, 
  isLiveSimulating,
  setIsLiveSimulating,
  onToggleSidebar,
  onGoToLanding
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-blue-100 px-4 sm:px-6 flex items-center justify-between gap-3 shadow-xs">
      {/* Left: Mobile Menu + Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl bg-blue-50 border border-blue-200 text-slate-700 hover:text-blue-700 hover:bg-blue-100 transition-colors shrink-0"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Batch ID, QR code, or Farm..."
            className="w-full bg-blue-50/50 border border-blue-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl pl-10 pr-20 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 transition-all outline-none"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-10 pr-2 flex items-center text-slate-400 hover:text-slate-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none hidden sm:flex">
            <span className="text-[10px] font-mono bg-white border border-blue-200 text-blue-800 font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
              <QrCode className="w-2.5 h-2.5 text-blue-600" /> QR
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls: Consumer Landing Switch, Telemetry, Alerts, Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick Link to Consumer Landing Page */}
        <button
          onClick={onGoToLanding}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-all"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Consumer Portal</span>
        </button>

        {/* Live Simulation Stream Toggle */}
        <button
          onClick={() => setIsLiveSimulating(!isLiveSimulating)}
          className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
            isLiveSimulating
              ? 'bg-blue-600 border-blue-600 text-white shadow-xs shadow-blue-500/30'
              : 'bg-white border-blue-200 text-slate-600 hover:text-slate-900'
          }`}
          title="Toggle real-time sensor fluctuation"
        >
          <span className={`w-2 h-2 rounded-full shrink-0 ${isLiveSimulating ? 'bg-white animate-pulse' : 'bg-slate-400'}`}></span>
          <Wifi className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Telemetry: {isLiveSimulating ? 'Streaming' : 'Paused'}</span>
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-blue-50 border border-blue-200 hover:border-blue-300 hover:bg-blue-100 text-slate-700 transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 text-[9px] font-bold text-white items-center justify-center">
                  {unreadCount}
                </span>
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-blue-100 shadow-2xl p-4 z-50 text-slate-800"
              >
                <div className="flex items-center justify-between pb-3 border-b border-blue-100">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-bold text-blue-950">Dairy Quality Alerts</span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-blue-600 hover:underline font-bold"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="mt-2 space-y-2 max-h-80 overflow-y-auto pr-1">
                  {notifications.map((notif) => {
                    let Icon = Info;
                    let iconColor = 'text-blue-700 bg-blue-50 border-blue-200';
                    if (notif.type === 'critical') {
                      Icon = ShieldAlert;
                      iconColor = 'text-red-700 bg-red-50 border-red-200';
                    } else if (notif.type === 'warning') {
                      Icon = AlertTriangle;
                      iconColor = 'text-amber-800 bg-amber-50 border-amber-200';
                    } else if (notif.type === 'success') {
                      Icon = CheckCircle2;
                      iconColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
                    }

                    return (
                      <div
                        key={notif.id}
                        className={`p-2.5 rounded-xl border transition-all ${
                          notif.unread
                            ? 'bg-blue-50/40 border-blue-200'
                            : 'bg-white border-slate-100 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className={`p-1.5 rounded-lg border shrink-0 mt-0.5 ${iconColor}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 leading-snug">{notif.title}</p>
                            <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{notif.description}</p>
                            <span className="text-[10px] text-slate-400 font-mono mt-1 inline-block">{notif.time}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-blue-100">
          <div className="relative cursor-pointer group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-sky-400 p-[1.5px] shadow-sm">
              <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                  alt="Dr. Sarah Chen"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>

          <div className="hidden xl:block text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-blue-950 tracking-tight">Subhankito Roy Choudhury</span>
              <span className="text-[9px] bg-blue-100 text-blue-800 border border-blue-200 px-1 py-0.2 rounded font-bold">Team Head</span>
            </div>
            <p className="text-[11px] text-slate-500">Chief Quality Officer</p>
          </div>
        </div>
      </div>
    </header>
  );
}
