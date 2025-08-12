/*
  One-off Firestore seeding script (TypeScript)

  Usage notes (read-only, do not execute here):
  - Requires firebase-admin installed in your project.
  - Authenticate with Application Default Credentials (ADC), e.g. set
    the GOOGLE_APPLICATION_CREDENTIALS env var to your service account JSON.
  - Run with ts-node or compile to JS and run with node.

  What it does:
  - Writes all entries from data/sampleExercises.ts into the 'exercises' collection.
  - Skips existing docs by default; pass --overwrite to merge-set them anyway.
  - Removes any undefined values before writing (Firestore rejects undefined).
*/

import * as admin from 'firebase-admin';
import { sampleExercises } from '../data/sampleExercises';

function initAdmin() {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }
  return admin.firestore();
}

function stripUndefined<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(stripUndefined) as unknown as T;
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj as any)) {
    if (v === undefined) continue;
    if (v && typeof v === 'object') out[k] = stripUndefined(v);
    else out[k] = v;
  }
  return out as T;
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const overwrite = args.has('--overwrite');

  const db = initAdmin();
  const col = db.collection('exercises');

  if (!overwrite) {
    const snap = await col.limit(1).get();
    if (!snap.empty) {
      console.log('exercises collection already has data; skipping (use --overwrite to force).');
      return;
    }
  }

  console.log(`Seeding ${sampleExercises.length} exercises${overwrite ? ' (merge overwrite)' : ''}...`);

  const batch = db.batch();
  for (const ex of sampleExercises) {
    const data = stripUndefined(ex);
    const ref = col.doc(ex.id);
    batch.set(ref, data, { merge: true });
  }
  await batch.commit();

  console.log('Done.');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exitCode = 1;
});
