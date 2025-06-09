import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  Input,
  Select
} from "@chakra-ui/react";
import productService from "../../services/productService";

export default function PriorityPredict() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priorityScores, setPriorityScores] = useState({});
  const [priorityLoading, setPriorityLoading] = useState({});
  const [priorityError, setPriorityError] = useState({});
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getAllProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handlePredictPriority = async (productId) => {
    setPriorityLoading((prev) => ({ ...prev, [productId]: true }));
    setPriorityError((prev) => ({ ...prev, [productId]: null }));
    try {
      const API_URL = "http://localhost:5000";
      const res = await fetch(`${API_URL}/api/products/priority-predict/${productId}`, {
        method: "POST"
      });
      const data = await res.json();
      if (res.ok) {
        setPriorityScores((prev) => ({ ...prev, [productId]: data.score }));
      } else {
        setPriorityError((prev) => ({ ...prev, [productId]: data.error || "Prediction failed" }));
      }
    } catch (err) {
      setPriorityError((prev) => ({ ...prev, [productId]: err.message || "Prediction failed" }));
    }
    setPriorityLoading((prev) => ({ ...prev, [productId]: false }));
  };

  // Simple filter by name/category
  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(filter.toLowerCase()) ||
      p.category?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Box p={8}>
      <Text fontSize="2xl" fontWeight="bold" mb={4} color="blue.700">
        Product Priority Prediction
      </Text>
      <Flex mb={4} align="center" gap={4}>
        <Input
          placeholder="Search products by name or category..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          maxW="325px"
        />
      </Flex>
      {loading ? (
        <Flex justify="center" align="center" minH="200px">
          <Spinner size="xl" />
        </Flex>
      ) : error ? (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      ) : (
        <Table variant="simple" size="md" bg="white" borderRadius="md" shadow="sm">
          <Thead bg="gray.100">
            <Tr>
              <Th>Name</Th>
              <Th>Category</Th>
              <Th>Expiration Date</Th>
              <Th>Temp</Th>
              <Th>Cond</Th>
              <Th>Predict</Th>
              <Th>Priority Score</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredProducts.map((product) => (
              <Tr key={product._id}>
                <Td>{product.name}</Td>
                <Td>{product.category}</Td>
                <Td>{product.expiration_date ? new Date(product.expiration_date).toLocaleDateString() : '-'}</Td>
                <Td>{product.temp !== undefined ? product.temp : <Badge colorScheme="red">Missing</Badge>}</Td>
                <Td>{product.cond !== undefined ? product.cond : <Badge colorScheme="red">Missing</Badge>}</Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => handlePredictPriority(product._id)}
                    isLoading={priorityLoading[product._id]}
                    isDisabled={product.temp === undefined || product.cond === undefined}
                  >
                    Predict
                  </Button>
                </Td>
                <Td>
                  {priorityScores[product._id] !== undefined && (
                    <Badge colorScheme="green" fontSize="md">
                      {priorityScores[product._id].toFixed(2)}
                    </Badge>
                  )}
                  {priorityError[product._id] && (
                    <Text color="red.500" fontSize="sm">{priorityError[product._id]}</Text>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
}
