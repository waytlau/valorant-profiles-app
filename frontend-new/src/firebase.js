// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Function to handle user login/signup
const handleUserAuth = async (user) => {
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // Create a new user document
      await setDoc(userDocRef, {
        uid: user.uid,
        displayName: user.displayName || user.email,
        email: user.email,
        // Add any other default fields here
      });
    } else {
      // Update existing user document if needed
      await setDoc(
        userDocRef,
        {
          displayName: user.displayName || user.email,
          email: user.email,
          // Update other fields if necessary
        },
        { merge: true }
      );
    }
  } catch (error) {
    console.error('Error creating/updating user document:', error);
  }
};

// In your authentication success callback
auth.onAuthStateChanged((user) => {
  if (user) {
    handleUserAuth(user);
  }
});

