import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDELnAEmQHZvn5MoHRRfKtNuPLkj4B5C9U",
    authDomain: "tshirt-ecommerce-fcbaf.firebaseapp.com",
    projectId: "tshirt-ecommerce-fcbaf",
    storageBucket: "tshirt-ecommerce-fcbaf.firebasestorage.app",
    messagingSenderId: "1070796279771",
    appId: "1:1070796279771:web:04bb0b3d10156a59d861fe"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };