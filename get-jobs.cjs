const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");

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
  const q = await getDocs(collection(db, "jobs"));
  console.log("Found jobs:", q.docs.length);
  q.docs.forEach(d => console.log(d.id, d.data().customerName || 'no-name'));
  process.exit(0);
}
test();
