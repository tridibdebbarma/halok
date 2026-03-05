import Image from "next/image";
<<<<<<< HEAD
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createServerSupabaseClient();

  // Fetch Hero Slides
  const { data: heroSlides } = await supabase
    .from("hero_slides")
    .select("*")
    .eq("is_visible", true)
    .order("order_index", { ascending: true })
    .limit(1);

  // Fetch Company Profile
  const { data: companyProfile } = await supabase
    .from("company_profile")
    .select("*")
    .single();

  // Fetch Featured Services
  const { data: featuredServices } = await supabase
    .from("services")
    .select("*")
    .eq("is_visible", true)
    .eq("is_featured", true)
    .limit(3);

  const hero = heroSlides?.[0];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      {hero && (
        <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
          <Image
            src={hero.image_url}
            alt={hero.title}
            fill
            className="object-cover object-center z-0"
            priority
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-slate-900/50 z-10" />

          <div className="container relative z-20 text-white">
            <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-700">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
                {hero.title}
              </h1>
              {hero.subtitle && (
                <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl font-light">
                  {hero.subtitle}
                </p>
              )}
              {hero.cta_text && hero.cta_link && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 h-14">
                    <Link href={hero.cta_link}>{hero.cta_text}</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-black bg-white/10 hover:bg-white text-lg px-8 h-14 border-white">
                    <Link href="/portfolio">Our Portfolio</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 2. ABOUT US PREVIEW */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm tracking-wide mb-2">
                ABOUT {companyProfile?.name?.toUpperCase() || "HALOK"}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Building Trust Through Premium Engineering
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                {companyProfile?.description}
              </p>

              <ul className="space-y-4 pt-4">
                <li className="flex items-center text-slate-700">
                  <CheckCircle2 className="h-6 w-6 text-blue-600 mr-3 shrink-0" />
                  <span className="font-medium text-lg">Over {companyProfile?.years_of_experience || 10} Years of Excellence</span>
                </li>
                <li className="flex items-center text-slate-700">
                  <CheckCircle2 className="h-6 w-6 text-blue-600 mr-3 shrink-0" />
                  <span className="font-medium text-lg">{companyProfile?.total_projects || "50+"} Successful Projects Delivered</span>
                </li>
                <li className="flex items-center text-slate-700">
                  <CheckCircle2 className="h-6 w-6 text-blue-600 mr-3 shrink-0" />
                  <span className="font-medium text-lg">ISO Certified & PWD Approved Contractor</span>
                </li>
              </ul>

              <div className="pt-8">
                <Button asChild variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                  <Link href="/about" className="flex items-center">
                    Learn More About Us <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1541888086225-f674ce8824f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Construction Site"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Floating Stat Card */}
              <div className="absolute -bottom-8 -left-8 bg-blue-600 text-white p-8 rounded-xl shadow-xl hidden md:block w-64 border-4 border-white">
                <div className="text-5xl font-bold mb-2">{companyProfile?.total_projects || "50"}+</div>
                <div className="text-blue-100 font-medium text-lg">Projects Completed Across Meghalaya</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED SERVICES */}
      <section className="py-24 bg-slate-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-6">Our Expertise</h2>
            <p className="text-lg text-slate-600">
              We provide comprehensive construction solutions tailored to withstand the unique geography and climate of our region.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices?.map((service) => (
              <div key={service.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-slate-100 group">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={service.main_image_url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"}
                    alt={service.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-sm font-semibold rounded-full text-blue-700 shadow-sm">
                    {service.category}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-600 transition-colors">
                    <Link href={`/services/${service.slug}`}>
                      {service.name}
                    </Link>
                  </h3>
                  <p className="text-slate-600 mb-6 line-clamp-3">
                    {service.short_description}
                  </p>
                  <Button asChild variant="ghost" className="text-blue-600 hover:text-blue-800 hover:bg-transparent px-0 group-hover:translate-x-2 transition-transform">
                    <Link href={`/services/${service.slug}`} className="flex items-center">
                      Explore Service <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-slate-900 text-white hover:bg-slate-800">
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 4. CTA SECTION */}
      <section className="relative py-24 bg-blue-600 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="container relative z-10 text-center text-white max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to start your next project?</h2>
          <p className="text-xl text-blue-100 mb-10">
            Contact us today for a consultation and estimate. Experience the difference of working with Meghalaya's premier construction firm.
          </p>
          <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-10 h-16 shadow-lg">
            <Link href="/contact">Get in Touch Today</Link>
          </Button>
        </div>
      </section>
=======

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
>>>>>>> 09a97839627de0a73691290943407c294371e3d1
    </div>
  );
}
