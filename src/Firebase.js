import { initializeApp } from 'firebase/app';
import { getFirestore} from 'firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyClxFBwMIZdqvn1pKFf9aJFIn_llMcQ5eI",
    authDomain: "groupchat-543f5.firebaseapp.com",
    projectId: "groupchat-543f5",
    storageBucket: "groupchat-543f5.appspot.com",
    messagingSenderId: "201303870820",
    appId: "1:201303870820:web:f9264e4bdbdf19bffebe71",
    measurementId: "G-JVPV10HCK3"
  };

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export default db;