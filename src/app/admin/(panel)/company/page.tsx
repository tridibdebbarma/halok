"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save, Building } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

// Validation Schema
const formSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(2, "Company name is required"),
    description: z.string().optional(),
    mission: z.string().optional(),
    vision: z.string().optional(),
    address_line_1: z.string().optional(),
    address_line_2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip_code: z.string().optional(),
    phone_primary: z.string().optional(),
    phone_secondary: z.string().optional(),
    email_primary: z.string().email("Invalid email").optional().or(z.literal("")),
    email_secondary: z.string().email("Invalid email").optional().or(z.literal("")),
    years_of_experience: z.number().optional().or(z.string().transform(val => val === "" ? undefined : Number(val))),
    total_projects: z.number().optional().or(z.string().transform(val => val === "" ? undefined : Number(val))),
    certifications: z.string().optional(), // We'll handle this as a comma-separated string for simplicity in UI, then convert to array
});

export default function CompanyProfilePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const supabase = createClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            name: "",
            description: "",
            mission: "",
            vision: "",
            address_line_1: "",
            address_line_2: "",
            city: "",
            state: "",
            zip_code: "",
            phone_primary: "",
            phone_secondary: "",
            email_primary: "",
            email_secondary: "",
            years_of_experience: undefined,
            total_projects: undefined,
            certifications: "",
        },
    });

    useEffect(() => {
        async function fetchCompanyProfile() {
            try {
                const { data, error } = await supabase
                    .from("company_profile")
                    .select("*")
                    .single();

                if (error) {
                    if (error.code !== "PGRST116") { // Ignore 'No rows found' error initially
                        console.error("Error fetching profile:", error);
                        toast.error("Failed to load company profile");
                    }
                } else if (data) {
                    form.reset({
                        id: data.id,
                        name: data.name || "",
                        description: data.description || "",
                        mission: data.mission || "",
                        vision: data.vision || "",
                        address_line_1: data.address_line_1 || "",
                        address_line_2: data.address_line_2 || "",
                        city: data.city || "",
                        state: data.state || "",
                        zip_code: data.zip_code || "",
                        phone_primary: data.phone_primary || "",
                        phone_secondary: data.phone_secondary || "",
                        email_primary: data.email_primary || "",
                        email_secondary: data.email_secondary || "",
                        years_of_experience: data.years_of_experience || undefined,
                        total_projects: data.total_projects || undefined,
                        certifications: data.certifications ? data.certifications.join(", ") : "",
                    });
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchCompanyProfile();
    }, [supabase, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSaving(true);
        try {
            // Process certifications string to array
            const processedCertifications = values.certifications
                ? values.certifications.split(",").map((c) => c.trim()).filter(Boolean)
                : [];

            const payload = {
                name: values.name,
                description: values.description,
                mission: values.mission,
                vision: values.vision,
                address_line_1: values.address_line_1,
                address_line_2: values.address_line_2,
                city: values.city,
                state: values.state,
                zip_code: values.zip_code,
                phone_primary: values.phone_primary,
                phone_secondary: values.phone_secondary,
                // Deal with empty strings acting as nulls for optional DB fields
                email_primary: values.email_primary || null,
                email_secondary: values.email_secondary || null,
                years_of_experience: values.years_of_experience || null,
                total_projects: values.total_projects || null,
                certifications: processedCertifications,
            };

            let response;

            if (values.id) {
                // Update existing record
                response = await supabase
                    .from("company_profile")
                    .update(payload)
                    .eq("id", values.id);
            } else {
                // Insert new record (should rarely happen if initialized correctly)
                response = await supabase
                    .from("company_profile")
                    .insert([payload]);
            }

            if (response.error) {
                throw response.error;
            }

            toast.success("Profile updated", {
                description: "Company details have been saved successfully.",
            });

            // Refresh to ensure ID is set if it was a new insert
            if (!values.id) {
                const { data } = await supabase.from("company_profile").select("id").single();
                if (data) form.setValue("id", data.id);
            }

        } catch (error: any) {
            console.error(error);
            toast.error("Error saving profile", {
                description: error.message || "An unexpected error occurred.",
            });
        } finally {
            setIsSaving(false);
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#1E3A5F] flex items-center gap-3">
                        <Building className="h-8 w-8 text-blue-600" />
                        Company Profile
                    </h1>
                    <p className="text-slate-500 mt-2">
                        Manage your public-facing company details, contact information, and story.
                    </p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    <Card className="border-slate-200">
                        <CardContent className="p-6 space-y-6">
                            <h2 className="text-xl font-semibold text-[#1E3A5F] mb-4">General Information</h2>

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Name *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Halok Construction" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="years_of_experience"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Years of Experience</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="10" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="total_projects"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Total Projects Completed</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="50" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>About Us (Company Story)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Founded in 2015, Halok Construction has been at the forefront..."
                                                className="min-h-[150px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="mission"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Our Mission</FormLabel>
                                            <FormControl>
                                                <Textarea className="min-h-[100px]" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="vision"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Our Vision</FormLabel>
                                            <FormControl>
                                                <Textarea className="min-h-[100px]" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="certifications"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Certifications (Comma separated)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="ISO 9001:2015, Green Building Certified" {...field} />
                                        </FormControl>
                                        <FormDescription>Separate multiple certifications with a comma.</FormDescription>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200">
                        <CardContent className="p-6 space-y-6">
                            <h2 className="text-xl font-semibold text-[#1E3A5F] mb-4">Contact Information</h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="phone_primary"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Primary Phone</FormLabel>
                                            <FormControl>
                                                <Input placeholder="+91 98765 43210" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone_secondary"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Secondary Phone</FormLabel>
                                            <FormControl>
                                                <Input placeholder="+91 87654 32109" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="email_primary"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Primary Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="contact@halok.co.in" type="email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email_secondary"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Secondary Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="info@halok.co.in" type="email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200">
                        <CardContent className="p-6 space-y-6">
                            <h2 className="text-xl font-semibold text-[#1E3A5F] mb-4">Office Address</h2>

                            <FormField
                                control={form.control}
                                name="address_line_1"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address Line 1</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Suite 100, Diamond Tower" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address_line_2"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address Line 2 (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="MG Road area" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>City</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Shillong" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="state"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>State</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Meghalaya" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="zip_code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>PIN / Zip Code</FormLabel>
                                            <FormControl>
                                                <Input placeholder="793001" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4 pb-12">
                        <Button
                            type="button"
                            variant="outline"
                            // Need to reset to initially fetched values, not entirely clear the form natively 
                            // so we do a simple window reload for a hard reset in admin scope
                            onClick={() => window.location.reload()}
                            disabled={isSaving}
                        >
                            Discard Changes
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 min-w-[150px]" disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" /> Save Profile
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
