import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Megaphone,
    Search,
    Calendar,
    User,
    ShieldAlert,
    Info,
    Layout,
    Clock,
    Tag,
    AlertCircle,
    Image as ImageIcon,
    FileText,
    Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SweetAlert } from '@/components/ui/sweet-alert';
import { useState, useEffect } from 'react';

const fontStack = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif';

export default function AnnouncementEdit({ announcement }: { announcement: any }) {
    const { flash } = usePage<any>().props;
    const [alert, setAlert] = useState<{
        show: boolean;
        type: 'success' | 'error' | 'warning' | 'info';
        title: string;
        message?: string;
    }>({ show: false, type: 'success', title: '' });

    useEffect(() => {
        if (flash?.success) {
            setAlert({ show: true, type: 'success', title: 'Update Successful', message: flash.success });
        }
        if (flash?.error) {
            setAlert({ show: true, type: 'error', title: 'Update Failed', message: flash.error });
        }
    }, [flash?.success, flash?.error]);

    const res = announcement.data;

    const { data, setData, put, post, processing, errors } = useForm({
        _method: 'PUT',
        title: res.title || '',
        content: res.content || '',
        category: res.category || 'general',
        priority: res.priority || 'normal',
        status: res.status || 'draft',
        published_at: res.published_at ? res.published_at.replace(' ', 'T') : '',
        image: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Use POST with _method PUT for file upload support in Laravel PUT requests
        post(`/admin/announcements/${res.id}`, {
            onError: () => {
                setAlert({
                    show: true,
                    type: 'error',
                    title: 'Update Failed',
                    message: 'Please review the fields and try again.',
                });
            },
        });
    };

    const SectionHeader = ({ icon: Icon, title, description }: any) => (
        <div className="flex items-start gap-4 mb-6 relative pl-4">
            <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-amber-600/30 dark:bg-amber-400/20 rounded-full" />
            <div className="flex items-center justify-center size-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 shrink-0">
                <Icon className="size-4.5" />
            </div>
            <div>
                <h2 className="text-[15px] font-black tracking-tight text-[#0A2540] dark:text-white uppercase">{title}</h2>
                <p className="text-[11px] text-neutral-400 font-bold mt-0.5">{description}</p>
            </div>
        </div>
    );

    return (
        <>
            <Head title="Edit Announcement" />
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
                {/* ─── HEADER ─── */}
                <div className="shrink-0 px-8 py-6 border-b border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/30 dark:bg-neutral-900/40">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center size-10 rounded-xl bg-amber-600 shadow-lg shadow-amber-500/20">
                                <Megaphone className="size-5 text-white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-[20px] font-black tracking-tight text-[#0A2540] dark:text-white">
                                    Edit Announcement
                                </h1>
                                <p className="text-[12px] text-neutral-400 font-bold tracking-wide uppercase mt-0.5">
                                    Modify an existing announcement for the community
                                </p>
                            </div>
                        </div>
                        <Link href="/admin/announcements">
                            <Button variant="outline" className="h-9 gap-2 rounded-lg text-[12px] font-bold text-neutral-500 border-neutral-200">
                                <ArrowLeft className="size-3.5" /> Back to List
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* ─── SCROLLABLE FORM ─── */}
                <form onSubmit={submit} className="flex-1 overflow-y-auto">
                    <div className="max-w-[1000px] mx-auto px-12 py-10">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                            
                            {/* MAIN CONTENT AREA */}
                            <div className="md:col-span-8 space-y-8">
                                <div className="space-y-6">
                                    <SectionHeader 
                                        icon={FileText} 
                                        title="Content" 
                                        description="Update the message or title."
                                    />
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-[11px] font-black uppercase text-neutral-400">Announcement Title <span className="text-red-500">*</span></Label>
                                            <Input 
                                                value={data.title} 
                                                onChange={e => setData('title', e.target.value)} 
                                                placeholder="e.g. Scheduled Water Maintenance" 
                                                className="h-11 rounded-xl text-[14px] font-bold border-neutral-200 focus:ring-amber-500/20"
                                            />
                                            {errors.title && <p className="text-[10px] font-bold text-red-500">⚠ {errors.title}</p>}
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-[11px] font-black uppercase text-neutral-400">Main Content <span className="text-red-500">*</span></Label>
                                            <textarea 
                                                value={data.content} 
                                                onChange={e => setData('content', e.target.value)}
                                                rows={12}
                                                placeholder="Provide detailed information here..."
                                                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[14px] font-bold dark:bg-neutral-900 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                                            />
                                            {errors.content && <p className="text-[10px] font-bold text-red-500">⚠ {errors.content}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <SectionHeader 
                                        icon={ImageIcon} 
                                        title="Media" 
                                        description="Replace the existing image."
                                    />
                                    <div className="flex flex-col gap-4">
                                        {res.image_url && !data.image && (
                                            <div className="relative size-32 rounded-xl overflow-hidden border border-neutral-200">
                                                <img src={res.image_url} alt="Current" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                    <span className="text-[10px] text-white font-bold uppercase tracking-widest">Current Image</span>
                                                </div>
                                            </div>
                                        )}
                                        <div className="p-8 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/40 flex flex-col items-center justify-center gap-3 group hover:border-amber-400/50 transition-all cursor-pointer relative overflow-hidden">
                                            <input 
                                                type="file" 
                                                onChange={e => setData('image', e.target.files ? e.target.files[0] : null)}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                accept="image/*"
                                            />
                                            <div className="size-12 rounded-full bg-white dark:bg-neutral-800 shadow-sm flex items-center justify-center text-neutral-400 group-hover:text-amber-500 transition-colors">
                                                <ImageIcon className="size-6" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[13px] font-bold text-neutral-600 dark:text-neutral-300">
                                                    {data.image ? (data.image as any).name : 'Click to update image'}
                                                </p>
                                                <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider mt-1">PNG, JPG up to 2MB</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SIDEBAR SETTINGS */}
                            <div className="md:col-span-4 space-y-8">
                                <div className="space-y-6 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/40">
                                    <SectionHeader 
                                        icon={Layout} 
                                        title="Categorization" 
                                        description="Update labels."
                                    />
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-[11px] font-black uppercase text-neutral-400">Category</Label>
                                            <select 
                                                value={data.category} 
                                                onChange={e => setData('category', e.target.value)}
                                                className="w-full h-10 rounded-lg border border-neutral-200 bg-white px-3 text-[13px] font-bold dark:bg-neutral-900 focus:ring-2 focus:ring-amber-500/20 transition-all"
                                            >
                                                <option value="general">General</option>
                                                <option value="maintenance">Maintenance</option>
                                                <option value="emergency">Emergency</option>
                                                <option value="event">Event</option>
                                            </select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-[11px] font-black uppercase text-neutral-400">Priority Level</Label>
                                            <select 
                                                value={data.priority} 
                                                onChange={e => setData('priority', e.target.value)}
                                                className="w-full h-10 rounded-lg border border-neutral-200 bg-white px-3 text-[13px] font-bold dark:bg-neutral-900 focus:ring-2 focus:ring-amber-500/20 transition-all"
                                            >
                                                <option value="normal">Normal</option>
                                                <option value="important">Important</option>
                                                <option value="urgent">Urgent / Emergency</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/40">
                                    <SectionHeader 
                                        icon={Clock} 
                                        title="Publishing" 
                                        description="Update timing and visibility."
                                    />
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-[11px] font-black uppercase text-neutral-400">Post Status</Label>
                                            <select 
                                                value={data.status} 
                                                onChange={e => setData('status', e.target.value)}
                                                className="w-full h-10 rounded-lg border border-neutral-200 bg-white px-3 text-[13px] font-bold dark:bg-neutral-900 focus:ring-2 focus:ring-amber-500/20 transition-all"
                                            >
                                                <option value="draft">Draft (Private)</option>
                                                <option value="published">Published (Public)</option>
                                                <option value="archived">Archived</option>
                                            </select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-[11px] font-black uppercase text-neutral-400">Scheduled Date</Label>
                                            <Input 
                                                type="datetime-local" 
                                                value={data.published_at} 
                                                onChange={e => setData('published_at', e.target.value)} 
                                                className="h-10 rounded-lg text-[13px] font-bold"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                {/* ─── STICKY FOOTER ─── */}
                <div className="shrink-0 bg-white dark:bg-[#0c0c0c] border-t border-neutral-100 dark:border-neutral-800/60 px-8 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-neutral-400">
                            <Info className="size-4" />
                            <p className="text-[12px] font-bold uppercase tracking-wider px-2">Update id: {res.id}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href="/admin/announcements">
                                <Button type="button" variant="ghost" className="h-10 rounded-xl px-6 text-[13px] font-black text-neutral-500 hover:bg-neutral-50">
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                onClick={submit}
                                disabled={processing}
                                className="h-10 rounded-xl px-8 text-[13px] font-black bg-amber-600 hover:bg-amber-700 text-white shadow-xl shadow-amber-600/20 transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                <Save className="size-4 mr-2" />
                                {processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

AnnouncementEdit.layout = (page: any) => ({
    children: page,
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Announcements', href: '/admin/announcements' },
        { title: 'Edit Notice', href: `/admin/announcements` },
    ],
});
