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

export default function RoleBasedForm() {
  // User state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Provider form states
  const [providerForm, setProviderForm] = useState({
    businessName: "",
    location: "",
    businessType: "",
    categories: [],
    quantity: "0 items available",
    pickupTimes: "",
    rating: "0 🌿",
    imageUrl: "",
  });
  const [providerStep, setProviderStep] = useState(1);

  // Demander form states
  const [demanderForm, setDemanderForm] = useState({
    businessName: "",
    businessType: "",
    location: "",
  });

  // Theme colors
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const brandStars = useColorModeValue("brand.500", "brand.300");

  // Initialize user data
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData);
    }
  }, []);

  // Handle successful submission
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        window.location.reload(); // Refresh the page after success
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Provider form handlers
  const handleProviderChange = (e) => {
    const { name, value } = e.target;
    setProviderForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setProviderForm(prev => {
      if (checked) {
        return { ...prev, categories: [...prev.categories, value] };
      } else {
        return { ...prev, categories: prev.categories.filter(cat => cat !== value) };
      }
    });
  };

  const handleProviderNext = () => setProviderStep(prev => prev + 1);
  const handleProviderBack = () => setProviderStep(prev => prev - 1);

  // Demander form handler
  const handleDemanderChange = (e) => {
    const { name, value } = e.target;
    setDemanderForm(prev => ({ ...prev, [name]: value }));
  };

  // Submit handlers
  const submitProviderForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const data = {
        ...providerForm,
        user_id: user.id,
      };

      await axios.post(`${API_URL}/providers`, data, config);
      setSuccess(true);
    } catch (error) {
      setError(error.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const submitDemanderForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const data = {
        ...demanderForm,
        user_id: user.id,
      };

      await axios.post(`${API_URL}/demanders`, data, config);
      setSuccess(true);
    } catch (error) {
      setError(error.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = [
    "Fruits", "Vegetables", "Baked Goods", "Dairy",
    "Meat", "Grains", "Prepared Foods", "Other"
  ];

  if (!user) return <Spinner />;

  return (
    <Flex direction="column">
      {/* Success Alert */}
      {success && (
        <Alert status="success" mb="24px">
          <AlertIcon />
          Form submitted successfully! The page will refresh shortly.
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert status="error" mb="24px">
          <AlertIcon />
          {error}
        </Alert>
      )}

      {user.role === "Provider" ? (
        // Provider Form (multi-step)
        <form onSubmit={submitProviderForm}>
          {/* Step 1: Basic Information */}
          {providerStep === 1 && (
            <>
              <FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" color={textColor} mb="8px">
                Business Name<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                name="businessName"
                isRequired
                variant="auth"
                fontSize="sm"
                type="text"
                placeholder="Business Name"
                mb="24px"
                fontWeight="500"
                size="lg"
                value={providerForm.businessName}
                onChange={handleProviderChange}
              />

              <FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" color={textColor} mb="8px">
                Business Type<Text color={brandStars}>*</Text>
              </FormLabel>
              <Select
                name="businessType"
                placeholder="Select business type"
                mb="24px"
                size="lg"
                variant="auth"
                isRequired
                value={providerForm.businessType}
                onChange={handleProviderChange}
              >
                <option value="Organic">Organic</option>
                <option value="Product">Product</option>
                <option value="Farm">Farm</option>
                <option value="Bakery">Bakery</option>
              </Select>

              <FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" color={textColor} mb="8px">
                Location<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                name="location"
                isRequired
                variant="auth"
                fontSize="sm"
                type="text"
                placeholder="Location"
                mb="24px"
                fontWeight="500"
                size="lg"
                value={providerForm.location}
                onChange={handleProviderChange}
              />

              <Button
                fontSize="sm"
                variant="brand"
                fontWeight="500"
                w="100%"
                h="50"
                mb="24px"
                onClick={handleProviderNext}
                disabled={!providerForm.businessName || !providerForm.businessType || !providerForm.location}
              >
                Next
              </Button>
            </>
          )}

          {/* Step 2: Categories */}
          {providerStep === 2 && (
            <>
              <FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" color={textColor} mb="8px">
                Categories<Text color={brandStars}>*</Text>
              </FormLabel>
              <Flex direction="column" mb="24px">
                {categoryOptions.map(category => (
                  <Checkbox
                    key={category}
                    name="categories"
                    value={category}
                    isChecked={providerForm.categories.includes(category)}
                    onChange={handleCategoryChange}
                    mb="10px"
                  >
                    {category}
                  </Checkbox>
                ))}
              </Flex>

              <Flex gap="4">
                <Button
                  fontSize="sm"
                  variant="outline"
                  fontWeight="500"
                  w="50%"
                  h="50"
                  mb="24px"
                  onClick={handleProviderBack}
                >
                  Back
                </Button>
                <Button
                  fontSize="sm"
                  variant="brand"
                  fontWeight="500"
                  w="50%"
                  h="50"
                  mb="24px"
                  onClick={handleProviderNext}
                  disabled={providerForm.categories.length === 0}
                >
                  Next
                </Button>
              </Flex>
            </>
          )}

          {/* Step 3: Additional Info */}
          {providerStep === 3 && (
            <>
              <FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" color={textColor} mb="8px">
                Pickup Times<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                name="pickupTimes"
                isRequired
                variant="auth"
                fontSize="sm"
                type="text"
                placeholder="e.g., 9 AM - 5 PM"
                mb="24px"
                fontWeight="500"
                size="lg"
                value={providerForm.pickupTimes}
                onChange={handleProviderChange}
              />

              <FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" color={textColor} mb="8px">
                Image URL
              </FormLabel>
              <Input
                name="imageUrl"
                variant="auth"
                fontSize="sm"
                type="url"
                placeholder="https://example.com/image.jpg"
                mb="24px"
                fontWeight="500"
                size="lg"
                value={providerForm.imageUrl}
                onChange={handleProviderChange}
              />
              <FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" color={textColor} mb="8px">
      Maximum Items (Quantity)<Text color={brandStars}>*</Text>
    </FormLabel>
    <Input
      name="quantity"
      isRequired
      variant="auth"
      fontSize="sm"
      type="number"
      min="10"
      max="20"
      placeholder="10-20"
      mb="24px"
      fontWeight="500"
      size="lg"
      value={providerForm.quantity}
      onChange={handleProviderChange}
    />

              <Flex justifyContent="space-between" align="center" mb="24px">
                <FormControl display="flex" alignItems="center">
                  <Checkbox id="terms" colorScheme="brandScheme" me="10px" isRequired />
                  <FormLabel htmlFor="terms" mb="0" fontWeight="normal" color={textColor} fontSize="sm">
                    I agree to the terms and conditions
                  </FormLabel>
                </FormControl>
              </Flex>

              <Flex gap="4">
                <Button
                  fontSize="sm"
                  variant="outline"
                  fontWeight="500"
                  w="50%"
                  h="50"
                  mb="24px"
                  onClick={handleProviderBack}
                >
                  Back
                </Button>
                <Button
                  fontSize="sm"
                  variant="brand"
                  fontWeight="500"
                  w="50%"
                  h="50"
                  mb="24px"
                  type="submit"
                  disabled={loading || !providerForm.pickupTimes}
                >
                  {loading ? <Spinner size="sm" /> : "Submit"}
                </Button>
              </Flex>
            </>
          )}
        </form>
      ) : (
        // Demander Form (simple)
        <form onSubmit={submitDemanderForm}>
          <FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" color={textColor} mb="8px">
            Business Name<Text color={brandStars}>*</Text>
          </FormLabel>
          <Input
            name="businessName"
            isRequired
            variant="auth"
            fontSize="sm"
            type="text"
            placeholder="Business Name"
            mb="24px"
            fontWeight="500"
            size="lg"
            value={demanderForm.businessName}
            onChange={handleDemanderChange}
          />

          <FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" color={textColor} mb="8px">
            Business Type<Text color={brandStars}>*</Text>
          </FormLabel>
          <Select
            name="businessType"
            placeholder="Select business type"
            mb="24px"
            size="lg"
            variant="auth"
            isRequired
            value={demanderForm.businessType}
            onChange={handleDemanderChange}
          >
            <option value="Restaurant">Restaurant</option>
            <option value="Cafe">Cafe</option>
            <option value="Store">Store</option>
            <option value="Other">Other</option>
          </Select>

          <FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" color={textColor} mb="8px">
            Location<Text color={brandStars}>*</Text>
          </FormLabel>
          <Input
            name="location"
            isRequired
            variant="auth"
            fontSize="sm"
            type="text"
            placeholder="Location"
            mb="24px"
            fontWeight="500"
            size="lg"
            value={demanderForm.location}
            onChange={handleDemanderChange}
          />

          <Flex justifyContent="space-between" align="center" mb="24px">
            <FormControl display="flex" alignItems="center">
              <Checkbox id="terms" colorScheme="brandScheme" me="10px" isRequired />
              <FormLabel htmlFor="terms" mb="0" fontWeight="normal" color={textColor} fontSize="sm">
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
            disabled={loading || !demanderForm.businessName || !demanderForm.businessType || !demanderForm.location}
          >
            {loading ? <Spinner size="sm" /> : "Submit"}
          </Button>
        </form>
      )}
    </Flex>
  );
}
