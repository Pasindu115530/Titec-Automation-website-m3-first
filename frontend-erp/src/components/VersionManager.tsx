'use client';

import { useEffect } from 'react';

export default function VersionManager() {
    useEffect(() => {
        const handleError = (error: ErrorEvent) => {
            const message = error.message?.toLowerCase() || '';
            const chunkErrorRegex = /loading chunk|unexpected token|minified react error/i;

            if (chunkErrorRegex.test(message)) {
                console.warn('Version mismatch detected, reloading...', error);
                window.location.reload();
            }
        };

        window.addEventListener('error', handleError);

        // Also handle unhandled promise rejections which might catch dynamic import failures
        const handleRejection = (event: PromiseRejectionEvent) => {
            const reason = event.reason?.message?.toLowerCase() || '';
            // specific check for dynamic import errors often appearing as promise rejections
            if (/loading chunk|unexpected token/i.test(reason)) {
                console.warn('Chunk loading failed (promise), reloading...', event.reason);
                window.location.reload();
            }
        };

        window.addEventListener('unhandledrejection', handleRejection);

        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleRejection);
        };
    }, []);

    return null;
}
