"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Save, Image as ImageIcon } from "lucide-react";
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
import ImageUploader from "@/components/ImageUploader";
import Image from "next/image";

interface Slide {
    id: string;
    title: string;
    subtitle: string;
    cta_text: string;
    cta_link: string;
    image_url: string;
    order_index: number;
    is_visible: boolean;
}

export default function HeroAdminPage() {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        fetchSlides();
    }, []);

    async function fetchSlides() {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("hero_slides")
                .select("*")
                .order("order_index", { ascending: true });

            if (error) throw error;
            setSlides(data || []);
        } catch (error: any) {
            toast.error("Failed to fetch slides", { description: error.message });
        } finally {
            setIsLoading(false);
        }
    }

    // Handle local state changes
    const updateSlide = (id: string, field: keyof Slide, value: any) => {
        setSlides(slides.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const addSlide = async () => {
        try {
            const newSlide = {
                title: "New Headline",
                subtitle: "Engaging subheadline text",
                cta_text: "Learn More",
                cta_link: "/services",
                image_url: "",
                order_index: slides.length,
                is_visible: true,
            };

            const { data, error } = await supabase.from("hero_slides").insert([newSlide]).select().single();
            if (error) throw error;

            setSlides([...slides, data]);
            toast.success("Slide added");
        } catch (error: any) {
            toast.error("Failed to add slide", { description: error.message });
        }
    };

    const deleteSlide = async (id: string) => {
        if (!confirm("Are you sure you want to delete this slide?")) return;
        try {
            const { error } = await supabase.from("hero_slides").delete().eq("id", id);
            if (error) throw error;

            setSlides(slides.filter(s => s.id !== id));
            toast.success("Slide deleted");
        } catch (error: any) {
            toast.error("Failed to delete slide", { description: error.message });
        }
    };

    const saveChanges = async () => {
        setIsSaving(true);
        let hasError = false;

        try {
            for (const slide of slides) {
                if (!slide.image_url) {
                    toast.error(`Slide "${slide.title}" requires an image.`);
                    hasError = true;
                    continue;
                }

                await supabase.from("hero_slides").update({
                    title: slide.title,
                    subtitle: slide.subtitle,
                    cta_text: slide.cta_text,
                    cta_link: slide.cta_link,
                    image_url: slide.image_url,
                    order_index: slide.order_index,
                    is_visible: slide.is_visible
                }).eq("id", slide.id);
            }

            if (!hasError) toast.success("Slides saved successfully");
        } catch (error: any) {
            toast.error("Error saving changes", { description: error.message });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-6 pb-20 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#1E3A5F]">Hero Slider</h1>
                    <p className="text-slate-500 mt-1">Manage the carousel images and text on the homepage.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={addSlide}>
                        <Plus className="mr-2 h-4 w-4" /> Add Slide
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
                <div className="space-y-6">
                    {slides.length === 0 ? (
                        <Card className="border-slate-200 border-dashed">
                            <CardContent className="flex flex-col items-center justify-center p-12 text-center text-slate-500">
                                <ImageIcon className="h-12 w-12 text-slate-300 mb-4" />
                                <p className="mb-4">No slides configured. Add your first slide to display on the homepage.</p>
                                <Button onClick={addSlide}>Add First Slide</Button>
                            </CardContent>
                        </Card>
                    ) : (
                        [...slides].sort((a, b) => a.order_index - b.order_index).map((slide, index) => (
                            <Card key={slide.id} className="border-slate-200 overflow-hidden">
                                <CardHeader className="bg-slate-50 border-b border-slate-100 py-3 flex flex-row items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-md">
                                            Slide {index + 1}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id={`visible-${slide.id}`}
                                                checked={slide.is_visible}
                                                onCheckedChange={(c) => updateSlide(slide.id, 'is_visible', !!c)}
                                            />
                                            <label htmlFor={`visible-${slide.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Visible
                                            </label>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => deleteSlide(slide.id)}>
                                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        {/* Image Column */}
                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-700 mb-3">Background Image</h4>
                                            <ImageUploader
                                                bucket="halok_media"
                                                folder="hero"
                                                value={slide.image_url}
                                                onChange={(url) => updateSlide(slide.id, 'image_url', url)}
                                                onRemove={() => updateSlide(slide.id, 'image_url', '')}
                                                label="Hero Background"
                                            />
                                        </div>

                                        {/* Content Column */}
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Main Headline</label>
                                                <Input
                                                    value={slide.title}
                                                    onChange={(e) => updateSlide(slide.id, 'title', e.target.value)}
                                                    placeholder="e.g. Building the Future"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Sub-headline</label>
                                                <Input
                                                    value={slide.subtitle}
                                                    onChange={(e) => updateSlide(slide.id, 'subtitle', e.target.value)}
                                                    placeholder="e.g. Quality construction services across India"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Button Text</label>
                                                    <Input
                                                        value={slide.cta_text}
                                                        onChange={(e) => updateSlide(slide.id, 'cta_text', e.target.value)}
                                                        placeholder="e.g. Our Services"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Button Link</label>
                                                    <Input
                                                        value={slide.cta_link}
                                                        onChange={(e) => updateSlide(slide.id, 'cta_link', e.target.value)}
                                                        placeholder="e.g. /services"
                                                        className="font-mono text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Sort Order</label>
                                                <Input
                                                    type="number"
                                                    value={slide.order_index}
                                                    onChange={(e) => updateSlide(slide.id, 'order_index', parseInt(e.target.value) || 0)}
                                                    className="w-24"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
