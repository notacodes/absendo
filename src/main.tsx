import { StrictMode, Suspense, lazy, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import AppRoutes from "./routes.tsx";
import "./index.css";

const Snowfall = lazy(() =>
    import("react-snowfall").then((module) => ({ default: module.Snowfall })),
);

function DeferredSnowfall() {
    const [showSnowfall, setShowSnowfall] = useState(false);

    useEffect(() => {
        const start = () => setShowSnowfall(true);

        if (typeof window.requestIdleCallback === "function") {
            const idleId = window.requestIdleCallback(start, { timeout: 1200 });
            return () => window.cancelIdleCallback(idleId);
        }

        const timeoutId = window.setTimeout(start, 400);
        return () => window.clearTimeout(timeoutId);
    }, []);

    if (!showSnowfall) return null;

    return (
        <Suspense fallback={null}>
            <Snowfall
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                    zIndex: 9999,
                }}
                snowflakeCount={120}
            />
        </Suspense>
    );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <DeferredSnowfall />
      <AppRoutes />
  </StrictMode>,
)
