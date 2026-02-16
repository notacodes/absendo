type UmamiValue = string | number | boolean;
type UmamiPayload = Record<string, UmamiValue>;

type UmamiTracker = {
    track: (nameOrPayload?: string | UmamiPayload | ((payload: UmamiPayload) => UmamiPayload), data?: UmamiPayload) => void;
};

function getUmami(): UmamiTracker | undefined {
    if (typeof window === "undefined") {
        return undefined;
    }

    return window.umami;
}

export function trackPageView(): void {
    const umami = getUmami();
    if (!umami) return;

    const sanitizedUrl = `${window.location.pathname}${window.location.search}`;
    umami.track((payload) => ({
        ...payload,
        url: sanitizedUrl,
    }));
}

export function trackEvent(name: string, data?: Record<string, UmamiValue | undefined>): void {
    const umami = getUmami();
    if (!umami || !name) return;

    if (!data) {
        umami.track(name);
        return;
    }

    const sanitized = Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== undefined),
    ) as UmamiPayload;

    if (Object.keys(sanitized).length === 0) {
        umami.track(name);
        return;
    }

    umami.track(name, sanitized);
}

declare global {
    interface Window {
        umami?: UmamiTracker;
    }
}
