// Chakra imports
import { Box, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import ColumnsTable from "views/admin/userManagement/components/ColumnsTable";
import React, { useState, useEffect } from "react";
import { getSupermarkets, getDemanders } from "services/adminService";

export default function Management() {
  const [supermarkets, setSupermarkets] = useState([]);
  const [demanders, setDemanders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [supermarketsData, demandersData] = await Promise.all([
          getSupermarkets(),
          getDemanders()
        ]);
        setSupermarkets(supermarketsData);
        setDemanders(demandersData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const supermarketColumns = [
    {
      header: "NAME",
      accessorKey: "name",
    },
    {
      header: "LOCATION",
      accessorKey: "location",
    },
    {
      header: "CREATED AT",
      accessorKey: "created_at",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    },
  ];

  const demanderColumns = [
    {
      header: "NAME",
      accessorKey: "name",
    },
    {
      header: "BUSINESS TYPE",
      accessorKey: "business_type",
    },
    {
      header: "LOCATION",
      accessorKey: "location",
    },
    {
      header: "CREATED AT",
      accessorKey: "created_at",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    },
  ];

  if (loading) return <Spinner size="xl" />;
  if (error) return <Text color="red.500">Error: {error}</Text>;

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        mb='20px'
        columns={{ sm: 1, md: 2 }}
        spacing={{ base: "20px", xl: "20px" }}
        alignItems="start">
        <ColumnsTable
          columnsData={supermarketColumns}
          tableData={supermarkets}
          title="Supermarkets"
        />
        <ColumnsTable
          columnsData={demanderColumns}
          tableData={demanders}
          title="Demanders"
        />
      </SimpleGrid>
    </Box>
  );
}
