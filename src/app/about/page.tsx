'use client';

import { motion } from 'framer-motion';
import { Footer } from '@/components/layout';

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative py-24 px-6 overflow-hidden">
                {/* Background effect */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-sports/30 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cult/30 rounded-full blur-[120px]" />
                </div>

                <div className="relative max-w-4xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold text-foreground mb-6"
                    >
                        About the{' '}
                        <span className="bg-gradient-to-r from-sports via-tech to-cult bg-clip-text text-transparent">
                            General Championship
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-foreground-muted max-w-2xl mx-auto"
                    >
                        The ultimate inter-hostel competition where talent, teamwork, and tenacity converge.
                    </motion.p>
                </div>
            </section>

            {/* What is GC */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="prose prose-invert prose-lg max-w-none"
                    >
                        <h2 className="text-3xl font-bold text-foreground mb-6">
                            What is GC?
                        </h2>
                        <p className="text-foreground-muted leading-relaxed">
                            The General Championship (GC) is the flagship inter-hostel competition at IIT Ropar,
                            bringing together students from all hostels in a year-long battle for supremacy.
                            It's more than just a competition—it's a celebration of excellence, camaraderie,
                            and the indomitable spirit of our campus community.
                        </p>
                        <p className="text-foreground-muted leading-relaxed">
                            From the adrenaline of the sports arena to the innovation of hackathons,
                            from the rhythm of dance floors to the power of words—GC encompasses every
                            form of creative and competitive expression.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Three Pillars */}
            <section className="py-20 px-6 bg-background-secondary/30">
                <div className="max-w-6xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold text-foreground text-center mb-12"
                    >
                        Three Pillars of Excellence
                    </motion.h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <PillarCard
                            title="Sports"
                            color="#f97316"
                            description="Athletic prowess meets team spirit. From cricket to athletics, every match is a testament to dedication and determination."
                            delay={0}
                        />
                        <PillarCard
                            title="Tech"
                            color="#3b82f6"
                            description="Innovation unleashed. Hackathons, coding battles, and robotics challenges that push the boundaries of what's possible."
                            delay={0.1}
                        />
                        <PillarCard
                            title="Cultural"
                            color="#a855f7"
                            description="Artistic expression in its purest form. Dance, music, drama, and art that capture the soul of our community."
                            delay={0.2}
                        />
                    </div>
                </div>
            </section>

            {/* Why it Matters */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold text-foreground mb-6">
                            Why GC Matters
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <ValueCard
                                icon="🏆"
                                title="Building Champions"
                                description="GC nurtures talent, builds resilience, and creates leaders who excel beyond the campus."
                            />
                            <ValueCard
                                icon="🤝"
                                title="Fostering Unity"
                                description="Competition that brings people together. Hostel pride that builds lifelong bonds."
                            />
                            <ValueCard
                                icon="⭐"
                                title="Celebrating Excellence"
                                description="A platform where every talent finds its stage, every effort gets its recognition."
                            />
                            <ValueCard
                                icon="🚀"
                                title="Beyond Boundaries"
                                description="Skills developed here transcend academics—leadership, teamwork, creativity."
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Quote */}
            <section className="py-20 px-6 bg-gradient-to-b from-background-secondary/50 to-background">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.blockquote
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="text-6xl text-cult/30 mb-4">"</div>
                        <p className="text-2xl md:text-3xl font-light text-foreground italic mb-6">
                            In the arena of excellence, every hostel brings their best.
                            Not just to win, but to inspire.
                        </p>
                        <cite className="text-foreground-muted not-italic">
                            — The Spirit of GC
                        </cite>
                    </motion.blockquote>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold text-foreground mb-4">
                            Ready to Explore?
                        </h2>
                        <p className="text-foreground-muted mb-8">
                            Dive into the events, track the scores, and be part of the championship.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href="/scoreboard"
                                className="px-8 py-4 rounded-xl bg-gradient-to-r from-sports via-tech to-cult text-white font-semibold hover:opacity-90 transition-opacity"
                            >
                                View Scoreboard
                            </a>
                            <a
                                href="/contact"
                                className="px-8 py-4 rounded-xl border border-border text-foreground font-semibold hover:bg-background-secondary transition-colors"
                            >
                                Contact Us
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

function PillarCard({ title, color, description, delay }: { title: string; color: string; description: string; delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className="p-8 rounded-2xl border border-border bg-background-secondary hover:border-opacity-50 transition-all duration-300"
            style={{ borderColor: `${color}40` }}
        >
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{ backgroundColor: `${color}20` }}
            >
                <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: color }}
                />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
                {title}
            </h3>
            <p className="text-foreground-muted">
                {description}
            </p>
        </motion.div>
    );
}

function ValueCard({ icon, title, description }: { icon: string; title: string; description: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-xl border border-border bg-background-secondary"
        >
            <span className="text-2xl mb-3 block">{icon}</span>
            <h3 className="text-lg font-semibold text-foreground mb-2">
                {title}
            </h3>
            <p className="text-sm text-foreground-muted">
                {description}
            </p>
        </motion.div>
    );
}
