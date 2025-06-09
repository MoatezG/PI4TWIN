// File: src/views/payment/StripeCheckout.jsx
import React from 'react';
import { Box, Button, Heading, VStack, useToast } from '@chakra-ui/react';
import axios from 'axios';

const StripeCheckout = () => {
  const toast = useToast();

  const handlePayment = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/payment/create-checkout-session', {
        orderId: "order_123",
        products: [
          { name: "Tomatoes", price: 300, quantity: 2 },
          { name: "Milk", price: 150, quantity: 1 }
        ]
      });

      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      toast({
        title: "Payment failed.",
        description: "Unable to initiate payment session.",
        status: "error",
        duration: 4000,
        isClosable: true
      });
    }
  };

  return (
    <VStack spacing={6} p={10}>
      <Heading>Stripe Test Payment</Heading>
      <Button colorScheme="blue" size="lg" onClick={handlePayment}>
        Pay with Stripe
      </Button>
    </VStack>
  );
};

export default StripeCheckout;
