import { Head, Link, usePage, router } from '@inertiajs/react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import {
    Search,
    Calendar,
    ChevronLeft,
    Box,
    CheckCircle2,
    XCircle,
    Clock,
    MoreHorizontal,
    User,
    MapPin,
    LayoutList,
    ChevronRight,
    FileText,
    Receipt,
    ShieldCheck,
    Clock3,
    Printer,
    CreditCard,
    Banknote,
    ExternalLink,
    Building2,
    CalendarDays,
    Users,
    Tag,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SweetAlert } from '@/components/ui/sweet-alert';

const fontStack = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif';

export default function BookingIndex({ bookings }: { bookings: any[] }) {
    const { flash } = usePage<any>().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [isPaymentLogOpen, setIsPaymentLogOpen] = useState(false);
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);
    const [receiptPayment, setReceiptPayment] = useState<any>(null);

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
            setAlert({ show: true, type: 'error', title: 'Something went wrong', message: flash.error });
        }
    }, [flash?.success, flash?.error]);

    const handleStatusUpdate = (id: number, status: string) => {
        router.patch(`/admin/bookings/${id}/status`, { status }, {
            onSuccess: () => {
                // The prop will be updated automatically by Inertia
            },
            onError: (errors) => {
                setAlert({
                    show: true,
                    type: 'error',
                    title: 'Update Failed',
                    message: typeof errors.error === 'string' ? errors.error : 'Could not update status.'
                });
            }
        });
    };

    const openPaymentLog = (booking: any) => {
        setSelectedBooking(booking);
        setIsPaymentLogOpen(true);
    };

    const openReceipt = (payment: any, booking: any) => {
        setReceiptPayment({ ...payment, booking });
        setIsReceiptOpen(true);
    };

    const formatCurrency = (amt: number) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amt || 0);

    const calculateBreakdown = (booking: any) => {
        if (!booking?.facility || !booking?.start_time || !booking?.end_time) return null;
        const start = new Date(booking.start_time);
        const end = new Date(booking.end_time);
        const diffMs = end.getTime() - start.getTime();
        const hours = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60)));
        const priceType = booking.facility.price_type;
        const base = parseFloat(booking.facility.base_price);
        if (priceType === 'Hourly') {
            return { hours, base, total: hours * base, priceType, label: `${hours} hr × ${formatCurrency(base)}` };
        }
        return { hours: 1, base, total: base, priceType, label: `Flat rate • ${formatCurrency(base)}` };
    };

    const filteredBookings = bookings.filter(b =>
        b.resident?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.resident?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.facility?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calendar logic
    const days = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
    });
    const startDay = days[0].getDay();
    const padding = Array.from({ length: startDay }).map((_, i) => null);

    return (
        <>
            <Head title="Facility Bookings" />
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
                {/* ─── ENTERPRISE HEADER ─── */}
                <div className="shrink-0 px-8 py-6 border-b border-neutral-100 dark:border-neutral-800/60 shadow-sm bg-white dark:bg-neutral-900/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/admin/facilities">
                                <Button variant="ghost" className="size-10 p-0 rounded-xl hover:bg-neutral-50 active:scale-95 transition-all">
                                    <ChevronLeft className="size-5" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-[22px] font-black tracking-tight text-[#0A2540] dark:text-white">
                                    Reservations Center
                                </h1>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[12px] font-bold text-neutral-400 uppercase tracking-wider">Schedule & Requests</span>
                                    <span className="size-1 rounded-full bg-neutral-300" />
                                    <span className="text-[12px] font-bold text-blue-600">{viewMode === 'list' ? 'Registry View' : 'Timeline View'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl mr-4">
                                <Button
                                    onClick={() => setViewMode('list')}
                                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                                    className={`h-8 gap-2 rounded-lg text-[11px] font-black ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-neutral-400 shadow-none'}`}
                                >
                                    <LayoutList className="size-3.5" /> Registry
                                </Button>
                                <Button
                                    onClick={() => setViewMode('calendar')}
                                    variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                                    className={`h-8 gap-2 rounded-lg text-[11px] font-black ${viewMode === 'calendar' ? 'bg-white text-blue-600 shadow-sm' : 'text-neutral-400 shadow-none'}`}
                                >
                                    <Calendar className="size-3.5" /> Calendar
                                </Button>
                            </div>

                            <Link href="/admin/bookings/create">
                                <Button className="h-10 gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 shadow-lg shadow-blue-600/10 active:scale-95 transition-all">
                                    <Calendar className="size-4" /> Secure Booking
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ─── TOOLBAR / CALENDAR CONTROLS ─── */}
                <div className="shrink-0 px-8 py-3.5 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/40 border-b border-neutral-100 dark:border-neutral-800/60">
                    {viewMode === 'list' ? (
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Filter by resident or facility..."
                                className="h-9 w-[300px] rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 pl-9 pr-4 text-[13px] font-medium placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all"
                            />
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-0.5">
                                <Button onClick={() => setCurrentDate(subMonths(currentDate, 1))} variant="ghost" className="size-8 p-0">
                                    <ChevronLeft className="size-4" />
                                </Button>
                                <div className="px-4 text-[13px] font-black min-w-[120px] text-center">
                                    {format(currentDate, 'MMMM yyyy')}
                                </div>
                                <Button onClick={() => setCurrentDate(addMonths(currentDate, 1))} variant="ghost" className="size-8 p-0">
                                    <ChevronRight className="size-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ─── CONTENT AREA ─── */}
                <div className="min-h-0 flex-1 overflow-auto">
                    {viewMode === 'list' ? (
                        <table className="w-full text-left table-fixed border-separate border-spacing-0">
                            <thead className="sticky top-0 z-20 bg-neutral-50/80 dark:bg-neutral-900/80 backdrop-blur-md">
                                <tr>
                                    <th className="pl-8 px-3 py-3 text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-800/60">Resident</th>
                                    <th className="px-3 py-3 text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-800/60">Facility</th>
                                    <th className="px-3 py-3 text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-800/60">Date & Time</th>
                                    <th className="px-3 py-3 text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-800/60">Fee</th>
                                    <th className="px-3 py-3 text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-800/60">Payment</th>
                                    <th className="px-3 py-3 text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-800/60 text-center">Status</th>
                                    <th className="pr-8 px-3 py-3 text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-800/60 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/40">
                                {filteredBookings.map((booking) => (
                                    <tr key={booking.id} className="group hover:bg-neutral-50/50 dark:hover:bg-white/5 transition-colors">
                                        <td className="pl-8 px-3 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                                    <User className="size-4 text-blue-600" />
                                                </div>
                                                <div className="flex flex-col leading-tight">
                                                    <span className="text-[13px] font-bold text-[#0A2540] dark:text-neutral-200">{booking.resident?.first_name} {booking.resident?.last_name}</span>
                                                    <span className="text-[11px] font-medium text-neutral-400">#RES-{booking.resident_id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-4 text-[13px] font-bold text-neutral-600 dark:text-neutral-300">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="size-3.5 text-neutral-400" />
                                                {booking.facility?.name}
                                            </div>
                                        </td>
                                        <td className="px-3 py-4">
                                            <div className="flex flex-col leading-tight">
                                                <span className="text-[13px] font-bold text-neutral-600 dark:text-neutral-300">
                                                    {format(new Date(booking.start_time), 'MMM dd, yyyy')}
                                                </span>
                                                <span className="text-[11px] font-medium text-neutral-400">
                                                    {format(new Date(booking.start_time), 'hh:mm a')} - {format(new Date(booking.end_time), 'hh:mm a')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-4 text-[13px] font-black text-blue-600">
                                            ₱{booking.total_fee}
                                        </td>
                                        <td className="px-3 py-4">
                                            {booking.total_fee > 0 ? (
                                                <Badge variant="outline" className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${booking.invoice?.status === 'Paid'
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                    : booking.invoice?.status === 'Partially Paid'
                                                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                        : 'bg-rose-50 text-rose-700 border-rose-200'
                                                    }`}>
                                                    {booking.invoice?.status || 'Unpaid'}
                                                </Badge>
                                            ) : (
                                                <span className="text-[11px] font-bold text-neutral-400">FREE</span>
                                            )}
                                        </td>
                                        <td className="px-3 py-4 text-center">
                                            <Badge className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${booking.status === 'Confirmed'
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : booking.status === 'Pending'
                                                    ? 'bg-amber-50 text-amber-700'
                                                    : 'bg-rose-50 text-rose-700'
                                                }`}>
                                                {booking.status}
                                            </Badge>
                                        </td>
                                        <td className="pr-8 px-3 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="size-8 p-0 hover:bg-neutral-100 rounded-lg">
                                                        <MoreHorizontal className="size-4 text-neutral-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-52 rounded-xl p-1">
                                                    <DropdownMenuItem
                                                        className="gap-2 font-bold text-[12px] rounded-lg"
                                                        onSelect={() => handleStatusUpdate(booking.id, 'Confirmed')}
                                                    >
                                                        <CheckCircle2 className="size-4 text-emerald-600" /> Approve Booking
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="gap-2 font-bold text-[12px] rounded-lg"
                                                        onSelect={() => handleStatusUpdate(booking.id, 'Cancelled')}
                                                    >
                                                        <XCircle className="size-4 text-rose-600" /> Decline Booking
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="gap-2 font-bold text-[12px] rounded-lg text-blue-700 focus:bg-blue-50 focus:text-blue-700"
                                                        onSelect={() => openPaymentLog(booking)}
                                                    >
                                                        <Receipt className="size-4 text-blue-600" /> Payment Breakdown
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="gap-2 font-bold text-[12px] rounded-lg text-violet-700 focus:bg-violet-50 focus:text-violet-700"
                                                        onSelect={() => openPaymentLog(booking)}
                                                    >
                                                        <ShieldCheck className="size-4 text-violet-600" /> Payment Log
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-8">
                            <div className="grid grid-cols-7 gap-px bg-neutral-100 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-800 rounded-2xl overflow-hidden">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                    <div key={day} className="bg-neutral-50/50 dark:bg-neutral-900/50 py-3 text-center">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{day}</span>
                                    </div>
                                ))}
                                {padding.map((_, i) => (
                                    <div key={`pad-${i}`} className="bg-white dark:bg-[#0c0c0c] min-h-[120px]" />
                                ))}
                                {days.map(day => {
                                    const dayBookings = bookings.filter(b => isSameDay(new Date(b.start_time), day));

                                    return (
                                        <div key={day.toString()} className="bg-white dark:bg-[#0c0c0c] min-h-[120px] p-3 border-t border-l border-neutral-100 dark:border-neutral-800/40 relative group">
                                            <span className={`text-[13px] font-black ${isSameDay(day, new Date()) ? 'text-blue-600' : 'text-neutral-300'}`}>
                                                {format(day, 'd')}
                                            </span>
                                            <div className="mt-2 space-y-1">
                                                {dayBookings.slice(0, 2).map((booking: any) => (
                                                    <div key={booking.id} className="text-[9px] p-1 rounded bg-blue-50/50 text-blue-700 border border-blue-100 truncate font-bold">
                                                        {booking.facility?.name}
                                                    </div>
                                                ))}
                                                {dayBookings.length > 2 && (
                                                    <div className="text-[9px] text-neutral-400 font-bold">
                                                        + {dayBookings.length - 2} more
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {filteredBookings.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <Clock className="size-16 text-neutral-100 dark:text-neutral-800" strokeWidth={1.5} />
                            <div className="text-center max-w-[300px]">
                                <p className="text-[16px] font-black text-neutral-300">No active reservations</p>
                                <div className="text-[13px] text-neutral-400 mt-2 font-bold">
                                    Click "Secure Booking" to register a new slot manually.
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* PAYMENT BREAKDOWN & LOG MODAL */}
            <Dialog open={isPaymentLogOpen} onOpenChange={setIsPaymentLogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden rounded-[2rem] border-none bg-white p-0 shadow-2xl dark:bg-neutral-900 flex flex-col" style={{ fontFamily: fontStack }}>
                    {selectedBooking && (
                        <>
                            <div className="shrink-0 bg-gradient-to-br from-blue-600 to-indigo-700 px-8 py-7 text-white">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest backdrop-blur">Reservation Payment • {selectedBooking.facility?.name}</p>
                                        <h2 className="mt-3 text-[22px] font-black tracking-tight leading-none">Payment Breakdown</h2>
                                        <p className="mt-1.5 text-[12px] font-bold text-blue-100">Invoice {selectedBooking.invoice?.invoice_number || '—'} • {selectedBooking.invoice?.status || 'Unpaid'} • Due {selectedBooking.invoice?.due_date ? format(new Date(selectedBooking.invoice.due_date), 'MMM dd, yyyy') : '—'}</p>
                                    </div>
                                    <div className="rounded-2xl bg-white/20 px-4 py-3 backdrop-blur text-right">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-100">Reservation Fee</p>
                                        <p className="text-[20px] font-black leading-none">{formatCurrency(parseFloat(selectedBooking.total_fee || 0))}</p>
                                        <p className="mt-1 text-[10px] font-bold text-blue-100">{selectedBooking.facility?.price_type} • {formatCurrency(parseFloat(selectedBooking.facility?.base_price || 0))}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
                                {/* Booking Summary */}
                                <section className="rounded-2xl border border-neutral-100 bg-neutral-50/50 p-5 dark:border-neutral-800 dark:bg-neutral-900/50">
                                    <h3 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-neutral-500 mb-3"><Building2 className="size-3.5" /> Booking Summary</h3>
                                    <div className="grid grid-cols-2 gap-4 text-[13px]">
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-neutral-400">Resident</p>
                                            <p className="font-black text-[#0A2540] dark:text-white">{selectedBooking.resident?.first_name} {selectedBooking.resident?.last_name}</p>
                                            <p className="text-[11px] font-bold text-neutral-500">#RES-{selectedBooking.resident_id} • Phase {selectedBooking.resident?.phase} B{selectedBooking.resident?.block} L{selectedBooking.resident?.lot}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-neutral-400">Schedule</p>
                                            <p className="font-bold flex items-center gap-1.5"><CalendarDays className="size-3.5 text-blue-600" /> {format(new Date(selectedBooking.start_time), 'MMM dd, yyyy hh:mm a')}</p>
                                            <p className="text-[11px] font-bold text-neutral-500">→ {format(new Date(selectedBooking.end_time), 'MMM dd, yyyy hh:mm a')}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-neutral-400">Purpose</p>
                                            <p className="font-bold">{selectedBooking.purpose || '—'}</p>
                                            <p className="text-[11px] font-bold text-neutral-500 flex items-center gap-1"><Users className="size-3" /> {selectedBooking.attendees} attendees</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-neutral-400">Status</p>
                                            <Badge className={`mt-1 ${selectedBooking.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'} border`}>{selectedBooking.status}</Badge>
                                            {selectedBooking.special_requests && <p className="mt-1 text-[11px] font-medium text-neutral-500">{selectedBooking.special_requests}</p>}
                                        </div>
                                    </div>
                                </section>

                                {/* Fee Calculation Breakdown */}
                                {(() => {
                                    const b = calculateBreakdown(selectedBooking);
                                    if (!b) return null;
                                    return (
                                        <section className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                                            <h3 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-blue-700 mb-3"><Tag className="size-3.5" /> Fee Calculation • Detailed Breakdown</h3>
                                            <div className="space-y-2 text-[13px]">
                                                <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 border border-blue-100">
                                                    <span className="text-[11px] font-black uppercase text-neutral-500">Facility</span>
                                                    <span className="font-black">{selectedBooking.facility?.name}</span>
                                                </div>
                                                <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 border border-blue-100">
                                                    <span className="text-[11px] font-black uppercase text-neutral-500">Pricing Model</span>
                                                    <span className="font-bold">{b.priceType} • {formatCurrency(b.base)} per {b.priceType === 'Hourly' ? 'hour' : 'booking'}</span>
                                                </div>
                                                {b.priceType === 'Hourly' && (
                                                    <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 border border-blue-100">
                                                        <span className="text-[11px] font-black uppercase text-neutral-500">Duration</span>
                                                        <span className="font-bold">{b.hours} hour(s)</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 border border-blue-100">
                                                    <span className="text-[11px] font-black uppercase text-neutral-500">Computation</span>
                                                    <span className="font-bold">{b.label}</span>
                                                </div>
                                                <div className="flex items-center justify-between rounded-xl bg-blue-600 px-4 py-3 text-white">
                                                    <span className="text-[11px] font-black uppercase text-blue-100">Total Reservation Fee</span>
                                                    <span className="text-[16px] font-black">{formatCurrency(b.total)}</span>
                                                </div>
                                                {selectedBooking.invoice && (
                                                    <div className="grid grid-cols-3 gap-3 pt-2">
                                                        <div className="rounded-xl bg-white px-3 py-2.5 border text-center">
                                                            <p className="text-[9px] font-black uppercase text-neutral-400">Total Billed</p>
                                                            <p className="text-[13px] font-black">{formatCurrency(parseFloat(selectedBooking.invoice.total_amount))}</p>
                                                        </div>
                                                        <div className="rounded-xl bg-emerald-50 px-3 py-2.5 border border-emerald-100 text-center">
                                                            <p className="text-[9px] font-black uppercase text-emerald-600">Paid</p>
                                                            <p className="text-[13px] font-black text-emerald-700">{formatCurrency(parseFloat(selectedBooking.invoice.paid_amount || 0))}</p>
                                                        </div>
                                                        <div className="rounded-xl bg-red-50 px-3 py-2.5 border border-red-100 text-center">
                                                            <p className="text-[9px] font-black uppercase text-red-500">Balance</p>
                                                            <p className="text-[13px] font-black text-red-700">{formatCurrency(parseFloat(selectedBooking.invoice.balance || 0))}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </section>
                                    );
                                })()}

                                {/* Invoice Items */}
                                {selectedBooking.invoice?.items?.length > 0 && (
                                    <section>
                                        <h3 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-neutral-500 mb-3"><FileText className="size-3.5" /> Invoice Line Items</h3>
                                        <div className="space-y-2">
                                            {selectedBooking.invoice.items.map((item: any) => (
                                                <div key={item.id} className="flex items-center justify-between rounded-xl border bg-white px-4 py-3">
                                                    <div>
                                                        <p className="text-[13px] font-bold text-[#0A2540]">{item.description}</p>
                                                        <p className="text-[10px] font-black uppercase text-neutral-400">{item.type}</p>
                                                    </div>
                                                    <p className="text-[14px] font-black">{formatCurrency(parseFloat(item.amount))}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Payment History + Verification Log */}
                                <section>
                                    <h3 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-neutral-500 mb-3"><CreditCard className="size-3.5" /> Payment History & Verification Log</h3>
                                    {selectedBooking.invoice?.payments?.length > 0 ? (
                                        <div className="space-y-3">
                                            {selectedBooking.invoice.payments.map((p: any) => (
                                                <div key={p.id} className={`rounded-xl border p-4 ${p.status === 'Verified' ? 'bg-emerald-50/50 border-emerald-100' : p.status === 'Pending' ? 'bg-violet-50/50 border-violet-100' : 'bg-white border-neutral-100'}`}>
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[12px] font-black uppercase">{p.payment_method}</span>
                                                                <Badge className={`h-5 text-[9px] font-black uppercase ${p.status === 'Verified' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : p.status === 'Pending' ? 'bg-violet-100 text-violet-700 border-violet-200' : 'bg-red-50 text-red-700 border-red-200'} border`}>{p.status}</Badge>
                                                                {p.reference_number && <span className="text-[10px] font-black uppercase italic text-neutral-500">Ref: {p.reference_number}</span>}
                                                            </div>
                                                            <p className="mt-1 text-[11px] font-bold text-neutral-500">{new Date(p.payment_date).toLocaleDateString()} • {formatCurrency(parseFloat(p.amount))}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[14px] font-black">{formatCurrency(parseFloat(p.amount))}</span>
                                                            {p.status === 'Verified' && (
                                                                <Button onClick={() => openReceipt(p, selectedBooking)} className="h-7 rounded-lg bg-emerald-600 px-2 text-[10px] font-black uppercase text-white"><Printer className="size-3" /> Receipt</Button>
                                                            )}
                                                            {p.proof_url && (
                                                                <a href={p.proof_url} target="_blank" className="inline-flex items-center gap-1 rounded-lg border bg-white px-2 py-1 text-[10px] font-black uppercase text-blue-600 hover:bg-blue-50"><ExternalLink className="size-3" /> Proof</a>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {/* Verification log */}
                                                    {p.status === 'Verified' && (
                                                        <div className="mt-3 flex items-center gap-2 rounded-lg bg-white px-3 py-2 border border-emerald-100">
                                                            <ShieldCheck className="size-3.5 text-emerald-600" />
                                                            <span className="text-[10px] font-black uppercase text-emerald-800">Confirmed by {p.verified_by?.name || 'Admin'} {p.verified_by?.email ? `• ${p.verified_by.email}` : ''}</span>
                                                            <span className="ml-auto flex items-center gap-1 text-[10px] font-bold text-neutral-500"><Clock3 className="size-3" /> {p.verified_at ? new Date(p.verified_at).toLocaleString() : '—'}</span>
                                                        </div>
                                                    )}
                                                    {p.status === 'Pending' && (
                                                        <div className="mt-3 flex items-center gap-2 rounded-lg bg-violet-100/60 px-3 py-2 border border-violet-100">
                                                            <Clock3 className="size-3.5 text-violet-600" />
                                                            <span className="text-[10px] font-bold uppercase text-violet-700">Awaiting admin verification • Submitted {p.created_at ? new Date(p.created_at).toLocaleString() : new Date(p.payment_date).toLocaleString()}</span>
                                                        </div>
                                                    )}
                                                    {p.status === 'Rejected' && (
                                                        <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 border border-red-100">
                                                            <XCircle className="size-3.5 text-red-600" />
                                                            <span className="text-[10px] font-black uppercase text-red-700">Rejected {p.rejected_by?.name ? `by ${p.rejected_by.name}` : ''} {p.rejected_at ? `• ${new Date(p.rejected_at).toLocaleString()}` : ''}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="rounded-xl border border-dashed bg-neutral-50 px-6 py-10 text-center">
                                            <Banknote className="mx-auto size-8 text-neutral-300" />
                                            <p className="mt-2 text-[13px] font-bold text-neutral-500">No payments recorded yet</p>
                                            <p className="text-[11px] font-medium text-neutral-400">Resident has not uploaded proof or admin has not recorded payment.</p>
                                        </div>
                                    )}
                                </section>

                                {/* Summary Payment Log Table */}
                                {selectedBooking.invoice?.payments?.some((p: any) => p.status === 'Verified') && (
                                    <section className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-5">
                                        <h3 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-emerald-700 mb-3"><ShieldCheck className="size-3.5" /> Reservation Payment Log — Who Confirmed & When</h3>
                                        <div className="overflow-hidden rounded-xl border bg-white">
                                            <table className="w-full text-left">
                                                <thead className="bg-neutral-50">
                                                    <tr className="text-[10px] font-black uppercase text-neutral-400">
                                                        <th className="px-4 py-2">Payment #</th>
                                                        <th className="px-4 py-2">Amount</th>
                                                        <th className="px-4 py-2">Confirmed By</th>
                                                        <th className="px-4 py-2 text-right">Date & Time</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y text-[12px]">
                                                    {selectedBooking.invoice.payments.filter((p: any) => p.status === 'Verified').map((p: any) => (
                                                        <tr key={`logrow-${p.id}`} className="font-bold">
                                                            <td className="px-4 py-2.5">#{p.id} • {p.payment_method}</td>
                                                            <td className="px-4 py-2.5 text-emerald-700">{formatCurrency(parseFloat(p.amount))}</td>
                                                            <td className="px-4 py-2.5">{p.verified_by?.name || 'Admin'}<span className="block text-[11px] font-medium text-neutral-400">{p.verified_by?.email || ''}</span></td>
                                                            <td className="px-4 py-2.5 text-right font-black">{p.verified_at ? new Date(p.verified_at).toLocaleString() : '—'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </section>
                                )}
                            </div>
                            <div className="shrink-0 border-t bg-neutral-50/50 px-8 py-4 flex items-center justify-between">
                                <p className="text-[11px] font-bold text-neutral-500">Keep this log for audit purposes. Confirmed payments cannot be edited without creating a new record.</p>
                                <Button onClick={() => setIsPaymentLogOpen(false)} className="rounded-xl bg-[#0A2540] px-6 text-[12px] font-black uppercase text-white">Close</Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* RECEIPT MODAL */}
            <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden rounded-[2rem] border-none bg-white p-0 shadow-2xl dark:bg-neutral-900 flex flex-col" style={{ fontFamily: fontStack }}>
                    {receiptPayment && (
                        <>
                            <div className="shrink-0 bg-white px-8 pt-8 pb-6 border-b text-center">
                                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"><Receipt className="size-6" /></div>
                                <h2 className="mt-3 text-[18px] font-black uppercase tracking-tight">Payment Confirmation Receipt</h2>
                                <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">Official Receipt • HOA Reservation Payment</p>
                                <div className="mt-4 grid grid-cols-2 gap-4 text-left rounded-2xl bg-neutral-50 p-4 border">
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-neutral-400">Receipt #</p>
                                        <p className="text-[13px] font-black">PAY-{receiptPayment.id} • {receiptPayment.invoice?.invoice_number || selectedBooking?.invoice?.invoice_number || ''}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase text-neutral-400">Date Issued</p>
                                        <p className="text-[13px] font-bold">{receiptPayment.verified_at ? new Date(receiptPayment.verified_at).toLocaleString() : new Date().toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5 text-[13px]">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-neutral-400">Billed To</p>
                                        <p className="font-black">{selectedBooking?.resident?.first_name} {selectedBooking?.resident?.last_name}</p>
                                        <p className="text-[11px] font-bold text-neutral-500">{selectedBooking?.facility?.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase text-neutral-400">Payment Details</p>
                                        <p className="font-bold">{receiptPayment.payment_method} • {formatCurrency(parseFloat(receiptPayment.amount))}</p>
                                        <p className="text-[11px] font-bold text-neutral-500">Ref: {receiptPayment.reference_number || '—'}</p>
                                    </div>
                                </div>
                                <div className="rounded-xl border bg-emerald-50/50 p-4 border-emerald-100">
                                    <p className="text-[10px] font-black uppercase text-emerald-700">Amount Confirmed</p>
                                    <p className="text-[24px] font-black text-emerald-700">{formatCurrency(parseFloat(receiptPayment.amount))}</p>
                                    <div className="mt-2 flex items-center gap-2 text-[11px] font-bold text-emerald-700"><ShieldCheck className="size-4" /> Verified by {receiptPayment.verified_by?.name || 'Admin'} on {receiptPayment.verified_at ? new Date(receiptPayment.verified_at).toLocaleString() : '—'}</div>
                                </div>
                                {selectedBooking && (() => { const b = calculateBreakdown(selectedBooking); return b ? <div className="rounded-xl border bg-blue-50/50 p-4 border-blue-100"><p className="text-[11px] font-black uppercase text-blue-700 mb-1">Reservation Breakdown</p><p className="text-[12px] font-bold">{selectedBooking.facility?.name} • {b.label} = {formatCurrency(b.total)}</p></div> : null; })()}
                                <p className="text-center text-[10px] font-bold uppercase tracking-widest text-neutral-400 pt-2">This is a computer-generated receipt. Keep for your records.</p>
                            </div>
                            <div className="shrink-0 border-t px-8 py-4 flex gap-3 bg-neutral-50/50">
                                <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setIsReceiptOpen(false)}>Close</Button>
                                <Button className="flex-1 rounded-xl bg-blue-600 text-white hover:bg-blue-700" onClick={() => window.print()}><Printer className="size-4 mr-2" /> Print / Save PDF</Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

BookingIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Facilities', href: '/admin/facilities' },
        { title: 'Reservations Center', href: '/admin/bookings' },
    ],
};
