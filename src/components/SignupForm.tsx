import React, { useState } from 'react';
import {
    Box,
    Card,
    CardBody,
    CardFooter,
    Heading,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    HStack,
    Text,
    Link,
    Alert,
    AlertIcon,
    Divider,
    Icon,
    useColorModeValue,
    Container
} from '@chakra-ui/react';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';
import { supabase } from "../supabaseClient.ts";

function SignupForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const cardBg = useColorModeValue('white', 'gray.700');
    const bgGradient = useColorModeValue(
        'linear(to-br, blue.50, purple.50)',
        'linear(to-br, gray.900, blue.900)'
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email || !password) {
            setError('Please fill in all fields.');
            setLoading(false);
            return;
        }

        try {
            const { error: signUpError } = await supabase.auth.signUp({ 
                email, 
                password,
                options: {
                    emailRedirectTo: 'https://absendo.app/welcome',
                }
            });
            if (signUpError) throw signUpError;
            if (!signUpError) {
                window.location.href = '/email-verification';
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Signup failed.');
        } finally {
            setLoading(false);
        }
    };

    async function signInWithGithub() {
        await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: 'https://absendo.app/welcome'
            }
        });
    }

    async function signInWithGoogle() {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'https://absendo.app/welcome'
            }
        });
    }

    return (
        <Box 
            minH="100vh" 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
            bgGradient={bgGradient}
            py={12}
        >
            <Container maxW="md">
                <Card 
                    bg={cardBg} 
                    shadow="xl" 
                    borderRadius="xl"
                    overflow="hidden"
                    border="1px"
                    borderColor="gray.200"
                >
                    <CardBody p={8}>
                        <VStack spacing={6} align="stretch">
                            <Heading 
                                size="lg" 
                                textAlign="center"
                                color="gray.800"
                                fontWeight="bold"
                            >
                                Willkommen! 🎉 Erstelle dein Konto
                            </Heading>

                            <VStack spacing={3}>
                                <Button
                                    onClick={signInWithGoogle}
                                    size="lg"
                                    width="full"
                                    variant="outline"
                                    leftIcon={<Icon as={FaGoogle} color="red.500" />}
                                    _hover={{
                                        transform: 'translateY(-1px)',
                                        shadow: 'lg'
                                    }}
                                    transition="all 0.2s"
                                >
                                    Weiter mit Google
                                </Button>

                                <Button
                                    onClick={signInWithGithub}
                                    size="lg"
                                    width="full"
                                    variant="outline"
                                    leftIcon={<Icon as={FaGithub} />}
                                    _hover={{
                                        transform: 'translateY(-1px)',
                                        shadow: 'lg'
                                    }}
                                    transition="all 0.2s"
                                >
                                    Weiter mit GitHub
                                </Button>
                            </VStack>

                            <HStack>
                                <Divider />
                                <Text fontSize="sm" color="gray.500" px={3}>
                                    OR
                                </Text>
                                <Divider />
                            </HStack>

                            <Box as="form" onSubmit={handleSubmit}>
                                <VStack spacing={4}>
                                    <FormControl>
                                        <FormLabel color="gray.700" fontWeight="medium">
                                            Email
                                        </FormLabel>
                                        <Input
                                            type="email"
                                            placeholder="deine@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            size="lg"
                                            borderRadius="lg"
                                            borderColor="gray.300"
                                            _hover={{ borderColor: 'brand.400' }}
                                            _focus={{ 
                                                borderColor: 'brand.500',
                                                boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)'
                                            }}
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel color="gray.700" fontWeight="medium">
                                            Password
                                        </FormLabel>
                                        <Input
                                            type="password"
                                            placeholder="Wähle ein sicheres Passwort"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            size="lg"
                                            borderRadius="lg"
                                            borderColor="gray.300"
                                            _hover={{ borderColor: 'brand.400' }}
                                            _focus={{ 
                                                borderColor: 'brand.500',
                                                boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)'
                                            }}
                                        />
                                    </FormControl>

                                    {error && (
                                        <Alert status="error" borderRadius="lg">
                                            <AlertIcon />
                                            {error}
                                        </Alert>
                                    )}

                                    <Button
                                        type="submit"
                                        colorScheme="brand"
                                        size="lg"
                                        width="full"
                                        rightIcon={<Icon as={HiArrowRight} />}
                                        isLoading={loading}
                                        loadingText="Konto erstellen..."
                                        _hover={{
                                            transform: 'translateY(-1px)',
                                            shadow: 'xl'
                                        }}
                                        transition="all 0.2s"
                                    >
                                        Konto erstellen
                                    </Button>
                                </VStack>
                            </Box>
                        </VStack>
                    </CardBody>

                    <CardFooter justifyContent="center" pt={0} pb={6}>
                        <Text color="gray.600">
                            Du hast bereits ein Konto?{' '}
                            <Link 
                                href="/login" 
                                color="brand.500"
                                fontWeight="semibold"
                                _hover={{ color: 'brand.600', textDecoration: 'underline' }}
                            >
                                Anmelden!
                            </Link>
                        </Text>
                    </CardFooter>
                </Card>
            </Container>
        </Box>
    );
}

export default SignupForm;