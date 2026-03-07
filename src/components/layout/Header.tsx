"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu as MenuIcon, X, ChevronDown, Mail, Phone, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

interface HeaderProps {
    settings: any;
    company: any;
    menus: any[];
}

export default function Header({ settings, company, menus }: HeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const siteName = settings?.site_name || "Halok Construction";
    const logoUrl = settings?.logo_url;
    const companyEmail = company?.email_primary || "contact-us@halok.co.in";
    const companyPhone = company?.phone_primary || "+91-9774254272";
    const companyCity = company?.city || "Agartala";
    const companyState = company?.state || "Tripura";

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex flex-col">
            {/* Top Bar (Contact Info) */}
            <div className={`transition-all duration-300 overflow-hidden bg-[var(--theme-primary,#1E3A5F)] text-white text-xs ${isScrolled ? 'h-0 opacity-0' : 'h-10 opacity-100'}`}>
                <div className="container mx-auto px-4 h-full flex items-center justify-between">
                    <div className="flex gap-4 sm:gap-6">
                        <a href={`mailto:${companyEmail}`} className="flex items-center gap-1.5 hover:text-blue-200 transition-colors">
                            <Mail className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">{companyEmail}</span>
                        </a>
                        <a href={`tel:${companyPhone}`} className="flex items-center gap-1.5 hover:text-blue-200 transition-colors">
                            <Phone className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">{companyPhone}</span>
                        </a>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-blue-100">
                            <MapPin className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">{companyCity}{companyState ? `, ${companyState}` : ''}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation Bar */}
            <div className={`transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-white/95 backdrop-blur-sm shadow-sm py-4'}`}>
                <div className="container mx-auto px-4 flex items-center justify-between">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 z-50">
                        {logoUrl ? (
                            <div className="relative h-10 w-32 sm:h-12 sm:w-40">
                                <Image src={logoUrl} alt={siteName} fill className="object-contain object-left" priority />
                            </div>
                        ) : (
                            <span className="text-2xl font-bold tracking-tight text-[var(--theme-primary,#1E3A5F)]">{siteName}</span>
                        )}
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {menus.map((menu) => (
                            <div
                                key={menu.id}
                                className="relative group h-full flex items-center"
                                onMouseEnter={() => setActiveDropdown(menu.id)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                {menu.sub_menus && menu.sub_menus.length > 0 ? (
                                    <>
                                        <button className="flex items-center gap-1 text-slate-700 hover:text-[var(--theme-accent,#2563eb)] font-medium py-2 transition-colors">
                                            {menu.label} <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                                        </button>
                                        {/* Megamenu / Dropdown */}
                                        <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-200 ${activeDropdown === menu.id ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                                            <div className="bg-white rounded-xl shadow-xl ring-1 ring-slate-200 p-3 min-w-[240px] flex flex-col gap-1 relative before:absolute before:top-0 before:left-0 before:right-0 before:-translate-y-full before:h-4 before:bg-transparent">
                                                {menu.sub_menus
                                                    .filter((sm: any) => sm.is_visible)
                                                    .sort((a: any, b: any) => a.order_index - b.order_index)
                                                    .map((sub: any) => (
                                                        <Link
                                                            key={sub.id}
                                                            href={sub.href}
                                                            className="px-4 py-2.5 rounded-md hover:bg-slate-50 text-slate-700 hover:text-[var(--theme-accent,#2563eb)] transition-colors whitespace-nowrap"
                                                        >
                                                            {sub.label}
                                                        </Link>
                                                    ))}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <Link
                                        href={menu.href}
                                        className="text-slate-700 hover:text-[var(--theme-accent,#2563eb)] font-medium py-2 transition-colors"
                                    >
                                        {menu.label}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Call to Action & Mobile Toggle */}
                    <div className="flex items-center gap-4 z-50">
                        <Button asChild className="hidden sm:inline-flex bg-[var(--theme-accent,#2563eb)] hover:opacity-90 text-white shadow-md hover:shadow-lg transition-all">
                            <Link href="/contact">Get a Quote</Link>
                        </Button>

                        {/* Mobile Nav Sheet */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="lg:hidden text-slate-700">
                                    <MenuIcon className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0 flex flex-col bg-white">
                                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                    {logoUrl ? (
                                        <div className="relative h-8 w-24">
                                            <Image src={logoUrl} alt={siteName} fill className="object-contain object-left" />
                                        </div>
                                    ) : (
                                        <span className="text-xl font-bold tracking-tight text-[var(--theme-primary,#1E3A5F)]">{siteName}</span>
                                    )}
                                    <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-secondary">
                                    </SheetClose>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6">
                                    <Accordion type="single" collapsible className="w-full">
                                        {menus.map((menu) => (
                                            menu.sub_menus && menu.sub_menus.length > 0 ? (
                                                <AccordionItem value={menu.id} key={menu.id} className="border-b-0">
                                                    <AccordionTrigger className="hover:no-underline py-4 text-base font-semibold text-slate-700">
                                                        {menu.label}
                                                    </AccordionTrigger>
                                                    <AccordionContent className="pb-4">
                                                        <div className="flex flex-col gap-3 pl-4 border-l-2 border-slate-100 ml-2">
                                                            {menu.sub_menus
                                                                .filter((sm: any) => sm.is_visible)
                                                                .sort((a: any, b: any) => a.order_index - b.order_index)
                                                                .map((sub: any) => (
                                                                    <SheetClose asChild key={sub.id}>
                                                                        <Link
                                                                            href={sub.href}
                                                                            className="text-slate-600 hover:text-[var(--theme-accent,#2563eb)] py-1"
                                                                        >
                                                                            {sub.label}
                                                                        </Link>
                                                                    </SheetClose>
                                                                ))}
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ) : (
                                                <div key={menu.id} className="py-4">
                                                    <SheetClose asChild>
                                                        <Link
                                                            href={menu.href}
                                                            className="text-base font-semibold text-slate-700 hover:text-[var(--theme-accent,#2563eb)] block"
                                                        >
                                                            {menu.label}
                                                        </Link>
                                                    </SheetClose>
                                                </div>
                                            )
                                        ))}
                                    </Accordion>
                                </div>

                                <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-4">
                                    <SheetClose asChild>
                                        <Button asChild className="w-full bg-[var(--theme-accent,#2563eb)] hover:opacity-90 text-white">
                                            <Link href="/contact">Get a Quote</Link>
                                        </Button>
                                    </SheetClose>
                                    <div className="flex items-center justify-center gap-2 text-slate-600 text-sm">
                                        <Phone className="h-4 w-4" />
                                        <a href={`tel:${companyPhone}`} className="hover:text-[var(--theme-accent,#2563eb)]">{companyPhone}</a>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}
