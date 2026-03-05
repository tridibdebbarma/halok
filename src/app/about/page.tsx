import Image from "next/image";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CheckCircle2, Award, Users, HardHat } from "lucide-react";

export const metadata = {
    title: "About Us",
    description: "Learn more about Halok Construction, our mission, vision, and the team building Meghalaya's future.",
};

export default async function AboutPage() {
    const supabase = await createServerSupabaseClient();

    // Fetch Company Profile
    const { data: companyProfile } = await supabase
        .from("company_profile")
        .select("*")
        .single();

    // Fetch Team Members
    const { data: teamMembers } = await supabase
        .from("team_members")
        .select("*")
        .order("order_index", { ascending: true });

    return (
        <div className="flex flex-col min-h-screen">
            {/* 1. Page Header */}
            <section className="bg-[#1E3A5F] text-white py-24 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">About {companyProfile?.name || "Us"}</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                        {companyProfile?.mission || "Building sustainable, high-quality infrastructure for the future."}
                    </p>
                </div>
            </section>

            {/* 2. Our Story */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-[#1E3A5F]">Our Legacy of Excellence</h2>
                            <div className="w-16 h-1 bg-blue-600 rounded"></div>
                            <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {companyProfile?.description}
                            </p>

                            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-100 mt-8">
                                <div>
                                    <div className="flex items-center text-blue-600 mb-2">
                                        <Award className="h-6 w-6 mr-2" />
                                        <span className="font-bold text-2xl">{companyProfile?.years_of_experience || "10"}+</span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Years Experience</p>
                                </div>
                                <div>
                                    <div className="flex items-center text-blue-600 mb-2">
                                        <HardHat className="h-6 w-6 mr-2" />
                                        <span className="font-bold text-2xl">{companyProfile?.total_projects || "50"}+</span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Projects Completed</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
                            <Image
                                src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                alt="Construction team at site"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Mission & Vision */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-12 text-center md:text-left">
                        <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-500">
                                <Users className="h-48 w-48 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-[#1E3A5F] relative z-10">Our Mission</h3>
                            <p className="text-slate-600 leading-relaxed relative z-10">
                                {companyProfile?.mission}
                            </p>
                        </div>

                        <div className="bg-blue-600 p-10 rounded-2xl shadow-md text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                <CheckCircle2 className="h-48 w-48 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 relative z-10">Our Vision</h3>
                            <p className="text-blue-50 leading-relaxed relative z-10">
                                {companyProfile?.vision}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Certifications */}
            {companyProfile?.certifications && companyProfile.certifications.length > 0 && (
                <section className="py-16 bg-white border-b border-slate-100">
                    <div className="container mx-auto px-6">
                        <h3 className="text-2xl font-bold text-center mb-10 text-[#1E3A5F]">Accreditations & Certifications</h3>
                        <div className="flex flex-wrap justify-center gap-6">
                            {companyProfile.certifications.map((cert: string, index: number) => (
                                <div key={index} className="flex items-center px-6 py-3 bg-slate-50 border border-slate-100 rounded-full">
                                    <Award className="h-5 w-5 text-blue-600 mr-3" />
                                    <span className="font-semibold text-slate-700">{cert}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 5. Team (If any) */}
            {teamMembers && teamMembers.length > 0 && (
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl font-bold mb-4 text-[#1E3A5F]">Meet Our Leadership</h2>
                            <p className="text-slate-600 text-lg">
                                The experienced professionals driving our success and ensuring quality in every build.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {teamMembers.map((member) => (
                                <div key={member.id} className="text-center group">
                                    <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-slate-50 shadow-md">
                                        <Image
                                            src={member.image_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"}
                                            alt={member.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <h4 className="text-xl font-bold text-[#1E3A5F]">{member.name}</h4>
                                    <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                                    <p className="text-slate-500 text-sm line-clamp-3">{member.bio}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
