"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
    bucket: string;
    folder?: string;
    value?: string | null;
    onChange: (url: string) => void;
    onRemove: () => void;
    label?: string;
}

export default function ImageUploader({
    bucket,
    folder = "general",
    value,
    onChange,
    onRemove,
    label = "Upload Image"
}: ImageUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const supabase = createClient();

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setIsUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error("You must select an image to upload.");
            }

            const file = event.target.files[0];
            const fileExt = file.name.split(".").pop();
            const fileName = `${folder}/${Math.random()}.${fileExt}`;

            // Upload to Supabase Storage
            const { error: uploadError, data } = await supabase.storage
                .from(bucket)
                .upload(fileName, file, { upsert: true });

            if (uploadError) {
                throw uploadError;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(fileName);

            onChange(publicUrl);
            toast.success("Image uploaded successfully");
        } catch (error: any) {
            toast.error("Error uploading image", {
                description: error.message,
            });
            console.error("Upload error:", error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            {value ? (
                <div className="relative w-full max-w-sm aspect-video rounded-xl border border-slate-200 overflow-hidden group bg-slate-50 flex items-center justify-center">
                    <Image
                        src={value}
                        alt="Uploaded image"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={onRemove}
                            className="flex items-center gap-2"
                        >
                            <X className="h-4 w-4" /> Remove Image
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center w-full max-w-sm">
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-blue-400 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {isUploading ? (
                                <>
                                    <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-3" />
                                    <p className="text-sm text-slate-500 font-medium">Uploading...</p>
                                </>
                            ) : (
                                <>
                                    <UploadCloud className="w-10 h-10 mb-3 text-slate-400" />
                                    <p className="mb-2 text-sm text-slate-600 font-medium">
                                        <span className="text-blue-600">Click to upload</span> {label.toLowerCase()}
                                    </p>
                                    <p className="text-xs text-slate-500">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
                                </>
                            )}
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleUpload}
                            disabled={isUploading}
                        />
                    </label>
                </div>
            )}
        </div>
    );
}
