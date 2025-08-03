import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
  Spinner,
  Center,
  Text,
} from "@chakra-ui/react";
// Assets
import Usa from "assets/img/dashboards/usa.png";
// Custom components
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React from "react";
import {
  MdAttachMoney,
  MdBarChart,
  MdOutlineFolder,
  MdTrendingUp,
  MdPeople,
  MdAccountBalance,
} from "react-icons/md";
import PieCard from "views/dashboard/components/PieCard";
import MonthlyRevenue from "views/dashboard/components/MonthlyRevenue";
import AccumulatedPerformance from "views/dashboard/components/AccumulatedPerformance";
import CuotapartesTable from "views/admin/dataTables/components/CuotapartesTable";
import { useCuotaparteData } from "hooks/useCuotaparteData";
import { useAllUserTransactions } from "hooks/useAllUserTransactions";

export default function FondoDashboard() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const textColor = useColorModeValue("gray.700", "white");
  
  // Use cuotaparte data from context
  const { 
    currentValorCuota, 
    monthlyTrend,
    totalPatrimonio,
    cuotapartes,
    loading: loadingCuotaparte
  } = useCuotaparteData();
  
  const { transactions, loading: loadingTransactions } = useAllUserTransactions();

  // Calcular métricas del fondo
  const fondoMetrics = React.useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        totalInvertido: 0,
        totalCuotapartes: 0,
        totalComisiones: 0,
        totalInversores: 0,
        gananciasBrutas: 0,
        gananciasNetas: 0
      };
    }

    // Agrupar por usuario para contar inversores únicos
    const usuariosUnicos = new Set(transactions.map(t => t.userId));
    
    // Calcular totales usando los valores originales de Firestore
    // Los datos vienen formateados como strings, necesitamos los valores numéricos
    const totalInvertido = transactions.reduce((sum, t) => {
      // Extraer el valor numérico del string formateado "$1.234,56"
      const montoString = t.montoUSD.replace('$', '').replace(/\./g, '').replace(',', '.');
      const monto = parseFloat(montoString) || 0;
      return sum + monto;
    }, 0);

    const totalCuotapartes = transactions.reduce((sum, t) => {
      // Extraer el valor numérico del string formateado "1.234,56"
      const cuotapartesString = t.cuotapartes.replace(/\./g, '').replace(',', '.');
      const cuotapartes = parseFloat(cuotapartesString) || 0;
      return sum + cuotapartes;
    }, 0);

    const totalBruto = totalCuotapartes * currentValorCuota;
    const gananciasBrutas = totalBruto - totalInvertido;
    const totalComisiones = gananciasBrutas * 0.15;
    const gananciasNetas = gananciasBrutas * 0.85;

    return {
      totalInvertido,
      totalCuotapartes,
      totalComisiones,
      totalInversores: usuariosUnicos.size,
      gananciasBrutas,
      gananciasNetas
    };
  }, [transactions, currentValorCuota]);

  if (loadingCuotaparte || loadingTransactions) {
    return (
      <Center h="400px">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Center>
    );
  }

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Text fontSize="2xl" fontWeight="700" mb="20px" color={textColor}>
        Dashboard del Fondo
      </Text>
      
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
        gap='20px'
        mb='20px'>
        <MiniStatistics
          endContent={
            <Flex me='-16px' mt='10px'>
              <FormLabel htmlFor='balance'>
                <Avatar src={Usa} />
              </FormLabel>
              <Select
                id='balance'
                variant='mini'
                mt='5px'
                me='0px'
                defaultValue='usd'>
                <option value='usd'>USD</option>
              </Select>
            </Flex>
          }
          name='Patrimonio Total'
          value={`$${totalPatrimonio.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        />
        <MiniStatistics 
          growth={`${monthlyTrend >= 0 ? '+' : ''}${monthlyTrend.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`} 
          name='Rendimiento Mensual' 
          value={`${monthlyTrend.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`} 
        />
        <MiniStatistics 
          name='Total Invertido' 
          value={`$${fondoMetrics.totalInvertido.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdOutlineFolder} color={brandColor} />
              }
            />
          }
          name='Total Cuotapartes'
          value={fondoMetrics.totalCuotapartes.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name='Valor Cuota'
          value={`$${currentValorCuota.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdPeople} color={brandColor} />
              }
            />
          }
          name='Total Inversores'
          value={fondoMetrics.totalInversores.toString()}
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
        <AccumulatedPerformance />
        <MonthlyRevenue />
      </SimpleGrid>
      
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
        <CuotapartesTable 
          tableData={cuotapartes}
          loading={loadingCuotaparte} 
        />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
          <PieCard />
          <Box>
            <Text fontSize="lg" fontWeight="700" mb="15px">
              Resumen del Fondo
            </Text>
            <SimpleGrid columns={1} gap="10px">
              <MiniStatistics
                startContent={
                  <IconBox
                    w='40px'
                    h='40px'
                    bg={boxBg}
                    icon={
                      <Icon w='20px' h='20px' as={MdTrendingUp} color="green.500" />
                    }
                  />
                }
                name='Ganancias Brutas'
                value={`$${fondoMetrics.gananciasBrutas.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              />
              <MiniStatistics
                startContent={
                  <IconBox
                    w='40px'
                    h='40px'
                    bg={boxBg}
                    icon={
                      <Icon w='20px' h='20px' as={MdAccountBalance} color="orange.500" />
                    }
                  />
                }
                name='Comisiones (15%)'
                value={`$${fondoMetrics.totalComisiones.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              />
              <MiniStatistics
                startContent={
                  <IconBox
                    w='40px'
                    h='40px'
                    bg={boxBg}
                    icon={
                      <Icon w='20px' h='20px' as={MdBarChart} color="blue.500" />
                    }
                  />
                }
                name='Ganancias Netas'
                value={`$${fondoMetrics.gananciasNetas.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              />
            </SimpleGrid>
          </Box>
        </SimpleGrid>
      </SimpleGrid>
    </Box>
  );
}
