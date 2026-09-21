import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import BatchInspectModal from './components/BatchInspectModal';
import VerificationPage from './components/views/VerificationPage';
import DashboardView from './components/views/DashboardView';
import BatchesView from './components/views/BatchesView';
import MilkCycleMapView from './components/views/MilkCycleMapView';
import LabResultsView from './components/views/LabResultsView';
import SettingsView from './components/views/SettingsView';
import LoginPage from './components/auth/LoginPage';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';

import {
  INITIAL_BATCHES,
  LIVE_TELEMETRY_STREAM,
  SYSTEM_NOTIFICATIONS
} from './data/mockData';

import {
  buildDefaultBatchLedger,
  appendStatusUpdateBlock
} from './utils/blockchain';

const STORAGE_KEY = 'puretrace_batches_ledger_v1';

/**
 * PureTrace Main Application Component (White & Blue Dairy Theme)
 * - Inspired by classic Indian dairy branding (Amul packet blue & white milk splash)
 * - Features browser-native SHA-256 cryptographic chain of custody ledger for every batch
 * - Dedicated consumer verification route (/verify) with standalone payload validation
 * - Seamless transitions between Consumer Portal and Enterprise Hub
 */
function AppContent() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Screen Mode: 'landing' (Consumer portal) or 'app' (Enterprise hub)
  const [appScreen, setAppScreen] = useState('landing');
  const currentScreen = location.pathname === '/verify'
    ? 'verify'
    : (location.pathname === '/login' ? 'login' : appScreen);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Protect enterprise hub: unauthenticated users redirect to /login
  useEffect(() => {
    if (appScreen === 'app' && !isAuthenticated && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [appScreen, isAuthenticated, location.pathname, navigate]);

  // Hitting Enterprise Hub: redirect to /login if not authenticated, else enter app
  const handleEnterHub = () => {
    if (isAuthenticated) {
      setAppScreen('app');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setAppScreen('landing');
  };

  // Application Data State
  const [batches, setBatches] = useState(INITIAL_BATCHES);
  const [telemetryStream, setTelemetryStream] = useState(LIVE_TELEMETRY_STREAM);
  const [notifications, setNotifications] = useState(SYSTEM_NOTIFICATIONS);
  const [selectedBatchForModal, setSelectedBatchForModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLiveSimulating, setIsLiveSimulating] = useState(true);

  // Initial deterministic hydration of mock batches with cryptographic ledgers
  useEffect(() => {
    async function hydrateBatches() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].ledger) {
            setBatches(parsed);
            return;
          }
        }
      } catch (e) {
        console.warn('Could not read batches from localStorage:', e);
      }

      // Deterministically build standard ledgers (Blocks 0 through 6) for mock data
      const hydrated = await Promise.all(INITIAL_BATCHES.map(async (b) => {
        const ledger = await buildDefaultBatchLedger(b);
        return {
          ...b,
          ledger,
          blockchainHash: ledger[ledger.length - 1].hash
        };
      }));

      setBatches(hydrated);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(hydrated));
      } catch (e) {
        console.warn('Could not save hydrated batches to localStorage:', e);
      }
    }

    hydrateBatches();
  }, []);

  const updateBatchesAndStorage = (updatedBatches) => {
    setBatches(updatedBatches);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBatches));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  };

  // Autonomous real-time sensor fluctuation simulation
  useEffect(() => {
    if (!isLiveSimulating) return;

    const interval = setInterval(() => {
      setTelemetryStream(prev => prev.map(item => {
        let val = parseFloat(item.value);
        if (item.parameter.includes('Temperature')) {
          const delta = (Math.random() * 0.08 - 0.04);
          val = Math.max(2.8, Math.min(4.2, val + delta));
          return { ...item, value: val.toFixed(2) };
        }
        if (item.parameter.includes('pH')) {
          const delta = (Math.random() * 0.02 - 0.01);
          val = Math.max(6.62, Math.min(6.72, val + delta));
          return { ...item, value: val.toFixed(2) };
        }
        if (item.parameter.includes('Conductivity')) {
          const delta = (Math.random() * 0.04 - 0.02);
          val = Math.max(4.70, Math.min(4.95, val + delta));
          return { ...item, value: val.toFixed(2) };
        }
        return item;
      }));
    }, 3500);

    return () => clearInterval(interval);
  }, [isLiveSimulating]);

  // Handle approving or quarantining milk batches by appending Block 7 (STATUS_UPDATE)
  const handleUpdateBatchStatus = async (batchId, newStatus) => {
    const batch = batches.find(b => b.id === batchId);
    if (!batch) return;

    const currentLedger = batch.ledger || await buildDefaultBatchLedger(batch);
    const statusBlock = await appendStatusUpdateBlock(
      currentLedger,
      batchId,
      batch.status,
      newStatus,
      'Dr. Sarah Chen (Chief Quality Officer)'
    );

    const updatedLedger = [...currentLedger, statusBlock];
    const newRisk = newStatus === 'Quarantined'
      ? 'High Risk'
      : (batch.risk === 'High Risk' ? 'Normal' : batch.risk);

    const updatedBatch = {
      ...batch,
      status: newStatus,
      risk: newRisk,
      ledger: updatedLedger,
      blockchainHash: statusBlock.hash
    };

    const updatedBatches = batches.map(b => b.id === batchId ? updatedBatch : b);
    updateBatchesAndStorage(updatedBatches);

    if (selectedBatchForModal && selectedBatchForModal.id === batchId) {
      setSelectedBatchForModal(updatedBatch);
    }

    const newNotif = {
      id: `notif-${Date.now()}`,
      title: `Batch ${batchId} ${newStatus}`,
      description: `Block #${statusBlock.index} (${statusBlock.blockType}) appended. State committed to cryptographic ledger.`,
      time: 'Just now',
      type: newStatus === 'Quarantined' ? 'critical' : 'success',
      unread: true
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Add new intake batch from simulator
  const handleAddNewBatch = (newBatch) => {
    const updatedBatches = [newBatch, ...batches];
    updateBatchesAndStorage(updatedBatches);
    setSelectedBatchForModal(newBatch);

    const newNotif = {
      id: `notif-${Date.now()}`,
      title: `New Intake: Batch #${newBatch.id}`,
      description: `Intake of ${newBatch.volumeLiters.toLocaleString()} L from ${newBatch.farmOrigin}. Cryptographic ledger initialized (${newBatch.ledger?.length || 7} blocks).`,
      time: 'Just now',
      type: newBatch.risk === 'High Risk' ? 'critical' : (newBatch.risk === 'Suspicious' ? 'warning' : 'info'),
      unread: true
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Mark all notifications as read
  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  // Direct QR verification route handler
  const handleScanQrCode = (urlOrPayload) => {
    if (typeof urlOrPayload === 'string') {
      if (urlOrPayload.startsWith('http')) {
        try {
          const parsed = new URL(urlOrPayload);
          navigate(`/verify${parsed.search}`);
        } catch {
          navigate(`/verify?data=${encodeURIComponent(urlOrPayload)}`);
        }
      } else if (urlOrPayload.includes('?data=') || urlOrPayload.startsWith('data=')) {
        const search = urlOrPayload.includes('?') ? urlOrPayload.slice(urlOrPayload.indexOf('?')) : `?${urlOrPayload}`;
        navigate(`/verify${search}`);
      } else {
        navigate(`/verify?batchId=${encodeURIComponent(urlOrPayload)}`);
      }
    }
  };

  // Quick verification from consumer landing page (manual lookup)
  const handleVerifyFromLanding = (batchId) => {
    const match = batches.find(b =>
      b.id.toLowerCase() === batchId.toLowerCase() ||
      b.qrCodeId.toLowerCase() === batchId.toLowerCase()
    );
    if (match) {
      navigate(`/verify?batchId=${encodeURIComponent(match.id)}`);
    }
  };

  // Global search filtering
  const filteredBatchesBySearch = searchQuery.trim()
    ? batches.filter(b =>
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.farmOrigin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.qrCodeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.breedType.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  // Render dedicated verification page if on /verify route or 'verify' screen mode
  if (currentScreen === 'verify') {
    return (
      <VerificationPage
        batches={batches}
        onGoHome={() => {
          navigate('/');
          setAppScreen('landing');
        }}
        onInspectBatch={(b) => {
          navigate('/');
          setAppScreen('app');
          setSelectedBatchForModal(b);
        }}
      />
    );
  }

  // Render dedicated demo login page if on /login route
  if (currentScreen === 'login') {
    return (
      <LoginPage
        onBackToHome={() => {
          navigate('/');
          setAppScreen('landing');
        }}
        onSuccess={() => {
          navigate('/');
          setAppScreen('app');
        }}
      />
    );
  }

  // Render Landing Page if currently on 'landing' screen
  if (currentScreen === 'landing') {
    return (
      <LandingPage
        batches={batches}
        onEnterHub={handleEnterHub}
        onVerifyBatchId={handleVerifyFromLanding}
        onScanQrCode={handleScanQrCode}
        onLoginClick={() => navigate('/login')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-blue-50/30 text-slate-800 flex font-sans selection:bg-blue-600 selection:text-white antialiased overflow-x-hidden">
      {/* Responsive Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        batchCount={batches.length}
        flaggedCount={batches.filter(b => b.risk !== 'Normal').length}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onGoToLanding={() => {
          navigate('/');
          setAppScreen('landing');
        }}
      />

      {/* Main Viewport Container */}
      <div className="lg:ml-64 flex-1 flex flex-col min-h-screen relative w-full overflow-x-hidden">
        {/* Sticky Top Header */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          notifications={notifications}
          markAllNotificationsRead={markAllNotificationsRead}
          isLiveSimulating={isLiveSimulating}
          setIsLiveSimulating={setIsLiveSimulating}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onGoToLanding={() => {
            navigate('/');
            setAppScreen('landing');
          }}
          onLogout={handleLogout}
        />

        {/* Global Search Results Flyout */}
        {searchQuery.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-4 sm:mx-8 mt-4 p-4 rounded-3xl bg-white border border-blue-200 shadow-xl z-20 space-y-2"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
              <span>Search matches for: <strong className="text-blue-700 font-bold">"{searchQuery}"</strong> ({filteredBatchesBySearch.length} found)</span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                Clear
              </button>
            </div>
            {filteredBatchesBySearch.length > 0 ? (
              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                {filteredBatchesBySearch.map(batch => (
                  <div
                    key={batch.id}
                    onClick={() => {
                      setSelectedBatchForModal(batch);
                      setSearchQuery('');
                    }}
                    className="p-3 flex items-center justify-between hover:bg-blue-50/50 rounded-2xl cursor-pointer text-xs transition-colors"
                  >
                    <div>
                      <span className="font-mono font-bold text-blue-700 mr-2">{batch.id}</span>
                      <span className="text-slate-800 font-medium">{batch.farmOrigin}</span>
                      <span className="text-slate-500 ml-2">({batch.volumeLiters.toLocaleString()} L)</span>
                    </div>
                    <span className="text-[11px] text-blue-600 font-bold">Inspect Batch →</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-2">No matching batches found.</p>
            )}
          </motion.div>
        )}

        {/* Dynamic Page Views with Frictionless Entrance Animations */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeTab === 'dashboard' && (
                <DashboardView
                  batches={batches}
                  onInspectBatch={(b) => setSelectedBatchForModal(b)}
                  telemetryStream={telemetryStream}
                  onAddNewBatch={() => setActiveTab('batches')}
                />
              )}

              {activeTab === 'batches' && (
                <BatchesView
                  batches={batches}
                  onInspectBatch={(b) => setSelectedBatchForModal(b)}
                  onAddNewBatch={handleAddNewBatch}
                />
              )}

              {activeTab === 'map' && (
                <MilkCycleMapView />
              )}

              {activeTab === 'lab' && (
                <LabResultsView />
              )}

              {activeTab === 'settings' && (
                <SettingsView />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Batch Deep-Dive Inspection Modal */}
      <AnimatePresence>
        {selectedBatchForModal && (
          <BatchInspectModal
            batch={selectedBatchForModal}
            onClose={() => setSelectedBatchForModal(null)}
            onUpdateStatus={handleUpdateBatchStatus}
            onOpenVerification={(url) => {
              setSelectedBatchForModal(null);
              handleScanQrCode(url);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
