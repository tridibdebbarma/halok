"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Loader2, Eye, EyeOff } from "lucide-react";
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

export default function ServicesAdminPage() {
    const [services, setServices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchServices();
    }, []);

    async function fetchServices() {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("services")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setServices(data || []);
        } catch (error: any) {
            toast.error("Failed to fetch services", { description: error.message });
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this service?")) return;

        try {
            const { error } = await supabase.from("services").delete().eq("id", id);
            if (error) throw error;

            toast.success("Service deleted");
            setServices(services.filter(s => s.id !== id));
        } catch (error: any) {
            toast.error("Failed to delete", { description: error.message });
        }
    }

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#1E3A5F]">Services</h1>
                    <p className="text-slate-500 mt-1">Manage your construction services and offerings.</p>
                </div>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/admin/services/new">
                        <Plus className="mr-2 h-4 w-4" /> Add Service
                    </Link>
                </Button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                {isLoading ? (
                    <div className="flex items-center justify-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                ) : services.length === 0 ? (
                    <div className="text-center p-12">
                        <p className="text-slate-500 mb-4">No services found.</p>
                        <Button asChild variant="outline">
                            <Link href="/admin/services/new">Create your first service</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="w-[300px]">Service Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Price Range</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {services.map((service) => (
                                    <TableRow key={service.id}>
                                        <TableCell className="font-medium text-[#1E3A5F]">
                                            <div className="flex flex-col">
                                                <span>{service.name}</span>
                                                <span className="text-xs text-slate-400 font-normal">{service.slug}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                                                {service.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {service.is_visible ? (
                                                <div className="flex items-center text-green-600 text-sm font-medium">
                                                    <Eye className="mr-1.5 h-4 w-4" /> Visible
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-slate-400 text-sm font-medium">
                                                    <EyeOff className="mr-1.5 h-4 w-4" /> Hidden
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-slate-600">
                                            {service.price_range || "—"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                    <Link href={`/admin/services/${service.id}/edit`}>
                                                        <span className="sr-only">Edit</span>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => handleDelete(service.id)}
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
