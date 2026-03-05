"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Loader2, Eye, EyeOff, Package } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function ProductsAdminPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error: any) {
            toast.error("Failed to fetch products", { description: error.message });
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const { error } = await supabase.from("products").delete().eq("id", id);
            if (error) throw error;

            toast.success("Product deleted");
            setProducts(products.filter(p => p.id !== id));
        } catch (error: any) {
            toast.error("Failed to delete", { description: error.message });
        }
    }

    return (
        <div className="p-6 pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#1E3A5F]">Products Catalog</h1>
                    <p className="text-slate-500 mt-1">Manage materials and products available for supply.</p>
                </div>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/admin/products/new">
                        <Plus className="mr-2 h-4 w-4" /> Add Product
                    </Link>
                </Button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                {isLoading ? (
                    <div className="flex items-center justify-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center p-12">
                        <Package className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                        <p className="text-slate-500 mb-4">No products found in the catalog.</p>
                        <Button asChild variant="outline">
                            <Link href="/admin/products/new">Add your first material</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="w-[80px]">Image</TableHead>
                                    <TableHead className="min-w-[200px]">Product</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <div className="h-12 w-12 rounded-md bg-slate-100 border border-slate-200 overflow-hidden relative flex items-center justify-center">
                                                {product.main_image_url ? (
                                                    <Image src={product.main_image_url} alt={product.name} fill className="object-cover" />
                                                ) : (
                                                    <Package className="h-5 w-5 text-slate-400" />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium text-[#1E3A5F]">
                                            <div className="flex flex-col">
                                                <span>{product.name}</span>
                                                <span className="text-xs text-slate-400 font-normal truncate max-w-[200px]">{product.short_description}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-slate-600">
                                                {product.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-600 font-medium">
                                            {product.price || "—"}
                                        </TableCell>
                                        <TableCell>
                                            {product.is_visible ? (
                                                <div className="flex items-center text-green-600 text-sm font-medium">
                                                    <Eye className="mr-1.5 h-4 w-4" /> Visible
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-slate-400 text-sm font-medium">
                                                    <EyeOff className="mr-1.5 h-4 w-4" /> Hidden
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                    <Link href={`/admin/products/${product.id}/edit`}>
                                                        <span className="sr-only">Edit</span>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => handleDelete(product.id)}
                                                >
                                                    <span className="sr-only">Delete</span>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </div>
    );
}
