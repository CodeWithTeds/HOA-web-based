import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    UserPlus,
    Mail,
    Phone,
    MapPin,
    Calendar,
    User,
    ShieldAlert,
    Info,
    Home,
    Smartphone,
    Languages,
    HeartPulse,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SweetAlert } from '@/components/ui/sweet-alert';

const fontStack = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif';

interface StreetUnitOption {
    value: string;
    label: string;
    street: string;
    unit: string | null;
}

export default function ResidentCreate({ streetOptions = [], unitOptions = [], addressOptions = [] }: { streetOptions?: string[]; unitOptions?: string[]; addressOptions?: StreetUnitOption[] }) {
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

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        // Personal Info
        first_name: '',
        middle_name: '',
        last_name: '',
        suffix: '',
        gender: '',
        birth_date: '',
        civil_status: '',
        nationality: 'Filipino',

        // Contact Info
        mobile_number: '',
        alternate_number: '',
        email: '',

        // Residency Details
        phase: '',
        block: '',
        lot: '',
        street: '',
        unit: '',
        resident_type: 'Owner',
        move_in_date: new Date().toISOString().split('T')[0],

        // Emergency Contact
        emergency_contact_name: '',
        emergency_contact_number: '',

        // Status
        status: 'Active',
        remarks: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/residents', {
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
            {/* Subtle left accent bar */}
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
            <Head title="Add New Resident" />
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
                                <UserPlus className="size-5 text-white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-[20px] font-black tracking-tight text-[#0A2540] dark:text-white">
                                    New Resident Enrollment
                                </h1>
                                <p className="text-[12px] text-neutral-400 font-bold tracking-wide uppercase mt-0.5">
                                    Add a new community member to the registry
                                </p>
                            </div>
                        </div>
                        <Link href="/admin/residents">
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
                            
                            {/* COLUMN 1: IDENTITY */}
                            <div className="space-y-6">
                                <SectionHeader 
                                    icon={User} 
                                    title="Identity" 
                                    description="Legal name and basic identity details."
                                />
                                <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">First Name <span className="text-red-500">*</span></Label>
                                        <Input value={data.first_name} onChange={e => setData('first_name', e.target.value)} placeholder="e.g. Juan" className="h-9 rounded-lg text-[13px] font-bold" />
                                        {errors.first_name && <p className="text-[10px] font-bold text-red-500">⚠ {errors.first_name}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Middle Name</Label>
                                        <Input value={data.middle_name} onChange={e => setData('middle_name', e.target.value)} placeholder="e.g. Santos" className="h-9 rounded-lg text-[13px] font-bold" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Last Name <span className="text-red-500">*</span></Label>
                                        <Input value={data.last_name} onChange={e => setData('last_name', e.target.value)} placeholder="e.g. Dela Cruz" className="h-9 rounded-lg text-[13px] font-bold" />
                                        {errors.last_name && <p className="text-[10px] font-bold text-red-500">⚠ {errors.last_name}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px) font-black uppercase text-neutral-400">Suffix</Label>
                                        <Input value={data.suffix} onChange={e => setData('suffix', e.target.value)} placeholder="e.g. Jr." className="h-9 rounded-lg text-[13px] font-bold" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Gender</Label>
                                        <select value={data.gender} onChange={e => setData('gender', e.target.value)} className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 text-[13px] font-bold dark:bg-neutral-900 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Birth Date</Label>
                                        <Input type="date" value={data.birth_date} onChange={e => setData('birth_date', e.target.value)} className="h-9 rounded-lg text-[13px] font-bold" />
                                    </div>
                                </div>
                            </div>

                            {/* COLUMN 2: CONTACT */}
                            <div className="space-y-6">
                                <SectionHeader 
                                    icon={Smartphone} 
                                    title="Contact" 
                                    description="Primary communication channels."
                                />
                                <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                                    <div className="col-span-2 space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Mobile Number</Label>
                                        <Input value={data.mobile_number} onChange={e => setData('mobile_number', e.target.value)} placeholder="0912..." className="h-9 rounded-lg text-[13px] font-bold" />
                                    </div>
                                    <div className="col-span-2 space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Email Address</Label>
                                        <Input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="alex@example.com" className="h-9 rounded-lg text-[13px] font-bold" />
                                        {errors.email && <p className="text-[10px] font-bold text-red-500">⚠ {errors.email}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Nationality</Label>
                                        <Input value={data.nationality} onChange={e => setData('nationality', e.target.value)} className="h-9 rounded-lg text-[13px) font-bold" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Civil Status</Label>
                                        <select value={data.civil_status} onChange={e => setData('civil_status', e.target.value)} className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 text-[13px] font-bold dark:bg-neutral-900 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                                            <option value="">Select Status</option>
                                            <option value="Single">Single</option>
                                            <option value="Married">Married</option>
                                            <option value="Widowed">Widowed</option>
                                            <option value="Separated">Separated</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-2 h-px bg-neutral-100 dark:bg-neutral-800/60 my-2" />

                            {/* COLUMN 3: ADDRESS */}
                            <div className="space-y-6">
                                <SectionHeader 
                                    icon={Home} 
                                    title="Address" 
                                    description="Physical location in the community."
                                />
                                {errors.phase && (
                                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-bold text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400">
                                        {errors.phase}
                                    </div>
                                )}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Phase</Label>
                                        <Input value={data.phase} onChange={e => setData('phase', e.target.value)} placeholder="P1" className="h-9 rounded-lg text-[13px] font-bold text-center" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Block</Label>
                                        <Input value={data.block} onChange={e => setData('block', e.target.value)} placeholder="B12" className="h-9 rounded-lg text-[13px] font-bold text-center" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Lot</Label>
                                        <Input value={data.lot} onChange={e => setData('lot', e.target.value)} placeholder="L5" className="h-9 rounded-lg text-[13px] font-bold text-center" />
                                    </div>
                                    <div className="col-span-2 space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Street Name</Label>
                                        <select
                                            value={String(data.street)}
                                            onChange={e => setData('street', e.target.value)}
                                            className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 text-[13px] font-bold dark:bg-neutral-900 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        >
                                            <option value="">Select Street</option>
                                            {streetOptions.map((s) => (
                                                <option key={s} value={String(s)}>{String(s)}</option>
                                            ))}
                                        </select>
                                        {errors.street && <p className="text-[10px] font-bold text-red-500">⚠ {errors.street}</p>}
                                    </div>
                                    <div className="col-span-1 space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Unit / Street Unit</Label>
                                        <select
                                            value={String(data.unit ?? '')}
                                            onChange={e => setData('unit', e.target.value)}
                                            className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 text-[13px] font-bold dark:bg-neutral-900 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        >
                                            <option value="">Select Unit</option>
                                            {unitOptions.map((u) => (
                                                <option key={u} value={String(u)}>{String(u)}</option>
                                            ))}
                                        </select>
                                        {errors.unit && <p className="text-[10px] font-bold text-red-500">⚠ {errors.unit}</p>}
                                    </div>
                                    {/* Composite Street/Unit dropdown from existing records */}
                                    {addressOptions.length > 0 && (
                                        <div className="col-span-3 space-y-1.5">
                                            <Label className="text-[11px] font-black uppercase text-neutral-400">Existing Street/Unit Records</Label>
                                            <select
                                                value={data.street ? `${data.street}${data.unit ? '|' + data.unit : ''}` : ''}
                                                onChange={e => {
                                                    const val = e.target.value;
                                                    if (!val) return;
                                                    const [s, u] = val.split('|');
                                                    setData('street', String(s));
                                                    setData('unit', u ? String(u) : '');
                                                }}
                                                className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 text-[13px] font-bold dark:bg-neutral-900 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                            >
                                                <option value="">— Select Existing Street/Unit —</option>
                                                {addressOptions.map((opt) => (
                                                    <option key={opt.value} value={String(opt.value)}>{String(opt.label)}</option>
                                                ))}
                                            </select>
                                            <p className="text-[10px] font-bold text-neutral-400">Select an existing Street/Unit instead of typing. Values are handled as text/string.</p>
                                        </div>
                                    )}
                                    <div className="col-span-2 space-y-1.5">
                                        <Label className="text-[11px) font-black uppercase text-neutral-400">Resident Type <span className="text-red-500">*</span></Label>
                                        <select 
                                            value={data.resident_type} 
                                            onChange={e => setData('resident_type', e.target.value)}
                                            className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 text-[13px] font-bold dark:bg-neutral-900 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        >
                                            <option value="Owner">Owner</option>
                                            <option value="Tenant">Tenant</option>
                                            <option value="Family Member">Family Member</option>
                                            <option value="Helper">Helper</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* COLUMN 4: EMERGENCY & ADMIN */}
                            <div className="space-y-10">
                                <div className="space-y-6">
                                    <SectionHeader 
                                        icon={HeartPulse} 
                                        title="Emergency" 
                                        description="Critical contact information."
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 space-y-1.5">
                                            <Label className="text-[11px] font-black uppercase text-neutral-400">Contact Person Name</Label>
                                            <Input value={data.emergency_contact_name} onChange={e => setData('emergency_contact_name', e.target.value)} placeholder="Full Name" className="h-9 rounded-lg text-[13px] font-bold" />
                                        </div>
                                        <div className="col-span-2 space-y-1.5">
                                            <Label className="text-[11px] font-black uppercase text-neutral-400">Contact Number</Label>
                                            <Input value={data.emergency_contact_number} onChange={e => setData('emergency_contact_number', e.target.value)} placeholder="0911..." className="h-9 rounded-lg text-[13px) font-bold" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <SectionHeader 
                                        icon={ShieldAlert} 
                                        title="System" 
                                        description="Administrative status defaults."
                                    />
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Registry Status <span className="text-red-500">*</span></Label>
                                        <select value={data.status} onChange={e => setData('status', e.target.value)} className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 text-[13px] font-bold dark:bg-neutral-900 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                                            <option value="Active">Active</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Inactive">Inactive</option>
                                            <option value="Blacklisted">Blacklisted</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-2 space-y-3">
                                <Label className="text-[11px] font-black uppercase text-neutral-400 flex items-center gap-2">
                                    <Info className="size-3 text-blue-500" /> Additional Registry Remarks
                                </Label>
                                <textarea 
                                    value={data.remarks} 
                                    onChange={e => setData('remarks', e.target.value)}
                                    rows={2}
                                    placeholder="Add any specific notes about this resident enrollment..."
                                    className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-[13px] font-bold dark:bg-neutral-900 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
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
                            <Link href="/admin/residents">
                                <Button type="button" variant="ghost" className="h-10 rounded-xl px-6 text-[13px] font-black text-neutral-500 hover:bg-neutral-50">
                                    Discard
                                </Button>
                            </Link>
                            <Button
                                onClick={submit}
                                disabled={processing}
                                className="h-10 rounded-xl px-8 text-[13px] font-black bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {processing ? 'Enrolling...' : 'Confirm Enrollment'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

ResidentCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Resident Management', href: '/admin/residents' },
        { title: 'New Resident', href: '/admin/residents/create' },
    ],
};
