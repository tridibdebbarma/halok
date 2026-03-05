import Image from "next/image";
import Link from "next/link";
import { FolderGit2, MapPin, Calendar, Briefcase, ArrowRight } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
    title: "Our Portfolio | Halok Construction",
    description: "Explore our completed construction projects spanning commercial, residential, and infrastructure domains.",
};

export default async function PortfolioPage() {
    const supabase = await createServerSupabaseClient();

    const { data: projects } = await supabase
        .from("portfolio")
        .select("*")
        .eq("is_visible", true)
        .order("created_at", { ascending: false });

    // Group portfolio projects by service type for the filter tabs (Optional, for now just a grid)

    return (
        <>
            <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-[#1E3A5F] text-white">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Our Portfolio</h1>
                    <p className="text-xl text-blue-100/90 leading-relaxed">
                        A showcase of our completed projects demonstrating our commitment to quality, engineering excellence, and design.
                    </p>
                </div>
            </section>

            <section className="py-20 bg-slate-50 min-h-[50vh]">
                <div className="container mx-auto px-4">

                    {projects && projects.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {projects.map((project: any) => (
                                <Card key={project.id} className="group border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full bg-white">
                                    <div className="relative h-72 overflow-hidden bg-slate-100">
                                        <Image
                                            src={project.main_image_url || "https://images.unsplash.com/photo-1541888081622-63660a9203d9?q=80&w=2070&auto=format&fit=crop"}
                                            alt={project.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                        {/* Overlay Info on Image */}
                                        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {project.service_type && (
                                                    <Badge className="bg-blue-600/90 hover:bg-blue-700 text-white border-none">
                                                        <Briefcase className="h-3 w-3 mr-1" /> {project.service_type}
                                                    </Badge>
                                                )}
                                            </div>
                                            <h3 className="text-2xl font-bold text-white leading-tight drop-shadow-sm">
                                                {project.title}
                                            </h3>
                                        </div>
                                    </div>

                                    <CardContent className="flex flex-col flex-1 p-6 z-10">
                                        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4 text-sm text-slate-500 border-b border-slate-100 pb-4">
                                            {project.location && (
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="h-4 w-4 text-blue-500" />
                                                    <span>{project.location}</span>
                                                </div>
                                            )}
                                            {project.date_completed && (
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="h-4 w-4 text-blue-500" />
                                                    <span>{new Date(project.date_completed).getFullYear()}</span>
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-slate-600 leading-relaxed mb-6 flex-1">
                                            {project.short_description}
                                        </p>

                                        {/* View Details button could link to a dedicated project page if created later, or just open a gallery modal. For now, we'll just show it to look interactive. */}
                                        <div className="mt-auto pt-4 flex justify-between items-center border-t border-slate-50">
                                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                {project.client_name ? `Client: ${project.client_name}` : ''}
                                            </span>
                                            {project.gallery_urls && project.gallery_urls.length > 0 && (
                                                <span className="inline-flex items-center text-sm font-bold text-blue-600">
                                                    {project.gallery_urls.length + 1} Photos
                                                </span>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-white rounded-2xl border border-slate-100 border-dashed">
                            <FolderGit2 className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-[#1E3A5F] mb-2">Portfolio Update in Progress</h3>
                            <p className="text-slate-500">We are currently curating our latest project showcases.</p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
