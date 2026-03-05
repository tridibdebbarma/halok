"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Loader2, Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

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
    title: z.string().min(2, "Project title is required"),
    slug: z.string().min(2, "URL slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
    service_type: z.string().optional(),
    client_name: z.string().optional(),
    location: z.string().optional(),
    date_completed: z.string().optional(),
    short_description: z.string().min(10, "Short description is required"),
    full_description: z.string().optional(),
    is_visible: z.boolean().default(true),
    main_image_url: z.string().optional().nullable(),
    galleryUrls: z.array(z.object({ url: z.string().url("Must be a valid URL") })).optional(),
});

export default function EditPortfolioPage({ params }: { params: { id: string } }) {
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            title: "",
            slug: "",
            service_type: "",
            client_name: "",
            location: "",
            date_completed: "",
            short_description: "",
            full_description: "",
            is_visible: true,
            main_image_url: null,
            galleryUrls: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "galleryUrls",
    });

    useEffect(() => {
        async function fetchProject() {
            try {
                const { data, error } = await supabase
                    .from("portfolio")
                    .select("*")
                    .eq("id", params.id)
                    .single();

                if (error) throw error;

                if (data) {
                    // Format date for the HTML date input (YYYY-MM-DD)
                    let formattedDate = "";
                    if (data.date_completed) {
                        formattedDate = new Date(data.date_completed).toISOString().split("T")[0];
                    }

                    const parsedGallery = data.gallery_urls
                        ? data.gallery_urls.map((url: string) => ({ url }))
                        : [];

                    form.reset({
                        title: data.title,
                        slug: data.slug,
                        service_type: data.service_type || "",
                        client_name: data.client_name || "",
                        location: data.location || "",
                        date_completed: formattedDate,
                        short_description: data.short_description || "",
                        full_description: data.full_description || "",
                        is_visible: data.is_visible,
                        main_image_url: data.main_image_url,
                        galleryUrls: parsedGallery,
                    });
                }
            } catch (error: any) {
                toast.error("Failed to load project", { description: error.message });
                router.push("/admin/portfolio");
            } finally {
                setIsLoading(false);
            }
        }
        fetchProject();
    }, [params.id, supabase, form, router]);

    // Auto-generate slug from title
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        form.setValue("title", value);
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
            const galleryArray = values.galleryUrls?.map(g => g.url).filter(url => url.length > 0) || [];

            const payload = {
                title: values.title,
                slug: values.slug,
                service_type: values.service_type,
                client_name: values.client_name,
                location: values.location,
                date_completed: values.date_completed ? new Date(values.date_completed).toISOString() : null,
                short_description: values.short_description,
                full_description: values.full_description,
                is_visible: values.is_visible,
                main_image_url: values.main_image_url,
                gallery_urls: galleryArray,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase.from("portfolio").update(payload).eq("id", params.id);

            if (error) throw error;

            toast.success("Project updated successfully");
            router.push("/admin/portfolio");
            router.refresh();

        } catch (error: any) {
            console.error(error);
            toast.error("Failed to update project", {
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
                    <Link href="/admin/portfolio">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-[#1E3A5F]">Edit Project</h1>
                    <p className="text-slate-500 mt-1">Update showcased construction project details.</p>
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
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Project Title *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. Skyline Blue Towers" {...field} onChange={handleTitleChange} />
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
                                                        <Input placeholder="e.g. skyline-blue-towers" {...field} />
                                                    </FormControl>
                                                    <FormDescription>Used in the URL: /portfolio/slug</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="client_name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Client Name (Optional)</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. TechCorp Builders" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="service_type"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Service Type</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. Commercial Construction" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="location"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Location</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. Shillong, Meghalaya" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="date_completed"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Date Completed</FormLabel>
                                                    <FormControl>
                                                        <Input type="date" {...field} />
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
                                                <FormLabel>Brief Summary *</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="A concise description for the portfolio grid..."
                                                        className="resize-y"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="full_description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Detailed Project Case Study (Optional)</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Explain the challenges, process, and final outcome..."
                                                        className="min-h-[200px] resize-y"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            {/* Gallery Builder */}
                            <Card className="border-slate-200">
                                <CardContent className="p-6 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xl font-semibold text-[#1E3A5F]">Additional Gallery Images</h3>
                                            <p className="text-sm text-slate-500">Add URLs or upload images for the project slider.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {fields.map((field, index) => (
                                            <div key={field.id} className="flex items-start gap-4 p-4 border rounded-lg bg-slate-50">
                                                <div className="flex-1 space-y-2">
                                                    <FormField
                                                        control={form.control}
                                                        name={`galleryUrls.${index}.url`}
                                                        render={({ field: inputField }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Image #{index + 1}</FormLabel>
                                                                <FormControl>
                                                                    <ImageUploader
                                                                        bucket="halok_media"
                                                                        folder="portfolio"
                                                                        value={inputField.value}
                                                                        onChange={(url) => inputField.onChange(url)}
                                                                        onRemove={() => inputField.onChange("")}
                                                                        label="Upload Gallery Image"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:bg-red-50 hover:text-red-600 mt-6"
                                                    onClick={() => remove(index)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}

                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full border-dashed text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                            onClick={() => append({ url: "" })}
                                        >
                                            <Plus className="mr-2 h-4 w-4" /> Add Gallery Image
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column: Main Image and Status */}
                        <div className="lg:col-span-1 space-y-8">
                            <Card className="border-slate-200">
                                <CardContent className="p-6 space-y-6">
                                    <h3 className="font-semibold text-[#1E3A5F]">Cover Image</h3>
                                    <FormField
                                        control={form.control}
                                        name="main_image_url"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <ImageUploader
                                                        bucket="halok_media"
                                                        folder="portfolio"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        onRemove={() => field.onChange(null)}
                                                        label="Project Cover"
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    This image appears in the main portfolio grid.
                                                </FormDescription>
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
                                                        Show this project in your portfolio.
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
                            onClick={() => router.push("/admin/portfolio")}
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
                                    <Save className="mr-2 h-4 w-4" /> Update Project
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
