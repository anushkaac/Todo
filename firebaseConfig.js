// FirebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDXXvU-LHr7lul1r53zczt-lxwNpOBB5ww",
    authDomain: "todo-app-de223.firebaseapp.com",
    databaseURL: "https://todo-app-de223-default-rtdb.firebaseio.com",
    projectId: "todo-app-de223",
    storageBucket: "todo-app-de223.appspot.com",
    messagingSenderId: "499254082825",
    appId: "1:499254082825:web:87f757fe5c43aafff827d8"
};

const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
