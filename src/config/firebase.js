import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDBH1prHbiTRU0xb3R6DSh3EA7rhuk9xsk",
  authDomain: "my-data-base-f4080.firebaseapp.com",
  projectId: "my-data-base-f4080",
  storageBucket: "my-data-base-f4080.appspot.com",
  messagingSenderId: "52688315479",
  appId: "1:52688315479:web:af14948b2388d6a1812f12",
  measurementId: "G-DDW9PS8KBG"
};

const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();