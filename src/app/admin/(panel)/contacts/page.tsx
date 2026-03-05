"use client";

import { useEffect, useState } from "react";
import { Loader2, Mail, CheckCircle2, Circle, Clock, Trash2, Reply } from "lucide-react";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export default function ContactsAdminPage() {
    const [contacts, setContacts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState<any | null>(null);
    const supabase = createClient();

    useEffect(() => {
        fetchContacts();

        // Check if there's an ID in the URL to automatically open a contact
        const urlParams = new URLSearchParams(window.location.search);
        const idParam = urlParams.get('id');
        if (idParam) {
            fetchSingleContact(idParam);
        }
    }, []);

    async function fetchContacts() {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("contacts")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setContacts(data || []);
        } catch (error: any) {
            toast.error("Failed to fetch inquiries", { description: error.message });
        } finally {
            setIsLoading(false);
        }
    }

    async function fetchSingleContact(id: string) {
        try {
            const { data, error } = await supabase
                .from("contacts")
                .select("*")
                .eq("id", id)
                .single();

            if (error) throw error;
            if (data) setSelectedContact(data);
        } catch (error) {
            console.error(error);
        }
    }

    async function handleStatusChange(id: string, newStatus: string) {
        try {
            const { error } = await supabase
                .from("contacts")
                .update({ status: newStatus })
                .eq("id", id);

            if (error) throw error;

            toast.success(`Marked as ${newStatus}`);

            // Update local state
            setContacts(contacts.map(c =>
                c.id === id ? { ...c, status: newStatus } : c
            ));

            if (selectedContact && selectedContact.id === id) {
                setSelectedContact({ ...selectedContact, status: newStatus });
            }

        } catch (error: any) {
            toast.error("Failed to update status", { description: error.message });
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this inquiry?")) return;

        try {
            const { error } = await supabase.from("contacts").delete().eq("id", id);
            if (error) throw error;

            toast.success("Inquiry deleted");
            setContacts(contacts.filter(c => c.id !== id));
            if (selectedContact && selectedContact.id === id) {
                setSelectedContact(null);
            }
        } catch (error: any) {
            toast.error("Failed to delete", { description: error.message });
        }
    }

    const handleReply = (email: string, subject: string) => {
        window.location.href = `mailto:${email}?subject=Re: ${encodeURIComponent(subject)}`;
    };

    return (
        <div className="p-6 pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#1E3A5F]">Contact Inquiries</h1>
                    <p className="text-slate-500 mt-1">Manage messages received from your website contact form.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                {isLoading ? (
                    <div className="flex items-center justify-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                ) : contacts.length === 0 ? (
                    <div className="text-center p-12">
                        <Mail className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                        <p className="text-slate-500 mb-2">No inquiries received yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="w-[60px]">Status</TableHead>
                                    <TableHead className="min-w-[200px]">Sender</TableHead>
                                    <TableHead className="w-[300px]">Subject</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {contacts.map((contact) => (
                                    <TableRow
                                        key={contact.id}
                                        className={`cursor-pointer transition-colors hover:bg-slate-50 ${contact.status === 'unread' ? 'bg-blue-50/50' : ''}`}
                                        onClick={() => setSelectedContact(contact)}
                                    >
                                        <TableCell>
                                            {contact.status === 'unread' ? (
                                                <Circle className="h-4 w-4 fill-blue-500 text-blue-500" />
                                            ) : (
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <div className="flex flex-col">
                                                <span className={contact.status === 'unread' ? 'text-[#1E3A5F] font-semibold' : 'text-slate-700'}>
                                                    {contact.name}
                                                </span>
                                                <span className="text-xs text-slate-400 font-normal">{contact.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`block truncate max-w-[300px] ${contact.status === 'unread' ? 'text-slate-800 font-medium' : 'text-slate-600'}`}>
                                                {contact.subject}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-slate-500 text-sm whitespace-nowrap">
                                            {new Date(contact.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => handleDelete(contact.id)}
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

            {/* Contact Details Dialog */}
            <Dialog open={!!selectedContact} onOpenChange={(open) => !open && setSelectedContact(null)}>
                <DialogContent className="sm:max-w-[600px]">
                    {selectedContact && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center justify-between gap-4 mb-2">
                                    <DialogTitle className="text-xl text-[#1E3A5F]">
                                        {selectedContact.subject}
                                    </DialogTitle>
                                    <Badge variant={selectedContact.status === 'unread' ? 'default' : 'secondary'}>
                                        {selectedContact.status === 'unread' ? 'New Message' : 'Read'}
                                    </Badge>
                                </div>
                                <DialogDescription className="flex items-center gap-2 text-sm">
                                    <Clock className="h-3.5 w-3.5" />
                                    {new Date(selectedContact.created_at).toLocaleString()}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="bg-slate-50 p-4 rounded-lg my-4 border border-slate-100 space-y-3">
                                <div className="grid grid-cols-4 gap-2 text-sm">
                                    <span className="font-medium text-slate-500">From:</span>
                                    <span className="col-span-3 font-medium text-slate-800">{selectedContact.name}</span>
                                </div>
                                <div className="grid grid-cols-4 gap-2 text-sm">
                                    <span className="font-medium text-slate-500">Email:</span>
                                    <a href={`mailto:${selectedContact.email}`} className="col-span-3 text-blue-600 hover:underline">
                                        {selectedContact.email}
                                    </a>
                                </div>
                                <div className="grid grid-cols-4 gap-2 text-sm">
                                    <span className="font-medium text-slate-500">Phone:</span>
                                    <span className="col-span-3 text-slate-800">{selectedContact.phone || "—"}</span>
                                </div>
                            </div>

                            <div className="mt-4">
                                <h4 className="text-sm font-medium text-slate-500 mb-2">Message:</h4>
                                <div className="bg-white p-4 rounded-lg border border-slate-200 text-slate-700 whitespace-pre-wrap text-sm leading-relaxed min-h-[150px]">
                                    {selectedContact.message}
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100">
                                <div className="flex gap-2">
                                    {selectedContact.status === 'unread' ? (
                                        <Button
                                            variant="outline"
                                            onClick={() => handleStatusChange(selectedContact.id, 'read')}
                                        >
                                            Mark as Read
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            onClick={() => handleStatusChange(selectedContact.id, 'unread')}
                                        >
                                            Mark as Unread
                                        </Button>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => handleDelete(selectedContact.id)}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        className="bg-blue-600 hover:bg-blue-700"
                                        onClick={() => handleReply(selectedContact.email, selectedContact.subject)}
                                    >
                                        <Reply className="mr-2 h-4 w-4" /> Reply via Email
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
