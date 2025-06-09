import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Heading, Select, SimpleGrid, Card, CardHeader, CardBody,
  Stack, StackDivider, Text, Spinner, Alert, AlertIcon,
  AlertTitle, AlertDescription, Grid, GridItem
} from '@chakra-ui/react';
import stockService from '../../../../services/stockService';
import { getCurrentUser } from '../../../../utils/auth';
import providerService from '../../../../services/providerService';

const ProviderStock = () => {
  const user = getCurrentUser();
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [error, setError] = useState(null);

  const fetchProviders = useCallback(async () => {
    if (!user || (user.role !== 'Provider' && user.role !== 'Admin')) return;

    try {
      setLoadingProviders(true);
      const data = await providerService.getAllProviders();
      setProviders(data);
      if (data.length > 0) {
        if (user.role === 'Provider') {
          setSelectedProvider(data.find(p => p._id === user.id) || data[0]);
        } else {
          setSelectedProvider(data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching providers:', error);
      setError('Failed to load providers');
    } finally {
      setLoadingProviders(false);
    }
  }, [user?.role, user?.id]);

  const fetchStock = useCallback(async (providerId) => {
    if (!providerId) return;

    try {
      setLoading(true);
      const { data } = await stockService.getProviderStock(providerId);
      setStock(data || []);
    } catch (error) {
      console.error('Stock fetch error:', error);
      setError(error.message);
      setStock([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  useEffect(() => {
    if (selectedProvider?._id) {
      fetchStock(selectedProvider._id);
    }
  }, [selectedProvider, fetchStock]);

  if (!user) return <Box>Redirecting to login...</Box>;
  if (user.role !== 'Provider' && user.role !== 'Admin') return <Box>Access denied</Box>;

  return (
    <Box p={4}>
      <Heading mb={6} fontSize="2xl">
        Provider Inventory
      </Heading>

      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loadingProviders ? (
        <Spinner size="xl" />
      ) : providers.length === 0 ? (
        <Alert status="info">
          <AlertIcon />
          No provider profiles found. Please initialize a provider profile first.
        </Alert>
      ) : (
        <>
          <Grid templateColumns="repeat(3, 1fr)" gap={4} mb={6}>
            <GridItem colSpan={[3, 1]}>
              <Select
                value={selectedProvider?._id || ''}
                onChange={(e) => {
                  const found = providers.find(p => p._id === e.target.value);
                  setSelectedProvider(found);
                }}
                disabled={loading}
              >
                {providers.map(provider => (
                  <option key={provider._id} value={provider._id}>
                    {provider.businessName}
                  </option>
                ))}
              </Select>
            </GridItem>

            {selectedProvider && (
              <GridItem colSpan={[3, 2]}>
                <Card variant="filled">
                  <CardBody>
                    <Stack spacing={1}>
                      <Text fontSize="xl" fontWeight="bold">
                        {selectedProvider.businessName}
                      </Text>
                      <Text>{selectedProvider.businessType}</Text>
                      <Text fontSize="sm" color="gray.600">
                        Location: {selectedProvider.location}
                      </Text>
                    </Stack>
                  </CardBody>
                </Card>
              </GridItem>
            )}
          </Grid>

          {loading ? (
            <Spinner size="xl" />
          ) : stock.length === 0 ? (
            <Alert status="info">
              <AlertIcon />
              No stock items found for this provider
            </Alert>
          ) : (
            <SimpleGrid columns={[1, 2, 3]} spacing={4}>
              {stock.map(item => (
                <Card key={item._id} variant="outline">
                  <CardHeader pb={0}>
                    <Text fontSize="lg" fontWeight="bold">
                      {item.product_id?.name || 'Unknown Product'}
                    </Text>
                  </CardHeader>
                  <CardBody>
                    <Stack divider={<StackDivider />} spacing={3}>
                      <Box>
                        <Text fontSize="2xl" fontWeight="medium">
                          {item.quantity} {item.unit}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          Unit Price: ${item.price_per_unit?.toFixed(2) || 'N/A'}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm">
                          From: {item.provider_id?.businessName || 'Unknown Provider'}
                        </Text>
                        {item.expiration_date && (
                          <Text fontSize="sm">
                            Expires: {new Date(item.expiration_date).toLocaleDateString()}
                          </Text>
                        )}
                      </Box>
                    </Stack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </>
      )}
    </Box>
  );
};

export default ProviderStock;