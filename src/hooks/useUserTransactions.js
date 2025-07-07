import { useState, useEffect } from "react";
import { useAuth } from "contexts/AuthContext";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export function useUserTransactions() {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      if (!currentUser?.uid) {
        setTransactions([]);
        setLoading(false);
        return;
      }
      try {
        const transactionsRef = collection(db, "usuarios", currentUser.uid, "transacciones");
        const q = query(transactionsRef, orderBy("fecha", "desc"));
        const querySnapshot = await getDocs(q);
        const transactionsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            movimiento: data.tipo || "N/A",
            fecha: data.fecha?.toDate ? data.fecha.toDate().toISOString() : data.fecha,
            cuotapartes: Number(data.cuotapartes) || 0,
            montoUSD: Number(data.montoUSD) || 0,
            precioCuota: Number(data.precioCuota) || 0,
          };
        });
        setTransactions(transactionsData);
      } catch (e) {
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, [currentUser?.uid]);

  return { transactions, loading };
} 