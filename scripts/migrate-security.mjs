/**
 * One-off migration to bring existing data in line with firestore.rules.
 *
 * The new rules scope every document to a landlord. Records created before the
 * rules existed are missing the fields that scoping depends on, so without this
 * backfill existing tenants would stop seeing notices and existing maintenance
 * tickets would disappear from the landlord dashboard.
 *
 * What it does:
 *   1. tenants/*        -> creates tenantProfiles/{authUid} = { landlordId, tenantDocId, role }
 *   2. noticeboard/*    -> sets landlordId from createdBy.uid
 *   3. maintenance/*    -> sets landlordId by resolving the ticket's tenant
 *
 * Usage:
 *   npm install --no-save firebase-admin
 *   # Download a service account key from
 *   #   Firebase Console > Project Settings > Service Accounts > Generate new private key
 *   export GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/serviceAccount.json
 *   node scripts/migrate-security.mjs --dry-run    # inspect first
 *   node scripts/migrate-security.mjs              # apply
 *
 * Run this BEFORE deploying the new rules, so there is no window in which the
 * app is live against rules the data cannot satisfy.
 */

import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const DRY_RUN = process.argv.includes('--dry-run');

initializeApp({ credential: applicationDefault() });
const db = getFirestore();

const log = (...args) => console.log(DRY_RUN ? '[dry-run]' : '[apply]', ...args);

async function backfillTenantProfiles() {
  const snapshot = await db.collection('tenants').get();
  let created = 0;
  let skipped = 0;

  for (const tenantDoc of snapshot.docs) {
    const data = tenantDoc.data();
    const { authUid, createdBy } = data;

    if (!authUid || !createdBy) {
      // Tenant has not been invited yet, so there is no auth account to map.
      skipped += 1;
      continue;
    }

    log(`tenantProfiles/${authUid} -> landlordId=${createdBy}`);
    if (!DRY_RUN) {
      await db.collection('tenantProfiles').doc(authUid).set(
        { landlordId: createdBy, tenantDocId: tenantDoc.id, role: 'tenant' },
        { merge: true }
      );
    }
    created += 1;
  }

  console.log(`tenantProfiles: ${created} written, ${skipped} skipped (not yet invited)`);
  return snapshot;
}

async function backfillNoticeboard() {
  const snapshot = await db.collection('noticeboard').get();
  let updated = 0;

  for (const noticeDoc of snapshot.docs) {
    const data = noticeDoc.data();
    if (data.landlordId) continue;

    const landlordId = data.createdBy?.uid;
    if (!landlordId) {
      console.warn(`noticeboard/${noticeDoc.id}: no createdBy.uid, skipping — needs manual review`);
      continue;
    }

    log(`noticeboard/${noticeDoc.id} -> landlordId=${landlordId}`);
    if (!DRY_RUN) {
      await noticeDoc.ref.update({ landlordId });
    }
    updated += 1;
  }

  console.log(`noticeboard: ${updated} updated`);
}

async function backfillMaintenance(tenantsSnapshot) {
  // Map tenant auth uid -> landlord uid, so a ticket can be attributed to the
  // landlord who owns the tenant that raised it.
  const tenantUidToLandlord = new Map();
  for (const tenantDoc of tenantsSnapshot.docs) {
    const { authUid, createdBy } = tenantDoc.data();
    if (authUid && createdBy) tenantUidToLandlord.set(authUid, createdBy);
  }

  const snapshot = await db.collection('maintenance').get();
  let updated = 0;
  let orphaned = 0;

  for (const ticketDoc of snapshot.docs) {
    const data = ticketDoc.data();
    if (data.landlordId) continue;

    const raisedBy = data.createdBy?.uid;
    const landlordId = raisedBy ? tenantUidToLandlord.get(raisedBy) : undefined;

    if (!landlordId) {
      console.warn(`maintenance/${ticketDoc.id}: cannot resolve landlord for tenant ${raisedBy ?? '(unknown)'} — needs manual review`);
      orphaned += 1;
      continue;
    }

    log(`maintenance/${ticketDoc.id} -> landlordId=${landlordId}`);
    if (!DRY_RUN) {
      await ticketDoc.ref.update({ landlordId });
    }
    updated += 1;
  }

  console.log(`maintenance: ${updated} updated, ${orphaned} orphaned`);
}

async function main() {
  if (DRY_RUN) console.log('Dry run — no writes will be made.\n');

  const tenantsSnapshot = await backfillTenantProfiles();
  await backfillNoticeboard();
  await backfillMaintenance(tenantsSnapshot);

  console.log('\nDone.');
  if (DRY_RUN) console.log('Re-run without --dry-run to apply.');
}

main().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
