import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!serviceRoleKey || serviceRoleKey === "your_service_role_key_here") {
        return NextResponse.json(
            { error: "SUPABASE_SERVICE_ROLE_KEY is not configured in .env.local. Get it from Supabase Dashboard > Settings > API > service_role key." },
            { status: 500 }
        );
    }

    // Use admin client with service role key to bypass email confirmation
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    });

    const email = "admin@halok.co.in";
    const password = "Halok@2026";

    try {
        // Create user with auto-confirm using admin API
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm email - no verification needed
        });

        if (error) {
            // If user already exists, try to update their password instead
            if (error.message.includes("already been registered")) {
                const { data: users } = await supabaseAdmin.auth.admin.listUsers();
                const existingUser = users?.users?.find((u: any) => u.email === email);

                if (existingUser) {
                    await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
                        password,
                        email_confirm: true,
                    });
                    return NextResponse.json({
                        success: true,
                        message: "Admin user already existed. Password updated and email confirmed.",
                        email,
                        password
                    });
                }
            }
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: "Admin user created and auto-confirmed!",
            email,
            password
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
