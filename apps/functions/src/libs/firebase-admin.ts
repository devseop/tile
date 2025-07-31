import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  console.log("🔥 initializing firebase-admin");
  admin.initializeApp();
} else {
  console.log("🟢 firebase-admin already initialized");
}

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

if (process.env.FUNCTIONS_EMULATOR === 'true') {
  db.settings({
    host: 'localhost:8080',
    ssl: false,
  });
}


export { admin, db, FieldValue };