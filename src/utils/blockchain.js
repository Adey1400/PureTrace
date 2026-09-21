/**
 * PureTrace Cryptographic Traceability Ledger
 * - Browser-native SHA-256 chain of custody model
 * - All block hashing is strictly asynchronous and deterministic
 * - Block numbering:
 *     Block 0 = GENESIS
 *     Block 1 = COLLECTION
 *     Block 2 = CHILLING
 *     Block 3 = TRANSPORT
 *     Block 4 = PROCESSING_INTAKE
 *     Block 5 = QUALITY_INSPECTION
 *     Block 6 = PACKAGING
 *     Block 7 = STATUS_UPDATE (8th block, zero-based index 7)
 */

import { canonicalize, sha256Hex } from './canonicalize.js';

export const GENESIS_PREV_HASH = '0x' + '0'.repeat(64);

/**
 * Asynchronously compute the block header hash.
 * Combines index, blockType, timestamp, batchId, previousHash, and the SHA-256 dataHash.
 */
export async function calculateBlockHash(index, blockType, timestamp, batchId, previousHash, dataHash) {
  const headerPayload = {
    batchId,
    blockType,
    dataHash,
    index,
    previousHash,
    timestamp
  };
  return await sha256Hex(canonicalize(headerPayload));
}

/**
 * Asynchronously create Block 0 (GENESIS).
 */
export async function createGenesisBlock(batch, customTimestamp = null) {
  const timestamp = customTimestamp || batch.timeFull || '2026-09-09 21:00';
  const data = {
    breedType: batch.breedType,
    farmOrigin: batch.farmOrigin,
    fat: Number(batch.fat),
    initialVolumeLiters: Number(batch.volumeLiters),
    operator: batch.operator || 'Ramesh Patel (Farm Lead)',
    snf: Number(batch.snf),
    tempC: Number(batch.tempC)
  };

  const dataHash = await sha256Hex(canonicalize(data));
  const hash = await calculateBlockHash(
    0,
    'GENESIS',
    timestamp,
    batch.id,
    GENESIS_PREV_HASH,
    dataHash
  );

  return {
    index: 0,
    blockType: 'GENESIS',
    timestamp,
    batchId: batch.id,
    actor: data.operator,
    location: batch.farmOrigin,
    description: 'Raw milk harvested and registered at dairy farm cooperative with baseline telemetry.',
    previousHash: GENESIS_PREV_HASH,
    data,
    dataHash,
    hash
  };
}

/**
 * Asynchronously create a sequential block linked to a previous block.
 */
export async function createBlock(previousBlock, blockType, timestamp, actor, location, description, data) {
  const index = previousBlock.index + 1;
  const previousHash = previousBlock.hash;
  const dataHash = await sha256Hex(canonicalize(data));
  const hash = await calculateBlockHash(
    index,
    blockType,
    timestamp,
    previousBlock.batchId,
    previousHash,
    dataHash
  );

  return {
    index,
    blockType,
    timestamp,
    batchId: previousBlock.batchId,
    actor,
    location,
    description,
    previousHash,
    data,
    dataHash,
    hash
  };
}

/**
 * Build the standard default 7-stage chain (blocks 0 through 6) for a milk batch.
 * If deterministicTimestamps is provided, uses fixed times for reproducible hydration.
 */
