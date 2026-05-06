import { Head, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Megaphone, Lock, Globe, Star, AlertTriangle, Calendar, User, ChevronRight, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const fontStack = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif';

const categoryColors: Record<string, string> = {
    general:     'bg-blue-50 text-blue-700 border-blue-200',
    maintenance: 'bg-orange-50 text-orange-700 border-orange-200',
    events:      'bg-purple-50 text-purple-700 border-purple-200',
    emergency:   'bg-rose-50 text-rose-700 border-rose-200',
    financial:   'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const priorityDot: Record<string, string> = {
    low:    'bg-neutral-400',
    medium: 'bg-amber-400',
    high:   'bg-orange-500',
    urgent: 'bg-rose-500 animate-pulse',
};

export default function ResidentAnnouncements() {
    const { announcements } = usePage<any>().props;
    const [selected, setSelected] = useState<any | null>(null);

    return (
        <>
            <Head title="Announcements | Resident Portal" />

            <div className="flex h-full flex-1 flex-col gap-0 animate-in fade-in duration-700" style={{ fontFamily: fontStack }}>

                {/* ─── HERO HEADER ─── */}
                <div className="relative overflow-hidden rounded-3xl bg-neutral-900 p-8 md:p-12 text-white shadow-2xl mx-4 mt-4">
                    <div className="absolute top-0 right-0 -mt-16 -mr-16 h-56 w-56 rounded-full bg-blue-600/20 blur-3xl" />
                    <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-56 w-56 rounded-full bg-indigo-500/15 blur-3xl" />
                    <div className="relative z-10 flex items-center gap-5">
                        <div className="flex items-center justify-center size-14 rounded-2xl bg-blue-600 shadow-2xl shadow-blue-600/30">
                            <Megaphone className="size-7 text-white" strokeWidth={2.5} />
                        </div>
                        <div>
                            <Badge variant="outline" className="mb-2 bg-white/10 text-white border-white/20 text-[10px] uppercase tracking-widest font-bold">
                                HOA Community
                            </Badge>
                            <h1 className="text-3xl font-black tracking-tight leading-none">Announcements</h1>
                            <p className="text-sm text-neutral-400 mt-1 font-medium">Community updates, notices, and important bulletins</p>
                        </div>
                    </div>
                </div>

                {/* ─── CONTENT ─── */}
                <div className="flex-1 px-4 py-4">
                    {!announcements?.data?.length ? (
                        <div className="flex flex-col items-center justify-center py-32 opacity-30">
                            <Megaphone className="size-20 text-neutral-400" strokeWidth={1} />
                            <p className="text-[15px] font-black text-neutral-400 uppercase tracking-widest mt-4">No announcements yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {announcements.data.map((a: any) => {
                                const catClass = categoryColors[a.category?.value ?? a.category] ?? 'bg-neutral-100 text-neutral-600 border-neutral-200';
                                const isPrivate = a.status?.value === 'private' || a.status === 'private';
                                const dotClass = priorityDot[a.priority?.value ?? a.priority] ?? 'bg-neutral-400';

                                return (
                                    <div
                                        key={a.id}
                                        onClick={() => setSelected(a)}
                                        className="group cursor-pointer rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col"
                                    >
                                        {/* Image */}
                                        {a.image_url && (
                                            <div className="h-40 overflow-hidden">
                                                <img src={a.image_url} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            </div>
                                        )}

                                        <div className="p-5 flex flex-col gap-3 flex-1">
                                            {/* Top badges row */}
                                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                                <div className="flex items-center gap-2">
                                                    <span className={cn('text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border', catClass)}>
                                                        {a.category?.value ?? a.category}
                                                    </span>
                                                    {isPrivate && (
                                                        <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                                            <Lock className="size-2.5" /> Members Only
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className={cn('size-2 rounded-full', dotClass)} />
                                                    <span className="text-[10px] font-bold text-neutral-400 uppercase">{a.priority?.value ?? a.priority}</span>
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-[15px] font-black text-[#0A2540] dark:text-neutral-100 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                                                {a.title}
                                            </h3>

                                            {/* Excerpt */}
                                            <p className="text-[12px] text-neutral-500 leading-relaxed line-clamp-3 flex-1">
                                                {a.content}
                                            </p>

                                            {/* Footer */}
                                            <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
                                                <div className="flex items-center gap-2 text-neutral-400">
                                                    <User className="size-3.5" />
                                                    <span className="text-[11px] font-bold">{a.author?.name ?? 'HOA Admin'}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-blue-600 text-[11px] font-black">
                                                    Read More <ChevronRight className="size-3.5" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {(announcements?.meta?.links?.length ?? 0) > 3 && (
                        <div className="mt-6 flex items-center justify-center gap-2">
                            {announcements.meta.links.map((link: any, i: number) => (
                                <Button
                                    key={i}
                                    variant={link.active ? 'default' : 'outline'}
                                    disabled={!link.url}
                                    onClick={() => router.get(link.url)}
                                    className={cn('h-8 min-w-[32px] rounded-lg text-[11px] font-black', link.active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 border-blue-600' : 'text-neutral-500')}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ─── DETAIL DIALOG ─── */}
            <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
                <DialogContent className="sm:max-w-[680px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl bg-white dark:bg-neutral-900 max-h-[90vh] flex flex-col">
                    {selected && (
                        <>
                            {/* Image */}
                            {selected.image_url && (
                                <div className="h-52 overflow-hidden shrink-0">
                                    <img src={selected.image_url} alt={selected.title} className="w-full h-full object-cover" />
                                </div>
                            )}

                            {/* Header */}
                            <div className="shrink-0 px-8 pt-7 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                                            <span className={cn('text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border', categoryColors[selected.category?.value ?? selected.category] ?? 'bg-neutral-100 text-neutral-600')}>
                                                {selected.category?.value ?? selected.category}
                                            </span>
                                            {(selected.status?.value === 'private' || selected.status === 'private') && (
                                                <span className="flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                                    <Lock className="size-3" /> Members Only
                                                </span>
                                            )}
                                        </div>
                                        <h2 className="text-[22px] font-black tracking-tight text-[#0A2540] dark:text-white leading-tight">
                                            {selected.title}
                                        </h2>
                                        <div className="flex items-center gap-4 mt-3 text-neutral-400">
                                            <div className="flex items-center gap-1.5">
                                                <User className="size-3.5" />
                                                <span className="text-[12px] font-bold">{selected.author?.name ?? 'HOA Admin'}</span>
                                            </div>
                                            {selected.published_at && (
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="size-3.5" />
                                                    <span className="text-[12px] font-bold">
                                                        {new Date(selected.published_at).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto px-8 py-6">
                                <p className="text-[14px] text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                                    {selected.content}
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="shrink-0 px-8 py-5 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-900/40 flex justify-end">
                                <Button onClick={() => setSelected(null)} className="h-10 rounded-xl px-6 font-black text-[13px] bg-blue-600 hover:bg-blue-700 text-white">
                                    Close
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

ResidentAnnouncements.layout = {
    breadcrumbs: [
        { title: 'Announcements', href: '/announcements' },
    ],
};
