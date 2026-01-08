import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBbAq1nfVONw7WiCKykPc5yJi76fyvJhAA",
    authDomain: "komali-sarees.firebaseapp.com",
    projectId: "komali-sarees",
    storageBucket: "komali-sarees.firebasestorage.app",
    messagingSenderId: "642537157074",
    appId: "1:642537157074:web:207da20f1e8435003ad80b",
    measurementId: "G-6VLNZ41N2Q",
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
