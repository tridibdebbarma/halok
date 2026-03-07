import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, ArrowRight } from "lucide-react";

interface FooterProps {
    settings: any;
    company: any;
    menus: any[];
}

export default function Footer({ settings, company, menus }: FooterProps) {
    const siteName = settings?.site_name || "Halok Construction";
    const logoUrl = settings?.logo_url;
    const currentYear = new Date().getFullYear();

    // Pick a couple of menus to show as quick links, usually the first two
    const quickLinksMenu = menus.find(m => m.label.toLowerCase().includes("service") || m.label.toLowerCase().includes("about")) || menus[0];

    return (
        <footer className="bg-[color-mix(in_sRGB,var(--theme-primary,#1E3A5F),black_30%)] text-slate-300 pt-20 pb-10 border-t-4 border-[var(--theme-accent,#2563eb)]">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

                    {/* Column 1: Brand & About */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block">
                            {logoUrl ? (
                                <div className="relative h-12 w-40 bg-white/5 rounded-lg p-2">
                                    <Image src={logoUrl} alt={siteName} fill className="object-contain" />
                                </div>
                            ) : (
                                <span className="text-2xl font-bold tracking-tight text-white">{siteName}</span>
                            )}
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                            {company?.description?.substring(0, 150) || "A premier construction company dedicated to building quality structures."}...
                        </p>

                        <div className="flex gap-4 pt-2">
                            {company?.facebook_url && (
                                <a href={company.facebook_url} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[var(--theme-accent,#2563eb)] hover:text-white transition-all">
                                    <Facebook className="h-4 w-4" />
                                </a>
                            )}
                            {company?.instagram_url && (
                                <a href={company.instagram_url} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all">
                                    <Instagram className="h-4 w-4" />
                                </a>
                            )}
                            {company?.linkedin_url && (
                                <a href={company.linkedin_url} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all">
                                    <Linkedin className="h-4 w-4" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
                            <span className="h-1 w-6 bg-[var(--theme-accent,#2563eb)] rounded-full"></span>
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            {menus.map((menu) => (
                                <li key={`ql-${menu.id}`}>
                                    <Link href={menu.href} className="group flex items-center gap-2 text-slate-400 hover:text-[var(--theme-accent-light,#3b82f6)] transition-colors">
                                        <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                                        <span>{menu.label}</span>
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link href="/contact" className="group flex items-center gap-2 text-slate-400 hover:text-[var(--theme-accent-light,#3b82f6)] transition-colors">
                                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                                    <span>Contact Us</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Services / Explore (checking submenus) */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
                            <span className="h-1 w-6 bg-[var(--theme-accent,#2563eb)] rounded-full"></span>
                            Explore Links
                        </h3>
                        {quickLinksMenu?.sub_menus && quickLinksMenu.sub_menus.length > 0 ? (
                            <ul className="space-y-3">
                                {quickLinksMenu.sub_menus.slice(0, 6).map((sub: any) => (
                                    <li key={`ex-${sub.id}`}>
                                        <Link href={sub.href} className="group flex items-center gap-2 text-slate-400 hover:text-[var(--theme-accent-light,#3b82f6)] transition-colors">
                                            <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                                            <span>{sub.label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-slate-500 text-sm">No specialized links available right now.</p>
                        )}
                    </div>

                    {/* Column 4: Contact Info */}
                    <div className="space-y-6">
                        <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                            <span className="h-1 w-6 bg-[var(--theme-accent,#2563eb)] rounded-full"></span>
                            Get In Touch
                        </h3>

                        <div className="space-y-4">
                            {(company?.address_line_1 || true) && (
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                                        <MapPin className="h-5 w-5 text-[var(--theme-accent-light,#3b82f6)]" />
                                    </div>
                                    <div className="text-sm pt-1">
                                        <p className="text-slate-200 font-medium">Head Office</p>
                                        <p className="text-slate-400 mt-1">
                                            {company?.address_line_1 || "Agartala Main Road"}
                                            {company?.address_line_2 ? `, ${company.address_line_2}` : ''}
                                            <br />
                                            {company?.city || "Agartala"}{company?.state ? `, ${company.state}` : ', Tripura'} {company?.zip_code || '799001'}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                                    <Phone className="h-5 w-5 text-[var(--theme-accent-light,#3b82f6)]" />
                                </div>
                                <div className="text-sm pt-1">
                                    <p className="text-slate-200 font-medium">Call Us</p>
                                    <p className="text-slate-400 mt-1">
                                        <a href={`tel:${company?.phone_primary || '+91-9863547532'}`} className="hover:text-[var(--theme-accent-light,#3b82f6)]">{company?.phone_primary || '+91-9863547532'}</a>
                                    </p>
                                    {company?.phone_secondary && (
                                        <p className="text-slate-400">
                                            <a href={`tel:${company.phone_secondary}`} className="hover:text-[var(--theme-accent-light,#3b82f6)]">{company.phone_secondary}</a>
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                                    <Mail className="h-5 w-5 text-[var(--theme-accent-light,#3b82f6)]" />
                                </div>
                                <div className="text-sm pt-1">
                                    <p className="text-slate-200 font-medium">Email Us</p>
                                    <p className="text-slate-400 mt-1">
                                        <a href={`mailto:${company?.email_primary || 'contact-us@halok.co.in'}`} className="hover:text-[var(--theme-accent-light,#3b82f6)]">{company?.email_primary || 'contact-us@halok.co.in'}</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
                    <p>© {currentYear} {siteName}. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-slate-300">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
