import Image from "next/image";
import Link from "next/link";
import { PackageOpen } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
    title: "Products & Materials | Halok Construction",
    description: "Browse our catalog of premium construction materials and products.",
};

export default async function ProductsPage() {
    const supabase = await createServerSupabaseClient();

    const { data: products } = await supabase
        .from("products")
        .select("*")
        .eq("is_visible", true)
        .order("created_at", { ascending: false });

    // Group products by category
    const categorizedProducts = products?.reduce((acc: any, product: any) => {
        const cat = product.category || "General";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(product);
        return acc;
    }, {});

    return (
        <>
            <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-[var(--theme-primary,#1E3A5F)] text-white">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">Construction Materials & Products</h1>
                    <p className="text-xl text-blue-100/90 leading-relaxed">
                        High-quality construction products, materials, and equipment sourced from trusted manufacturers.
                    </p>
                </div>
            </section>

            <section className="py-20 bg-slate-50 min-h-[50vh]">
                <div className="container mx-auto px-4">
                    {categorizedProducts && Object.keys(categorizedProducts).length > 0 ? (
                        Object.keys(categorizedProducts).map((category) => (
                            <div key={category} className="mb-20 last:mb-0">
                                <div className="flex items-center gap-4 mb-8">
                                    <h2 className="text-3xl font-bold text-[var(--theme-primary,#1E3A5F)]">{category}</h2>
                                    <div className="h-px bg-slate-200 flex-1"></div>
                                </div>

                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {categorizedProducts[category].map((product: any) => (
                                        <Card key={product.id} className="group flex flex-col h-full overflow-hidden border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all bg-white">
                                            <div className="relative h-56 bg-white p-4 flex items-center justify-center overflow-hidden border-b border-slate-100">
                                                {product.main_image_url ? (
                                                    <div className="relative h-full w-full">
                                                        <Image
                                                            src={product.main_image_url}
                                                            alt={product.name}
                                                            fill
                                                            className="object-contain group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    </div>
                                                ) : (
                                                    <PackageOpen className="h-16 w-16 text-slate-200" />
                                                )}
                                                <Badge className="absolute top-4 left-4 bg-blue-100 text-[var(--theme-accent,#2563eb)] hover:bg-blue-200 pointer-events-none border-none">
                                                    {product.category}
                                                </Badge>
                                            </div>

                                            <CardContent className="flex flex-col flex-1 p-5">
                                                <div className="flex justify-between items-start mb-3 gap-2">
                                                    <h3 className="font-bold text-[var(--theme-primary,#1E3A5F)] text-lg leading-tight group-hover:text-[var(--theme-accent,#2563eb)] transition-colors line-clamp-2">
                                                        {product.name}
                                                    </h3>
                                                </div>

                                                <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">
                                                    {product.short_description || "No description provided."}
                                                </p>

                                                {product.price && (
                                                    <div className="mb-4">
                                                        <span className="font-bold text-xl text-[var(--theme-primary,#1E3A5F)]">{product.price}</span>
                                                    </div>
                                                )}

                                                {/* Dynamic Specs mapping up to 3 keys */}
                                                {product.specs && Object.keys(product.specs).length > 0 && (
                                                    <div className="bg-slate-50 rounded-lg p-3 mb-4 space-y-2 border border-slate-100 mt-auto">
                                                        {Object.entries(product.specs).slice(0, 3).map(([key, value]) => (
                                                            <div key={key} className="flex justify-between text-xs">
                                                                <span className="font-semibold text-slate-500">{key}:</span>
                                                                <span className="text-slate-700 text-right">{String(value)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <Link
                                                    href={`/contact?subject=Inquiry about Product: ${product.name}`}
                                                    className="w-full mt-auto inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 text-[var(--theme-accent,#2563eb)] border border-blue-200 hover:border-blue-300 hover:bg-slate-100"
                                                >
                                                    Inquire Now
                                                </Link>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 border-dashed">
                            <PackageOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-[var(--theme-primary,#1E3A5F)] mb-2">Catalog Update in Progress</h3>
                            <p className="text-slate-500">We are currently updating our products catalog. Please check back soon or contact us directly.</p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
