import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdAccountBalance,
} from 'react-icons/md';

// Dashboard & Profile Imports (for all users)
import Dashboard from 'views/dashboard';
import Profile from 'views/profile';

// Admin Imports (admin only)
import DataTables from 'views/admin/dataTables';
import CuentasCorrientes from 'views/admin/cuentasCorrientes';

// Auth Imports
import SignInCentered from 'views/auth/login';

const routes = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <Dashboard />,
    roles: ['admin', 'user'],
  },
  {
    name: 'Profile',
    path: '/profile',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
    roles: ['admin', 'user'],
  },
  {
    name: 'Fondo',
    path: '/admin/data-tables',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    component: <DataTables />,
    roles: ['admin'],
  },
  {
    name: 'Cuentas Corrientes',
    path: '/admin/cc',
    icon: <Icon as={MdAccountBalance} width="20px" height="20px" color="inherit" />,
    component: <CuentasCorrientes />,
    roles: ['admin'],
  },
  {
    name: 'Login',
    path: '/auth/login',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
    public: true,
  },
];

export default routes;
