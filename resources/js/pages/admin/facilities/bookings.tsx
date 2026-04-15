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
    LayoutList,
    ChevronRight,
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
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

const fontStack = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif';

export default function BookingIndex({ bookings }: { bookings: any[] }) {
    const { flash } = usePage<any>().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const [currentDate, setCurrentDate] = useState(new Date());

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
                                                    <DropdownMenuItem 
                                                        className="gap-2 font-bold text-[12px]"
                                                        onSelect={() => handleStatusUpdate(booking.id, 'Confirmed')}
                                                    >
                                                        <CheckCircle2 className="size-4 text-emerald-600" /> Approve
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        className="gap-2 font-bold text-[12px]"
                                                        onSelect={() => handleStatusUpdate(booking.id, 'Cancelled')}
                                                    >
                                                        <XCircle className="size-4 text-rose-600" /> Decline
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
