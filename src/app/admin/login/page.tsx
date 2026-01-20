'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

// Hardcoded credentials for Phase 1
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'gc2026admin'
};

export default function AdminLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            // Store auth state (simple localStorage for now)
            localStorage.setItem('gc_admin_auth', 'true');
            router.push('/admin/dashboard');
        } else {
            setError('Invalid credentials. Please try again.');
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-background">
            {/* Background */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cult/30 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-sports via-tech to-cult mb-4">
                        <span className="text-white font-bold text-2xl">GC</span>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
                    <p className="text-foreground-muted mt-2">GC | IIT Ropar</p>
                </div>

                {/* Login Form */}
                <form
                    onSubmit={handleSubmit}
                    className="p-8 rounded-2xl border border-border bg-background-secondary"
                >
                    <div className="space-y-6">
                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-foreground-subtle focus:outline-none focus:border-cult transition-colors"
                                placeholder="Enter username"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-foreground-subtle focus:outline-none focus:border-cult transition-colors"
                                placeholder="Enter password"
                                required
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-sports via-tech to-cult text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <LoadingSpinner />
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </div>
                </form>

                {/* Back Link */}
                <div className="text-center mt-6">
                    <a
                        href="/"
                        className="text-sm text-foreground-muted hover:text-foreground transition-colors"
                    >
                        ← Back to Home
                    </a>
                </div>
            </motion.div>
        </div>
    );
}

function LoadingSpinner() {
    return (
        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
    );
}
