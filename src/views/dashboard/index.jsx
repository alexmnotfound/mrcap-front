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
import React, { useState, useEffect } from "react";
import {
  MdAttachMoney,
  MdBarChart,
  MdOutlineFolder
} from "react-icons/md";
import PieCard from "views/dashboard/components/PieCard";
import MonthlyRevenue from "views/dashboard/components/MonthlyRevenue";
import InvestmentSummary from "views/dashboard/components/InvestmentSummary";
import ColumnsTable from "views/admin/dataTables/components/ColumnsTable";
import { columnsDataColumns } from "views/admin/dataTables/variables/columnsData";
import ImpersonateTest from "views/dashboard/components/ImpersonateTest";
import { useAuth } from "contexts/AuthContext";
import { useCuotaparteData } from "hooks/useCuotaparteData";
import { useUserTransactions } from "hooks/useUserTransactions";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Use cuotaparte data from context
  const { 
    currentValorCuota, 
    averageAnnualReturn, 
    monthlyTrend,
    loading: loadingCuotaparte
  } = useCuotaparteData();
  const { loading: loadingTransacciones } = useUserTransactions();

  // Leer transacciones de Firestore
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!currentUser?.uid) {
        setLoading(false);
        return;
      }

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
          
          return {
            id: doc.id,
            movimiento: data.tipo || "N/A",
            fecha: fechaFormateada,
            montoUSD: Number(data.montoUSD) || 0,
            cuotapartes: Number(data.cuotapartes) || 0,
            precioCuota: Number(data.precioCuota) || 0,
            pyl: Number(data.pl) || 0
          };
        });
        
        setTransactions(transactionsData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentUser?.uid]);

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

  if (loading || loadingCuotaparte || loadingTransacciones) {
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
      {currentUser?.role === "admin" && <ImpersonateTest />}
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
        gap='20px'
        mb='20px'>
        <MiniStatistics 
          growth={`${monthlyTrend >= 0 ? '+' : ''}${monthlyTrend.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`} 
          name='Ganancias' 
          value={`$${profitsAfterCommission.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
        />
        <MiniStatistics name='Total Invertido' value={`$${totalInvested.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
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
        {/* <AccumulatedPerformance /> */}
        <MonthlyRevenue />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
        {loading ? (
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
          <ColumnsTable columnsData={columnsDataColumns} tableData={transactions} />
        )}
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
          <PieCard />
          <InvestmentSummary userCuotapartes={userCuotapartes} totalInvested={totalInvested} />
        </SimpleGrid>
      </SimpleGrid>
    </Box>
  );
}
