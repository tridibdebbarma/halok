import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export async function POST(request: Request) {
    try {
        // Lazy and safe init — avoids crash if env var is missing on Vercel
        // Only initialize Resend if the key actually exists
        const resendApiKey = process.env.RESEND_API_KEY;
        const resend = resendApiKey ? new Resend(resendApiKey) : null;

        const body = await request.json();
        const { name, email, phone, subject, message } = body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Use direct client for API routes (no cookie dependency)
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // Insert into contacts table
        const { data, error } = await supabase
            .from("contacts")
            .insert([
                {
                    name,
                    email,
                    phone,
                    subject,
                    message,
                    is_read: false,
                    status: "unread",
                },
            ])
            .select()
            .single();

        if (error) {
            console.error("Supabase insert error:", error);
            return NextResponse.json(
                { error: "Failed to submit inquiry" },
                { status: 500 }
            );
        }

        // Send email notification to company
        try {
            const { data: settings } = await supabase
                .from("site_settings")
                .select("contact_email, site_name")
                .single();

            const companyEmail = settings?.contact_email || "contact-us@halok.co.in";
            const siteName = settings?.site_name || "Halok Construction";

            // Only try to send email if Resend is configured
            if (resend) {
                // Notification email to company
                await resend.emails.send({
                    from: `${siteName} Website <onboarding@resend.dev>`,
                    to: [companyEmail],
                    subject: `New Contact Inquiry: ${subject}`,
                    html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: #1E3A5F; color: white; padding: 24px; border-radius: 8px 8px 0 0;">
                            <h2 style="margin: 0;">New Contact Form Submission</h2>
                            <p style="margin: 8px 0 0; opacity: 0.8;">via ${siteName} Website</p>
                        </div>
                        <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold; color: #1E3A5F; width: 120px;">Name:</td>
                                    <td style="padding: 8px 0; color: #334155;">${name}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold; color: #1E3A5F;">Email:</td>
                                    <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td>
                                </tr>
                                ${phone ? `
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold; color: #1E3A5F;">Phone:</td>
                                    <td style="padding: 8px 0;"><a href="tel:${phone}" style="color: #2563eb;">${phone}</a></td>
                                </tr>
                                ` : ''}
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold; color: #1E3A5F;">Subject:</td>
                                    <td style="padding: 8px 0; color: #334155;">${subject}</td>
                                </tr>
                            </table>
                            <div style="margin-top: 16px; padding: 16px; background: white; border-radius: 8px; border: 1px solid #e2e8f0;">
                                <p style="font-weight: bold; color: #1E3A5F; margin: 0 0 8px;">Message:</p>
                                <p style="color: #334155; margin: 0; white-space: pre-wrap;">${message}</p>
                            </div>
                        </div>
                    </div>
                `,
                });

                // Auto-reply confirmation to the user
                await resend.emails.send({
                    from: `${siteName} <onboarding@resend.dev>`,
                    to: [email],
                    subject: `Thank you for contacting ${siteName}`,
                    html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: #1E3A5F; color: white; padding: 24px; border-radius: 8px 8px 0 0;">
                            <h2 style="margin: 0;">Thank You, ${name}!</h2>
                            <p style="margin: 8px 0 0; opacity: 0.8;">We've received your message.</p>
                        </div>
                        <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
                            <p style="color: #334155; line-height: 1.6;">
                                We appreciate you reaching out to us regarding <strong>"${subject}"</strong>.
                                Our team will review your message and get back to you as soon as possible,
                                typically within 1-2 business days.
                            </p>
                            <p style="color: #334155; line-height: 1.6;">
                                If you need immediate assistance, please call us directly.
                            </p>
                            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                                This is an automated response from ${siteName}. Please do not reply to this email.
                            </p>
                        </div>
                    </div>
                `,
                });
            } else {
                console.warn("Emails not sent: RESEND_API_KEY is not configured");
            }
        } catch (emailError) {
            // Log email error but don't fail the request — the form submission was saved
            console.error("Email sending failed:", emailError);
        }

        return NextResponse.json({ success: true, data }, { status: 201 });
    } catch (error) {
        console.error("Contact API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
