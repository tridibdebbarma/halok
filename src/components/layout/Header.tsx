"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { createClient } from "@/lib/supabase/client";
import { MenuItem, SubMenuItem } from "@/types/database";
import Image from "next/image";

interface HeaderProps {
    companyName: string;
    logoUrl: string | null;
}

// Reusable MegaMenu structure 
// To keep it simple, we'll fetch menus client-side or pass them as props.
// For now, let's fetch client-side for dynamic updates without full reload.

export default function Header({ companyName, logoUrl }: HeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [menus, setMenus] = useState<(MenuItem & { sub_menus: SubMenuItem[] })[]>([]);
    const pathname = usePathname();
    const supabase = createClient();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        async function fetchMenus() {
            // Fetch menus and submenus
            const { data: menuData } = await supabase
                .from("menus")
                .select("*")
                .eq("is_visible", true)
                .order("order_index", { ascending: true });

            if (!menuData) return;

            const { data: subMenuData } = await supabase
                .from("sub_menus")
                .select("*")
                .eq("is_visible", true)
                .order("order_index", { ascending: true });

            const menusWithSub = menuData.map((menu) => ({
                ...menu,
                sub_menus: subMenuData?.filter((sub) => sub.menu_id === menu.id) || [],
            }));

            setMenus(menusWithSub);
        }

        fetchMenus();
    }, [supabase]);

    // Mobile menu links list
    const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
        <ul className={`flex ${mobile ? "flex-col space-y-4" : "items-center space-x-8"}`}>
            {menus.map((menu) => {
                const isActive = pathname === menu.href || pathname.startsWith(`${menu.href}/`);
                const hasSubmenus = menu.sub_menus.length > 0;

                return (
                    <li key={menu.id} className="relative group">
                        <Link
                            href={menu.href}
                            className={`flex items-center text-sm font-medium transition-colors hover:text-blue-600 ${isActive ? "text-blue-600" : "text-slate-700"
                                } ${mobile ? "text-lg py-2" : ""}`}
                        >
                            {menu.label}
                            {hasSubmenus && !mobile && <ChevronDown className="ml-1 h-4 w-4" />}
                        </Link>

                        {/* Desktop Dropdown */}
                        {hasSubmenus && !mobile && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg border border-slate-100 rounded-md py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                {menu.sub_menus.map((sub) => (
                                    <Link
                                        key={sub.id}
                                        href={sub.href}
                                        className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                                    >
                                        {sub.label}
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Mobile Submenu Preview */}
                        {hasSubmenus && mobile && (
                            <div className="pl-4 mt-2 border-l-2 border-slate-100 space-y-2">
                                {menu.sub_menus.map((sub) => (
                                    <Link
                                        key={sub.id}
                                        href={sub.href}
                                        className="block py-1 text-sm text-slate-500 hover:text-blue-600"
                                    >
                                        {sub.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </li>
                );
            })}
        </ul>
    );

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled
                    ? "bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm py-4"
                    : "bg-white py-6"
                }`}
        >
            <div className="container flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 z-50">
                    {logoUrl && (
                        <div className="relative h-10 w-10">
                            <Image
                                src={logoUrl}
                                alt={`${companyName} Logo`}
                                fill
                                className="object-contain"
                            />
                        </div>
                    )}
                    <span className="text-xl md:text-2xl font-bold tracking-tighter text-[#1E3A5F]">
                        {companyName}
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-8">
                    <NavLinks />
                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                        <Link href="/contact">Get a Quote</Link>
                    </Button>
                </nav>

                {/* Mobile Navigation Toggle */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="lg:hidden text-slate-700">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle mobile menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                        <nav className="flex flex-col gap-6 mt-8">
                            <Link href="/" className="text-xl font-bold text-[#1E3A5F] mb-6">
                                {companyName}
                            </Link>
                            <NavLinks mobile />
                            <div className="mt-8">
                                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                                    <Link href="/contact">Get a Quote</Link>
                                </Button>
                            </div>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
