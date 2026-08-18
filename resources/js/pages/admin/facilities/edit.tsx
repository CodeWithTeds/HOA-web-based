import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Box,
    Users,
    DollarSign,
    Info,
    LayoutGrid,
    ShieldAlert,
    Image as ImageIcon,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SweetAlert } from '@/components/ui/sweet-alert';

const fontStack = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif';

export default function FacilityEdit({ facility }: { facility: any }) {
    const { flash } = usePage<any>().props;
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
            setAlert({ show: true, type: 'error', title: 'Operation Failed', message: flash.error });
        }
    }, [flash?.success, flash?.error]);

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: facility.name || '',
        description: facility.description || '',
        capacity: facility.capacity || 0,
        base_price: facility.base_price || 0,
        price_type: facility.price_type || 'Flat rate',
        status: facility.status || 'Active',
        image: null as File | null,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(facility.image_path || null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Use post with _method: 'PUT' for multipart/form-data compatibility with Laravel PUT
        post(`/admin/facilities/${facility.id}`, {
            forceFormData: true,
            onError: () => {
                setAlert({
                    show: true,
                    type: 'error',
                    title: 'Validation Failed',
                    message: 'Please review the highlighted fields and try again.',
                });
            },
        });
    };

    const SectionHeader = ({ icon: Icon, title, description }: any) => (
        <div className="flex items-start gap-4 mb-6 relative pl-4">
            <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-blue-600/30 dark:bg-blue-400/20 rounded-full" />
            <div className="flex items-center justify-center size-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shrink-0">
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
            <Head title={`Edit ${facility.name}`} />
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
                            <div className="flex items-center justify-center size-10 rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20">
                                <Box className="size-5 text-white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-[20px] font-black tracking-tight text-[#0A2540] dark:text-white">
                                    Edit {facility.name}
                                </h1>
                                <p className="text-[12px] text-neutral-400 font-bold tracking-wide uppercase mt-0.5">
                                    Update facility details and commercials
                                </p>
                            </div>
                        </div>
                        <Link href="/admin/facilities">
                            <Button variant="outline" className="h-9 gap-2 rounded-lg text-[12px] font-bold text-neutral-500 border-neutral-200">
                                <ArrowLeft className="size-3.5" /> Back to List
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* ─── SCROLLABLE FORM ─── */}
                <form onSubmit={submit} className="flex-1 overflow-y-auto">
                    <div className="px-12 py-10 max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                            
                            {/* COLUMN 1: BASIS INFO */}
                            <div className="space-y-8">
                                <SectionHeader 
                                    icon={LayoutGrid} 
                                    title="Facility Identity" 
                                    description="Primary details and branding of the asset."
                                />
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Official Name <span className="text-red-500">*</span></Label>
                                        <Input value={data.name} onChange={e => setData('name', e.target.value)} placeholder="e.g. Grand Clubhouse" className="h-10 rounded-xl text-[13px] font-black border-neutral-200 focus:ring-blue-500/10" />
                                        {errors.name && <p className="text-[10px] font-bold text-red-500">⚠ {errors.name}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Description & Rules</Label>
                                        <textarea 
                                            value={data.description} 
                                            onChange={e => setData('description', e.target.value)}
                                            rows={4}
                                            placeholder="Provide a detailed description of the facility, including operating hours and house rules..."
                                            className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[13px] font-bold dark:bg-neutral-900 dark:border-neutral-800 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all"
                                        />
                                    </div>

                                    <div className="p-6 rounded-2xl border-2 border-dashed border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
                                        <div className="flex flex-col items-center justify-center gap-3 text-center">
                                            {imagePreview ? (
                                                <div className="relative size-32 rounded-2xl overflow-hidden border border-neutral-200">
                                                    <img src={imagePreview} className="w-full h-full object-cover" />
                                                    <button 
                                                        type="button" 
                                                        onClick={() => {
 setImagePreview(null); setData('image', null); 
}}
                                                        className="absolute top-1 right-1 size-6 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px]"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="size-12 rounded-2xl bg-white dark:bg-neutral-800 shadow-sm border border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
                                                    <ImageIcon className="size-6 text-neutral-300" strokeWidth={1.5} />
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-[13px] font-black text-[#0A2540] dark:text-neutral-200">Facility Cover Image</p>
                                                <p className="text-[11px] text-neutral-400 font-bold mt-1 max-w-[200px]">Optimal size: 1200x800px. PNG, JPG supported.</p>
                                            </div>
                                            <input 
                                                type="file" 
                                                id="facility-image" 
                                                className="hidden" 
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                onClick={() => document.getElementById('facility-image')?.click()}
                                                className="h-8 text-[11px] font-black rounded-lg border-neutral-200 hover:bg-white active:scale-95 transition-all"
                                            >
                                                {data.image || facility.image_path ? 'Change Asset' : 'Upload Asset'}
                                            </Button>
                                            {errors.image && <p className="text-[10px] font-bold text-red-500">⚠ {errors.image}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* COLUMN 2: SPECS & PRICING */}
                            <div className="space-y-8">
                                <div className="space-y-6">
                                    <SectionHeader 
                                        icon={Users} 
                                        title="Specifcations" 
                                        description="Usage constraints and capacity."
                                    />
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Maximum Capacity (People) <span className="text-red-500">*</span></Label>
                                        <Input type="number" value={data.capacity} onChange={e => setData('capacity', parseInt(e.target.value))} className="h-10 rounded-xl text-[13px] font-black border-neutral-200 focus:ring-blue-500/10" />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <SectionHeader 
                                        icon={DollarSign} 
                                        title="Commercials" 
                                        description="Rental rates and billing logic."
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-[11px] font-black uppercase text-neutral-400">Base Price <span className="text-red-500">*</span></Label>
                                            <div className="relative">
                                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] font-black text-blue-600">₱</span>
                                                <Input type="number" value={data.base_price} onChange={e => setData('base_price', parseFloat(e.target.value))} className="h-10 pl-8 rounded-xl text-[13px] font-black border-neutral-200 focus:ring-blue-500/10" />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[11px) font-black uppercase text-neutral-400">Pricing Logic</Label>
                                            <select 
                                                value={data.price_type} 
                                                onChange={e => setData('price_type', e.target.value)}
                                                className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-[13px] font-black dark:bg-neutral-900 dark:border-neutral-800 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all appearance-none"
                                            >
                                                <option value="Flat rate">Flat Rate (One-time)</option>
                                                <option value="Hourly">Hourly Rate</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <SectionHeader 
                                        icon={ShieldAlert} 
                                        title="Governance" 
                                        description="Visibility and health status."
                                    />
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Operational Status</Label>
                                        <select 
                                            value={data.status} 
                                            onChange={e => setData('status', e.target.value)}
                                            className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-[13px] font-black dark:bg-neutral-900 dark:border-neutral-800 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all appearance-none"
                                        >
                                            <option value="Active">Operational / Available</option>
                                            <option value="Under Maintenance">Maintenance (Read-only)</option>
                                            <option value="Deactivated">Deactivated (Archived)</option>
                                        </select>
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
                            <Link href="/admin/facilities">
                                <Button type="button" variant="ghost" className="h-10 rounded-xl px-6 text-[13px] font-black text-neutral-500 hover:bg-neutral-50">
                                    Discard
                                </Button>
                            </Link>
                            <Button
                                onClick={submit}
                                disabled={processing}
                                className="h-10 rounded-xl px-8 text-[13px] font-black bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {processing ? 'Updating...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

FacilityEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Facilities', href: '/admin/facilities' },
        { title: 'Edit Facility', href: '/admin/facilities/edit' },
    ],
};
