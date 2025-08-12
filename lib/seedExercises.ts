import { sampleExercises } from '@/data/sampleExercises';
import { db } from '@/lib/firebase';

// Upload sampleExercises to Firestore 'exercises' collection.
// Requires the signed-in user to have { admin: true } custom claim per Firestore rules.
export async function seedExercises(options?: { overwrite?: boolean }) {
  const overwrite = options?.overwrite ?? false;

  const { collection, doc, getDocs, writeBatch, setDoc } = await import('firebase/firestore');
  const colRef = collection(db, 'exercises');

  if (!overwrite) {
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      return { skipped: true, written: 0 };
    }
  }

  const batch = writeBatch(db);
  for (const ex of sampleExercises) {
    const ref = doc(colRef, ex.id);
    // Merge to avoid clobbering if docs exist and overwrite is true
    batch.set(ref, ex, { merge: true });
  }
  await batch.commit();
  return { skipped: false, written: sampleExercises.length };
}
