import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// Components
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const revalidate = 3600; // Revalidate every hour

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createServerSupabaseClient();
  const { data: siteSettings } = await supabase
    .from("site_settings")
    .select("*")
    .single();

  return {
    title: {
      template: `%s | ${siteSettings?.site_name || "Halok Construction"}`,
      default: `${siteSettings?.site_name || "Halok Construction"} - ${siteSettings?.tagline || ""}`,
    },
    description: siteSettings?.default_meta_description || "Premium construction company in Meghalaya.",
    icons: {
      icon: siteSettings?.favicon_url || "/favicon.ico",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch site-wide data for header and footer
  const supabase = await createServerSupabaseClient();

  // 1. Company Profile
  const { data: companyProfile } = await supabase
    .from("company_profile")
    .select("*")
    .single();

  // 2. Site Settings
  const { data: siteSettings } = await supabase
    .from("site_settings")
    .select("*")
    .single();

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Header
            companyName={companyProfile?.name || "Halok Construction"}
            logoUrl={siteSettings?.logo_url || null}
          />
          <main className="flex-1">{children}</main>
          <Footer companyProfile={companyProfile} />
        </div>
      </body>
    </html>
  );
}
