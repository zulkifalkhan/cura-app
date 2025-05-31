// firebase/authService.ts
import { auth,serverTimestamp,db, } from "@/config";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    deleteUser,
    updatePassword as firebaseUpdatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
    signOut,
  } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
  
  export const signUp = async (name: string, email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
  
    const newUser = {
      name,
      email,
      fantrax_connected: false,
      createdAt: serverTimestamp(),
      userId: user.uid,
    };
  
    await setDoc(doc(db, "users", user.uid), newUser);
    return userCredential;
  };
  
  export const signIn = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };
  
  export const resetPassword = async (email: string) => {
    return await sendPasswordResetEmail(auth, email);
  };
  
  export const deleteAccount = async () => {
    if (auth.currentUser) {
      await deleteUser(auth.currentUser);
    } else {
      throw new Error("No authenticated user found.");
    }
  };
  
  export const updatePassword = async (currentPassword: string, newPassword: string) => {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error("No authenticated user found.");
  
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await firebaseUpdatePassword(user, newPassword);
  };
  
  export const signOutUser = async () => {
    await signOut(auth);
  };
  