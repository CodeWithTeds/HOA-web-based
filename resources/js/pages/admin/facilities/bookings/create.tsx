import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Users,
    DollarSign,
    Info,
    LayoutGrid,
    User,
    Clock,
    MapPin,
    AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SweetAlert } from '@/components/ui/sweet-alert';
import { useState, useEffect } from 'react';

const fontStack = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif';

export default function BookingCreate({ residents, facilities }: { residents: any[], facilities: any[] }) {
    const { flash } = usePage<any>().props;
    const [alert, setAlert] = useState<{
        show: boolean;
        type: 'success' | 'error' | 'warning' | 'info';
        title: string;
        message?: string;
    }>({ show: false, type: 'success', title: '' });

    const { data, setData, post, processing, errors } = useForm({
        resident_id: '',
        facility_id: '',
        start_time: '',
        end_time: '',
        purpose: '',
        notes: '',
    });

    useEffect(() => {
        if (flash?.success) {
            setAlert({ show: true, type: 'success', title: 'Reservation Confirmed', message: flash.success });
        }
        if (errors.error) {
            setAlert({ show: true, type: 'error', title: 'Conflict Detected', message: errors.error });
        }
    }, [flash, errors]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/bookings', {
            onError: (err) => {
                const errorMessage = err.error || err.facility_id || err.resident_id || err.start_time || err.end_time;
                setAlert({ 
                    show: true, 
                    type: 'error', 
                    title: 'Reservation Failed', 
                    message: typeof errorMessage === 'string' ? errorMessage : 'Please check your inputs and try again.' 
                });
            }
        });
    };

    return (
        <>
            <Head title="New Reservation" />
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
                                <Calendar className="size-5 text-white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-[20px] font-black tracking-tight text-[#0A2540] dark:text-white">
                                    New Reservation Request
                                </h1>
                                <p className="text-[12px] text-neutral-400 font-bold tracking-wide uppercase mt-0.5">
                                    Book a facility slot for a resident
                                </p>
                            </div>
                        </div>
                        <Link href="/admin/bookings">
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
                            
                            {/* COLUMN 1: PARTICIPANTS */}
                            <div className="space-y-8">
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4 mb-6 relative pl-4">
                                        <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-blue-600 rounded-full" />
                                        <div className="flex items-center justify-center size-8 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                                            <User className="size-4.5" />
                                        </div>
                                        <div>
                                            <h2 className="text-[15px] font-black tracking-tight text-[#0A2540] dark:text-white uppercase">Participant</h2>
                                            <p className="text-[12px] text-neutral-400 font-bold mt-0.5">Select the resident for this booking.</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Resident <span className="text-red-500">*</span></Label>
                                        <select 
                                            value={data.resident_id} 
                                            onChange={e => setData('resident_id', e.target.value)}
                                            className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-[13px] font-black dark:bg-neutral-900 dark:border-neutral-800 focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none"
                                        >
                                            <option value="">Select Resident</option>
                                            {residents.map((r: any) => (
                                                <option key={r.id} value={r.id}>{r.first_name} {r.last_name} (#{r.id})</option>
                                            ))}
                                        </select>
                                        {errors.resident_id && <p className="text-[10px] font-bold text-red-500">⚠ {errors.resident_id}</p>}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4 mb-6 relative pl-4">
                                        <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-blue-600 rounded-full" />
                                        <div className="flex items-center justify-center size-8 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                                            <MapPin className="size-4.5" />
                                        </div>
                                        <div>
                                            <h2 className="text-[15px] font-black tracking-tight text-[#0A2540] dark:text-white uppercase">Asset</h2>
                                            <p className="text-[12px] text-neutral-400 font-bold mt-0.5">Target facility for reservation.</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Facility <span className="text-red-500">*</span></Label>
                                        <select 
                                            value={data.facility_id} 
                                            onChange={e => setData('facility_id', e.target.value)}
                                            className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-[13px] font-black dark:bg-neutral-900 dark:border-neutral-800 focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none"
                                        >
                                            <option value="">Select Facility</option>
                                            {facilities.map((f: any) => (
                                                <option key={f.id} value={f.id}>{f.name} - ₱{f.base_price} ({f.price_type})</option>
                                            ))}
                                        </select>
                                        {errors.facility_id && <p className="text-[10px] font-bold text-red-500">⚠ {errors.facility_id}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* COLUMN 2: SCHEDULE */}
                            <div className="space-y-8">
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4 mb-6 relative pl-4">
                                        <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-blue-600 rounded-full" />
                                        <div className="flex items-center justify-center size-8 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                                            <Clock className="size-4.5" />
                                        </div>
                                        <div>
                                            <h2 className="text-[15px] font-black tracking-tight text-[#0A2540] dark:text-white uppercase">Schedule</h2>
                                            <p className="text-[12px] text-neutral-400 font-bold mt-0.5">Define interval for usage.</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-[11px] font-black uppercase text-neutral-400">Start Date & Time <span className="text-red-500">*</span></Label>
                                            <Input type="datetime-local" value={data.start_time} onChange={e => setData('start_time', e.target.value)} className="h-10 rounded-xl text-[13px] font-black border-neutral-200" />
                                            {errors.start_time && <p className="text-[10px] font-bold text-red-500">⚠ {errors.start_time}</p>}
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[11px] font-black uppercase text-neutral-400">End Date & Time <span className="text-red-500">*</span></Label>
                                            <Input type="datetime-local" value={data.end_time} onChange={e => setData('end_time', e.target.value)} className="h-10 rounded-xl text-[13px] font-black border-neutral-200" />
                                            {errors.end_time && <p className="text-[10px] font-bold text-red-500">⚠ {errors.end_time}</p>}
                                        </div>
                                    </div>
                                    {errors.error && (
                                        <div className="mt-2 p-3 rounded-lg bg-red-50 border border-red-100 flex items-center gap-2">
                                            <AlertCircle className="size-3.5 text-red-600" />
                                            <p className="text-[11px] font-black text-red-600 uppercase tracking-tight">{errors.error}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-black uppercase text-neutral-400">Purpose / Occasion</Label>
                                    <Input value={data.purpose} onChange={e => setData('purpose', e.target.value)} placeholder="e.g. Birthday Party, Team Building" className="h-10 rounded-xl text-[13px] font-black border-neutral-200" />
                                </div>
                            </div>

                            <div className="col-span-full">
                                <Label className="text-[11px] font-black uppercase text-neutral-400">Additional Remarks</Label>
                                <textarea 
                                    value={data.notes} 
                                    onChange={e => setData('notes', e.target.value)}
                                    rows={3}
                                    placeholder="Any special requests or notes for the admin..."
                                    className="w-full mt-1.5 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[13px] font-bold dark:bg-neutral-900 dark:border-neutral-800 focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                                />
                            </div>
                        </div>

                        <div className="mt-12 p-6 rounded-2xl bg-amber-50 border border-amber-100 flex gap-4">
                            <AlertCircle className="size-5 text-amber-600 shrink-0 mt-0.5" />
                            <div className="text-[12px] font-bold text-amber-800 leading-relaxed">
                                <p className="uppercase text-[10px] font-black mb-1 tracking-wider">Conflict Notice</p>
                                The system will automatically check for overlapping schedules upon submission. If the facility is already booked for the selected time, the request will be rejected to prevent double-booking.
                            </div>
                        </div>
                    </div>
                </form>

                {/* ─── STICKY FOOTER ─── */}
                <div className="shrink-0 bg-white dark:bg-[#0c0c0c] border-t border-neutral-100 dark:border-neutral-800/60 px-8 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-neutral-400">
                            <Info className="size-4" />
                            <p className="text-[12px] font-bold uppercase tracking-wider">All bookings are subject to approval</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href="/admin/bookings">
                                <Button type="button" variant="ghost" className="h-10 rounded-xl px-6 text-[13px] font-black text-neutral-500 hover:bg-neutral-50">
                                    Discard
                                </Button>
                            </Link>
                            <Button
                                onClick={submit}
                                disabled={processing}
                                className="h-10 rounded-xl px-8 text-[13px] font-black bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {processing ? 'Processing...' : 'Secure Booking'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

BookingCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Facilities', href: '/admin/facilities' },
        { title: 'Bookings', href: '/admin/bookings' },
        { title: 'New Reservation', href: '/admin/bookings/create' },
    ],
};
