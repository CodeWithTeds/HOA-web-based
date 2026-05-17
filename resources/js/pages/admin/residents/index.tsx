import { Head, Link, usePage, router } from '@inertiajs/react';
import {
    Search,
    Filter,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    Home,
    Pencil,
    Trash2,
    Eye,
    ArrowUpDown,
    Plus,
    FileSpreadsheet,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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

export default function ResidentIndex({ residents, filters }: { residents: any, filters?: any }) {
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
                    '/admin/residents',
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

    const users = residents?.data || [];
    const totalResidents = residents?.total || 0;

    return (
        <>
            <Head title="Resident Management" />
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
                            <div className="flex items-center justify-center size-10 rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20">
                                <Home className="size-5 text-white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-[22px] font-black tracking-tight text-[#0A2540] dark:text-white">
                                    Resident Directory
                                </h1>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[12px] font-bold text-neutral-400 uppercase tracking-wider">Community Database</span>
                                    <span className="size-1 rounded-full bg-neutral-300" />
                                    <span className="text-[12px] font-bold text-blue-600">{totalResidents} Total Records</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <a href={`/admin/residents/export?${new URLSearchParams(filters).toString()}`}>
                                <Button variant="outline" className="h-10 rounded-xl border-neutral-200 font-bold text-[13px] gap-2 px-4 hover:bg-neutral-50 active:scale-95 transition-all">
                                    <FileSpreadsheet className="size-4 text-emerald-600" /> Export CSV
                                </Button>
                            </a>
                            <Link href="/admin/residents/create">
                                <Button className="h-10 gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 shadow-lg shadow-blue-600/10 active:scale-95 transition-all">
                                    <Plus className="size-4" strokeWidth={3} /> Add Resident
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
                                placeholder="Search by name, address, or phone..."
                                className="h-9 w-[300px] rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 pl-9 pr-4 text-[13px] font-medium placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all"
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
                            Page {residents?.current_page} of {residents?.last_page}
                        </span>
                    </div>
                </div>

                {/* ─── COMPACT ENTERPRISE TABLE ─── */}
                <div className="min-h-0 flex-1 overflow-auto border-t border-neutral-100 dark:border-neutral-800/60">
                    <table className="w-full text-left table-fixed border-separate border-spacing-0" style={{ fontFamily: fontStack }}>
                        <colgroup>
                            <col className="w-[18%]" />
                            <col className="w-[8%]" />
                            <col className="w-[4%]" />
                            <col className="w-[4%]" />
                            <col className="w-[4%]" />
                            <col className="w-[14%]" />
                            <col className="w-[12%]" />
                            <col className="w-[18%]" />
                            <col className="w-[8%]" />
                            <col className="w-[60px]" />
                        </colgroup>
                        <thead className="sticky top-0 z-20 bg-neutral-50/80 dark:bg-neutral-900/80 backdrop-blur-md">
                            <tr className="border-b border-neutral-200 dark:border-neutral-800">
                                <th className="pl-8 px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">Resident</th>
                                <th className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">Type</th>
                                <th className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">Ph.</th>
                                <th className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">Blk.</th>
                                <th className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">Lot</th>
                                <th className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">Street/Unit</th>
                                <th className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">Contact</th>
                                <th className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">Emergency (ICE)</th>
                                <th className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-neutral-500 border-b border-neutral-200 dark:border-neutral-800 text-center">Status</th>
                                <th className="pr-8 pl-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-neutral-500 border-b border-neutral-200 dark:border-neutral-800 text-right">Edit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/40">
                            {users.length > 0 ? (
                                users.map((resident: any) => (
                                    <tr key={resident.id} className="group hover:bg-white dark:hover:bg-white/5 transition-colors duration-75 bg-transparent">
                                        <td className="pl-8 px-3 py-1.5 overflow-hidden">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <Avatar className="h-6 w-6 rounded-md shrink-0 ring-1 ring-neutral-100 dark:ring-neutral-800">
                                                    <AvatarFallback className={`bg-gradient-to-br ${getGradient(resident.first_name + resident.last_name)} text-white text-[9px] font-black`}>
                                                        {resident.first_name?.[0]}{resident.last_name?.[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0 overflow-hidden leading-tight">
                                                    <p className="text-[12px] font-bold text-[#0A2540] dark:text-neutral-200 truncate">
                                                        {resident.first_name} {resident.last_name}
                                                    </p>
                                                    {resident.is_head_of_household && (
                                                        <span className="text-[9px] font-black text-blue-600 uppercase tracking-tighter">H.O.H</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-1.5">
                                            <span className={`text-[11px] font-bold leading-none ${
                                                resident.resident_type === 'Owner' 
                                                    ? 'text-blue-600 dark:text-blue-400' 
                                                    : 'text-neutral-500 dark:text-neutral-400'
                                            }`}>
                                                {resident.resident_type}
                                            </span>
                                        </td>
                                        <td className="px-3 py-1.5">
                                            <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-300">{resident.phase || '—'}</span>
                                        </td>
                                        <td className="px-3 py-1.5">
                                            <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-300">{resident.block || '—'}</span>
                                        </td>
                                        <td className="px-3 py-1.5">
                                            <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-300">{resident.lot || '—'}</span>
                                        </td>
                                        <td className="px-3 py-1.5 min-w-0">
                                            <p className="text-[11px] font-medium text-neutral-500 truncate" title={`${resident.street} ${resident.unit || ''}`}>
                                                {resident.street || '—'} {resident.unit ? `(${resident.unit})` : ''}
                                            </p>
                                        </td>
                                        <td className="px-3 py-1.5">
                                            <span className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300">{resident.mobile_number || '—'}</span>
                                        </td>
                                        <td className="px-3 py-1.5">
                                            <div className="min-w-0 leading-tight">
                                                <p className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300 truncate">{resident.emergency_contact_name || '—'}</p>
                                                <p className="text-[10px] font-medium text-neutral-400">{resident.emergency_contact_number || ''}</p>
                                            </div>
                                        </td>
                                        <td className="px-3 py-1.5 text-center">
                                            <div className="flex justify-center">
                                                <div className={`px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                                                    resident.status === 'Active'
                                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                        : resident.status === 'Inactive'
                                                            ? 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-500'
                                                            : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                    {resident.status}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="pr-6 pl-3 py-1.5 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="size-6 p-0 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-opacity opacity-0 group-hover:opacity-100">
                                                        <MoreHorizontal className="size-3 text-neutral-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40 rounded-lg shadow-xl border-neutral-200 dark:border-neutral-800">
                                                    <Link href={`/admin/residents/${resident.id}`}>
                                                        <DropdownMenuItem className="gap-2 rounded-md font-bold text-[11px] cursor-pointer">
                                                            <Eye className="size-3.5 text-neutral-400" /> Details
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    <Link href={`/admin/residents/${resident.id}/edit`}>
                                                        <DropdownMenuItem className="gap-2 rounded-md font-bold text-[11px] cursor-pointer">
                                                            <Pencil className="size-3.5 text-neutral-400" /> Edit
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    {canDelete && (
                                                        <>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="gap-2 rounded-md font-bold text-[11px] cursor-pointer text-red-600">
                                                                <Trash2 className="size-3.5" /> Archive
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
                                    <td colSpan={10} className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <div className="flex items-center justify-center size-20 rounded-[2rem] bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-sm">
                                                <Home className="size-10 text-neutral-200 dark:text-neutral-700" strokeWidth={1.5} />
                                            </div>
                                            <div className="max-w-[400px] mx-auto">
                                                <p className="text-[16px] font-black text-[#0A2540] dark:text-neutral-200 tracking-tight">No residents matching your search</p>
                                                <p className="text-[13px] text-neutral-400 mt-2 font-bold leading-relaxed">
                                                    We couldn't find any residents for that query. Try adjusting your search keywords or clear your filters to see all community members.
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
                        Displaying <span className="text-neutral-900 dark:text-neutral-200">{(residents?.current_page - 1) * residents?.per_page + 1}-{Math.min(residents?.current_page * residents?.per_page, totalResidents)}</span> of {totalResidents} residents
                    </p>
                    
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            className="h-9 gap-1 rounded-lg text-[12px] font-bold text-neutral-500 hover:bg-neutral-50"
                            disabled={!residents.prev_page_url}
                            onClick={() => residents.prev_page_url && router.get(residents.prev_page_url)}
                        >
                            <ChevronLeft className="size-4" /> Prev
                        </Button>
                        <div className="flex items-center gap-1">
                            {residents.links
                                ?.filter((l: any) => !l.label.includes('&laquo;') && !l.label.includes('&raquo;'))
                                .map((link: any, i: number) => (
                                    <button
                                        key={i}
                                        onClick={() => link.url && router.get(link.url)}
                                        className={`size-8 rounded-lg flex items-center justify-center text-[12px] font-black transition-all ${
                                            link.active
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                        </div>
                        <Button
                            variant="ghost"
                            className="h-9 gap-1 rounded-lg text-[12px] font-bold text-neutral-500 hover:bg-neutral-50"
                            disabled={!residents.next_page_url}
                            onClick={() => residents.next_page_url && router.get(residents.next_page_url)}
                        >
                            Next <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

ResidentIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Resident Management', href: '/admin/residents' },
    ],
};
