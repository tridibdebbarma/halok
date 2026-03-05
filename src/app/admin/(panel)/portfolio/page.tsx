"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Loader2, Eye, EyeOff, FolderGit2 } from "lucide-react";
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

export default function PortfolioAdminPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchProjects();
    }, []);

    async function fetchProjects() {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("portfolio")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setProjects(data || []);
        } catch (error: any) {
            toast.error("Failed to fetch projects", { description: error.message });
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this project?")) return;

        try {
            const { error } = await supabase.from("portfolio").delete().eq("id", id);
            if (error) throw error;

            toast.success("Project deleted");
            setProjects(projects.filter(p => p.id !== id));
        } catch (error: any) {
            toast.error("Failed to delete", { description: error.message });
        }
    }

    return (
        <div className="p-6 pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#1E3A5F]">Portfolio Projects</h1>
                    <p className="text-slate-500 mt-1">Manage showcased projects and previous work.</p>
                </div>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/admin/portfolio/new">
                        <Plus className="mr-2 h-4 w-4" /> Add Project
                    </Link>
                </Button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                {isLoading ? (
                    <div className="flex items-center justify-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center p-12">
                        <FolderGit2 className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                        <p className="text-slate-500 mb-4">No projects found in the portfolio.</p>
                        <Button asChild variant="outline">
                            <Link href="/admin/portfolio/new">Add your first project</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="w-[80px]">Cover</TableHead>
                                    <TableHead className="min-w-[200px]">Project Info</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Date / Client</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projects.map((project) => (
                                    <TableRow key={project.id}>
                                        <TableCell>
                                            <div className="h-12 w-16 rounded-md bg-slate-100 border border-slate-200 overflow-hidden relative flex items-center justify-center">
                                                {project.main_image_url ? (
                                                    <Image src={project.main_image_url} alt={project.title} fill className="object-cover" />
                                                ) : (
                                                    <FolderGit2 className="h-5 w-5 text-slate-400" />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium text-[#1E3A5F]">
                                            <div className="flex flex-col">
                                                <span>{project.title}</span>
                                                <span className="text-xs text-slate-400 font-normal">{project.location || "No location set"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                                                {project.service_type || "General"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-600 text-sm">
                                            <div className="flex flex-col">
                                                <span>{project.date_completed ? new Date(project.date_completed).toLocaleDateString() : "—"}</span>
                                                <span className="text-xs text-slate-400">{project.client_name || "—"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {project.is_visible ? (
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
                                                    <Link href={`/admin/portfolio/${project.id}/edit`}>
                                                        <span className="sr-only">Edit</span>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => handleDelete(project.id)}
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
