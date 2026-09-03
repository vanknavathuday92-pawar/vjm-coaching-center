import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {

  apiKey: "AIzaSyBLug-NGs_pVLIQD-9e-Do8EB7aYWZBLcM",

  authDomain: "vjm-coaching-center.firebaseapp.com",

  projectId: "vjm-coaching-center",

  storageBucket: "vjm-coaching-center.firebasestorage.app",

  messagingSenderId: "113819745605",

  appId: "1:113819745605:web:cf33c8c847b2744d29922c"

};

const app = initializeApp(firebaseConfig);

export { app };

export const db = getFirestore(app);

export const auth = getAuth(app);