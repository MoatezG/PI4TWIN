import React, { useState, useEffect } from 'react';
import { 
  Box, FormControl, FormLabel, Select, 
  Button, useToast, Spinner, Text
} from '@chakra-ui/react';
import stockService from '../../../../services/stockService';
import providerService from '../../../../services/providerService';
import demanderService from '../../../../services/demanderService';
import { getCurrentUser } from '../../../../utils/auth';

const InitializeStock = () => {
  const toast = useToast();
  const user = getCurrentUser();
  const role = user?.role?.toLowerCase();
  
  const [loading, setLoading] = useState(false);
  const [entities, setEntities] = useState([]);
  const [selectedEntityId, setSelectedEntityId] = useState('');

  // Load existing entities based on role
  useEffect(() => {
    let isMounted = true;
    const fetchEntities = async () => {
      try {
        setLoading(true);
        let data = [];
        
        if (role === 'provider') {
          data = await providerService.getProvidersByUserId(user.id);
        } else if (role === 'demander') {
          data = await demanderService.getDemandersByUserId(user.id);
        }
        
        if (isMounted) {
          setEntities(data);
          if (data.length > 0) setSelectedEntityId(data[0]._id);
        }
      } catch (error) {
        console.error('Error fetching entities:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (user?.id && role) fetchEntities();
    return () => { isMounted = false };
  }, [user?.id, role]);

  const handleInitializeStock = async (e) => {
    e.preventDefault();
    if (!selectedEntityId) return;

    try {
      setLoading(true);

      let response;
      if (role === 'provider') {
        response = await stockService.initializeProviderStock(selectedEntityId);
      } else {
        response = await stockService.initializeDemanderStock(selectedEntityId);
      }

      if (response.message === 'Stock already exists') {
        toast({
          title: 'Stock Already Exists',
          description: `A stock already exists for this ${role}.`,
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Empty Stock Initialized!',
          description: `Empty stock created for ${role}.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Initialization failed',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Text>Please login first</Text>;
  if (!role) return <Text>Unauthorized access</Text>;

  const entityType = role === 'provider' ? 'Provider' : 'Demander';
  const entityLabel = role === 'provider' ? 'Business' : 'Organization';

  return (
    <Box p={4} maxW="500px">
      {loading ? (
        <Spinner size="xl" />
      ) : entities.length === 0 ? (
        <Text>No {entityType} profiles found. Please create one first.</Text>
      ) : (
        <form onSubmit={handleInitializeStock}>
          <FormControl mb={4}>
            <FormLabel>Select {entityLabel}</FormLabel>
            <Select
              value={selectedEntityId}
              onChange={(e) => setSelectedEntityId(e.target.value)}
              required
            >
              {entities.map(entity => (
                <option key={entity._id} value={entity._id}>
                  {entity.businessName} - {entity.location}
                </option>
              ))}
            </Select>
          </FormControl>

          <Button 
            type="submit" 
            colorScheme="blue" 
            isLoading={loading}
            width="full"
          >
            Initialize Empty Stock
          </Button>
        </form>
      )}
    </Box>
  );
};

export default InitializeStock;