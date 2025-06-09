import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
// ...existing imports...

const API_URL = "http://localhost:5000/api";

function SignInAdmin() {
  // ...existing code...
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [render, setRender] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setRender(true);
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const googleId = urlParams.get('googleId');
    if (token && googleId) {
      localStorage.setItem('token', token);
      fetchUserData(token, googleId);
    }
  }, []);

  const fetchUserData = async (token, googleId) => {
    try {
      const response = await fetch(`${API_URL}/admins/login`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        navigate('/admin/default');
      } else {
        console.error('Error fetching user data:', data.error);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/admins/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      const data = await response.json();
      setLoading(false);
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/home');
      } else {
        console.error(data.error);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
    <Flex>
      <Box me="auto">
        <Heading color={textColor} fontSize="36px" mb="10px">
          Admin Sign Up
        </Heading>
        <Text mb="36px" ms="4px" color={textColorSecondary} fontWeight="400" fontSize="md">
          Enter your details to create an admin account!
        </Text>
      </Box>
      <Flex>
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
            {error && (
              <Alert status="error" mb="24px">
                <AlertIcon />
                {error}
              </Alert>
            )}
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
            <Link to="/auth/sign-in-admin">
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

export default SignInAdmin;
