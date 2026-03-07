import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
    title: "Our Services | Halok Construction",
    description: "Explore our comprehensive construction, renovation, and contracting services tailored for your project needs.",
};

export default async function ServicesPage() {
    const supabase = await createServerSupabaseClient();

    const { data: services } = await supabase
        .from("services")
        .select("*")
        .eq("is_visible", true)
        .order("created_at", { ascending: false });

    // Group services by category for better display
    const categorizedServices = services?.reduce((acc: any, service: any) => {
        const cat = service.category || "General";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(service);
        return acc;
    }, {});

    return (
        <>
            <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-[var(--theme-primary,#1E3A5F)] text-white">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">Our Services</h1>
                    <p className="text-xl text-blue-100/90 leading-relaxed">
                        From groundbreaking to final inspection, we provide end-to-end capabilities across commercial, residential, and infrastructure projects.
                    </p>
                </div>
            </section>

            <section className="py-20 bg-slate-50 min-h-[50vh]">
                <div className="container mx-auto px-4">
                    {categorizedServices && Object.keys(categorizedServices).length > 0 ? (
                        Object.keys(categorizedServices).map((category) => (
                            <div key={category} className="mb-20 last:mb-0">
                                <div className="flex items-center gap-4 mb-8">
                                    <h2 className="text-3xl font-bold text-[var(--theme-primary,#1E3A5F)]">{category}</h2>
                                    <div className="h-px bg-slate-200 flex-1"></div>
                                </div>

                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {categorizedServices[category].map((service: any) => (
                                        <Card key={service.id} className="group border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full bg-white">
                                            <div className="relative h-64 overflow-hidden">
                                                <Image
                                                    src={service.main_image_url || "https://images.unsplash.com/photo-1541888081622-63660a9203d9?q=80&w=2070&auto=format&fit=crop"}
                                                    alt={service.name}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                                            </div>
                                            <CardContent className="flex flex-col flex-1 p-6 z-10">
                                                <h3 className="text-xl font-bold text-[var(--theme-primary,#1E3A5F)] mb-3 group-hover:text-[var(--theme-accent,#2563eb)] transition-colors">
                                                    {service.name}
                                                </h3>
                                                <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">
                                                    {service.short_description}
                                                </p>
                                                <Link
                                                    href={`/services/${service.slug}`}
                                                    className="inline-flex items-center text-sm font-bold text-[var(--theme-accent,#2563eb)] hover:opacity-80 transition-colors mt-auto"
                                                >
                                                    Explore details <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                </Link>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 text-slate-500">
                            <p>No services found at the moment. Please check back later.</p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
