import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Center } from "@chakra-ui/react";
import logo from "assets/img/layout/logoWhite.png";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [realUser, setRealUser] = useState(null);
  const [impersonatedUser, setImpersonatedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Optionally fetch extra profile data from Firestore
        const userDoc = await getDoc(doc(db, "usuarios", user.uid));
        const docData = userDoc.exists() ? userDoc.data() : {};
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: docData.role || "user",
          ...docData,
        };
        
        setRealUser(userData);
        // Si no hay usuario impersonado, usar el usuario real
        if (!impersonatedUser) {
          setCurrentUser(userData);
        }
      } else {
        setCurrentUser(null);
        setRealUser(null);
        setImpersonatedUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [impersonatedUser]);

  // Login with email and password
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Register new user
  const register = async (email, password, displayName) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, { displayName });
      // Save extra profile data in Firestore
      await setDoc(doc(db, "usuarios", res.user.uid), {
        email,
        displayName,
        createdAt: new Date(),
      });
      navigate("/dashboard");
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    navigate("/auth/login");
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Impersonate user
  const impersonate = async (userId) => {
    try {
      // Solo permitir impersonación si el usuario real es admin
      if (realUser?.role !== 'admin') {
        throw new Error('Solo los administradores pueden impersonar usuarios');
      }

      // Obtener datos del usuario a impersonar
      const userDoc = await getDoc(doc(db, "usuarios", userId));
      if (!userDoc.exists()) {
        throw new Error('Usuario no encontrado');
      }

      const userData = userDoc.data();
      const impersonatedUserData = {
        uid: userId,
        email: userData.email,
        displayName: userData.displayName,
        role: userData.role || "user",
        ...userData,
      };

      setImpersonatedUser(impersonatedUserData);
      setCurrentUser(impersonatedUserData);
      
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Stop impersonating
  const stopImpersonate = () => {
    setImpersonatedUser(null);
    setCurrentUser(realUser);
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      realUser, 
      impersonatedUser, 
      isImpersonating: !!impersonatedUser,
      login, 
      logout, 
      register, 
      loginWithGoogle, 
      impersonate,
      stopImpersonate,
      loading 
    }}>
      {loading ? (
        <Center h="100vh" w="100vw" bg="#f7fafd">
          <img
            src={logo}
            alt="MR Capitals"
            style={{ width: 100, height: 100, objectFit: "contain" }}
          />
        </Center>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 