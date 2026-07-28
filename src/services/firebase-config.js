import { initializeApp } from "firebase/app";

// NOTE: a Firebase web config is public by design — it identifies the project,
// it does not authorise anything. Access control comes from firestore.rules and
// storage.rules. Do lock the browser key down to this project's domains under
// Google Cloud Console > APIs & Services > Credentials, and enable App Check.
export const firebaseConfig = {
  apiKey: "AIzaSyAyK6EtnNM-YqHDaktclq9RulNSjoYehT8",
  authDomain: "four-j-tms.firebaseapp.com",
  projectId: "four-j-tms",
  storageBucket: "four-j-tms.appspot.com",
  messagingSenderId: "149128844884",
  appId: "1:149128844884:web:903900f87a059a173affc1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
