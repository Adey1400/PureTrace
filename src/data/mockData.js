// Mock Data for PureTrace Platform

export const INITIAL_BATCHES = [
  {
    id: "PT-8842-A2",
    farmOrigin: "GreenMeadow Co-op #14 (Cluster North)",
    chillingCenter: "BMC Chilling Node 03",
    breedType: "A2 Indigenous Gir & Sahiwal",
    volumeLiters: 14200,
    timestamp: "8 mins ago",
    timeFull: "2026-09-09 23:48",
    fat: 4.52,
    snf: 8.85,
    protein: 3.48,
    lactose: 4.86,
    addedWater: 0.0,
    tempC: 3.6,
    ph: 6.68,
    conductivity: 4.82,
    freezingPoint: -0.548,
    mbrtMinutes: 310,
    scc: 132000,
    risk: "Normal",
    riskScore: 98.6,
    status: "Approved",
    blockchainHash: "0x8e42f9b1c03d52ba44e78a61902bc923d5f171092a4ecb39174dfb2089f89312",
    qrCodeId: "PT-QR-8842-A2",
    coldChainCompliance: 99.9,
    operator: "Devon Vance (Lead Quality Tech)",
    tankerId: "TK-701-Cryo",
    notes: "Spectral NIR signature matches pure A2 bovine baseline. Negative for all foreign adulterants.",
    adulterants: [
      { name: "Urea", detected: false, value: "16 mg/dL (Normal)" },
      { name: "Synthetic Detergents", detected: false, value: "0.00 ppm (Clean)" },
      { name: "Added Water", detected: false, value: "0.00% (Strict <0.5%)" },
      { name: "Starch / Dextrin", detected: false, value: "Negative (0.00%)" },
      { name: "Neutralizers (NaOH/Carbonates)", detected: false, value: "Negative" },
      { name: "Hydrogen Peroxide / Formalin", detected: false, value: "Negative" },
      { name: "Melamine Residue", detected: false, value: "< 0.01 ppm" },
    ]
  },
  {
    id: "PT-8841-MX",
    farmOrigin: "Sunrise Valley Dairy Federation",
    chillingCenter: "BMC Chilling Node 01",
    breedType: "Crossbred Holstein Friesian",
    volumeLiters: 28400,
    timestamp: "24 mins ago",
    timeFull: "2026-09-09 23:32",
    fat: 3.92,
    snf: 8.42,
    protein: 3.22,
    lactose: 4.65,
    addedWater: 4.8,
    tempC: 4.2,
    ph: 6.62,
    conductivity: 5.41,
    freezingPoint: -0.512,
    mbrtMinutes: 215,
    scc: 280000,
    risk: "Suspicious",
    riskScore: 68.2,
    status: "In Review",
    blockchainHash: "0x3a79d01fc9318b7654a91901de39281093bcfa4392efb761895a9431872efb4a",
    qrCodeId: "PT-QR-8841-MX",
    coldChainCompliance: 94.1,
    operator: "Elena Rostova (Shift Chemist)",
    tankerId: "TK-408-Swift",
    notes: "Freezing Point Depression anomaly detected (-0.512°C vs std -0.540°C). Probable 4.5% - 5.0% dilution. Flagged for HPLC verification.",
    adulterants: [
      { name: "Urea", detected: false, value: "24 mg/dL (Borderline)" },
      { name: "Synthetic Detergents", detected: false, value: "0.00 ppm" },
      { name: "Added Water", detected: true, value: "~4.8% Dilution detected" },
      { name: "Starch / Dextrin", detected: false, value: "Negative" },
      { name: "Neutralizers (NaOH/Carbonates)", detected: false, value: "Negative" },
      { name: "Hydrogen Peroxide / Formalin", detected: false, value: "Negative" },
      { name: "Melamine Residue", detected: false, value: "< 0.01 ppm" },
    ]
  },
  {
    id: "PT-8840-BT",
    farmOrigin: "Kaveri Agro Aggregator #09",
    chillingCenter: "BMC Node 05 (South Hub)",
    breedType: "Murrah Buffalo Blend",
    volumeLiters: 19500,
    timestamp: "47 mins ago",
    timeFull: "2026-09-09 23:09",
    fat: 6.84,
    snf: 9.15,
    protein: 3.98,
    lactose: 5.10,
    addedWater: 0.0,
    tempC: 3.8,
    ph: 6.74,
    conductivity: 4.65,
    freezingPoint: -0.552,
    mbrtMinutes: 340,
    scc: 110000,
    risk: "Normal",
    riskScore: 99.1,
    status: "Approved",
    blockchainHash: "0x12c49b01fa8162d0831a90cbf3761a298f39001baef2491a0c76f3918076eb09",
    qrCodeId: "PT-QR-8840-BT",
    coldChainCompliance: 99.9,
    operator: "Karthik Raja (Quality Inspector)",
    tankerId: "TK-912-Heavy",
    notes: "Exceptional fat and solids non-fat profile. Zero foreign matter or neutralizing agents found.",
    adulterants: [
      { name: "Urea", detected: false, value: "14 mg/dL (Pristine)" },
      { name: "Synthetic Detergents", detected: false, value: "0.00 ppm" },
      { name: "Added Water", detected: false, value: "0.00%" },
      { name: "Starch / Dextrin", detected: false, value: "Negative" },
      { name: "Neutralizers (NaOH/Carbonates)", detected: false, value: "Negative" },
      { name: "Hydrogen Peroxide / Formalin", detected: false, value: "Negative" },
      { name: "Melamine Residue", detected: false, value: "< 0.01 ppm" },
    ]
  },
  {
    id: "PT-8839-WZ",
    farmOrigin: "Highland Pastures Dairy Consortium",
    chillingCenter: "Outpost Chiller Delta",
    breedType: "Mixed Bovine Lot 7",
    volumeLiters: 11800,
    timestamp: "1 hr 12 mins ago",
    timeFull: "2026-09-09 22:44",
    fat: 2.78,
    snf: 7.12,
    protein: 2.14,
    lactose: 3.40,
    addedWater: 14.5,
    tempC: 11.2,
    ph: 7.38,
    conductivity: 7.92,
    freezingPoint: -0.420,
    mbrtMinutes: 45,
    scc: 690000,
    risk: "High Risk",
    riskScore: 21.4,
    status: "Quarantined",
    blockchainHash: "0xd9091abf817290038cb160173290bca782103f9012a9bc48910fa7281039bcfa",
    qrCodeId: "PT-QR-8839-WZ",
    coldChainCompliance: 62.4,
    operator: "Automated AI Lockout Gate",
    tankerId: "TK-103-Old",
    notes: "CRITICAL: Synthetic milk markers detected. Severe alkaline pH (7.38) indicates caustic neutralizers added. Cold chain breach at 11.2°C. Batch locked from processing pipeline.",
    adulterants: [
      { name: "Urea", detected: true, value: "98 mg/dL (CRITICAL ELEVATION)" },
      { name: "Synthetic Detergents", detected: true, value: "0.85 ppm (TOXIC ALARM)" },
      { name: "Added Water", detected: true, value: "14.5% Severe Dilution" },
      { name: "Starch / Dextrin", detected: true, value: "Positive (Thickening agent)" },
      { name: "Neutralizers (NaOH/Carbonates)", detected: true, value: "Positive (pH 7.38)" },
      { name: "Hydrogen Peroxide / Formalin", detected: false, value: "Traces (0.04 ppm)" },
      { name: "Melamine Residue", detected: false, value: "Negative" },
    ]
  },
  {
    id: "PT-8838-PR",
    farmOrigin: "BioPure Organic Estate",
    chillingCenter: "BMC Node 02 (West)",
    breedType: "Jersey Pureblood Organic",
    volumeLiters: 16500,
    timestamp: "2 hrs ago",
    timeFull: "2026-09-09 21:55",
    fat: 4.88,
    snf: 9.05,
    protein: 3.65,
    lactose: 4.95,
    addedWater: 0.0,
    tempC: 3.2,
    ph: 6.66,
    conductivity: 4.78,
    freezingPoint: -0.550,
    mbrtMinutes: 360,
    scc: 98000,
    risk: "Normal",
    riskScore: 99.7,
    status: "Approved",
    blockchainHash: "0x44c1039f826190a1bc7610398afb371900129bcfa83901bca831908726190391",
    qrCodeId: "PT-QR-8838-PR",
    coldChainCompliance: 100.0,
    operator: "Dr. Sarah Chen",
    tankerId: "TK-204-CryoPro",
    notes: "Gold standard organic batch. Ultra-low somatic cell count. Ready for single-origin bottling.",
    adulterants: [
      { name: "Urea", detected: false, value: "15 mg/dL (Normal)" },
      { name: "Synthetic Detergents", detected: false, value: "0.00 ppm" },
      { name: "Added Water", detected: false, value: "0.00%" },
      { name: "Starch / Dextrin", detected: false, value: "Negative" },
      { name: "Neutralizers (NaOH/Carbonates)", detected: false, value: "Negative" },
      { name: "Hydrogen Peroxide / Formalin", detected: false, value: "Negative" },
      { name: "Melamine Residue", detected: false, value: "< 0.01 ppm" },
    ]
  }
];

