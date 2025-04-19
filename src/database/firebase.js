// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
    apiKey: "AIzaSyDK-QI2omo_eRjz2FWH7eO6tvZv8x50hNY",
    authDomain: "msdesigns-a214e.firebaseapp.com",
    projectId: "msdesigns-a214e",
    storageBucket: "msdesigns-a214e.firebasestorage.app",
    messagingSenderId: "427217985216",
    appId: "1:427217985216:web:c0d62915cfbcd79a74d725",
    measurementId: "G-YFK75B5W3X"
};

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export {functions };