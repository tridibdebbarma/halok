import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Building2, HardHat, ShieldCheck, Clock } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function Home() {
  const supabase = await createServerSupabaseClient();

  // Fetch multiple requirements in parallel
  const [
    { data: slides },
    { data: company },
    { data: services }
  ] = await Promise.all([
    supabase.from("hero_slides").select("*").eq("is_visible", true).order("order_index").limit(5),
    supabase.from("company_profile").select("*").single(),
    supabase.from("services").select("*").eq("is_visible", true).limit(6)
  ]);

  // Default fallback slide if table is empty
  const defaultSlide = {
    title: "Building the Future. Restoring the Past.",
    subtitle: "Premium construction and building services tailored to your exact specifications.",
    cta_text: "Our Services",
    cta_link: "/services",
    image_url: "https://images.unsplash.com/photo-1541888081622-63660a9203d9?q=80&w=2070&auto=format&fit=crop",
  };

  const heroSlides = slides && slides.length > 0 ? slides : [defaultSlide];
  const activeSlide = heroSlides[0]; // For a simpler implementation, we'll just show the first one or build a client carousel. Let's start with a static hero using the first slide.

  return (
    <>
      {/* 1. Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center pt-16 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={activeSlide.image_url}
            alt={activeSlide.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a192fc0] to-[#0a192f80]" />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-10 text-white">
          <div className="max-w-3xl space-y-6 animate-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
              {activeSlide.title}
            </h1>
            <p className="text-lg md:text-xl text-slate-200 max-w-2xl leading-relaxed">
              {activeSlide.subtitle}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-base h-12 px-8">
                <Link href={activeSlide.cta_link}>{activeSlide.cta_text}</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white hover:text-slate-900 text-base h-12 px-8">
                <Link href="/portfolio">View Our Work</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Info Banner floating at bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 z-20 hidden md:block translate-y-1/2">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-xl shadow-xl flex items-stretch divide-x divide-slate-100 p-2 border border-slate-100">
              <div className="flex-1 flex items-center gap-4 p-6 hover:bg-slate-50 transition-colors rounded-l-lg">
                <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1E3A5F]">Certified Quality</h3>
                  <p className="text-sm text-slate-500 mt-1">ISO 9001:2015 Compliant</p>
                </div>
              </div>
              <div className="flex-1 flex items-center gap-4 p-6 hover:bg-slate-50 transition-colors">
                <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <HardHat className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1E3A5F]">{company?.years_of_experience || 15}+ Years</h3>
                  <p className="text-sm text-slate-500 mt-1">Industry Experience</p>
                </div>
              </div>
              <div className="flex-1 flex items-center gap-4 p-6 hover:bg-slate-50 transition-colors rounded-r-lg">
                <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1E3A5F]">On Time Delivery</h3>
                  <p className="text-sm text-slate-500 mt-1">{company?.total_projects || 500}+ Projects Completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. About Us Sneak Peek */}
      <section className="py-24 md:pt-36 md:pb-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative aspect-square md:aspect-auto md:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop"
                fill
                alt="Construction Team"
                className="object-cover"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl"></div>

              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 bg-white p-6 rounded-xl shadow-lg flex items-center gap-4 max-w-[280px]">
                <div className="text-4xl font-extrabold text-blue-600 leading-none">
                  {company?.years_of_experience || 15}
                </div>
                <div className="text-sm font-semibold text-[#1E3A5F] leading-tight">
                  Years of excellence in construction
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 font-semibold text-sm rounded-full">
                About Our Company
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1E3A5F] leading-tight">
                Building trust through quality and precision.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                {company?.description || "We are a premier construction company dedicated to redefining skylines and building sustainable communities. With a relentless focus on quality and innovation, we bring architectural visions to life."}
              </p>

              <ul className="space-y-4 pt-4">
                {[
                  "Uncompromising commitment to safety standards",
                  "Expert team of engineers and architects",
                  "Sustainable and eco-friendly building practices",
                  "Transparent project management tracking"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0" />
                    <span className="font-medium text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-6">
                <Button asChild size="lg" className="bg-[#1E3A5F] hover:bg-[#2a4e7f]">
                  <Link href="/about">Learn More About Us <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Services */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-[#1E3A5F]">Our Core Capabilities</h2>
            <p className="text-slate-500 text-lg">
              We offer end-to-end construction services tailored to meet the demands of modern infrastructure development.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services && services.length > 0 ? (
              services.map((service: any) => (
                <Card key={service.id} className="group border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full bg-slate-50/50 hover:bg-white">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={service.main_image_url || "https://images.unsplash.com/photo-1541888081622-63660a9203d9?q=80&w=2070&auto=format&fit=crop"}
                      alt={service.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 text-xs font-bold text-blue-700 rounded-full shadow-sm">
                      {service.category}
                    </div>
                  </div>
                  <CardContent className="flex flex-col flex-1 p-6 z-10">
                    <h3 className="text-xl font-bold text-[#1E3A5F] mb-3 group-hover:text-blue-600 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">
                      {service.short_description}
                    </p>
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors mt-auto"
                    >
                      Explore Service <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Fallback demo content if no services
              [1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-slate-100 rounded-xl animate-pulse" />
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="border-blue-200 text-blue-700 hover:bg-blue-50">
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 4. CTA Section */}
      <section className="py-24 bg-[#1E3A5F] relative overflow-hidden">
        {/* Subtle architectural background pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              Ready to start your next big project?
            </h2>
            <p className="text-xl text-blue-100/90 leading-relaxed max-w-2xl mx-auto">
              Get in touch with our experts today to discuss your vision, requirements, and get a comprehensive project estimate.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button asChild size="lg" className="bg-white text-[#1E3A5F] hover:bg-slate-100 h-14 px-8 text-lg w-full sm:w-auto">
                <Link href="/contact">Request a Quote</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 h-14 px-8 text-lg w-full sm:w-auto">
                <Link href="/portfolio">Our Portfolio</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
