"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

export default function SetupPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState<any>(null);

    const defaultEmail = "admin@halok.co.in";
    const defaultPassword = "Halok@2026";

    async function createAdmin() {
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/setup", { method: "POST" });
            const data = await res.json();

            if (!res.ok || data.error) {
                throw new Error(data.error || "Failed to create admin");
            }

            setResult(data);
            setDone(true);
        } catch (err: any) {
            setError(err.message || "Failed to create admin user");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md shadow-lg">
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
                            <h3 className="text-xl font-bold text-[#1E3A5F]">Admin Created Successfully!</h3>
                            <p className="text-sm text-slate-500">{result?.message}</p>
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
                            <p className="text-xs text-red-500 font-medium">
                                ⚠️ Delete this setup page after use for security.
                            </p>
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

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                                    <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                                    <p className="text-red-600 text-sm">{error}</p>
                                </div>
                            )}

                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base"
                                onClick={createAdmin}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating...</>
                                ) : (
                                    "Create Admin User"
                                )}
                            </Button>
                            <p className="text-xs text-center text-slate-400">
                                Uses the service role key to create a confirmed admin user in Supabase Auth.
                            </p>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
