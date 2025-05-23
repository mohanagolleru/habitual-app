
"use client";

import * as React from 'react';
import type { User } from 'firebase/auth';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  sendEmailVerification
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
  sendVerificationEmailAgain: () => Promise<boolean>; 
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();
  const { toast } = useToast();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await currentUser.reload(); // Ensure we have the latest user data (including emailVerified)
        setUser(auth.currentUser); // Set user from auth.currentUser after reload
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, pass: string): Promise<User | null> => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      if (userCredential.user) {
        await sendEmailVerification(userCredential.user);
        toast({
          title: "Verification Email Sent",
          description: "Please check your inbox to verify your email address.",
        });
        setUser(userCredential.user); // Set user state
        router.push('/verify-email'); // Redirect to verify email page
        return userCredential.user;
      }
      return null;
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
      // Ensure user data is fresh, especially emailVerified
      await userCredential.user.reload();
      const freshUser = auth.currentUser; // Get the potentially updated user object

      setUser(freshUser);

      if (freshUser && !freshUser.emailVerified) {
        toast({
          title: "Email Not Verified",
          description: "Please verify your email address. Redirecting to verification page.",
          variant: "default"
        });
        router.push('/verify-email');
        return freshUser;
      }
      
      if (freshUser && freshUser.emailVerified) {
        router.push('/'); // Redirect to home after successful login and verification
        return freshUser;
      }
      return null; // Should not happen if logic is correct
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
    } catch (error: any) { // Added opening brace
      console.error("Error logging out:", error);
      const errorMessage = error.message || "An unknown error occurred during logout.";
      toast({ title: "Logout Failed", description: errorMessage, variant: "destructive"});
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationEmailAgain = async (): Promise<boolean> => {
    if (user && !user.emailVerified) {
      try {
        await sendEmailVerification(user);
        return true;
      } catch (error: any) {
        console.error("Error resending verification email:", error);
        // Firebase often has rate limits, so a generic error is okay.
        // Specific error codes (like auth/too-many-requests) could be handled.
        return false;
      }
    }
    return false; // No user or already verified
  };

  const value = {
    user,
    loading,
    signUp,
    logIn,
    logOut,
    sendVerificationEmailAgain,
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
