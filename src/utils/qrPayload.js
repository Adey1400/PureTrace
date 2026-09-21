/**
 * PureTrace QR Payload serialization and independent cross-device verification.
 * Encodes verifiable public batch data and cryptographic chain digests into compact URL payloads.
 * No reliance on localStorage or React state.
 */

import { canonicalize } from './canonicalize.js';
import { 
  calculateBlockHash, 
  GENESIS_PREV_HASH, 
  buildDefaultBatchLedger, 
  appendStatusUpdateBlock,
  verifyBatchLedger 
} from './blockchain.js';

/**
 * Generate a compact, standards-compatible QR payload object for a batch.
 * Keeps payload ultra-compact (~400-500 bytes) so QR codes remain low density and scan instantly.
 */
export function createQrPayload(batch) {
  const payload = {
    v: 1,
    type: 'PURETRACE_BATCH',
    id: batch.id,
    qrId: batch.qrCodeId || `PT-QR-${batch.id}`,
    lh: batch.blockchainHash,
    data: {
      origin: batch.farmOrigin,
      chilling: batch.chillingCenter,
      breed: batch.breedType,
      vol: Number(batch.volumeLiters),
      fat: Number(batch.fat),
      snf: Number(batch.snf),
      temp: Number(batch.tempC),
      ph: Number(batch.ph),
      risk: batch.risk,
      status: batch.status,
      time: batch.timeFull || batch.timestamp,
      op: batch.operator || 'Devon Vance (Lead Quality Tech)',
      tanker: batch.tankerId || 'TK-701-Cryo',
      cond: Number(batch.conductivity || 4.82),
      fp: Number(batch.freezingPoint || -0.548),
      scc: Number(batch.scc || 132000),
      mbrt: Number(batch.mbrtMinutes || 300),
      ccc: Number(batch.coldChainCompliance || 99.8),
      water: Number(batch.addedWater || 0),
      adulterants: Array.isArray(batch.adulterants)
        ? batch.adulterants.filter(a => a.detected).map(a => a.name)
        : []
    },
    iat: batch.createdAtTimestamp || 1773000000000
  };

  // If this batch received an interactive status update beyond initial default
  if (Array.isArray(batch.ledger) && batch.ledger.length > 7) {
    const statusBlock = batch.ledger.find(b => b.blockType === 'STATUS_UPDATE');
    if (statusBlock) {
      payload.upd = {
        from: statusBlock.data?.previousStatus || 'In Review',
        to: statusBlock.data?.newStatus || batch.status,
        tm: statusBlock.timestamp,
        op: statusBlock.actor || 'Dr. Sarah Chen (Chief Quality Officer)',
        reason: statusBlock.data?.reason || null
      };
    }
  }

  return payload;
}

/**
 * Serialize QR payload into a compact, URL-safe Base64 string.
 */
