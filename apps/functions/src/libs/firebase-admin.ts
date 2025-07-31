import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  console.log("🔥 initializing firebase-admin");
  admin.initializeApp();
} else {
  console.log("🟢 firebase-admin already initialized");
}

const db = admin.firestore();

if (process.env.FUNCTIONS_EMULATOR === 'true') {
  db.settings({
    host: 'localhost:8080',
    ssl: false,
  });
}

const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;

export { admin, db, serverTimestamp };