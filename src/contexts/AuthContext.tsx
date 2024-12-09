import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithCredential
} from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../config/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  loginWithPhone: (phoneNumber: string) => Promise<any>;
  verifyPhoneCode: (verificationId: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function signup(email: string, password: string, name: string) {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });
      setCurrentUser(user);
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  async function login(email: string, password: string) {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      setCurrentUser(user);
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async function loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setCurrentUser(result.user);
    } catch (error: any) {
      console.error('Google login error:', error);
      throw error;
    }
  }

  async function loginWithFacebook() {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      setCurrentUser(result.user);
    } catch (error: any) {
      console.error('Facebook login error:', error);
      throw error;
    }
  }

  async function loginWithPhone(phoneNumber: string) {
    try {
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible'
      });
      return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    } catch (error: any) {
      console.error('Phone login error:', error);
      throw error;
    }
  }

  async function verifyPhoneCode(verificationId: string, code: string) {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      const result = await signInWithCredential(auth, credential);
      setCurrentUser(result.user);
    } catch (error: any) {
      console.error('Phone verification error:', error);
      throw error;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (error: any) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async function resetPassword(email: string) {
    if (!email) {
      throw new Error('Please enter your email address');
    }
    return sendPasswordResetEmail(auth, email);
  }

  async function updateUserProfile(displayName: string) {
    if (currentUser) {
      try {
        await updateProfile(currentUser, { displayName });
        setCurrentUser({ ...currentUser, displayName });
      } catch (error: any) {
        console.error('Profile update error:', error);
        throw error;
      }
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signup,
    login,
    loginWithGoogle,
    loginWithFacebook,
    loginWithPhone,
    verifyPhoneCode,
    logout,
    resetPassword,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}