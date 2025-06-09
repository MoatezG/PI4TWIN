// chakra imports
import { Box, Flex, Stack } from "@chakra-ui/react";
//   Custom components
import Brand from "components/sidebar/components/Brand";
import Links from "components/sidebar/components/Links";
import React from "react";

// FUNCTIONS

function SidebarContent(props) {
  const { routes } = props;

  // Filter out routes with the `exclude` property
  const filteredRoutes = routes.filter((route) => !route.exclude);

  return (
    <Flex direction="column" height="100%" pt="25px" px="16px" borderRadius="30px">
      <Brand />
      <Stack direction="column" mb="auto" mt="8px">
        <Box ps="20px" pe={{ md: "16px", "2xl": "1px" }}>
          <Links routes={filteredRoutes} />
        </Box>
      </Stack>

      <Box mt="60px" mb="40px" borderRadius="30px"></Box>
    </Flex>
  );
}

export default SidebarContent;
