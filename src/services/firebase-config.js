import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAyK6EtnNM-YqHDaktclq9RulNSjoYehT8",
  authDomain: "four-j-tms.firebaseapp.com",
  projectId: "four-j-tms",
  storageBucket: "four-j-tms.appspot.com",
  messagingSenderId: "149128844884",
  appId: "1:149128844884:web:903900f87a059a173affc1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log('Firebase has been initialized', app);

export default app;