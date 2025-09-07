// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // guna Firestore

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD4XjJlfG_Nppl1beylAn-hwiRfZREQyB4",
    authDomain: "aplikasi-infaqyide.firebaseapp.com",
    projectId: "aplikasi-infaqyide",
    storageBucket: "aplikasi-infaqyide.firebasestorage.app",
    messagingSenderId: "295455865604",
    appId: "1:295455865604:web:6241155f626110d234ae51",
    measurementId: "G-9ZPQ3ZFT91"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };