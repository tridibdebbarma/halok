import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const revalidate = 0; // Force dynamic rendering so layout doesn't use stale cached DB data

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createServerSupabaseClient();
  const { data: settings } = await supabase.from("site_settings").select("*").single();

  return {
    title: {
      template: `%s | ${settings?.site_name || "Halok Construction"}`,
      default: settings?.site_name || "Halok Construction",
    },
    description: settings?.default_meta_description || "Professional construction services for residential and commercial projects.",
    icons: {
      icon: settings?.favicon_url || "/favicon.ico",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createServerSupabaseClient();

  // Fetch global data needed for layouts
  const [
    { data: settings },
    { data: company },
    { data: menus }
  ] = await Promise.all([
    supabase.from("site_settings").select("*").single(),
    supabase.from("company_profile").select("*").single(),
    supabase.from("menus").select("*, sub_menus(*)").eq("is_visible", true).order("order_index")
  ]);

  // Active theme from DB, fallback to blue
  const activeTheme = settings?.active_theme || "blue";

  return (
    <html lang="en" data-theme={activeTheme}>
      <body className={inter.className}>
        <Header
          settings={settings}
          company={company}
          menus={menus || []}
        />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer
          settings={settings}
          company={company}
          menus={menus || []}
        />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
