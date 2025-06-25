import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  updatePassword,
} from 'firebase/auth';
import { auth, db } from '@/config';
import { deleteUser, signOut, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { router } from 'expo-router';
import {  doc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const signUpAccount = async (name: string, email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await updateProfile(user, { displayName: name });

  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    name,
    email,
    createdAt: new Date().toISOString()
  });


  await AsyncStorage.setItem("authUser", JSON.stringify(user));
};

export const signIn = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const resetPassword = async (email: string) => {
  return await sendPasswordResetEmail(auth, email);
};


export const logout = async () => {
  await signOut(auth);
  router.push('/SignIn')
};

export const deleteAccount = async () => {
  const user = auth.currentUser;
  if (user) {
    await deleteUser(user);
  } else {
    throw new Error('No authenticated user found.');
  }
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  const user = auth.currentUser;
  if (user?.email) {
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword); 
  } else {
    throw new Error('No authenticated user found.');
  }
};