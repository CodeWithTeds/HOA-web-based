import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    ShieldAlert,
    Info,
    Layout,
    Clock,
    Tag,
    AlertCircle,
    Image as ImageIcon,
    FileText,
    Settings,
    User,
    MessageSquare,
    CheckCircle2,
    Calendar,
    UserCircle,
    Edit3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const fontStack = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif';

export default function ComplaintShow({ complaint }: { complaint: any }) {
    const res = complaint.data;

    const getStatusStyles = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return { 
                    bg: 'bg-amber-50 dark:bg-amber-900/20', 
                    text: 'text-amber-700 dark:text-amber-400', 
                    dot: 'bg-amber-500', 
                    border: 'border-amber-100 dark:border-amber-800' 
                };
            case 'in_progress':
                return { 
                    bg: 'bg-blue-50 dark:bg-blue-900/20', 
                    text: 'text-blue-700 dark:text-blue-400', 
                    dot: 'bg-blue-500', 
                    border: 'border-blue-100 dark:border-blue-800' 
                };
            case 'resolved':
                return { 
                    bg: 'bg-emerald-50 dark:bg-emerald-900/20', 
                    text: 'text-emerald-700 dark:text-emerald-400', 
                    dot: 'bg-emerald-500', 
                    border: 'border-emerald-100 dark:border-emerald-800' 
                };
            default:
                return { bg: 'bg-neutral-50', text: 'text-neutral-700', dot: 'bg-neutral-500', border: 'border-neutral-100' };
        }
    };

    const statusStyle = getStatusStyles(res.status);

    return (
        <>
            <Head title={`Ticket #${res.id} Detail`} />

            <div
                className="flex h-full flex-1 flex-col rounded-2xl bg-white dark:bg-[#0c0c0c] text-[#0A2540] dark:text-neutral-100 overflow-hidden"
                style={{ fontFamily: fontStack }}
            >
                {/* ─── HEADER ─── */}
                <div className="shrink-0 px-8 py-6 border-b border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/30 dark:bg-neutral-900/40">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/admin/complaints">
                                <Button variant="ghost" className="size-10 p-0 rounded-full hover:bg-white dark:hover:bg-neutral-800">
                                    <ArrowLeft className="size-5" />
                                </Button>
                            </Link>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-[20px] font-black tracking-tight text-[#0A2540] dark:text-white leading-none">
                                        Complaint Ticket #{res.id}
                                    </h1>
                                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${statusStyle.border} ${statusStyle.bg} ${statusStyle.text} text-[10px] font-black uppercase tracking-wider`}>
                                        <span className={`size-1.5 rounded-full ${statusStyle.dot}`} />
                                        {res.status.replace('_', ' ')}
                                    </div>
                                </div>
                                <p className="text-[12px] text-neutral-400 font-bold tracking-wide uppercase mt-1.5">
                                    Category: {res.category} • Created {new Date(res.created_at).toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <Link href={`/admin/complaints/${res.id}/edit`}>
                                <Button className="h-9 gap-2 rounded-lg text-[12px] font-black bg-neutral-800 hover:bg-black text-white px-5">
                                    <Edit3 className="size-3.5" /> Manage Ticket
                                </Button>
                           </Link>
                        </div>
                    </div>
                </div>

                {/* ─── SCROLLABLE CONTENT ─── */}
                <div className="flex-1 overflow-y-auto px-12 py-10">
                    <div className="grid lg:grid-cols-12 gap-12">
                        
                        {/* MAIN CONTENT AREA (Left 8 cols) */}
                        <div className="lg:col-span-8 space-y-12">
                            <section className="space-y-6">
                                <div className="flex items-center gap-3 text-rose-600">
                                    <MessageSquare className="size-5" />
                                    <h2 className="text-[17px] font-black uppercase tracking-tight">Issue Overview</h2>
                                </div>
                                <div className="bg-neutral-50/50 dark:bg-neutral-900/40 p-10 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800/60">
                                    <h3 className="text-2xl font-black text-[#0A2540] dark:text-white mb-6 leading-tight">
                                        {res.subject}
                                    </h3>
                                    <div className="text-[15px] text-neutral-600 dark:text-neutral-300 leading-relaxed font-medium whitespace-pre-wrap">
                                        {res.description}
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-6">
                                <div className="flex items-center gap-2 text-rose-600 px-1">
                                    <ImageIcon className="size-5" />
                                    <h2 className="text-[17px] font-black uppercase tracking-tight">Attachment Evidence</h2>
                                </div>
                                {res.attachment_url ? (
                                    <div className="rounded-[2.5rem] overflow-hidden border border-neutral-100 shadow-xl shadow-black/5 bg-neutral-50 p-4">
                                        <img src={res.attachment_url} alt="Evidence" className="w-full h-auto object-contain rounded-[2rem]" />
                                    </div>
                                ) : (
                                    <div className="py-16 rounded-[2.5rem] border-2 border-dashed border-neutral-100 dark:border-neutral-800 text-center flex flex-col items-center gap-3 grayscale opacity-30">
                                        <ImageIcon className="size-10" />
                                        <p className="text-[12px] font-black uppercase tracking-widest text-neutral-400">No photos shared</p>
                                    </div>
                                )}
                            </section>

                            {res.resolution_notes && (
                                <section className="space-y-6">
                                    <div className="flex items-center gap-3 text-emerald-600 px-1">
                                        <CheckCircle2 className="size-5" />
                                        <h2 className="text-[17px] font-black uppercase tracking-tight">Resolution Report</h2>
                                    </div>
                                    <div className="bg-emerald-50/20 dark:bg-emerald-900/10 p-10 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-800/40">
                                        <div className="flex items-center gap-2 text-emerald-600 text-[11px] font-black uppercase tracking-widest mb-4">
                                            <Clock className="size-3.5" /> Resolved on {new Date(res.resolved_at).toLocaleDateString()}
                                        </div>
                                        <div className="text-[15px] text-[#0A2540] dark:text-neutral-200 leading-relaxed font-bold italic">
                                            "{res.resolution_notes}"
                                        </div>
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* SIDEBAR METADATA (Right 4 cols) */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-neutral-50/50 dark:bg-neutral-900/40 p-8 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800/60 space-y-8">
                                <div className="space-y-4">
                                    <p className="text-[11px] font-black text-neutral-400 uppercase tracking-widest">Involved Parties</p>
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-xl bg-white dark:bg-neutral-800 flex items-center justify-center text-rose-600 shadow-sm">
                                                <UserCircle className="size-6" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-[13px] font-black text-[#0A2540] dark:text-neutral-200">{res.resident?.name}</p>
                                                    <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase tracking-tighter">Homeowner</span>
                                                </div>
                                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Complainant / Resident</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-xl bg-white dark:bg-neutral-800 flex items-center justify-center text-blue-600 shadow-sm">
                                                <Tag className="size-6" />
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-black text-[#0A2540] dark:text-neutral-200">
                                                    {res.assigned_staff?.name || 'Awaiting Assignment'}
                                                </p>
                                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Handling Agent</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-neutral-100 dark:bg-neutral-800" />

                                <div className="space-y-4">
                                    <p className="text-[11px] font-black text-neutral-400 uppercase tracking-widest">Ticket Attributes</p>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[12px] font-bold text-neutral-500">Priority</span>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                res.priority === 'urgent' ? 'bg-rose-50 text-rose-600' : 'bg-neutral-100 text-neutral-600'
                                            }`}>
                                                {res.priority}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[12px] font-bold text-neutral-500">Submission Date</span>
                                            <span className="text-[12px] font-black text-[#0A2540] dark:text-neutral-200">
                                                {new Date(res.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[12px] font-bold text-neutral-500">Case ID</span>
                                            <span className="text-[12px] font-black text-[#0A2540] dark:text-neutral-200">#{res.id}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

ComplaintShow.layout = (page: any) => ({
    children: page,
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Complaints', href: '/admin/complaints' },
        { title: 'View Detail', href: '#' },
    ],
});
