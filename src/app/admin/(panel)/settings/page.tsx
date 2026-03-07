"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save, Globe, Palette, Check } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import ImageUploader from "@/components/ImageUploader";

const THEMES = [
    {
        id: "blue",
        name: "Classic Blue",
        description: "Professional navy & blue — the trusted construction look.",
        primary: "#1E3A5F",
        accent: "#2563eb",
    },
    {
        id: "emerald",
        name: "Emerald Green",
        description: "Fresh & sustainable — eco-friendly, modern feel.",
        primary: "#064E3B",
        accent: "#059669",
    },
    {
        id: "amber",
        name: "Warm Amber",
        description: "Earthy & premium — warm tones, rugged charm.",
        primary: "#78350F",
        accent: "#d97706",
    },
    {
        id: "slate",
        name: "Slate Modern",
        description: "Sleek & corporate — modern, tech-forward look.",
        primary: "#1E293B",
        accent: "#6366f1",
    },
];

const formSchema = z.object({
    id: z.string().optional(),
    site_name: z.string().min(2, "Site name is required"),
    tagline: z.string().optional(),
    default_meta_description: z.string().max(160, "Keep under 160 characters for SEO").optional(),
    contact_email: z.string().email("Must be a valid email").optional().or(z.literal('')),
    logo_url: z.string().optional().nullable(),
    favicon_url: z.string().optional().nullable(),
    active_theme: z.string().default("blue"),
});

