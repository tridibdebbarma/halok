"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save, Globe } from "lucide-react";
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

const formSchema = z.object({
    id: z.string().optional(),
    site_name: z.string().min(2, "Site name is required"),
    tagline: z.string().optional(),
    default_meta_description: z.string().max(160, "Keep under 160 characters for SEO").optional(),
    contact_email: z.string().email("Must be a valid email").optional().or(z.literal('')),
    logo_url: z.string().optional().nullable(),
    favicon_url: z.string().optional().nullable(),
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
        },
    });

    useEffect(() => {
        async function fetchSettings() {
            try {
                const { data, error } = await supabase
                    .from("site_settings")
                    .select("*")
                    .limit(1)
                    .single();

                if (error && error.code !== "PGRST116") { // Ignore no rows error for now, we'll insert one
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
                updated_at: new Date().toISOString(),
            };

            if (values.id) {
                // Update existing
                const { error } = await supabase
                    .from("site_settings")
                    .update(payload)
                    .eq("id", values.id);
                if (error) throw error;
            } else {
                // Insert new
                const { data, error } = await supabase
                    .from("site_settings")
                    .insert([payload])
                    .select()
                    .single();
                if (error) throw error;
                form.setValue("id", data.id);
            }

            toast.success("Site settings updated successfully");

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
                    <p className="text-slate-500 mt-1">Configure foundational details like site name, SEO, and main contact points.</p>
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
