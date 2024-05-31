// Import the functions you need from the SDKs you need
import {collection, getFirestore} from 'firebase/firestore';
import {initializeApp} from 'firebase/app';
import {getStorage} from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAz_3WREgI5I2Bq7OWJmr-uGk-5KbtJEWY',
  authDomain: 'vsign-c873f.firebaseapp.com',
  projectId: 'vsign-c873f',
  storageBucket: 'vsign-c873f.appspot.com',
  messagingSenderId: '108026504770',
  appId: '1:108026504770:web:8c2fed851dff31761cefdb',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);

export const userRef = collection(db, 'users');
export const roomRef = collection(db, 'rooms');
