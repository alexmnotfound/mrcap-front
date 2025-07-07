import React from "react";
import { Box, Flex, Text, Switch, useColorModeValue } from "@chakra-ui/react";
import Card from "components/card/Card.js";

export default function Notifications(props) {
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
  return (
    <Card h={props.h} p='20px' align='center' direction='column' w='100%' {...props}>
      <Flex direction="column" align="center" w="100%" mb="30px">
        <Text color={textColorPrimary} fontSize="xl" fontWeight="700" mb="10px" textAlign="center">
          Notificaciones
        </Text>
        <Text color={textColorSecondary} fontSize="md" mb="20px" textAlign="center">
          Gestioná tus preferencias de alertas y novedades.
        </Text>
        <Box w="100%">
          <Flex align="center" justify="space-between" mb="20px">
            <Text color={textColorPrimary} fontSize="md" textAlign="left">
              Recibir novedades
            </Text>
            <Switch colorScheme="brand" defaultChecked />
          </Flex>
          <Flex align="center" justify="space-between" mb="20px">
            <Text color={textColorPrimary} fontSize="md" textAlign="left">
              Alertas mensuales
            </Text>
            <Switch colorScheme="brand" />
          </Flex>
        </Box>
      </Flex>
    </Card>
  );
}
