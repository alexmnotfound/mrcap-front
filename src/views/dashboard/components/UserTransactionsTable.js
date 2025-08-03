import {
  Flex,
  Box,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import * as React from 'react';
import Card from 'components/card/Card';

export default function UserTransactionsTable({ transactions, originalTransactions }) {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  return (
    <Card>
      <Flex
        px="25px"
        py="15px"
        mb="20px"
        justifyContent="space-between"
        align="center"
      >
        <Text
          color={textColor}
          fontSize="lg"
          fontWeight="700"
          lineHeight="100%"
        >
          Movimientos
        </Text>
      </Flex>
      <Box overflowX="auto">
        <Table variant="simple" color="gray.500" mb="24px">
          <Thead>
            <Tr>
              <Th borderColor={borderColor} textTransform="capitalize" fontSize="sm" fontWeight="700">
                MOV.
              </Th>
              <Th borderColor={borderColor} textTransform="capitalize" fontSize="sm" fontWeight="700">
                FECHA
              </Th>
              <Th borderColor={borderColor} textTransform="capitalize" fontSize="sm" fontWeight="700">
                $ MONTO USD
              </Th>
              <Th borderColor={borderColor} textTransform="capitalize" fontSize="sm" fontWeight="700">
                CUOTAPARTES
              </Th>
              <Th borderColor={borderColor} textTransform="capitalize" fontSize="sm" fontWeight="700">
                $ PRECIO CUOTA
              </Th>
              <Th borderColor={borderColor} textTransform="capitalize" fontSize="sm" fontWeight="700">
                $ P&L
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions.map((transaction, index) => {
              const originalTransaction = originalTransactions[index];
              return (
              <Tr key={transaction.id || index}>
                <Td borderColor={borderColor} fontSize="sm" fontWeight="700">
                  <Text
                    color={transaction.movimiento === 'Ingreso' ? 'green.500' : 'red.500'}
                  >
                    {transaction.movimiento}
                  </Text>
                </Td>
                <Td borderColor={borderColor} fontSize="sm" fontWeight="700">
                  {transaction.fecha}
                </Td>
                <Td borderColor={borderColor} fontSize="sm" fontWeight="700">
                  ${transaction.montoUSD}
                </Td>
                <Td borderColor={borderColor} fontSize="sm" fontWeight="700">
                  {transaction.cuotapartes}
                </Td>
                <Td borderColor={borderColor} fontSize="sm" fontWeight="700">
                  ${transaction.precioCuota}
                </Td>
                <Td borderColor={borderColor} fontSize="sm" fontWeight="700">
                  <Text
                    color={originalTransaction.pyl >= 0 ? 'green.500' : 'red.500'}
                  >
                    ${transaction.pyl}
                  </Text>
                </Td>
              </Tr>
            );
            })}
          </Tbody>
        </Table>
      </Box>
    </Card>
  );
} 