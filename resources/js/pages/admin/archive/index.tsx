import { Head, router, usePage, Link } from '@inertiajs/react';
import { Archive, RotateCcw, Trash2, ArrowLeft, Search, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SweetAlert } from '@/components/ui/sweet-alert';

const fontStack = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif';

export default function ArchiveIndex({ type, records, counts }: { type: string; records: any; counts: Record<string, number> }) {
    const { flash } = usePage<any>().props;
    const [alert, setAlert] = useState<{ show: boolean; type: 'success' | 'error'; title: string; message?: string }>({
        show: !!flash?.success,
        type: flash?.success ? 'success' : 'success',
        title: flash?.success ? 'Success' : '',
        message: flash?.success ? String(flash.success) : undefined,
    });

    const tabs: Array<{ key: string; label: string }> = [
        { key: 'residents', label: 'Residents' },
        { key: 'facilities', label: 'Facilities' },
        { key: 'announcements', label: 'Announcements' },
        { key: 'complaints', label: 'Complaints' },
        { key: 'billing', label: 'Billing Periods' },
        { key: 'users', label: 'Users' },
    ];

    const handleRestore = (id: number) => {
        router.patch(`/admin/archive/${type}/${id}/restore`, {}, {
            preserveScroll: true,
        });
    };

    const handleForceDelete = (id: number) => {
        if (!confirm('Permanently delete? This cannot be undone.')) return;
        router.delete(`/admin/archive/${type}/${id}/force`, { preserveScroll: true });
    };

    const switchType = (newType: string) => {
        router.get('/admin/archive', { type: newType }, { preserveState: false });
    };

    const items = records?.data || [];

    return (
        <>
            <Head title="Archive" />
            <SweetAlert type={alert.type} title={alert.title} message={alert.message} show={alert.show} onClose={() => setAlert(prev => ({ ...prev, show: false }))} />
            <div className="flex h-full flex-1 flex-col rounded-2xl bg-white dark:bg-[#0c0c0c] text-[#0A2540] dark:text-neutral-100 overflow-hidden" style={{ fontFamily: fontStack }}>
                <div className="shrink-0 px-8 py-6 border-b border-neutral-100 dark:border-neutral-800/60">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center size-10 rounded-xl bg-amber-600 shadow-lg shadow-amber-500/20">
                                <Archive className="size-5 text-white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-[22px] font-black tracking-tight">Archive</h1>
                                <p className="text-[12px] font-bold text-neutral-400 uppercase tracking-wider">Archived records — not permanently deleted • Restore when needed</p>
                            </div>
                        </div>
                        <Link href="/admin/residents">
                            <Button variant="outline" className="h-9 gap-2 rounded-lg text-[12px] font-bold text-neutral-500 border-neutral-200">
                                <ArrowLeft className="size-3.5" /> Back
                            </Button>
                        </Link>
                    </div>
                    <div className="mt-6 flex gap-2 flex-wrap">
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => switchType(tab.key)}
                                className={`px-4 py-2 rounded-xl text-[12px] font-black uppercase tracking-wider border transition ${type === tab.key ? 'bg-[#0A2540] text-white border-[#0A2540]' : 'bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50'}`}
                            >
                                {tab.label} <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] ${type === tab.key ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-600'}`}>{counts[tab.key] ?? 0}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-auto">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <div className="size-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                                <Archive className="size-8 text-neutral-300" />
                            </div>
                            <p className="text-[14px] font-black text-neutral-500">No archived {type} records</p>
                            <p className="text-[12px] font-bold text-neutral-400">When you archive records, they will appear here and can be restored.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead className="sticky top-0 z-10 bg-neutral-50 dark:bg-neutral-900">
                                <tr className="border-b">
                                    <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b">ID</th>
                                    <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b">Details</th>
                                    <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b">Deleted At</th>
                                    <th className="px-6 py-3 text-right text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {items.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-neutral-50/50">
                                        <td className="px-6 py-3 text-[12px] font-black">#{item.id}</td>
                                        <td className="px-6 py-3">
                                            <div className="text-[13px] font-bold truncate max-w-[500px]">
                                                {item.first_name ? `${item.first_name} ${item.last_name} — ${item.resident_type} • P${item.phase} B${item.block} L${item.lot} ${item.street || ''}` : item.name || item.title || item.subject || JSON.stringify(item).slice(0, 80)}
                                            </div>
                                            <div className="text-[11px] font-medium text-neutral-400 truncate">
                                                {item.email || item.status || ''}
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-[12px] font-bold text-neutral-500">{item.deleted_at ? new Date(item.deleted_at).toLocaleString() : '—'}</td>
                                        <td className="px-6 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button onClick={() => handleRestore(item.id)} className="h-8 gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black uppercase">
                                                    <RotateCcw className="size-3.5" /> Restore
                                                </Button>
                                                <Button onClick={() => handleForceDelete(item.id)} variant="outline" className="h-8 gap-1 rounded-lg text-red-600 border-red-200 hover:bg-red-50 text-[11px] font-black uppercase">
                                                    <Trash2 className="size-3.5" /> Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {records?.links && (
                    <div className="shrink-0 px-8 py-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-center gap-1">
                        {records.links.map((link: any, i: number) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                className={`h-8 min-w-[32px] rounded-lg px-2 text-[11px] font-black ${link.active ? 'bg-[#0A2540] text-white' : 'text-neutral-500 hover:bg-neutral-100'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

ArchiveIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Archive', href: '/admin/archive' },
    ],
};
