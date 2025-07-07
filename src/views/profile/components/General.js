// Chakra imports
import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React from "react";

export default function General(props) {
  const {
    h,
    investmentProfile,
    birthday,
    email,
  } = props;
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
  return (
    <Card h={h} p='20px' align='center' direction='column' w='100%'>
      <Text color={textColorPrimary} fontWeight='700' fontSize='xl' mb='10px' textAlign='center'>
        Información General
      </Text>
      <Text color={textColorSecondary} fontSize='md' mb='20px' textAlign='center'>
        Datos principales de tu perfil de inversión.
      </Text>
      <Flex w='100%' direction={{ base: 'column', md: 'row' }} gap='20px'>
        <Box flex='1' bg={useColorModeValue("white", "navy.700")} borderRadius='16px' p='16px' boxShadow='sm'>
          <Text color={textColorSecondary} fontSize='sm' mb='4px'>Perfil</Text>
          <Text color={textColorPrimary} fontWeight='500'>{investmentProfile}</Text>
        </Box>
        <Box flex='1' bg={useColorModeValue("white", "navy.700")} borderRadius='16px' p='16px' boxShadow='sm'>
          <Text color={textColorSecondary} fontSize='sm' mb='4px'>Cumpleaños</Text>
          <Text color={textColorPrimary} fontWeight='500'>{birthday}</Text>
        </Box>
        <Box flex='1' bg={useColorModeValue("white", "navy.700")} borderRadius='16px' p='16px' boxShadow='sm'>
          <Text color={textColorSecondary} fontSize='sm' mb='4px'>Email</Text>
          <Text color={textColorPrimary} fontWeight='500'>{email}</Text>
        </Box>
      </Flex>
    </Card>
  );
}
