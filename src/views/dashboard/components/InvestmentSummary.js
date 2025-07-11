import { Flex, Text, Divider, useColorModeValue } from "@chakra-ui/react";
import Card from "components/card/Card";
import React from "react";
import { useCuotaparteData } from "hooks/useCuotaparteData";

export default function InvestmentSummary({ userCuotapartes = 0, totalInvested = 0 }) {
  const bg = useColorModeValue("white", "navy.800");
  const titleColor = useColorModeValue("secondaryGray.900", "white");
  const subtitleColor = useColorModeValue("secondaryGray.700", "secondaryGray.400");
  const valueColor = useColorModeValue("secondaryGray.900", "white");
  const dividerColor = useColorModeValue("gray.200", "whiteAlpha.200");

  // Obtener datos del contexto
  const { currentValorCuota, loading: loadingCuotaparte } = useCuotaparteData();
  if (loadingCuotaparte || currentValorCuota === undefined || currentValorCuota === null) {
    return <div style={{textAlign: 'center', padding: '2rem'}}><span>Cargando...</span></div>;
  }

  // Calcular valor bruto
  const valorBruto = userCuotapartes * currentValorCuota;

  // Calcular comisiones según la fórmula correcta: ((Cantidad cuotas * Ultimo valor Cuota) - Monto USD Total) * 0.15
  const comisiones = (valorBruto - totalInvested) * 0.15;

  // Calcular valor neto
  const valorNeto = valorBruto - comisiones;

  return (
    <Card w="100%" p={{ base: 4, md: 8 }} borderRadius="24px" bg={bg} minH="100%">
      <Text color={titleColor} fontWeight="700" fontSize="2xl" mb={2} textAlign="center">
        Inversión
      </Text>
      <Divider mb={4} borderColor={dividerColor} />
      <Flex direction="column" gap={3}>
        <Flex justify="space-between">
          <Text color={subtitleColor} fontWeight="500">Cuotas</Text>
          <Text color={valueColor}>{userCuotapartes.toFixed(2)}</Text>
        </Flex>
        <Flex justify="space-between">
          <Text color={subtitleColor} fontWeight="500">Valor Bruto</Text>
          <Text color={valueColor}>${valorBruto.toFixed(2)}</Text>
        </Flex>
        <Flex justify="space-between">
          <Text color={subtitleColor} fontWeight="500">Comisiones</Text>
          <Text color={valueColor}>${comisiones.toFixed(2)}</Text>
        </Flex>
        <Divider my={2} borderColor={dividerColor} />
        <Flex justify="space-between">
          <Text color={titleColor} fontWeight="700">Valor Neto</Text>
          <Text color={titleColor} fontWeight="700">${valorNeto.toFixed(2)}</Text>
        </Flex>
      </Flex>
    </Card>
  );
} 