import { Box, Flex, Heading, Button, Spacer, Badge, useColorModeValue } from '@chakra-ui/react'
import { supabase, useIsUserLoggedIn } from "../supabaseClient.ts";

function Navbar() {
    const isUserLoggedIn = useIsUserLoggedIn();
    const version = "Beta";
    
    const bg = useColorModeValue('white', 'gray.800')
    const borderColor = useColorModeValue('gray.200', 'gray.700')

    return (
        <Box 
            as="nav" 
            bg={bg} 
            borderBottom="1px" 
            borderColor={borderColor} 
            px={{ base: 4, md: 8 }} 
            py={4}
            position="sticky"
            top={0}
            zIndex={1000}
            backdropFilter="blur(10px)"
            boxShadow="sm"
        >
            <Flex align="center" maxW="7xl" mx="auto">
                <Flex align="center" gap={3}>
                    <Heading 
                        as="a" 
                        href="/home" 
                        size="lg" 
                        fontWeight="bold"
                        color="brand.600"
                        _hover={{ color: 'brand.700', textDecoration: 'none' }}
                        transition="color 0.2s"
                    >
                        Absendo
                    </Heading>
                    <Badge 
                        colorScheme="orange" 
                        variant="subtle" 
                        fontSize="xs"
                        fontWeight="medium"
                        px={2}
                        py={1}
                        borderRadius="full"
                    >
                        {version}
                    </Badge>
                </Flex>
                
                <Spacer />
                
                <Flex gap={3} align="center">
                    {!isUserLoggedIn ? (
                        <>
                            <Button
                                as="a"
                                href="/signup"
                                variant="outline"
                                colorScheme="brand"
                                size="md"
                                fontWeight="semibold"
                            >
                                Sign Up
                            </Button>
                            <Button
                                as="a"
                                href="/login"
                                variant="solid"
                                colorScheme="brand"
                                size="md"
                                fontWeight="semibold"
                            >
                                Login
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                onClick={() => window.location.href = "/dashboard"}
                                variant="outline"
                                colorScheme="brand"
                                size="md"
                                fontWeight="semibold"
                            >
                                Dashboard
                            </Button>
                            <Button
                                onClick={() => supabase.auth.signOut().then(() => {window.location.href = "/home";})}
                                variant="outline"
                                colorScheme="red"
                                size="md"
                                fontWeight="semibold"
                            >
                                Logout
                            </Button>
                        </>
                    )}
                </Flex>
            </Flex>
        </Box>
    );
}

export default Navbar;