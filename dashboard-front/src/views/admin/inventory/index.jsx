// src/views/stock/index.jsx
import React from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box } from '@chakra-ui/react';
import ProviderStock from './components/ProviderStock';
import DemanderStock from './components/DemanderStock';
import StockTransfer from './components/StockTransfer';
import InitializeStock from './components/InitializeStock';

const StockPage = () => {
  return (
    <Box p={20}>
      <Tabs variant="enclosed">
        <TabList mb={4}>
          <Tab>Provider Stock</Tab>
          <Tab>Demander Stock</Tab>
          <Tab>Stock Transfers</Tab>
          <Tab>Initialize Stock</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <ProviderStock />
          </TabPanel>
          <TabPanel>
            <DemanderStock />
          </TabPanel>
          <TabPanel>
            <StockTransfer />
          </TabPanel>
          <TabPanel>
            <InitializeStock />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default StockPage;