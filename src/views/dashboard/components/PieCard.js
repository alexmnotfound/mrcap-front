// Chakra imports
import { Box, Flex, Text, useColorModeValue, Divider, Wrap, WrapItem } from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import PieChart from "components/charts/PieChart";
import { pieChartData, pieChartOptions } from "variables/charts";
import React from "react";

export default function PieCard(props) {
  const { ...rest } = props;

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const subtitleColor = useColorModeValue("secondaryGray.600", "secondaryGray.400");
  const cardColor = useColorModeValue("white", "navy.700");
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );
  const dividerColor = useColorModeValue("gray.200", "whiteAlpha.200");

  const legendItems = [
    { label: "Líquido", color: "#4CAF50", value: "10%" },
    { label: "Earn", color: "#FFC107", value: "20%" },
    { label: "Índices", color: "#FF9800", value: "20%" },
    { label: "Acciones", color: "#F44336", value: "20%" },
    { label: "Crypto", color: "#2196F3", value: "30%" },
  ];

  return (
    <Card w="100%" p={{ base: 4, md: 8 }} borderRadius="24px" align="center" direction="column" {...rest}>
      {/* Title Section */}
      <Flex direction="column" w="100%" mb="20px">
        <Text color={textColor} fontWeight="700" fontSize="2xl" mb={2} textAlign="center">
          Distribución de Activos
        </Text>
        <Divider borderColor={dividerColor} />
      </Flex>

      {/* Pie Chart */}
      <PieChart chartData={pieChartData} chartOptions={pieChartOptions} />

      {/* Legend */}
      <Card
        bg={cardColor}
        flexDirection="column"
        boxShadow={cardShadow}
        w="100%"
        p="2px"
        px="auto"
        mt="2px"
        mx="auto"
      >
        <Wrap spacing={{ base: 4, md: 6 }} justify="space-between" w="100%">
          {legendItems.map((item, index) => (
            <WrapItem key={index} flex="1 1 120px" justifyContent="center">
              <Flex direction="column" align="center">
                <Flex align="center" mb="5px">
                  <Box h="8px" w="8px" bg={item.color} borderRadius="50%" me="4px" />
                  <Text fontSize="xs" color={subtitleColor} fontWeight="700">
                    {item.label}
                  </Text>
                </Flex>
                <Text fontSize="lg" color={textColor} fontWeight="700">
                  {item.value}
                </Text>
              </Flex>
            </WrapItem>
          ))}
        </Wrap>
      </Card>
    </Card>
  );
}
