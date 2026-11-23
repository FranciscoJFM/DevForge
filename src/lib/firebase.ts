import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured =
    Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId);

export const firebaseApp = isFirebaseConfigured
    ? getApps().length ? getApp() : initializeApp(firebaseConfig)
    : null;

export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null;
export const firestore = firebaseApp ? getFirestore(firebaseApp) : null;

if (typeof window !== 'undefined' &&
    firebaseApp &&
    process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true') {
    const globals = window as typeof window & { __devforgeEmulatorsConnected?: boolean };
    if (!globals.__devforgeEmulatorsConnected) {
        if (firebaseAuth) {
            connectAuthEmulator(firebaseAuth, 'http://127.0.0.1:9099', { disableWarnings: true });
        }
        if (firestore) {
            connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
        }
        globals.__devforgeEmulatorsConnected = true;
    }
}
