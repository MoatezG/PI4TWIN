import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Link,
  useColorModeValue,
  SimpleGrid,
  Icon,
  Spinner,
  Alert,
  AlertIcon,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Checkbox,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

import { MdAdd, MdEdit, MdDelete, MdSearch } from "react-icons/md";
import { ViewIcon } from '@chakra-ui/icons';
import productService from "../../services/productService";

import ProductComparisonModal from "./components/ProductComparisonModal";
import { Link as RouterLink } from 'react-router-dom';

export default function ProductView() {
  const [predicting, setPredicting] = useState(false);
  const [predictionError, setPredictionError] = useState(null);

  // ...rest of hooks

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(() => {
    // Persist selection in localStorage
    const saved = localStorage.getItem('selectedProducts');
    return saved ? JSON.parse(saved) : [];
  });
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expiringDays, setExpiringDays] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewedProduct, setViewedProduct] = useState(null);
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose
  } = useDisclosure();
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    barcode: "",
    description: "",
    quantity: 0,
    unit: "unit",
    price_per_unit: 0,
    temp: '',
    cond: '',
    expiration_date: "",
    production_date: "",
    origin_country: "",
    image: '' // image URL or filename from backend
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Persist selectedProducts in localStorage
  useEffect(() => {
    localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
  }, [selectedProducts]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || (user.role !== 'Provider' && user.role !== 'Admin')) {
      setError('404 - Page Not Found');
    }
  }, []);

  const fetchProducts = async (category = null, days = null) => {
    try {
      setLoading(true);
      setError(null);
      let data;

      if (days) {
        data = await productService.getProductsExpiringAfter(days);
      } else if (category) {
        data = await productService.getProductsByCategory(category);
      } else {
        data = await productService.getAllProducts();
      }

      setProducts(data);
    } catch (err) {
      setError(err.message || "Failed to fetch products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setExpiringDays(null);
    fetchProducts(category);
  };

  const handleExpiringClick = (days) => {
    setExpiringDays(days);
    setSelectedCategory(null);
    fetchProducts(null, days);
  };

  const handleEdit = (product) => {
    console.log("=== Edit Product ===");
    console.log("Original product:", product);

    if (!product) {
      console.error("No product provided to handleEdit");
      return;
    }

    const productId = product._id || product.id;
    if (!productId) {
      console.error("No product ID found in product:", product);
      return;
    }

    console.log("Product ID to edit:", productId);
    setEditingProduct(product);

    // Create a clean form data object
    const cleanFormData = {
      name: product.name || "",
      brand: product.brand || "",
      category: product.category || "",
      barcode: product.barcode || "",
      description: product.description || "",
      quantity: Number(product.quantity) || 0,
      unit: product.unit || "unit",
      price_per_unit: Number(product.price_per_unit) || 0,
      expiration_date: product.expiration_date ? new Date(product.expiration_date).toISOString().split('T')[0] : "",
      production_date: product.production_date ? new Date(product.production_date).toISOString().split('T')[0] : "",
      origin_country: product.origin_country || "",
      temp: product.temp !== undefined && product.temp !== null ? Number(product.temp) : '',
      cond: product.cond !== undefined && product.cond !== null ? Number(product.cond) : '',
      image: product.image || ''
    };

    setFormData(cleanFormData);
    setImagePreview(product.image || null);
    setImageFile(null);
    onOpen();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("=== Submit Product ===");
      console.log("Editing product:", editingProduct);
      console.log("Form data:", formData);
      console.log("Image file:", imageFile);

      let response;
      if (editingProduct) {
        const productId = editingProduct._id || editingProduct.id;
        if (!productId) {
          throw new Error("No product ID found for update");
        }
        // If imageFile is present, use FormData, else send JSON
        if (imageFile) {
          const data = new FormData();
          Object.entries(formData).forEach(([key, value]) => {
            if (key !== 'image') data.append(key, value); // Don't send image URL if file is present
          });
          data.append('image', imageFile);
          response = await productService.updateProductWithImage(productId, data); // You need to implement this in productService
        } else {
          response = await productService.updateProduct(productId, {
            ...formData,
            quantity: Number(formData.quantity),
            price_per_unit: Number(formData.price_per_unit),
            temp: Number(formData.temp),
            cond: Number(formData.cond)
          });
        }
      } else {
        // Create new product
        const cleanFormData = {
          ...formData,
          quantity: Number(formData.quantity),
          price_per_unit: Number(formData.price_per_unit),
          temp: Number(formData.temp),
          cond: Number(formData.cond)
        };
        // If imageFile is present, do not include image URL in FormData
        response = await productService.createProduct(cleanFormData, imageFile);
      }

      onClose();
      fetchProducts(selectedCategory, expiringDays);
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setError(err.message || "Failed to save product");
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      setError("Cannot delete product: ID is undefined");
      return;
    }

    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productService.deleteProduct(id);
        fetchProducts(selectedCategory, expiringDays);
      } catch (err) {
        setError(err.message || "Failed to delete product");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setImageFile(file);
      if (file) {
        setImagePreview(URL.createObjectURL(file));
        setFormData(prev => ({
          ...prev,
          image: '' // Clear image URL if file is selected
        }));
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      if (name === 'image' && value) {
        setImageFile(null); // Clear file if URL is entered
        setImagePreview(value);
      }
    }
  };

  const handleNumberInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Toggle selection
  const handleProductSelect = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  // Remove from comparison
  const handleRemoveFromComparison = (id) => {
    setSelectedProducts((prev) => prev.filter(pid => pid !== id));
  };

  // Open comparison modal
  const openComparison = () => setIsComparisonOpen(true);
  const closeComparison = () => setIsComparisonOpen(false);

  // Get selected product objects
  const comparedProducts = products.filter(p => selectedProducts.includes(p.id || p._id));

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      {/* Floating Comparison Bar */}
      {selectedProducts.length > 0 && (
        <Flex position="fixed" bottom="30px" left="50%" transform="translateX(-50%)" zIndex={1000} bg="white" px={6} py={3} boxShadow="xl" borderRadius="lg" align="center" gap={4}>
          <Text fontWeight="bold">{selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected</Text>
          <Button colorScheme="brand" onClick={openComparison} isDisabled={selectedProducts.length < 2}>
            Compare Now
          </Button>
          <Button variant="outline" size="sm" colorScheme="red" onClick={() => setSelectedProducts([])}>
            Clear
          </Button>
        </Flex>
      )}

      <ProductComparisonModal
        isOpen={isComparisonOpen}
        onClose={closeComparison}
        products={comparedProducts}
        onRemove={handleRemoveFromComparison}
      />
      <Flex direction="column">
        <Flex
          mt="45px"
          mb="20px"
          justifyContent="space-between"
          direction={{ base: "column", md: "row" }}
          align={{ base: "start", md: "center" }}
        >
          <Text color={textColor} fontSize="2xl" ms="24px" fontWeight="700">
            Products Management
          </Text>
          <Flex
            ms={{ base: "24px", md: "0px" }}
            mt={{ base: "20px", md: "0px" }}
            align="center"
            gap={3}
          >
            <Button
              as={RouterLink}
              to="/admin/priority-predict"
              colorScheme="blue"
              variant="solid"
              size="md"
            >
              Priority Prediction
            </Button>
            <Button
              leftIcon={<MdAdd />}
              colorScheme="brand"
              onClick={() => {
                setEditingProduct(null);
                setFormData({
                  name: "",
                  brand: "",
                  category: "",
                  barcode: "",
                  description: "",
                  quantity: 0,
                  unit: "",
                  price_per_unit: 0,
                  expiration_date: "",
                  production_date: "",
                  origin_country: "",
                  image: ""
                });
                setPredictionError(null);
                setPredicting(false);
                onOpen();
              }}
            >
              Add Product
            </Button>
          </Flex>
        </Flex>

        <Flex
          mb="20px"
          direction={{ base: "column", md: "row" }}
          align={{ base: "start", md: "center" }}
          ms="24px"
        >
          <Text color={textColor} fontSize="md" fontWeight="500" me="20px">
            Filter by:
          </Text>
          <Flex wrap="wrap" gap="10px">
            <Button
              size="sm"
              variant={selectedCategory === null && expiringDays === null ? "solid" : "outline"}
              colorScheme="brand"
              onClick={() => {
                setSelectedCategory(null);
                setExpiringDays(null);
                fetchProducts();
              }}
            >
              All
            </Button>
            <Button
              size="sm"
              variant={selectedCategory === "Food" ? "solid" : "outline"}
              colorScheme="brand"
              onClick={() => handleCategoryClick("Food")}
            >
              Food
            </Button>
            <Button
              size="sm"
              variant={selectedCategory === "Beverages" ? "solid" : "outline"}
              colorScheme="brand"
              onClick={() => handleCategoryClick("Beverages")}
            >
              Beverages
            </Button>
            <Button
              size="sm"
              variant={selectedCategory === "Snacks" ? "solid" : "outline"}
              colorScheme="brand"
              onClick={() => handleCategoryClick("Snacks")}
            >
              Snacks
            </Button>
            <Button
              size="sm"
              variant={expiringDays === 7 ? "solid" : "outline"}
              colorScheme="red"
              onClick={() => handleExpiringClick(7)}
            >
              Expiring in 7 days
            </Button>
            <Button
              size="sm"
              variant={expiringDays === 30 ? "solid" : "outline"}
              colorScheme="orange"
              onClick={() => handleExpiringClick(30)}
            >
              Expiring in 30 days
            </Button>
          </Flex>
        </Flex>

        {loading ? (
          <Flex justify="center" align="center" h="200px">
            <Spinner size="xl" color="brand.500" />
          </Flex>
        ) : error ? (
          <Alert status="error" mx="24px">
            <AlertIcon />
            {error}
          </Alert>
        ) : (
          <Box overflowX="auto" mx="24px">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th></Th>
                  <Th>Image</Th>
                  <Th>Name</Th>
                  <Th>Category</Th>
                  <Th>Quantity</Th>
                  <Th>Unit</Th>
                  <Th>Price/Unit</Th>
                  <Th>Expiration Date</Th>
                  <Th>Views</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {products.map((product) => {
                  console.log("Rendering product:", product);
                  return (
                    <Tr key={product.id || product._id} _hover={{ bg: 'gray.50', boxShadow: 'sm', transition: 'all 0.2s' }}>
                      <Td>
                        <Box display="flex" alignItems="center" justifyContent="center">
                          <Checkbox
                            colorScheme="brand"
                            borderRadius="full"
                            size="lg"
                            isChecked={selectedProducts.includes(product.id || product._id)}
                            onChange={() => handleProductSelect(product.id || product._id)}
                            aria-label="Select for comparison"
                          />
                        </Box>
                      </Td>
                      <Td>
                        {product.image ? (
                          <Box boxSize="90px" borderRadius="lg" overflow="hidden" borderWidth="2px" borderColor="gray.200" bg="white" display="flex" alignItems="center" justifyContent="center">
                            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </Box>
                        ) : (
                          <Box w="90px" h="90px" bg="gray.100" borderRadius="lg" display="flex" alignItems="center" justifyContent="center" color="gray.400" borderWidth="2px" borderColor="gray.200">
                            No Image
                          </Box>
                        )}
                      </Td>
                      <Td>{product.name}</Td>
                      <Td>
                        <Badge colorScheme="brand">{product.category}</Badge>
                      </Td>
                      <Td>{product.quantity}</Td>
                      <Td>{product.unit}</Td>
                      <Td>${product.price_per_unit}</Td>
                      <Td>
                        {new Date(product.expiration_date).toLocaleDateString()}
                        {isExpiringSoon(product.expiration_date) && (
                          <Badge ml={2} colorScheme="red">Expiring Soon</Badge>
                        )}
                      </Td>
                      <Td>{product.viewCount ?? 0}</Td>
                      <Td>
                        <Button
                          size="sm"
                          leftIcon={<ViewIcon />}
                          colorScheme="blue"
                          variant="outline"
                          mr={2}
                          onClick={async () => {
                            try {
                              const updated = await productService.incrementViewCount(product.id || product._id);
                              await fetchProducts(selectedCategory, expiringDays); // Re-fetch to ensure consistency
                              setViewedProduct(updated);
                            } catch (e) {
                              console.error('Failed to increment view count', e);
                              setViewedProduct(product); // fallback
                            }
                            onViewOpen();
                          }}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          leftIcon={<MdEdit />}
                          colorScheme="brand"
                          mr={2}
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          leftIcon={<MdDelete />}
                          colorScheme="red"
                          onClick={() => handleDelete(product.id || product._id)}
                        >
                          Delete
                        </Button>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Box>
        )}
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingProduct ? "Edit Product" : "Add New Product"}</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <SimpleGrid columns={2} spacing={4}>
                {/* Image upload for prediction (only for Add) */}
                {!editingProduct && (
                  <FormControl>
                    <FormLabel>Upload Image for Prediction</FormLabel>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        setPredicting(true);
                        setPredictionError(null);
                        // Show preview
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImagePreview(reader.result);
                        };
                        reader.readAsDataURL(file);
                        try {
                          const formDataImage = new FormData();
                          formDataImage.append("file", file);
                          const response = await fetch("http://localhost:8000/classify-fruit", {
                            method: "POST",
                            body: formDataImage,
                          });
                          const result = await response.json();
                          if (result.predicted_class) {
                            setFormData(prev => ({
                              ...prev,
                              name: result.predicted_class,
                              category: result.predicted_class
                            }));
                          } else {
                            setPredictionError(result.error || "Prediction failed.");
                          }
                        } catch (err) {
                          setPredictionError("Prediction failed.");
                        }
                        setPredicting(false);
                      }}
                      sx={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '6px',
                        background: '#f7fafc',
                        fontSize: 'sm',
                        marginBottom: 2
                      }}
                    />
                    {imagePreview && (
                      <Box mt={2} display="flex" alignItems="center">
                        <img src={imagePreview} alt="Prediction Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #eee' }} />
                        {imageFile ? (
                          <Text fontSize="sm" color="blue.500" ml={3}>The uploaded file will be used for product image.</Text>
                        ) : formData.image ? (
                          <Text fontSize="sm" color="gray.500" ml={3}>This image URL will be used for product image.</Text>
                        ) : null}
                      </Box>
                    )}
                    {predicting && <Text color="blue.500">Predicting...</Text>}
                    {predictionError && <Text color="red.500">{predictionError}</Text>}
                  </FormControl>
                )}
                <FormControl>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl isDisabled={!!imageFile}>
                    <Input
                      name="image"
                      value={formData.image || ''}
                      onChange={handleInputChange}
                      placeholder="https://..."
                      disabled={!!imageFile}
                    />
                    {formData.image && !imageFile && (
                      <Box mt={2}>
                        <img src={formData.image} alt="Preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }} />
                        <Text fontSize="sm" color="gray.500">This image URL will be used if no file is uploaded.</Text>
                      </Box>
                    )}
                    {imageFile && (
                      <Text fontSize="sm" color="blue.500" mt={2}>Image file selected. The uploaded file will be used for product image.</Text>
                    )}
                  </FormControl>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Brand</FormLabel>
                  <Input
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Category</FormLabel>
                  <Input
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Barcode</FormLabel>
                  <Input
                    name="barcode"
                    value={formData.barcode}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Description</FormLabel>
                  <Input
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Quantity</FormLabel>
                  <NumberInput
                    value={formData.quantity}
                    onChange={(value) => handleNumberInputChange("quantity", value)}
                    min={0}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Unit</FormLabel>
                  <Select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="L">Liter (L)</option>
                    <option value="unit">Unit</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Price per Unit</FormLabel>
                  <NumberInput
                    value={formData.price_per_unit}
                    onChange={(value) => handleNumberInputChange("price_per_unit", value)}
                    min={0}
                    precision={2}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Temperature (°C)</FormLabel>
                  <NumberInput
                    value={formData.temp ?? ''}
                    onChange={(value) => handleNumberInputChange("temp", value)}
                    min={-50}
                    max={100}
                  >
                    <NumberInputField placeholder="Enter temperature" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Condition (1-5)</FormLabel>
                  <NumberInput
                    value={formData.cond ?? ''}
                    onChange={(value) => handleNumberInputChange("cond", value)}
                    min={1}
                    max={5}
                  >
                    <NumberInputField placeholder="Enter condition (1-5)" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Expiration Date</FormLabel>
                  <Input
                    type="date"
                    name="expiration_date"
                    value={formData.expiration_date}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Production Date</FormLabel>
                  <Input
                    type="date"
                    name="production_date"
                    value={formData.production_date}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Origin Country</FormLabel>
                  <Input
                    name="origin_country"
                    value={formData.origin_country}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </SimpleGrid>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="brand" type="submit">
                {editingProduct ? "Update" : "Create"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
      {/* Product View Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="blue.600" color="white" py={4} borderTopLeftRadius="lg" borderTopRightRadius="lg" fontSize="2xl" fontWeight="bold" textAlign="center">
            Product Details
          </ModalHeader>
          <ModalCloseButton color="white" top={3} right={3} />
          <ModalBody px={8} py={6} bg="gray.50">
            {viewedProduct && (
              <Flex direction={{ base: 'column', md: 'row' }} gap={8} alignItems="flex-start">
                <Box flexShrink={0} display="flex" flexDirection="column" alignItems="center" minW="180px">
                  {viewedProduct.image ? (
                    <Box boxSize="180px" borderRadius="lg" overflow="hidden" borderWidth="2px" borderColor="gray.200" bg="white" display="flex" alignItems="center" justifyContent="center" shadow="md">
                      <img src={viewedProduct.image} alt={viewedProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                  ) : (
                    <Box w="180px" h="180px" bg="gray.100" borderRadius="lg" display="flex" alignItems="center" justifyContent="center" color="gray.400" borderWidth="2px" borderColor="gray.200" shadow="md">
                      No Image
                    </Box>
                  )}
                </Box>
                <Box flex="1">
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
                    <Box><Text fontWeight="bold" color="gray.700">Name:</Text> <Text>{viewedProduct.name}</Text></Box>
                    <Box><Text fontWeight="bold" color="gray.700">Brand:</Text> <Text>{viewedProduct.brand}</Text></Box>
                    <Box><Text fontWeight="bold" color="gray.700">Category:</Text> <Text>{viewedProduct.category}</Text></Box>
                    <Box><Text fontWeight="bold" color="gray.700">Barcode:</Text> <Text>{viewedProduct.barcode}</Text></Box>
                    <Box><Text fontWeight="bold" color="gray.700">Quantity:</Text> <Text>{viewedProduct.quantity}</Text></Box>
                    <Box><Text fontWeight="bold" color="gray.700">Unit:</Text> <Text>{viewedProduct.unit}</Text></Box>
                    <Box><Text fontWeight="bold" color="gray.700">Price/Unit:</Text> <Text>${viewedProduct.price_per_unit}</Text></Box>
                    <Box><Text fontWeight="bold" color="gray.700">Expiration Date:</Text> <Text>{viewedProduct.expiration_date ? new Date(viewedProduct.expiration_date).toLocaleDateString() : '-'}</Text></Box>
                    <Box><Text fontWeight="bold" color="gray.700">Production Date:</Text> <Text>{viewedProduct.production_date ? new Date(viewedProduct.production_date).toLocaleDateString() : '-'}</Text></Box>
                    <Box><Text fontWeight="bold" color="gray.700">Origin Country:</Text> <Text>{viewedProduct.origin_country}</Text></Box>
                    <Box><Text fontWeight="bold" color="gray.700">Views:</Text> <Text>{viewedProduct.viewCount ?? 0}</Text></Box>
                  </SimpleGrid>
                  <Box my={4}><hr style={{ border: 'none', borderTop: '1px solid #CBD5E0' }} /></Box>
                  <Box bg="white" p={5} borderRadius="md" shadow="sm">
                    <Text fontWeight="bold" color="blue.700" fontSize="lg" mb={2}>Description</Text>
                    <Text color="gray.700" fontSize="md" whiteSpace="pre-line">{viewedProduct.description}</Text>
                  </Box>
                </Box>
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}



// Helper function to check if a product is expiring soon (within 30 days)
function isExpiringSoon(expirationDate) {
  const today = new Date();
  const expDate = new Date(expirationDate);
  const diffTime = expDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 30 && diffDays > 0;
}
