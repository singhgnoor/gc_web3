'use client';

import { motion } from 'framer-motion';
import { getCurrentGCYear } from '@/lib/data';
import { Footer } from '@/components/layout';

export default function ContactPage() {
    const gcData = getCurrentGCYear();

    const mainContact = gcData.contacts.find(c => !c.legId);
    const legContacts = gcData.contacts.filter(c => c.legId);

    const legColors: Record<string, string> = {
        sports: '#f97316',
        tech: '#3b82f6',
        cult: '#a855f7',
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-foreground mb-4"
                    >
                        Contact Us
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-foreground-muted"
                    >
                        Have questions? Reach out to the GC organizing team.
                    </motion.p>
                </div>
            </section>

            {/* Main Contact */}
            {mainContact && (
                <section className="px-6 pb-12">
                    <div className="max-w-2xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="p-8 rounded-2xl border border-cult/30 bg-gradient-to-br from-cult/10 to-transparent"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-cult/20 flex items-center justify-center">
                                    <UserIcon className="w-8 h-8 text-cult" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-foreground">
                                        {mainContact.name}
                                    </h2>
                                    <p className="text-foreground-muted">
                                        {mainContact.role}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <a
                                    href={`mailto:${mainContact.email}`}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-background-secondary hover:bg-background-tertiary transition-colors group"
                                >
                                    <EmailIcon className="w-5 h-5 text-foreground-subtle group-hover:text-cult transition-colors" />
                                    <span className="text-foreground-muted group-hover:text-foreground transition-colors">
                                        {mainContact.email}
                                    </span>
                                </a>
                                {mainContact.phone && (
                                    <a
                                        href={`tel:${mainContact.phone}`}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-background-secondary hover:bg-background-tertiary transition-colors group"
                                    >
                                        <PhoneIcon className="w-5 h-5 text-foreground-subtle group-hover:text-cult transition-colors" />
                                        <span className="text-foreground-muted group-hover:text-foreground transition-colors">
                                            {mainContact.phone}
                                        </span>
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Leg Contacts */}
            <section className="py-12 px-6 bg-background-secondary/30">
                <div className="max-w-4xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm font-semibold text-foreground-subtle uppercase tracking-wider mb-6 text-center"
                    >
                        Leg Secretaries
                    </motion.h2>

                    <div className="grid md:grid-cols-3 gap-4">
                        {legContacts.map((contact, index) => {
                            const color = legColors[contact.legId || ''] || '#a855f7';
                            const legName = gcData.legs.find(l => l.id === contact.legId)?.name || 'Unknown';

                            return (
                                <motion.div
                                    key={contact.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className="p-6 rounded-xl border bg-background-secondary"
                                    style={{ borderColor: `${color}40` }}
                                >
                                    <div
                                        className="text-xs font-semibold uppercase tracking-wider mb-3"
                                        style={{ color }}
                                    >
                                        {legName}
                                    </div>

                                    <h3 className="font-semibold text-foreground mb-1">
                                        {contact.name}
                                    </h3>
                                    <p className="text-sm text-foreground-muted mb-4">
                                        {contact.role}
                                    </p>

                                    <a
                                        href={`mailto:${contact.email}`}
                                        className="text-sm text-foreground-subtle hover:text-foreground transition-colors flex items-center gap-2"
                                    >
                                        <EmailIcon className="w-4 h-4" />
                                        {contact.email}
                                    </a>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* General Inquiries */}
            <section className="py-20 px-6">
                <div className="max-w-2xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl font-bold text-foreground mb-4">
                            General Inquiries
                        </h2>
                        <p className="text-foreground-muted mb-6">
                            For general questions about GC, partnerships, or media inquiries,
                            please reach out to the Board of Hostel Affairs.
                        </p>
                        <div className="p-6 rounded-xl border border-border bg-background-secondary inline-block">
                            <p className="text-foreground-muted mb-2">Email us at</p>
                            <a
                                href="mailto:boha@iitrpr.ac.in"
                                className="text-lg font-semibold text-cult hover:text-cult/80 transition-colors"
                            >
                                boha@iitrpr.ac.in
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

function UserIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

function EmailIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
        </svg>
    );
}

function PhoneIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
    );
}
