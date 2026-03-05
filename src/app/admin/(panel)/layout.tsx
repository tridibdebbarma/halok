"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Building2,
    LayoutDashboard,
    Settings,
    MenuSquare,
    Briefcase,
    Package,
    FolderGit2,
    MessageSquare,
    Users,
    Image as ImageIcon,
    LogOut,
    Menu,
    ShieldCheck
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { toast } from "sonner";

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Company Profile', href: '/admin/company', icon: Building2 },
    { name: 'Site Settings', href: '/admin/settings', icon: Settings },
    { name: 'Navigation Menus', href: '/admin/menus', icon: MenuSquare },
    { name: 'Services', href: '/admin/services', icon: Briefcase },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Portfolio', href: '/admin/portfolio', icon: FolderGit2 },
    { name: 'Inquiries', href: '/admin/contacts', icon: MessageSquare },
    { name: 'Team Members', href: '/admin/team', icon: Users },
    { name: 'Hero Slides', href: '/admin/hero', icon: ImageIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            toast.success("Successfully signed out");
            router.push("/admin/login");
            router.refresh();
        } catch (error) {
            toast.error("Error signing out");
        }
    };

    const SidebarContent = () => (
        <div className="flex h-full flex-col overflow-y-auto bg-[#1E3A5F] px-4 py-8 ring-1 ring-white/10">
            <div className="flex items-center gap-3 px-2 mb-8">
                <ShieldCheck className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold text-white tracking-wide">Halok Admin</span>
            </div>

            <nav className="flex flex-1 flex-col space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`
                group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors
                ${isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                                }
              `}
                        >
                            <item.icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-blue-300 group-hover:text-white'}`} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-8 border-t border-blue-800 pt-6">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-blue-200 hover:bg-red-500/10 hover:text-red-400 font-medium px-3"
                    onClick={handleSignOut}
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign Out
                </Button>
                <div className="mt-6 text-xs text-center text-blue-400/60 font-medium">
                    Halok OS v1.0
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen flex-col md:flex-row bg-slate-50">

            {/* 1. Desktop Sidebar */}
            <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col z-20">
                <SidebarContent />
            </div>

            {/* 2. Mobile Header */}
            <div className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-[#1E3A5F]" />
                    <span className="text-lg font-bold text-[#1E3A5F]">Halok Admin</span>
                </div>

                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-slate-600">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[280px] p-0 border-none">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>

            {/* 3. Main Content Area */}
            <main className="flex-1 md:pl-64">
                <div className="mx-auto max-w-7xl p-4 md:p-8 xl:p-10">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[calc(100vh-6rem)]">
                        {children}
                    </div>
                </div>
            </main>

        </div>
    );
}
