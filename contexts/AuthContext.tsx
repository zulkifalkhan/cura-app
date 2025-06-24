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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "@/config";
import { signUpAccount } from "@/services/AuthService";
import { router } from "expo-router";

// --- AuthContext type ---
export type AuthContextType = {
  user: User | null | undefined;
  setUser: (user: User | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
};

// --- Create context ---
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// --- Provider implementation ---
export const AuthProvider: React.FC<PropsWithChildren<object>> = ({ children }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined); // undefined = loading

  // Load persisted auth state from AsyncStorage
  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("authUser");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Failed to load stored user", err);
      }
    };

    loadStoredUser();

    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await AsyncStorage.setItem("authUser", JSON.stringify(firebaseUser));
      } else {
        await AsyncStorage.removeItem("authUser");
      }
      console.log("👤 Auth state:", firebaseUser?.email ?? "Not signed in");
    });

    return unsubscribe;
  }, []);

  // --- Sign in function ---
  const signIn = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const loggedInUser = userCredential.user;
    setUser(loggedInUser);
    await AsyncStorage.setItem("authUser", JSON.stringify(loggedInUser));
  };

  // --- Sign up function ---
  const signUp = async (name: string, email: string, password: string) => {
    try {
      // Step 1: Create user with Firebase
      // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // const newUser = userCredential.user;
  
      // Step 2: Optionally store the name (if using Firestore or custom service)
      // Example with external API (you already have `signUpAccount`)
      await signUpAccount(name, email, password);
  
      // Step 3: Update context + AsyncStorage
      // setUser(newUser);

      // await AsyncStorage.setItem("authUser", JSON.stringify(newUser));
    } catch (error) {
      console.error("❌ Sign-up error:", error);
      throw error;
    }
  };
  

  // --- Sign out function ---
  const signOut = async () => {
    await auth.signOut()
    setUser(null);
    await AsyncStorage.removeItem("authUser");
    router.push('/SignIn')
  };

  // --- Delete account ---
  const deleteAccount = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await currentUser.delete();
      setUser(null);
      await AsyncStorage.removeItem("authUser");
    }
    router.push('/SignIn')
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
