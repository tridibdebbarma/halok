"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Save, Menu as MenuIcon, CornerDownRight } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface Menu {
    id: string;
    label: string;
    href: string;
    order_index: number;
    is_visible: boolean;
    sub_menus?: SubMenu[];
}

interface SubMenu {
    id: string;
    menu_id: string;
    label: string;
    href: string;
    order_index: number;
    is_visible: boolean;
}

export default function MenusAdminPage() {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        fetchMenus();
    }, []);

    async function fetchMenus() {
        setIsLoading(true);
        try {
            // 1. Fetch top-level menus
            const { data: menuData, error: menuError } = await supabase
                .from("menus")
                .select("*")
                .order("order_index", { ascending: true });

            if (menuError) throw menuError;

            // 2. Fetch submenus
            const { data: subMenuData, error: subMenuError } = await supabase
                .from("sub_menus")
                .select("*")
                .order("order_index", { ascending: true });

            if (subMenuError) throw subMenuError;

            // 3. Combine them
            const combined = (menuData || []).map((m: any) => ({
                ...m,
                sub_menus: (subMenuData || []).filter((sm: any) => sm.menu_id === m.id),
            }));

            setMenus(combined);
        } catch (error: any) {
            toast.error("Failed to fetch menus", { description: error.message });
        } finally {
            setIsLoading(false);
        }
    }

    // Handle local state changes for Menus
    const updateMenu = (id: string, field: keyof Menu, value: any) => {
        setMenus(menus.map(m => m.id === id ? { ...m, [field]: value } : m));
    };

    // Handle local state changes for SubMenus
    const updateSubMenu = (menuId: string, subId: string, field: keyof SubMenu, value: any) => {
        setMenus(menus.map(m => {
            if (m.id !== menuId) return m;
            return {
                ...m,
                sub_menus: m.sub_menus?.map(sm => sm.id === subId ? { ...sm, [field]: value } : sm)
            };
        }));
    };

    const addMenu = async () => {
        try {
            const newMenu = {
                label: "New Item",
                href: "/",
                order_index: menus.length,
                is_visible: true,
            };

            const { data, error } = await supabase.from("menus").insert([newMenu]).select().single();
            if (error) throw error;

            setMenus([...menus, { ...data, sub_menus: [] }]);
            toast.success("Menu added");
        } catch (error: any) {
            toast.error("Failed to add menu", { description: error.message });
        }
    };

    const addSubMenu = async (menuId: string) => {
        try {
            const parentMenu = menus.find(m => m.id === menuId);
            const newOrder = parentMenu?.sub_menus?.length || 0;

            const newSub = {
                menu_id: menuId,
                label: "New Sub-Item",
                href: "/",
                order_index: newOrder,
                is_visible: true,
            };

            const { data, error } = await supabase.from("sub_menus").insert([newSub]).select().single();
            if (error) throw error;

            setMenus(menus.map(m => m.id === menuId ? { ...m, sub_menus: [...(m.sub_menus || []), data] } : m));
            toast.success("Sub-menu added");
        } catch (error: any) {
            toast.error("Failed to add sub-menu", { description: error.message });
        }
    };

    const deleteMenu = async (id: string) => {
        if (!confirm("Delete this menu and all its sub-menus?")) return;
        try {
            const { error } = await supabase.from("menus").delete().eq("id", id);
            if (error) throw error;
            setMenus(menus.filter(m => m.id !== id));
            toast.success("Menu deleted");
        } catch (error: any) {
            toast.error("Failed to delete menu", { description: error.message });
        }
    };

    const deleteSubMenu = async (menuId: string, subId: string) => {
        if (!confirm("Delete this sub-menu?")) return;
        try {
            const { error } = await supabase.from("sub_menus").delete().eq("id", subId);
            if (error) throw error;
            setMenus(menus.map(m => m.id === menuId ? { ...m, sub_menus: m.sub_menus?.filter(sm => sm.id !== subId) } : m));
            toast.success("Sub-menu deleted");
        } catch (error: any) {
            toast.error("Failed to delete sub-menu", { description: error.message });
        }
    };

    const saveChanges = async () => {
        setIsSaving(true);
        try {
            // Very basic batch update (looping is fine for small amounts of data like menus)
            for (const menu of menus) {
                // Update menu
                await supabase.from("menus").update({
                    label: menu.label,
                    href: menu.href,
                    order_index: menu.order_index,
                    is_visible: menu.is_visible
                }).eq("id", menu.id);

                // Update its submenus
                if (menu.sub_menus) {
                    for (const sub of menu.sub_menus) {
                        await supabase.from("sub_menus").update({
                            label: sub.label,
                            href: sub.href,
                            order_index: sub.order_index,
                            is_visible: sub.is_visible
                        }).eq("id", sub.id);
                    }
                }
            }

            // Trigger Next.js revalidation endpoint if we had one, or just show success
            toast.success("Navigation saved successfully");
        } catch (error: any) {
            toast.error("Error saving changes", { description: error.message });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-6 pb-20 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#1E3A5F]">Navigation Menus</h1>
                    <p className="text-slate-500 mt-1">Manage the top header links and dropdowns.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={addMenu}>
                        <Plus className="mr-2 h-4 w-4" /> Add Menu Item
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={saveChanges} disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center p-20">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            ) : (
                <Card className="border-slate-200">
                    <CardHeader className="bg-slate-50 border-b border-slate-100">
                        <CardTitle className="text-lg">Menu Structure</CardTitle>
                        <CardDescription>Drag and drop is not yet supported. Use the Sort Order inputs to arrange items.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        {menus.length === 0 ? (
                            <div className="text-center p-8 text-slate-500 border-2 border-dashed rounded-lg">
                                <MenuIcon className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                                <p>No navigation items found. Click 'Add Menu Item' to start.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Header Row */}
                                <div className="hidden md:grid grid-cols-12 gap-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    <div className="col-span-1 border-r border-slate-200 pr-2">Visible</div>
                                    <div className="col-span-4">Label</div>
                                    <div className="col-span-4">URL (Href)</div>
                                    <div className="col-span-2">Sort Order</div>
                                    <div className="col-span-1 text-right">Actions</div>
                                </div>

                                {/* Sort by order_index for display */}
                                {[...menus].sort((a, b) => a.order_index - b.order_index).map((menu) => (
                                    <div key={menu.id} className="space-y-2">
                                        {/* Top Level Menu */}
                                        <div className="bg-white border rounded-lg p-4 shadow-sm grid md:grid-cols-12 gap-4 items-center group">
                                            <div className="md:col-span-1 flex justify-center">
                                                <Checkbox
                                                    checked={menu.is_visible}
                                                    onCheckedChange={(checked) => updateMenu(menu.id, 'is_visible', !!checked)}
                                                />
                                            </div>
                                            <div className="md:col-span-4">
                                                <Input
                                                    value={menu.label}
                                                    onChange={(e) => updateMenu(menu.id, 'label', e.target.value)}
                                                    className="font-medium"
                                                    placeholder="e.g. Services"
                                                />
                                            </div>
                                            <div className="md:col-span-4">
                                                <Input
                                                    value={menu.href}
                                                    onChange={(e) => updateMenu(menu.id, 'href', e.target.value)}
                                                    className="font-mono text-sm"
                                                    placeholder="e.g. /services"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <Input
                                                    type="number"
                                                    value={menu.order_index}
                                                    onChange={(e) => updateMenu(menu.id, 'order_index', parseInt(e.target.value) || 0)}
                                                />
                                            </div>
                                            <div className="md:col-span-1 flex justify-end gap-1">
                                                <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50" onClick={() => addSubMenu(menu.id)} title="Add Sub-menu">
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => deleteMenu(menu.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Sub Menus */}
                                        {menu.sub_menus && menu.sub_menus.length > 0 && (
                                            <div className="pl-8 space-y-2">
                                                {[...menu.sub_menus].sort((a, b) => a.order_index - b.order_index).map((sub) => (
                                                    <div key={sub.id} className="bg-slate-50 border rounded-lg p-3 grid md:grid-cols-12 gap-4 items-center relative">
                                                        {/* Visual connector */}
                                                        <div className="absolute -left-6 top-1/2 -translate-y-1/2 text-slate-300">
                                                            <CornerDownRight className="h-5 w-5" />
                                                        </div>

                                                        <div className="md:col-span-1 flex justify-center">
                                                            <Checkbox
                                                                checked={sub.is_visible}
                                                                onCheckedChange={(checked) => updateSubMenu(menu.id, sub.id, 'is_visible', !!checked)}
                                                            />
                                                        </div>
                                                        <div className="md:col-span-4">
                                                            <Input
                                                                value={sub.label}
                                                                onChange={(e) => updateSubMenu(menu.id, sub.id, 'label', e.target.value)}
                                                                className="h-9"
                                                            />
                                                        </div>
                                                        <div className="md:col-span-4">
                                                            <Input
                                                                value={sub.href}
                                                                onChange={(e) => updateSubMenu(menu.id, sub.id, 'href', e.target.value)}
                                                                className="h-9 font-mono text-sm"
                                                            />
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <Input
                                                                type="number"
                                                                value={sub.order_index}
                                                                onChange={(e) => updateSubMenu(menu.id, sub.id, 'order_index', parseInt(e.target.value) || 0)}
                                                                className="h-9"
                                                            />
                                                        </div>
                                                        <div className="md:col-span-1 flex justify-end">
                                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => deleteSubMenu(menu.id, sub.id)}>
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
