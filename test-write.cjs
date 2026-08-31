const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc } = require("firebase/firestore");
const firebaseConfig = {
  apiKey: "AIzaSyBvyesn-KPSZpch9VOedQuC1bOnX3uO3ko",
  authDomain: "tami-app-b1de9.firebaseapp.com",
  projectId: "tami-app-b1de9"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
async function test() {
  try {
    const id = Date.now().toString();
    await setDoc(doc(db, "jobs", id), { test: "data" });
    console.log("SUCCESS", id);
    process.exit(0);
  } catch(e) {
    console.error("FAIL", e);
    process.exit(1);
  }
}
test();
