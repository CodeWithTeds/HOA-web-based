import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    ShieldAlert, Plus, AlertCircle, CheckCircle2, Clock, X,
    Upload, Tag, FileText, LayoutList, Loader2, Info, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import Swal from 'sweetalert2';

const fontStack = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif';

const CATEGORIES = ['maintenance', 'noise', 'security', 'pets', 'others'];
const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

const statusConfig: Record<string, { label: string; className: string }> = {
    pending:     { label: 'Pending',     className: 'bg-amber-50 text-amber-700 border-amber-200' },
    in_progress: { label: 'In Progress', className: 'bg-blue-50 text-blue-700 border-blue-200' },
    resolved:    { label: 'Resolved',    className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    closed:      { label: 'Closed',      className: 'bg-neutral-100 text-neutral-600 border-neutral-200' },
};

const priorityConfig: Record<string, { className: string }> = {
    low:    { className: 'bg-neutral-100 text-neutral-600' },
    medium: { className: 'bg-amber-50 text-amber-700' },
    high:   { className: 'bg-orange-50 text-orange-700' },
    urgent: { className: 'bg-rose-50 text-rose-700' },
};

export default function ResidentComplaints() {
    const { complaints, flash, residentNotLinked } = usePage<any>().props;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        subject: '',
        description: '',
        category: 'maintenance',
        priority: 'medium',
        image: null as File | null,
    });

    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                icon: 'success',
                title: 'Complaint Submitted!',
                text: flash.success,
                confirmButtonColor: '#e11d48',
                confirmButtonText: 'OK',
                background: '#ffffff',
                customClass: { popup: 'rounded-3xl shadow-2xl' },
            });
            setIsDialogOpen(false);
            reset();
            setPreviewUrl(null);
        }
    }, [flash]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('image', file);
        setPreviewUrl(file ? URL.createObjectURL(file) : null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/complaints', { forceFormData: true, preserveScroll: true });
    };

    const handleOpen = () => {
        clearErrors();
        reset();
        setPreviewUrl(null);
        setIsDialogOpen(true);
    };

    return (
        <>
            <Head title="My Complaints | Resident Portal" />

            <div className="flex h-full flex-1 flex-col gap-0 animate-in fade-in duration-700" style={{ fontFamily: fontStack }}>

                {/* ─── HERO HEADER ─── */}
                <div className="relative overflow-hidden rounded-3xl bg-neutral-900 p-8 md:p-12 text-white shadow-2xl mx-4 mt-4">
                    <div className="absolute top-0 right-0 -mt-16 -mr-16 h-56 w-56 rounded-full bg-rose-600/20 blur-3xl" />
                    <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-56 w-56 rounded-full bg-orange-500/15 blur-3xl" />
                    <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="flex items-center justify-center size-14 rounded-2xl bg-rose-600 shadow-2xl shadow-rose-600/30">
                                <ShieldAlert className="size-7 text-white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <Badge variant="outline" className="mb-2 bg-white/10 text-white border-white/20 text-[10px] uppercase tracking-widest font-bold">
                                    Resident Portal
                                </Badge>
                                <h1 className="text-3xl font-black tracking-tight leading-none">My Complaints</h1>
                                <p className="text-sm text-neutral-400 mt-1 font-medium">Submit and track your grievances &amp; service requests</p>
                            </div>
                        </div>
                        <Button
                            onClick={handleOpen}
                            disabled={!!residentNotLinked}
                            className="shrink-0 h-11 gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black px-6 shadow-xl shadow-rose-600/30 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            <Plus className="size-4" strokeWidth={3} /> File a Complaint
                        </Button>
                    </div>
                </div>

                {/* ─── NOT LINKED WARNING ─── */}
                {residentNotLinked && (
                    <div className="mx-4 mt-4 flex items-center gap-4 rounded-2xl bg-red-50 border border-red-200 p-5">
                        <AlertCircle className="size-6 text-red-500 shrink-0" />
                        <div>
                            <p className="text-sm font-black text-red-700">Account Not Linked</p>
                            <p className="text-xs text-red-600/80 mt-0.5">Your login is not linked to a resident profile. Contact the HOA office to enable complaints.</p>
                        </div>
                    </div>
                )}

                {/* ─── CONTENT TABLE ─── */}
                <div className="flex-1 flex flex-col rounded-2xl bg-white dark:bg-[#0c0c0c] mx-4 my-4 shadow-sm border border-neutral-100 dark:border-neutral-800 overflow-hidden">

                    {/* Table header */}
                    <div className="shrink-0 px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/40 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-neutral-400">
                            <LayoutList className="size-4" />
                            <span className="text-[12px] font-black uppercase tracking-widest">
                                Ticket History — {complaints?.meta?.total ?? 0} Total
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto">
                        <table className="w-full border-collapse min-w-[700px]">
                            <thead className="sticky top-0 z-10 bg-neutral-50/90 dark:bg-neutral-900/90 backdrop-blur-md">
                                <tr>
                                    {['#', 'Subject & Category', 'Priority', 'Status', 'Filed On'].map(h => (
                                        <th key={h} className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-800">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800/60">
                                {!complaints?.data?.length ? (
                                    <tr>
                                        <td colSpan={5} className="py-24 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-30">
                                                <ShieldAlert className="size-16 text-neutral-400" strokeWidth={1} />
                                                <p className="text-[14px] font-black text-neutral-400 uppercase tracking-widest">No complaints filed yet</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    complaints.data.map((c: any) => {
                                        const status = statusConfig[c.status] ?? { label: c.status, className: 'bg-neutral-100 text-neutral-600' };
                                        const priority = priorityConfig[c.priority] ?? { className: 'bg-neutral-100 text-neutral-500' };
                                        return (
                                            <tr key={c.id} className="group hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors">
                                                <td className="px-6 py-4 text-[13px] font-black text-neutral-400">#{c.id}</td>
                                                <td className="px-6 py-4 max-w-[320px]">
                                                    <p className="text-[13px] font-bold text-[#0A2540] dark:text-neutral-200 line-clamp-1">{c.subject}</p>
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded mt-1 inline-block">
                                                        {c.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={cn('text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full', priority.className)}>
                                                        {c.priority}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={cn('text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border', status.className)}>
                                                        {status.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-[12px] font-medium text-neutral-400">
                                                    {new Date(c.created_at).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {(complaints?.meta?.links?.length ?? 0) > 3 && (
                        <div className="shrink-0 px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-2">
                            {complaints.meta.links.map((link: any, i: number) => (
                                <Button
                                    key={i}
                                    variant={link.active ? 'default' : 'outline'}
                                    disabled={!link.url}
                                    onClick={() => router.get(link.url)}
                                    className={cn('h-8 min-w-[32px] rounded-lg text-[11px] font-black', link.active ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20 border-rose-600' : 'text-neutral-500')}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ─── CREATE COMPLAINT DIALOG ─── */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[860px] rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl bg-white dark:bg-neutral-900 grid grid-cols-1 md:grid-cols-5">

                    {/* Left Panel */}
                    <div className="md:col-span-2 bg-neutral-900 p-8 text-white relative flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-600/20 rounded-full blur-3xl -mr-10 -mt-10" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/15 rounded-full blur-3xl -ml-10 -mb-10" />
                        <div className="relative z-10">
                            <Badge variant="outline" className="mb-4 bg-white/10 text-white border-white/20 text-[10px] uppercase tracking-widest font-bold">
                                Grievance Ticket
                            </Badge>
                            <DialogHeader>
                                <DialogTitle className="text-3xl font-black tracking-tight text-white leading-tight">
                                    File a Complaint
                                </DialogTitle>
                            </DialogHeader>
                            <p className="text-neutral-400 text-sm mt-3 font-medium leading-relaxed">
                                All complaints are reviewed by the HOA management team. Please provide clear and accurate details to help us resolve your concern quickly.
                            </p>
                            <div className="mt-8 space-y-4">
                                {[
                                    { icon: Clock, label: 'Response Time', value: 'Within 24–48 hours' },
                                    { icon: Eye, label: 'Visibility', value: 'Admin-only (private)' },
                                ].map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="flex items-center gap-3">
                                        <div className="rounded-xl bg-white/10 p-2 border border-white/10">
                                            <Icon className="size-4 text-rose-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-black text-neutral-400 tracking-wider">{label}</p>
                                            <p className="text-sm font-bold">{value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative z-10 mt-8 pt-6 border-t border-white/10">
                            <p className="text-xs text-neutral-400 italic">* False or malicious complaints may be subject to sanctions per the HOA community guidelines.</p>
                        </div>
                    </div>

                    {/* Right Form Panel */}
                    <form onSubmit={handleSubmit} className="md:col-span-3 flex flex-col bg-white dark:bg-[#0c0c0c] max-h-[85vh]" encType="multipart/form-data" style={{ fontFamily: fontStack }}>

                        {/* Form Header */}
                        <div className="shrink-0 px-8 py-5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/40">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center size-10 rounded-xl bg-rose-600 shadow-lg shadow-rose-500/20">
                                    <ShieldAlert className="size-5 text-white" strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h2 className="text-[18px] font-black tracking-tight text-[#0A2540] dark:text-white">New Complaint</h2>
                                    <p className="text-[11px] text-neutral-400 font-bold tracking-wide uppercase mt-0.5">Resident Grievance Form</p>
                                </div>
                            </div>
                        </div>

                        {/* Scrollable Body */}
                        <div className="flex-1 overflow-y-auto px-8 py-7 space-y-6">

                            {/* Subject */}
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-black uppercase text-neutral-400 tracking-wider">
                                    Complaint Subject <span className="text-rose-500">*</span>
                                </Label>
                                <Input
                                    value={data.subject}
                                    onChange={e => setData('subject', e.target.value)}
                                    placeholder="e.g. Loud music from Unit 4B at midnight"
                                    className="h-10 rounded-xl text-[13px] font-semibold border-neutral-200 dark:border-neutral-700"
                                />
                                {errors.subject && <p className="text-[11px] font-bold text-rose-500">⚠ {errors.subject}</p>}
                            </div>

                            {/* Category & Priority */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-black uppercase text-neutral-400 tracking-wider">
                                        Category <span className="text-rose-500">*</span>
                                    </Label>
                                    <select
                                        value={data.category}
                                        onChange={e => setData('category', e.target.value)}
                                        className="w-full h-10 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500/30"
                                    >
                                        {CATEGORIES.map(c => (
                                            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                                        ))}
                                    </select>
                                    {errors.category && <p className="text-[11px] font-bold text-rose-500">⚠ {errors.category}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-black uppercase text-neutral-400 tracking-wider">
                                        Priority <span className="text-rose-500">*</span>
                                    </Label>
                                    <select
                                        value={data.priority}
                                        onChange={e => setData('priority', e.target.value)}
                                        className="w-full h-10 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500/30"
                                    >
                                        {PRIORITIES.map(p => (
                                            <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                                        ))}
                                    </select>
                                    {errors.priority && <p className="text-[11px] font-bold text-rose-500">⚠ {errors.priority}</p>}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-black uppercase text-neutral-400 tracking-wider">
                                    Detailed Description <span className="text-rose-500">*</span>
                                </Label>
                                <textarea
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    rows={4}
                                    placeholder="Describe the issue in detail — include date, time, location, and any relevant context..."
                                    className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-[13px] font-medium focus:outline-none focus:ring-4 focus:ring-rose-500/5 transition-all resize-none"
                                />
                                {errors.description && <p className="text-[11px] font-bold text-rose-500">⚠ {errors.description}</p>}
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-black uppercase text-neutral-400 tracking-wider">
                                    Attach Evidence (Optional)
                                </Label>
                                <label className="flex flex-col items-center justify-center w-full h-28 rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-700 cursor-pointer hover:border-rose-400 hover:bg-rose-50/30 transition-all group">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="preview" className="h-full w-full object-cover rounded-2xl" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-1 text-neutral-400 group-hover:text-rose-500 transition-colors">
                                            <Upload className="size-6" />
                                            <p className="text-[12px] font-bold">Click to upload an image</p>
                                            <p className="text-[10px] text-neutral-400">PNG, JPG, JPEG up to 5MB</p>
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                </label>
                                {errors.image && <p className="text-[11px] font-bold text-rose-500">⚠ {errors.image}</p>}
                            </div>

                            {/* Info notice */}
                            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 flex gap-3">
                                <Info className="size-4 text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-[11px] font-bold text-amber-800 dark:text-amber-400 leading-relaxed">
                                    <span className="uppercase tracking-wider text-[10px] block mb-1">Please Note</span>
                                    Your complaint will be logged under your resident profile and reviewed by HOA management. You will be notified of status changes.
                                </p>
                            </div>
                        </div>

                        {/* Sticky Footer */}
                        <div className="shrink-0 bg-white dark:bg-[#0c0c0c] border-t border-neutral-100 dark:border-neutral-800 px-8 py-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-neutral-400">
                                    <Info className="size-4" />
                                    <p className="text-[12px] font-bold uppercase tracking-wider">Submitted confidentially</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setIsDialogOpen(false)}
                                        className="h-10 rounded-xl px-6 text-[13px] font-black text-neutral-500 hover:bg-neutral-50"
                                    >
                                        Discard
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="h-10 rounded-xl px-8 text-[13px] font-black bg-rose-600 hover:bg-rose-700 text-white shadow-xl shadow-rose-600/20 flex items-center gap-2"
                                    >
                                        {processing ? <><Loader2 className="size-4 animate-spin" /> Submitting...</> : 'Submit Complaint'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

ResidentComplaints.layout = {
    breadcrumbs: [
        { title: 'My Complaints', href: '/complaints' },
    ],
};
