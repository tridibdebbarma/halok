"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

export default function SetupPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState("");
    const [step, setStep] = useState("");
    const supabase = createClient();

    const defaultEmail = "admin@halok.co.in";
    const defaultPassword = "Halok@2026";

    async function createAdmin() {
        setIsLoading(true);
        setError("");

        try {
            // Step 1: Try signing up
            setStep("Creating admin account...");
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email: defaultEmail,
                password: defaultPassword,
                options: {
                    // Some Supabase projects auto-confirm if this data is provided
                    data: { role: "admin" }
                }
            });

            if (signUpError) {
                // If already registered, try logging in directly
                if (signUpError.message.includes("already been registered") || signUpError.message.includes("already registered")) {
                    setStep("User already exists. Trying to sign in...");
                    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                        email: defaultEmail,
                        password: defaultPassword,
                    });

                    if (signInError) {
                        throw new Error(`User exists but login failed: ${signInError.message}. You may need to confirm email or reset password in Supabase Dashboard > Authentication > Users.`);
                    }

                    setDone(true);
                    return;
                }
                throw signUpError;
            }

            // Step 2: If signup succeeded, try signing in immediately
            if (signUpData.user) {
                setStep("Account created! Attempting sign in...");

                // Check if session came back (auto-confirmed)
                if (signUpData.session) {
                    setDone(true);
                    return;
                }

                // Try signing in (might work if email confirm is disabled)
                const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                    email: defaultEmail,
                    password: defaultPassword,
                });

                if (signInError) {
                    throw new Error(
                        `Account created but email confirmation is required. ` +
                        `Go to Supabase Dashboard → Authentication → Users → find admin@halok.co.in → ` +
                        `click the 3 dots → "Confirm email". Then try logging in at /admin/login.`
                    );
                }

                setDone(true);
            }
        } catch (err: any) {
            setError(err.message || "Failed to create admin user");
        } finally {
            setIsLoading(false);
            setStep("");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-lg shadow-lg">
                <CardHeader className="bg-[#1E3A5F] text-white rounded-t-xl">
                    <CardTitle className="text-white text-xl">Admin Setup</CardTitle>
                    <CardDescription className="text-blue-200">
                        Create the default admin account for Halok Construction
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                    {done ? (
                        <div className="text-center space-y-4">
                            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                            <h3 className="text-xl font-bold text-[#1E3A5F]">Admin Ready!</h3>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left space-y-2">
                                <p className="text-sm"><strong>Email:</strong> {defaultEmail}</p>
                                <p className="text-sm"><strong>Password:</strong> {defaultPassword}</p>
                            </div>
                            <a
                                href="/admin/login"
                                className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-md text-base font-semibold"
                            >
                                Go to Admin Login →
                            </a>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-500 block mb-1">Email</label>
                                    <Input value={defaultEmail} disabled className="bg-slate-50" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-500 block mb-1">Password</label>
                                    <Input value={defaultPassword} disabled className="bg-slate-50" />
                                </div>
                            </div>

                            {step && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                    <p className="text-blue-700 text-sm">{step}</p>
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex items-start gap-2 mb-3">
                                        <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                                        <p className="text-red-600 text-sm">{error}</p>
                                    </div>
                                    <div className="bg-white border border-red-100 rounded p-3 text-xs text-slate-600 space-y-2">
                                        <p className="font-bold">Manual fix steps:</p>
                                        <ol className="list-decimal ml-4 space-y-1">
                                            <li>Go to <strong>Supabase Dashboard</strong></li>
                                            <li>Click <strong>Authentication → Users</strong></li>
                                            <li>Find <strong>admin@halok.co.in</strong></li>
                                            <li>Click the <strong>3 dots (⋮)</strong> menu → <strong>&quot;Confirm email&quot;</strong></li>
                                            <li>Then login at <a href="/admin/login" className="text-blue-600 underline">/admin/login</a></li>
                                        </ol>
                                    </div>
                                </div>
                            )}

                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base"
                                onClick={createAdmin}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Setting up...</>
                                ) : (
                                    "Create Admin User"
                                )}
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
