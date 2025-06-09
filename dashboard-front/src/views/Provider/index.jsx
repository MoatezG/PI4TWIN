import React, { useState, useEffect } from "react";
import {
    Box,
    Flex,
    Text,
    Link,
    useColorModeValue,
    SimpleGrid,
    Icon,
    Spinner,
    Alert,
    AlertIcon,
} from "@chakra-ui/react";

import Provider from "components/card/Provider";
import { MdFastfood, MdBakeryDining, MdEmojiFoodBeverage, MdRestaurant } from "react-icons/md";
import providerService from "../../services/providerService.jsx";
import Chatbot from "./components/Chatbot";

// You might want to replace these with actual provider images later
import Nft1 from "assets/img/nfts/Nft1.png";
import Nft2 from "assets/img/nfts/Nft2.png";
import Nft3 from "assets/img/nfts/Nft3.png";
import Nft4 from "assets/img/nfts/Nft4.png";
import Nft5 from "assets/img/nfts/Nft5.png";

export default function ProvidersListingView() {
    const textColor = useColorModeValue("secondaryGray.900", "white");
    const textColorBrand = useColorModeValue("brand.500", "white");
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProviderId, setSelectedProviderId] = useState(null);

    const fetchProviders = async (category = null) => {
        try {
            setLoading(true);
            setError(null);
            let data;

            if (category) {
                data = await providerService.getProvidersByCategory(category);
            } else {
                data = await providerService.getAllProviders();
            }

            setProviders(data);
        } catch (err) {
            setError(err.message || "Failed to fetch providers");
            console.error("Error fetching providers:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProviders();
    }, []);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        fetchProviders(category);
        setSelectedProviderId(null); // Deselect provider on category change
    };

    return (
        <>
            <Box
  pt={{ base: "180px", md: "80px", xl: "80px" }}
  onClick={() => setSelectedProviderId(null)}
  style={{ cursor: selectedProviderId ? 'pointer' : 'default' }}
>
  <Flex direction="column" onClick={e => e.stopPropagation()}>
                    <Flex
                        mt="45px"
                        mb="20px"
                        justifyContent="space-between"
                        direction={{ base: "column", md: "row" }}
                        align={{ base: "start", md: "center" }}
                    >
                        <Text color={textColor} fontSize="2xl" ms="24px" fontWeight="700">
                            Food Providers Near You
                        </Text>
                        <Flex
                            ms={{ base: "24px", md: "0px" }}
                            mt={{ base: "20px", md: "0px" }}
                            align="center"
                        >
                            <Link
                                color={textColorBrand}
                                fontWeight="500"
                                me={{ base: "34px", md: "44px" }}
                                onClick={() => handleCategoryClick(null)}
                                cursor="pointer"
                                display="flex"
                                alignItems="center"
                            >
                                <Icon as={MdFastfood} mr="2" />
                                All
                            </Link>
                            <Link
                                color={textColorBrand}
                                fontWeight="500"
                                me={{ base: "34px", md: "44px" }}
                                onClick={() => handleCategoryClick("Meals")}
                                cursor="pointer"
                                display="flex"
                                alignItems="center"
                            >
                                <Icon as={MdFastfood} mr="2" />
                                Meals
                            </Link>
                            <Link
                                color={textColorBrand}
                                fontWeight="500"
                                me={{ base: "34px", md: "44px" }}
                                onClick={() => handleCategoryClick("Bakery")}
                                cursor="pointer"
                                display="flex"
                                alignItems="center"
                            >
                                <Icon as={MdBakeryDining} mr="2" />
                                Bakery
                            </Link>
                            <Link
                                color={textColorBrand}
                                fontWeight="500"
                                me={{ base: "34px", md: "44px" }}
                                onClick={() => handleCategoryClick("Beverages")}
                                cursor="pointer"
                                display="flex"
                                alignItems="center"
                            >
                                <Icon as={MdEmojiFoodBeverage} mr="2" />
                                Beverages
                            </Link>
                            <Link
                                color={textColorBrand}
                                fontWeight="500"
                                onClick={() => handleCategoryClick("Fresh")}
                                cursor="pointer"
                                display="flex"
                                alignItems="center"
                            >
                                <Icon as={MdRestaurant} mr="2" />
                                Fresh
                            </Link>
                        </Flex>
                    </Flex>

                    {loading ? (
                        <Flex justify="center" align="center" h="200px">
                            <Spinner size="xl" color="brand.500" />
                        </Flex>
                    ) : error ? (
                        <Alert status="error" mx="24px">
                            <AlertIcon />
                            {error}
                        </Alert>
                    ) : providers.length === 0 ? (
                        <Text textAlign="center" color={textColor} fontSize="lg" my="20px">
                            No providers found for this category.
                        </Text>
                    ) : (
                        <div onClick={() => setSelectedProviderId(null)} style={{ width: '100%' }}>
  <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap="20px" mx="24px">
    {providers.map((provider) => (
      <div key={provider._id} onClick={e => e.stopPropagation()}>
        <Provider
          id={provider._id}
          name={provider.businessName}
          location={provider.location}
          categories={provider.categories.join(", ")}
          quantity={provider.quantity}
          pickupTimes={provider.pickupTimes}
          averageRating={provider.averageRating}
          ratingCount={provider.ratingCount}
          badges={provider.badges}
          image={provider.imageUrl || Nft1}
          isSelected={selectedProviderId === provider._id}
          onSelect={() => setSelectedProviderId(provider._id)}
        />
      </div>
    ))}
  </SimpleGrid>
</div>
                    )}
                </Flex>
            </Box>
            <Chatbot providerId={selectedProviderId} />
        </>
    );
}
