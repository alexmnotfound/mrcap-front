// Chakra imports
import { Box, SimpleGrid, Button, Flex, Text } from "@chakra-ui/react";
import MovementsTable from "views/admin/dataTables/components/MovementsTable";
import React from "react";
import { useAllUserTransactions } from "hooks/useAllUserTransactions";
import { Icon } from "@chakra-ui/react";
import { MdRefresh } from "react-icons/md";

export default function CuentasCorrientes() {
  const { transactions, loading: loadingTransactions, refreshData } = useAllUserTransactions();

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Flex justify="space-between" align="center" mb="20px">
        <Text fontSize="xl" fontWeight="bold" color="gray.700">
          Cuentas Corrientes - Movimientos de Usuarios
        </Text>
        <Button
          leftIcon={<Icon as={MdRefresh} />}
          colorScheme="blue"
          variant="outline"
          onClick={refreshData}
          isLoading={loadingTransactions}
          loadingText="Actualizando..."
        >
          Actualizar Datos
        </Button>
      </Flex>
      
      <SimpleGrid
        mb='20px'
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: "20px", xl: "20px" }}>
        <MovementsTable
          tableData={transactions}
          loading={loadingTransactions}
        />
      </SimpleGrid>
    </Box>
  );
} 