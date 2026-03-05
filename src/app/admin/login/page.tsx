"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lock, Loader2, ShieldCheck } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
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
import { toast } from "sonner";
import Link from "next/link";

const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function AdminLoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: values.email,
                password: values.password,
            });

            if (error) {
                toast.error("Login failed", {
                    description: error.message,
                });
                return;
            }

            if (data.session) {
                toast.success("Login successful");
                router.push("/admin");
                router.refresh();
            }
        } catch (error: any) {
            toast.error("An error occurred", {
                description: error.message || "Please try again later.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <Link href="/" className="inline-flex items-center justify-center bg-white p-4 rounded-full shadow-sm hover:shadow-md transition-shadow">
                        <ShieldCheck className="h-10 w-10 text-[#1E3A5F]" />
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="bg-[#1E3A5F] p-8 text-center">
                        <h1 className="text-2xl font-bold text-white mb-2">Halok Admin Panel</h1>
                        <p className="text-blue-200 text-sm">Sign in to manage your website content.</p>
                    </div>

                    <div className="p-8">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-700 font-semibold">Email Address</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="admin@halok.co.in"
                                                    type="email"
                                                    className="bg-slate-50 h-12"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-700 font-semibold">Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="••••••••"
                                                    type="password"
                                                    className="bg-slate-50 h-12"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-semibold"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Authenticating...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="mr-2 h-5 w-5" /> Sign In securely
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </div>
                    <div className="bg-slate-50 p-4 text-center text-sm text-slate-500 border-t border-slate-100">
                        Protected area. Authorized personnel only.
                    </div>
                </div>
            </div>
        </div>
    );
}
