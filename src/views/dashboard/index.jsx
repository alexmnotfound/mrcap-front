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
} from "@chakra-ui/react";
// Assets
import Usa from "assets/img/dashboards/usa.png";
// Custom components
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React, { useMemo } from "react";
import {
  MdAttachMoney,
  MdBarChart,
  MdOutlineFolder
} from "react-icons/md";
import PieCard from "views/dashboard/components/PieCard";
import MonthlyRevenue from "views/dashboard/components/MonthlyRevenue";
import InvestmentSummary from "views/dashboard/components/InvestmentSummary";
import AccumulatedPerformance from "views/dashboard/components/AccumulatedPerformance";
import UserTransactionsTable from "views/dashboard/components/UserTransactionsTable";
import UserImpersonation from "views/dashboard/components/UserImpersonation";
import { useCuotaparteData } from "hooks/useCuotaparteData";
import { useUserTransactions } from "hooks/useUserTransactions";

export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  
  // Use cuotaparte data from context
  const { 
    currentValorCuota, 
    averageAnnualReturn, 
    monthlyTrend,
    loading: loadingCuotaparte
  } = useCuotaparteData();
  const { transactions, loading: loadingTransacciones } = useUserTransactions();

  // Formatear transacciones para la tabla
  const formattedTransactions = useMemo(() => {
    return transactions.map(transaction => ({
      ...transaction,
      montoUSD: transaction.montoUSD.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      cuotapartes: transaction.cuotapartes.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      precioCuota: transaction.precioCuota.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      pyl: transaction.pyl.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    }));
  }, [transactions]);

  // Calculate user's cuotapartes from transactions (ingresos - egresos)
  const userCuotapartes = transactions.reduce((sum, transaction) => {
    if (transaction.movimiento === 'Ingreso') {
      return sum + transaction.cuotapartes;
    } else if (transaction.movimiento === 'Egreso') {
      return sum - transaction.cuotapartes;
    }
    return sum;
  }, 0);

  // Calculate current balance: user's cuotapartes * current cuota value
  const currentBalance = userCuotapartes * currentValorCuota;

  // Calculate total invested (sum of all USD amounts)
  const totalInvested = transactions.reduce((sum, transaction) => {
    return sum + transaction.montoUSD;
  }, 0);

  // Calculate profits: current balance - total invested
  const profits = currentBalance - totalInvested;

  // Apply 15% commission to profits using the correct formula: ((Cantidad cuotas * Ultimo valor Cuota) - Monto USD Total) * 0.15
  const commission = profits * 0.15;
  const profitsAfterCommission = profits - commission;

  // Calculate net balance (value after commission)
  const netBalance = currentBalance - commission;

  if (loadingCuotaparte || loadingTransacciones) {
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
      <UserImpersonation />
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
          name='Balance'
          value={`$${netBalance.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        />
        <MiniStatistics 
          growth={`${monthlyTrend >= 0 ? '+' : ''}${monthlyTrend.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`} 
          name='Ganancias' 
          value={`$${profitsAfterCommission.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
        />
        <MiniStatistics name='Total Invertido' value={`$${totalInvested.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
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
          name='Cuotapartes'
          value={userCuotapartes.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                <Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />
              }
            />
          }
          name='Promedio Mensual Fondo (12 meses)'
          value={`${averageAnnualReturn.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`}
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
        <AccumulatedPerformance />
        <MonthlyRevenue />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
        {loadingTransacciones ? (
          <Center h="200px">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </Center>
        ) : (
          <UserTransactionsTable transactions={formattedTransactions} originalTransactions={transactions} />
        )}
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
          <PieCard />
          <InvestmentSummary userCuotapartes={userCuotapartes} totalInvested={totalInvested} />
        </SimpleGrid>
      </SimpleGrid>
    </Box>
  );
}
