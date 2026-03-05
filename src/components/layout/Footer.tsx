"use client";

import Link from "next/link";
import { CompanyProfile } from "@/types/database";
import { Facebook, Instagram, Linkedin, MapPin, Mail, Phone } from "lucide-react";

interface FooterProps {
    companyProfile: CompanyProfile | null;
}

export default function Footer({ companyProfile }: FooterProps) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#1E3A5F] text-white pt-16 pb-8">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand & About */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold tracking-tight">
                            {companyProfile?.name || "Halok Construction"}
                        </h3>
                        <p className="text-blue-100 text-sm leading-relaxed">
                            {companyProfile?.description?.substring(0, 150) ||
                                "Building Meghalaya's future with trust, durability, and modern engineering."}...
                        </p>
                        <div className="flex space-x-4 pt-2">
                            {companyProfile?.facebook_url && (
                                <a href={companyProfile.facebook_url} target="_blank" rel="noreferrer" className="text-blue-200 hover:text-white transition-colors">
                                    <Facebook className="h-5 w-5" />
                                    <span className="sr-only">Facebook</span>
                                </a>
                            )}
                            {companyProfile?.instagram_url && (
                                <a href={companyProfile.instagram_url} target="_blank" rel="noreferrer" className="text-blue-200 hover:text-white transition-colors">
                                    <Instagram className="h-5 w-5" />
                                    <span className="sr-only">Instagram</span>
                                </a>
                            )}
                            {companyProfile?.linkedin_url && (
                                <a href={companyProfile.linkedin_url} target="_blank" rel="noreferrer" className="text-blue-200 hover:text-white transition-colors">
                                    <Linkedin className="h-5 w-5" />
                                    <span className="sr-only">LinkedIn</span>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4 text-blue-50">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-blue-200">
                            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/services" className="hover:text-white transition-colors">Our Services</Link></li>
                            <li><Link href="/portfolio" className="hover:text-white transition-colors">Portfolio</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4 text-blue-50">Expertise</h4>
                        <ul className="space-y-2 text-sm text-blue-200">
                            <li><Link href="/services/residential" className="hover:text-white transition-colors">Residential Construction</Link></li>
                            <li><Link href="/services/commercial" className="hover:text-white transition-colors">Commercial Buildings</Link></li>
                            <li><Link href="/services/renovations" className="hover:text-white transition-colors">Renovations</Link></li>
                            <li><Link href="/products" className="hover:text-white transition-colors">Building Materials</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4 text-blue-50">Contact Us</h4>
                        <ul className="space-y-4 text-sm text-blue-200">
                            <li className="flex items-start whitespace-pre-wrap">
                                <MapPin className="h-5 w-5 mr-3 shrink-0 text-blue-400" />
                                <span>
                                    {companyProfile?.address_line_1 || "Laitumkhrah Main Road"}<br />
                                    {companyProfile?.city || "Shillong"}, {companyProfile?.state || "Meghalaya"} {companyProfile?.zip_code || "793003"}
                                </span>
                            </li>
                            {(companyProfile?.phone_primary || companyProfile?.phone_secondary) && (
                                <li className="flex items-center">
                                    <Phone className="h-5 w-5 mr-3 shrink-0 text-blue-400" />
                                    <span>
                                        {companyProfile?.phone_primary && <a href={`tel:${companyProfile.phone_primary}`} className="hover:text-white">{companyProfile.phone_primary}</a>}
                                        {companyProfile?.phone_primary && companyProfile?.phone_secondary && " / "}
                                        {companyProfile?.phone_secondary && <a href={`tel:${companyProfile.phone_secondary}`} className="hover:text-white">{companyProfile.phone_secondary}</a>}
                                    </span>
                                </li>
                            )}
                            {(companyProfile?.email_primary || companyProfile?.email_secondary) && (
                                <li className="flex flex-col space-y-2">
                                    {companyProfile?.email_primary && (
                                        <div className="flex items-center">
                                            <Mail className="h-5 w-5 mr-3 shrink-0 text-blue-400" />
                                            <a href={`mailto:${companyProfile.email_primary}`} className="hover:text-white">{companyProfile.email_primary}</a>
                                        </div>
                                    )}
                                    {companyProfile?.email_secondary && (
                                        <div className="flex items-center">
                                            <Mail className="h-5 w-5 mr-3 shrink-0 text-transparent" />
                                            <a href={`mailto:${companyProfile.email_secondary}`} className="hover:text-white">{companyProfile.email_secondary}</a>
                                        </div>
                                    )}
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-blue-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-blue-300">
                    <p>© {currentYear} {companyProfile?.name || "Halok Construction"}. All rights reserved.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
