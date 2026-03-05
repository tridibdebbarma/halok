import Image from "next/image";
import { CheckCircle2, ShieldCheck, HardHat, Clock, Target, Eye, MapPin, Phone, Mail } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata = {
    title: "About Us",
    description: "Learn about Halok Construction, our history, our mission, and the team behind our success.",
};

export default async function AboutPage() {
    const supabase = await createServerSupabaseClient();

    const [
        { data: company },
        { data: team }
    ] = await Promise.all([
        supabase.from("company_profile").select("*").single(),
        supabase.from("team_members").select("*").order("order_index", { ascending: true })
    ]);

    return (
        <>
            {/* 1. Page Header */}
            <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-[#1E3A5F] text-white">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">About {company?.name || "Our Company"}</h1>
                    <p className="text-xl text-blue-100/90 leading-relaxed">
                        Discover our history, our values, and the dedicated professionals who bring architectural visions to life.
                    </p>
                </div>
            </section>

            {/* 2. Company Story */}
            <section className="py-20 md:py-28 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div className="space-y-6">
                            <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 font-semibold text-sm rounded-full mb-2">
                                Our Story
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F]">A Legacy of Building Better</h2>
                            <div className="text-slate-600 space-y-4 leading-relaxed text-lg">
                                {company?.description?.split('\n').map((paragraph: string, i: number) => (
                                    <p key={i}>{paragraph}</p>
                                )) || (
                                        <>
                                            <p>Established with a vision to redefine the construction landscape, we have grown into one of the most trusted names in the industry.</p>
                                            <p>Our commitment to excellence, sustainable practices, and unwavering integrity has allowed us to consistently deliver projects that exceed expectations.</p>
                                        </>
                                    )}
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-6 pt-6">
                                <div className="border-l-4 border-blue-600 pl-4 py-2">
                                    <div className="text-3xl font-extrabold text-[#1E3A5F]">{company?.years_of_experience || 15}+</div>
                                    <div className="text-slate-500 font-medium">Years Experience</div>
                                </div>
                                <div className="border-l-4 border-blue-600 pl-4 py-2">
                                    <div className="text-3xl font-extrabold text-[#1E3A5F]">{company?.total_projects || 500}+</div>
                                    <div className="text-slate-500 font-medium">Projects Completed</div>
                                </div>
                            </div>
                        </div>

                        <div className="relative aspect-auto h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src="https://images.unsplash.com/photo-1541888081622-63660a9203d9?q=80&w=2070&auto=format&fit=crop"
                                fill
                                alt="Company History"
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A5F]/80 via-transparent to-transparent"></div>
                            <div className="absolute bottom-8 left-8 right-8 text-white">
                                <h3 className="text-2xl font-bold mb-2">Quality First approach</h3>
                                <p className="text-white/80">Every foundation we lay is built on trust and precision.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Mission & Vision */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="h-14 w-14 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                                <Target className="h-7 w-7 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#1E3A5F] mb-4">Our Mission</h3>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                {company?.mission || "To deliver high-quality, cost-effective projects on schedule by employing and supporting motivated, flexible, and focused teams. We value the importance of our relationships and will continue to remain fair and true in our dealings with all employees, clients, vendors, and partners."}
                            </p>
                        </div>

                        <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="h-14 w-14 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                                <Eye className="h-7 w-7 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#1E3A5F] mb-4">Our Vision</h3>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                {company?.vision || "To be the preferred contractor of choice recognized for our excellence, integrity, and relentless dedication to safety. A company that our clients want to work with, our customers can rely on, and our employees are proud to work for."}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Leadership Team */}
            {team && team.length > 0 && (
                <section className="py-20 md:py-28 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                            <h2 className="text-3xl md:text-5xl font-bold text-[#1E3A5F]">Meet Our Leaders</h2>
                            <p className="text-slate-500 text-lg">
                                The experienced minds that drive our vision forward and ensure excellence in every project.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {team.map((member: any) => (
                                <div key={member.id} className="group flex flex-col items-center text-center">
                                    <div className="relative h-64 w-64 rounded-full overflow-hidden mb-6 shadow-lg border-4 border-white group-hover:border-blue-50 transition-colors">
                                        <Image
                                            src={member.image_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop"}
                                            alt={member.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#1E3A5F] mb-1">{member.name}</h3>
                                    <div className="text-blue-600 font-medium mb-4">{member.role}</div>
                                    {member.bio && (
                                        <p className="text-slate-500 text-sm leading-relaxed px-4">{member.bio}</p>
                                    )}
                                    {member.linkedin_url && (
                                        <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="mt-4 text-slate-400 hover:text-blue-600 transition-colors p-2">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                            </svg>
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 5. Core Values / Certifications Area */}
            <section className="py-20 bg-[#1E3A5F] text-white">
                <div className="container mx-auto px-4 text-center max-w-3xl">
                    <h2 className="text-3xl md:text-4xl font-bold mb-12">Why Choose Us?</h2>
                    <div className="grid sm:grid-cols-3 gap-8 text-center border-t border-b border-white/10 py-12">
                        <div className="space-y-4">
                            <ShieldCheck className="h-10 w-10 text-blue-400 mx-auto" />
                            <h4 className="text-xl font-semibold">Fully Certified</h4>
                            <p className="text-blue-100/70 text-sm">Meeting all national building and safety regulations.</p>
                        </div>
                        <div className="space-y-4">
                            <HardHat className="h-10 w-10 text-blue-400 mx-auto" />
                            <h4 className="text-xl font-semibold">Expert Professionals</h4>
                            <p className="text-blue-100/70 text-sm">Vetted, highly trained engineers and project managers.</p>
                        </div>
                        <div className="space-y-4">
                            <Clock className="h-10 w-10 text-blue-400 mx-auto" />
                            <h4 className="text-xl font-semibold">On-Time Delivery</h4>
                            <p className="text-blue-100/70 text-sm">Rigorous scheduling to ensure deadlines are met.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
