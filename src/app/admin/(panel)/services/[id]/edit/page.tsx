"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

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
import { Checkbox } from "@/components/ui/checkbox";
import ImageUploader from "@/components/ImageUploader";

const formSchema = z.object({
    name: z.string().min(2, "Service name is required"),
    slug: z.string().min(2, "URL slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
    category: z.string().min(2, "Category is required"),
    short_description: z.string().min(10, "Short description is required"),
    full_description: z.string().optional(),
    is_visible: z.boolean().default(true),
    price_range: z.string().optional(),
    main_image_url: z.string().optional().nullable(),
    features: z.string().optional(), // Comma separated for MVP
});

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            name: "",
            slug: "",
            category: "",
            short_description: "",
            full_description: "",
            is_visible: true,
            price_range: "",
            main_image_url: null,
            features: "",
        },
    });

    useEffect(() => {
        async function fetchService() {
            try {
                const { data, error } = await supabase
                    .from("services")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (error) throw error;

                if (data) {
                    form.reset({
                        name: data.name,
                        slug: data.slug,
                        category: data.category || "",
                        short_description: data.short_description || "",
                        full_description: data.full_description || "",
                        is_visible: data.is_visible,
                        price_range: data.price_range || "",
                        main_image_url: data.main_image_url,
                        features: data.features ? data.features.join("\n") : "",
                    });
                }
            } catch (error: any) {
                toast.error("Failed to load service", { description: error.message });
                router.push("/admin/services");
            } finally {
                setIsLoading(false);
            }
        }
        fetchService();
    }, [id, supabase, form, router]);

    // Auto-generate slug from name if empty
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        form.setValue("name", value);
        if (!form.getValues("slug")) {
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "");
            form.setValue("slug", slug);
        }
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSaving(true);
        try {
            // Process features string to array
            const featuresArray = values.features
                ? values.features.split("\n").map((f) => f.trim()).filter(Boolean)
                : [];

            const payload = {
                name: values.name,
                slug: values.slug,
                category: values.category,
                short_description: values.short_description,
                full_description: values.full_description,
                is_visible: values.is_visible,
                price_range: values.price_range,
                main_image_url: values.main_image_url,
                features: featuresArray,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase.from("services").update(payload).eq("id", id);

            if (error) throw error;

            toast.success("Service updated successfully");
            router.push("/admin/services");
            router.refresh();

        } catch (error: any) {
            console.error(error);
            toast.error("Failed to update service", {
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
                <Button asChild variant="outline" size="icon" className="h-10 w-10">
                    <Link href="/admin/services">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-[#1E3A5F]">Edit Service</h1>
                    <p className="text-slate-500 mt-1">Update existing service information.</p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column: Main Info */}
                        <div className="lg:col-span-2 space-y-8">
                            <Card className="border-slate-200">
                                <CardContent className="p-6 space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Service Name *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. Residential Construction" {...field} onChange={handleNameChange} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="slug"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>URL Slug *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. residential-construction" {...field} />
                                                    </FormControl>
                                                    <FormDescription>Used in the URL: /services/slug</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="category"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Category *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. Construction" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="price_range"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Price Range (Optional)</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. ₹50L - ₹5Cr" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="short_description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Short Description *</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="A brief summary for the services listing page..."
                                                        className="resize-y"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>Max 150 characters recommended.</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="full_description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Description (Optional)</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Detailed explanation of the service. You can use multiple paragraphs..."
                                                        className="min-h-[200px] resize-y"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="features"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Key Features</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Enter one feature per line&#10;Expert Project Management&#10;Quality Materials&#10;On-time Delivery"
                                                        className="min-h-[120px] resize-y"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>List the benefits or features. Put each on a new line.</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column: Image and Status */}
                        <div className="lg:col-span-1 space-y-8">
                            <Card className="border-slate-200">
                                <CardContent className="p-6 space-y-6">
                                    <h3 className="font-semibold text-[#1E3A5F]">Service Image</h3>
                                    <FormField
                                        control={form.control}
                                        name="main_image_url"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <ImageUploader
                                                        bucket="halok_media"
                                                        folder="services"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        onRemove={() => field.onChange(null)}
                                                        label="Service Cover"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card className="border-slate-200">
                                <CardContent className="p-6 space-y-6">
                                    <h3 className="font-semibold text-[#1E3A5F]">Visibility Status</h3>
                                    <FormField
                                        control={form.control}
                                        name="is_visible"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel>Publicly Visible</FormLabel>
                                                    <FormDescription>
                                                        Show this service on the live website.
                                                    </FormDescription>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 border-t border-slate-200 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/admin/services")}
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 min-w-[150px]" disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" /> Update Service
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
