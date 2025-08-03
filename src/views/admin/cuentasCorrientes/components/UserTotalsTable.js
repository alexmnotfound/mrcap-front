import React from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

export default function UserTotalsTable({ transactions }) {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const [sorting, setSorting] = React.useState([]);

  const columnHelper = createColumnHelper();

  // Calcular totales por usuario
  const userTotals = React.useMemo(() => {
    const totals = {};
    
    transactions.forEach(transaction => {
      const userId = transaction.userId;
      const userName = transaction.usuario;
      const userEmail = transaction.email;
      
      if (!totals[userId]) {
        totals[userId] = {
          userId,
          userName,
          userEmail,
          totalUSD: 0,
          totalCuotapartes: 0,
          transactionCount: 0,
        };
      }
      
      // Sumar montos (convertir de string a número)
      // El montoUSD ya viene formateado como "$2.600,00", necesitamos parsearlo correctamente
      let montoUSD = 0;
      if (transaction.montoUSD) {
        // Remover el símbolo $ y convertir formato argentino (2.600,00 -> 2600.00)
        const montoString = transaction.montoUSD.replace('$', '').replace(/\./g, '').replace(',', '.');
        montoUSD = parseFloat(montoString) || 0;
      }
      
      // Las cuotapartes vienen como "164,61", convertir a número
      let cuotapartes = 0;
      if (transaction.cuotapartes) {
        const cuotapartesString = transaction.cuotapartes.replace(/\./g, '').replace(',', '.');
        cuotapartes = parseFloat(cuotapartesString) || 0;
      }
      
      totals[userId].totalUSD += montoUSD;
      totals[userId].totalCuotapartes += cuotapartes;
      totals[userId].transactionCount += 1;
    });
    
    // Convertir a array
    return Object.values(totals);
  }, [transactions]);

  const columns = [
    columnHelper.accessor('userName', {
      id: 'userName',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          USUARIO
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('userEmail', {
      id: 'userEmail',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          EMAIL
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="500">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('totalUSD', {
      id: 'totalUSD',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          TOTAL USD
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          ${info.getValue().toLocaleString('es-AR', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          })}
        </Text>
      ),
    }),
    columnHelper.accessor('totalCuotapartes', {
      id: 'totalCuotapartes',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          TOTAL CUOTAPARTES
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue().toLocaleString('es-AR')}
        </Text>
      ),
    }),
    columnHelper.accessor('transactionCount', {
      id: 'transactionCount',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          MOVIMIENTOS
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue()}
        </Text>
      ),
    }),
  ];

  const table = useReactTable({
    data: userTotals,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  if (!transactions || transactions.length === 0) {
    return null;
  }

  return (
    <Card p="20px" mb="20px">
      <Text fontSize="lg" fontWeight="700" mb="20px">
        Totales por Usuario
      </Text>
      <Box overflowX="auto">
        <Table variant="simple" color="gray.500" mb="24px">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th
                    key={header.id}
                    pe="10px"
                    borderColor={borderColor}
                    cursor="pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <Flex
                      justifyContent="space-between"
                      align="center"
                      fontSize={{ sm: '10px', lg: '12px' }}
                      color="gray.400"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td
                    key={cell.id}
                    fontSize={{ sm: '14px' }}
                    minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                    borderColor="transparent"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Card>
  );
} 