export default function SiteSettingsAdminPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            site_name: "Halok Construction",
            tagline: "",
            default_meta_description: "",
            contact_email: "",
            logo_url: null,
            favicon_url: null,
            active_theme: "blue",
        },
    });

    const activeTheme = form.watch("active_theme");

    useEffect(() => {
        async function fetchSettings() {
            try {
                const { data, error } = await supabase
                    .from("site_settings")
                    .select("*")
                    .limit(1)
                    .single();

                if (error && error.code !== "PGRST116") {
                    throw error;
                }

                if (data) {
                    form.reset({
                        id: data.id,
                        site_name: data.site_name,
                        tagline: data.tagline || "",
                        default_meta_description: data.default_meta_description || "",
                        contact_email: data.contact_email || "",
                        logo_url: data.logo_url,
                        favicon_url: data.favicon_url,
                        active_theme: data.active_theme || "blue",
                    });
                }
            } catch (error: any) {
                toast.error("Failed to load settings", { description: error.message });
            } finally {
                setIsLoading(false);
            }
        }
        fetchSettings();
    }, [supabase, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSaving(true);
        try {
            const payload = {
                site_name: values.site_name,
                tagline: values.tagline,
                default_meta_description: values.default_meta_description,
                contact_email: values.contact_email,
                logo_url: values.logo_url,
                favicon_url: values.favicon_url,
                active_theme: values.active_theme,
                updated_at: new Date().toISOString(),
            };

            if (values.id) {
                const { error } = await supabase
                    .from("site_settings")
                    .update(payload)
                    .eq("id", values.id);
                if (error) throw error;
            } else {
                const { data, error } = await supabase
                    .from("site_settings")
                    .insert([payload])
                    .select()
                    .single();
                if (error) throw error;
                form.setValue("id", data.id);
            }

            toast.success("Site settings updated successfully", {
                description: "Refresh the public pages to see the changes.",
            });

        } catch (error: any) {
            console.error(error);
            toast.error("Failed to update settings", {
                description: error.message || "An unexpected error occurred.",
            });
        } finally {
            setIsSaving(false);
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="p-6 pb-20 max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#1E3A5F]">Global Site Settings</h1>
                    <p className="text-slate-500 mt-1">Configure foundational details like site name, SEO, theme, and main contact points.</p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column: Text Info */}
                        <div className="lg:col-span-2 space-y-8">
                            <Card className="border-slate-200">
                                <CardContent className="p-6 space-y-6">
                                    <div className="flex items-center gap-2 mb-2 text-[#1E3A5F]">
                                        <Globe className="h-5 w-5" />
                                        <h3 className="text-xl font-semibold">General configuration</h3>
                                    </div>

                                    <div className="grid gap-6">
                                        <FormField
                                            control={form.control}
                                            name="site_name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Site Name *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Halok Construction" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Used in the browser tab title and default SEO.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="tagline"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Tagline</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Building the Future" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="contact_email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>System Notification Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="contact-us@halok.co.in" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Where system notifications (like form submission alerts) should be sent.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="default_meta_description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Default SEO Meta Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Halok Construction provides premium residential and commercial building services..."
                                                        className="resize-y"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Shows up in Google search results (Recommended: 150-160 characters).
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            {/* Theme Selector Card */}
                            <Card className="border-slate-200">
                                <CardContent className="p-6 space-y-6">
                                    <div className="flex items-center gap-2 mb-2 text-[#1E3A5F]">
                                        <Palette className="h-5 w-5" />
                                        <h3 className="text-xl font-semibold">Site Theme</h3>
                                    </div>
                                    <p className="text-slate-500 text-sm">
                                        Choose a color theme for the entire website. Changes take effect after saving and refreshing the site.
                                    </p>

                                    <FormField
                                        control={form.control}
                                        name="active_theme"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="grid sm:grid-cols-2 gap-4">
                                                        {THEMES.map((theme) => (
                                                            <button
                                                                key={theme.id}
                                                                type="button"
                                                                onClick={() => field.onChange(theme.id)}
                                                                className={`relative text-left p-5 rounded-xl border-2 transition-all duration-200 ${field.value === theme.id
                                                                        ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-200'
                                                                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                                                                    }`}
                                                            >
                                                                {field.value === theme.id && (
                                                                    <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                                                                        <Check className="h-4 w-4" />
                                                                    </div>
                                                                )}
                                                                <div className="flex items-center gap-3 mb-3">
                                                                    <div className="flex gap-1.5">
                                                                        <div
                                                                            className="h-8 w-8 rounded-lg shadow-inner border border-black/10"
                                                                            style={{ backgroundColor: theme.primary }}
                                                                        />
                                                                        <div
                                                                            className="h-8 w-8 rounded-lg shadow-inner border border-black/10"
                                                                            style={{ backgroundColor: theme.accent }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <h4 className="font-bold text-slate-800 text-sm">{theme.name}</h4>
                                                                <p className="text-slate-500 text-xs mt-1">{theme.description}</p>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column: Images */}
                        <div className="lg:col-span-1 space-y-8">
                            <Card className="border-slate-200">
                                <CardContent className="p-6 space-y-6">
                                    <h3 className="font-semibold text-[#1E3A5F]">Branding</h3>

                                    <FormField
                                        control={form.control}
                                        name="logo_url"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <ImageUploader
                                                        bucket="halok_media"
                                                        folder="brand"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        onRemove={() => field.onChange(null)}
                                                        label="Site Logo (Header)"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="pt-4 border-t border-slate-100">
                                        <FormField
                                            control={form.control}
                                            name="favicon_url"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <ImageUploader
                                                            bucket="halok_media"
                                                            folder="brand"
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            onRemove={() => field.onChange(null)}
                                                            label="Browser Favicon (Square)"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Theme Preview Card */}
                            <Card className="border-slate-200 overflow-hidden">
                                <div
                                    className="h-16 flex items-center justify-center text-white text-sm font-semibold tracking-wider uppercase"
                                    style={{ backgroundColor: THEMES.find(t => t.id === activeTheme)?.primary || '#1E3A5F' }}
                                >
                                    Theme Preview
                                </div>
                                <CardContent className="p-4 space-y-3">
                                    <div
                                        className="h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                                        style={{ backgroundColor: THEMES.find(t => t.id === activeTheme)?.accent || '#2563eb' }}
                                    >
                                        Button Color
                                    </div>
                                    <div className="text-xs text-slate-500 text-center">
                                        {THEMES.find(t => t.id === activeTheme)?.name || 'Classic Blue'}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="flex justify-start gap-4 border-t border-slate-200 pt-6">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 min-w-[150px]" disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" /> Save Settings
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
