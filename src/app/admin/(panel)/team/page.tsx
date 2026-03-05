"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Save, Users, Linkedin } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import ImageUploader from "@/components/ImageUploader";

interface TeamMember {
    id: string;
    name: string;
    role: string;
    bio: string;
    image_url: string;
    linkedin_url: string;
    order_index: number;
}

export default function TeamAdminPage() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        fetchMembers();
    }, []);

    async function fetchMembers() {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("team_members")
                .select("*")
                .order("order_index", { ascending: true });

            if (error) throw error;
            setMembers(data || []);
        } catch (error: any) {
            toast.error("Failed to fetch team members", { description: error.message });
        } finally {
            setIsLoading(false);
        }
    }

    const updateMember = (id: string, field: keyof TeamMember, value: any) => {
        setMembers(members.map(m => m.id === id ? { ...m, [field]: value } : m));
    };

    const addMember = async () => {
        try {
            const newMember = {
                name: "New Team Member",
                role: "Position / Title",
                bio: "",
                image_url: "",
                linkedin_url: "",
                order_index: members.length,
            };

            const { data, error } = await supabase.from("team_members").insert([newMember]).select().single();
            if (error) throw error;

            setMembers([...members, data]);
            toast.success("Team member added");
        } catch (error: any) {
            toast.error("Failed to add member", { description: error.message });
        }
    };

    const deleteMember = async (id: string) => {
        if (!confirm("Remove this team member?")) return;
        try {
            const { error } = await supabase.from("team_members").delete().eq("id", id);
            if (error) throw error;

            setMembers(members.filter(m => m.id !== id));
            toast.success("Team member removed");
        } catch (error: any) {
            toast.error("Failed to remove member", { description: error.message });
        }
    };

    const saveChanges = async () => {
        setIsSaving(true);

        try {
            for (const member of members) {
                await supabase.from("team_members").update({
                    name: member.name,
                    role: member.role,
                    bio: member.bio,
                    image_url: member.image_url,
                    linkedin_url: member.linkedin_url,
                    order_index: member.order_index,
                }).eq("id", member.id);
            }

            toast.success("Team roster saved successfully");
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
                    <h1 className="text-3xl font-bold text-[#1E3A5F]">Team Management</h1>
                    <p className="text-slate-500 mt-1">Manage the leadership and core team displayed on the About Us page.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={addMember}>
                        <Plus className="mr-2 h-4 w-4" /> Add Member
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
                <div className="grid md:grid-cols-2 gap-6">
                    {members.length === 0 ? (
                        <div className="md:col-span-2">
                            <Card className="border-slate-200 border-dashed">
                                <CardContent className="flex flex-col items-center justify-center p-12 text-center text-slate-500">
                                    <Users className="h-12 w-12 text-slate-300 mb-4" />
                                    <p className="mb-4">No team members added yet.</p>
                                    <Button onClick={addMember}>Add First Member</Button>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        [...members].sort((a, b) => a.order_index - b.order_index).map((member) => (
                            <Card key={member.id} className="border-slate-200 overflow-hidden group">
                                <CardHeader className="bg-slate-50 border-b border-slate-100 py-3 flex flex-row items-center justify-end">
                                    <Button variant="ghost" size="sm" className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => deleteMember(member.id)}>
                                        <Trash2 className="h-4 w-4 mr-2" /> Remove
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex flex-col sm:flex-row gap-6">
                                        {/* Headshot */}
                                        <div className="w-full sm:w-1/3">
                                            <ImageUploader
                                                bucket="halok_media"
                                                folder="team"
                                                value={member.image_url}
                                                onChange={(url) => updateMember(member.id, 'image_url', url)}
                                                onRemove={() => updateMember(member.id, 'image_url', '')}
                                                label="Headshot"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="w-full sm:w-2/3 space-y-4">
                                            <div>
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Full Name *</label>
                                                <Input
                                                    value={member.name}
                                                    onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                                                    placeholder="e.g. Tridib Debbarma"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Role / Title *</label>
                                                <Input
                                                    value={member.role}
                                                    onChange={(e) => updateMember(member.id, 'role', e.target.value)}
                                                    placeholder="e.g. Managing Director"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Short Bio (Optional)</label>
                                        <Textarea
                                            value={member.bio || ""}
                                            onChange={(e) => updateMember(member.id, 'bio', e.target.value)}
                                            placeholder="A short description of their background..."
                                            className="resize-y min-h-[80px]"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                                <Linkedin className="h-3 w-3" /> LinkedIn URL
                                            </label>
                                            <Input
                                                value={member.linkedin_url || ""}
                                                onChange={(e) => updateMember(member.id, 'linkedin_url', e.target.value)}
                                                placeholder="https://linkedin.com/in/..."
                                                className="text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Display Order</label>
                                            <Input
                                                type="number"
                                                value={member.order_index}
                                                onChange={(e) => updateMember(member.id, 'order_index', parseInt(e.target.value) || 0)}
                                            />
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
