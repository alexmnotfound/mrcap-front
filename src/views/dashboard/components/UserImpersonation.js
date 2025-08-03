import React, { useState, useEffect } from "react";
import { useAuth } from "contexts/AuthContext";
import { 
  Button, 
  Box, 
  Text, 
  Select, 
  Flex, 
  Badge, 
  useToast,
  Card,
  CardBody,
  Spinner,
  Center
} from "@chakra-ui/react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";

export default function UserImpersonation() {
  const { 
    currentUser, 
    realUser, 
    impersonate, 
    stopImpersonate, 
    isImpersonating 
  } = useAuth();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const toast = useToast();

  // Obtener lista de usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      if (realUser?.role !== 'admin') return;
      
      try {
        setLoading(true);
        const usersSnapshot = await getDocs(collection(db, "usuarios"));
        const usersList = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })).filter(user => user.id !== realUser?.uid); // Excluir al admin actual
        
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los usuarios",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [realUser?.role, realUser?.uid, toast]);

  const handleImpersonate = async () => {
    if (!selectedUserId) {
      toast({
        title: "Error",
        description: "Selecciona un usuario para impersonar",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const result = await impersonate(selectedUserId);
    if (result.success) {
      toast({
        title: "Impersonación exitosa",
        description: `Ahora estás viendo el dashboard de ${currentUser?.displayName}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error",
        description: result.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleStopImpersonate = () => {
    stopImpersonate();
    setSelectedUserId("");
    toast({
      title: "Impersonación terminada",
      description: "Has vuelto a tu cuenta de administrador",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  // Solo mostrar para admins
  if (realUser?.role !== 'admin') {
    return null;
  }

  return (
    <Card mb="20px">
      <CardBody>
        <Text fontSize="lg" fontWeight="700" mb="15px">
          Impersonación de Usuarios
        </Text>
        
        <Text mb="2" fontSize="sm" color="gray.600">
          Logeado como: <b>{realUser?.displayName}</b> ({realUser?.role})
        </Text>
        
        {isImpersonating && (
          <Box mb="3" p="3" bg="orange.50" borderRadius="md" border="1px solid" borderColor="orange.200">
            <Text color="orange.600" fontWeight="600" mb="1">
              ⚠️ Impersonando: <b>{currentUser?.displayName}</b> ({currentUser?.email})
            </Text>
            <Button size="sm" colorScheme="orange" onClick={handleStopImpersonate}>
              Detener Impersonación
            </Button>
          </Box>
        )}

        {!isImpersonating && (
          <Box>
            <Text fontWeight="600" mb="2">
              Seleccionar usuario para impersonar:
            </Text>
            
            {loading ? (
              <Center py="4">
                <Spinner size="sm" />
              </Center>
            ) : (
              <Flex gap="3" align="end">
                <Box flex="1">
                  <Select
                    placeholder="Seleccionar usuario..."
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    size="sm"
                  >
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.displayName} ({user.email}) - {user.role || 'user'}
                      </option>
                    ))}
                  </Select>
                </Box>
                <Button
                  colorScheme="blue"
                  onClick={handleImpersonate}
                  isDisabled={!selectedUserId}
                  size="sm"
                >
                  Impersonar Usuario
                </Button>
              </Flex>
            )}
            
            <Text fontSize="xs" color="gray.500" mt="2">
              * Solo puedes impersonar usuarios para ver sus dashboards
            </Text>
          </Box>
        )}
      </CardBody>
    </Card>
  );
} 