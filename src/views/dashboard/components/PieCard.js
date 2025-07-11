// Chakra imports
import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import PieChart from "components/charts/PieChart";
import { pieChartData, pieChartOptions } from "variables/charts";
import { VSeparator } from "components/separator/Separator";
import React from "react";

export default function Conversion(props) {
  const { ...rest } = props;

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardColor = useColorModeValue("white", "navy.700");
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );
  return (
    <Card p='20px' align='center' direction='column' w='100%' {...rest}>
      <Flex
        justifyContent='center'
        align='left'
        direction='column'
        w='100%'
        mb='0px'
        {...rest}>
        <Text color={textColor} fontWeight="700" fontSize="2xl" mb={2} textAlign="center">
          Distribución de Activos
        </Text>
      </Flex>

      <PieChart
        h='100%'
        w='100%'
        chartData={pieChartData}
        chartOptions={pieChartOptions}
      />
      <Card
        bg={cardColor}
        flexDirection='row'
        boxShadow={cardShadow}
        w='100%'
        p='15px'
        px='20px'
        mt='15px'
        mx='auto'>
        <Flex w='100%' justify='space-between'>
          {/* Líquido */}
          <Flex direction='column' align='center' flex='1'>
            <Flex align='center'>
              <Box h='8px' w='8px' bg='#4CAF50' borderRadius='50%' me='4px' />
              <Text fontSize='xs' color='secondaryGray.600' fontWeight='700' mb='5px'>Líquido</Text>
            </Flex>
            <Text fontSize='lg' color={textColor} fontWeight='700'>10%</Text>
          </Flex>
          <VSeparator mx={{ base: '10px', xl: '10px', '2xl': '10px' }} />
          {/* Earn */}
          <Flex direction='column' align='center' flex='1'>
            <Flex align='center'>
              <Box h='8px' w='8px' bg='#FFC107' borderRadius='50%' me='4px' />
              <Text fontSize='xs' color='secondaryGray.600' fontWeight='700' mb='5px'>Earn</Text>
            </Flex>
            <Text fontSize='lg' color={textColor} fontWeight='700'>20%</Text>
          </Flex>
          <VSeparator mx={{ base: '10px', xl: '10px', '2xl': '10px' }} />
          {/* Índices */}
          <Flex direction='column' align='center' flex='1'>
            <Flex align='center'>
              <Box h='8px' w='8px' bg='#FF9800' borderRadius='50%' me='4px' />
              <Text fontSize='xs' color='secondaryGray.600' fontWeight='700' mb='5px'>Índices</Text>
            </Flex>
            <Text fontSize='lg' color={textColor} fontWeight='700'>20%</Text>
          </Flex>
          <VSeparator mx={{ base: '10px', xl: '10px', '2xl': '10px' }} />
          {/* Acciones */}
          <Flex direction='column' align='center' flex='1'>
            <Flex align='center'>
              <Box h='8px' w='8px' bg='#F44336' borderRadius='50%' me='4px' />
              <Text fontSize='xs' color='secondaryGray.600' fontWeight='700' mb='5px'>Acciones</Text>
            </Flex>
            <Text fontSize='lg' color={textColor} fontWeight='700'>20%</Text>
          </Flex>
          <VSeparator mx={{ base: '10px', xl: '10px', '2xl': '10px' }} />
          {/* Crypto */}
          <Flex direction='column' align='center' flex='1'>
            <Flex align='center'>
              <Box h='8px' w='8px' bg='#2196F3' borderRadius='50%' me='4px' />
              <Text fontSize='xs' color='secondaryGray.600' fontWeight='700' mb='5px'>Crypto</Text>
            </Flex>
            <Text fontSize='lg' color={textColor} fontWeight='700'>30%</Text>
          </Flex>
        </Flex>
      </Card>
    </Card>
  );
}
