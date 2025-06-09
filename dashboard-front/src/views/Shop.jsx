import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Card,
  CardBody,
  Image,
  Text,
  Button,
  Input,
  Flex,
  Heading,
  useToast,
  Badge,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Center,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  CloseButton,
} from '@chakra-ui/react';
import { FaShoppingCart, FaImage } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState('');
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState(null);

  // Check URL params for payment status
  useEffect(() => {
    const paymentSuccess = searchParams.get('payment_success');
    const paymentCanceled = searchParams.get('payment_canceled');
    const orderId = searchParams.get('orderId');

    if (paymentSuccess === 'true') {
      setPaymentStatus({
        type: 'success',
        message: `Payment successful! Your order #${orderId} has been confirmed.`,
      });
      // Clear URL parameters
      navigate('/admin/shop', { replace: true });
    } else if (paymentCanceled === 'true') {
      setPaymentStatus({
        type: 'warning',
        message: 'Payment was canceled. Your cart items are still available.',
      });
      // Clear URL parameters
      navigate('/admin/shop', { replace: true });
    }
  }, [searchParams, navigate]);

  const fetchProducts = useCallback(async () => {
    try {
      console.log("Fetching latest product data...");
      const response = await axios.get('http://localhost:5000/api/products', {
        // Add cache-busting parameter to prevent browser caching
        params: { _t: new Date().getTime() }
      });
      console.log("Product data received:", response.data);

      // Check for changes in quantities
      if (products.length > 0) {
        response.data.forEach(newProduct => {
          const existingProduct = products.find(p => p._id === newProduct._id);
          if (existingProduct && existingProduct.quantity !== newProduct.quantity) {
            console.log(`Product ${newProduct.name} quantity changed: ${existingProduct.quantity} -> ${newProduct.quantity}`);
          }
        });
      }

      setProducts(response.data);

      setSelectedQuantities(prev => {
        const initialQuantities = {...prev};
        response.data.forEach(product => {
          if (!initialQuantities[product._id]) {
            initialQuantities[product._id] = 1;
          }
        });
        return initialQuantities;
      });
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast({
        title: 'Error',
        description: 'Failed to fetch products',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast, products]);

  useEffect(() => {
    fetchProducts();

    // Check authentication status
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("No token found, user might need to login");
      // We don't redirect here to allow browsing the shop,
      // but will enforce auth check when trying to checkout
    }
  }, [fetchProducts]);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Auto-refreshing product data...");
      fetchProducts();
    }, 1000);

    return () => clearInterval(interval);
  }, [fetchProducts]);

  useEffect(() => {
    if (!isOpen) {
      console.log("Cart closed, refreshing product data...");
      fetchProducts();
    }
  }, [isOpen, fetchProducts]);

  const handleQuantityChange = (productId, value) => {
    setSelectedQuantities(prev => ({
      ...prev,
      [productId]: value
    }));
  };

  const addToCart = (product) => {
    const selectedQuantity = selectedQuantities[product._id] || 1;

    if (selectedQuantity > product.quantity) {
      toast({
        title: 'Error',
        description: `Cannot add more than available quantity (${product.quantity})`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const existingItemIndex = cart.findIndex(item => item._id === product._id);
    if (existingItemIndex !== -1) {
      const newCart = [...cart];
      const newQuantity = newCart[existingItemIndex].quantity + selectedQuantity;
      if (newQuantity > product.quantity) {
        toast({
          title: 'Error',
          description: `Cannot add more than available quantity (${product.quantity})`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      newCart[existingItemIndex].quantity = newQuantity;
      setCart(newCart);
    } else {
      setCart([...cart, { ...product, quantity: selectedQuantity }]);
    }

    toast({
      title: 'Added to cart',
      description: `${selectedQuantity} ${product.name}(s) added to cart`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });

    fetchProducts();
  };

  const updateQuantity = (index, newQuantity) => {
    const newCart = [...cart];
    const product = newCart[index];

    const currentProduct = products.find(p => p._id === product._id);

    if (newQuantity > currentProduct.quantity) {
      toast({
        title: 'Error',
        description: `Cannot add more than available quantity (${currentProduct.quantity})`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    newCart[index].quantity = newQuantity;
    setCart(newCart);
  };

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    fetchProducts();
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price_per_unit * item.quantity, 0).toFixed(2);
  };

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to place an order',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        navigate('/auth/sign-in');
        return;
      }

      const order = {
        items: cart.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        totalPrice: calculateTotal(),
        address: address
      };

      // Create the order
      const response = await axios.post('http://localhost:5000/api/orders', order, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast({
        title: 'Order created',
        description: 'Redirecting to payment page...',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

      // Get the order ID from the response
      const orderId = response.data.order._id;

      // Close the cart drawer
      onClose();

      // Redirect to the payment page with the order ID
      navigate(`/payment/${orderId}`);

      // Clear cart and address after redirect is initiated
      setCart([]);
      setAddress('');
      fetchProducts();
    } catch (error) {
      console.error("Order creation error:", error);

      // Handle authentication errors
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token'); // Clear invalid token
        toast({
          title: 'Authentication Error',
          description: 'Your login session has expired. Please log in again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        navigate('/auth/sign-in');
      } else {
        toast({
          title: 'Error',
          description: error.response?.data?.error || 'Failed to place order',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
      <Box p={5} position="relative" minH="100vh">
        <Heading mb={5}>Shop</Heading>

        {paymentStatus && (
            <Alert
                status={paymentStatus.type}
                mb={5}
                borderRadius="md"
            >
              <AlertIcon />
              <AlertTitle mr={2}>{paymentStatus.message}</AlertTitle>
              <CloseButton
                  position="absolute"
                  right="8px"
                  top="8px"
                  onClick={() => setPaymentStatus(null)}
              />
            </Alert>
        )}

        <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
          {products.map((product) => (
              <Card key={product._id}>
                <CardBody>
                  {product.image ? (
                      <Image
                          src={product.image}
                          alt={product.name}
                          borderRadius="lg"
                          mb={4}
                          objectFit="cover"
                          height="200px"
                          width="100%"
                      />
                  ) : (
                      <Center
                          height="200px"
                          width="100%"
                          bg="gray.100"
                          borderRadius="lg"
                          mb={4}
                      >
                        <Icon as={FaImage} boxSize={10} color="gray.400" />
                      </Center>
                  )}
                  <Text fontSize="xl" fontWeight="bold">
                    {product.name}
                  </Text>
                  <Text color="gray.600" mb={1}>
                    Price per unit: ${product.price_per_unit}
                  </Text>
                  <Text color="gray.600" mb={2}>
                    Total: ${(product.price_per_unit * (selectedQuantities[product._id] || 1)).toFixed(2)}
                  </Text>

                  {/* Dynamic Available Stock Display with color indicators */}
                  <Text
                      color={product.quantity <= 5 ? "red.500" :
                          product.quantity <= 10 ? "orange.500" : "green.500"}
                      mb={2}
                      fontWeight={product.quantity <= 5 ? "bold" : "normal"}
                  >
                    Available: {product.quantity} {product.unit || 'units'}
                    {product.quantity <= 5 && <Badge ml={2} colorScheme="red">Low Stock</Badge>}
                  </Text>

                  <Flex align="center" mb={4}>
                    <Text mr={2}>Quantity:</Text>
                    <NumberInput
                        size="sm"
                        maxW="100px"
                        min={1}
                        max={product.quantity}
                        value={selectedQuantities[product._id] || 1}
                        onChange={(value) => handleQuantityChange(product._id, parseInt(value))}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </Flex>
                  <Button
                      colorScheme="blue"
                      onClick={() => addToCart(product)}
                      width="100%"
                      isDisabled={product.quantity === 0}
                  >
                    {product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                </CardBody>
              </Card>
          ))}
        </Grid>

        <IconButton
            icon={<FaShoppingCart />}
            onClick={onOpen}
            aria-label="Open cart"
            position="fixed"
            bottom="20px"
            right="20px"
            size="lg"
            colorScheme="blue"
            boxSize="60px"
            fontSize="24px"
        >
          {cart.length > 0 && (
              <Badge
                  colorScheme="red"
                  position="absolute"
                  top="-1"
                  right="-1"
                  borderRadius="full"
                  fontSize="14px"
                  padding="0 4px"
              >
                {cart.length}
              </Badge>
          )}
        </IconButton>

        <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Your Cart</DrawerHeader>
            <DrawerBody>
              {cart.length === 0 ? (
                  <Text>Your cart is empty</Text>
              ) : (
                  <>
                    {cart.map((item, index) => (
                        <Flex key={index} mb={4} align="center">
                          <Box flex="1">
                            <Text fontWeight="bold">{item.name}</Text>
                            <Text>Price per unit: ${item.price_per_unit}</Text>
                            <Text>Total: ${(item.price_per_unit * item.quantity).toFixed(2)}</Text>

                            {/* Get the current stock from products array, not from cart item */}
                            {(() => {
                              const currentProduct = products.find(p => p._id === item._id);
                              const currentStock = currentProduct ? currentProduct.quantity : 0;
                              return (
                                  <Text
                                      color={currentStock <= 5 ? "red.500" :
                                          currentStock <= 10 ? "orange.500" : "green.500"}
                                      fontSize="sm"
                                  >
                                    Available: {currentStock} {item.unit || 'units'}
                                  </Text>
                              );
                            })()}
                          </Box>
                          <NumberInput
                              size="sm"
                              maxW="100px"
                              min={1}
                              max={(() => {
                                const currentProduct = products.find(p => p._id === item._id);
                                return currentProduct ? currentProduct.quantity : 0;
                              })()}
                              value={item.quantity}
                              onChange={(value) => updateQuantity(index, parseInt(value))}
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                          <Button
                              colorScheme="red"
                              size="sm"
                              ml={2}
                              onClick={() => removeFromCart(index)}
                          >
                            Remove
                          </Button>
                        </Flex>
                    ))}
                    <Box mt={4}>
                      <Text fontSize="xl" fontWeight="bold">
                        Total: ${calculateTotal()}
                      </Text>
                    </Box>
                    <FormControl mt={4}>
                      <FormLabel>Delivery Address</FormLabel>
                      <Textarea
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Enter your delivery address"
                      />
                    </FormControl>
                    <Button
                        colorScheme="green"
                        mt={4}
                        width="100%"
                        onClick={handleCheckout}
                        isDisabled={!address}
                    >
                      Proceed to Payment
                    </Button>
                  </>
              )}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>
  );
};

export default Shop; 