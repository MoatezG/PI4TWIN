import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  VStack, 
  Heading, 
  Button, 
  Spinner, 
  useToast, 
  Box, 
  Text, 
  Divider,
  HStack,
  Badge,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';

const OrderPayment = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  // Verify token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError("Authentication required. Please log in.");
      toast({
        title: "Authentication Error",
        description: "You need to log in to access this page",
        status: "error",
        duration: 5000,
        isClosable: true
      });
      setTimeout(() => navigate('/auth/sign-in'), 3000);
    }
  }, [navigate, toast]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return; // Don't make the request if no token
        
        const res = await axios.get(`http://localhost:5000/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrder(res.data);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Could not load order details. Please make sure you're logged in.");
        
        toast({
          title: "Error",
          description: "Could not load order details. Please make sure you're logged in.",
          status: "error",
          duration: 3000,
          isClosable: true
        });
        
        // Check if it's an auth error
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token'); // Clear invalid token
          setTimeout(() => navigate('/auth/sign-in'), 3000);
        } else {
          // For other errors, just go back to shop
          setTimeout(() => navigate('/admin/shop'), 3000);
        }
      }
    };
    
    fetchOrder();
  }, [id, toast, navigate]);

  const handleStripePayment = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication required");
      }
      
      const response = await axios.post(`http://localhost:5000/api/payment/create-checkout-session`, {
        orderId: id,
        products: order.items.map(item => ({
          name: item.product.name,
          price: item.price,
          quantity: item.quantity
        }))
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Redirect to Stripe checkout
      window.location.href = response.data.url;
    } catch (err) {
      console.error("Payment error:", err);
      setLoading(false);
      
      toast({
        title: "Payment error",
        description: err.response?.data?.error || "Could not start payment session.",
        status: "error",
        duration: 3000,
        isClosable: true
      });
      
      if (err.response && err.response.status === 401) {
        setTimeout(() => navigate('/auth/sign-in'), 2000);
      }
    }
  };

  const handleCancel = () => {
    navigate('/admin/shop');
  };

  // If there's an error, show error state
  if (error) {
    return (
      <VStack p={10} spacing={6}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Box>
            <AlertTitle>Authentication Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Box>
        </Alert>
        <Button colorScheme="blue" onClick={() => navigate('/admin/shop')}>
          Back to Shop
        </Button>
      </VStack>
    );
  }

  // If still loading, show spinner
  if (!order) return (
    <VStack p={10} spacing={4}>
      <Spinner size="xl" />
      <Text>Loading order details...</Text>
    </VStack>
  );

  return (
    <VStack p={6} spacing={6} align="stretch" maxW="600px" mx="auto">
      <Heading size="lg">Order Payment</Heading>
      <Divider />
      
      <Box borderWidth="1px" borderRadius="lg" p={4}>
        <Heading size="md" mb={4}>Order #{order._id}</Heading>
        
        {order.items.map((item, index) => (
          <HStack key={index} justify="space-between" mb={2}>
            <Text>{item.product.name} x {item.quantity}</Text>
            <Text>${(item.price * item.quantity).toFixed(2)}</Text>
          </HStack>
        ))}
        
        <Divider my={3} />
        
        <HStack justify="space-between">
          <Text fontWeight="bold">Total:</Text>
          <Text fontWeight="bold">${order.totalPrice.toFixed(2)}</Text>
        </HStack>
        
        <Text mt={2}>
          Status: <Badge colorScheme={order.isPaid ? "green" : "yellow"}>{order.isPaid ? "Paid" : "Pending Payment"}</Badge>
        </Text>
      </Box>
      
      <HStack spacing={4} justify="center">
        <Button colorScheme="blue" onClick={handleCancel}>
          Back to Shop
        </Button>
        <Button 
          colorScheme="green" 
          onClick={handleStripePayment} 
          isLoading={loading}
          isDisabled={order.isPaid}
        >
          {order.isPaid ? "Already Paid" : "Pay Now"}
        </Button>
      </HStack>
    </VStack>
  );
};

export default OrderPayment;
