import Link from 'next/link';

const footerLinks = [
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/sitemap', label: 'Sitemap' },
    { href: '/gallery', label: 'Gallery' },
];

export default function Footer() {
    return (
        <footer className="border-t border-border bg-background-secondary/50 mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sports via-tech to-cult flex items-center justify-center">
                                <span className="text-white font-bold text-lg">GC</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">GC | IIT Ropar</h3>
                                <p className="text-xs text-foreground-subtle">Where Excellence Competes</p>
                            </div>
                        </div>
                        <p className="text-sm text-foreground-muted max-w-xs">
                            The General Championship brings together the best of sports, technology, and culture at IIT Ropar.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                            Quick Links
                        </h4>
                        <ul className="space-y-2">
                            {footerLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-foreground-muted hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legs */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                            Explore Legs
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/leg/sports"
                                    className="text-sm text-foreground-muted hover:text-sports transition-colors flex items-center gap-2"
                                >
                                    <span className="w-2 h-2 rounded-full bg-sports" />
                                    Sports
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/leg/tech"
                                    className="text-sm text-foreground-muted hover:text-tech transition-colors flex items-center gap-2"
                                >
                                    <span className="w-2 h-2 rounded-full bg-tech" />
                                    Tech
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/leg/cult"
                                    className="text-sm text-foreground-muted hover:text-cult transition-colors flex items-center gap-2"
                                >
                                    <span className="w-2 h-2 rounded-full bg-cult" />
                                    Cultural
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-border pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        {/* Copyright */}
                        <p className="text-sm text-foreground-subtle">
                            © {new Date().getFullYear()} General Championship, IIT Ropar. All rights reserved.
                        </p>

                        {/* Credits */}
                        <p className="text-sm text-foreground-subtle">
                            Built with{' '}
                            <span className="text-cult">♥</span>
                            {' '}by{' '}
                            <span className="text-foreground-muted font-medium hover:text-foreground transition-colors">
                                SoftCom Club, IIT Ropar
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
