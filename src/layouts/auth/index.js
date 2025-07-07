import React, { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from 'views/auth/login';

// Chakra imports
import { Box, useColorModeValue } from '@chakra-ui/react';

// Layout components
import { SidebarContext } from 'contexts/SidebarContext';

// Custom Chakra theme
export default function Auth() {
  // states and functionsimage.png
  const [toggleSidebar, setToggleSidebar] = useState(false);
  // functions for changing the states from components
  const getRoute = () => {
    return window.location.pathname !== '/auth/full-screen-maps';
  };
  const authBg = useColorModeValue('white', 'navy.900');
  document.documentElement.dir = 'ltr';
  
  const shouldRender = getRoute();
  
  return (
    <Box>
      <SidebarContext.Provider
        value={{
          toggleSidebar,
          setToggleSidebar,
        }}
      >
        <Box
          bg={authBg}
          float="right"
          minHeight="100vh"
          height="100%"
          position="relative"
          w="100%"
          transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
          transitionDuration=".2s, .2s, .35s"
          transitionProperty="top, bottom, width"
          transitionTimingFunction="linear, linear, ease"
        >
          {shouldRender ? (
            <Box mx="auto" minH="100vh">
              <Routes>
                <Route path="login" element={<Login />} />
                <Route path="*" element={<Navigate to="login" replace />} />
              </Routes>
            </Box>
          ) : (
            null
          )}
        </Box>
      </SidebarContext.Provider>
    </Box>
  );
}
