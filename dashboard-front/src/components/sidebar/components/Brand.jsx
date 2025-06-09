import React from "react";

// Chakra imports
import { Flex, useColorModeValue } from "@chakra-ui/react";

// Custom components
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align='center' direction='column'>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/9608e51125036e00b54b726246b7d0a3e97104af121c03f7f0c8f2688fe72328?placeholderIfAbsent=true&apiKey=3f5214a6ea9f4f1683a0e4ee385ff9c5"
        alt="Logo"
        style={{ height: '70px', width: 'auto', margin: '32px 0' }}
      />
      <HSeparator mb='20px' />
    </Flex>
  );
}

export default SidebarBrand;
