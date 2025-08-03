import { useState, useEffect, useRef } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase";

// Cache global para mantener los datos entre navegaciones
let globalCache = {
  transactions: [],
  lastFetch: null,
  isLoading: false
};

// Tiempo de expiración del caché (5 minutos)
const CACHE_EXPIRY_TIME = 5 * 60 * 1000;

export function useAllUserTransactions() {
  const [transactions, setTransactions] = useState(globalCache.transactions);
  const [loading, setLoading] = useState(globalCache.isLoading);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    async function fetchAllTransactions() {
      // Si ya hay datos en caché y no han expirado, usarlos
      const now = Date.now();
      if (globalCache.transactions.length > 0 && 
          globalCache.lastFetch && 
          (now - globalCache.lastFetch) < CACHE_EXPIRY_TIME) {
        setTransactions(globalCache.transactions);
        setLoading(false);
        return;
      }

      // Si ya se está cargando, no hacer otra petición
      if (globalCache.isLoading) {
        return;
      }

      try {
        globalCache.isLoading = true;
        setLoading(true);
        
        // Obtener todos los usuarios
        const usersSnapshot = await getDocs(collection(db, "usuarios"));
        const allTransactions = [];

        // Para cada usuario, obtener sus transacciones
        for (const userDoc of usersSnapshot.docs) {
          const userData = userDoc.data();
          const userId = userDoc.id;
          
          try {
            // Obtener transacciones del usuario
            const transactionsRef = collection(db, "usuarios", userId, "transacciones");
            const transactionsQuery = query(transactionsRef, orderBy("fecha", "desc"));
            const transactionsSnapshot = await getDocs(transactionsQuery);
            
            // Agregar información del usuario a cada transacción
            const userTransactions = transactionsSnapshot.docs.map(doc => {
              const transactionData = doc.data();
              
              // Formatear fecha
              let fechaFormateada = "N/A";
              let fechaOriginal = null;
              if (transactionData.fecha) {
                const fecha = transactionData.fecha?.toDate ? transactionData.fecha.toDate() : new Date(transactionData.fecha);
                fechaOriginal = fecha;
                fechaFormateada = fecha.toLocaleDateString('es-AR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                });
              }
              
              return {
                id: doc.id,
                userId: userId,
                usuario: userData.displayName || "Usuario sin nombre",
                email: userData.email || "Sin email",
                movimiento: transactionData.tipo || "N/A",
                fecha: fechaFormateada,
                fechaOriginal: fechaOriginal,
                cuotapartes: Number(transactionData.cuotapartes || 0).toLocaleString('es-AR'),
                montoUSD: `$${Number(transactionData.montoUSD || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                precioCuota: `$${Number(transactionData.precioCuota || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                // Solo incluir datos seguros para renderizar
                tipo: transactionData.tipo || "N/A",
              };
            });
            
            allTransactions.push(...userTransactions);
          } catch (error) {
            console.error(`Error fetching transactions for user ${userId}:`, error);
            // Continuar con el siguiente usuario
          }
        }
        
        // Ordenar todas las transacciones por fecha (más recientes primero)
        allTransactions.sort((a, b) => {
          const dateA = a.fechaOriginal ? new Date(a.fechaOriginal) : new Date(a.fecha);
          const dateB = b.fechaOriginal ? new Date(b.fechaOriginal) : new Date(b.fecha);
          return dateB - dateA;
        });
        
        // Actualizar caché global
        globalCache.transactions = allTransactions;
        globalCache.lastFetch = now;
        globalCache.isLoading = false;
        
        // Solo actualizar el estado si el componente sigue montado
        if (isMounted.current) {
          setTransactions(allTransactions);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching all transactions:", error);
        globalCache.isLoading = false;
        if (isMounted.current) {
          setTransactions([]);
          setLoading(false);
        }
      }
    }

    fetchAllTransactions();
  }, []);

  // Función para forzar la recarga de datos (útil para refrescar manualmente)
  const refreshData = () => {
    globalCache.lastFetch = null; // Invalidar caché
    globalCache.transactions = [];
    globalCache.isLoading = false;
    // El useEffect se ejecutará automáticamente
  };

  return { transactions, loading, refreshData };
} 