export const MILK_CYCLE_STAGES = [
  {
    id: "stage-1",
    title: "1. Dairy Co-op & Milking",
    location: "GreenMeadow & Kaveri Dairy Farms",
    timestamp: "04:30 AM IST",
    status: "Completed",
    risk: "Normal",
    metrics: [
      { label: "Cows Monitored", value: "480 Bovine Herd" },
      { label: "Milking Temp", value: "36.5°C Initial" },
      { label: "CIP Sanitized", value: "Yes (Verified 04:00 AM)" },
      { label: "Mastitis SCC Check", value: "Low (<150k cells/mL)" }
    ],
    telematics: {
      operator: "Ramesh Patel (Farm Lead)",
      deviceId: "AGRI-IOT-SENSOR-09",
      lat: "12.9716 N",
      lng: "77.5946 E",
      compliance: "100% Pre-tested"
    },
    description: "Automated vacuum milking system with real-time inline conductivity sensing to detect subclinical mastitis before bulk collection."
  },
  {
    id: "stage-2",
    title: "2. Bulk Milk Chilling Center (BMC)",
    location: "BMC Regional Hub Alpha-02",
    timestamp: "06:15 AM IST",
    status: "Completed",
    risk: "Normal",
    metrics: [
      { label: "Chilling Target", value: "Down to 3.4°C in 72 min" },
      { label: "Rapid NIR Spectrometry", value: "4.5% Fat | 8.8% SNF" },
      { label: "Freezing Point", value: "-0.548°C (Pure)" },
      { label: "Agitation Rate", value: "28 RPM Continuous" }
    ],
    telematics: {
      operator: "Elena Rostova (BMC Chemist)",
      deviceId: "CHILL-TANK-CRY-40",
      lat: "13.0358 N",
      lng: "77.5970 E",
      compliance: "Cold-chain lock active"
    },
    description: "Rapid cooling reduces bacterial multiplication. Automated NIR sensor tests fat, SNF, density, and flags water or detergent addition immediately."
  },
  {
    id: "stage-3",
    title: "3. Cold-Chain In-Transit Tanker",
    location: "National Highway 44 (Transit Corridor)",
    timestamp: "08:45 AM IST",
    status: "In Transit",
    risk: "Normal",
    metrics: [
      { label: "Insulated Tanker Temp", value: "3.6°C (Delta +0.2°C)" },
      { label: "GPS Telematics", value: "Speed 54 km/h | ETA 22 min" },
      { label: "E-Seal Status", value: "Locked (Tamper-evident)" },
      { label: "Vibration Sensor", value: "0.14g (Stable)" }
    ],
    telematics: {
      operator: "Devon Vance (Fleet Telematics)",
      deviceId: "IOT-GPS-TANKER-701",
      lat: "13.1205 N",
      lng: "77.6200 E",
      compliance: "Zero route deviation"
    },
    description: "Multi-compartment 316-grade stainless steel tanker with satellite GPS, electronic tamper-evident valves, and continuous cryogenic logging."
  },
  {
    id: "stage-4",
    title: "4. Processing Plant Intake & Testing",
    location: "PureTrace Mega Dairy Complex (Central Hub)",
    timestamp: "09:30 AM IST",
    status: "Live Active",
    risk: "Normal",
    metrics: [
      { label: "Intake Flow Rate", value: "18,000 L / hour" },
      { label: "HTST Pasteurization", value: "72.5°C for 15.2s" },
      { label: "Homogenization Pressure", value: "2000 / 500 PSI" },
      { label: "MBRT Reductase", value: "> 5.5 Hours" }
    ],
    telematics: {
      operator: "Dr. Sarah Chen (Chief Quality Lead)",
      deviceId: "PLANT-AI-INTAKE-01",
      lat: "13.2000 N",
      lng: "77.6800 E",
      compliance: "FSSAI & Codex Passed"
    },
    description: "Automated robotic intake manifold. Re-verifies spectral fingerprint against farm baseline. Tri-stage filtration and ultra-clean HTST thermal cycle."
  },
  {
    id: "stage-5",
    title: "5. Aseptic Bottling & QR Serialization",
    location: "Packaging Cleanroom Bay 3",
    timestamp: "10:15 AM IST",
    status: "Pending Intake",
    risk: "Normal",
    metrics: [
      { label: "Bottling Speed", value: "12,000 Units/hr" },
      { label: "Hermetic Seal Check", value: "100% Vision AI inspected" },
      { label: "QR Traceability", value: "Immutable Ledger Encoded" },
      { label: "Final Pack Temp", value: "3.1°C" }
    ],
    telematics: {
      operator: "Karthik Raja (Packaging Lead)",
      deviceId: "TETRA-ROBOT-V6",
      lat: "13.2010 N",
      lng: "77.6820 E",
      compliance: "Retail shelf life: 180 days"
    },
    description: "Consumer can scan the bottle QR code to inspect this exact batch's farm origin, cow health record, cold chain journey, and lab certificate."
  }
];

