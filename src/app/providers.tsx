'use client';

import { GCProvider } from '@/context/GCContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <GCProvider>
            {children}
        </GCProvider>
    );
}
