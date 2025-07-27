import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { collection, query, orderBy, getDocs, limit } from "firebase/firestore";
import { db } from "../firebase";

const CuotaparteContext = createContext();

export function CuotaparteProvider({ children }) {
  const [cuotapartes, setCuotapartes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState(null);
  const [error, setError] = useState(null);

  // Cache duration: 5 minutes
  const CACHE_DURATION = 5 * 60 * 1000;

  const fetchCuotapartes = useCallback(async (forceRefresh = false) => {
    // Check if we have cached data and it's still valid
    if (!forceRefresh && cuotapartes.length > 0 && lastFetch && (Date.now() - lastFetch) < CACHE_DURATION) {
      return cuotapartes;
    }

    setLoading(true);
    setError(null);

    try {
      const cuotapartesRef = collection(db, "FCI", "Riesgo Alto", "cuotapartes");
      const q = query(cuotapartesRef, orderBy("fecha", "desc"), limit(50));
      const querySnapshot = await getDocs(q);
            
      const cuotapartesData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        // Formatear fecha
        let fechaFormateada = "N/A";
        let fechaObj;
        const meses = {
          'ene': 0, 'feb': 1, 'mar': 2, 'abr': 3, 'may': 4, 'jun': 5,
          'jul': 6, 'ago': 7, 'sept': 8, 'sep': 8, 'oct': 9, 'nov': 10, 'dic': 11
        };
        if (data.fecha) {
          if (data.fecha.toDate) {
            // Es un Firestore Timestamp
            fechaObj = data.fecha.toDate();
            fechaFormateada = fechaObj.toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            });
          } else if (typeof data.fecha === 'string') {
            // Parsear string tipo '31 mar 2024'
            const partes = data.fecha.split(' ');
            if (partes.length === 3) {
              const [dia, mesStr, anio] = partes;
              const mes = meses[mesStr.toLowerCase()];
              fechaObj = new Date(anio, mes, dia);
              fechaFormateada = fechaObj.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              });
            } else {
              fechaObj = new Date(data.fecha);
              fechaFormateada = data.fecha;
            }
          } else {
            fechaObj = new Date(data.fecha);
            fechaFormateada = data.fecha;
          }
        }
        // Parsear delta (puede venir como string con %)
        let deltaValue = 0;
        if (typeof data.delta === 'string') {
          // Si viene como "0.44%", mantener como 0.44 (porcentaje completo)
          deltaValue = parseFloat(data.delta.replace('%', '').replace(',', '.'));
        } else if (typeof data.delta === 'number') {
          deltaValue = data.delta;
        }
        return {
          id: doc.id,
          fecha: fechaFormateada,
          fechaOriginal: data.fecha,
          fechaObj,
          valor: Number(data.valor) || 0,
          delta: deltaValue,
          patrimonioTotal: Number(data.patrimonioTotal) || 0,
          comentarios: data.comentarios || ''
        };
      });
      
      setCuotapartes(cuotapartesData);
      setLastFetch(Date.now());
      return cuotapartesData;
    } catch (error) {
      console.error("Error fetching cuotapartes:", error);
      setError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [cuotapartes, lastFetch, CACHE_DURATION]);

  const getMonthlyProfits = () => {
    if (cuotapartes.length === 0) return [];
    // Group by month and calculate average delta for each month
    const monthlyData = {};
    const meses = {
      'ene': 0, 'feb': 1, 'mar': 2, 'abr': 3, 'may': 4, 'jun': 5,
      'jul': 6, 'ago': 7, 'sept': 8, 'sep': 8, 'oct': 9, 'nov': 10, 'dic': 11
    };
    cuotapartes.forEach(cuotaparte => {
      let date;
      if (cuotaparte.fechaOriginal) {
        if (cuotaparte.fechaOriginal.toDate) {
          date = cuotaparte.fechaOriginal.toDate();
        } else if (typeof cuotaparte.fechaOriginal === 'string') {
          const partes = cuotaparte.fechaOriginal.split(' ');
          if (partes.length === 3) {
            const [dia, mesStr, anio] = partes;
            const mes = meses[mesStr.toLowerCase()];
            date = new Date(anio, mes, dia);
          } else {
            date = new Date(cuotaparte.fechaOriginal);
          }
        } else {
          date = new Date(cuotaparte.fechaOriginal);
        }
      } else if (cuotaparte.fecha) {
        // Fallback por si acaso
        const partes = cuotaparte.fecha.split(' ');
        if (partes.length === 3) {
          const [dia, mesStr, anio] = partes;
          const mes = meses[mesStr.toLowerCase()];
          date = new Date(anio, mes, dia);
        } else {
          date = new Date(cuotaparte.fecha);
        }
      } else {
        return; // Skip if we can't parse the date
      }
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('es-ES', { month: 'long' });
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthName,
          deltas: [],
          count: 0
        };
      }
      monthlyData[monthKey].deltas.push(cuotaparte.delta);
      monthlyData[monthKey].count++;
    });
    // Calculate average delta for each month and sort by date
    const sortedMonths = Object.keys(monthlyData)
      .sort()
      .slice(-9); // Get last 9 months
    return sortedMonths.map(monthKey => {
      const monthData = monthlyData[monthKey];
      const avgDelta = monthData.deltas.reduce((sum, delta) => sum + delta, 0) / monthData.count;
      return {
        month: monthData.month,
        delta: avgDelta
      };
    });
  };

  const refreshData = () => {
    return fetchCuotapartes(true);
  };

  // Auto-fetch on mount
  useEffect(() => {
    fetchCuotapartes();
  }, [fetchCuotapartes]);

  const value = {
    cuotapartes,
    loading,
    error,
    fetchCuotapartes,
    refreshData,
    getMonthlyProfits
  };

  return (
    <CuotaparteContext.Provider value={value}>
      {children}
    </CuotaparteContext.Provider>
  );
}

export function useCuotaparte() {
  const context = useContext(CuotaparteContext);
  if (!context) {
    throw new Error('useCuotaparte must be used within a CuotaparteProvider');
  }
  return context;
} 