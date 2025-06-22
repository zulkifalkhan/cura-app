// contexts/AuthContext.tsx
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { auth } from "@/config"; // Your initialized Firebase auth instance
import { signUpAccount  } from "@/services/AuthService";

// --- AuthContext type ---
export type AuthContextType = {
  user: User | null | undefined;
  setUser: (user: User | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name:string,email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
};

// --- Create context ---
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// --- Provider implementation ---
export const AuthProvider: React.FC<PropsWithChildren<object>> = ({ children }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined); // `undefined` = loading state

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      console.log("👤 Auth state:", user?.email ?? "Not signed in");
    });
    return unsubscribe;
  }, []);

  // --- Sign in function ---
  const signIn = async (email: string, password: string) => {
   const user =  await signInWithEmailAndPassword(auth, email, password);
  };

  // --- Sign up function ---
  const signUp = async (name:string,email: string, password: string) => {
    await signUpAccount(name, email, password);
  };

  // --- Sign out function ---
  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  // --- Delete account ---
  const deleteAccount = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) await currentUser.delete();
  };

  const authValues: AuthContextType = {
    user,
    setUser,
    signIn,
    signUp,
    signOut,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={authValues}>
      {user === undefined ? null : children}
    </AuthContext.Provider>
  );
};

// --- Hook to use AuthContext ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
