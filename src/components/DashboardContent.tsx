import { useEffect, useState } from "react";
import {
    Box,
    Flex,
    Grid,
    GridItem,
    Heading,
    Text,
    Button,
    Spinner
} from "@chakra-ui/react";
import { supabase } from "../supabaseClient";
import { User } from "@supabase/supabase-js";

interface UserProfile {
    id: string;
    first_name: string;
    last_name: string;
    birthday: string;
    first_name_trainer: string;
    last_name_trainer: string;
    isFullNameEnabled?: boolean;
    isFullSubjectEnabled?: boolean;
    isDoNotSaveEnabled?: boolean;
    total_absences?: number;
    time_saved_minutes?: number;
}

interface PdfFile {
    id: string;
    user_id: string;
    file_path: string;
    created_at: string;
    date_of_absence: string;
    reason: string;
    pdf_name: string;
}

function DashboardContent() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [pdfs, setPdfs] = useState<PdfFile[]>([]);
    const [isFullNameEnabled, setIsFullNameEnabled] = useState(false);
    const [isFullSubjectEnabled, setIsFullSubjectEnabled] = useState(false);
    const [isDoNotSaveEnabled, setIsDoNotSaveEnabled] = useState(false);
    const [settingsLoading, setSettingsLoading] = useState(false);

    useEffect(() => {
        async function fetchUser() {
            try {
                const {
                    data: { user },
                    error,
                } = await supabase.auth.getUser();
                if (error) throw error;
                setUser(user);
            } catch (err) {
                console.error("Error fetching user:", err);
            } finally {
                setLoading(false);
            }
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
                    const { data: absencesData, error: absencesError } = await supabase
                        .from("pdf_files")
                        .select("id")
                        .eq("user_id", user.id);

                    if (absencesError) throw absencesError;
                    const enhancedData = {
                        ...data,
                        total_absences: absencesData?.length || 0,
                        time_saved_minutes: (absencesData?.length || 0) * 5
                    };
                    setUserData(enhancedData);

                    setIsFullNameEnabled(data.isFullNameEnabled || false);
                    setIsFullSubjectEnabled(data.isFullSubjectEnabled || false);
                    setIsDoNotSaveEnabled(data.isDoNotSaveEnabled || false);

                } catch (err) {
                    console.error("Error fetching user data:", err);
                }
            }
        }
        fetchUserData();
    }, [user]);

    useEffect(() => {
        async function fetchPdfs() {
            if (user) {
                try {
                    const { data, error } = await supabase
                        .from("pdf_files")
                        .select("*")
                        .eq("user_id", user.id)
                        .order("created_at", { ascending: false });

                    if (error) throw error;
                    setPdfs((data || []));
                } catch (err) {
                    console.error("Error fetching PDFs:", err);
                }
            }
        }
        fetchPdfs();
    }, [user]);

    async function updateSetting(field: 'isFullNameEnabled' | 'isFullSubjectEnabled' | 'isDoNotSaveEnabled', value: boolean) {
        if (!user) return;

        setSettingsLoading(true);
        try {
            const { error } = await supabase
                .from("profiles")
                .update({ [field]: value })
                .eq("id", user.id);

            if (error) throw error;

            setUserData(prev => prev ? { ...prev, [field]: value } : null);

        } catch (err) {
            console.error(`Error updating ${field}:`, err);
            if (field === 'isFullNameEnabled') {
                setIsFullNameEnabled(userData?.isFullNameEnabled || false);
            }else if (field === 'isDoNotSaveEnabled') {
                setIsDoNotSaveEnabled(userData?.isDoNotSaveEnabled || false);
            }
            else {
                setIsFullSubjectEnabled(userData?.isFullSubjectEnabled || false);
            }
        } finally {
            setSettingsLoading(false);
            window.location.reload();
            //TO-DO: remove reload and add something to update the Values in DashboardHeader
        }
    }

    const handleFullNameToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.checked;
        setIsFullNameEnabled(newValue);
        await updateSetting('isFullNameEnabled', newValue);
    };

    const handleFullSubjectToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.checked;
        setIsFullSubjectEnabled(newValue);
        await updateSetting('isFullSubjectEnabled', newValue);
    };

    const handleDoNotSaveToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.checked;
        setIsDoNotSaveEnabled(newValue);
        await updateSetting('isDoNotSaveEnabled', newValue);
    }

    function getUserShortName() {
        if (!userData) return "NN";
        const first = userData.first_name?.charAt(0).toUpperCase() || "";
        const last = userData.last_name?.charAt(0).toUpperCase() || "";
        return `${first}${last}`;
    }

    if (loading) {
        return (
            <Flex minH="100vh" align="center" justify="center">
                <Spinner size="xl" />
            </Flex>
        );
    }

    if (!userData) {
        return (
            <Flex justify="center" mt={10}>
                <Text color="red.500" textAlign="center">
                    Benutzerdaten konnten nicht geladen werden.
                </Text>
            </Flex>
        );
    }

    async function getPdf(pdf:PdfFile) {
        const {data, error} = await supabase
            .storage
            .from('pdf-files')
            .download(pdf.file_path)
        if(!error){
            return data
        }
        console.log("Error");
    }

    function viewPdf(pdfBlob: Blob) {
        const url = URL.createObjectURL(pdfBlob);
        window.open(url, '_blank');
    }

    function downloadPDF(pdfBlob: Blob, pdf: PdfFile) {
        if (pdfBlob) {
            const url = URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = pdf.pdf_name;
            a.click();
            URL.revokeObjectURL(url);
        } else {
            console.error('PDF Blob is null. Cannot download the file.');
        }
    }

    async function deletePdf(pdf: PdfFile) {
        const { error } = await supabase
            .storage
            .from('pdf-files')
            .remove([pdf.file_path]);

        const { status } = await supabase
            .from('pdf_files')
            .delete()
            .eq('id', pdf.id);

        if (!error && status === 204) {
            setPdfs((prev) => prev.filter((p) => p.id !== pdf.id));
        } else {
            console.error("Fehler beim Löschen der PDF:", error);
        }
    }

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleDateString('de-DE');
    }

    return (
        <Box p={6}>
            <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap={6}>
                {/* User Profile Card */}
                <GridItem>
                    <Box bg="white" shadow="xl" rounded="lg" p={6} textAlign="center">
                        <Box
                            w={24}
                            h={24}
                            rounded="full"
                            bg="blue.500"
                            color="white"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            fontSize="xl"
                            fontWeight="bold"
                            mx="auto"
                            mb={4}
                        >
                            {getUserShortName()}
                        </Box>
                        <Heading size="md" mb={2}>
                            {userData.first_name} {userData.last_name}
                        </Heading>
                        <Text fontSize="sm" color="gray.500" mb={1}>
                            {userData.birthday}
                        </Text>
                        <Text fontSize="sm" color="gray.500" mb={4}>
                            {userData.first_name_trainer} {userData.last_name_trainer}
                        </Text>
                        <Button size="sm" variant="outline" onClick={() => window.location.href = "/profile"}>
                            Zu deinem Profil
                        </Button>
                    </Box>
                </GridItem>

                {/* Statistics Card */}
                <GridItem>
                    <Box bg="white" shadow="xl" rounded="lg" p={6}>
                        <Heading size="md" mb={4}>Deine Statistik</Heading>
                        <Flex direction="column" gap={4}>
                            <Box>
                                <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                                    {userData.total_absences || 0}
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                    Absenzen erstellt
                                </Text>
                            </Box>
                            <Box>
                                <Text fontSize="2xl" fontWeight="bold" color="green.500">
                                    {userData.time_saved_minutes || 0} Min
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                    Zeit gespart
                                </Text>
                            </Box>
                        </Flex>
                    </Box>
                </GridItem>

                {/* Settings Card */}
                <GridItem>
                    <Box bg="white" shadow="xl" rounded="lg" p={6}>
                        <Heading size="md" mb={4}>Einstellungen</Heading>
                        <Flex direction="column" gap={4}>
                            <Flex align="center" justify="space-between">
                                <Text>Vollständiger Name</Text>
                                <input
                                    type="checkbox"
                                    checked={isFullNameEnabled}
                                    onChange={handleFullNameToggle}
                                    disabled={settingsLoading}
                                />
                            </Flex>
                            
                            <Flex align="center" justify="space-between">
                                <Text>Vollständiger Fachname</Text>
                                <input
                                    type="checkbox"
                                    checked={isFullSubjectEnabled}
                                    onChange={handleFullSubjectToggle}
                                    disabled={settingsLoading}
                                />
                            </Flex>
                            
                            <Flex align="center" justify="space-between">
                                <Text>Nicht speichern</Text>
                                <input
                                    type="checkbox"
                                    checked={isDoNotSaveEnabled}
                                    onChange={handleDoNotSaveToggle}
                                    disabled={settingsLoading}
                                />
                            </Flex>
                        </Flex>
                    </Box>
                </GridItem>

                {/* Recent Absences Card */}
                <GridItem colSpan={{ base: 1, lg: 3 }}>
                    <Box bg="white" shadow="xl" rounded="lg" p={6}>
                        <Heading size="md" mb={4}>Deine letzten Absenzen</Heading>
                        {pdfs.length === 0 ? (
                            <Text color="gray.500" textAlign="center" py={8}>
                                Noch keine Absenzen erstellt.
                            </Text>
                        ) : (
                            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4}>
                                {pdfs.slice(0, 6).map((pdf) => (
                                    <Box key={pdf.id} border="1px" borderColor="gray.200" rounded="lg" p={4}>
                                        <Flex justify="space-between" align="start" mb={2}>
                                            <Heading size="sm" flex={1} className="truncate">
                                                {pdf.pdf_name}
                                            </Heading>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                colorScheme="red"
                                                onClick={() => deletePdf(pdf)}
                                                ml={2}
                                            >
                                                ✕
                                            </Button>
                                        </Flex>
                                        <Text fontSize="sm" color="gray.500" mb={2}>
                                            {formatDate(pdf.date_of_absence)}
                                        </Text>
                                        <Text fontSize="sm" mb={4} className="line-clamp-2">
                                            {pdf.reason}
                                        </Text>
                                        <Flex gap={2}>
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                onClick={() => getPdf(pdf).then(blob => blob && viewPdf(blob))}
                                            >
                                                Ansehen
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                colorScheme="blue" 
                                                onClick={() => getPdf(pdf).then((blob) => blob && downloadPDF(blob, pdf))}
                                            >
                                                Download
                                            </Button>
                                        </Flex>
                                    </Box>
                                ))}
                            </Grid>
                        )}
                        {pdfs.length > 6 && (
                            <Flex justify="center" mt={6}>
                                <Button variant="outline" onClick={() => window.location.href = "/absences"}>
                                    Alle Absenzen anzeigen
                                </Button>
                            </Flex>
                        )}
                    </Box>
                </GridItem>
            </Grid>
        </Box>
    );
}

export default DashboardContent;
