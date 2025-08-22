import { useEffect, useState } from "react";
import { 
    Box, 
    Flex, 
    Heading, 
    Text, 
    Button, 
    VStack, 
    HStack, 
    Badge, 
    Icon,
    useColorModeValue,
    Container
} from '@chakra-ui/react'
import { HiArrowRight, HiLightBulb } from 'react-icons/hi'
import { supabase, useIsUserLoggedIn } from "../supabaseClient.ts";

function Hero() {
    const [userCount, setUserCount] = useState(undefined);
    const [error, setError] = useState(false);
    const isUserLoggedIn = useIsUserLoggedIn();
    
    const bgGradient = useColorModeValue(
        'linear(to-br, white, blue.50, purple.50)',
        'linear(to-br, gray.900, blue.900, purple.900)'
    )
    
    useEffect(() => {
        const fetchUserCount = async () => {
            const { data, error } = await supabase.rpc('count_profiles');
            if (error) {
                setError(true);
            } else {
                setError(false);
                setUserCount(data);
            }
        };
        fetchUserCount();
    }, []);

    return (
        <Box 
            bgGradient={bgGradient}
            minH="70vh" 
            display="flex" 
            alignItems="center"
            position="relative"
            overflow="hidden"
        >
            {/* Background Pattern */}
            <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                opacity={0.1}
                bgImage="radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)"
                bgSize="20px 20px"
            />
            
            <Container maxW="7xl" zIndex={1}>
                <Flex 
                    direction="column" 
                    align="center" 
                    textAlign="center"
                    py={{ base: 16, md: 20 }}
                >
                    {userCount !== undefined && !error && (
                        <Badge
                            colorScheme="green"
                            variant="subtle"
                            fontSize="sm"
                            fontWeight="medium"
                            px={4}
                            py={2}
                            borderRadius="full"
                            mb={8}
                            display="flex"
                            alignItems="center"
                            gap={2}
                            animation="pulse 2s infinite"
                        >
                            <Box w={2} h={2} bg="green.400" borderRadius="full" />
                            Absendo wird bereits von {userCount} Schüler*innen genutzt
                        </Badge>
                    )}

                    <VStack spacing={6} maxW="4xl">
                        <Heading
                            as="h1"
                            size={{ base: "2xl", md: "3xl", lg: "4xl" }}
                            fontWeight="bold"
                            lineHeight="shorter"
                            color="gray.800"
                        >
                            BBZW Absenzformulare{" "}
                            <Text
                                as="span"
                                bgGradient="linear(to-r, brand.500, purple.500)"
                                bgClip="text"
                                fontWeight="extrabold"
                            >
                                in 30 Sekunden
                            </Text>
                        </Heading>

                        <Text
                            fontSize={{ base: "lg", md: "xl" }}
                            color="gray.600"
                            maxW="3xl"
                            lineHeight="tall"
                        >
                            Absenz einreichen, ohne Stress! Generiere deine Absenzformulare automatisch
                            aus deinem Schulnetz-Kalender und spare dir{" "}
                            <Text as="span" fontWeight="bold" color="gray.800">
                                bis zu 7 Minuten pro Formular
                            </Text>
                        </Text>

                        <HStack spacing={4} pt={4} flexWrap="wrap" justify="center">
                            <Button
                                size="lg"
                                colorScheme="brand"
                                rightIcon={<Icon as={HiArrowRight} />}
                                onClick={() => {
                                    if (!isUserLoggedIn) {
                                        window.location.href = "/signup";
                                    } else {
                                        window.location.href = "/dashboard";
                                    }
                                }}
                                boxShadow="xl"
                                _hover={{
                                    transform: 'translateY(-2px)',
                                    boxShadow: '2xl',
                                }}
                                transition="all 0.3s"
                                px={8}
                                py={6}
                                fontSize="lg"
                                fontWeight="semibold"
                            >
                                Jetzt kostenlos nutzen
                            </Button>

                            <Button
                                size="lg"
                                variant="outline"
                                colorScheme="brand"
                                rightIcon={<Icon as={HiLightBulb} />}
                                onClick={() => window.location.hash = "#how-it-works"}
                                _hover={{
                                    transform: 'translateY(-2px)',
                                    boxShadow: 'lg',
                                }}
                                transition="all 0.3s"
                                px={8}
                                py={6}
                                fontSize="lg"
                                fontWeight="semibold"
                            >
                                So funktioniert's
                            </Button>
                        </HStack>
                    </VStack>
                </Flex>
            </Container>
        </Box>
    );
}

export default Hero;