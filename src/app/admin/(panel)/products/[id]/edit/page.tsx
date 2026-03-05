"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Loader2, Save, Plus, Trash2 } from "lucide-react";
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
    name: z.string().min(2, "Product name is required"),
    category: z.string().min(2, "Category is required"),
    short_description: z.string().min(5, "Short description is required"),
    full_description: z.string().optional(),
    price: z.string().optional(),
    is_visible: z.boolean().default(true),
    main_image_url: z.string().optional().nullable(),
    specsArray: z.array(
        z.object({
            key: z.string().min(1, "Key is required"),
            value: z.string().min(1, "Value is required"),
        })
    ).optional(),
});

export default function EditProductPage({ params }: { params: { id: string } }) {
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            name: "",
            category: "",
            short_description: "",
            full_description: "",
            price: "",
            is_visible: true,
            main_image_url: null,
            specsArray: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "specsArray",
    });

    useEffect(() => {
        async function fetchProduct() {
            try {
                const { data, error } = await supabase
                    .from("products")
                    .select("*")
                    .eq("id", params.id)
                    .single();

                if (error) throw error;

                if (data) {
                    // Parse JSONB specs back to array format for the dynamic form
                    const parsedSpecsArray: { key: string; value: string }[] = [];
                    if (data.specs) {
                        Object.entries(data.specs).forEach(([key, value]) => {
                            parsedSpecsArray.push({ key, value: String(value) });
                        });
                    }

                    form.reset({
                        name: data.name,
                        category: data.category,
                        short_description: data.short_description || "",
                        full_description: data.full_description || "",
                        price: data.price || "",
                        is_visible: data.is_visible,
                        main_image_url: data.main_image_url,
                        specsArray: parsedSpecsArray,
                    });
                }
            } catch (error: any) {
                toast.error("Failed to load product", { description: error.message });
                router.push("/admin/products");
            } finally {
                setIsLoading(false);
            }
        }
        fetchProduct();
    }, [params.id, supabase, form, router]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSaving(true);
        try {
            // Convert specsArray back to JSON object
            const specsObj: Record<string, string> = {};
            if (values.specsArray) {
                values.specsArray.forEach((spec) => {
                    if (spec.key && spec.value) {
                        specsObj[spec.key.trim()] = spec.value.trim();
                    }
                });
            }

            const payload = {
                name: values.name,
                category: values.category,
                short_description: values.short_description,
                full_description: values.full_description,
                price: values.price,
                is_visible: values.is_visible,
                main_image_url: values.main_image_url,
                specs: specsObj,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase.from("products").update(payload).eq("id", params.id);

            if (error) throw error;

            toast.success("Product updated successfully");
            router.push("/admin/products");
            router.refresh();

        } catch (error: any) {
            console.error(error);
            toast.error("Failed to update product", {
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
                    <Link href="/admin/products">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-[#1E3A5F]">Edit Product</h1>
                    <p className="text-slate-500 mt-1">Update details for existing catalog item.</p>
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
                                                    <FormLabel>Product Name *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. Portland Cement Grade 53" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="category"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Category *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. Cement" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Price (Optional)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. ₹400 / bag or 'Contact for price'" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="short_description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Short Description *</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="A brief summary for the catalog grid..."
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
                                                <FormLabel>Full Description (Optional)</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Detailed explanation, uses, and benefits..."
                                                        className="min-h-[150px] resize-y"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            {/* Specifications Card */}
                            <Card className="border-slate-200">
                                <CardContent className="p-6 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xl font-semibold text-[#1E3A5F]">Specifications</h3>
                                            <p className="text-sm text-slate-500">Update technical details as key-value pairs.</p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => append({ key: "", value: "" })}
                                            className="bg-slate-50"
                                        >
                                            <Plus className="mr-2 h-4 w-4" /> Add Row
                                        </Button>
                                    </div>

                                    <div className="space-y-4">
                                        {fields.map((field, index) => (
                                            <div key={field.id} className="flex items-start gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name={`specsArray.${index}.key`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex-1">
                                                            <FormControl>
                                                                <Input placeholder="e.g. Weight" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`specsArray.${index}.value`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex-1">
                                                            <FormControl>
                                                                <Input placeholder="e.g. 50kg" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:bg-red-50 hover:text-red-600 mt-0.5"
                                                    onClick={() => remove(index)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        {fields.length === 0 && (
                                            <p className="text-sm text-slate-500 italic text-center py-4 bg-slate-50 rounded-lg">No specifications added yet.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column: Image and Status */}
                        <div className="lg:col-span-1 space-y-8">
                            <Card className="border-slate-200">
                                <CardContent className="p-6 space-y-6">
                                    <h3 className="font-semibold text-[#1E3A5F]">Product Image</h3>
                                    <FormField
                                        control={form.control}
                                        name="main_image_url"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <ImageUploader
                                                        bucket="halok_media"
                                                        folder="products"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        onRemove={() => field.onChange(null)}
                                                        label="Product Image"
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
                                    <h3 className="font-semibold text-[#1E3A5F]">Visibility</h3>
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
                                                        Show this product in the catalog.
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
                            onClick={() => router.push("/admin/products")}
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
                                    <Save className="mr-2 h-4 w-4" /> Update Product
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
