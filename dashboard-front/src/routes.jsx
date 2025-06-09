import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
} from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import NFTMarketplace from 'views/admin/marketplace';
import Profile from 'views/admin/profile';
import DataTables from 'views/admin/dataTables';
import RTL from 'views/admin/rtl';
import VerifyEmail from 'views/auth/VerifyEmail';
import InventoryOverview from 'views/admin/inventory'; // Add InventoryOverview import
import InventoryDetails from 'views/admin/inventoryDetails'; // Add InventoryOverview import

import Shop from 'views/Shop';
import Provider from 'views/Provider'
import Product from 'views/Product'
import PriorityPredict from 'views/Product/PriorityPredict'
// Auth Imports
import SignInCentered from 'views/auth/signIn';
import SignUp from './views/auth/signUp';

const routes = [
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },

  {
    name: 'Shop',
    layout: '/admin',
    path: '/shop',
    icon: <Icon as={MdOutlineShoppingCart} width="20px" height="20px" color="inherit" />,
    component: <Shop />,
    role: ['Admin', 'Demander'], 
  },
  {
    name: 'Profile',
    layout: '/admin',
    path: '/profile',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
  },
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    component: <SignInCentered />,
    exclude: true, // Add this property to exclude this route

  },
  {
    name: 'Sign Up',
    layout: '/auth',
    path: '/sign-up',
    component: <SignUp />,
    exclude: true,
  },


  {
    name: 'Inventory',
    layout: '/admin',
    path: '/inventory',
    icon: <Icon as={MdOutlineShoppingCart} width="20px" height="20px" color="inherit" />,
    component: <InventoryOverview />,
    role: ['Admin', 'Provider', 'Demander'],
  },

  {
    name: 'Priority Prediction',
    layout: '/admin',
    path: '/priority-predict',
    icon: <Icon as={MdOutlineShoppingCart} width="20px" height="20px" color="inherit" />,
    component: <PriorityPredict />,
    exclude: true,
  },

  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
    exclude: true, // Add this property to exclude this route
  },
  {
    name: 'Sign Up',
    layout: '/auth',
    path: '/sign-up',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignUp />,
    exclude: true, // Add this property to exclude this route
  },
  {
    name: 'RTL Admin',
    layout: '/rtl',
    path: '/rtl-default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <RTL />,
    exclude: true, // Add this property to exclude this route
  },
  {
    name: 'Verify Email',
    layout: '/auth',
    path: '/verify-email',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <VerifyEmail />,
    exclude: true, // Add this property to exclude this route
  },
  // Add Inventory Details Route
  {
    name: 'Provider List',
    layout: '/admin',
    path: '/provider-list',
    icon: (
      <Icon
        as={MdOutlineShoppingCart}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: <Provider />,
    role: ['Admin', 'Demander'],
  },
  {
    name: 'Products',
    layout: '/admin',
    path: '/provider-crud',
    icon: (
      <Icon
        as={MdOutlineShoppingCart}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: <Product />,
    role: ['Provider', 'Admin'],
  },

];

export default routes;
