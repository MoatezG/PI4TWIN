import React, { useState, useEffect } from 'react';
import { 
  FormControl, FormLabel, Input, Select, Button, useToast, Stack,
  Grid, GridItem, Card, CardHeader, CardBody, Text, Spinner, Alert,
  AlertIcon, AlertTitle, AlertDescription, Box, Heading, SimpleGrid
} from '@chakra-ui/react';
import stockService from '../../../../services/stockService';
import providerService from '../../../../services/providerService';
import demanderService from '../../../../services/demanderService';
import productService from '../../../../services/productService';
import { getCurrentUser, getUserRole } from '../../../../utils/auth';

const StockTransfer = () => {
  const user = getCurrentUser();
  const role = getUserRole();
  const toast = useToast();
  
  // State for both roles
  const [providers, setProviders] = useState([]);
  const [demanders, setDemanders] = useState([]);
  const [allProviders, setAllProviders] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProviderStock, setSelectedProviderStock] = useState([]);
  const [currentDemanderStock, setCurrentDemanderStock] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    entityId: '',
    targetProviderId: '',
    items: [],
    selectedProduct: '',
    quantity: ''
  });

  // Loading states
  const [loadingEntities, setLoadingEntities] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingProviderStock, setLoadingProviderStock] = useState(false);
  const [loadingDemanderStock, setLoadingDemanderStock] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      try {
        if (role === 'Provider') {
          const providersData = await providerService.getProvidersByUserId(user.id);
          setProviders(providersData);
          if (providersData.length > 0 && formData.entityId !== providersData[0]._id) {
            setFormData(prev => ({ ...prev, entityId: providersData[0]._id }));
          }
        } else if (role === 'Demander') {
          const [demandersData, allProvidersData, allProductsData] = await Promise.all([
            demanderService.getDemandersByUserId(user.id),
            providerService.getAllProviders(),
            productService.getAllProducts()
          ]);
          
          setDemanders(demandersData);
          setAllProviders(allProvidersData);
          setAllProducts(allProductsData);
          
          if (demandersData.length > 0 && formData.entityId !== demandersData[0]._id) {
            setFormData(prev => ({ ...prev, entityId: demandersData[0]._id }));
          }
        }
      } catch (error) {
        console.error('Error initializing data:', error);
        toast({
          title: 'Initialization Error',
          description: error.message,
          status: 'error',
          duration: 3000
        });
      } finally {
        setLoadingEntities(false);
      }
    };

    if (user && role) initializeData();
  }, [user?.id, role, toast]);

  // Fetch demander's current stock when entityId changes
  useEffect(() => {
    if (role === 'Demander' && formData.entityId) {
      const fetchDemanderStock = async () => {
        try {
          setLoadingDemanderStock(true);
          console.log(`Fetching stock for demander_id: ${formData.entityId}`); // Debugging log

          const stockData = await stockService.getDemanderStock(formData.entityId);
          console.log('Fetched demander stock:', stockData); // Debugging log

          if (!stockData?.products?.length) {
            toast({
              title: 'No Stock',
              description: 'This demander has no stock.',
              status: 'warning',
              duration: 3000
            });
          }

          setCurrentDemanderStock(stockData?.products || []); // Ensure products array is used
        } catch (error) {
          if (error.response?.status === 404) {
            toast({
              title: 'No Stock',
              description: 'This demander has no stock.',
              status: 'warning',
              duration: 3000
            });
          } else {
            console.error('Error fetching demander stock:', error); // Debugging log
            toast({
              title: 'Stock Fetch Error',
              description: error.message,
              status: 'error'
            });
          }
          setCurrentDemanderStock([]);
        } finally {
          setLoadingDemanderStock(false);
        }
      };
      fetchDemanderStock();
    }
  }, [formData.entityId, role, toast]);

  useEffect(() => {
    if (role === 'Provider') {
      const fetchProducts = async () => {
        try {
          setLoadingProducts(true);
          const productsData = await productService.getAllProducts();
          setProducts(productsData);
        } catch (error) {
          console.error('Error fetching products:', error);
          toast({
            title: 'Product Fetch Error',
            description: error.message,
            status: 'error'
          });
        } finally {
          setLoadingProducts(false);
        }
      };
      fetchProducts();
    }
  }, [role, toast]);

  useEffect(() => {
    if (role === 'Demander' && formData.targetProviderId) {
      const fetchProviderStock = async () => {
        try {
          setLoadingProviderStock(true);
          const stockData = await stockService.getProviderStock(formData.targetProviderId);
          setSelectedProviderStock(stockData?.products || []); // Ensure products array is used
        } catch (error) {
          if (error.response?.status === 404) {
            toast({
              title: 'No Stock',
              description: 'This provider has no stock.',
              status: 'warning',
              duration: 3000
            });
          } else {
            console.error('Error fetching provider stock:', error); // Debugging log
            toast({
              title: 'Stock Fetch Error',
              description: error.message,
              status: 'error'
            });
          }
          setSelectedProviderStock([]);
        } finally {
          setLoadingProviderStock(false);
        }
      };
      fetchProviderStock();
    }
  }, [formData.targetProviderId, role, toast]);

  useEffect(() => {
    if (role === 'Provider' && formData.entityId) {
      const fetchProviderStock = async () => {
        try {
          setLoadingProviderStock(true);
          console.log(`Fetching stock for provider_id: ${formData.entityId}`); // Debugging log

          const stockData = await stockService.getProviderStock(formData.entityId);
          console.log('Fetched provider stock:', stockData); // Debugging log

          if (!stockData?.products?.length) {
            toast({
              title: 'No Stock',
              description: 'This provider has no stock.',
              status: 'warning',
              duration: 3000
            });
          }

          setSelectedProviderStock(stockData?.products || []); // Ensure products array is used
        } catch (error) {
          if (error.response?.status === 404) {
            toast({
              title: 'No Stock',
              description: 'This provider has no stock.',
              status: 'warning',
              duration: 3000
            });
          } else {
            console.error('Error fetching provider stock:', error); // Debugging log
            toast({
              title: 'Stock Fetch Error',
              description: error.message,
              status: 'error'
            });
          }
          setSelectedProviderStock([]);
        } finally {
          setLoadingProviderStock(false);
        }
      };
      fetchProviderStock();
    }
  }, [formData.entityId, role, toast]);

  const handleProviderAddItem = () => {
    if (formData.selectedProduct && formData.quantity > 0) {
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, {
          product_id: formData.selectedProduct,
          quantity: Number(formData.quantity)
        }],
        selectedProduct: '',
        quantity: ''
      }));
    } else {
      toast({
        title: 'Invalid Input',
        description: 'Please select a product and enter a valid quantity.',
        status: 'error',
        duration: 3000
      });
    }
  };

  const handleDemanderAddItem = (productId, availableQuantity) => {
    const quantity = Number(prompt(`Enter quantity (max ${availableQuantity}):`, '1'));
    if (quantity > 0 && quantity <= availableQuantity) {
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, { product_id: productId, quantity }]
      }));
    } else {
      toast({
        title: 'Invalid Quantity',
        description: `Please enter a quantity between 1 and ${availableQuantity}.`,
        status: 'error',
        duration: 3000
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.items.length === 0) {
        throw new Error('No items selected for transfer.');
      }

      if (role === 'Provider') {
        await stockService.fillStockFromProductList(
          formData.entityId,
          formData.items
        );
      } else if (role === 'Demander') {
        await stockService.fillStockFromProvider(
          formData.entityId,
          formData.targetProviderId,
          formData.items
        );
        // Refresh stocks after transfer
        const [updatedDemanderStock, updatedProviderStock] = await Promise.all([
          stockService.getDemanderStock(formData.entityId),
          stockService.getProviderStock(formData.targetProviderId)
        ]);
        setCurrentDemanderStock(updatedDemanderStock);
        setSelectedProviderStock(updatedProviderStock);
      }

      toast({
        title: 'Transfer Successful',
        status: 'success',
        duration: 3000
      });
      setFormData(prev => ({ ...prev, items: [] }));
    } catch (error) {
      console.error('Transfer error:', error);
      toast({
        title: 'Transfer Failed',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    }
  };

  if (!user || !role) return <Spinner size="xl" />;

  return (
    <Box p={4}>
      <Heading mb={6} fontSize="2xl">
        {role === 'Provider' ? 'Provider Stock Management' : 'Stock Transfer'}
      </Heading>

      <Stack as="form" spacing={4} onSubmit={handleSubmit}>
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          <GridItem colSpan={1}>
            <FormControl>
              <FormLabel>
                {role === 'Provider' ? 'Select Provider' : 'Select Demander'}
              </FormLabel>
              <Select
                value={formData.entityId}
                onChange={e => setFormData(prev => ({ ...prev, entityId: e.target.value }))}
                isDisabled={loadingEntities}
              >
                {(role === 'Provider' ? providers : demanders).map(entity => (
                  <option key={entity._id} value={entity._id}>
                    {entity.businessName}
                  </option>
                ))}
              </Select>
            </FormControl>
          </GridItem>

          {role === 'Demander' && (
            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel>Select Source Provider</FormLabel>
                <Select
                  value={formData.targetProviderId}
                  onChange={e => setFormData(prev => ({ ...prev, targetProviderId: e.target.value }))}
                  isDisabled={loadingEntities}
                >
                  <option value="">Select a provider</option>
                  {allProviders.map(provider => (
                    <option key={provider._id} value={provider._id}>
                      {provider.businessName}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
          )}
        </Grid>

        {role === 'Demander' && (
    <Box>
      <Heading size="md" mb={4}>Your Current Stock</Heading>
      {loadingDemanderStock ? (
        <Spinner />
      ) : currentDemanderStock.length > 0 ? (
        <SimpleGrid columns={[1, 2, 3]} spacing={4}>
          {currentDemanderStock.map((stockItem) => {
            // Handle both populated and unpopulated references
            const productId = stockItem.product_id?._id || stockItem.product_id;
            const providerId = stockItem.source_provider?._id || stockItem.source_provider;
            
            const product = allProducts.find(p => p._id === productId);
            const provider = allProviders.find(p => p._id === providerId);
            
            return (
              <Card key={stockItem._id}>
                <CardHeader>
                  <Text fontWeight="bold">
                    {product?.name || 'Unknown Product'}
                  </Text>
                </CardHeader>
                <CardBody>
                  <Text>Quantity: {stockItem.quantity}</Text>
                  {stockItem.expiration_date && (
                    <Text>Expires: {new Date(stockItem.expiration_date).toLocaleDateString()}</Text>
                  )}
                  <Text fontSize="sm" color="gray.500">
                    From: {provider?.businessName || 'Unknown Provider'}
                  </Text>
                </CardBody>
              </Card>
            );
          })}
        </SimpleGrid>
      ) : (
        <Alert status="info">
          <AlertIcon />
          Your stock is currently empty
        </Alert>
      )}
    </Box>
  )}

        {role === 'Provider' ? (
          <Grid templateColumns="repeat(4, 1fr)" gap={4}>
            <GridItem colSpan={2}>
              <Select
                value={formData.selectedProduct}
                onChange={e => setFormData(prev => ({ ...prev, selectedProduct: e.target.value }))}
                placeholder="Select product"
                isDisabled={loadingProducts}
              >
                {products.map(product => (
                  <option key={product._id} value={product._id}>
                    {product.name} ({product.category})
                  </option>
                ))}
              </Select>
            </GridItem>
            <GridItem colSpan={1}>
              <Input
                type="number"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={e => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
              />
            </GridItem>
            <GridItem colSpan={1}>
              <Button onClick={handleProviderAddItem} colorScheme="blue">
                Add to List
              </Button>
            </GridItem>
          </Grid>
        ) : (
          <Box>
            <Heading size="md" mb={4}>Available Stock from Provider</Heading>
            {loadingProviderStock ? (
              <Spinner />
            ) : selectedProviderStock.length > 0 ? (
              <SimpleGrid columns={[1, 2, 3]} spacing={4}>
                {selectedProviderStock.map(item => (
                  <Card key={item.product_id?._id || item.product_id}>
                    <CardHeader>
                      <Text fontWeight="bold">{item.product_id?.name || 'Unknown Product'}</Text>
                    </CardHeader>
                    <CardBody>
                      <Text>Available: {item.quantity}</Text>
                      {item.expiration_date && (
                        <Text>Expires: {new Date(item.expiration_date).toLocaleDateString()}</Text>
                      )}
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            ) : (
              <Alert status="info">
                <AlertIcon />
                No stock available from selected provider
              </Alert>
            )}
          </Box>
        )}

        {formData.items.length > 0 && (
          <Box borderWidth={1} p={4} borderRadius="md">
            <Text fontWeight="bold" mb={2}>Selected Items:</Text>
            {formData.items.map((item, index) => {
              const product = allProducts.find(p => p._id === item.product_id);
              return (
                <Text key={index}>
                  {product?.name || 'Unknown Product'}: {item.quantity}
                </Text>
              );
            })}
          </Box>
        )}

        <Button
          type="submit"
          colorScheme="green"
          isDisabled={formData.items.length === 0}
        >
          {role === 'Provider' ? 'Update Stock' : 'Transfer Items'}
        </Button>
      </Stack>

      {role === 'Provider' && (
        <Box>
          <Heading size="md" mb={4}>Your Current Stock</Heading>
          {loadingProviderStock ? (
            <Spinner />
          ) : selectedProviderStock.length > 0 ? (
            <SimpleGrid columns={[1, 2, 3]} spacing={4}>
              {selectedProviderStock.map(item => (
                <Card key={item.product_id?._id || item.product_id}>
                  <CardHeader>
                    <Text fontWeight="bold">{item.product_id?.name || 'Unknown Product'}</Text>
                  </CardHeader>
                  <CardBody>
                    <Text>Quantity: {item.quantity}</Text>
                    {item.expiration_date && (
                      <Text>Expires: {new Date(item.expiration_date).toLocaleDateString()}</Text>
                    )}
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          ) : (
            <Alert status="info">
              <AlertIcon />
              Your stock is currently empty
            </Alert>
          )}
        </Box>
      )}
    </Box>
  );
};

export default StockTransfer;