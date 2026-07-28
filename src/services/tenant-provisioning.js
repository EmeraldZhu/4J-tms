import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { firebaseConfig } from './firebase-config';

// Creating a user with the *primary* Firebase app signs the current user out and
// signs the new account in — which silently replaced the landlord's session with
// the tenant's. Provisioning runs on a throwaway secondary app instead, so the
// landlord's session is never touched.
//
// This is still a client-side workaround. The correct long-term fix is to move
// account creation behind a Cloud Function using the Admin SDK, so that the
// browser never holds the new account's credentials at all.

// Cryptographically secure temporary password. Math.random() is seeded from a
// predictable source and must never be used for anything credential-shaped.
export function generateTempPassword(length = 24) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);

  let password = '';
  for (let i = 0; i < length; i += 1) {
    password += charset[bytes[i] % charset.length];
  }
  return password;
}

/**
 * Create an auth account for a tenant and email them a reset link, without
 * disturbing the caller's session.
 *
 * @returns {Promise<string>} the new account's uid
 */
export async function provisionTenantAccount(email) {
  const secondaryApp = initializeApp(firebaseConfig, `tenant-provisioning-${Date.now()}`);
  const secondaryAuth = getAuth(secondaryApp);

  try {
    const tempPassword = generateTempPassword();
    const credential = await createUserWithEmailAndPassword(secondaryAuth, email, tempPassword);

    // The tenant sets their own password via the emailed link; the temporary one
    // is never displayed, stored, or transmitted anywhere else.
    await sendPasswordResetEmail(secondaryAuth, email);

    return credential.user.uid;
  } finally {
    // Tear the throwaway app down so the provisioned credentials do not linger
    // in memory or in persisted auth state.
    await signOut(secondaryAuth).catch(() => {});
    await deleteApp(secondaryApp).catch(() => {});
  }
}
