import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../utils/umami.ts";

export default function UmamiPageTracker() {
    const { pathname, search } = useLocation();

    useEffect(() => {
        trackPageView();
    }, [pathname, search]);

    return null;
}

