import { useState, useEffect } from 'react';
import { 
    Flex, 
    Box, 
    Heading, 
    Text, 
    Button
} from '@chakra-ui/react';

export default function MaintenancePage() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <Flex 
            minH="100vh" 
            className="bg-gray-100" 
            align="center" 
            justify="center" 
            p={4}
        >
            <Box 
                w="full" 
                maxW="2xl" 
                bg="white" 
                shadow="xl" 
                rounded="lg" 
                p={8}
                textAlign="center"
            >
                <Heading size="2xl" mb={6}>Absendo</Heading>
                <Box h="1px" bg="gray.200" w="full" mb={6} />

                <Heading size="lg" color="gray.700" mb={6}>
                    Wir arbeiten an etwas Grossartigem! 🚀
                </Heading>

                <Text color="gray.600" mb={8}>
                    Absendo ist gerade in Wartung. Wir bereiten die erste Vollversion vor
                    und werden bald zurück sein!
                </Text>

                <Box w="full" mb={8}>
                    <Flex justify="center" align="center" mb={2}>
                        <Text fontSize="sm" color="gray.500">Fortschritt</Text>
                    </Flex>
                    <Box w="full" bg="gray.200" rounded="lg" h={3}>
                        <Box w="45%" bg="blue.500" h="full" rounded="lg" />
                    </Box>
                    <Text fontSize="sm" color="gray.500" mt={2}>45% abgeschlossen</Text>
                </Box>

                <Box mb={6}>
                    <Text color="gray.600" mb={4}>
                        Fragen? Kontaktiere mich unter:
                    </Text>
                    <Button 
                        onClick={() => window.location.href = "mailto:mail@absendo.app"}
                        variant="outline" 
                        colorScheme="blue" 
                    >
                        info@absendo.com
                    </Button>
                </Box>

                <Box mt={8} pt={4} borderTop="1px" borderColor="gray.200" w="full">
                    <Text color="gray.400" fontSize="sm">
                        Letzte Aktualisierung: {currentTime.toLocaleString('de-DE')}
                    </Text>
                    <Flex justify="center" gap={2} mt={2}>
                        <Box w={2} h={2} bg="blue.500" rounded="full" className="animate-pulse" />
                        <Box w={2} h={2} bg="purple.500" rounded="full" className="animate-pulse" />
                        <Box w={2} h={2} bg="green.500" rounded="full" className="animate-pulse" />
                    </Flex>
                </Box>
            </Box>
        </Flex>
    );
}

