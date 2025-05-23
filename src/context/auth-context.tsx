
"use client";

import * as React from 'react';
import type { User } from 'firebase/auth';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  sendEmailVerification // Import sendEmailVerification
} from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Ensure this path is correct
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast'; // Import useToast

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, pass: string) => Promise<User | null>;
  logIn: (email: string, pass: string) => Promise<User | null>;
  logOut: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();
  const { toast } = useToast(); // Initialize toast

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, pass: string): Promise<User | null> => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      // Send verification email
      if (userCredential.user) {
        await sendEmailVerification(userCredential.user);
        toast({
          title: "Verification Email Sent",
          description: "Please check your inbox to verify your email address.",
        });
      }
      setUser(userCredential.user);
      router.push('/'); // Redirect to home after signup
      return userCredential.user;
    } catch (error: any) {
      console.error("Error signing up:", error);
      const errorMessage = error.message || "An unknown error occurred during sign up.";
      toast({ title: "Sign Up Failed", description: errorMessage, variant: "destructive"});
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logIn = async (email: string, pass: string): Promise<User | null> => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      setUser(userCredential.user);
      if (userCredential.user && !userCredential.user.emailVerified) {
        toast({
          title: "Email Not Verified",
          description: "Please verify your email address. A verification email was sent to your inbox.",
          variant: "default" // Or "destructive" if you want to be more prominent
        });
      }
      router.push('/'); // Redirect to home after login
      return userCredential.user;
    } catch (error: any) {
      console.error("Error logging in:", error);
      const errorMessage = error.message || "Invalid email or password. Please try again.";
      toast({ title: "Login Failed", description: errorMessage, variant: "destructive"});
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      router.push('/login'); // Redirect to login after logout
    } catch (error: any) {
      console.error("Error logging out:", error);
      const errorMessage = error.message || "An unknown error occurred during logout.";
      toast({ title: "Logout Failed", description: errorMessage, variant: "destructive"});
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signUp,
    logIn,
    logOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
