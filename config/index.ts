// // firebase/firebaseConfig.ts
// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore, serverTimestamp } from 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: "AIzaSyDIjAxd8Dy264Rawzm8sIre_JLz1DKNwE4",
//   authDomain: "cura-app-f905f.firebaseapp.com",
//   projectId: "cura-app-f905f",
//   storageBucket: "cura-app-f905f.appspot.com",
//   messagingSenderId: "750196847142",
//   appId: "1:750196847142:web:c40612badd5d578b9b2ce7",
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// export { auth, db, serverTimestamp };


import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIjAxd8Dy264Rawzm8sIre_JLz1DKNwE4",
  authDomain: "cura-app-f905f.firebaseapp.com",
  projectId: "cura-app-f905f",
  storageBucket: "cura-app-f905f.appspot.com",
  messagingSenderId: "750196847142",
  appId: "1:750196847142:web:c40612badd5d578b9b2ce7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); // ✅ instead of initializeAuth

console.log('auth',auth)
export const db = getFirestore(app);
// export const database = getDatabase(app);