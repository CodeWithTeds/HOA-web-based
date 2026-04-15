import { Head, Link, usePage, router } from '@inertiajs/react';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SweetAlert } from '@/components/ui/sweet-alert';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

const fontStack = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif';

export default function BookingIndex({ bookings }: { bookings: any[] }) {
    const { flash } = usePage<any>().props;
    const [searchQuery, setSearchQuery] = useState('');

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
    }, [flash]);

    const filteredBookings = bookings.filter(b => 
        b.resident?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.resident?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.facility?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                <div className="shrink-0 px-8 py-6 border-b border-neutral-100 dark:border-neutral-800/60">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/admin/facilities">
                                <Button variant="ghost" className="size-10 p-0 rounded-xl hover:bg-neutral-50 active:scale-95 transition-all">
                                    <ChevronLeft className="size-5" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-[22px] font-black tracking-tight text-[#0A2540] dark:text-white">
                                    Reservation Management
                                </h1>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[12px] font-bold text-neutral-400 uppercase tracking-wider">Facility Bookings</span>
                                    <span className="size-1 rounded-full bg-neutral-300" />
                                    <span className="text-[12px] font-bold text-blue-600">{bookings.length} Total Requests</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button className="h-10 gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 shadow-lg shadow-blue-600/10 active:scale-95 transition-all">
                                <Calendar className="size-4" /> New Reservation
                            </Button>
                        </div>
                    </div>
                </div>

                {/* ─── TOOLBAR ─── */}
                <div className="shrink-0 px-8 py-3.5 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/40 border-b border-neutral-100 dark:border-neutral-800/60">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search by resident or facility..."
                            className="h-9 w-[300px] rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 pl-9 pr-4 text-[13px] font-medium placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all"
                        />
                    </div>
                </div>

                {/* ─── TABLE ─── */}
                <div className="min-h-0 flex-1 overflow-auto">
                    <table className="w-full text-left table-fixed border-separate border-spacing-0">
                        <thead className="sticky top-0 z-20 bg-neutral-50/80 dark:bg-neutral-900/80 backdrop-blur-md">
                            <tr>
                                <th className="pl-8 px-3 py-3 text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-800/60">Resident</th>
                                <th className="px-3 py-3 text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-800/60">Facility</th>
                                <th className="px-3 py-3 text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-800/60">Date & Time</th>
                                <th className="px-3 py-3 text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-800/60">Fee</th>
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
                                                <span className="text-[11px] font-medium text-neutral-400">Resident ID #{booking.resident_id}</span>
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
                                        ${booking.total_fee}
                                    </td>
                                    <td className="px-3 py-4 text-center">
                                        <Badge className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                            booking.status === 'Confirmed'
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
                                            <DropdownMenuContent align="end" className="w-40 rounded-xl">
                                                <DropdownMenuItem className="gap-2 font-bold text-[12px]">
                                                    <CheckCircle2 className="size-4 text-emerald-600" /> Confirm
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2 font-bold text-[12px]">
                                                    <XCircle className="size-4 text-rose-600" /> Cancel
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredBookings.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <Clock className="size-16 text-neutral-100 dark:text-neutral-800" strokeWidth={1.5} />
                            <div className="text-center max-w-[300px]">
                                <p className="text-[16px] font-black text-neutral-300">No reservations records</p>
                                <p className="text-[13px] text-neutral-400 mt-2 font-bold break-words">
                                    When residents book facility slots, they will appear here for your review and approval.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

BookingIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Facilities', href: '/admin/facilities' },
        { title: 'Bookings', href: '/admin/bookings' },
    ],
};
