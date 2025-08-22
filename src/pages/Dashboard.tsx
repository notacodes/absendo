import { useEffect, useState } from "react";
import { Box, Flex, Spinner, Heading, Button } from "@chakra-ui/react";
import Navbar from "../components/Navbar.tsx";
import DashboardHeader from "../components/DashboardHeader.tsx";
import DashboardLastAbsences from "../components/DashboardContent.tsx";
import { supabase } from "../supabaseClient.ts";
import { User } from "@supabase/supabase-js";

function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        }
        fetchUser();
    }, []);

    useEffect(() => {
        const checkLogin = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('onboarding_completed')
                    .eq('id', user?.id)
                    .single();

                if (!data?.onboarding_completed && window.location.pathname !== "/welcome") {
                    console.log("User is not onboarded");
                    window.location.href = "/welcome";
                }
            }
        };

        checkLogin();
    }, []);

    if (loading) {
        return (
            <Flex minH="100vh" className="bg-gray-50" align="center" justify="center">
                <Spinner size="xl" />
            </Flex>
        );
    }

    return user ? (
        <Box minH="100vh" className="bg-gray-50">
            <Navbar />
            <DashboardHeader />
            <DashboardLastAbsences />
        </Box>
    ) : (
        <Box minH="100vh" className="bg-gray-50">
            <Navbar />
            <Flex direction="column" align="center" justify="center" py={10}>
                <Heading size="lg" mb={4}>Please log in to access the dashboard</Heading>
                <Button colorScheme="blue" onClick={() => window.location.href = "/login"}>
                    Login
                </Button>
            </Flex>
        </Box>
    );
}

export default Dashboard;
