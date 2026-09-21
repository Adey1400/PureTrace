# 🥛 PureTrace

**AI-powered batch traceability for the milk supply chain — from farm to consumer.**

> Built for **Smart India Hackathon 2026** · Problem Statement ID: **SIH26193** · Theme: *Agriculture, FoodTech & Rural Development* · Team **KsiraNiriksa**

PureTrace gives every milk batch a digital identity. It tracks a batch across every checkpoint in the supply chain, flags suspicious changes with AI-based anomaly detection, and pinpoints the **first point of deviation** — turning a slow, fragmented investigation into a fast, evidence-backed one.

---

## The Problem

Today, milk quality testing is a single snapshot: a sample is either "normal" or "suspicious," with no memory of how it got there.

- ❌ No complete batch traceability across the supply chain
- ❌ Manual, fragmented records make investigation slow and difficult
- ❌ A single test can't reveal *where* in the journey milk was compromised
- ❌ Delayed detection lets suspicious milk keep moving through the chain
- ❌ Investigators lack a unified history, evidence trail, and timeline per batch

## The Solution

PureTrace tracks every milk batch end-to-end — collection → processing → distribution — and uses ML-based anomaly detection to catch adulteration risks early, with a full digital paper trail for investigators.

| With PureTrace | |
|---|---|
| ✅ Automated AI-based analysis | ✅ First-detected-deviation flagging |
| ✅ Batch-level traceability | ✅ Unified digital records |
| ✅ Digital milk passport per batch | ✅ Faster investigation & lab confirmation |

**Unique innovation:** AI risk screening, a digital "milk passport" per batch, first-detected-deviation tracing, and a dedicated investigation dashboard.

---

## How It Works

```
Input → Validate → Store → Process → Analyse → Detect → Explain → Visualize → Improve
```

1. **Data Collection** — manual entry, CSV/JSON uploads, or (future) IoT/FTIR sensor feeds
2. **Data Validation** — checks completeness and integrity of incoming records
3. **Data Storage** — securely persists data for batch tracking and later analysis
4. **Data Processing** — cleans and prepares data for ML analysis
5. **ML Analysis** — models identify patterns and abnormalities in the data
6. **Anomaly Detection** — flags unusual values and classifies risk level
7. **LLM Explanation** — turns complex anomaly output into plain-language explanations
8. **Dashboard Visualization** — surfaces anomalies, batch details, and investigation results
9. **Continuous Improvement** — feedback and new data refine the models over time

---

## What's in This Repo

This repository holds the **frontend prototype**: a React + Vite web app that demonstrates the full PureTrace experience — the consumer-facing verification portal and the enterprise Quality Intelligence Hub used by processors, labs, and regulators.

- **Consumer Landing Page** — scan/enter a batch or QR code and instantly verify a milk product's journey
- **Dashboard** — live overview of batch volume, risk distribution, and simulated real-time sensor telemetry (temperature, pH, conductivity)
- **Batches View** — full batch registry with search, filtering, and a batch intake simulator
- **Batch Inspect Modal** — deep-dive into a single batch: timeline, checkpoints, lab results, and quarantine/approve actions
- **Milk Cycle Map** — visual map of the supply-chain journey
- **Lab Results View** — structured lab/test evidence per batch
- **Settings View** — app configuration

> Note: batch, telemetry, and notification data in this prototype are currently backed by mock data (`src/data/mockData.js`) with a simulated live sensor feed, ahead of real ML/IoT/FTIR integration.

## Tech Stack

- **React 19** + **Vite** — UI and build tooling
- **Tailwind CSS 4** — styling
- **Framer Motion** — animations and transitions
- **React Router** — navigation
- **Lucide React** — icons

## Getting Started

### Prerequisites
- Node.js (LTS recommended)
- npm

### Installation

```bash
git clone https://github.com/Adey1400/PureTrace.git
cd PureTrace
npm install
```

### Run the dev server

```bash
npm run dev
```

### Build for production

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

```
PureTrace/
├── public/                     # Static assets (icons, favicon, imagery)
├── src/
│   ├── components/
│   │   ├── views/               # Dashboard, Batches, Map, Lab Results, Settings
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── LandingPage.jsx
│   │   └── BatchInspectModal.jsx
│   ├── data/
│   │   └── mockData.js          # Sample batches, telemetry, notifications
│   ├── App.jsx                  # App shell, state, routing between screens
│   ├── main.jsx
│   └── index.css
├── package.json
└── vite.config.js
```

---

## Why It's Feasible & Viable

| Area | Challenge | Strategy |
|---|---|---|
| Technical | Data quality & incomplete records | Validation rules, standardized fields, mandatory batch IDs |
| Operational | Fragmented supply-chain workflows | Unified digital records, phased rollout, simple workflows |
| Scalability | Manual + CSV/JSON-only inputs today | Progressive rollout with future IoT/FTIR sensor support |
| Adoption | AI model accuracy & false alerts | Continuous evaluation, feedback loops, human-in-the-loop review |
| Onboarding | Varying user tech-literacy | Guided dashboard, clear explanations, progressive onboarding |

**Rollout path:** Pilot → Validate → Improve → Scale

## Impact

| Stakeholder | Benefit |
|---|---|
| Dairy Farmers & Collection Centers | Better monitoring, earlier detection of suspicious changes |
| Milk Processors & Dairy Companies | Faster traceability and investigation of quality issues |
| Quality Inspectors & Laboratories | Structured evidence for easier testing and validation |
| Food Safety Regulators | Improved monitoring and transparent investigation records |
| Consumers | Safer milk with greater trust and transparency |

**Core outcome:** Early detection + complete traceability → a safer, more transparent, and more trustworthy milk supply chain.

## Research & References

**Legal & Policy**
- [FSSAI Food Safety Standards](https://fssai.gov.in) — adulteration testing thresholds
- [BIS Milk & Milk Products Standards](https://bis.gov.in) — compositional benchmarks
- Prevention of Food Adulteration guidelines — quarantine/retest basis

**Research Datasets**
- [FTIR Milk Adulteration Dataset](https://pmc.ncbi.nlm.nih.gov/articles/PMC6615233) — 4,846 samples covering sucrose, starch, sodium bicarbonate, hydrogen peroxide, and formaldehyde adulterants
- [SP-MILK Optical Speckle Dataset](https://zenodo.org/records/18699724) — 12,000 raw speckle images (6,000 unadulterated / 6,000 adulterated)
- [NIR Milk Impurity Dataset](https://data.mendeley.com/datasets/3gxjgtkg76) — 20,000 spectral samples (~400–1100 nm, eight wavelength bands)

**Research Studies**
- [Ensemble/deep learning for milk adulteration detection (FTIR reference)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6615233)
- [Optical speckle pattern analysis for liquid adulterant detection](https://pmc.ncbi.nlm.nih.gov/articles/PMC13333312)

---

## Team KsiraNiriksa

Smart India Hackathon 2026 · Team ID 43 · Problem Statement SIH26193
