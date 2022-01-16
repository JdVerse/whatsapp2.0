import firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyAyuso0cUQwTMQFKdFO0Prt50AZp0qRGbs",
  authDomain: "whatsapp00000.firebaseapp.com",
  projectId: "whatsapp00000",
  storageBucket: "whatsapp00000.appspot.com",
  messagingSenderId: "909863362915",
  appId: "1:909863362915:web:7fcf616461f7e367397356",
  measurementId: "G-ZRCCGHCB0B",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();
const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();
export { db, auth, provider };
