import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAcRcjFJ4DDF7lWnImfAAJbwT2rplfWcRM",
  authDomain: "tcc-gameon.firebaseapp.com",
  projectId: "tcc-gameon",
  storageBucket: "tcc-gameon.firebasestorage.app",
  messagingSenderId: "539517350122",
  appId: "1:539517350122:web:4971885468a9cb98dee793",
  measurementId: "G-YLVF1GCGK4"
};

// Inicializar Firebase apenas se ainda não foi inicializado
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Inicializar Auth (o Firebase JS SDK gerencia persistência automaticamente no React Native/Expo)
const auth = getAuth(app);

// Inicializar Firestore
const db = getFirestore(app);

export { auth, db };
export default app;