import React from "react";
import { Image, useColorModeValue, Flex } from "@chakra-ui/react";

// Custom components
// import { HorizonLogo } from "components/icons/Icons";
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  //   Chakra color mode
  // let logoColor = useColorModeValue("navy.700", "white");
  const logoSrc = useColorModeValue("/mrcap-light.png", "/mrcap-dark.png");

  return (
    <Flex align='center' direction='column'>
      <Image src={logoSrc} alt="My Logo" height="150px" />
      <HSeparator mb='20px' />
    </Flex>
  );
}

export default SidebarBrand;
