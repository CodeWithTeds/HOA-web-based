import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isBefore, startOfDay, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BookingCalendarProps {
    bookedDates: string[];
    selectedDate?: string;
    onDateSelect: (date: string) => void;
    disabled?: boolean;
}

const fontStack = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif';

export function BookingCalendar({ bookedDates, selectedDate, onDateSelect, disabled = false }: BookingCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const days = useMemo(() => eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
    }), [currentDate]);

    const startDay = days[0].getDay();
    const padding = Array.from({ length: startDay }).map(() => null);

    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    const today = startOfDay(new Date());
    const bookedSet = new Set(bookedDates);

    const isDateBooked = (date: Date) => bookedSet.has(format(date, 'yyyy-MM-dd'));
    const isDateSelected = (date: Date) => selectedDate && isSameDay(date, parseISO(selectedDate));
    const isDateDisabled = (date: Date) => isBefore(startOfDay(date), today) || isDateBooked(date);

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden" style={{ fontFamily: fontStack }}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                <Button onClick={prevMonth} variant="ghost" className="size-8 p-0 rounded-lg" disabled={disabled} aria-label="Previous month">
                    <ChevronLeft className="size-4" />
                </Button>
                <div className="flex items-center gap-2">
                    <CalendarIcon className="size-4 text-neutral-400" />
                    <span className="font-black text-[13px] text-neutral-700 dark:text-neutral-300 min-w-[140px] text-center">
                        {format(currentDate, 'MMMM yyyy')}
                    </span>
                </div>
                <Button onClick={nextMonth} variant="ghost" className="size-8 p-0 rounded-lg" disabled={disabled} aria-label="Next month">
                    <ChevronRight className="size-4" />
                </Button>
            </div>

            <div className="grid grid-cols-7 gap-px bg-neutral-100 dark:bg-neutral-800 p-px">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="bg-neutral-50/50 dark:bg-neutral-900/50 py-2 text-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{day}</span>
                    </div>
                ))}

                {padding.map((_, i) => (
                    <div key={`pad-${i}`} className="bg-white dark:bg-neutral-900 min-h-[44px]" />
                ))}

                {days.map(day => {
                    const booked = isDateBooked(day);
                    const selected = isDateSelected(day);
                    const isToday = isSameDay(day, today);
                    const disabled_ = isDateDisabled(day);

                    return (
                        <button
                            key={day.toISOString()}
                            onClick={() => !disabled_ && !disabled && onDateSelect(format(day, 'yyyy-MM-dd'))}
                            disabled={disabled_ || disabled}
                            className={cn(
                                "relative bg-white dark:bg-neutral-900 min-h-[44px] flex items-center justify-center transition-all",
                                "text-[13px] font-medium",
                                booked && "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400",
                                selected && "bg-blue-600 text-white shadow-lg shadow-blue-500/25",
                                isToday && !booked && !selected && "text-blue-600 dark:text-blue-400 font-black",
                                disabled_ && "text-neutral-300 dark:text-neutral-600 cursor-not-allowed",
                                "hover:!bg-neutral-50 dark:hover:!bg-neutral-800",
                                "active:scale-95"
                            )}
                            aria-label={format(day, 'MMMM d, yyyy')}
                            aria-disabled={disabled_ || disabled}
                            aria-selected={selected ? 'true' : 'false'}
                        >
                            <span className="relative z-10">{format(day, 'd')}</span>
                            {booked && !selected && (
                                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 size-1.5 rounded-full bg-red-500" aria-hidden="true" />
                            )}
                            {isToday && !booked && !selected && (
                                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 size-1.5 rounded-full bg-blue-600" aria-hidden="true" />
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="px-4 py-3 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                <div className="flex items-center justify-center gap-6 text-[11px] font-bold">
                    <div className="flex items-center gap-1.5 text-neutral-500">
                        <span className="size-2.5 rounded-full bg-red-500" />
                        <span>Booked</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-500">
                        <span className="size-2.5 rounded-full bg-blue-600" />
                        <span>Selected</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-500">
                        <span className="size-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                        <span>Unavailable</span>
                    </div>
                </div>
            </div>
        </div>
    );
}