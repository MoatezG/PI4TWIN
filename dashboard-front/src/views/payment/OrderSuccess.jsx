import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  List,
  ListItem,
  Flex,
  Badge,
  useToast
} from '@chakra-ui/react';
import { FaFilePdf, FaArrowLeft } from 'react-icons/fa';
import { openOrderReceipt, saveOrderReceipt } from '../../services/pdfService';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  // Get the order ID from URL parameters
  const orderId = searchParams.get('orderId');

  // Fetch order details on component mount
  useEffect(() => {
    if (!orderId) {
      setError("No order ID provided");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setOrder(response.data);
        console.log("Order data fetched:", response.data);
        
        // Automatically generate PDF receipt
        setTimeout(() => {
          try {
            console.log("Auto-generating PDF receipt with order:", response.data);
            openOrderReceipt(response.data, response.data.items);
            console.log("PDF auto-generation completed");
          } catch (error) {
            console.error("Error auto-generating PDF:", error);
            toast({
              title: "PDF Generation Error",
              description: "There was an error generating the PDF receipt automatically. Please use the View Receipt button.",
              status: "error",
              duration: 5000,
              isClosable: true
            });
          }
        }, 1000);
      } catch (error) {
        console.error("Error fetching order:", error);
        setError("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, toast]);

  // Handle manual PDF generation
  const handleGenerateReceipt = () => {
    if (!order) {
      console.error("Cannot generate receipt: order is null");
      toast({
        title: "Error",
        description: "Cannot generate receipt: order data is missing",
        status: "error",
        duration: 3000,
        isClosable: true
      });
      return;
    }
    
    try {
      console.log("Generating receipt with order:", order);
      console.log("Order items:", order.items);
      openOrderReceipt(order, order.items);
      console.log("Receipt generation completed");
      toast({
        title: "Success",
        description: "Receipt opened in a new tab",
        status: "success",
        duration: 3000,
        isClosable: true
      });
    } catch (error) {
      console.error("Error generating receipt:", error);
      toast({
        title: "Error",
        description: "Failed to generate receipt. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    }
  };

  // Handle PDF download
  const handleDownloadReceipt = () => {
    if (!order) {
      console.error("Cannot download receipt: order is null");
      toast({
        title: "Error",
        description: "Cannot download receipt: order data is missing",
        status: "error",
        duration: 3000,
        isClosable: true
      });
      return;
    }
    
    try {
      console.log("Downloading receipt with order:", order);
      console.log("Order items:", order.items);
      saveOrderReceipt(order, order.items);
      console.log("Receipt download initiated");
      toast({
        title: "Success",
        description: "Receipt download started",
        status: "success",
        duration: 3000,
        isClosable: true
      });
    } catch (error) {
      console.error("Error downloading receipt:", error);
      toast({
        title: "Error",
        description: "Failed to download receipt. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    }
  };

  // Handle return to shop
  const handleReturnToShop = () => {
    navigate('/admin/shop');
  };

  if (loading) {
    return (
      <VStack p={10} spacing={4}>
        <Spinner size="xl" />
        <Text>Processing your order...</Text>
      </VStack>
    );
  }

  if (error) {
    return (
      <Box p={6}>
        <Alert status="error">
          <AlertIcon />
          <Box>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Box>
        </Alert>
        <Button mt={4} leftIcon={<FaArrowLeft />} onClick={handleReturnToShop}>
          Return to Shop
        </Button>
      </Box>
    );
  }

  if (!order) {
    return (
      <Box p={6}>
        <Alert status="warning">
          <AlertIcon />
          <Box>
            <AlertTitle>Order Not Found</AlertTitle>
            <AlertDescription>
              We couldn't find your order details. Please check your order history.
            </AlertDescription>
          </Box>
        </Alert>
        <Button mt={4} leftIcon={<FaArrowLeft />} onClick={handleReturnToShop}>
          Return to Shop
        </Button>
      </Box>
    );
  }

  return (
    <Box p={6} maxW="800px" mx="auto">
      <Alert status="success" mb={6} borderRadius="md">
        <AlertIcon />
        <Box>
          <AlertTitle>Payment Successful!</AlertTitle>
          <AlertDescription>
            Your order has been confirmed and is being processed.
          </AlertDescription>
        </Box>
      </Alert>

      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg">Order Summary</Heading>
          <Text color="gray.600">Order ID: {order._id}</Text>
          <Text color="gray.600">Order Date: {new Date(order.orderDate).toLocaleString()}</Text>
          <Badge colorScheme={order.isPaid ? "green" : "yellow"} fontSize="0.9em" p={1} borderRadius="md">
            {order.isPaid ? "Paid" : "Payment Pending"}
          </Badge>
        </Box>

        <Divider />

        <Box>
          <Heading size="md" mb={3}>Items</Heading>
          <List spacing={3}>
            {order.items.map((item, index) => (
              <ListItem key={index}>
                <Flex justify="space-between">
                  <Text>
                    {item.product?.name || 'Unknown Item'} x {item.quantity}
                  </Text>
                  <Text fontWeight="bold">
                    ${((item.price || 0) * item.quantity).toFixed(2)}
                  </Text>
                </Flex>
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider />

        <Flex justify="space-between">
          <Text fontSize="lg">Total:</Text>
          <Text fontSize="lg" fontWeight="bold">${order.totalPrice.toFixed(2)}</Text>
        </Flex>

        <Box>
          <Heading size="md" mb={3}>Shipping Address</Heading>
          <Text>{order.address}</Text>
        </Box>

        <Flex gap={4} mt={4}>
          <Button leftIcon={<FaFilePdf />} colorScheme="blue" onClick={handleGenerateReceipt}>
            View Receipt
          </Button>
          <Button leftIcon={<FaFilePdf />} variant="outline" onClick={handleDownloadReceipt}>
            Download Receipt
          </Button>
          <Button leftIcon={<FaArrowLeft />} onClick={handleReturnToShop}>
            Return to Shop
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
};

export default OrderSuccess; 