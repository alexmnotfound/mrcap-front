// Chakra imports
import {
  Box,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import LineChart from "components/charts/LineChart";
import React from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import { useUserTransactions } from "hooks/useUserTransactions";
import { useCuotaparteData } from "hooks/useCuotaparteData";

export default function AccumulatedPerformance(props) {
  const { ...rest } = props;
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const { transactions } = useUserTransactions();
  const { cuotasMensualesCierre } = useCuotaparteData();

  // 1. Encontrar la fecha de la primera transferencia
  const firstIngresoDate = React.useMemo(() => {
    const ingresos = transactions.filter(t => t.movimiento === 'Ingreso' && t.fecha);
    if (ingresos.length === 0) return null;
    const fechas = ingresos.map(t => new Date(t.fecha));
    const minDate = new Date(Math.min(...fechas.map(f => f.getTime())));
    return minDate;
  }, [transactions]);

  // 2. Procesar datos y calcular acumulado
  const { months, accumulatedReturns } = React.useMemo(() => {
    if (!firstIngresoDate || !cuotasMensualesCierre || cuotasMensualesCierre.length === 0) {
      return { months: ["Inicio"], accumulatedReturns: [0] };
    }
    let acc = 1;
    const months = [];
    const accumulatedReturns = [];
    const meses = {
      'ene': 0, 'feb': 1, 'mar': 2, 'abr': 3, 'may': 4, 'jun': 5,
      'jul': 6, 'ago': 7, 'sept': 8, 'sep': 8, 'oct': 9, 'nov': 10, 'dic': 11
    };
    cuotasMensualesCierre.forEach((c, i) => {
      let fechaObj;
      if (c.fechaOriginal && c.fechaOriginal.toDate) {
        fechaObj = c.fechaOriginal.toDate();
      } else if (typeof c.fecha === 'string') {
        // Parsear string tipo '31 mar 2024'
        const [dia, mesStr, anio] = c.fecha.split(' ');
        const mes = meses[mesStr.toLowerCase()];
        fechaObj = new Date(anio, mes, dia);
      } else {
        fechaObj = new Date(c.fecha);
      }
      const label = fechaObj.toLocaleString('default', { month: 'short' }).toUpperCase();
      let delta = c.delta;
      if (typeof delta === 'number' && isFinite(delta)) {
        // Los deltas ya vienen como porcentajes completos (ej: 0.44 = 0.44%)
        // Convertir a decimal dividiendo por 100
        delta = delta / 100;
      } else {
        delta = 0;
      }
      acc *= (1 + delta);
      const pct = Math.max(Math.min((acc - 1) * 100, 1000), -100);
      months.push(label);
      accumulatedReturns.push(Number(pct.toFixed(2)));
    });
    return { months, accumulatedReturns };
  }, [cuotasMensualesCierre, firstIngresoDate]);

  // Preparar datos para el gráfico
  const chartMonths = months;
  const chartReturns = accumulatedReturns;

   // Calcular min y max dinámicos para el eje Y
   const minY = Math.min(...chartReturns, 0);
   const maxY = Math.max(...chartReturns, 2);

  const lineChartData = [
    {
      name: "Rendimiento Acumulado",
      data: chartReturns,
    },
  ];
  const lineChartOptions = {
    chart: {
      toolbar: {
        show: true,
        tools: {
          zoom: true,
          zoomin: true,
          zoomout: true,
          reset: true,
          pan: true,
        },
      },
      zoom: {
        enabled: true,
        type: 'x',
        autoScaleYaxis: true,
      },
      height: 300,
    },
    colors: ["#22c55e"],
    markers: {
      size: 4,
    },
    xaxis: {
      categories: chartMonths,
      labels: {
        rotate: -30,
        rotateAlways: true,
        showDuplicates: true,
        trim: true,
        style: {
          colors: "#A3AED0",
          fontSize: "12px",
          fontWeight: "500",
        },
      },
      axisBorder: { show: true },
      axisTicks: { show: true },
    },
    yaxis: {
      min: minY,
      max: maxY,
      labels: {
        style: {
          colors: "#A3AED0",
          fontSize: "12px",
          fontWeight: "500",
        },
        formatter: val => `${val.toLocaleString('es-AR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}%`,
      },
    },
    grid: {
      borderColor: "rgba(163, 174, 208, 0.3)",
      show: true,
      yaxis: { lines: { show: true, opacity: 0.5 } },
      row: { opacity: 0.5 },
      xaxis: { lines: { show: false } },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", type: "line", width: 4 },
    legend: { show: false },
    tooltip: { theme: "dark" },
  };

  return (
    <Card justifyContent='center' align='left' direction='column' w='100%' mb='0px' {...rest}>
      <Text color={textColor} fontSize='xl' fontWeight='700' mb='4'>
        Rendimiento Acumulado
      </Text>
      <Flex w='100%' flexDirection={{ base: "column", lg: "row" }}>
        <Flex flexDirection='column' me='20px' mt='28px'>
          <Text
            color={textColor}
            fontSize='34px'
            textAlign='start'
            fontWeight='700'
            lineHeight='100%'>
            {accumulatedReturns.length > 0
              ? `${accumulatedReturns[accumulatedReturns.length - 1].toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
              : '--'}
          </Text>
          <Flex align='center' mb='20px'>
            <Text color='secondaryGray.600' fontSize='sm' fontWeight='500' mt='4px' me='12px'>
              Rendimiento
            </Text>
          </Flex>
          <Flex align='center'>
            <Icon as={IoCheckmarkCircle} color='green.500' me='4px' />
            <Text color='green.500' fontSize='md' fontWeight='700'>
              Vamo arriba
            </Text>
          </Flex>
        </Flex>
        <Box minH='300px' w='100%' overflowX='auto' mt='auto'>
          <LineChart
            chartData={lineChartData}
            chartOptions={lineChartOptions}
          />
        </Box>
      </Flex>
    </Card>
  );
}