export const LIVE_TELEMETRY_STREAM = [
  { parameter: "Active Flow Temperature", value: "3.48", unit: "°C", baseline: "2.0 - 4.0", status: "Optimal", trend: "stable" },
  { parameter: "Real-Time pH Electrode", value: "6.68", unit: "pH", baseline: "6.60 - 6.75", status: "Optimal", trend: "up" },
  { parameter: "Electrical Conductivity", value: "4.82", unit: "mS/cm", baseline: "4.50 - 5.10", status: "Optimal", trend: "stable" },
  { parameter: "Optical Density (600nm)", value: "1.031", unit: "g/cm³", baseline: "1.028 - 1.034", status: "Optimal", trend: "stable" },
  { parameter: "Cryoscopic Freezing Point", value: "-0.548", unit: "°C", baseline: "-0.540 to -0.555", status: "Optimal", trend: "down" },
  { parameter: "MBRT Dye Bleach Time", value: "310", unit: "min", baseline: "> 240 min", status: "Pristine", trend: "up" }
];

export const ADULTERANT_TEST_PANEL = [
  { name: "Added Water (Dilution)", method: "Cryoscopic Osmolality", threshold: "< 0.5%", current: "0.00%", risk: "Normal", description: "Detects watering down via depression of freezing point." },
  { name: "Synthetic Detergent & Surfactants", method: "Methylene Blue Colorimetry", threshold: "0.00 ppm", current: "0.00 ppm", risk: "Normal", description: "Used by counterfeiters to emulsify cheap oils." },
  { name: "Urea & Nitrogen Spikes", method: "Urease Photometric Assay", threshold: "< 45 mg/dL", current: "16 mg/dL", risk: "Normal", description: "Used artificially to raise apparent SNF and protein content." },
  { name: "Neutralizers (Caustic Soda/Carbonates)", method: "Rousselot Rosolic Acid Test", threshold: "Negative", current: "Negative", risk: "Normal", description: "Added to mask curdling or souring in unchilled milk." },
  { name: "Starch & Maltodextrin", method: "Iodine Spectrophotometry", threshold: "Negative", current: "Negative", risk: "Normal", description: "Carbohydrate thickeners added to mimic natural density." },
  { name: "Formalin & Hydrogen Peroxide", method: "Chromotropic Acid Reaction", threshold: "Negative", current: "Negative", risk: "Normal", description: "Illegal hazardous chemical preservatives." },
  { name: "Melamine Synthetic Resin", method: "Lateral Flow Immunoassay", threshold: "< 0.01 ppm", current: "Undetectable", risk: "Normal", description: "Dangerous nitrogen-rich industrial chemical." },
  { name: "Cellulose & Vegetable Oils", method: "Baudouin & Fat Refractive Index", threshold: "0.00%", current: "0.00%", risk: "Normal", description: "Foreign vegetable fats used to simulate milk fat." }
];

