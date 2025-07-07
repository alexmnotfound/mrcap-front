import React from "react";
import { useAuth } from "contexts/AuthContext";
import { Button, Box, Text } from "@chakra-ui/react";

export default function ImpersonateTest() {
  const { currentUser, realUser, impersonate, stopImpersonate, isImpersonating, mockUsers } = useAuth();

  if (!currentUser) return <Text>No user logged in</Text>;

  return (
    <Box p={4}>
      <Text mb={2}>Logged in as: <b>{realUser?.name}</b> ({realUser?.role})</Text>
      {isImpersonating && (
        <Box mb={2}>
          <Text color="orange.400">Impersonating: <b>{currentUser.name}</b></Text>
          <Button size="sm" colorScheme="orange" onClick={stopImpersonate} mt={1}>
            Stop Impersonating
          </Button>
        </Box>
      )}
      <Text fontWeight="bold" mb={2}>Impersonate another user:</Text>
      {(Array.isArray(mockUsers) ? mockUsers : []).filter(u => u.id !== realUser.id).map(user => (
        <Button
          key={user.id}
          size="sm"
          colorScheme="blue"
          onClick={() => impersonate(user.id)}
          mr={2}
          mb={2}
        >
          {user.name} ({user.role})
        </Button>
      ))}
    </Box>
  );
} 