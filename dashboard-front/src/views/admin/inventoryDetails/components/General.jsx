// Chakra imports
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  Flex,
  Checkbox,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AfterGeneral from "./AfterGeneral";
const API_URL = "http://localhost:5000/api";
export default function ProviderForm() {
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setRole(user.role);
      setUserId(user.id);
    }
  }, []);

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const brandStars = useColorModeValue("brand.500", "brand.300");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const data = {
        businessName,
        businessType,
        location,
        user_id: userId,
      };
      if (role === "Provider") {
        await axios.post(`${API_URL}/providers`, data, config);
      } else if (role === "Demander") {
        await axios.post(`${API_URL}/demanders`, data, config);
      }
      fetchData(); // Refresh data after submission
    } catch (error) {
      setError(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const providersResponse = await axios.get(`${API_URL}/providers`, config);
      const demandersResponse = await axios.get(`${API_URL}/demanders`, config);

      const providersData = providersResponse.data.map(provider => ({
        businessName: provider.businessName,
        businessType: provider.businessType,
        location: provider.location,
        role: 'P'
      }));

      const demandersData = demandersResponse.data.map(demander => ({
        businessName: demander.name,
        businessType: demander.business_type,
        location: demander.location,
        role: 'D'
      }));

      setTableData([...providersData, ...demandersData]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBack = () => {
    setSubmitted(false);
  };

  return (
    <Flex direction="column">
      <form onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel
            display="flex"
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            mb="8px"
          >
            Business Name<Text color={brandStars}>*</Text>
          </FormLabel>
          <Input
            isRequired={true}
            variant="auth"
            fontSize="sm"
            ms={{ base: "0px", md: "0px" }}
            type="text"
            placeholder="Business Name"
            mb="24px"
            fontWeight="500"
            size="lg"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
          <FormLabel
            display="flex"
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            mb="8px"
          >
            Business Type<Text color={brandStars}>*</Text>
          </FormLabel>
          <Select
            placeholder="Select business type"
            mb="24px"
            size="lg"
            variant="auth"
            isRequired={true}
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
          >
            <option value="Organic">Organic</option>
            <option value="Product">Product</option>
          </Select>
          <FormLabel
            display="flex"
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            mb="8px"
          >
            Location<Text color={brandStars}>*</Text>
          </FormLabel>
          <Input
            isRequired={true}
            variant="auth"
            fontSize="sm"
            ms={{ base: "0px", md: "0px" }}
            type="text"
            placeholder="Location"
            mb="24px"
            fontWeight="500"
            size="lg"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          {error && (
            <Alert status="error" mb="24px">
              <AlertIcon />
              {error}
            </Alert>
          )}
          <Flex justifyContent="space-between" align="center" mb="24px">
            <FormControl display="flex" alignItems="center">
              <Checkbox id="terms" colorScheme="brandScheme" me="10px" />
              <FormLabel
                htmlFor="terms"
                mb="0"
                fontWeight="normal"
                color={textColor}
                fontSize="sm"
              >
                I agree to the terms and conditions
              </FormLabel>
            </FormControl>
          </Flex>
          <Button
            fontSize="sm"
            variant="brand"
            fontWeight="500"
            w="100%"
            h="50"
            mb="24px"
            type="submit"
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : "Submit"}
          </Button>
        </FormControl>
      </form>
     
    </Flex>
  );
}
