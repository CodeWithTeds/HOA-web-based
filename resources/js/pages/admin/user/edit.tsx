import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    UserPlus,
    Mail,
    Phone,
    Shield,
    Calendar,
    User,
    CheckCircle,
    Save,
    Pencil,
    Building,
} from 'lucide-react';
import { useState } from 'react';
import { PhotoUpload } from '@/components/photo-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SweetAlert } from '@/components/ui/sweet-alert';

const fontStack = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif';

export default function StaffEdit({ staff }: { staff: any }) {
    const [alert, setAlert] = useState<{
        show: boolean;
        type: 'success' | 'error' | 'warning' | 'info';
        title: string;
        message?: string;
    }>({ show: false, type: 'success', title: '' });

    const { data, setData, post, put, transform, processing, errors, clearErrors } = useForm({
        firstName: staff.first_name || '',
        lastName: staff.last_name || '',
        email: staff.email || '',
        phone: staff.phone || '',
        role: staff.role || 'hoa personnel',
        department: staff.department || '',
        status: staff.status || 'ACTIVE',
        hireDate: staff.hire_date ? new Date(staff.hire_date).toISOString().split('T')[0] : '',
        password: '',
        photo: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // Use transform to add _method spoofing for file uploads in updates
        // This is necessary because PHP doesn't parse multipart/form-data on PUT/PATCH
        transform((data) => ({
            ...data,
            _method: 'put',
        }));

        post(`/admin/user/${staff.id}`, {
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

    return (
        <>
            <Head title="Edit Staff Member" />
            <SweetAlert
                type={alert.type}
                title={alert.title}
                message={alert.message}
                show={alert.show}
                onClose={() => setAlert(prev => ({ ...prev, show: false }))}
            />

            <div
                className="flex h-full flex-1 flex-col rounded-2xl bg-white dark:bg-[#0c0c0c] text-[#0A2540] dark:text-neutral-100 overflow-y-auto"
                style={{ fontFamily: fontStack }}
            >
                {/* ─── HEADER ─── */}
                <div className="shrink-0 relative overflow-hidden px-10 pt-10 pb-8 border-b border-neutral-100 dark:border-neutral-800/60">
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <div className="flex items-center justify-center size-14 rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-500/20">
                                <Pencil className="size-7 text-white" strokeWidth={2} />
                            </div>
                            <div>
                                <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-[#0A2540] dark:text-white">
                                    Edit Staff Profile
                                </h1>
                                <p className="text-[15px] text-neutral-600 dark:text-neutral-300 font-medium mt-0.5">
                                    Update information for <span className="font-bold text-[#0A2540] dark:text-white">{staff.first_name} {staff.last_name}</span>.
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

                {/* ─── FORM ─── */}
                <form onSubmit={submit} className="flex-1">
                    <div className="px-10 py-10">
                        {/* Personal Information */}
                        <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-3">
                            <div className="md:col-span-1">
                                <h2 className="text-[18px] font-extrabold tracking-[-0.02em] text-[#0A2540] dark:text-white">Personal Information</h2>
                                <p className="mt-1 text-[13px] text-neutral-500 dark:text-neutral-400">
                                    Provide the basic contact and identity details for the new staff member. An avatar profile picture can be uploaded.
                                </p>
                            </div>

                            <div className="md:col-span-2">
                                <PhotoUpload
                                    value={data.photo || staff.profile_picture}
                                    onChange={(file) => setData('photo', file)}
                                    error={errors.photo}
                                />

                                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                    {/* First Name */}
                                    <div className="space-y-2.5">
                                        <Label htmlFor="firstName" className="text-[13px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                            First Name <span className="text-red-400">*</span>
                                        </Label>
                                        <Input
                                            id="firstName"
                                            value={data.firstName}
                                            onChange={e => {
 setData('firstName', e.target.value); clearErrors('firstName'); 
}}
                                            placeholder="John"
                                            className={`h-12 rounded-xl border-2 bg-neutral-50/80 dark:bg-neutral-900/50 px-4 text-[15px] font-medium transition-all focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 ${errors.firstName ? 'border-red-400 bg-red-50/50 dark:bg-red-900/10' : 'border-neutral-200 dark:border-neutral-800'}`}
                                        />
                                        {errors.firstName && <p className="text-[12px] font-bold text-red-500 flex items-center gap-1.5 animate-in slide-in-from-top-1 duration-200">⚠ {errors.firstName}</p>}
                                    </div>

                                    {/* Last Name */}
                                    <div className="space-y-2.5">
                                        <Label htmlFor="lastName" className="text-[13px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                            Last Name <span className="text-red-400">*</span>
                                        </Label>
                                        <Input
                                            id="lastName"
                                            value={data.lastName}
                                            onChange={e => {
 setData('lastName', e.target.value); clearErrors('lastName'); 
}}
                                            placeholder="Doe"
                                            className={`h-12 rounded-xl border-2 bg-neutral-50/80 dark:bg-neutral-900/50 px-4 text-[15px] font-medium transition-all focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 ${errors.lastName ? 'border-red-400 bg-red-50/50 dark:bg-red-900/10' : 'border-neutral-200 dark:border-neutral-800'}`}
                                        />
                                        {errors.lastName && <p className="text-[12px] font-bold text-red-500 flex items-center gap-1.5 animate-in slide-in-from-top-1 duration-200">⚠ {errors.lastName}</p>}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2.5">
                                        <Label htmlFor="email" className="text-[13px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                            <span className="flex items-center gap-1.5"><Mail className="size-3.5" /> Email Address <span className="text-red-400">*</span></span>
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={e => {
 setData('email', e.target.value); clearErrors('email'); 
}}
                                            placeholder="staff@smarthoa.com"
                                            className={`h-12 rounded-xl border-2 bg-neutral-50/80 dark:bg-neutral-900/50 px-4 text-[15px] font-medium transition-all focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 ${errors.email ? 'border-red-400 bg-red-50/50 dark:bg-red-900/10' : 'border-neutral-200 dark:border-neutral-800'}`}
                                        />
                                        {errors.email && <p className="text-[12px] font-bold text-red-500 flex items-center gap-1.5 animate-in slide-in-from-top-1 duration-200">⚠ {errors.email}</p>}
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2.5">
                                        <Label htmlFor="phone" className="text-[13px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                            <span className="flex items-center gap-1.5"><Phone className="size-3.5" /> Phone Number</span>
                                        </Label>
                                        <Input
                                            id="phone"
                                            value={data.phone}
                                            onChange={e => {
                                                const val = e.target.value.replace(/\D/g, '');

                                                if (val.length <= 11) {
setData('phone', val);
}

                                                clearErrors('phone');
                                            }}
                                            placeholder="09123456789"
                                            maxLength={11}
                                            className={`h-12 rounded-xl border-2 bg-neutral-50/80 dark:bg-neutral-900/50 px-4 text-[15px] font-medium transition-all focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 ${errors.phone ? 'border-red-400 bg-red-50/50 dark:bg-red-900/10' : 'border-neutral-200 dark:border-neutral-800'}`}
                                        />
                                        {errors.phone && <p className="text-[12px] font-bold text-red-500 flex items-center gap-1.5 animate-in slide-in-from-top-1 duration-200">⚠ {errors.phone}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Gradient divider */}
                        <div className="h-px bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-800 to-transparent mb-10" />

                        {/* Account Security */}
                        <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-3">
                            <div className="md:col-span-1">
                                <h2 className="text-[18px] font-extrabold tracking-[-0.02em] text-[#0A2540] dark:text-white">Account Security</h2>
                                <p className="mt-1 text-[13px] text-neutral-500 dark:text-neutral-400">
                                    Update the staff member's password. Leave blank to keep the current password.
                                </p>
                            </div>
                            
                            <div className="md:col-span-2">
                                <div className="grid grid-cols-1 gap-x-8 gap-y-6">
                                    <div className="space-y-2.5">
                                        <Label htmlFor="password" className="text-[13px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                            New Password <span className="text-neutral-400 font-normal normal-case text-[11px]">(optional)</span>
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type="password"
                                                value={data.password}
                                                onChange={e => {
 setData('password', e.target.value); clearErrors('password'); 
}}
                                                placeholder="••••••••"
                                                className={`h-12 rounded-xl border-2 bg-neutral-50/80 dark:bg-neutral-900/50 px-4 text-[15px] font-medium transition-all focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 ${errors.password ? 'border-red-400 bg-red-50/50 dark:bg-red-900/10' : 'border-neutral-200 dark:border-neutral-800'}`}
                                            />
                                        </div>
                                        {errors.password && <p className="text-[12px] font-bold text-red-500 flex items-center gap-1.5 animate-in slide-in-from-top-1 duration-200">⚠ {errors.password}</p>}
                                        <p className="text-[11px] text-neutral-400 font-medium">Minimum 8 characters. If you don't want to change the password, leave this field empty.</p>
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
                                    Configure the role, department, and status for the staff member within the system.
                                </p>
                            </div>

                            <div className="md:col-span-2">
                                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                    {/* Role */}
                                    <div className="space-y-2.5">
                                        <Label htmlFor="role" className="text-[13px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                            <span className="flex items-center gap-1.5"><Shield className="size-3.5" /> Designated Role <span className="text-red-400">*</span></span>
                                        </Label>
                                        <select
                                            id="role"
                                            value={data.role}
                                            onChange={e => {
 setData('role', e.target.value); clearErrors('role'); 
}}
                                            className={`flex h-12 w-full rounded-xl border-2 bg-neutral-50/80 dark:bg-neutral-900/50 px-4 text-[15px] font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 cursor-pointer ${errors.role ? 'border-red-400 bg-red-50/50' : 'border-neutral-200 dark:border-neutral-800'}`}
                                            style={{ fontFamily: fontStack }}
                                        >
                                            <option value="hoa personnel">HOA Personnel</option>
                                            <option value="secretary">Secretary</option>
                                        </select>
                                        {errors.role && <p className="text-[12px] font-bold text-red-500 flex items-center gap-1.5 animate-in slide-in-from-top-1 duration-200">⚠ {errors.role}</p>}
                                    </div>

                                    {/* Department */}
                                    <div className="space-y-2.5">
                                        <Label htmlFor="department" className="text-[13px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                            <span className="flex items-center gap-1.5"><Building className="size-3.5" /> Department <span className="text-neutral-400 font-normal normal-case text-[11px]">(optional)</span></span>
                                        </Label>
                                        <Input
                                            id="department"
                                            value={data.department}
                                            onChange={e => setData('department', e.target.value)}
                                            placeholder="e.g. Operations"
                                            className="h-12 rounded-xl border-2 border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/50 px-4 text-[15px] font-medium transition-all focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-500"
                                        />
                                    </div>

                                    {/* Status */}
                                    <div className="space-y-2.5">
                                        <Label htmlFor="status" className="text-[13px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                            <span className="flex items-center gap-1.5"><CheckCircle className="size-3.5" /> Account Status <span className="text-red-400">*</span></span>
                                        </Label>
                                        <select
                                            id="status"
                                            value={data.status}
                                            onChange={e => {
 setData('status', e.target.value); clearErrors('status'); 
}}
                                            className={`flex h-12 w-full rounded-xl border-2 bg-neutral-50/80 dark:bg-neutral-900/50 px-4 text-[15px] font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 cursor-pointer ${errors.status ? 'border-red-400 bg-red-50/50' : 'border-neutral-200 dark:border-neutral-800'}`}
                                            style={{ fontFamily: fontStack }}
                                        >
                                            <option value="ACTIVE">Active — Onboarded</option>
                                            <option value="INACTIVE">Inactive — Suspended</option>
                                        </select>
                                        {errors.status && <p className="text-[12px] font-bold text-red-500 flex items-center gap-1.5 animate-in slide-in-from-top-1 duration-200">⚠ {errors.status}</p>}
                                    </div>

                                    {/* Hire Date */}
                                    <div className="space-y-2.5">
                                        <Label htmlFor="hireDate" className="text-[13px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                            <span className="flex items-center gap-1.5"><Calendar className="size-3.5" /> Hire Date <span className="text-red-400">*</span></span>
                                        </Label>
                                        <Input
                                            id="hireDate"
                                            type="date"
                                            value={data.hireDate}
                                            onChange={e => {
 setData('hireDate', e.target.value); clearErrors('hireDate'); 
}}
                                            className={`h-12 rounded-xl border-2 bg-neutral-50/80 dark:bg-neutral-900/50 px-4 text-[15px] font-medium transition-all focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 ${errors.hireDate ? 'border-red-400 bg-red-50/50 dark:bg-red-900/10' : 'border-neutral-200 dark:border-neutral-800'}`}
                                        />
                                        {errors.hireDate && <p className="text-[12px] font-bold text-red-500 flex items-center gap-1.5 animate-in slide-in-from-top-1 duration-200">⚠ {errors.hireDate}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ─── STICKY FOOTER ─── */}
                    <div className="shrink-0 sticky bottom-0 bg-white/90 dark:bg-[#0c0c0c]/90 backdrop-blur-xl border-t border-neutral-100 dark:border-neutral-800/60 px-10 py-5">
                        <div className="flex items-center justify-between">
                            <p className="text-[13px] text-neutral-400 font-medium">
                                Fields marked with <span className="text-red-400 font-bold">*</span> are required
                            </p>
                            <div className="flex items-center gap-4">
                                <Link href="/admin/user">
                                    <Button type="button" variant="ghost" className="h-12 rounded-xl px-8 text-[15px] font-bold text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="h-12 rounded-xl px-10 text-[15px] font-bold bg-[#0A2540] dark:bg-white dark:text-[#0A2540] text-white hover:bg-[#0d2f4f] dark:hover:bg-neutral-200 shadow-xl shadow-black/15 transition-all active:scale-[0.97] disabled:opacity-50"
                                >
                                    {processing ? (
                                        <span className="flex items-center gap-2.5">
                                            <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Saving Changes…
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Save className="size-5" />
                                            Save Changes
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

StaffEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Staff Management', href: '/admin/user' },
        { title: 'Edit Staff', href: '#' },
    ],
};
