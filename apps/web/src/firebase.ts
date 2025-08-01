import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

// ⚠️ 반드시 connectFirestoreEmulator 전에 getFirestore(app)
const firestore = getFirestore(app);

if (import.meta.env.DEV) {
  connectFirestoreEmulator(firestore, 'localhost', 8080);
  console.log('✅ connected dev firestore');
}

const analytics = await isSupported().then((yes) => (yes ? getAnalytics(app) : null));

// ⚠️ db가 connect 이후에 export 되어야 함
export { app, firestore as db, analytics };