export const SAMPLE_SIMULATIONS = [
  {
    id: "sim-pure",
    name: "Standard Fresh A2 Whole Milk",
    origin: "Co-op Farm Lot 14",
    fat: 4.5,
    snf: 8.8,
    temp: 3.4,
    ph: 6.68,
    freezingPoint: -0.548,
    conductivity: 4.82,
    predictedRisk: "Normal",
    riskScore: 99.2,
    notes: "Pure, wholesome raw milk. NIR spectrum matches 100% natural bovine casein and lactose fingerprints."
  },
  {
    id: "sim-diluted",
    name: "Suspected Diluted Tanker Batch",
    origin: "Unverified Tanker 408",
    fat: 3.2,
    snf: 7.6,
    temp: 4.9,
    ph: 6.64,
    freezingPoint: -0.495,
    conductivity: 5.60,
    predictedRisk: "Suspicious",
    riskScore: 62.5,
    notes: "Dilution detected (~8.2% added water). Freezing point shifted closer to 0°C. Low solids non-fat."
  },
  {
    id: "sim-adulterated",
    name: "High-Risk Counterfeit / Neutralized Milk",
    origin: "Flagged Outpost Container X",
    fat: 2.1,
    snf: 6.9,
    temp: 9.8,
    ph: 7.42,
    freezingPoint: -0.410,
    conductivity: 8.10,
    predictedRisk: "High Risk",
    riskScore: 18.0,
    notes: "CRITICAL: Detergent emulsifiers, elevated Urea (92 mg/dL), and NaOH alkaline neutralizers detected."
  }
];

export const SYSTEM_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "High Risk Alert: Batch #PT-8839-WZ Quarantined",
    description: "Automatic AI valve lockout engaged. Detergent and caustic soda detected at Outpost Chiller Delta.",
    time: "1 hr ago",
    type: "critical",
    unread: true
  },
  {
    id: "notif-2",
    title: "Cold Chain Anomaly: Tanker TK-408-Swift",
    description: "Temperature rose to 4.9°C for 18 minutes near Toll Plaza 3. Temperature stabilized to 4.2°C.",
    time: "24 mins ago",
    type: "warning",
    unread: true
  },
  {
    id: "notif-3",
    title: "Blockchain Certificate Minted",
    description: "Batch #PT-8842-A2 successfully verified and committed to decentralized ledger #0x8e42f9...",
    time: "8 mins ago",
    type: "success",
    unread: false
  },
  {
    id: "notif-4",
    title: "NIR Spectrometer Calibrated",
    description: "Multi-wavelength spectral sensor in Receiving Bay 01 completed daily zero-point calibration.",
    time: "3 hrs ago",
    type: "info",
    unread: false
  }
];
