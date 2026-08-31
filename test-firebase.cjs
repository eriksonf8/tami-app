const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc } = require("firebase/firestore");

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
const db = getFirestore(app);

async function test() {
  try {
    await setDoc(doc(db, "jobs", "test-connection"), { test: true });
    console.log("SUCCESS! Write worked.");
    process.exit(0);
  } catch(e) {
    console.error("FAILED! Write failed.", e.message);
    process.exit(1);
  }
}
test();
