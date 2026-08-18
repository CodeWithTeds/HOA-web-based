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
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SweetAlert } from '@/components/ui/sweet-alert';

const fontStack = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif';

export default function ComplaintCreate({ residents, staff }: { residents: any[], staff: any[] }) {
    const { flash } = usePage<any>().props;
    const [alert, setAlert] = useState<{
        show: boolean;
        type: 'success' | 'error' | 'warning' | 'info';
        title: string;
        message?: string;
    }>({ show: false, type: 'success', title: '' });

    useEffect(() => {
        if (flash?.success) {
            setAlert({ show: true, type: 'success', title: 'Ticket Recorded', message: flash.success });
        }

        if (flash?.error) {
            setAlert({ show: true, type: 'error', title: 'Operation Failed', message: flash.error });
        }
    }, [flash?.success, flash?.error]);

    const { data, setData, post, processing, errors } = useForm({
        subject: '',
        description: '',
        resident_id: '',
        category: 'maintenance',
        status: 'pending',
        assigned_to: '',
        image: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/complaints', {
            onError: () => {
                setAlert({
                    show: true,
                    type: 'error',
                    title: 'Validation Failed',
                    message: 'Please review the fields and try again.',
                });
            },
        });
    };

    const SectionHeader = ({ icon: Icon, title, description }: any) => (
        <div className="flex items-start gap-4 mb-6 relative pl-4">
            <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-rose-600/30 dark:bg-rose-400/20 rounded-full" />
            <div className="flex items-center justify-center size-8 rounded-lg bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 shrink-0">
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
            <Head title="Record Complaint" />
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
                            <div className="flex items-center justify-center size-10 rounded-xl bg-rose-600 shadow-lg shadow-rose-500/20">
                                <ShieldAlert className="size-5 text-white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-[20px] font-black tracking-tight text-[#0A2540] dark:text-white leading-none">
                                    Record Resident Complaint
                                </h1>
                                <p className="text-[12px] text-neutral-400 font-bold tracking-wide uppercase mt-1.5">
                                    Manual entry for grievances received via office or phone
                                </p>
                            </div>
                        </div>
                        <Link href="/admin/complaints">
                            <Button variant="outline" className="h-9 gap-2 rounded-lg text-[12px] font-bold text-neutral-500 border-neutral-200">
                                <ArrowLeft className="size-3.5" /> Back to List
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* ─── SCROLLABLE FORM ─── */}
                <form onSubmit={submit} className="flex-1 overflow-y-auto">
                    <div className="px-12 py-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
                            
                            {/* COLUMN 1: COMPLAINT DETAILS */}
                            <div className="space-y-8">
                                <SectionHeader 
                                    icon={MessageSquare} 
                                    title="Ticket Details" 
                                    description="Core information about the grievance."
                                />
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400 text-neutral-400">Subject <span className="text-red-500">*</span></Label>
                                        <Input 
                                            value={data.subject} 
                                            onChange={e => setData('subject', e.target.value)} 
                                            placeholder="Briefly describe the issue..." 
                                            className="h-10 rounded-xl text-[14px] font-bold border-neutral-200" 
                                        />
                                        {errors.subject && <p className="text-[10px] font-bold text-red-500">⚠ {errors.subject}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400 text-neutral-400">Resident / Complainant <span className="text-red-500">*</span></Label>
                                        <select 
                                            value={data.resident_id} 
                                            onChange={e => setData('resident_id', e.target.value)}
                                            className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-[13px] font-bold dark:bg-neutral-900 focus:ring-2 focus:ring-rose-500/20"
                                        >
                                            <option value="">Select Resident...</option>
                                            {residents.map(r => (
                                                <option key={r.id} value={r.id}>{r.name}</option>
                                            ))}
                                        </select>
                                        {errors.resident_id && <p className="text-[10px] font-bold text-red-500">⚠ {errors.resident_id}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400 text-neutral-400">Full Description <span className="text-red-500">*</span></Label>
                                        <textarea 
                                            value={data.description} 
                                            onChange={e => setData('description', e.target.value)}
                                            rows={8}
                                            placeholder="Provide as much detail as possible..."
                                            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[14px] font-bold dark:bg-neutral-900 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                                        />
                                        {errors.description && <p className="text-[10px] font-bold text-red-500">⚠ {errors.description}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* COLUMN 2: CLASSIFICATION & ASSIGNMENT */}
                            <div className="space-y-8">
                                <SectionHeader 
                                    icon={Settings} 
                                    title="Classification" 
                                    description="Categorize and assign for resolution."
                                />
                                <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Category</Label>
                                        <select value={data.category} onChange={e => setData('category', e.target.value)} className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-[13px] font-bold dark:bg-neutral-900 focus:ring-2 focus:ring-rose-500/20">
                                            <option value="maintenance">Maintenance</option>
                                            <option value="noise">Noise</option>
                                            <option value="security">Security</option>
                                            <option value="pets">Pets</option>
                                            <option value="others">Others</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Status</Label>
                                        <select value={data.status} onChange={e => setData('status', e.target.value)} className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-[13px] font-bold dark:bg-neutral-900 focus:ring-2 focus:ring-rose-500/20">
                                            <option value="pending">Pending</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="resolved">Resolved</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2 space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Assign To Staff</Label>
                                        <select value={data.assigned_to} onChange={e => setData('assigned_to', e.target.value)} className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-[13px] font-bold dark:bg-neutral-900 focus:ring-2 focus:ring-rose-500/20">
                                            <option value="">Unassigned</option>
                                            {staff.map(s => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-span-2 space-y-4 pt-4">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Evidence / Attachment</Label>
                                        <div className="p-8 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/40 flex flex-col items-center justify-center gap-3 relative group hover:border-rose-400/50 cursor-pointer overflow-hidden transition-all">
                                            <input 
                                                type="file" 
                                                onChange={e => setData('image', e.target.files ? e.target.files[0] : null)}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                accept="image/*"
                                            />
                                            <div className="size-10 rounded-full bg-white dark:bg-neutral-800 shadow-sm flex items-center justify-center text-neutral-400 group-hover:text-rose-500 transition-colors">
                                                <ImageIcon className="size-5" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[12px] font-bold text-neutral-600 dark:text-neutral-300">
                                                    {data.image ? (data.image as any).name : 'Click to select image file'}
                                                </p>
                                                <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">PNG, JPG up to 5MB</p>
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
                            <p className="text-[12px] font-bold uppercase tracking-wider">Required fields marked with *</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href="/admin/complaints">
                                <Button type="button" variant="ghost" className="h-10 rounded-xl px-6 text-[13px] font-black text-neutral-500 hover:bg-neutral-50">
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                onClick={submit}
                                disabled={processing}
                                className="h-10 rounded-xl px-8 text-[13px] font-black bg-rose-600 hover:bg-rose-700 text-white shadow-xl shadow-rose-600/20 transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {processing ? 'Recording...' : 'Create Ticket'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

ComplaintCreate.layout = (page: any) => ({
    children: page,
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Complaints', href: '/admin/complaints' },
        { title: 'Record Ticket', href: '/admin/complaints/create' },
    ],
});