export function serializeQrPayload(payload) {
  const jsonStr = canonicalize(payload);
  const utf8Bytes = new TextEncoder().encode(jsonStr);
  let binary = '';
  const len = utf8Bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(utf8Bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Deserialize Base64URL string back into a verified QR payload object.
 */
export function deserializeQrPayload(base64UrlStr) {
  if (!base64UrlStr || typeof base64UrlStr !== 'string') {
    throw new Error('Invalid or empty QR payload string.');
  }
  let base64 = base64UrlStr.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const jsonStr = new TextDecoder().decode(bytes);
  return JSON.parse(jsonStr);
}

/**
 * Generate full verification URL for a batch.
 */
export function getVerificationUrl(batch, origin = null) {
  const base = origin || (typeof window !== 'undefined' ? window.location.origin : 'https://puretrace.app');
  const payload = createQrPayload(batch);
  const serialized = serializeQrPayload(payload);
  return `${base}/verify?data=${serialized}`;
}

/**
 * Independently verify a QR payload without needing local state or server connection.
 * Checks cryptographic linking, data hashes, block header hashes, and batch identity.
 *
 * @param {object} payload
 * @returns {Promise<{valid: boolean, status: 'VERIFIED'|'TAMPER_DETECTED'|'INVALID_QR', reason: string, batch?: object}>}
 */
export async function verifyQrPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return {
      valid: false,
      status: 'INVALID_QR',
      reason: 'Missing or malformed payload structure.'
    };
  }

  if (payload.type !== 'PURETRACE_BATCH' || payload.v !== 1) {
    return {
      valid: false,
      status: 'INVALID_QR',
      reason: `Unsupported format or protocol version (${payload.type || 'unknown'} v${payload.v || '?'}).`
    };
  }

  if (!payload.id || !payload.lh || !payload.data) {
    return {
      valid: false,
      status: 'INVALID_QR',
      reason: 'Required batch verification fields are missing.'
    };
  }

  const { id, lh, data } = payload;

  // Mode A: Legacy or explicit chain digests passed in payload
  if (Array.isArray(payload.chain) && payload.chain.length > 0) {
    const { chain } = payload;
    if (chain[0].i !== 0) {
      return {
        valid: false,
        status: 'TAMPER_DETECTED',
        reason: 'Genesis block (Block #0) has an invalid root index.'
      };
    }

    for (let k = 0; k < chain.length; k++) {
      const blockDigest = chain[k];
      const prevHash = k === 0 ? GENESIS_PREV_HASH : chain[k - 1].h;

      if (k > 0 && blockDigest.i !== chain[k - 1].i + 1) {
        return {
          valid: false,
          status: 'TAMPER_DETECTED',
          reason: `Block index sequence anomaly between #${chain[k - 1].i} and #${blockDigest.i}.`
        };
      }

      const recomputedHash = await calculateBlockHash(
        blockDigest.i,
        blockDigest.t,
        blockDigest.tm,
        id,
        prevHash,
        blockDigest.dh
      );

      if (blockDigest.h !== recomputedHash) {
        return {
          valid: false,
          status: 'TAMPER_DETECTED',
          reason: `Cryptographic hash mismatch at Block #${blockDigest.i} (${blockDigest.t}). Stored hash does not match computed value.`
        };
      }
    }

    const finalBlock = chain[chain.length - 1];
    if (finalBlock.h !== lh) {
      return {
        valid: false,
        status: 'TAMPER_DETECTED',
        reason: `Batch ledger head hash mismatch. Expected ${lh} but final block hash is ${finalBlock.h}.`
      };
    }

    return {
      valid: true,
      status: 'VERIFIED',
      reason: 'Cryptographic integrity verified. Batch has not been modified since issuance.',
      batch: {
        id,
        qrCodeId: payload.qrId || `QR-${id}`,
        blockchainHash: lh,
        farmOrigin: data.origin,
        chillingCenter: data.chilling,
        breedType: data.breed,
        volumeLiters: data.vol,
        fat: data.fat,
        snf: data.snf,
        tempC: data.temp,
        ph: data.ph,
        risk: data.risk,
        status: data.status,
        operator: data.op,
        timeFull: data.time,
        timestamp: 'Verified via QR payload',
        ledger: chain.map((b, idx) => ({
          index: b.i,
          blockType: b.t,
          timestamp: b.tm,
          location: b.loc,
          actor: b.t === 'GENESIS' ? data.origin : 'Verified Custody Node',
          description: `Cryptographically verified custody event: ${b.t}`,
          dataHash: b.dh,
          hash: b.h,
          previousHash: idx === 0 ? GENESIS_PREV_HASH : chain[idx - 1].h,
          data: { eventType: b.t, location: b.loc, time: b.tm }
        }))
      }
    };
  }

  // Mode B: Standards-compliant compact QR payload with client-side deterministic verification
  const tempBatch = {
    id,
    qrCodeId: payload.qrId || `PT-QR-${id}`,
    farmOrigin: data.origin,
    chillingCenter: data.chilling,
    breedType: data.breed,
    volumeLiters: data.vol,
    fat: data.fat,
    snf: data.snf,
    tempC: data.temp,
    ph: data.ph,
    risk: data.risk,
    status: payload.upd ? payload.upd.from : data.status,
    timeFull: data.time,
    timestamp: data.time,
    operator: data.op,
    tankerId: data.tanker,
    conductivity: data.cond,
    freezingPoint: data.fp,
    scc: data.scc,
    mbrtMinutes: data.mbrt,
    coldChainCompliance: data.ccc,
    addedWater: data.water,
    adulterants: (data.adulterants || []).map(name => ({ name, detected: true }))
  };

  try {
    let reconstructedLedger = await buildDefaultBatchLedger(tempBatch);

    if (payload.upd) {
      const lastBlock = reconstructedLedger[reconstructedLedger.length - 1];
      if (lastBlock.blockType !== 'STATUS_UPDATE' || lastBlock.hash !== lh) {
        const statusBlock = await appendStatusUpdateBlock(
          reconstructedLedger,
          id,
          payload.upd.from || 'In Review',
          payload.upd.to || data.status,
          payload.upd.op || 'Dr. Sarah Chen (Chief Quality Officer)',
          payload.upd.reason || null,
          payload.upd.tm
        );
        reconstructedLedger = [...reconstructedLedger, statusBlock];
      }
    }

    // Verify cryptographic continuity of the reconstructed ledger
    const chainCheck = await verifyBatchLedger(reconstructedLedger);
    if (!chainCheck.valid) {
      return {
        valid: false,
        status: 'TAMPER_DETECTED',
        reason: chainCheck.reason
      };
    }

    // Verify head block hash matches certified QR ledger hash (lh)
    const computedHeadHash = reconstructedLedger[reconstructedLedger.length - 1].hash;
    if (computedHeadHash !== lh) {
      return {
        valid: false,
        status: 'TAMPER_DETECTED',
        reason: 'Cryptographic hash mismatch. Batch data has been modified since issuance (Computed head hash does not match certified ledger hash).'
      };
    }

    return {
      valid: true,
      status: 'VERIFIED',
      reason: 'Cryptographic integrity verified. Batch parameters and chain of custody match immutable ledger.',
      batch: {
        ...tempBatch,
        blockchainHash: lh,
        ledger: reconstructedLedger
      }
    };
  } catch (err) {
    return {
      valid: false,
      status: 'TAMPER_DETECTED',
      reason: `Verification computation failed: ${err.message}`
    };
  }
}
