import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import "./styles.css";
import './assets/css/App.css';
import initialTheme from './theme/theme';


// Layouts
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import RTLLayout from './layouts/rtl';
import LandingPageLayout from './components/LandingPage/LandingPageLayout';

// Views
import InventoryOverview from './views/admin/inventory';
import InventoryDetails from './views/admin/inventoryDetails';
import StripeCheckout from './views/payment/StripeCheckout';
import OrderDetails from './views/orders/OrderDetails';         // ✅ Nouvelle page
import OrderPayment from './views/payment/OrderPayment';       // ✅ Nouvelle page
import OrderSuccess from './views/payment/OrderSuccess';       // ✅ Nouvelle page


function App() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  return (
    <ChakraProvider theme={currentTheme}>
      <BrowserRouter>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPageLayout />} />

          {/* Admin Dashboard */}
          <Route
            path="admin/*"
            element={<AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />}
          />

          {/* Auth */}
          <Route path="auth/*" element={<AuthLayout />} />

          {/* RTL */}
          <Route
            path="rtl/*"
            element={<RTLLayout theme={currentTheme} setTheme={setCurrentTheme} />}
          />

          {/* Payment Test (ancienne page Stripe directe) */}
          <Route path="/payment" element={<StripeCheckout />} />

          {/* ✅ Détails d'une commande */}
          <Route path="/orders/:id" element={<OrderDetails />} />

          {/* ✅ Paiement lié à une commande */}
          <Route path="/payment/:id" element={<OrderPayment />} />

          {/* Order success page with receipt */}
          <Route path="/order-success" element={<OrderSuccess />} />

          {/* Redirections after payment */}
          <Route path="/order-cancelled" element={<Navigate to="/admin/shop?payment_canceled=true" replace />} />

          {/* Redirection routes inconnues */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
