import { Head, Link, useForm, usePage } from '@inertiajs/react';
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
    Save,
    CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SweetAlert } from '@/components/ui/sweet-alert';
import { useState, useEffect } from 'react';

const fontStack = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif';

export default function ComplaintEdit({ complaint, residents, staff }: { complaint: any, residents: any[], staff: any[] }) {
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
    }, [flash?.success]);

    const res = complaint.data;

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        subject: res.subject || '',
        description: res.description || '',
        category: res.category || 'maintenance',
        status: res.status || 'pending',
        assigned_to: res.assigned_staff?.id || '',
        resolution_notes: res.resolution_notes || '',
        image: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/complaints/${res.id}`, {
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

    const SectionHeader = ({ icon: Icon, title, description, colorClass = "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400", barClass = "bg-rose-600/30" }: any) => (
        <div className="flex items-start gap-4 mb-6 relative pl-4">
            <div className={`absolute left-0 top-1 bottom-1 w-0.5 ${barClass} rounded-full`} />
            <div className={`flex items-center justify-center size-8 rounded-lg ${colorClass} shrink-0`}>
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
            <Head title={`Manage Ticket #${res.id}`} />
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
                            <div className="flex items-center justify-center size-10 rounded-xl bg-neutral-800 shadow-lg shadow-black/20">
                                <Settings className="size-5 text-white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-[20px] font-black tracking-tight text-[#0A2540] dark:text-white leading-none">
                                    Manage Complaint Ticket #{res.id}
                                </h1>
                                <p className="text-[12px] text-neutral-400 font-bold tracking-wide uppercase mt-1.5 flex items-center gap-2">
                                    Submitted by <span className="text-rose-600">{res.resident?.name}</span> • {new Date(res.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <Link href="/admin/complaints">
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
                            
                            {/* COLUMN 1: TICKET INFO & RESOLUTION */}
                            <div className="space-y-12">
                                <section>
                                    <SectionHeader 
                                        icon={FileText} 
                                        title="Initial Complaint" 
                                        description="Original details provided by the resident."
                                    />
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-[11px] font-black uppercase text-neutral-400">Subject</Label>
                                            <Input 
                                                value={data.subject} 
                                                onChange={e => setData('subject', e.target.value)} 
                                                className="h-10 rounded-xl text-[14px] font-bold border-neutral-200" 
                                            />
                                            {errors.subject && <p className="text-[10px] font-bold text-red-500">⚠ {errors.subject}</p>}
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[11px] font-black uppercase text-neutral-400">Description</Label>
                                            <textarea 
                                                value={data.description} 
                                                onChange={e => setData('description', e.target.value)}
                                                rows={6}
                                                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[13px] font-bold dark:bg-neutral-900 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                                            />
                                            {errors.description && <p className="text-[10px] font-bold text-red-500">⚠ {errors.description}</p>}
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <SectionHeader 
                                        icon={CheckCircle2} 
                                        title="Resolution & Feedback" 
                                        description="Record the actions taken and outcome."
                                        colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                                        barClass="bg-emerald-600/30"
                                    />
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-[11px] font-black uppercase text-neutral-400 text-emerald-600">Resolution Notes</Label>
                                            <textarea 
                                                value={data.resolution_notes} 
                                                onChange={e => setData('resolution_notes', e.target.value)}
                                                rows={6}
                                                placeholder="Describe how the issue was resolved..."
                                                className="w-full rounded-xl border border-emerald-100 bg-emerald-50/20 px-4 py-3 text-[13px] font-bold dark:bg-neutral-900 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                            />
                                            {errors.resolution_notes && <p className="text-[10px] font-bold text-red-500">⚠ {errors.resolution_notes}</p>}
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* COLUMN 2: WORKFLOW & ATTACHMENTS */}
                            <div className="space-y-8">
                                <SectionHeader 
                                    icon={Settings} 
                                    title="Workflow Settings" 
                                    description="Update status, priority and assignment."
                                />
                                <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Status</Label>
                                        <select value={data.status} onChange={e => setData('status', e.target.value)} className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-[13px] font-bold dark:bg-neutral-900 focus:ring-2 focus:ring-rose-500/20">
                                            <option value="pending">Pending</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="resolved">Resolved</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Assigned Staff</Label>
                                        <select value={data.assigned_to} onChange={e => setData('assigned_to', e.target.value)} className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-[13px] font-bold dark:bg-neutral-900 focus:ring-2 focus:ring-rose-500/20">
                                            <option value="">Unassigned</option>
                                            {staff.map(s => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-span-2 space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Category</Label>
                                        <select value={data.category} onChange={e => setData('category', e.target.value)} className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-[13px] font-bold dark:bg-neutral-900 focus:ring-2 focus:ring-rose-500/20">
                                            <option value="maintenance">Maintenance</option>
                                            <option value="noise">Noise</option>
                                            <option value="security">Security</option>
                                            <option value="pets">Pets</option>
                                            <option value="others">Others</option>
                                        </select>
                                    </div>

                                    <div className="col-span-2 space-y-4 pt-4 border-t border-neutral-50 dark:border-neutral-800/60 mt-4">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400 tracking-wider">Complaint Attachment</Label>
                                        {res.attachment_url ? (
                                            <div className="relative group">
                                                <div className="rounded-[2.5rem] overflow-hidden border border-neutral-100 shadow-xl shadow-black/5 bg-neutral-50 dark:bg-neutral-900 max-h-[400px]">
                                                    <img src={res.attachment_url} alt="Evidence" className="w-full h-auto object-contain" />
                                                </div>
                                                <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <a href={res.attachment_url} target="_blank" className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-full text-[12px] font-black shadow-2xl">View Original</a>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-12 border-2 border-dashed border-neutral-100 dark:border-neutral-800/60 rounded-[2.5rem] bg-neutral-50/20 flex flex-col items-center gap-4">
                                                <ImageIcon className="size-10 text-neutral-200" />
                                                <p className="text-[12px] font-bold text-neutral-400 uppercase tracking-widest">No attachment provided</p>
                                            </div>
                                        )}
                                        
                                        <div className="mt-8">
                                            <Label className="text-[11px] font-black uppercase text-neutral-400">Update / Replace Attachment</Label>
                                            <div className="mt-2 p-6 border border-neutral-100 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900 flex items-center gap-4 relative">
                                                <input 
                                                    type="file" 
                                                    onChange={e => setData('image', e.target.files ? e.target.files[0] : null)}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    accept="image/*"
                                                />
                                                <div className="size-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                                                    <ImageIcon className="size-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[12px] font-bold text-neutral-600 dark:text-neutral-300">
                                                        {data.image ? (data.image as any).name : 'Click to select a new image'}
                                                    </p>
                                                    <p className="text-[10px] font-medium text-neutral-400">Supported: JPG, PNG, WEBP (Max 5MB)</p>
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
                        <div className="flex items-center gap-2 text-neutral-400 font-bold uppercase tracking-widest text-[11px]">
                            <Clock className="size-4" />
                            Ticket status: {res.status.replace('_', ' ')}
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href="/admin/complaints">
                                <Button type="button" variant="ghost" className="h-10 rounded-xl px-6 text-[13px] font-black text-neutral-500 hover:bg-neutral-50">
                                    Discard Changes
                                </Button>
                            </Link>
                            <Button
                                onClick={submit}
                                disabled={processing}
                                className="h-10 rounded-xl px-8 text-[13px] font-black bg-rose-600 hover:bg-rose-700 text-white shadow-xl shadow-rose-600/20 transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {processing ? <Clock className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
                                {processing ? 'Updating Ticket...' : 'Update & Sync'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

ComplaintEdit.layout = (page: any) => ({
    children: page,
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Complaints', href: '/admin/complaints' },
        { title: 'Manage Ticket', href: '#' },
    ],
});
