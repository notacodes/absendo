import { useEffect, useState } from "react";
import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    Card,
    CardBody,
    VStack,
    HStack,
    Icon,
    Button,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    useColorModeValue,
    Link,
    Flex
} from '@chakra-ui/react';
import { 
    HiCurrencyDollar, 
    HiLightningBolt, 
    HiRefresh, 
    HiCode, 
    HiPencilAlt as HiPencil, 
    HiCalendar, 
    HiCheckCircle as HiCheck, 
    HiArrowRight, 
    HiOutlineSparkles as HiRocket 
} from 'react-icons/hi';
import { supabase, useIsUserLoggedIn } from "../supabaseClient.ts";

function HomeContent() {
    const [error, setError] = useState(false);
    const isUserLoggedIn = useIsUserLoggedIn();
    const [savedTimeMinutes, setSavedTimeMinutes] = useState<number | undefined>(undefined);
    
    const cardBg = useColorModeValue('white', 'gray.700');
    const sectionBg = useColorModeValue('gray.50', 'gray.800');
    
    useEffect(() => {
        const fetchUserCount = async () => {
            const { data, error } = await supabase.rpc('count_generated_absences');
            if (error) {
                setError(true);
            } else {
                setError(false);
                setSavedTimeMinutes(data * 5);
            }
        };
        fetchUserCount();
    }, []);

    const features = [
        {
            icon: HiCurrencyDollar,
            title: "Komplett kostenlos",
            description: "Keine versteckten Kosten, keine Abos - einfach gratis nutzbar",
            color: "green"
        },
        {
            icon: HiLightningBolt,
            title: "Blitzschnell",
            description: "Unter 30 Sekunden vom Start bis zum ausgefüllten Formular",
            color: "yellow"
        },
        {
            icon: HiRefresh,
            title: "Einmal gemacht, immer bereit",
            description: "Trage deine Daten einmal ein – danach läuft alles automatisch",
            color: "blue"
        },
        {
            icon: HiCode,
            title: "Open Source",
            description: "Wird als Open-Source-Projekt entwickelt",
            color: "purple"
        }
    ];

    const steps = [
        {
            icon: HiPencil,
            title: "Anmelden",
            description: "Registriere dich mit deiner Schulnetz-Kalender-URL und füge deine persönlichen Informationen hinzu"
        },
        {
            icon: HiCalendar,
            title: "Datum wählen",
            description: "Wähle einfach den Zeitraum deiner Abwesenheit im Kalender aus"
        },
        {
            icon: HiCheck,
            title: "Herunterladen & fertig",
            description: "Lade das fertig ausgefüllte Formular herunter, unterschreibe es und du bist fertig!"
        }
    ];

    const faqItems = [
        {
            question: "Was brauche ich, um loszulegen?",
            answer: "Du brauchst nur den Link zu deinem Schulnetz-Kalender und deine persönlichen Infos. Den Rest übernimmt Absendo für dich."
        },
        {
            question: "Was ist meine Schulnetz-Kalender-URL und wo bekomme ich sie?",
            answer: "Deine Schulnetz-Kalender-URL bekommst du direkt vom Schulnetz. Absendo nutzt sie, um deine Absenzen automatisch für dich auszufüllen! Sobald Absendo sie braucht, bekommst du eine Schritt-für-Schritt-Anleitung, wie du deine URL findest und einträgst."
        },
        {
            question: "Für welche Schulen kann Absendo Absenzen generieren?",
            answer: "Im Moment funktioniert Absendo nur für das BBZW – aber: Weitere Schulen sind geplant und werden so schnell wie möglich hinzugefügt!"
        },
        {
            question: "Muss ich jedes Mal alles neu eingeben?",
            answer: "Nein. Du richtest Absendo einmal ein – danach kannst du deine Angaben immer wieder nutzen, ohne sie neu einzugeben."
        }
    ];

    return (
        <Box>
            {/* Features Section */}
            <Box py={{ base: 16, md: 20 }} bg={sectionBg}>
                <Container maxW="7xl">
                    <VStack spacing={12}>
                        <Heading 
                            as="h2" 
                            size={{ base: "xl", md: "2xl" }} 
                            textAlign="center"
                            color="gray.800"
                        >
                            Warum Absendo?
                        </Heading>
                        
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} maxW="4xl">
                            {features.map((feature, index) => (
                                <Card 
                                    key={index}
                                    bg={cardBg}
                                    shadow="lg"
                                    _hover={{ 
                                        shadow: "xl", 
                                        transform: "translateY(-4px)" 
                                    }}
                                    transition="all 0.3s"
                                    border="1px"
                                    borderColor="gray.200"
                                >
                                    <CardBody p={6}>
                                        <HStack spacing={4} align="start">
                                            <Icon
                                                as={feature.icon}
                                                boxSize={8}
                                                color={`${feature.color}.500`}
                                                mt={1}
                                            />
                                            <VStack align="start" spacing={2} flex={1}>
                                                <Heading size="md" color="gray.800">
                                                    {feature.title}
                                                </Heading>
                                                <Text color="gray.600" lineHeight="tall">
                                                    {feature.description}
                                                    {feature.title === "Open Source" && (
                                                        <>
                                                            {" "}
                                                            <Link 
                                                                href="https://github.com/notacodes/absendo" 
                                                                isExternal 
                                                                color="blue.500"
                                                                textDecoration="underline"
                                                            >
                                                                Open-Source-Projekt
                                                            </Link>
                                                        </>
                                                    )}
                                                </Text>
                                            </VStack>
                                        </HStack>
                                    </CardBody>
                                </Card>
                            ))}
                        </SimpleGrid>
                    </VStack>
                </Container>
            </Box>

            {/* How it works Section */}
            <Box py={{ base: 16, md: 20 }} id="how-it-works" className="scroll-mt-40">
                <Container maxW="7xl">
                    <VStack spacing={12}>
                        <Heading 
                            as="h2" 
                            size={{ base: "xl", md: "2xl" }} 
                            textAlign="center"
                            color="gray.800"
                        >
                            So einfach geht's
                        </Heading>
                        
                        <Flex 
                            direction={{ base: "column", md: "row" }} 
                            align="center" 
                            justify="center" 
                            gap={8}
                        >
                            {steps.map((step, index) => (
                                <VStack key={index} spacing={4} textAlign="center" maxW="xs">
                                    <Box
                                        p={4}
                                        bg="brand.50"
                                        borderRadius="full"
                                        border="2px"
                                        borderColor="brand.200"
                                    >
                                        <Icon as={step.icon} boxSize={12} color="brand.600" />
                                    </Box>
                                    <Heading size="lg" color="gray.800">
                                        {step.title}
                                    </Heading>
                                    <Text color="gray.600" lineHeight="tall">
                                        {step.description}
                                    </Text>
                                    {index < steps.length - 1 && (
                                        <Icon 
                                            as={HiArrowRight} 
                                            boxSize={6} 
                                            color="gray.400"
                                            display={{ base: "none", md: "block" }}
                                            transform="rotate(0deg)"
                                        />
                                    )}
                                </VStack>
                            ))}
                        </Flex>
                    </VStack>
                </Container>
            </Box>

            {/* FAQ Section */}
            <Box py={{ base: 16, md: 20 }} bg={sectionBg} id="faq">
                <Container maxW="4xl">
                    <VStack spacing={8}>
                        <Heading 
                            as="h2" 
                            size={{ base: "xl", md: "2xl" }} 
                            textAlign="center"
                            color="gray.800"
                        >
                            Häufige Fragen (FAQ)
                        </Heading>
                        
                        <VStack spacing={4}>
                            <Accordion allowToggle w="full">
                                {faqItems.map((item, index) => (
                                <AccordionItem 
                                    key={index}
                                    bg={cardBg}
                                    border="1px"
                                    borderColor="gray.200"
                                    borderRadius="lg"
                                    shadow="md"
                                >
                                    <AccordionButton 
                                        p={6}
                                        _hover={{ bg: "gray.50" }}
                                        borderRadius="lg"
                                    >
                                        <Box flex="1" textAlign="left">
                                            <Text fontWeight="bold" fontSize="lg" color="gray.800">
                                                {item.question}
                                            </Text>
                                        </Box>
                                        <AccordionIcon color="brand.500" />
                                    </AccordionButton>
                                    <AccordionPanel p={6} pt={0}>
                                        <Text color="gray.600" lineHeight="tall">
                                            {item.answer}
                                        </Text>
                                    </AccordionPanel>
                                </AccordionItem>
                            ))}
                            </Accordion>
                        </VStack>
                    </VStack>
                </Container>
            </Box>

            {/* CTA Section */}
            <Box py={{ base: 16, md: 20 }}>
                <Container maxW="4xl">
                    <VStack spacing={8} textAlign="center">
                        <Heading 
                            as="h2" 
                            size={{ base: "xl", md: "2xl" }} 
                            color="gray.800"
                        >
                            Bereit, Zeit zu sparen? 🎉
                        </Heading>
                        
                        {savedTimeMinutes !== undefined && !error && (
                            <Text fontSize="lg" color="gray.600" maxW="2xl">
                                Schon{" "}
                                <Text as="span" fontWeight="bold" color="brand.600">
                                    {Math.floor(savedTimeMinutes / 60)} {Math.floor(savedTimeMinutes / 60) < 2 ? "Stunde" : "Stunden"}
                                    {savedTimeMinutes % 60 !== 0 ? ` und ${savedTimeMinutes % 60} Minuten` : ""}
                                </Text>
                                {" "}für alle Schüler*innen eingespart – effizient, oder? ⚡
                            </Text>
                        )}
                        
                        <Button
                            size="lg"
                            colorScheme="brand"
                            leftIcon={<Icon as={HiRocket} />}
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
                    </VStack>
                </Container>
            </Box>
        </Box>
    );
}

export default HomeContent;