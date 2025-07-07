// Chakra imports
import { Box, SimpleGrid, Flex, Text, Badge } from "@chakra-ui/react";

// Custom components
import Banner from "views/profile/components/Banner";
import General from "views/profile/components/General";
import Notifications from "views/profile/components/Notifications";

// Assets
import React from "react";
import { useAuth } from "contexts/AuthContext";

// Mock data
const banner = "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/profile-banner.png";
const avatar = "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/avatars/avatar4.png";

export default function Profile() {
  const { currentUser } = useAuth();
  const name = currentUser?.displayName || "";
  const email = currentUser?.email || "";
  const role = currentUser?.role || "";
  const investmentProfile = currentUser?.investmentProfile || "";
  const birthday = currentUser?.birthday || "";

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Banner
        banner={banner}
        avatar={avatar}
        name={name}
      />
      {role === "admin" && (
        <Flex align="center" mt={2} mb={2} gap={4}>
          <Text fontSize="lg" fontWeight="bold">{email}</Text>
          <Badge colorScheme="purple" fontSize="1em">ADMIN</Badge>
        </Flex>
      )}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing="20px" mt="20px">
        <General h="100%"
          investmentProfile={investmentProfile}
          birthday={birthday}
          email={email}
        />
        <Notifications h="100%" />
      </SimpleGrid>
    </Box>
  );
}