export async function buildDefaultBatchLedger(batch, deterministicTimestamps = null) {
  const dt = deterministicTimestamps || [
    batch.timeFull ? `${batch.timeFull}:00` : '2026-09-09 21:00:00',
    batch.timeFull ? `${batch.timeFull}:15` : '2026-09-09 21:15:00',
    batch.timeFull ? `${batch.timeFull}:45` : '2026-09-09 21:45:00',
    batch.timeFull ? `${batch.timeFull}:55` : '2026-09-09 22:15:00',
    batch.timeFull ? `${batch.timeFull}:10` : '2026-09-09 22:45:00',
    batch.timeFull ? `${batch.timeFull}:20` : '2026-09-09 23:10:00',
    batch.timeFull ? `${batch.timeFull}:30` : '2026-09-09 23:40:00'
  ];

  // Block 0: GENESIS
  const block0 = await createGenesisBlock(batch, dt[0]);

  // Block 1: COLLECTION
  const block1 = await createBlock(
    block0,
    'COLLECTION',
    dt[1],
    'Suresh Nair (Aggregator Lead)',
    'Village Aggregator Center #04',
    'Bulk milk intake reception, volume meter validation, and initial infrared screening.',
    {
      collectionStation: 'Village Aggregator Center #04',
      volumeReceivedLiters: Number(batch.volumeLiters),
      addedWaterFlag: (batch.addedWater || 0) > 0,
      intakeTempC: Math.min(Number(batch.tempC) + 0.8, 14.0)
    }
  );

  // Block 2: CHILLING
  const block2 = await createBlock(
    block1,
    'CHILLING',
    dt[2],
    'Elena Rostova (BMC Chemist)',
    batch.chillingCenter || 'BMC Regional Hub 02',
    'Rapid bulk chilling cycle to preserve microbiological stability and lock in freshness.',
    {
      chillingCenter: batch.chillingCenter || 'BMC Regional Hub 02',
      chillingTargetC: 3.4,
      measuredTempC: Number(batch.tempC),
      freezingPointC: Number(batch.freezingPoint || -0.548),
      agitationStatus: 'Continuous 28 RPM'
    }
  );

  // Block 3: TRANSPORT
  const block3 = await createBlock(
    block2,
    'TRANSPORT',
    dt[3],
    'Devon Vance (Fleet Telematics)',
    'National Highway 44 (Transit Corridor)',
    'Cryo-insulated stainless tanker transit with real-time GPS tracking and tamper e-seal monitoring.',
    {
      tankerId: batch.tankerId || 'TK-701-Cryo',
      transitTempC: Number(batch.tempC),
      eSealStatus: 'Tamper-Evident Active',
      coldChainCompliancePct: Number(batch.coldChainCompliance || 99.8)
    }
  );

  // Block 4: PROCESSING_INTAKE
  const block4 = await createBlock(
    block3,
    'PROCESSING_INTAKE',
    dt[4],
    'Dr. Sarah Chen (Chief Quality Lead)',
    'Central Processing Complex (Intake Bay 01)',
    'Automated receiving manifold intake, inline density scan, and multi-stage particulate filtration.',
    {
      intakeBay: 'Bay 01 - Automated Robotic Manifold',
      ph: Number(batch.ph),
      conductivity: Number(batch.conductivity || 4.82),
      statusAtIntake: batch.status
    }
  );

  // Block 5: QUALITY_INSPECTION
  const block5 = await createBlock(
    block4,
    'QUALITY_INSPECTION',
    dt[5],
    batch.operator || 'Karthik Raja (Quality Inspector)',
    'Receiving Quality Assurance Laboratory',
    'Spectroscopic multi-adulterant screening, cryoscopic osmolality, and bacterial dye reduction audit.',
    {
      fatPct: Number(batch.fat),
      snfPct: Number(batch.snf),
      scc: Number(batch.scc || 132000),
      mbrtMinutes: Number(batch.mbrtMinutes || 300),
      riskEvaluated: batch.risk,
      adulterantsFlagged: Array.isArray(batch.adulterants)
        ? batch.adulterants.filter(a => a.detected).map(a => a.name)
        : []
    }
  );

  // Block 6: PACKAGING
  const block6 = await createBlock(
    block5,
    'PACKAGING',
    dt[6],
    'Pooja Sharma (Packaging Superintendent)',
    'Aseptic Bottling Cleanroom Bay 03',
    'Aseptic filling, hermetic seal AI visual verification, and serialized QR issuance.',
    {
      packagingLine: 'Aseptic Bottling Cleanroom Bay 03',
      qrCodeId: batch.qrCodeId,
      finalBatchStatus: batch.status,
      shelfLifeDays: 180
    }
  );

  const ledger = [block0, block1, block2, block3, block4, block5, block6];

  // If initial batch was already Quarantined or in a specific non-approved state with status action
  if (batch.status === 'Quarantined') {
    const statusBlock = await appendStatusUpdateBlock(
      ledger,
      batch.id,
      'In Review',
      'Quarantined',
      'Automated AI Lockout Gate',
      'Severe parameter deviation detected. Batch isolated from bottling line.'
    );
    ledger.push(statusBlock);
  }

  return ledger;
}

/**
 * Asynchronously append Block 7 (STATUS_UPDATE) to the ledger.
 * The 8th block in the chain, zero-based index 7 (or next available index).
 */
