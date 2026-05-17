import { Head, Link, usePage, router } from '@inertiajs/react';
import {
    Search,
    Filter,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    Plus,
    Pencil,
    Trash2,
    ArrowUpDown,
    Megaphone,
    Calendar,
    User,
    AlertTriangle,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SweetAlert } from '@/components/ui/sweet-alert';

const fontStack = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif';

export default function AnnouncementIndex({ announcements, filters }: { announcements: any, filters?: any }) {
    const { auth, flash } = usePage<any>().props;
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
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

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery !== (filters?.search || '')) {
                router.get(
                    '/admin/announcements',
                    { search: searchQuery },
                    {
                        preserveState: true,
                        preserveScroll: true,
                        replace: true,
                    }
                );
            }
        }, 400);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, filters?.search]);

    const items = announcements?.data || [];
    const totalItems = announcements?.meta?.total || announcements?.total || 0;

    const getStatusStyles = (status: string) => {
        switch (status.toLowerCase()) {
            case 'published':
                return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'private':
                return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            case 'archived':
                return 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-500';
            default:
                return 'bg-neutral-50 text-neutral-600';
        }
    };

    const getPriorityStyles = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'urgent':
                return 'text-rose-600 dark:text-rose-400 font-black';
            case 'important':
                return 'text-amber-600 dark:text-amber-400 font-bold';
            default:
                return 'text-neutral-500 dark:text-neutral-400';
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this announcement?')) {
            router.delete(`/admin/announcements/${id}`);
        }
    };

    return (
        <>
            <Head title="Announcement Management" />
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
                {/* ─── ENTERPRISE HEADER ─── */}
                <div className="shrink-0 px-8 py-6 border-b border-neutral-100 dark:border-neutral-800/60">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center size-10 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/20">
                                <Megaphone className="size-5 text-white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-[22px] font-black tracking-tight text-[#0A2540] dark:text-white">
                                    Community Announcements
                                </h1>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[12px] font-bold text-neutral-400 uppercase tracking-wider">Public Notices</span>
                                    <span className="size-1 rounded-full bg-neutral-300" />
                                    <span className="text-[12px] font-bold text-indigo-600">{totalItems} Total Announcements</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link href="/admin/announcements/create">
                                <Button className="h-10 gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 shadow-lg shadow-indigo-600/10 active:scale-95 transition-all">
                                    <Plus className="size-4" strokeWidth={3} /> Post Announcement
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ─── COMPACT TOOLBAR ─── */}
                <div className="shrink-0 px-8 py-3.5 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/40 border-b border-neutral-100 dark:border-neutral-800/60">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search by title or content..."
                                className="h-9 w-[300px] rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 pl-9 pr-4 text-[13px] font-medium placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all"
                            />
                        </div>
                        <Button variant="outline" className="h-9 gap-2 rounded-lg text-[12px] font-bold border-neutral-200 dark:border-neutral-800">
                            <Filter className="size-3.5" /> Filter
                        </Button>
                        <Button variant="outline" className="h-9 gap-2 rounded-lg text-[12px] font-bold border-neutral-200 dark:border-neutral-800">
                            <ArrowUpDown className="size-3.5" /> Sort
                        </Button>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <span className="text-[12px] font-semibold text-neutral-400 uppercase tracking-widest">
                            Page {announcements?.current_page || announcements?.meta?.current_page} of {announcements?.last_page || announcements?.meta?.last_page}
                        </span>
                    </div>
                </div>

                {/* ─── COMPACT ENTERPRISE TABLE ─── */}
                <div className="min-h-0 flex-1 overflow-auto border-t border-neutral-100 dark:border-neutral-800/60">
                    <table className="w-full text-left table-fixed border-separate border-spacing-0" style={{ fontFamily: fontStack }}>
                        <colgroup>
                            <col className="w-[30%]" />
                            <col className="w-[15%]" />
                            <col className="w-[10%]" />
                            <col className="w-[15%]" />
                            <col className="w-[10%]" />
                            <col className="w-[10%]" />
                            <col className="w-[60px]" />
                        </colgroup>
                        <thead className="sticky top-0 z-20 bg-neutral-50/80 dark:bg-neutral-900/80 backdrop-blur-md">
                            <tr className="border-b border-neutral-200 dark:border-neutral-800">
                                <th className="pl-8 px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">Announcement Title</th>
                                <th className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">Author</th>
                                <th className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">Category</th>
                                <th className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">Published</th>
                                <th className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">Priority</th>
                                <th className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-neutral-500 border-b border-neutral-200 dark:border-neutral-800 text-center">Status</th>
                                <th className="pr-8 pl-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-neutral-500 border-b border-neutral-200 dark:border-neutral-800 text-right">Edit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/40">
                            {items.length > 0 ? (
                                items.map((announcement: any) => (
                                    <tr key={announcement.id} className="group hover:bg-white dark:hover:bg-white/5 transition-colors duration-75 bg-transparent">
                                        <td className="pl-8 px-3 py-2 overflow-hidden">
                                            <div className="flex flex-col min-w-0 leading-tight">
                                                <p className="text-[13px] font-bold text-[#0A2540] dark:text-neutral-200 truncate">
                                                    {announcement.title}
                                                </p>
                                                <p className="text-[11px] font-medium text-neutral-400 truncate">
                                                    {announcement.content.substring(0, 60)}...
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2">
                                            <div className="flex items-center gap-2">
                                                <User className="size-3 text-neutral-400" />
                                                <span className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300">
                                                    {announcement.author?.name || 'Unknown'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 text-[11px] font-bold text-neutral-500 uppercase tracking-tighter">
                                            {announcement.category}
                                        </td>
                                        <td className="px-3 py-2">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="size-3 text-neutral-400" />
                                                <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-300">
                                                    {announcement.published_at ? new Date(announcement.published_at).toLocaleDateString() : 'Private'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2">
                                            <span className={`text-[11px] ${getPriorityStyles(announcement.priority)} uppercase tracking-tighter`}>
                                                {announcement.priority}
                                                {announcement.priority === 'urgent' && <AlertTriangle className="inline size-3 ml-1 mb-0.5" />}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            <div className="flex justify-center">
                                                <div className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${getStatusStyles(announcement.status)}`}>
                                                    {announcement.status}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="pr-6 pl-3 py-2 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="size-6 p-0 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-opacity opacity-0 group-hover:opacity-100">
                                                        <MoreHorizontal className="size-3 text-neutral-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40 rounded-lg shadow-xl border-neutral-200 dark:border-neutral-800">
                                                    <Link href={`/admin/announcements/${announcement.id}/edit`}>
                                                        <DropdownMenuItem className="gap-2 rounded-md font-bold text-[11px] cursor-pointer">
                                                            <Pencil className="size-3.5 text-neutral-400" /> Edit
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    {canDelete && (
                                                        <>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="gap-2 rounded-md font-bold text-[11px] cursor-pointer text-red-600"
                                                                onClick={() => handleDelete(announcement.id)}
                                                            >
                                                                <Trash2 className="size-3.5" /> Delete
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <div className="flex items-center justify-center size-20 rounded-[2rem] bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-sm">
                                                <Megaphone className="size-10 text-neutral-200 dark:text-neutral-700" strokeWidth={1.5} />
                                            </div>
                                            <div className="max-w-[400px] mx-auto">
                                                <p className="text-[16px] font-black text-[#0A2540] dark:text-neutral-200 tracking-tight">No announcements found</p>
                                                <p className="text-[13px] text-neutral-400 mt-2 font-bold leading-relaxed">
                                                    There are no announcements matching your search criteria. Post a new announcement to notify the community.
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ─── ENTERPRISE PAGINATION ─── */}
                <div className="shrink-0 px-8 py-4 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800/60 bg-white dark:bg-[#0c0c0c]">
                    <p className="text-[12px] font-bold text-neutral-400">
                        Displaying <span className="text-neutral-900 dark:text-neutral-200">
                            {(announcements?.current_page - 1) * (announcements?.per_page || 10) + 1 || 0}-
                            {Math.min(announcements?.current_page * (announcements?.per_page || 10), totalItems) || 0}
                        </span> of {totalItems} announcements
                    </p>
                    
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            className="h-9 gap-1 rounded-lg text-[12px] font-bold text-neutral-500 hover:bg-neutral-50"
                            disabled={!announcements?.prev_page_url}
                            onClick={() => announcements?.prev_page_url && router.get(announcements?.prev_page_url)}
                        >
                            <ChevronLeft className="size-4" /> Prev
                        </Button>
                        <Button
                            variant="ghost"
                            className="h-9 gap-1 rounded-lg text-[12px] font-bold text-neutral-500 hover:bg-neutral-50"
                            disabled={!announcements?.next_page_url}
                            onClick={() => announcements?.next_page_url && router.get(announcements?.next_page_url)}
                        >
                            Next <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

AnnouncementIndex.layout = (page: any) => ({
    children: page,
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Community Announcements', href: '/admin/announcements' },
    ],
});
