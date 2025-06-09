import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Heading, Text, Button, VStack, Spinner } from '@chakra-ui/react';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/orders/${id}`)
      .then(res => setOrder(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!order) return <Spinner size="xl" />;

  return (
    <VStack spacing={4} p={6}>
      <Heading>Order #{order._id}</Heading>
      <Text>Total: ${order.totalPrice}</Text>
      <Text>Status: {order.isPaid ? '✅ Paid' : '❌ Not Paid'}</Text>
      <Button
        colorScheme="blue"
        onClick={() => navigate(`/payment/${order._id}`)}
        isDisabled={order.isPaid}
      >
        Pay this Order
      </Button>
    </VStack>
  );
};

export default OrderDetails;
