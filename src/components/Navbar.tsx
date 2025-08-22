import { supabase, useIsUserLoggedIn } from "../supabaseClient.ts";
import { Flex, Button, Text, Box } from "@chakra-ui/react";

function Navbar() {
    const isUserLoggedIn = useIsUserLoggedIn();
    const version = "Beta";

    return (
        <Flex as="nav" className="shadow-md bg-gray-50" p={4} align="center" justify="space-between">
            <Flex gap={3} align="center">
                <Button variant="ghost" size="lg" onClick={() => window.location.href = "/home"}>
                    Absendo
                </Button>
                <Box px={2} py={1} bg="orange.200" color="orange.800" rounded="full">
                    <Text fontSize="xs" fontWeight="medium">
                        {version}
                    </Text>
                </Box>
            </Flex>
            <Flex gap={2}>
                {!isUserLoggedIn ? (
                    <>
                        <Button colorScheme="gray" onClick={() => window.location.href = "/signup"}>
                            Sign Up
                        </Button>
                        <Button colorScheme="blue" onClick={() => window.location.href = "/login"}>
                            Login
                        </Button>
                    </>
                ) : (
                    <>
                        <Button colorScheme="gray" onClick={() => window.location.href = "/dashboard"}>
                            Dashboard
                        </Button>
                        <Button 
                            colorScheme="red" 
                            onClick={() => supabase.auth.signOut().then(() => {window.location.href = "/home";})}
                        >
                            Logout
                        </Button>
                    </>
                )}
            </Flex>
        </Flex>
    );
}

export default Navbar;