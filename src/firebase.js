//firebase config

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig={
  apiKey: "AIzaSyDQ_UBgRGEzpl9vDGGmHVWZb8h2eIYVFHs",
  authDomain: "keeper-ff3f0.firebaseapp.com",
  projectId: "keeper-ff3f0",
  storageBucket: "keeper-ff3f0.appspot.com",
  messagingSenderId: "656242530922",
  appId: "1:656242530922:web:b929df4fa0f4b5af7e0813",
  measurementId: "G-QES98RFTQ5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app };