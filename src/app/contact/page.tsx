import { MapPin, Phone, Mail, Clock, ShieldCheck, HardHat } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Suspense } from "react";

import ContactForm from "@/components/ContactForm";

export const metadata = {
    title: "Contact Us | Halok Construction",
    description: "Get in touch with Halok Construction for your building and renovation needs.",
};

export default async function ContactPage() {
    const supabase = await createServerSupabaseClient();
    const { data: company } = await supabase.from("company_profile").select("*").single();

    return (
        <>
            <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-[var(--theme-primary,#1E3A5F)] text-white">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">Contact Our Experts</h1>
                    <p className="text-xl text-blue-100/90 leading-relaxed">
                        Ready to start your next big project or have questions about our services? We're here to help.
                    </p>
                </div>
            </section>

            <section className="py-20 bg-slate-50 min-h-[60vh] relative">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-6xl mx-auto -mt-32 md:-mt-40">
                        <div className="grid lg:grid-cols-5 gap-8">

                            {/* Left Column: Contact Info */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 h-full">
                                    <h3 className="text-2xl font-bold text-[var(--theme-primary,#1E3A5F)] mb-8">Get In Touch</h3>

                                    <div className="space-y-8">
                                        {company?.address_line_1 && (
                                            <div className="flex gap-4">
                                                <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                    <MapPin className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-[var(--theme-primary,#1E3A5F)] mb-1">Head Office</h4>
                                                    <p className="text-slate-600 leading-relaxed text-sm">
                                                        {company.address_line_1}
                                                        {company.address_line_2 ? `, ${company.address_line_2}` : ''}<br />
                                                        {company.city}{company.state ? `, ${company.state}` : ''} {company.zip_code}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {company?.phone_primary && (
                                            <div className="flex gap-4">
                                                <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                    <Phone className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-[var(--theme-primary,#1E3A5F)] mb-1">Call Us</h4>
                                                    <p className="text-slate-600">
                                                        <a href={`tel:${company.phone_primary}`} className="hover:text-blue-600 font-medium">{company.phone_primary}</a>
                                                    </p>
                                                    {company.phone_secondary && (
                                                        <p className="text-slate-500 text-sm mt-1">
                                                            Alt: <a href={`tel:${company.phone_secondary}`} className="hover:text-blue-600">{company.phone_secondary}</a>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {company?.email_primary && (
                                            <div className="flex gap-4">
                                                <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                    <Mail className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-[var(--theme-primary,#1E3A5F)] mb-1">Email Us</h4>
                                                    <p className="text-slate-600">
                                                        <a href={`mailto:${company.email_primary}`} className="hover:text-blue-600 font-medium">{company.email_primary}</a>
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                <Clock className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[var(--theme-primary,#1E3A5F)] mb-1">Business Hours</h4>
                                                <p className="text-slate-600 text-sm leading-relaxed">
                                                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                                                    Saturday: 9:00 AM - 2:00 PM<br />
                                                    Sunday: Closed
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-center gap-6">
                                        <div className="text-center group">
                                            <ShieldCheck className="h-8 w-8 text-slate-300 mx-auto group-hover:text-blue-500 transition-colors mb-2" />
                                            <span className="text-xs font-semibold text-slate-400 uppercase">Licensed</span>
                                        </div>
                                        <div className="w-px h-12 bg-slate-100"></div>
                                        <div className="text-center group">
                                            <HardHat className="h-8 w-8 text-slate-300 mx-auto group-hover:text-blue-500 transition-colors mb-2" />
                                            <span className="text-xs font-semibold text-slate-400 uppercase">Insured</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Contact Form */}
                            <div className="lg:col-span-3">
                                <Suspense fallback={<div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 h-[600px] animate-pulse" />}>
                                    <ContactForm />
                                </Suspense>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="bg-slate-200 h-[400px] md:h-[500px] w-full relative">
                {/* Placeholder for iframe map since we don't have a specific API key, we use a standard generic google maps embed or a decorative placeholder */}
                <iframe
                    title="Office Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57890.06937869498!2d91.24762544863282!3d23.836737399999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3753f4c6c3b3e5c3%3A0x2a8c7d5e6d5e6b3a!2sAgartala%2C%20Tripura!5e0!3m2!1sen!2sin!4v1709830000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-blue-900/10 pointer-events-none"></div>
            </section>
        </>
    );
}
