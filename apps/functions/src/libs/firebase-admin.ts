import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  console.log("🔥 initializing firebase-admin");
  admin.initializeApp();
} else {
  console.log("🟢 firebase-admin already initialized");
}

const db = admin.firestore();

export { db }