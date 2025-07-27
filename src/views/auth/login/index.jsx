/* eslint-disable */

import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import DefaultAuth from "layouts/auth/Default";
import illustration from "assets/img/auth/banner-vertical-mr.png";
import { FcGoogle } from "react-icons/fc";
import { HSeparator } from "components/separator/Separator";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { useAuth } from "contexts/AuthContext";
import { validateLoginForm } from "utils/validation";

function getFirebaseErrorMessage(error) {
  if (!error) return null;
  
  // Mensajes genéricos que no exponen información del sistema
  if (typeof error !== "string") return "Ocurrió un error inesperado.";
  
  // Solo mostrar mensajes específicos para errores de usuario
  if (error.includes("auth/invalid-credential") || 
      error.includes("auth/user-not-found") || 
      error.includes("auth/wrong-password")) {
    return "Email o contraseña incorrectos.";
  }
  
  if (error.includes("auth/too-many-requests")) {
    return "Demasiados intentos. Intenta más tarde.";
  }
  
  if (error.includes("auth/user-disabled")) {
    return "Tu cuenta ha sido deshabilitada. Contacta al administrador.";
  }
  
  if (error.includes("auth/network-request-failed")) {
    return "Error de conexión. Verifica tu internet.";
  }
  
  // Para cualquier otro error, mostrar mensaje genérico
  return "Error de autenticación. Intenta de nuevo.";
}

function SignIn() {
  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const googleBg = useColorModeValue("secondaryGray.300", "whiteAlpha.200");
  const googleText = useColorModeValue("navy.700", "white");
  const googleHover = useColorModeValue(
    { bg: "gray.200" },
    { bg: "whiteAlpha.300" }
  );
  const googleActive = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.200" }
  );
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  // Auth logic
  const { login, loginWithGoogle, currentUser } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validar formulario antes de enviar
    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }
    
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) {
      setError(result.message || "Credenciales incorrectas");
    }
  };

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w='100%'
        mx={{ base: "auto", lg: "0px" }}
        me='auto'
        h='100%'
        alignItems='start'
        justifyContent='center'
        mb={{ base: "30px", md: "60px" }}
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "14vh" }}
        flexDirection='column'>
        <Box me='auto'>
          <Heading color={textColor} fontSize='36px' mb='10px'>
            Iniciar sesión
          </Heading>
          <Text
            mb='36px'
            ms='4px'
            color={textColorSecondary}
            fontWeight='400'
            fontSize='md'>
            Ingresá tu email y contraseña para acceder
          </Text>
        </Box>
        <Flex
          zIndex='2'
          direction='column'
          w={{ base: "100%", md: "420px" }}
          maxW='100%'
          background='transparent'
          borderRadius='15px'
          mx={{ base: "auto", lg: "unset" }}
          me='auto'
          mb={{ base: "20px", md: "auto" }}>
          <Button
            fontSize='sm'
            me='0px'
            mb='26px'
            py='15px'
            h='50px'
            borderRadius='16px'
            bg={googleBg}
            color={googleText}
            fontWeight='500'
            _hover={googleHover}
            _active={googleActive}
            _focus={googleActive}
            onClick={async (e) => {
              e.preventDefault();
              setError("");
              setLoading(true);
              const result = await loginWithGoogle();
              setLoading(false);
              if (!result.success) {
                setError(result.message || "Error con Google Auth");
              }
            }}
            isLoading={loading}
            loadingText='Ingresando...'
          >
            <Icon as={FcGoogle} w='20px' h='20px' me='10px' />
            Ingresar con Google
          </Button>
          <Flex align='center' mb='25px'>
            <HSeparator />
            <Text color='gray.400' mx='14px'>
              o
            </Text>
            <HSeparator />
          </Flex>
          <form onSubmit={handleSubmit}>
            <FormControl>
              <FormLabel
                htmlFor='login-email'
                display='flex'
                ms='4px'
                fontSize='sm'
                fontWeight='500'
                color={textColor}
                mb='8px'>
                Email<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                id='login-email'
                isRequired={true}
                variant='auth'
                fontSize='sm'
                type='email'
                placeholder='mail@ejemplo.com'
                mb='24px'
                fontWeight='500'
                size='lg'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <FormLabel
                htmlFor='login-password'
                ms='4px'
                fontSize='sm'
                fontWeight='500'
                color={textColor}
                display='flex'>
                Contraseña<Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size='md'>
                <Input
                  id='login-password'
                  isRequired={true}
                  fontSize='sm'
                  placeholder='Min. 8 caracteres'
                  mb='24px'
                  size='lg'
                  type={show ? "text" : "password"}
                  variant='auth'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <InputRightElement display='flex' alignItems='center' mt='4px'>
                  <Icon
                    color={textColorSecondary}
                    _hover={{ cursor: "pointer" }}
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={handleClick}
                  />
                </InputRightElement>
              </InputGroup>
              {error && (
                <Text color="red.400" fontSize="sm" mb="8px">{getFirebaseErrorMessage(error)}</Text>
              )}
              <Flex justifyContent='space-between' align='center' mb='24px'>
                <FormControl display='flex' alignItems='center'>
                  <Checkbox
                    id='remember-login'
                    colorScheme='brandScheme'
                    me='10px'
                    disabled={loading}
                  />
                  <FormLabel
                    htmlFor='remember-login'
                    mb='0'
                    fontWeight='normal'
                    color={textColor}
                    fontSize='sm'>
                    Mantener sesión iniciada
                  </FormLabel>
                </FormControl>
              </Flex>
              <Button
                fontSize='sm'
                variant='brand'
                fontWeight='500'
                w='100%'
                h='50px'
                mb='24px'
                type='submit'
                isLoading={loading}
                loadingText='Ingresando...'>
                Ingresar
              </Button>
            </FormControl>
          </form>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;
