import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'; // Changed useHistory to useNavigate
import axios from "axios";

// Chakra imports
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  Select,
  Spinner,
  Alert,
  AlertIcon,
  useToast, // Import Chakra UI toast
} from "@chakra-ui/react";
// Custom components
import { HSeparator } from "components/separator/Separator";
import DefaultAuth from "layouts/auth/Default";
// Assets
import illustration from "assets/img/auth/auth.png";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";

const API_URL = "http://localhost:5000/api";

function SignUp() {
  // Chakra color mode
  const textColor = useColorModeValue("brand.500", "white");
  const textColorSecondary = "gray.400";
  const textColorDetails = useColorModeValue("brand.500", "secondaryGray.600");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const googleBg = useColorModeValue("secondaryGray.300", "whiteAlpha.200");
  const googleText = useColorModeValue("brand.500", "white");
  const googleHover = useColorModeValue({ bg: "gray.200" }, { bg: "whiteAlpha.300" });
  const googleActive = useColorModeValue({ bg: "secondaryGray.300" }, { bg: "whiteAlpha.200" });

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  // Form state
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Changed history to navigate
  const toast = useToast(); // Initialize toast

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate password match
    if (password !== confirmPassword) {
      toast({
        title: "Error.",
        description: "Passwords do not match.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/users/signup`, {
        fullname, email, password, confirmPassword, role
      });
      setLoading(false);
      if (response.status === 200 || response.status === 201) {
        toast({
          title: "Sign-up successful.",
          description: "Please check your email for verification.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate('/auth/sign-in'); // Navigate back to login page
      } else {
        toast({
          title: "Sign-up failed.",
          description: response.data.error || "An error occurred during sign-up.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      setLoading(false);
      // Always show the success message if the user is created
      if (error.response && error.response.status === 201) {
        toast({
          title: "Sign-up successful.",
          description: "Please check your email for verification.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate('/auth/sign-in');
      } else {
        toast({
          title: "Error.",
          description: "An unexpected error occurred. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w="100%"
        mx={{ base: "auto", lg: "0px" }}
        me="auto"
        h="100%"
        alignItems="start"
        justifyContent="center"
        mb={{ base: "30px", md: "60px" }}
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "14vh" }}
        flexDirection="column"
      >
        <Box me="auto">
          <Heading color={textColor} fontSize="36px" mb="10px">
            Sign Up
          </Heading>
          <Text mb="36px" ms="4px" color={textColorSecondary} fontWeight="400" fontSize="md">
            Enter your details to create an account!
          </Text>
        </Box>
        <Flex
          zIndex="2"
          direction="column"
          w={{ base: "100%", md: "420px" }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: "auto", lg: "unset" }}
          me="auto"
          mb={{ base: "20px", md: "auto" }}
        >
          <Button
            fontSize="sm"
            me="0px"
            mb="26px"
            py="15px"
            h="50px"
            borderRadius="16px"
            bg={googleBg}
            color={googleText}
            fontWeight="500"
            _hover={googleHover}
            _active={googleActive}
            _focus={googleActive}
          >
            <Icon as={FcGoogle} w="20px" h="20px" me="10px" />
            Sign up with Google
          </Button>
          <Flex align="center" mb="15px">
            <HSeparator />
            <Text color="gray.400" mx="14px">
              or
            </Text>
            <HSeparator />
          </Flex>
          <form onSubmit={handleSubmit}>
            <FormControl>
              <FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" color={textColor} mb="8px">
                Full Name<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired={true}
                variant="auth"
                fontSize="sm"
                ms={{ base: "0px", md: "0px" }}
                type="text"
                placeholder="John Doe"
                mb="24px"
                fontWeight="500"
                size="lg"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
              <FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" color={textColor} mb="8px">
                Email<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired={true}
                variant="auth"
                fontSize="sm"
                ms={{ base: "0px", md: "0px" }}
                type="email"
                placeholder="mail@simmmple.com"
                mb="24px"
                fontWeight="500"
                size="lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormLabel ms="4px" fontSize="sm" fontWeight="500" color={textColor} display="flex">
                Password<Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size="md">
                <Input
                  isRequired={true}
                  fontSize="sm"
                  placeholder="Min. 8 characters"
                  mb="24px"
                  size="lg"
                  type={show ? "text" : "password"}
                  variant="auth"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement display="flex" alignItems="center" mt="4px">
                  <Icon
                    color={textColorSecondary}
                    _hover={{ cursor: "pointer" }}
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={handleClick}
                  />
                </InputRightElement>
              </InputGroup>
              <FormLabel ms="4px" fontSize="sm" fontWeight="500" color={textColor} display="flex">
                Confirm Password<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired={true}
                fontSize="sm"
                placeholder="Confirm Password"
                mb="24px"
                size="lg"
                type="password"
                variant="auth"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <FormLabel ms="4px" fontSize="sm" fontWeight="500" color={textColor} display="flex">
                Role<Text color={brandStars}>*</Text>
              </FormLabel>
              <Select
                placeholder="Select role"
                mb="24px"
                size="lg"
                variant="auth"
                isRequired={true}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Demander">Demander</option>
                <option value="Provider">Provider</option>
              </Select>
              {error && (
                <Alert status="error" mb="24px">
                  <AlertIcon />
                  {error}
                </Alert>
              )}
              <Flex justifyContent="space-between" align="center" mb="24px">
                <FormControl display="flex" alignItems="center">
                  <Checkbox id="terms" colorScheme="brandScheme" me="10px" />
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
                disabled={loading}
              >
                {loading ? <Spinner size="sm" /> : "Sign Up"}
              </Button>
            </FormControl>
          </form>
          <Flex flexDirection="column" justifyContent="center" alignItems="start" maxW="100%" mt="0px">
            <Text color={textColorDetails} fontWeight="400" fontSize="14px">
              Already have an account?
              <Link to="/auth/sign-in">
                <Text color={textColorBrand} as="span" ms="5px" fontWeight="500">
                  Sign In
                </Text>
              </Link>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignUp;
