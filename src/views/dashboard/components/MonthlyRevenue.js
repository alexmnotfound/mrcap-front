// Chakra imports
import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  Spinner,
  Center,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import BarChart from "components/charts/BarChart";
import React, { useMemo } from "react";
import { useCuotaparte } from "contexts/CuotaparteContext";

export default function MonthlyRevenue(props) {
  const { ...rest } = props;
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const { getMonthlyProfits, loading } = useCuotaparte();

  const chartData = useMemo(() => {
    const monthlyData = getMonthlyProfits();
    
    if (monthlyData.length === 0) {
      return [{
        name: "Ganancia %",
        data: []
      }];
    }

    return [{
      name: "Ganancia %",
      data: monthlyData.map(item => item.delta)
    }];
  }, [getMonthlyProfits]);

  const chartOptions = useMemo(() => {
    const monthlyData = getMonthlyProfits();
    
    return {
      chart: {
        type: 'bar',
        toolbar: { show: false },
      },
      xaxis: {
        categories: monthlyData.map(item => item.month),
        labels: {
          style: {
            colors: "#A3AED0",
            fontSize: "14px",
            fontWeight: "700",
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          show: true,
          style: {
            colors: "#A3AED0",
            fontSize: "14px",
            fontWeight: "700",
          },
          formatter: (val) => `${val.toFixed(2)}%`,
        },
      },
      grid: {
        borderColor: "rgba(163, 174, 208, 0.3)",
        show: true,
        yaxis: { lines: { show: true, opacity: 0.5 } },
        row: { opacity: 0.5 },
        xaxis: { lines: { show: false } },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => `${val.toFixed(2)}%`,
        style: {
          fontSize: '14px',
          fontWeight: '700',
          colors: ["#22c55e"]
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 8,
          columnWidth: "40px",
          distributed: true,
        },
      },
      colors: ["#22c55e"],
      tooltip: {
        enabled: true,
        y: {
          formatter: (val) => `${val.toFixed(2)}%`,
        },
        theme: "dark",
      },
      legend: { show: false },
    };
  }, [getMonthlyProfits]);

  if (loading) {
    return (
      <Card align='center' direction='column' w='100%' {...rest}>
        <Flex align='center' w='100%' px='15px' py='10px'>
          <Text
            me='auto'
            color={textColor}
            fontSize='xl'
            fontWeight='700'
            lineHeight='100%'>
            Rendimientos Mensuales
          </Text>
        </Flex>
        <Center h='260px'>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Center>
      </Card>
    );
  }

  return (
    <Card align='center' direction='column' w='100%' {...rest}>
      <Flex align='center' w='100%' px='15px' py='10px'>
        <Text
          me='auto'
          color={textColor}
          fontSize='xl'
          fontWeight='700'
          lineHeight='100%'>
          Rendimientos Mensuales
        </Text>
      </Flex>
      <Box h='260px' mt='auto'>
        <BarChart
          chartData={chartData}
          chartOptions={chartOptions}
        />
      </Box>
    </Card>
  );
}
