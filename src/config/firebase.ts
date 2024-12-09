import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBXd4yxQr4z_KHM3w4VTXhP8RzJ_kFLdLE",
  authDomain: "renthub-stackblitz.firebaseapp.com",
  projectId: "renthub-stackblitz",
  storageBucket: "renthub-stackblitz.appspot.com",
  messagingSenderId: "850122162984",
  appId: "1:850122162984:web:a9e8f9b9f9b9f9b9f9b9f9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Configure providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Set persistence
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

export { auth, db, googleProvider, facebookProvider };
export default app;