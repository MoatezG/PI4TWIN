import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Heading, Select, SimpleGrid, Card, CardHeader, CardBody,
  Stack, StackDivider, Text, Spinner, Alert, AlertIcon,
  AlertTitle, AlertDescription, Grid, GridItem
} from '@chakra-ui/react';
import stockService from '../../../../services/stockService';
import { getCurrentUser } from '../../../../utils/auth';
import demanderService from '../../../../services/demanderService';

const DemanderStock = () => {
  const user = getCurrentUser();
  const [demanders, setDemanders] = useState([]);
  const [selectedDemander, setSelectedDemander] = useState(null);
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDemanders, setLoadingDemanders] = useState(false);
  const [error, setError] = useState(null);

  const fetchDemanders = useCallback(async () => {
    if (!user || (user.role !== 'Demander' && user.role !== 'Admin')) return;

    try {
      setLoadingDemanders(true);
      let data;
      if (user.role === 'Demander') {
        data = await demanderService.getDemandersByUserId(user.id);
      } else {
        data = await demanderService.getAllDemanders();
      }
      setDemanders(data);
      if (data.length > 0) {
        if (user.role === 'Demander') {
          setSelectedDemander(data.find(d => d._id === user.id) || data[0]);
        } else {
          setSelectedDemander(data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching demanders:', error);
      setError('Failed to load demanders');
    } finally {
      setLoadingDemanders(false);
    }
  }, [user?.id, user?.role]);

  const fetchStock = useCallback(async (demanderId) => {
    if (!demanderId) return;

    try {
      setLoading(true);
      const { data } = await stockService.getDemanderStock(demanderId);
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
    fetchDemanders();
  }, [fetchDemanders]);

  useEffect(() => {
    if (selectedDemander?._id) {
      fetchStock(selectedDemander._id);
    }
  }, [selectedDemander, fetchStock]);

  if (!user) return <Box>Redirecting to login...</Box>;
  if (user.role !== 'Demander' && user.role !== 'Admin') return <Box>Access denied</Box>;

  return (
    <Box p={4}>
      <Heading mb={6} fontSize="2xl">
        Demander Inventory
      </Heading>

      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loadingDemanders ? (
        <Spinner size="xl" />
      ) : demanders.length === 0 ? (
        <Alert status="info">
          <AlertIcon />
          No demander profiles found. Please initialize a demander profile first.
        </Alert>
      ) : (
        <>
          <Grid templateColumns="repeat(3, 1fr)" gap={4} mb={6}>
            <GridItem colSpan={[3, 1]}>
              <Select
                value={selectedDemander?._id || ''}
                onChange={(e) => {
                  const found = demanders.find(d => d._id === e.target.value);
                  setSelectedDemander(found);
                }}
                disabled={loading}
              >
                {demanders.map(demander => (
                  <option key={demander._id} value={demander._id}>
                    {demander.businessName}
                  </option>
                ))}
              </Select>
            </GridItem>

            {selectedDemander && (
              <GridItem colSpan={[3, 2]}>
                <Card variant="filled">
                  <CardBody>
                    <Stack spacing={1}>
                      <Text fontSize="xl" fontWeight="bold">
                        {selectedDemander.businessName}
                      </Text>
                      <Text>{selectedDemander.businessType}</Text>
                      <Text fontSize="sm" color="gray.600">
                        Location: {selectedDemander.location}
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
              No stock items found for this demander
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

export default DemanderStock;