import { useMemo } from 'react';
import { useCuotaparte } from 'contexts/CuotaparteContext';

export const useCuotaparteData = () => {
  const { cuotapartes, loading, error, refreshData } = useCuotaparte();

  const latestCuotaparte = useMemo(() => {
    if (cuotapartes.length === 0) return null;
    return cuotapartes[0]; // Already sorted by date desc
  }, [cuotapartes]);

  // Calcular promedio anual de los últimos 12 meses
  const averageAnnualReturn = useMemo(() => {
    if (cuotapartes.length === 0) return 0;
    
    // Tomar los últimos 12 meses de datos
    const last12Months = cuotapartes.slice(0, 365); // Aproximadamente 12 meses
    
    // Filtrar solo registros con delta válido
    const validDeltas = last12Months.filter(item => 
      item.delta !== null && 
      item.delta !== undefined && 
      item.delta !== 0 && 
      !isNaN(item.delta)
    );
    
    if (validDeltas.length === 0) return 0;
    
    const totalDelta = validDeltas.reduce((sum, item) => sum + item.delta, 0);
    return totalDelta / validDeltas.length;
  }, [cuotapartes]);

  // Obtener el último valor de cuota (último registro con valor válido)
  const currentValorCuota = useMemo(() => {
    if (cuotapartes.length === 0) return 0;
    
    // Buscar el primer registro con valor válido
    const validCuotaparte = cuotapartes.find(item => 
      item.valor !== null && 
      item.valor !== undefined && 
      item.valor !== 0 && 
      !isNaN(item.valor)
    );
    
    return validCuotaparte?.valor || 0;
  }, [cuotapartes]);

  const totalPatrimonio = useMemo(() => {
    if (cuotapartes.length === 0) return 0;
    return latestCuotaparte?.patrimonioTotal || 0;
  }, [latestCuotaparte]);

  const monthlyTrend = useMemo(() => {
    if (cuotapartes.length === 0) return 0;
    
    // Obtener el último delta válido de la última cuota
    const lastValidDelta = cuotapartes.find(item => 
      item.delta !== null && 
      item.delta !== undefined && 
      item.delta !== 0 && 
      !isNaN(item.delta)
    );
    
    return lastValidDelta?.delta || 0;
  }, [cuotapartes]);

  return {
    cuotapartes,
    loading,
    error,
    refreshData,
    latestCuotaparte,
    averageAnnualReturn,
    totalPatrimonio,
    currentValorCuota,
    monthlyTrend
  };
}; 