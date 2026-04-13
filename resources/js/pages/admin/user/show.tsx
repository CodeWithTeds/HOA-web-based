import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Mail,
    Phone,
    Shield,
    Calendar,
    Building,
    User,
    CheckCircle,
    Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const fontStack = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif';

export default function StaffShow({ staff }: { staff: any }) {

    return (
        <>
            <Head title="View Staff Member" />

            <div
                className="flex h-full flex-1 flex-col rounded-2xl bg-white dark:bg-[#0c0c0c] text-[#0A2540] dark:text-neutral-100 overflow-y-auto"
                style={{ fontFamily: fontStack }}
            >
                {/* ─── HEADER ─── */}
                <div className="shrink-0 relative overflow-hidden px-10 pt-10 pb-8 border-b border-neutral-100 dark:border-neutral-800/60">
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <div className="flex items-center justify-center size-14 rounded-2xl bg-emerald-600 shadow-xl shadow-emerald-500/20">
                                <Eye className="size-7 text-white" strokeWidth={2} />
                            </div>
                            <div>
                                <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-[#0A2540] dark:text-white">
                                    View Staff Profile
                                </h1>
                                <p className="text-[15px] text-neutral-600 dark:text-neutral-300 font-medium mt-0.5">
                                    Reviewing information for <span className="font-bold text-[#0A2540] dark:text-white">{staff.first_name} {staff.last_name}</span>.
                                </p>
                            </div>
                        </div>
                        <Link href="/admin/user">
                            <Button variant="ghost" className="h-11 gap-2 rounded-xl text-[14px] font-bold text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                <ArrowLeft className="size-4" /> Back to Directory
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* ─── CONTENT ─── */}
                <div className="flex-1">
                    <div className="px-10 py-10">
                        {/* Personal Information */}
                        <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-3">
                            <div className="md:col-span-1">
                                <h2 className="text-[18px] font-extrabold tracking-[-0.02em] text-[#0A2540] dark:text-white">Personal Information</h2>
                                <p className="mt-1 text-[13px] text-neutral-500 dark:text-neutral-400">
                                    Contact and identity details for this staff member.
                                </p>
                            </div>
                            
                            <div className="md:col-span-2">
                                <div className="mb-8 flex items-center gap-6">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 border border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800 overflow-hidden">
                                        {staff.profile_picture ? (
                                            <img src={staff.profile_picture} alt="Profile" className="h-full w-full object-cover" />
                                        ) : (
                                            <User className="size-8 text-neutral-400" />
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                    {/* First Name */}
                                    <div className="space-y-2.5">
                                        <Label className="text-[13px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                            First Name
                                        </Label>
                                        <Input
                                            readOnly
                                            value={staff.first_name || ''}
                                            className="h-12 rounded-xl border-2 border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/50 px-4 text-[15px] font-medium"
                                        />
                                    </div>

                                    {/* Last Name */}
                                    <div className="space-y-2.5">
                                        <Label className="text-[13px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                            Last Name
                                        </Label>
                                        <Input
                                            readOnly
                                            value={staff.last_name || ''}
                                            className="h-12 rounded-xl border-2 border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/50 px-4 text-[15px] font-medium"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2.5">
                                        <Label className="text-[13px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                            <span className="flex items-center gap-1.5"><Mail className="size-3.5" /> Email Address</span>
                                        </Label>
                                        <Input
                                            readOnly
                                            value={staff.email || ''}
                                            className="h-12 rounded-xl border-2 border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/50 px-4 text-[15px] font-medium"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2.5">
                                        <Label className="text-[13px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                            <span className="flex items-center gap-1.5"><Phone className="size-3.5" /> Phone Number</span>
                                        </Label>
                                        <Input
                                            readOnly
                                            value={staff.phone || '—'}
                                            className="h-12 rounded-xl border-2 border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/50 px-4 text-[15px] font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Gradient divider */}
                        <div className="h-px bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-800 to-transparent mb-10" />

                        {/* Employment Details */}
                        <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-3">
                            <div className="md:col-span-1">
                                <h2 className="text-[18px] font-extrabold tracking-[-0.02em] text-[#0A2540] dark:text-white">Employment Details</h2>
                                <p className="mt-1 text-[13px] text-neutral-500 dark:text-neutral-400">
                                    Current role, department, and system status.
                                </p>
                            </div>
                            
                            <div className="md:col-span-2">
                                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                    {/* Role */}
                                    <div className="space-y-2.5">
                                        <Label className="text-[13px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                            <span className="flex items-center gap-1.5"><Shield className="size-3.5" /> Designated Role</span>
                                        </Label>
                                        <Input
                                            readOnly
                                            value={staff.role?.toUpperCase() || ''}
                                            className="h-12 rounded-xl border-2 border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/50 px-4 text-[15px] font-bold text-blue-600 dark:text-blue-400"
                                        />
                                    </div>

                                    {/* Department */}
                                    <div className="space-y-2.5">
                                        <Label className="text-[13px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                            <span className="flex items-center gap-1.5"><Building className="size-3.5" /> Department</span>
                                        </Label>
                                        <Input
                                            readOnly
                                            value={staff.department || '—'}
                                            className="h-12 rounded-xl border-2 border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/50 px-4 text-[15px] font-medium"
                                        />
                                    </div>

                                    {/* Status */}
                                    <div className="space-y-2.5">
                                        <Label className="text-[13px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                            <span className="flex items-center gap-1.5"><CheckCircle className="size-3.5" /> Account Status</span>
                                        </Label>
                                        <Input
                                            readOnly
                                            value={staff.status === 'ACTIVE' ? 'Active — Onboarded' : 'Inactive — Suspended'}
                                            className={`h-12 rounded-xl border-2 px-4 text-[15px] font-bold ${
                                                staff.status === 'ACTIVE' 
                                                    ? 'border-emerald-200 bg-emerald-50/50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400' 
                                                    : 'border-red-200 bg-red-50/50 text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400'
                                            }`}
                                        />
                                    </div>

                                    {/* Hire Date */}
                                    <div className="space-y-2.5">
                                        <Label className="text-[13px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                            <span className="flex items-center gap-1.5"><Calendar className="size-3.5" /> Hire Date</span>
                                        </Label>
                                        <Input
                                            readOnly
                                            value={staff.hire_date ? new Date(staff.hire_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                                            className="h-12 rounded-xl border-2 border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/50 px-4 text-[15px] font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── STICKY FOOTER ─── */}
                <div className="shrink-0 sticky bottom-0 bg-white/90 dark:bg-[#0c0c0c]/90 backdrop-blur-xl border-t border-neutral-100 dark:border-neutral-800/60 px-10 py-5">
                    <div className="flex items-center justify-between">
                        <p className="text-[13px] text-neutral-400 font-medium">
                            Read-only profile view
                        </p>
                        <Link href="/admin/user">
                            <Button type="button" variant="outline" className="h-12 rounded-xl px-10 text-[15px] font-bold text-neutral-700 dark:text-neutral-300 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                Return to Directory
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

StaffShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Staff Management', href: '/admin/user' },
        { title: 'View Staff', href: '#' },
    ],
};
