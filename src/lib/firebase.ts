import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvyesn-KPSZpch9VOedQuC1bOnX3uO3ko",
  authDomain: "tami-app-b1de9.firebaseapp.com",
  projectId: "tami-app-b1de9",
  storageBucket: "tami-app-b1de9.firebasestorage.app",
  messagingSenderId: "1016418438238",
  appId: "1:1016418438238:web:8bf63005e56ea2890178cf",
  measurementId: "G-P3JXRSPFY4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
