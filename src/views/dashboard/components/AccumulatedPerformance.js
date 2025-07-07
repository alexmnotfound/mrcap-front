// Chakra imports
import {
  Box,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import LineChart from "components/charts/LineChart";
import React from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import { useUserTransactions } from "hooks/useUserTransactions";
import { useCuotaparteData } from "hooks/useCuotaparteData";

// MOCK profits por mes - keeping for potential future use
// eslint-disable-next-line no-unused-vars
const profitsData = [99.15, 127.03, 117.74, 154.92, 145.63, 164.40, 185.91, 217.88, 247.87, 278.86];
// eslint-disable-next-line no-unused-vars
const profitsMonths = ["Sep", "Oct", "Nov", "Dic", "Ene", "Feb", "Mar", "Abr", "May"];



export default function AccumulatedPerformance(props) {
  const { ...rest } = props;
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const { transactions } = useUserTransactions();
  const { cuotapartes } = useCuotaparteData();

  console.log('cuotapartes', cuotapartes);

  // 1. Encontrar el primer mes de ingreso del usuario
  const firstIngresoDate = React.useMemo(() => {
    const ingresos = transactions.filter(t => t.movimiento === 'Ingreso' && t.fecha);
    if (ingresos.length === 0) return null;
    // fecha puede ser string o Date
    const fechas = ingresos.map(t => new Date(t.fecha));
    return new Date(Math.min(...fechas.map(f => f.getTime())));
  }, [transactions]);

  // 2. Filtrar cuotapartes desde ese punto de partida (ascendente por fecha, solo con delta válido)
  const filteredCuotas = React.useMemo(() => {
    if (!firstIngresoDate || !cuotapartes || cuotapartes.length === 0) return [];
    return cuotapartes
      .map(item => ({
        ...item,
        fechaObj: new Date(item.fecha)
      }))
      .filter(item => item.fechaObj >= firstIngresoDate && typeof item.delta === 'number' && isFinite(item.delta) && Math.abs(item.delta) <= 100)
      .sort((a, b) => a.fechaObj - b.fechaObj);
  }, [cuotapartes, firstIngresoDate]);

  // 3. Calcular el rendimiento acumulado usando los delta
  const { months, accumulatedReturns } = React.useMemo(() => {
    if (!filteredCuotas || filteredCuotas.length === 0) return { months: ["Inicio"], accumulatedReturns: [0] };
    let acc = 1;
    const months = [];
    const accumulatedReturns = [];
    filteredCuotas.forEach((item, i) => {
      const label = item.fechaObj.toLocaleString('default', { month: 'short', year: '2-digit' });
      months.push(label);
      if (i === 0) {
        accumulatedReturns.push(0);
      } else {
        // Si el delta es mayor a 1, asumimos que está en porcentaje y lo pasamos a decimal
        let delta = item.delta;
        if (Math.abs(delta) > 1) delta = delta / 100;
        acc *= (1 + delta);
        let pct = (acc - 1) * 100;
        // Limitar a 1000% para evitar outliers visuales
        if (pct > 1000) pct = 1000;
        if (pct < -100) pct = -100;
        accumulatedReturns.push(Number(pct.toFixed(2)));
      }
    });
    return { months, accumulatedReturns };
  }, [filteredCuotas]);

  // 4. Preparar datos para el gráfico
  // DEBUG: log para ver los datos
  console.log('months', months);
  console.log('accumulatedReturns', accumulatedReturns);

  // Si hay menos de dos puntos, forzar dos puntos de ejemplo para que se vea la línea y el eje X
  let chartMonths = months;
  let chartReturns = accumulatedReturns;
  if (months.length < 2) {
    chartMonths = ["Inicio", "Actual"];
    chartReturns = [0, accumulatedReturns[0] ?? 0];
  }

  const lineChartData = [
    {
      name: "Rendimiento Acumulado",
      data: chartReturns.map(v => Number(v.toFixed(2))),
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
    xaxis: {
      categories: chartMonths,
      labels: {
        style: {
          colors: "#A3AED0",
          fontSize: "14px",
          fontWeight: "500",
        },
      },
      axisBorder: { show: true },
      axisTicks: { show: true },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#A3AED0",
          fontSize: "14px",
          fontWeight: "500",
        },
        formatter: val => `${val.toFixed(2)}%`,
      },
      min: 0,
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
    <Card
      justifyContent='center'
      align='left'
      direction='column'
      w='100%'
      mb='0px'
      {...rest}>
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
            {accumulatedReturns.length > 0 ? `${accumulatedReturns[accumulatedReturns.length - 1].toFixed(2)}%` : '--'}
          </Text>
          <Flex align='center' mb='20px'>
            <Text
              color='secondaryGray.600'
              fontSize='sm'
              fontWeight='500'
              mt='4px'
              me='12px'>
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
        <Box minH='260px' minW='75%' mt='auto'>
          <LineChart
            chartData={lineChartData}
            chartOptions={lineChartOptions}
          />
        </Box>
      </Flex>
    </Card>
  );
} 