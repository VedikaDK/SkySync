import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBVtJfpOTiAFdkoDsisWhhMIqK9vR7FGBo",
  authDomain: "login1-4480c.firebaseapp.com",
  projectId: "login1-4480c",
  storageBucket: "login1-4480c.appspot.com",
  messagingSenderId: "897652456901",
  appId: "1:897652456901:web:5fd32d3ee41217e1631fac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
