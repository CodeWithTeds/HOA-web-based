import { Head, Link, usePage } from '@inertiajs/react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfDay, isBefore, isEqual } from 'date-fns';
import {
    ChevronLeft,
    Calendar as CalendarIcon,
    ChevronRight,
    MapPin,
    Clock,
    User,
    Search,
    Filter,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const fontStack = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif';

export default function FacilityCalendar({ bookings = [] }: { bookings: any[] }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const todayStart = startOfDay(new Date());

    const days = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
    });

    // Padding for the start of the month
    const startDay = days[0].getDay();
    const padding = Array.from({ length: startDay }).map((_, i) => null);

    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    return (
        <>
            <Head title="Facility Calendar" />

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
                                    Community Schedule
                                </h1>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[12px] font-bold text-neutral-400 uppercase tracking-wider">Facility Roadmap</span>
                                    <span className="size-1 rounded-full bg-neutral-300" />
                                    <span className="text-[12px] font-bold text-blue-600">{format(currentDate, 'MMMM yyyy')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-1">
                                <Button onClick={prevMonth} variant="ghost" className="size-8 p-0 rounded-lg">
                                    <ChevronLeft className="size-4" />
                                </Button>
                                <div className="px-4 text-[13px] font-black min-w-[120px] text-center">
                                    {format(currentDate, 'MMM yyyy')}
                                </div>
                                <Button onClick={nextMonth} variant="ghost" className="size-8 p-0 rounded-lg">
                                    <ChevronRight className="size-4" />
                                </Button>
                            </div>
                            <Button className="h-10 gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 active:scale-95 transition-all">
                                <Filter className="size-4" /> Filter Assets
                            </Button>
                        </div>
                    </div>
                </div>

                {/* ─── CALENDAR GRID ─── */}
                <div className="flex-1 overflow-auto p-8">
                    <div className="grid grid-cols-7 gap-px bg-neutral-100 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-800 rounded-2xl overflow-hidden">
                        {/* Week Headers */}
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="bg-neutral-50/50 dark:bg-neutral-900/50 py-3 text-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{day}</span>
                            </div>
                        ))}

                        {/* Empty spacing for start of month */}
                        {padding.map((_, i) => (
                            <div key={`pad-${i}`} className="bg-white dark:bg-[#0c0c0c] min-h-[140px]" />
                        ))}

                        {/* Days */}
                        {days.map(day => {
                            const dayBookings = bookings.filter(b => isSameDay(new Date(b.start_time), day));
                            const isPastOrToday = isBefore(startOfDay(day), todayStart) || isEqual(startOfDay(day), todayStart);
                            const isToday = isSameDay(day, new Date());
                            
                            return (
                                <div
                                    key={day.toString()}
                                    className={`min-h-[140px] p-3 border-t border-l border-neutral-100 dark:border-neutral-800/40 group relative ${isPastOrToday ? 'bg-neutral-100 dark:bg-neutral-900/60 opacity-60 cursor-not-allowed' : 'bg-white dark:bg-[#0c0c0c] cursor-pointer hover:bg-blue-50/50'}`}
                                    title={isPastOrToday ? 'Past and present dates are disabled for new bookings' : 'Available for new facility bookings'}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-[14px] font-black ${isToday ? 'text-blue-600' : isPastOrToday ? 'text-neutral-300' : 'text-neutral-700 dark:text-neutral-300'}`}>
                                            {format(day, 'd')}
                                        </span>
                                        {dayBookings.length > 0 && (
                                            <span className="text-[10px] bg-blue-50 text-blue-600 font-black px-1.5 py-0.5 rounded-md">
                                                {dayBookings.length}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="space-y-1">
                                        {dayBookings.slice(0, 3).map((booking: any) => (
                                            <div key={booking.id} className={`text-[10px] p-1.5 rounded-lg border truncate font-bold ${isPastOrToday ? 'bg-neutral-200/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-neutral-500' : 'bg-blue-50/50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/40 text-blue-700 dark:text-blue-300'}`}>
                                                {booking.facility?.name}
                                            </div>
                                        ))}
                                        {dayBookings.length > 3 && (
                                            <div className="text-[10px] text-neutral-400 font-bold pl-1">
                                                + {dayBookings.length - 3} more
                                            </div>
                                        )}
                                    </div>
                                    {isPastOrToday && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 bg-white/80 dark:bg-neutral-900/80 px-2 py-1 rounded-full border">Disabled</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                {/* ─── SIDEBAR / FOOTER INFO ─── */}
                <div className="shrink-0 px-8 py-4 bg-neutral-50/50 dark:bg-neutral-900/20 border-t border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-blue-600" />
                            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-tight">Confirmed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-amber-400" />
                            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-tight">Pending Approval</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-neutral-300" />
                            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-tight">Blocked/Closed</span>
                        </div>
                    </div>
                    <div className="text-[11px] font-bold text-neutral-400 italic">
                        Click on a date to manage specific time slots.
                    </div>
                </div>
            </div>
        </>
    );
}

FacilityCalendar.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Facilities', href: '/admin/facilities' },
        { title: 'Calendar', href: '/admin/facilities/calendar' },
    ],
};
