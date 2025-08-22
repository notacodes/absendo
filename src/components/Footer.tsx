import { 
    Box, 
    Container, 
    SimpleGrid, 
    VStack, 
    Text, 
    Link, 
    Heading,
    useColorModeValue 
} from '@chakra-ui/react';

function Footer() {
    const bg = useColorModeValue('gray.100', 'gray.900');
    const color = useColorModeValue('gray.600', 'gray.400');
    
    return (
        <Box as="footer" bg={bg} py={12}>
            <Container maxW="7xl">
                <SimpleGrid 
                    columns={{ base: 1, md: 3 }} 
                    spacing={8} 
                    textAlign={{ base: "center", md: "left" }}
                >
                    <VStack align={{ base: "center", md: "start" }} spacing={3}>
                        <Heading size="md" color="gray.800">
                            Absenz-Tool
                        </Heading>
                        <Text color={color} maxW="xs">
                            Ein einfaches Tool zum Ausfüllen von Absenzformularen.
                        </Text>
                    </VStack>
                    
                    <VStack align={{ base: "center", md: "start" }} spacing={3}>
                        <Heading size="md" color="gray.800">
                            Links
                        </Heading>
                        <Link 
                            href="https://github.com/notacodes/absendo" 
                            isExternal 
                            color="brand.500"
                            _hover={{ color: "brand.600", textDecoration: "underline" }}
                        >
                            Github Repository
                        </Link>
                        <Link 
                            href="/contact"
                            color="brand.500"
                            _hover={{ color: "brand.600", textDecoration: "underline" }}
                        >
                            Kontaktformular
                        </Link>
                    </VStack>
                    
                    <VStack align={{ base: "center", md: "start" }} spacing={3}>
                        <Heading size="md" color="gray.800">
                            Kontakt
                        </Heading>
                        <Link 
                            href="mailto:contact@absendo.app"
                            color="brand.500"
                            _hover={{ color: "brand.600", textDecoration: "underline" }}
                        >
                            contact@absendo.app
                        </Link>
                    </VStack>
                </SimpleGrid>
            </Container>
        </Box>
    );
}

export default Footer;
