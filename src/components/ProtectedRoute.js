import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Center, Spinner } from "@chakra-ui/react";

export default function ProtectedRoute({ roles, children }) {
  const { currentUser } = useAuth();
  const [isValidating, setIsValidating] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const validateRole = async () => {
      if (!currentUser) {
        setIsValidating(false);
        return;
      }

      try {
        // Validar rol contra Firestore (backend validation)
        const userDoc = await getDoc(doc(db, "usuarios", currentUser.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};
        const actualRole = userData.role || "user";
        
        setHasPermission(roles.includes(actualRole));
      } catch (error) {
        console.error("Error validating role:", error);
        setHasPermission(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateRole();
  }, [currentUser, roles]);

  if (isValidating) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!currentUser) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!hasPermission) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
} 