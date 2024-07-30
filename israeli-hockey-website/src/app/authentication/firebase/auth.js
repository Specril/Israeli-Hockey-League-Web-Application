import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile
} from "firebase/auth";

export const doCreateUserWithEmailAndPassword = async (email, name, password, userID) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User created:", user);

    // Update the user profile with the display name
    await updateProfile(user, { displayName: name, photoURL: JSON.stringify({ 'coach': 0, 'referee': 0, 'admin': 0, 'player': 0, 'fan': 0 }) });
    // Reload the user to ensure the displayName is updated
    await user.reload();

    return user;
  } catch (error) {
    console.error("Error creating user and setting profile:", error);
    throw error; // Rethrow the error for handling elsewhere
  }
};


export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Add user to Firestore (if needed)
  // await db.collection('users').doc(user.uid).set({ ... });

  return result;
};

export const doSignOut = () => {
  return auth.signOut();
};

export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password) => {
  return updatePassword(auth.currentUser, password);
};

export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/home`,
  });
};
