import { useEffect, useState } from "react";
import { supabase, useIsUserLoggedIn } from "../supabaseClient.ts";
import { Flex, Box, Text, Button, Badge } from "@chakra-ui/react";

function Hero() {
    const [userCount, setUserCount] = useState(undefined);
    const [error, setError] = useState(false);
    const isUserLoggedIn = useIsUserLoggedIn();
    
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
        <Flex 
            minH="60vh" 
            align="center" 
            justify="center" 
            className="bg-white"
            p={8}
        >
            <Box textAlign="center" maxW="4xl">
                {userCount !== undefined && !error && (
                    <Badge 
                        colorScheme="blue" 
                        fontSize="md" 
                        p={3} 
                        rounded="full" 
                        mb={8}
                        className="animate-pulse"
                    >
                        <Box as="span" w={2} h={2} bg="green.500" rounded="full" display="inline-block" mr={2} />
                        Absendo wird bereits von {userCount} Schüler*innen genutzt
                    </Badge>
                )}
                
                <Text fontSize={{ base: "4xl", md: "6xl" }} fontWeight="bold" lineHeight="tight" mb={4}>
                    BBZW Absenzformulare
                    <Text as="span" display="block" bgGradient="linear(to-r, blue.500, purple.600)" bgClip="text">
                        in 30 Sekunden
                    </Text>
                </Text>
                
                <Text fontSize="xl" maxW="3xl" mx="auto" py={4} mb={6}>
                    Absenz einreichen, ohne Stress! Generiere deine Absenzformulare automatisch
                    aus deinem Schulnetz-Kalender und spare dir <Text as="strong" color="gray.900">bis zu 7 Minuten pro Formular</Text>
                </Text>
                
                <Flex gap={4} justify="center" wrap="wrap">
                    <Button
                        colorScheme="blue"
                        size="lg"
                        className="shadow-md hover:shadow-xl transform hover:scale-105 transition-all"
                        onClick={() => {
                            if (!isUserLoggedIn) {
                                window.location.href = "/signup";
                            } else {
                                window.location.href = "/dashboard";
                            }
                        }}
                    >
                        Jetzt kostenlos nutzen
                        <Box as="span" ml={2}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14"/>
                                <path d="m12 5 7 7-7 7"/>
                            </svg>
                        </Box>
                    </Button>
                    
                    <Button
                        colorScheme="gray"
                        size="lg"
                        className="shadow-md hover:shadow-xl transform hover:scale-105 transition-all"
                        onClick={() => window.location.hash = "#how-it-works"}
                    >
                        So funktioniert's
                        <Box as="span" ml={2}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
                                <path d="M9 18h6"/>
                                <path d="M10 22h4"/>
                            </svg>
                        </Box>
                    </Button>
                </Flex>
            </Box>
        </Flex>
    );
}

export default Hero;