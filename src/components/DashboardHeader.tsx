import { useEffect, useState } from 'react';
import {
    Box,
    Flex,
    Heading,
    Button,
    Input,
    Textarea,
    Text,
    Spinner
} from '@chakra-ui/react';
import { supabase } from "../supabaseClient.ts";
import { User } from "@supabase/supabase-js";
import { generatePdf } from "../../services/pdfService";

function DashboardHeader() {

    const [user, setUser] = useState<User | null>(null);
    const [isFullNameEnabled, setIsFullNameEnabled] = useState(true);
    const [isFullSubjectEnabled, setIsFullSubjectEnabled] = useState(false);
    const [isDoNotSaveEnabled, setIsDoNotSaveEnabled] = useState(false);

    useEffect(() => {
        async function fetchUser() {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        }
        fetchUser();
    }, []);

    useEffect(() => {
        async function fetchUserData() {
            if (user) {
                try {
                    const { data, error } = await supabase
                        .from("profiles")
                        .select("*")
                        .eq("id", user.id)
                        .single();

                    if (error) throw error;

                    setIsFullNameEnabled(data.isFullNameEnabled || true);
                    setIsFullSubjectEnabled(data.isFullSubjectEnabled || false);
                    setIsDoNotSaveEnabled(data.isDoNotSaveEnabled || false);

                } catch (err) {
                    console.error("Error fetching user data:", err);
                }
            }
        }
        fetchUserData();
    }, [user]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        date: '',
        reason: '',
        fileName: '',
        is_excused: true,
        isFullNameEnabled: isFullNameEnabled,
        isFullSubjectEnabled: isFullSubjectEnabled,
        isDoNotSaveEnabled: isDoNotSaveEnabled,
    });
    const [, setIsGenerating] = useState(false);
    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const openModal = () => {
        setIsModalOpen(true);
        setCurrentStep(1);
        setFormData({
            date: '',
            reason: '',
            fileName: 'Absenz',
            is_excused: true,
            isFullNameEnabled: isFullNameEnabled,
            isFullSubjectEnabled: isFullSubjectEnabled,
            isDoNotSaveEnabled: isDoNotSaveEnabled,
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        window.location.reload();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const goToNextStep = () => {
        if (currentStep === 1) {
            setIsGenerating(true);
            setCurrentStep(2);
            getPDF();
            setIsGenerating(true);
        }

    };

    function addPDFExtension(fileName: string) {
        if (!fileName.endsWith('.pdf')) {
            return fileName + '.pdf';
        }
        return fileName;
    }

    async function getPDF() {
        if (!user) {
            setErrorMessage('Du bist nicht eingeloggt. Bitte logge dich ein.');
            setIsGenerating(false);
            return;
        }
        setFormData({
            ...formData,
            isFullNameEnabled: isFullNameEnabled,
            isFullSubjectEnabled: isFullSubjectEnabled,
            isDoNotSaveEnabled: isDoNotSaveEnabled,
            fileName: addPDFExtension(formData.fileName)
        });
        try {
            const blob = await generatePdf(user.id, formData);
            if(blob){
                setPdfBlob(blob);
                setIsGenerating(false);
                setCurrentStep(3);
            }else{
                setIsGenerating(false);
                setErrorMessage('PDF konnte nicht generiert werden. Prüfe deine Kalender-URL oder versuche es später erneut.');
                return;
            }
        } catch (err: any) {
            setIsGenerating(false);
            setErrorMessage('Fehler beim Generieren der Absenz: ' + (err?.message || err));
        }
    }

    function downloadPDF() {
        if (pdfBlob) {
            const url = URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = formData.fileName;
            a.click();
            URL.revokeObjectURL(url);
        } else {
            console.error('PDF Blob is null. Cannot download the file.');
        }
    }

    function viewPDF() {
        if (pdfBlob instanceof Blob) {
            const url = URL.createObjectURL(pdfBlob);
            window.open(url, '_blank');
        } else {
            console.error('Invalid PDF Blob. Cannot open the file.');
        }
    }

    return (
        <Box p={6}>
            <Flex justify="space-between" align="center" mb={6}>
                <Heading size="lg">Absendo Dashboard</Heading>
                <Button colorScheme="blue" size="lg" onClick={openModal}>
                    <Box as="span" mr={2}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" width="24" height="24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                        </svg>
                    </Box>
                    Neue Absenz
                </Button>
            </Flex>

            {isModalOpen && (
                <Box
                    position="fixed"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="blackAlpha.600"
                    zIndex={1000}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Box
                        bg="white"
                        rounded="lg"
                        shadow="xl"
                        maxW="2xl"
                        w="full"
                        mx={4}
                        maxH="90vh"
                        overflowY="auto"
                    >
                        <Box p={6}>
                            <Heading size="lg" mb={4}>Neue Absenz erstellen</Heading>
                            
                            {/* Custom Step Indicator */}
                            <Flex justify="space-between" mb={6} w="full">
                                <Flex direction="column" align="center" flex={1}>
                                    <Box
                                        w={8}
                                        h={8}
                                        rounded="full"
                                        bg={currentStep >= 1 ? "blue.500" : "gray.200"}
                                        color="white"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        fontWeight="bold"
                                    >
                                        1
                                    </Box>
                                    <Text fontSize="sm" textAlign="center" mt={2}>Daten eingeben</Text>
                                </Flex>
                                <Box flex={0.5} h="1px" bg="gray.200" mt={4} />
                                <Flex direction="column" align="center" flex={1}>
                                    <Box
                                        w={8}
                                        h={8}
                                        rounded="full"
                                        bg={currentStep >= 2 ? "blue.500" : "gray.200"}
                                        color="white"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        fontWeight="bold"
                                    >
                                        2
                                    </Box>
                                    <Text fontSize="sm" textAlign="center" mt={2}>Generieren</Text>
                                </Flex>
                                <Box flex={0.5} h="1px" bg="gray.200" mt={4} />
                                <Flex direction="column" align="center" flex={1}>
                                    <Box
                                        w={8}
                                        h={8}
                                        rounded="full"
                                        bg={currentStep >= 3 ? "blue.500" : "gray.200"}
                                        color="white"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        fontWeight="bold"
                                    >
                                        3
                                    </Box>
                                    <Text fontSize="sm" textAlign="center" mt={2}>Download</Text>
                                </Flex>
                            </Flex>

                            {currentStep === 1 && (
                                <Box>
                                    <Box mb={4}>
                                        <Text mb={2} fontWeight="medium">Typ der Absenz</Text>
                                        <Flex gap={6}>
                                            <Flex align="center">
                                                <input
                                                    type="radio"
                                                    name="is_excused"
                                                    value="true"
                                                    checked={formData.is_excused}
                                                    onChange={() => setFormData({...formData, is_excused: true})}
                                                />
                                                <Text ml={2}>Entschuldigt</Text>
                                            </Flex>
                                            <Flex align="center">
                                                <input
                                                    type="radio"
                                                    name="is_excused"
                                                    value="false"
                                                    checked={!formData.is_excused}
                                                    onChange={() => setFormData({...formData, is_excused: false})}
                                                />
                                                <Text ml={2}>Unentschuldigt</Text>
                                            </Flex>
                                        </Flex>
                                    </Box>

                                    <Box mb={4}>
                                        <Text mb={2} fontWeight="medium">Datum</Text>
                                        <Input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                        />
                                    </Box>

                                    <Box mb={4}>
                                        <Text mb={2} fontWeight="medium">Grund</Text>
                                        <Textarea
                                            name="reason"
                                            value={formData.reason}
                                            onChange={handleInputChange}
                                            placeholder="Grund für die Absenz eingeben..."
                                            rows={2}
                                        />
                                    </Box>

                                    <Flex justify="flex-end" gap={3}>
                                        <Button variant="ghost" onClick={closeModal}>Abbrechen</Button>
                                        <Button
                                            colorScheme="blue"
                                            onClick={goToNextStep}
                                            disabled={!formData.date || !formData.reason}
                                        >
                                            Weiter
                                        </Button>
                                    </Flex>
                                </Box>
                            )}

                            {currentStep === 2 && (
                                <Flex direction="column" align="center" justify="center" py={10}>
                                    <Spinner size="xl" color="blue.500" />
                                    <Text mt={4} fontSize="lg">Absenz wird generiert...</Text>
                                    {errorMessage && (
                                        <Box 
                                            mt={4} 
                                            p={4} 
                                            bg="red.50" 
                                            border="1px" 
                                            borderColor="red.200" 
                                            rounded="md"
                                        >
                                            <Text color="red.600" fontWeight="bold">Fehler beim Generieren!</Text>
                                            <Text color="red.600">{errorMessage}</Text>
                                            <Flex gap={2} mt={3}>
                                                <Button size="sm" colorScheme="gray" onClick={() => window.location.href = "/contact"}>
                                                    Bug melden
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => { setErrorMessage(null); closeModal(); }}>
                                                    Schließen
                                                </Button>
                                            </Flex>
                                        </Box>
                                    )}
                                </Flex>
                            )}

                            {currentStep === 3 && (
                                <Flex direction="column" align="center" py={10}>
                                    <Box color="green.500" fontSize="6xl" mb={4}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                             stroke="currentColor" width="96" height="96">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                    </Box>
                                    <Heading size="lg" color="green.600" mb={2}>Absenz erfolgreich generiert!</Heading>
                                    <Text textAlign="center" color="gray.600" mb={6}>
                                        Deine Absenz wurde erfolgreich erstellt. Du kannst sie jetzt herunterladen oder eine Vorschau anzeigen.
                                    </Text>
                                    <Flex gap={4} mb={6}>
                                        <Button colorScheme="gray" onClick={viewPDF}>Vorschau</Button>
                                        <Button colorScheme="blue" onClick={downloadPDF}>
                                            <Box as="span" mr={2}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                                     stroke="currentColor" width="20" height="20">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                                                </svg>
                                            </Box>
                                            PDF herunterladen
                                        </Button>
                                    </Flex>
                                    <Button variant="ghost" onClick={closeModal}>Schließen</Button>
                                </Flex>
                            )}
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default DashboardHeader;
