/*
  One-off script to grant admin to a user by email.
  - Requires firebase-admin and Application Default Credentials (service account JSON).
  - Finds the user by email and sets custom claim { admin: true }.
*/

import * as admin from 'firebase-admin';

function initAdmin() {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }
}

async function grant(email: string) {
  initAdmin();
  const auth = admin.auth();
  const user = await auth.getUserByEmail(email);
  await auth.setCustomUserClaims(user.uid, { admin: true });
  await auth.revokeRefreshTokens(user.uid); // force token refresh
  console.log(`Granted admin to ${email} (${user.uid}).`);
}

const targetEmail = process.env.ADMIN_EMAIL || 'samantha.adorno30@gmail.com';

grant(targetEmail).catch((err) => {
  console.error('Grant admin failed:', err);
  process.exitCode = 1;
});
