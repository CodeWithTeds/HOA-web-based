import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Search,
    Plus,
    MoreHorizontal,
    MessageSquare,
    Clock,
    CheckCircle2,
    ShieldAlert,
    Trash2,
    Eye,
    Edit3,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { SweetAlert } from '@/components/ui/sweet-alert';

const fontStack = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif';

export default function ComplaintIndex({ complaints, filters }: { complaints: any, filters: any }) {
    const { auth, flash } = usePage<any>().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [dismissedAlertKey, setDismissedAlertKey] = useState<string | null>(null);
    const canDelete = auth?.user?.role === 'admin';
    const flashAlert = flash?.success
        ? { type: 'success' as const, title: 'Operation Successful', message: flash.success }
        : flash?.error
            ? { type: 'error' as const, title: 'Something went wrong', message: flash.error }
            : null;
    const alertKey = flashAlert ? `${flashAlert.type}:${flashAlert.message}` : null;
    const alert = flashAlert && alertKey !== dismissedAlertKey
        ? { ...flashAlert, show: true }
        : { show: false, type: 'success' as const, title: '' };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/complaints', { search: searchTerm }, { preserveState: true });
    };

    const deleteComplaint = (id: number) => {
        if (confirm('Are you sure you want to delete this record?')) {
            router.delete(`/admin/complaints/${id}`);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            case 'in_progress':
                return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'resolved':
                return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'closed':
                return 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-500';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <>
            <Head title="Complaints Management" />
            <SweetAlert
                type={alert.type}
                title={alert.title}
                message={alert.message}
                show={alert.show}
                onClose={() => alertKey && setDismissedAlertKey(alertKey)}
            />

            <div
                className="flex h-full flex-1 flex-col rounded-2xl bg-white dark:bg-[#0c0c0c] text-[#0A2540] dark:text-neutral-100 overflow-hidden"
                style={{ fontFamily: fontStack }}
            >
                {/* ─── HEADER ─── */}
                <div className="shrink-0 px-8 py-6 border-b border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/30 dark:bg-neutral-900/40">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center size-10 rounded-xl bg-rose-600 shadow-lg shadow-rose-500/20">
                                <ShieldAlert className="size-5 text-white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-[20px] font-black tracking-tight text-[#0A2540] dark:text-white leading-none">
                                    Community Complaints
                                </h1>
                                <p className="text-[12px] text-neutral-400 font-bold tracking-wide uppercase mt-1.5 flex items-center gap-2">
                                    <span className="inline-block size-1.5 rounded-full bg-rose-500 animate-pulse" />
                                    Resident Grievances & Service Tickets
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <form onSubmit={handleSearch} className="relative group hidden sm:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400 group-focus-within:text-rose-600 transition-colors" />
                                <Input
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    placeholder="Find tickets..."
                                    className="h-10 w-[240px] pl-10 rounded-xl border-neutral-200 bg-white/50 text-[13px] font-bold focus:ring-rose-500/20"
                                />
                            </form>
                            <Link href="/admin/complaints/create">
                                <Button className="h-10 gap-2 rounded-xl px-5 text-[13px] font-black bg-rose-600 hover:bg-rose-700 text-white shadow-xl shadow-rose-600/20 transition-all active:scale-[0.98]">
                                    <Plus className="size-4" strokeWidth={3} /> Record Complaint
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ─── TABLE CONTENT ─── */}
                <div className="flex-1 overflow-auto">
                    <table className="w-full border-collapse min-w-[1000px]">
                        <thead className="sticky top-0 z-10">
                            <tr className="bg-neutral-50/80 dark:bg-neutral-900 backdrop-blur-md border-b border-neutral-100 dark:border-neutral-800">
                                <th className="px-8 py-4 text-left text-[11px] font-black uppercase text-neutral-400 tracking-widest">
                                    Ticket & Resident
                                </th>
                                <th className="px-6 py-4 text-left text-[11px] font-black uppercase text-neutral-400 tracking-widest">
                                    Issue Details
                                </th>
                                <th className="px-6 py-4 text-left text-[11px] font-black uppercase text-neutral-400 tracking-widest">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-[11px] font-black uppercase text-neutral-400 tracking-widest">
                                    Assignee
                                </th>
                                <th className="px-8 py-4 text-right text-[11px] font-black uppercase text-neutral-400 tracking-widest">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
                            {complaints.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center justify-center gap-4 grayscale opacity-30">
                                            <div className="size-20 rounded-full bg-neutral-100 flex items-center justify-center">
                                                <MessageSquare className="size-10 text-neutral-400" />
                                            </div>
                                            <p className="text-[14px] font-black text-neutral-400 uppercase tracking-widest">No complaints found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                complaints.data.map((complaint: any) => (
                                    <tr 
                                        key={complaint.id} 
                                        className="group hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col">
                                                    <span className="text-[14px] font-black text-[#0A2540] dark:text-neutral-200">#{complaint.id}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[11px] font-bold text-neutral-400 uppercase">{complaint.resident?.name}</span>
                                                        <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase tracking-tighter">Homeowner</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="max-w-[300px]">
                                                <p className="text-[13px] font-bold text-[#0A2540] dark:text-neutral-200 line-clamp-1 group-hover:text-rose-600 transition-colors">
                                                    {complaint.subject}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-tighter bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                                                        {complaint.category}
                                                    </span>
                                                    <span className="text-[11px] text-neutral-400 font-medium line-clamp-1 italic italic">
                                                        {complaint.description}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusStyle(complaint.status)}`}>
                                                {complaint.status === 'resolved' ? <CheckCircle2 className="size-3" /> : <Clock className="size-3" />}
                                                {complaint.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            {complaint.assigned_staff?.name ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="size-6 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] font-black">
                                                        {complaint.assigned_staff.name[0]}
                                                    </div>
                                                    <span className="text-[11px] font-bold text-neutral-500">{complaint.assigned_staff.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] font-bold text-neutral-400 uppercase italic">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/admin/complaints/${complaint.id}`}>
                                                    <Button variant="ghost" className="size-8 p-0 rounded-lg text-neutral-500 hover:text-rose-600 hover:bg-rose-50 transition-all">
                                                        <Eye className="size-4" />
                                                    </Button>
                                                </Link>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="size-8 p-0 rounded-lg text-neutral-500 hover:bg-neutral-100 transition-all">
                                                            <MoreHorizontal className="size-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-[160px] p-2 rounded-xl shadow-2xl">
                                                        <DropdownMenuItem 
                                                            onClick={() => router.get(`/admin/complaints/${complaint.id}/edit`)}
                                                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-bold cursor-pointer transition-colors"
                                                        >
                                                            <Edit3 className="size-4" /> Manage Ticket
                                                        </DropdownMenuItem>
                                                        {canDelete && (
                                                            <DropdownMenuItem
                                                                onClick={() => deleteComplaint(complaint.id)}
                                                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-bold text-rose-600 hover:bg-rose-50 focus:bg-rose-50 cursor-pointer transition-colors"
                                                            >
                                                                <Trash2 className="size-4" /> Delete Record
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ─── FOOTER & PAGINATION ─── */}
                <div className="shrink-0 px-8 py-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/40">
                    <div className="flex items-center justify-between">
                        <p className="text-[12px] font-bold text-neutral-400 uppercase tracking-widest">
                            Showing {complaints.data.length} of {complaints.meta?.total || complaints.data.length} total tickets
                        </p>
                        <div className="flex gap-2">
                             {(complaints.meta?.links || complaints.links)?.map((link: any, i: number) => (
                                <Button
                                    key={i}
                                    variant={link.active ? 'default' : 'outline'}
                                    disabled={!link.url}
                                    onClick={() => router.get(link.url)}
                                    className={`h-8 min-w-[32px] rounded-lg text-[11px] font-black ${
                                        link.active ? 'bg-rose-600 shadow-lg shadow-rose-500/20' : 'text-neutral-500'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                             ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

ComplaintIndex.layout = (page: any) => ({
    children: page,
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Complaints', href: '/admin/complaints' },
    ],
});
