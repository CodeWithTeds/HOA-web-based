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
    Settings,
    Save,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SweetAlert } from '@/components/ui/sweet-alert';

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

    const { data, setData, post, processing, errors } = useForm({
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
                <p className="text-[12px] text-neutral-400 font-bold mt-0.5 leading-tight">{description}</p>
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
                                <h1 className="text-[20px] font-black tracking-tight text-[#0A2540] dark:text-white leading-none">
                                    Edit Announcement
                                </h1>
                                <p className="text-[12px] text-neutral-400 font-bold tracking-wide uppercase mt-1.5">
                                    Notice ID: #{res.id} • Author: {res.author?.name}
                                </p>
                            </div>
                        </div>
                        <Link href="/admin/announcements">
                            <Button variant="outline" className="h-9 gap-2 rounded-lg text-[12px] font-bold text-neutral-500 border-neutral-200">
                                <ArrowLeft className="size-3.5" /> Back to Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* ─── SCROLLABLE FORM ─── */}
                <form onSubmit={submit} className="flex-1 overflow-y-auto">
                    <div className="px-12 py-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
                            
                            {/* COLUMN 1: PRIMARY CONTENT */}
                            <div className="space-y-8">
                                <SectionHeader 
                                    icon={FileText} 
                                    title="Main Content" 
                                    description="Update the headline and message body."
                                />
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Announcement Title <span className="text-red-500">*</span></Label>
                                        <Input 
                                            value={data.title} 
                                            onChange={e => setData('title', e.target.value)} 
                                            placeholder="e.g. Annual HOA Assembly 2026" 
                                            className="h-10 rounded-xl text-[14px] font-bold border-neutral-200" 
                                        />
                                        {errors.title && <p className="text-[10px] font-bold text-red-500">⚠ {errors.title}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Content Body <span className="text-red-500">*</span></Label>
                                        <textarea 
                                            value={data.content} 
                                            onChange={e => setData('content', e.target.value)}
                                            rows={10}
                                            placeholder="Specify the full details of this announcement..."
                                            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[14px] font-bold dark:bg-neutral-900 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                                        />
                                        {errors.content && <p className="text-[10px] font-bold text-red-500">⚠ {errors.content}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* COLUMN 2: SETTINGS & VISIBILITY */}
                            <div className="space-y-8">
                                <SectionHeader 
                                    icon={Settings} 
                                    title="Configuration" 
                                    description="Update classification and scheduling."
                                />
                                <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Category</Label>
                                        <select value={data.category} onChange={e => setData('category', e.target.value)} className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-[13px] font-bold dark:bg-neutral-900 focus:ring-2 focus:ring-amber-500/20">
                                            <option value="general">General</option>
                                            <option value="maintenance">Maintenance</option>
                                            <option value="emergency">Emergency</option>
                                            <option value="event">Event</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Priority Level</Label>
                                        <select value={data.priority} onChange={e => setData('priority', e.target.value)} className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-[13px] font-bold dark:bg-neutral-900 focus:ring-2 focus:ring-amber-500/20">
                                            <option value="normal">Normal</option>
                                            <option value="important">Important</option>
                                            <option value="urgent">Urgent</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Post Status</Label>
                                        <select value={data.status} onChange={e => setData('status', e.target.value)} className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-[13px] font-bold dark:bg-neutral-900 focus:ring-2 focus:ring-amber-500/20">
                                            <option value="private">Private</option>
                                            <option value="published">Published</option>
                                            <option value="archived">Archived</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Scheduled Date</Label>
                                        <Input type="datetime-local" value={data.published_at} onChange={e => setData('published_at', e.target.value)} className="h-10 rounded-lg text-[13px] font-bold" />
                                    </div>

                                    <div className="col-span-2 space-y-4">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Featured Image</Label>
                                        <div className="flex flex-col gap-4">
                                            {res.image_url && !data.image && (
                                                <div className="relative size-24 rounded-xl overflow-hidden border border-neutral-200 shadow-sm">
                                                    <img src={res.image_url} alt="Current" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div className="p-8 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/40 flex flex-col items-center justify-center gap-3 relative group hover:border-amber-400/50 cursor-pointer overflow-hidden transition-all">
                                                <input 
                                                    type="file" 
                                                    onChange={e => setData('image', e.target.files ? e.target.files[0] : null)}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    accept="image/*"
                                                />
                                                <div className="size-10 rounded-full bg-white dark:bg-neutral-800 shadow-sm flex items-center justify-center text-neutral-400 group-hover:text-amber-500 transition-colors">
                                                    <ImageIcon className="size-5" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-[12px] font-bold text-neutral-600 dark:text-neutral-300">
                                                        {data.image ? (data.image as any).name : 'Click to replace image file'}
                                                    </p>
                                                    <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">PNG, JPG up to 2MB</p>
                                                </div>
                                            </div>
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
                            <p className="text-[12px] font-bold uppercase tracking-wider">Update changes to notice #{res.id}</p>
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
                                {processing ? <Clock className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
                                {processing ? 'Updating...' : 'Save Changes'}
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
        { title: 'Edit Post', href: `/admin/announcements` },
    ],
});
