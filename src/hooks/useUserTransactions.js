import { useState, useEffect } from "react";
import { useAuth } from "contexts/AuthContext";
import { useCuotaparteData } from "hooks/useCuotaparteData";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export function useUserTransactions() {
  const { currentUser } = useAuth();
  const { currentValorCuota } = useCuotaparteData();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchTransactions() {
      if (!currentUser?.uid) {
        if (isMounted) {
          setTransactions([]);
          setLoading(false);
        }
        return;
      }
      
      console.log('Fetching transactions for user:', currentUser.uid, currentUser.displayName);
      
      try {
        const transactionsRef = collection(db, "usuarios", currentUser.uid, "transacciones");
        const q = query(transactionsRef, orderBy("fecha", "desc"));
        const querySnapshot = await getDocs(q);
        const transactionsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          
          // Formatear fecha
          let fechaFormateada = "N/A";
          if (data.fecha) {
            if (data.fecha.toDate) {
              // Es un Firestore Timestamp
              const date = data.fecha.toDate();
              fechaFormateada = date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              });
            } else if (typeof data.fecha === 'string') {
              // Ya es un string
              fechaFormateada = data.fecha;
            }
          }
          
          const montoUSD = Number(data.montoUSD) || 0;
          const cuotapartes = Number(data.cuotapartes) || 0;
          const precioCuota = Number(data.precioCuota) || 0;
          
          // Calcular P&L: (cuotapartes * valor actual cuota) - monto invertido
          const valorActual = cuotapartes * currentValorCuota;
          const pyl = valorActual - montoUSD;
          
          return {
            id: doc.id,
            movimiento: data.tipo || "N/A",
            fecha: fechaFormateada,
            montoUSD: montoUSD,
            cuotapartes: cuotapartes,
            precioCuota: precioCuota,
            pyl: pyl
          };
        });
        
        if (isMounted) {
          setTransactions(transactionsData);
          console.log('Transactions loaded:', transactionsData.length, 'for user:', currentUser.displayName);
        }
      } catch (e) {
        console.error('Error fetching transactions:', e);
        if (isMounted) {
          setTransactions([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    
    fetchTransactions();
    
    return () => {
      isMounted = false;
    };
  }, [currentUser?.uid, currentUser?.displayName, currentValorCuota]);

  return { transactions, loading };
} 