export async function appendStatusUpdateBlock(
  ledger,
  batchId,
  previousStatus,
  newStatus,
  actor = 'Dr. Sarah Chen (Chief Quality Officer)',
  reason = null,
  customTimestamp = null
) {
  const previousBlock = ledger[ledger.length - 1];
  const index = previousBlock.index + 1;
  const timestamp = customTimestamp || new Date().toISOString().replace('T', ' ').slice(0, 19);
  const location = newStatus === 'Quarantined'
    ? 'Quarantine Holding Unit Delta'
    : 'Aseptic Bottling Line 01';

  const defaultReason = newStatus === 'Quarantined'
    ? 'Batch quarantined due to safety threshold or cold-chain breach. Lockout engaged.'
    : 'Batch approved for commercial bottling and consumer distribution. Cryptographic seal verified.';

  const data = {
    action: newStatus === 'Quarantined' ? 'QUARANTINE_ENGAGED' : 'BOTTLING_APPROVED',
    actor,
    batchId,
    newStatus,
    previousStatus,
    reason: reason || defaultReason,
    timestamp
  };

  const dataHash = await sha256Hex(canonicalize(data));
  const hash = await calculateBlockHash(
    index,
    'STATUS_UPDATE',
    timestamp,
    batchId,
    previousBlock.hash,
    dataHash
  );

  return {
    index,
    blockType: 'STATUS_UPDATE',
    timestamp,
    batchId,
    actor,
    location,
    description: data.reason,
    previousHash: previousBlock.hash,
    data,
    dataHash,
    hash
  };
}

/**
 * Asynchronously verify the entire cryptographic integrity of a batch ledger.
 * Recomputes SHA-256 dataHash, previousHash link, and block hash for every block.
 *
 * @param {Array} ledger
 * @returns {Promise<{valid: boolean, checkedBlocks: number, invalidBlockIndex: number|null, reason: string}>}
 */
export async function verifyBatchLedger(ledger) {
  if (!Array.isArray(ledger) || ledger.length === 0) {
    return {
      valid: false,
      checkedBlocks: 0,
      invalidBlockIndex: null,
      reason: 'Ledger is empty or invalid.'
    };
  }

  for (let i = 0; i < ledger.length; i++) {
    const block = ledger[i];

    // 1. Verify block data hash: SHA256(canonicalize(block.data))
    const expectedDataHash = await sha256Hex(canonicalize(block.data));
    if (block.dataHash !== expectedDataHash) {
      return {
        valid: false,
        checkedBlocks: i,
        invalidBlockIndex: i,
        reason: `Block #${block.index} (${block.blockType}): Data hash mismatch. Block data was tampered with.`
      };
    }

    // 2. Verify previousHash continuity
    const expectedPrevHash = i === 0 ? GENESIS_PREV_HASH : ledger[i - 1].hash;
    if (block.previousHash !== expectedPrevHash) {
      return {
        valid: false,
        checkedBlocks: i,
        invalidBlockIndex: i,
        reason: `Block #${block.index} (${block.blockType}): Chain continuity broken. previousHash does not match Block #${i - 1} hash.`
      };
    }

    // 3. Verify block header hash
    const expectedBlockHash = await calculateBlockHash(
      block.index,
      block.blockType,
      block.timestamp,
      block.batchId,
      block.previousHash,
      block.dataHash
    );
    if (block.hash !== expectedBlockHash) {
      return {
        valid: false,
        checkedBlocks: i,
        invalidBlockIndex: i,
        reason: `Block #${block.index} (${block.blockType}): Header hash mismatch. Cryptographic integrity check failed.`
      };
    }
  }

  return {
    valid: true,
    checkedBlocks: ledger.length,
    invalidBlockIndex: null,
    reason: `All ${ledger.length} blocks verified. Cryptographic chain continuity intact.`
  };
}

/**
 * Helper to deep clone a ledger for testing or simulation.
 */
export function cloneLedger(ledger) {
  return JSON.parse(JSON.stringify(ledger));
}

/**
 * Helper to simulate tampering on a specific block for demo/testing.
 * Modifies a field in block.data without recalculating hashes.
 */
export function simulateTamper(ledger, blockIndex, field, newValue) {
  const tampered = cloneLedger(ledger);
  if (tampered[blockIndex] && tampered[blockIndex].data) {
    tampered[blockIndex].data[field] = newValue;
  }
  return tampered;
}
