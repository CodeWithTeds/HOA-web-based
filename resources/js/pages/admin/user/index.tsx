import { Head, Link, usePage, router } from '@inertiajs/react';
import {
    Search,
    Filter,
    Download,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    UserPlus,
    Users,
    Pencil,
    Trash2,
    Eye,
    Ban,
    ArrowUpDown,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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

const avatarGradients = [
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-violet-500 to-purple-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-cyan-500 to-blue-600',
];

function getGradient(name: string) {
    const code = (name?.charCodeAt(0) || 0) + (name?.charCodeAt(1) || 0);

    return avatarGradients[code % avatarGradients.length];
}

export default function StaffIndex({ staff, filters }: { staff: any, filters?: any }) {
    const { flash } = usePage<any>().props;
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');

    const [alert, setAlert] = useState<{
        show: boolean;
        type: 'success' | 'error' | 'warning' | 'info';
        title: string;
        message?: string;
    }>({ show: false, type: 'success', title: '' });

    useEffect(() => {
        if (flash?.success) {
            setAlert({ show: true, type: 'success', title: 'Operation Successful', message: flash.success });
        }

        if (flash?.error) {
            setAlert({ show: true, type: 'error', title: 'Something went wrong', message: flash.error });
        }
    }, [flash]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery !== (filters?.search || '')) {
                router.get(
                    '/admin/user',
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
    }, [searchQuery]);

    const users = staff?.data || [];
    const totalStaff = staff?.total || 0;
    const activeCount = users.filter((s: any) => s.status === 'ACTIVE').length || 0;

    return (
        <>
            <Head title="Staff Management" />
            <SweetAlert
                type={alert.type}
                title={alert.title}
                message={alert.message}
                show={alert.show}
                onClose={() => setAlert(prev => ({ ...prev, show: false }))}
            />

            <div
                className="flex h-full flex-1 flex-col rounded-2xl bg-white dark:bg-[#0c0c0c] text-[#0A2540] dark:text-neutral-100 overflow-hidden"
                style={{ fontFamily: fontStack }}
            >
                {/* ─── TOP HEADER ─── */}
                <div className="shrink-0 px-8 pt-8 pb-6 border-b border-neutral-100 dark:border-neutral-800/60">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <div className="flex items-center justify-center size-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
                                <Users className="size-6 text-white" strokeWidth={2} />
                            </div>
                            <div>
                                <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-[#0A2540] dark:text-white">
                                    Staff Directory
                                </h1>
                                <p className="text-[14px] text-neutral-500 dark:text-neutral-400 font-medium mt-0.5">
                                    {totalStaff} staff member{totalStaff !== 1 ? 's' : ''} · {activeCount} active
                                </p>
                            </div>
                        </div>

                        <Link href="/admin/user/create">
                            <Button className="h-11 gap-2.5 rounded-xl bg-[#0A2540] hover:bg-[#0d2f4f] dark:bg-white dark:text-[#0A2540] dark:hover:bg-neutral-200 text-white font-bold px-6 shadow-lg shadow-black/10 transition-all active:scale-[0.97]">
                                <UserPlus className="size-[18px]" strokeWidth={2.5} /> Add Staff Member
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* ─── ACTION BAR ─── */}
                <div className="shrink-0 px-8 py-4 flex items-center justify-between bg-neutral-50/60 dark:bg-neutral-900/40 border-b border-neutral-100 dark:border-neutral-800/60">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search staff by name, email, role…"
                                className="h-10 w-[340px] rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 pl-10 pr-4 text-[14px] font-medium placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                                style={{ fontFamily: fontStack }}
                            />
                        </div>
                        <Button variant="outline" className="h-10 gap-2 rounded-xl text-[13px] font-semibold border-neutral-200 dark:border-neutral-800">
                            <Filter className="size-3.5" /> Filter
                        </Button>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[13px] font-semibold text-neutral-400">
                            Showing <span className="text-neutral-600 dark:text-neutral-300">{users.length}</span> of {totalStaff}
                        </span>
                        <a href={`/admin/user/export?${new URLSearchParams(filters).toString()}`}>
                            <Button variant="outline" className="h-10 gap-2 rounded-xl text-[13px] font-semibold border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 active:scale-95 transition-all">
                                <Download className="size-3.5" /> Export CSV
                            </Button>
                        </a>
                    </div>
                </div>

                {/* ─── TABLE ─── */}
                <div className="min-h-0 flex-1 overflow-auto">
                    <table className="w-full text-left table-fixed" style={{ fontFamily: fontStack }}>
                        <colgroup>
                            <col className="w-[22%]" />
                            <col className="w-[20%]" />
                            <col className="w-[14%]" />
                            <col className="w-[12%]" />
                            <col className="w-[14%]" />
                            <col className="w-[10%]" />
                            <col className="w-[8%]" />
                        </colgroup>
                        <thead className="sticky top-0 z-10 bg-white dark:bg-[#0c0c0c] border-b border-neutral-200 dark:border-neutral-800">
                            <tr>
                                {['Staff Member', 'Email', 'Role', 'Department', 'Hire Date', 'Status', 'Actions'].map((col, i) => (
                                    <th key={col} className={`px-6 py-4 text-[11px] font-extrabold uppercase tracking-[0.1em] text-neutral-400 dark:text-neutral-500 ${i === 0 ? 'pl-8' : ''} ${col === 'Actions' ? 'text-right pr-8' : ''}`}>
                                        {col !== 'Actions' ? (
                                            <span className="flex items-center gap-1.5 cursor-pointer hover:text-neutral-600 transition-colors select-none">
                                                {col} <ArrowUpDown className="size-3" />
                                            </span>
                                        ) : col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                            {users.length > 0 ? (
                                users.map((item: any) => (
                                    <tr key={item.id} className="group hover:bg-blue-50/40 dark:hover:bg-blue-900/5 transition-colors duration-150">
                                        {/* Name */}
                                        <td className="pl-8 pr-6 py-4">
                                            <div className="flex items-center gap-4 min-w-0">
                                                <Avatar className="h-10 w-10 shrink-0 shadow-md ring-2 ring-white dark:ring-neutral-900">
                                                    {item.profile_picture && <AvatarImage src={item.profile_picture} />}
                                                    <AvatarFallback className={`bg-gradient-to-br ${getGradient(item.first_name + item.last_name)} text-white text-[13px] font-bold`}>
                                                        {item.first_name?.[0]}{item.last_name?.[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0">
                                                    <p className="text-[14px] font-bold text-[#0A2540] dark:text-white leading-tight truncate">
                                                        {item.first_name} {item.last_name}
                                                    </p>
                                                    <p className="text-[12px] text-neutral-400 font-medium mt-0.5 truncate">
                                                        ID: {item.id?.substring(0, 8)}…
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        {/* Email */}
                                        <td className="px-6 py-4">
                                            <span className="text-[13px] font-medium text-neutral-600 dark:text-neutral-400 truncate block">{item.email}</span>
                                        </td>
                                        {/* Role */}
                                        <td className="px-6 py-4">
                                            <Badge className="rounded-lg px-3 py-1 text-[11px] font-bold uppercase tracking-wide bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/40 hover:bg-blue-50 whitespace-nowrap">
                                                {item.role}
                                            </Badge>
                                        </td>
                                        {/* Department */}
                                        <td className="px-6 py-4">
                                            <span className="text-[13px] font-medium text-neutral-500 dark:text-neutral-400 truncate block">{item.department || '—'}</span>
                                        </td>
                                        {/* Hire Date */}
                                        <td className="px-6 py-4">
                                            <span className="text-[13px] font-medium text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                                                {new Date(item.hire_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </span>
                                        </td>
                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <Badge className={`rounded-full px-3.5 py-1 text-[11px] font-bold tracking-wide border whitespace-nowrap ${
                                                item.status === 'ACTIVE'
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/40 hover:bg-emerald-50'
                                                    : 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/40 hover:bg-red-50'
                                            }`}>
                                                <span className={`inline-block size-1.5 rounded-full mr-1.5 ${item.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                                {item.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </td>
                                        {/* Actions */}
                                        <td className="pr-8 pl-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="size-9 p-0 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                                                        <MoreHorizontal className="size-4 text-neutral-500" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl border-neutral-200 dark:border-neutral-800" style={{ fontFamily: fontStack }}>
                                                    <Link href={`/admin/user/${item.id}`}>
                                                        <DropdownMenuItem className="gap-2.5 rounded-lg font-semibold text-[13px] cursor-pointer">
                                                            <Eye className="size-4 text-neutral-400" /> View Profile
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    <Link href={`/admin/user/${item.id}/edit`}>
                                                        <DropdownMenuItem className="gap-2.5 rounded-lg font-semibold text-[13px] cursor-pointer">
                                                            <Pencil className="size-4 text-neutral-400" /> Edit Details
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => router.patch(`/admin/user/${item.id}/status`)} className="gap-2.5 rounded-lg font-semibold text-[13px] cursor-pointer text-amber-600 focus:text-amber-600">
                                                        <Ban className="size-4" /> {item.status === 'ACTIVE' ? 'Suspend Access' : 'Restore Access'}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => {
                                                        if(confirm(`Are you sure you want to remove ${item.first_name}?`)) {
                                                            router.delete(`/admin/user/${item.id}`);
                                                        }
                                                    }} className="gap-2.5 rounded-lg font-semibold text-[13px] cursor-pointer text-red-600 focus:text-red-600">
                                                        <Trash2 className="size-4" /> Remove Staff
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <div className="flex items-center justify-center size-20 rounded-3xl bg-neutral-100 dark:bg-neutral-900">
                                                <Users className="size-10 text-neutral-300 dark:text-neutral-600" />
                                            </div>
                                            <div>
                                                <p className="text-[16px] font-bold text-neutral-800 dark:text-neutral-200">No staff records found</p>
                                                <p className="text-[14px] text-neutral-400 mt-1">Click "Add Staff Member" to register your first team member.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ─── PAGINATION ─── */}
                {staff?.last_page > 1 && (
                    <div className="shrink-0 px-8 py-4 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800/60 bg-white dark:bg-[#0c0c0c]">
                        <Button
                            variant="ghost"
                            className="h-10 gap-2 rounded-xl text-[13px] font-bold text-neutral-500 disabled:opacity-30"
                            disabled={!staff.prev_page_url}
                            onClick={() => staff.prev_page_url && router.get(staff.prev_page_url)}
                        >
                            <ChevronLeft className="size-4" /> Previous
                        </Button>
                        <div className="flex items-center gap-1">
                            {staff.links
                                ?.filter((l: any) => !l.label.includes('&laquo;') && !l.label.includes('&raquo;'))
                                .map((link: any, i: number) => (
                                    <button
                                        key={i}
                                        onClick={() => link.url && router.get(link.url)}
                                        className={`size-9 rounded-xl flex items-center justify-center text-[13px] font-bold transition-all ${
                                            link.active
                                                ? 'bg-[#0A2540] dark:bg-white text-white dark:text-[#0A2540] shadow-md'
                                                : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                        </div>
                        <Button
                            variant="ghost"
                            className="h-10 gap-2 rounded-xl text-[13px] font-bold text-neutral-500 disabled:opacity-30"
                            disabled={!staff.next_page_url}
                            onClick={() => staff.next_page_url && router.get(staff.next_page_url)}
                        >
                            Next <ChevronRight className="size-4" />
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}

StaffIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Staff Management', href: '/admin/user' },
    ],
};
