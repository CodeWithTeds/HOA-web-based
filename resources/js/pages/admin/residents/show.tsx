import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    User,
    Smartphone,
    Home,
    HeartPulse,
    ShieldAlert,
    Info,
    Calendar,
    Mail,
    MapPin,
    Heart,
    CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

const fontStack = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif';

interface Resident {
    id: number;
    first_name: string;
    middle_name?: string;
    last_name: string;
    suffix?: string;
    gender?: string;
    birth_date?: string;
    civil_status?: string;
    nationality?: string;
    mobile_number?: string;
    alternate_number?: string;
    email?: string;
    phase?: string;
    block?: string;
    lot?: string;
    street?: string;
    unit?: string;
    resident_type: string;
    move_in_date?: string;
    emergency_contact_name?: string;
    emergency_contact_number?: string;
    status: string;
    remarks?: string;
}

export default function ResidentShow({ resident }: { resident: Resident }) {
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

    const DataField = ({ label, value, icon: Icon }: any) => (
        <div className="space-y-1.5 flex flex-col p-3 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-100/50 dark:border-neutral-800/50">
            <span className="text-[10px] font-black uppercase text-neutral-400 flex items-center gap-1.5">
                {Icon && <Icon className="size-3" />} {label}
            </span>
            <span className="text-[13px] font-bold text-[#0A2540] dark:text-neutral-200">
                {value || <span className="text-neutral-300 dark:text-neutral-700 italic">Not Specified</span>}
            </span>
        </div>
    );

    const statusColors: any = {
        'Pending': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
        'Active': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
        'Inactive': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
        'Blacklisted': 'bg-red-500/10 text-red-600 border-red-500/20',
    };

    return (
        <>
            <Head title={`View - ${resident.first_name} ${resident.last_name}`} />

            <div
                className="flex h-full flex-1 flex-col rounded-2xl bg-white dark:bg-[#0c0c0c] text-[#0A2540] dark:text-neutral-100 overflow-hidden"
                style={{ fontFamily: fontStack }}
            >
                {/* ─── HEADER ─── */}
                <div className="shrink-0 px-8 py-6 border-b border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/30 dark:bg-neutral-900/40">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center size-12 rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/20 text-white font-black text-xl">
                                {resident.first_name[0]}{resident.last_name[0]}
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-[22px] font-black tracking-tight text-[#0A2540] dark:text-white">
                                        {resident.first_name} {resident.last_name}
                                    </h1>
                                    <Badge className={`px-2 py-0.5 rounded-md text-[10px] font-black border uppercase ${statusColors[resident.status] || ''}`}>
                                        {resident.status}
                                    </Badge>
                                </div>
                                <p className="text-[12px] text-neutral-400 font-bold tracking-wide uppercase mt-0.5 flex items-center gap-2">
                                    Member ID: #{resident.id} • Registered as <span className="text-blue-600 dark:text-blue-400">{resident.resident_type}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {resident.status === 'Pending' && (
                                <Button onClick={() => router.patch(`/admin/residents/${resident.id}/approve`)} className="h-9 gap-2 rounded-lg text-[12px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white">
                                    <CheckCircle2 className="size-3.5" /> Approve & Verify
                                </Button>
                            )}
                            <Link href={`/admin/residents/${resident.id}/edit`}>
                                <Button variant="outline" className="h-9 gap-2 rounded-lg text-[12px] font-bold text-blue-600 border-blue-200 hover:bg-blue-50">
                                    Edit Profile
                                </Button>
                            </Link>
                            <Link href="/admin/residents">
                                <Button variant="outline" className="h-9 gap-2 rounded-lg text-[12px] font-bold text-neutral-500 border-neutral-200">
                                    <ArrowLeft className="size-3.5" /> Back to Registry
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ─── SCROLLABLE CONTENT ─── */}
                <div className="flex-1 overflow-y-auto">
                    <div className="px-12 py-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
                            
                            {/* COLUMN 1: IDENTITY */}
                            <div className="space-y-6">
                                <SectionHeader 
                                    icon={User} 
                                    title="Identity" 
                                    description="Verified legal name and identity markers."
                                />
                                <div className="grid grid-cols-2 gap-2.5">
                                    <DataField label="First Name" value={resident.first_name} />
                                    <DataField label="Middle Name" value={resident.middle_name} />
                                    <DataField label="Last Name" value={resident.last_name} />
                                    <DataField label="Suffix" value={resident.suffix} />
                                    <DataField label="Gender" value={resident.gender} />
                                    <DataField label="Birth Date" value={resident.birth_date} icon={Calendar} />
                                </div>
                            </div>

                            {/* COLUMN 2: CONTACT */}
                            <div className="space-y-6">
                                <SectionHeader 
                                    icon={Smartphone} 
                                    title="Contact & Status" 
                                    description="Communication channels and legal status."
                                />
                                <div className="grid grid-cols-2 gap-2.5">
                                    <div className="col-span-2">
                                        <DataField label="Email Address" value={resident.email} icon={Mail} />
                                    </div>
                                    <DataField label="Mobile Number" value={resident.mobile_number} icon={Smartphone} />
                                    <DataField label="Alternate Number" value={resident.alternate_number} />
                                    <DataField label="Nationality" value={resident.nationality} />
                                    <DataField label="Civil Status" value={resident.civil_status} />
                                </div>
                            </div>

                            <div className="col-span-2 h-px bg-neutral-100 dark:bg-neutral-800/60 my-2" />

                            {/* COLUMN 3: ADDRESS */}
                            <div className="space-y-6">
                                <SectionHeader 
                                    icon={Home} 
                                    title="Address" 
                                    description="Physical residency within the community."
                                />
                                <div className="grid grid-cols-3 gap-2.5">
                                    <DataField label="Phase" value={resident.phase} />
                                    <DataField label="Block" value={resident.block} />
                                    <DataField label="Lot" value={resident.lot} />
                                    <div className="col-span-2">
                                        <DataField label="Street" value={resident.street} icon={MapPin} />
                                    </div>
                                    <DataField label="Unit" value={resident.unit} />
                                    <div className="col-span-2">
                                        <DataField label="Resident Type" value={resident.resident_type} />
                                    </div>
                                </div>
                            </div>

                            {/* COLUMN 4: EMERGENCY */}
                            <div className="space-y-6">
                                <SectionHeader 
                                    icon={HeartPulse} 
                                    title="Emergency" 
                                    description="Critical contact for rapid response."
                                />
                                <div className="grid grid-cols-1 gap-2.5">
                                    <DataField label="Contact Person" value={resident.emergency_contact_name} icon={User} />
                                    <DataField label="Contact Number" value={resident.emergency_contact_number} icon={Smartphone} />
                                </div>
                            </div>

                            {/* REMARKS */}
                            {resident.remarks && (
                                <div className="col-span-2 space-y-3">
                                    <Label className="text-[11px] font-black uppercase text-neutral-400 flex items-center gap-2">
                                        <Info className="size-3 text-blue-500" /> Registry Remarks
                                    </Label>
                                    <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 text-[13px] font-bold text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap leading-relaxed italic">
                                        "{resident.remarks}"
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

ResidentShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Resident Management', href: '/admin/residents' },
        { title: 'View Member', href: '#' },
    ],
};
