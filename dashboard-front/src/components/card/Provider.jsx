// Chakra imports
import {
    Box,
    Flex,
    Icon,
    Image,
    Badge,
    Button,
    Text,
    useColorModeValue,
    Stack,
    HStack,
    VStack,
    Tag,
    TagLabel,
    TagLeftIcon,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.jsx";
// Assets
import React, { useState } from "react";
import { IoHeart, IoHeartOutline, IoLocation, IoTime, IoBasket, IoStar } from "react-icons/io5";
import ProviderImage from "assets/img/providers/provider-default.jpg";
import providerService from "../../services/providerService";
import { FaMedal } from "react-icons/fa";

export default function Provider(props) {
    const {
        image = ProviderImage,
        name,
        location,
        categories,
        quantity,
        pickupTimes,
        averageRating = 0,
        ratingCount = 0,
        badges = [],
        id,
        isSelected = false,
        onSelect
    } = props;

    const [favorite, setFavorite] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [showThanks, setShowThanks] = useState(false);
    const [currentAvg, setCurrentAvg] = useState(averageRating);
    const [currentCount, setCurrentCount] = useState(ratingCount);
    const [currentBadges, setCurrentBadges] = useState(badges);

    const textColor = useColorModeValue("navy.700", "white");
    const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
    const tagBg = useColorModeValue("gray.100", "navy.700");
    const greenColor = useColorModeValue("green.500", "green.400");
    const borderColor = isSelected ? greenColor : "transparent";

    // Split categories string into array
    const categoryList = categories ? categories.split(", ") : [];

    const handleRate = async (rating) => {
        setSubmitting(true);
        try {
            const res = await providerService.rateProvider(id, rating);
            setCurrentAvg(res.averageRating);
            setCurrentCount(res.ratingCount);
            setCurrentBadges(res.badges);
            setShowThanks(true);
            setTimeout(() => setShowThanks(false), 2000);
        } catch (err) {
            alert("Error submitting rating. Please try again.");
        }
        setSubmitting(false);
    };

    return (
        <Card p="20px"
            border={isSelected ? `2px solid ${greenColor}` : "2px solid transparent"}
            boxShadow={isSelected ? "0 0 0 2px #38A169" : undefined}
            cursor="pointer"
            onClick={onSelect}
            transition="border 0.2s, box-shadow 0.2s"
        >
            <Flex direction="column" h="100%">
                <Box position="relative" mb="20px">
                    <Image
                        src={image}
                        w="100%"
                        h="180px"
                        objectFit="cover"
                        borderRadius="16px"
                    />


                    {/* Average rating and count */}
                    <Badge
                        position="absolute"
                        bottom="14px"
                        left="14px"
                        colorScheme="green"
                        fontSize="sm"
                        borderRadius="full"
                        px="3"
                        display="flex"
                        alignItems="center"
                        boxShadow="md"
                        bg="white"
                    >
                        <HStack spacing="1">
                            {[1,2,3,4,5].map(i => (
                                <Icon key={i} as={IoStar} color={i <= Math.round(currentAvg) ? "yellow.400" : "gray.300"} />
                            ))}
                            <Text color="gray.700">{currentAvg.toFixed(1)} ({currentCount})</Text>
                        </HStack>
                    </Badge>

                    {/* Badge for Gold/Silver/Bronze */}
                    {currentBadges.length > 0 && (
                        <Badge
                            position="absolute"
                            top="14px"
                            left="14px"
                            colorScheme={
                                currentBadges[0] === "Gold" ? "yellow" :
                                currentBadges[0] === "Silver" ? "gray" :
                                currentBadges[0] === "Bronze" ? "orange" : "green"
                            }
                            fontSize="sm"
                            borderRadius="full"
                            px="3"
                        >
                            <HStack spacing="1">
                                {[1,2,3,4,5].map(i => (
                                    <Icon key={i} as={FaMedal} color={i <= 1 ? "yellow.400" : "gray.300"} />
                                ))}
                                <Text>{currentBadges[0]}</Text>
                            </HStack>
                        </Badge>
                    )}
                </Box>

                {/* Rating input */}
                <HStack spacing={1} mb={2}>
                    <Text fontSize="sm" color={textColorSecondary}>Rate this provider:</Text>
                    {[1,2,3,4,5].map(i => (
                        <Icon
                            key={i}
                            as={IoStar}
                            color={i <= userRating ? "yellow.400" : "gray.300"}
                            cursor="pointer"
                            onClick={e => { e.stopPropagation(); setUserRating(i); }}
                            boxSize={5}
                        />
                    ))}
                </HStack>
                <Button
                    size="xs"
                    colorScheme="green"
                    mb={2}
                    isLoading={submitting}
                    isDisabled={userRating === 0 || submitting}
                    onClick={e => { e.stopPropagation(); handleRate(userRating); }}
                >
                    Submit
                </Button>
                {showThanks && <Text color={greenColor} fontSize="sm">Thank you!</Text>}

                <VStack align="start" spacing={3} flex="1">
                    <Text
                        color={textColor}
                        fontSize="xl"
                        fontWeight="bold"
                    >
                        {name}
                    </Text>

                    <HStack>
                        <Icon as={IoLocation} color={textColorSecondary} />
                        <Text color={textColorSecondary} fontSize="sm">
                            {location}
                        </Text>
                    </HStack>

                    <HStack>
                        <Icon as={IoTime} color={textColorSecondary} />
                        <Text color={textColorSecondary} fontSize="sm">
                            {pickupTimes}
                        </Text>
                    </HStack>

                    <HStack>
                        <Icon as={IoBasket} color={textColorSecondary} />
                        <Text color={textColorSecondary} fontSize="sm">
                            {quantity}
                        </Text>
                    </HStack>

                    <Box w="100%">
                        <Text color={textColor} fontSize="sm" fontWeight="600" mb="2">
                            Available Categories:
                        </Text>
                        <Flex flexWrap="wrap" gap="2">
                            {categoryList.map((category, index) => (
                                <Tag
                                    key={index}
                                    size="sm"
                                    borderRadius="full"
                                    variant="subtle"
                                    bg={tagBg}
                                    color={textColor}
                                >
                                    <TagLabel>{category}</TagLabel>
                                </Tag>
                            ))}
                        </Flex>
                    </Box>
                </VStack>
            </Flex>
        </Card>
    );
}
