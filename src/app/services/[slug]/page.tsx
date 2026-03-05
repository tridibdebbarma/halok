import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Phone, Mail } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import { Button } from "@/components/ui/button";

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const supabase = await createServerSupabaseClient();
    const { data: service } = await supabase
        .from("services")
        .select("name, short_description")
        .eq("slug", params.slug)
        .single();

    if (!service) return { title: "Service Not Found" };

    return {
        title: `${service.name} | Halok Construction`,
        description: service.short_description,
    };
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
    const supabase = await createServerSupabaseClient();

    const [
        { data: service },
        { data: company }
    ] = await Promise.all([
        supabase.from("services").select("*").eq("slug", params.slug).single(),
        supabase.from("company_profile").select("*").single()
    ]);

    if (!service || !service.is_visible) {
        notFound();
    }

    const featuresList = Array.isArray(service.features) && service.features.length > 0
        ? service.features
        : [];

    return (
        <>
            {/* 1. Service Hero */}
            <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 bg-[#1E3A5F]">
                <div className="absolute inset-0 z-0 opacity-20">
                    <Image
                        src={service.main_image_url || "https://images.unsplash.com/photo-1541888081622-63660a9203d9?q=80&w=2070&auto=format&fit=crop"}
                        alt={service.name}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A5F] to-transparent" />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-white">
                    <Link href="/services" className="inline-flex items-center text-blue-200 hover:text-white mb-6 text-sm font-medium transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to all services
                    </Link>

                    <div className="max-w-4xl">
                        <div className="inline-block px-3 py-1 bg-blue-600/30 text-blue-100 border border-blue-400/30 rounded-full text-sm font-medium mb-4">
                            {service.category}
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            {service.name}
                        </h1>
                        <p className="text-xl text-blue-100/90 leading-relaxed max-w-2xl">
                            {service.short_description}
                        </p>
                    </div>
                </div>
            </section>

            {/* 2. Content & Sidebar */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-3 gap-12 lg:gap-20">

                        {/* Left Column (Main Content) */}
                        <div className="lg:col-span-2 space-y-12">
                            <div className="prose prose-lg prose-slate max-w-none">
                                <h2 className="text-3xl font-bold text-[#1E3A5F] mb-6">Service Overview</h2>
                                <div className="text-slate-600 leading-relaxed space-y-4 whitespace-pre-wrap">
                                    {service.full_description || "Detailed description coming soon."}
                                </div>
                            </div>

                            {featuresList.length > 0 && (
                                <div>
                                    <h3 className="text-2xl font-bold text-[#1E3A5F] mb-6">Key Capabilities</h3>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {featuresList.map((feature: string, idx: number) => (
                                            <div key={idx} className="flex items-start gap-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
                                                <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0" />
                                                <span className="font-medium text-slate-700">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column (Sidebar) */}
                        <div className="space-y-8">
                            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm sticky top-28">
                                <h3 className="text-xl font-bold text-[#1E3A5F] mb-6">Need this service?</h3>
                                <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                                    Contact our experts today for a comprehensive consultation and project estimate tailored to your requirements.
                                </p>

                                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 mb-6 h-12 text-base">
                                    <Link href={`/contact?subject=Inquiry about ${service.name}`}>Request a Quote</Link>
                                </Button>

                                <div className="space-y-4 pt-6 border-t border-slate-200">
                                    {company?.phone_primary && (
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm">
                                                <Phone className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Call Us Now</div>
                                                <a href={`tel:${company.phone_primary}`} className="font-bold text-[#1E3A5F] hover:text-blue-600">
                                                    {company.phone_primary}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {company?.email_primary && (
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm">
                                                <Mail className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Us</div>
                                                <a href={`mailto:${company.email_primary}`} className="font-bold text-[#1E3A5F] hover:text-blue-600 text-sm">
                                                    {company.email_primary}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}
