import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    CalendarDays,
    Info,
    Receipt,
    Wallet,
    ShieldAlert,
    Clock,
    Search,
    Users,
    CheckSquare,
    UserCircle,
    MapPin,
    Loader2,
} from 'lucide-react';
import { useState, useMemo, useEffect, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SweetAlert } from '@/components/ui/sweet-alert';

const fontStack = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif';

interface Resident {
    id: number;
    first_name: string;
    last_name: string;
    phase: string;
    block: string;
    lot: string;
}

export default function BillingPeriodCreate({ residents }: { residents: Resident[] }) {
    const { flash } = usePage<any>().props;
    const [searchTerm, setSearchTerm] = useState('');
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

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        amount: '',
        start_date: '',
        end_date: '',
        due_date: '',
        resident_ids: [] as number[],
    });

    const filteredResidents = useMemo(() => {
        return residents.filter(r => 
            `${r.first_name} ${r.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [residents, searchTerm]);

    const toggleResident = (id: number) => {
        setData('resident_ids', 
            data.resident_ids.includes(id) 
                ? data.resident_ids.filter(rid => rid !== id)
                : [...data.resident_ids, id]
        );
    };

    const toggleAll = () => {
        if (data.resident_ids.length === residents.length) {
            setData('resident_ids', []);
        } else {
            setData('resident_ids', residents.map(r => r.id));
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/billing/periods', {
            onError: () => {
                setAlert({
                    show: true,
                    type: 'error',
                    title: 'Configuration Error',
                    message: 'Please verify the dates and ensure correct resident selection.',
                });
            },
        });
    };

    return (
        <>
            <Head title="Create Billing Period" />
            <SweetAlert
                type={alert.type}
                title={alert.title}
                message={alert.message}
                show={alert.show}
                onClose={() => setAlert(prev => ({ ...prev, show: false }))}
            />

            <div
                className="flex h-full flex-1 flex-col rounded-2xl bg-white dark:bg-[#0c0c0c] text-[#0A2540] dark:text-neutral-100 overflow-hidden relative shadow-2xl shadow-black/5"
                style={{ fontFamily: fontStack }}
            >
                {/* REMOVED HEAVY OVERLAY TO PREVENT UI JOLT */}

                {/* ─── HEADER ─── */}
                <div className="shrink-0 px-8 py-6 border-b border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/30 dark:bg-neutral-900/40">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center size-10 rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20">
                                <Receipt className="size-5 text-white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-[20px] font-black tracking-tight text-[#0A2540] dark:text-white leading-none">Initiate Billing Cycle</h1>
                                <p className="text-[12px] text-neutral-400 font-bold tracking-wide uppercase mt-1.5">Configuration and Selective Resident Billing</p>
                            </div>
                        </div>
                        <Link href="/admin/billing">
                            <Button variant="outline" className="h-9 gap-2 rounded-lg text-[12px] font-bold text-neutral-500 border-neutral-200">
                                <ArrowLeft className="size-3.5" /> Back to Registry
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* ─── MAIN CONTENT ─── */}
                <div className="flex-1 flex overflow-hidden">
                    
                    {/* LEFT PANEL: RESIDENT SELECTION */}
                    <div className="w-[340px] px-8 pt-6 pb-10 bg-neutral-50/50 dark:bg-neutral-900/20 border-r border-neutral-100 dark:border-neutral-800/60 flex flex-col">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Users className="size-4 text-blue-600" />
                                    <span className="text-[12px] font-black uppercase text-[#0A2540] dark:text-white tracking-tight">Resident Target</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={toggleAll}
                                    className="text-[10px] font-black uppercase text-blue-600 underline"
                                >
                                    {data.resident_ids.length === residents.length ? 'Deselect' : 'All Area'}
                                </button>
                            </div>
                            
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-neutral-400" />
                                <Input 
                                    placeholder="Filter community..." 
                                    className="h-9 pl-9 rounded-xl text-[12px] font-bold border-neutral-200 bg-white"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="h-[480px] overflow-y-auto pr-2 space-y-1 custom-scrollbar">
                                {filteredResidents.map(resident => (
                                    <ResidentItem 
                                        key={resident.id}
                                        resident={resident}
                                        isSelected={data.resident_ids.includes(resident.id)}
                                        onToggle={() => toggleResident(resident.id)}
                                    />
                                ))}
                            </div>

                            <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100/50 text-center">
                                <p className="text-[10px] font-black text-blue-600 uppercase">
                                    {data.resident_ids.length === 0 ? "Global Selection (Bulk)" : `${data.resident_ids.length} Residents Selected`}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANE: FORM FIELDS */}
                    <div className="flex-1 overflow-y-auto">
                        <form onSubmit={submit} className="px-10 pt-6 pb-20">
                            <div className="space-y-12">
                                <SectionHeader icon={CalendarDays} title="Billing Details" description="Define the period name and financial schedule." />
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400 tracking-wider">Billing Period Name <span className="text-red-500">*</span></Label>
                                        <Input 
                                            value={data.name} 
                                            onChange={e => setData('name', e.target.value)} 
                                            placeholder="e.g. May 2026 HOA Dues" 
                                            className="h-11 rounded-xl text-[14px] font-bold border-neutral-200" 
                                        />
                                        {errors.name && <p className="text-[10px] font-bold text-red-500">⚠ {errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400 tracking-wider">Assessment Amount (PHP) <span className="text-red-500">*</span></Label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] font-black text-neutral-400">₱</div>
                                            <Input 
                                                type="number"
                                                step="0.01"
                                                value={data.amount} 
                                                onChange={e => setData('amount', e.target.value)} 
                                                placeholder="0.00" 
                                                className="h-11 pl-8 rounded-xl text-[14px] font-black border-neutral-200" 
                                            />
                                        </div>
                                        {errors.amount && <p className="text-[10px] font-bold text-red-500">⚠ {errors.amount}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400 tracking-wider">Coverage Start</Label>
                                        <Input type="date" value={data.start_date} onChange={e => setData('start_date', e.target.value)} className="h-10 rounded-lg text-[13px] font-bold border-neutral-200" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400 tracking-wider">Coverage End</Label>
                                        <Input type="date" value={data.end_date} onChange={e => setData('end_date', e.target.value)} className="h-10 rounded-lg text-[13px] font-bold border-neutral-200" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400 tracking-wider">Payment Due</Label>
                                        <Input type="date" value={data.due_date} onChange={e => setData('due_date', e.target.value)} className="h-10 rounded-lg text-[13px] font-bold border-red-100 bg-red-50/20 text-red-600" />
                                    </div>
                                </div>

                                {/* AUTHORIZATION CARD WITH INTEGRATED ACTIONS */}
                                <div className="p-8 rounded-[2rem] bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 flex flex-col gap-6 relative overflow-hidden">
                                    <div className="flex gap-5">
                                        <div className="size-12 rounded-[1.25rem] bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xl shadow-blue-600/20">
                                            <Wallet className="size-6" strokeWidth={2.5} />
                                        </div>
                                        <div className="space-y-1.5 pt-1">
                                            <h4 className="text-[16px] font-black text-[#0A2540] dark:text-white uppercase leading-tight tracking-tight">Finalize & Authorize</h4>
                                            <p className="text-[13px] text-neutral-500 font-bold leading-relaxed max-w-xl">
                                                Verify your selections on the left. Residents will receive their digital invoices immediately upon authorization. This will generate entries for {data.resident_ids.length || residents.length} accounts.
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-end gap-3 pt-2 relative z-10">
                                        <Link href="/admin/billing">
                                            <Button type="button" variant="ghost" className="h-11 px-6 rounded-xl text-[13px] font-black text-neutral-400 hover:bg-neutral-200/50 uppercase tracking-wider transition-colors">Discard</Button>
                                        </Link>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="h-11 gap-2.5 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-black shadow-2xl shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            {processing ? <Loader2 className="size-4 animate-spin" /> : null}
                                            {processing ? 'Processing...' : 'Authorize Period'}
                                        </Button>
                                    </div>

                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* REMOVED STICKY FOOTER IN FAVOR OF CARD-BASED ACTIONS */}
            </div>
        </>
    );
}

BillingPeriodCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Billing Registry', href: '/admin/billing' },
        { title: 'New Cycle', href: '#' },
    ],
};

// ─── OPTIMIZED SUB-COMPONENTS ───

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

// ─── OPTIMIZED SUB-COMPONENTS ───

const ResidentItem = memo(({ resident, isSelected, onToggle }: { resident: Resident, isSelected: boolean, onToggle: () => void }) => {
    return (
        <div 
            onClick={onToggle}
            className={`
                p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-all border
                ${isSelected 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/10' 
                    : 'bg-white border-neutral-100 dark:bg-neutral-800 dark:border-neutral-700 hover:border-blue-200'
                }
            `}
        >
            <div className="flex items-center gap-2.5 min-w-0">
                <div className={`size-7 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-white/20' : 'bg-neutral-100'}`}>
                    <UserCircle className={`size-4 ${isSelected ? 'text-white' : 'text-neutral-400'}`} />
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-[12px] font-bold truncate leading-none mb-0.5">
                        {resident.last_name}, {resident.first_name[0]}.
                    </span>
                    <span className={`text-[9px] font-black uppercase tracking-tighter truncate ${isSelected ? 'text-white/60' : 'text-neutral-400'}`}>
                        P{resident.phase} B{resident.block} L{resident.lot}
                    </span>
                </div>
            </div>
            {isSelected && <CheckSquare className="size-3.5 text-white" />}
        </div>
    );
});
 ResidentItem.displayName = 'ResidentItem';
