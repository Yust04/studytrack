import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: "AIzaSyCNc3_VSr18rsAdj4XJLq81ZQ2RygwViH4",
  authDomain: "studytrack-8f141.firebaseapp.com",
  projectId: "studytrack-8f141",
  storageBucket: "studytrack-8f141.firebasestorage.app",
  messagingSenderId: "618269099383",
  appId: "1:618269099383:web:7aba3a783451e01ae3cd72",
  measurementId: "G-VZT1Y97TWD",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// offline
enableIndexedDbPersistence(db).catch(() => {});

// App Check (reCAPTCHA v3)
const siteKey = import.meta.env?.VITE_RECAPTCHA_V3_SITE_KEY;
const debugToken = import.meta.env?.VITE_APPCHECK_DEBUG_TOKEN;

if (import.meta.env && import.meta.env.DEV) {
  // For local dev: use explicit debug token if provided, otherwise ask SDK to generate one
  // eslint-disable-next-line no-undef
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken || true;
}

if (siteKey) {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(siteKey),
    isTokenAutoRefreshEnabled: true,
  });
} else if (import.meta.env && import.meta.env.DEV) {
  // No site key provided, but we are in dev: initialize with a placeholder key so SDK emits debug token
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider("local-dev"),
    isTokenAutoRefreshEnabled: true,
  });
}

export const provider = new GoogleAuthProvider();
export const loginWithGoogle = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);
