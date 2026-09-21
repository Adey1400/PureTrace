import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { buildDefaultBatchLedger } from '../../utils/blockchain';

export default function BatchesView({ batches, onInspectBatch, onAddNewBatch }) {
  const [filterRisk, setFilterRisk] = useState('ALL'); // 'ALL' | 'Normal' | 'Suspicious' | 'High Risk'
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newBatchForm, setNewBatchForm] = useState({
    breedType: 'A2 Gir & Sahiwal Indigenous',
    farmOrigin: 'Valley Green Dairy Co-op Lot 22',
    chillingCenter: 'BMC Chilling Node 02',
    volumeLiters: 15000,
    fat: 4.4,
    snf: 8.8,
    tempC: 3.5,
    ph: 6.68,
    addedWater: 0.0
  });

  const filteredBatches = batches.filter(batch => {
    const matchesFilter = filterRisk === 'ALL' || batch.risk === filterRisk;
    const matchesSearch = batch.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          batch.farmOrigin.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          batch.breedType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getRiskBadge = (risk) => {
    if (risk === 'Normal') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" /> Normal
        </span>
      );
    }
    if (risk === 'Suspicious') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
          <AlertTriangle className="w-3 h-3" /> Suspicious
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
        <ShieldAlert className="w-3 h-3" /> High Risk
      </span>
    );
  };

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    let risk = 'Normal';
    let riskScore = 98.5;
    let notes = 'Pure certified batch. All biomarkers conform to natural standard.';
    let status = 'Approved';

    if (newBatchForm.addedWater > 2.0 || newBatchForm.tempC > 6.0 || newBatchForm.fat < 3.2) {
      risk = 'Suspicious';
      riskScore = 65.0;
      notes = 'Dilution or temperature deviation flagged. Sent for confirmation.';
      status = 'In Review';
    }
    if (newBatchForm.addedWater > 8.0 || newBatchForm.tempC > 9.0 || newBatchForm.ph > 7.1) {
      risk = 'High Risk';
      riskScore = 20.0;
      notes = 'CRITICAL: Severe parameter violation. Probable adulteration.';
      status = 'Quarantined';
    }

    const batchId = `PT-${Math.floor(1000 + Math.random() * 9000)}-${newBatchForm.breedType.includes('A2') ? 'A2' : 'MX'}`;
    const qrCodeId = `PT-QR-${Math.floor(1000 + Math.random() * 9000)}`;
    const timeFull = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const baseBatch = {
      id: batchId,
      farmOrigin: newBatchForm.farmOrigin,
      chillingCenter: newBatchForm.chillingCenter,
      breedType: newBatchForm.breedType,
      volumeLiters: Number(newBatchForm.volumeLiters),
      timestamp: 'Just now',
      timeFull,
      createdAtTimestamp: Date.now(),
      fat: Number(newBatchForm.fat),
      snf: Number(newBatchForm.snf),
      protein: 3.4,
      lactose: 4.8,
      addedWater: Number(newBatchForm.addedWater),
      tempC: Number(newBatchForm.tempC),
      ph: Number(newBatchForm.ph),
      conductivity: 4.8,
      freezingPoint: newBatchForm.addedWater > 0 ? -0.505 : -0.548,
      mbrtMinutes: risk === 'High Risk' ? 60 : 300,
      scc: 140000,
      risk,
      riskScore,
      status,
      qrCodeId,
      coldChainCompliance: newBatchForm.tempC > 5.0 ? 78.4 : 99.8,
      operator: 'Dr. Sarah Chen (Intake Chemist)',
      tankerId: 'TK-505-Auto',
      notes,
      adulterants: [
        { name: "Urea", detected: risk === 'High Risk', value: risk === 'High Risk' ? '84 mg/dL' : '15 mg/dL' },
        { name: "Synthetic Detergents", detected: false, value: "0.00 ppm" },
        { name: "Added Water", detected: newBatchForm.addedWater > 0, value: `${newBatchForm.addedWater}%` },
        { name: "Starch / Dextrin", detected: false, value: "Negative" },
        { name: "Neutralizers", detected: newBatchForm.ph > 7.1, value: newBatchForm.ph > 7.1 ? 'Alkaline detected' : 'Negative' },
        { name: "Hydrogen Peroxide", detected: false, value: "Negative" },
        { name: "Melamine Residue", detected: false, value: "< 0.01 ppm" },
      ]
    };

    // Asynchronously generate cryptographic ledger (Blocks 0 through 6)
    const ledger = await buildDefaultBatchLedger(baseBatch);
    const finalBatch = {
      ...baseBatch,
      ledger,
      blockchainHash: ledger[ledger.length - 1].hash
    };

    onAddNewBatch(finalBatch);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 text-slate-800">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-blue-950 flex items-center gap-3">
            <Layers className="w-7 h-7 text-blue-600" />
            Batch Quality & Intelligence Repository
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete database of incoming milk deliveries with AI anomaly tags and cryptographic custody seals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" /> Simulate New Batch Intake
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Risk Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-bold mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-blue-600" /> Filter:
          </span>
          {[
            { id: 'ALL', label: `All (${batches.length})` },
            { id: 'Normal', label: `Normal (${batches.filter(b => b.risk === 'Normal').length})` },
            { id: 'Suspicious', label: `Suspicious (${batches.filter(b => b.risk === 'Suspicious').length})` },
            { id: 'High Risk', label: `High Risk (${batches.filter(b => b.risk === 'High Risk').length})` },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterRisk(f.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filterRisk === f.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Local Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search batches..."
            className="w-full bg-blue-50/50 border border-blue-200 focus:border-blue-600 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none"
          />
        </div>
      </div>

      {/* Batches Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredBatches.map((batch, index) => (
          <motion.div
            key={batch.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onInspectBatch(batch)}
            className="p-5 rounded-3xl bg-white border border-blue-100 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-600/10 cursor-pointer transition-all flex flex-col justify-between group space-y-4 shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-base text-blue-700 group-hover:text-blue-900">
                  {batch.id}
                </span>
                {getRiskBadge(batch.risk)}
              </div>

              <div className="mt-2.5">
                <h3 className="text-sm font-bold text-slate-900 truncate">{batch.farmOrigin}</h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">{batch.breedType}</p>
              </div>

              {/* Chemical specs mini grid */}
              <div className="grid grid-cols-3 gap-2 mt-4 p-3 rounded-2xl bg-blue-50/50 border border-blue-100 text-center">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Fat %</span>
                  <p className="text-xs font-mono font-black text-slate-900">{batch.fat}%</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">SNF %</span>
                  <p className="text-xs font-mono font-black text-slate-900">{batch.snf}%</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Temp</span>
                  <p className={`text-xs font-mono font-black ${batch.tempC > 5.0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {batch.tempC}°C
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 mt-3 line-clamp-2 italic">
                "{batch.notes}"
              </p>
            </div>

            {/* Bottom info footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono font-bold text-slate-800">{batch.volumeLiters.toLocaleString()} Liters</span>
              <span className="text-blue-600 group-hover:underline text-[11px] font-bold flex items-center gap-1">
                Deep Inspection →
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal to simulate/create a new batch */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white border border-blue-100 rounded-3xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black text-blue-950">Simulate New Milk Intake</h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Breed & Milk Type</label>
                <select
                  value={newBatchForm.breedType}
                  onChange={(e) => setNewBatchForm({...newBatchForm, breedType: e.target.value})}
                  className="w-full bg-blue-50/50 border border-blue-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-blue-600"
                >
                  <option value="A2 Gir & Sahiwal Indigenous">A2 Gir & Sahiwal Indigenous (Premium)</option>
                  <option value="Crossbred Holstein Friesian">Crossbred Holstein Friesian (High Yield)</option>
                  <option value="Murrah Buffalo Heavy Blend">Murrah Buffalo Heavy Blend (High Fat)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Farm Origin</label>
                <input
                  type="text"
                  value={newBatchForm.farmOrigin}
                  onChange={(e) => setNewBatchForm({...newBatchForm, farmOrigin: e.target.value})}
                  className="w-full bg-blue-50/50 border border-blue-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-blue-600 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Volume (Liters)</label>
                  <input
                    type="number"
                    value={newBatchForm.volumeLiters}
                    onChange={(e) => setNewBatchForm({...newBatchForm, volumeLiters: e.target.value})}
                    className="w-full bg-blue-50/50 border border-blue-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-blue-600 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Intake Temp (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newBatchForm.tempC}
                    onChange={(e) => setNewBatchForm({...newBatchForm, tempC: e.target.value})}
                    className="w-full bg-blue-50/50 border border-blue-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-blue-600 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Milk Fat %</label>
                  <input
                    type="number"
                    step="0.05"
                    value={newBatchForm.fat}
                    onChange={(e) => setNewBatchForm({...newBatchForm, fat: e.target.value})}
                    className="w-full bg-blue-50/50 border border-blue-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-blue-600 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">SNF %</label>
                  <input
                    type="number"
                    step="0.05"
                    value={newBatchForm.snf}
                    onChange={(e) => setNewBatchForm({...newBatchForm, snf: e.target.value})}
                    className="w-full bg-blue-50/50 border border-blue-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-blue-600 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Added Water %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newBatchForm.addedWater}
                    onChange={(e) => setNewBatchForm({...newBatchForm, addedWater: e.target.value})}
                    className="w-full bg-blue-50/50 border border-blue-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-blue-600 font-mono"
                  />
                </div>
              </div>

              <p className="text-[11px] text-blue-700 font-medium italic">
                * The PureTrace AI engine will evaluate osmolality and chemical balance automatically upon intake.
              </p>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20"
                >
                  Confirm & Ingest Batch
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
