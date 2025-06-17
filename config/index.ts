import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDIjAxd8Dy264Rawzm8sIre_JLz1DKNwE4",
  authDomain: "cura-app-f905f.firebaseapp.com",
  projectId: "cura-app-f905f",
  storageBucket: "cura-app-f905f.appspot.com",
  messagingSenderId: "750196847142",
  appId: "1:750196847142:web:c40612badd5d578b9b2ce7",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); 

export const db = getFirestore(app);