// Chakra imports
import { Box, SimpleGrid } from "@chakra-ui/react";
import CuotapartesTable from "views/admin/dataTables/components/CuotapartesTable";
import React from "react";
import { useCuotaparte } from "contexts/CuotaparteContext";

export default function Settings() {
  const { cuotapartes, loading: loadingCuotapartes } = useCuotaparte();

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        mb='20px'
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: "20px", xl: "20px" }}>
        <CuotapartesTable 
          tableData={cuotapartes} 
          loading={loadingCuotapartes} 
        />
      </SimpleGrid>
    </Box>
  );
}
