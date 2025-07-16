import { useMemo } from 'react';
import { useCuotaparte } from 'contexts/CuotaparteContext';

export const useCuotaparteData = () => {
  const { cuotapartes, loading, error, refreshData } = useCuotaparte();

  const latestCuotaparte = useMemo(() => {
    if (cuotapartes.length === 0) return null;
    return cuotapartes[0]; // Already sorted by date desc
  }, [cuotapartes]);

  const averageAnnualReturn = useMemo(() => {
    if (cuotapartes.length === 0) return 0;

    const last12Months = cuotapartes.slice(0, 365); // Aproximadamente 12 meses

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

  const currentValorCuota = useMemo(() => {
    if (cuotapartes.length === 0) return 0;

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
  }, [latestCuotaparte, cuotapartes.length]);

  const monthlyTrend = useMemo(() => {
    if (cuotapartes.length === 0) return 0;

    const lastValidDelta = cuotapartes.find(item =>
      item.delta !== null &&
      item.delta !== undefined &&
      item.delta !== 0 &&
      !isNaN(item.delta)
    );

    return lastValidDelta?.delta || 0;
  }, [cuotapartes]);

  const cuotasMensualesCierre = useMemo(() => {
    if (!cuotapartes || cuotapartes.length === 0) return [];

    const map = {};
    const meses = {
      'ene': 0, 'feb': 1, 'mar': 2, 'abr': 3, 'may': 4, 'jun': 5,
      'jul': 6, 'ago': 7, 'sept': 8, 'sep': 8, 'oct': 9, 'nov': 10, 'dic': 11
    };

    cuotapartes.forEach(item => {
      let date;
      if (item.fechaOriginal && item.fechaOriginal.toDate) {
        date = item.fechaOriginal.toDate();
      } else if (typeof item.fecha === 'string') {
        const partes = item.fecha.split(' ');
        if (partes.length === 3) {
          const [dia, mesStr, anio] = partes;
          const mes = meses[mesStr.toLowerCase()];
          date = new Date(anio, mes, dia);
        } else {
          date = new Date(item.fecha);
        }
      } else {
        date = new Date(item.fecha);
      }
      
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!map[key] || date > new Date(map[key].fecha)) {
        map[key] = { ...item, fechaObj: date };
      }
    });

    return Object.values(map).sort((a, b) => a.fechaObj - b.fechaObj);
  }, [cuotapartes]);

  return {
    cuotapartes,
    cuotasMensualesCierre,
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
