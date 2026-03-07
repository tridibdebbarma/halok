"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
    subject: z.string().min(2, "Please provide a subject"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const searchParams = useSearchParams();
    const defaultSubject = searchParams.get("subject") || "";

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            subject: defaultSubject,
            message: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            // Submit via API route which handles both DB insert and email
            const response = await fetch("/api/contacts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to send message");
            }

            toast.success("Message sent successfully!", {
                description: "We'll get back to you as soon as possible.",
            });

            form.reset();
        } catch (error: any) {
            console.error("Submission error:", error);
            toast.error("Failed to send message", {
                description: "Please try again later or contact us directly.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-[var(--theme-accent,#2563eb)]"></div>
            <h3 className="text-2xl font-bold text-[var(--theme-primary,#1E3A5F)] mb-6">Send us a message</h3>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="john@example.com" type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="+1 (555) 000-0000" type="tel" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subject *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="How can we help?" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Message *</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Briefly describe your project or inquiry..."
                                        className="min-h-[150px] resize-y"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full bg-[var(--theme-accent,#2563eb)] hover:opacity-90 h-12 text-lg text-white" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...</>
                        ) : (
                            <><Send className="mr-2 h-5 w-5" /> Send Message</>
                        )}
                    </Button>
                    <p className="text-xs text-center text-slate-500 mt-4">
                        By submitting this form, you agree to our privacy policy and terms of service.
                    </p>
                </form>
            </Form>
        </div>
    );
}
