import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Briefcase, FolderGit2, MessageSquare, Package, Clock } from "lucide-react";

export const metadata = {
    title: "Admin Dashboard | Halok Construction",
};

export default async function AdminDashboardPage() {
    const supabase = await createServerSupabaseClient();

    // Fetch counts for dashboard stats
    const [
        { count: servicesCount },
        { count: productsCount },
        { count: portfolioCount },
        { count: unreadInquiries },
        { data: recentContacts }
    ] = await Promise.all([
        supabase.from("services").select("*", { count: "exact", head: true }),
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("portfolio").select("*", { count: "exact", head: true }),
        supabase.from("contacts").select("*", { count: "exact", head: true }).eq("status", "unread"),
        supabase.from("contacts").select("*").order("created_at", { ascending: false }).limit(5)
    ]);

    return (
        <div className="p-2 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-[#1E3A5F] tracking-tight">Dashboard Overview</h1>
                <p className="text-slate-500 mt-2">Welcome to your Halok Construction control panel.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="border-slate-200 shadow-sm transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Unread Inquiries</CardTitle>
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-800">{unreadInquiries || 0}</div>
                        <p className="text-xs text-blue-600 font-medium mt-1">Requires attention</p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Services</CardTitle>
                        <Briefcase className="h-5 w-5 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-800">{servicesCount || 0}</div>
                        <p className="text-xs text-slate-400 mt-1">Active services on site</p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Products Catalog</CardTitle>
                        <Package className="h-5 w-5 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-800">{productsCount || 0}</div>
                        <p className="text-xs text-slate-400 mt-1">Materials available</p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Portfolio Projects</CardTitle>
                        <FolderGit2 className="h-5 w-5 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-800">{portfolioCount || 0}</div>
                        <p className="text-xs text-slate-400 mt-1">Showcased projects</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity / Inquiries Panel */}
            <div className="mt-8">
                <Card className="border-slate-200 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg text-[#1E3A5F]">Recent Inquiries</CardTitle>
                            <p className="text-sm text-slate-500 mt-1">Latest messages from your contact form</p>
                        </div>
                        <a href="/admin/contacts" className="text-sm text-blue-600 hover:underline font-medium">View all</a>
                    </CardHeader>
                    <CardContent className="p-0">
                        {recentContacts && recentContacts.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {recentContacts.map((contact) => (
                                    <div key={contact.id} className="p-4 sm:px-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-slate-800">{contact.name}</span>
                                                {contact.status === 'unread' && (
                                                    <span className="bg-blue-100 text-blue-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">New</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-600 font-medium truncate max-w-md">{contact.subject}</p>
                                            <p className="text-xs text-slate-400">{contact.email}</p>
                                        </div>

                                        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 text-xs text-slate-400 shrink-0">
                                            <div className="flex items-center">
                                                <Clock className="h-3 w-3 mr-1" />
                                                {new Date(contact.created_at).toLocaleDateString()}
                                            </div>
                                            <a href={`/admin/contacts?id=${contact.id}`} className="text-blue-600 hover:underline font-medium sm:mt-1">
                                                View Message
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-500">
                                <MessageSquare className="h-10 w-10 mx-auto text-slate-300 mb-3" />
                                <p>No inquiries found. When visitors contact you, they will appear here.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
