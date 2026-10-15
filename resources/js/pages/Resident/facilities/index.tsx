import { Head, useForm, usePage } from '@inertiajs/react';
import { Calendar, Clock, Users, Tag, Loader2, Sparkles, AlertCircle, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { BookingCalendar } from '@/components/BookingCalendar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface Facility {
    id: number;
    name: string;
    description: string;
    capacity: number;
    base_price: number;
    price_type: string;
    status: string;
    image_path: string | null;
}

const fontStack = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif';

const PURPOSE_OPTIONS = [
    { value: 'Birthday Party', label: 'Birthday Party' },
    { value: 'Wedding Reception', label: 'Wedding Reception' },
    { value: 'Anniversary Celebration', label: 'Anniversary Celebration' },
    { value: 'Family Reunion', label: 'Family Reunion' },
    { value: 'Corporate Event', label: 'Corporate Event' },
    { value: 'Meeting/Conference', label: 'Meeting/Conference' },
    { value: 'Seminar/Workshop', label: 'Seminar/Workshop' },
    { value: 'Training Session', label: 'Training Session' },
    { value: 'Community Gathering', label: 'Community Gathering' },
    { value: 'Sports Activity', label: 'Sports Activity' },
    { value: 'Fitness Class', label: 'Fitness Class' },
    { value: 'Religious Activity', label: 'Religious Activity' },
    { value: 'Cultural Event', label: 'Cultural Event' },
    { value: 'Graduation Party', label: 'Graduation Party' },
    { value: 'Baby Shower', label: 'Baby Shower' },
    { value: 'Bridal Shower', label: 'Bridal Shower' },
    { value: 'Holiday Party', label: 'Holiday Party' },
    { value: 'Other', label: 'Other' },
];

export default function FacilityBooking() {
    const { facilities, flash, errors: pageErrors, hasPendingBooking, residentNotLinked } = usePage<any>().props;
    const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [bookedDates, setBookedDates] = useState<string[]>([]);
    const [isLoadingDates, setIsLoadingDates] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        facility_id: '',
        start_time: '',
        end_time: '',
        purpose: '',
        attendees: '',
        special_requests: '',
    });

    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: flash.success,
                confirmButtonColor: '#10b981',
                confirmButtonText: 'Go to Billing',
                showCancelButton: true,
                cancelButtonText: 'Close',
                background: '#ffffff',
                customClass: {
                    popup: 'rounded-3xl shadow-2xl',
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/billing';
                }
            });
            setIsDialogOpen(false);
            reset();
        }
    }, [flash]);

    const handleBookClick = (facility: Facility) => {
        setSelectedFacility(facility);
        setData('facility_id', facility.id.toString());
        clearErrors();
        setIsDialogOpen(true);
    };

    useEffect(() => {
        if (selectedFacility && isDialogOpen) {
            fetchBookedDates(selectedFacility.id);
        }
    }, [selectedFacility, isDialogOpen]);


    const fetchBookedDates = async (facilityId: number) => {
        setIsLoadingDates(true);

        try {
            const response = await fetch(`/facilities/booked-dates?facility_id=${facilityId}`);
            const data = await response.json();
            setBookedDates(data.dates || []);
        } catch (error) {
            console.error('Failed to fetch booked dates:', error);
            setBookedDates([]);
        } finally {
            setIsLoadingDates(false);
        }
    };

    const submitBooking = (e: React.FormEvent) => {
        e.preventDefault();
        post('/facilities/book', {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsDialogOpen(false);
                reset();
            }
        });
    };

    const formatCurrency = (amt: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amt);
    };

    return (
        <>
            <Head title="Facility Booking | Resident Portal" />

            <div className="flex h-full flex-1 flex-col gap-8 p-4 md:p-8 animate-in fade-in duration-700 bg-neutral-50/50 dark:bg-black min-h-screen">
                {/* Header Section */}
                <div className="flex flex-col gap-4 relative overflow-hidden rounded-3xl bg-neutral-900 p-8 text-white shadow-2xl md:p-12">
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"></div>
                    
                    <div className="relative z-10 flex flex-col gap-2 max-w-2xl">
                        <Badge variant="outline" className="w-fit bg-white/10 text-white border-white/20 px-3 py-1 text-xs uppercase tracking-widest font-bold backdrop-blur-md">
                            <Sparkles className="mr-2 h-3 w-3 text-emerald-400" /> Premium Amenities
                        </Badge>
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400">
                            Reserve Your Space
                        </h1>
                        <p className="text-lg font-medium text-neutral-300 leading-relaxed mt-2">
                            Explore our world-class facilities. Whether you are hosting a grand event or seeking a quiet retreat, we have the perfect venue for your needs.
                        </p>
                    </div>
                </div>

                {hasPendingBooking && (
                    <div className="flex items-center gap-4 rounded-3xl bg-amber-500/10 p-6 border border-amber-500/20 shadow-lg relative overflow-hidden mt-2">
                        <div className="absolute left-0 top-0 bottom-0 w-2 bg-amber-500"></div>
                        <AlertCircle className="h-8 w-8 text-amber-500 shrink-0" />
                        <div>
                            <h3 className="text-lg font-bold text-amber-600 dark:text-amber-400">Pending Booking Found</h3>
                            <p className="text-sm font-medium text-amber-700/80 dark:text-amber-500/80">
                                You already have a pending facility booking. You can only book another facility once your previous request has been approved or completed.
                            </p>
                        </div>
                    </div>
                )}

                {residentNotLinked && (
                    <div className="flex items-center gap-4 rounded-3xl bg-red-500/10 p-6 border border-red-500/20 shadow-lg relative overflow-hidden mt-2">
                        <div className="absolute left-0 top-0 bottom-0 w-2 bg-red-500"></div>
                        <AlertCircle className="h-8 w-8 text-red-500 shrink-0" />
                        <div>
                            <h3 className="text-lg font-bold text-red-600 dark:text-red-400">Account Not Linked</h3>
                            <p className="text-sm font-medium text-red-700/80 dark:text-red-500/80">
                                Your login account is not yet linked to a resident profile. Please contact the HOA office to connect your account so you can make bookings and view billing.
                            </p>
                        </div>
                    </div>
                )}

                {/* Facilities Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {facilities?.length > 0 ? facilities.map((facility: Facility) => (
                        <Card key={facility.id} className="group relative overflow-hidden border-none shadow-lg bg-white dark:bg-neutral-900 rounded-3xl transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity" />
                            
                            {/* Image Background */}
                            <div className="absolute inset-0 w-full h-full">
                                {facility.image_path ? (
                                    <img 
                                        src={facility.image_path} 
                                        alt={facility.name} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                                        <Calendar className="h-16 w-16 text-neutral-400 opacity-20" />
                                    </div>
                                )}
                            </div>

                            {/* Status Badge */}
                            <div className="absolute top-4 right-4 z-20">
                                <Badge className={cn(
                                    "px-2 py-1 text-[10px] font-bold rounded-full shadow-md backdrop-blur-md border-none",
                                    facility.status === 'Active' ? "bg-emerald-500/90 text-white" : "bg-red-500/90 text-white"
                                )}>
                                    {facility.status}
                                </Badge>
                            </div>

                            <CardHeader className="relative z-20 pt-32 pb-0">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-white tracking-tight drop-shadow-md">
                                        {facility.name}
                                    </h3>
                                    <p className="text-xs font-medium text-neutral-300 line-clamp-2 drop-shadow-md">
                                        {facility.description}
                                    </p>
                                </div>
                            </CardHeader>

                            <CardContent className="relative z-20 mt-4 grid grid-cols-2 gap-2 pb-0 text-white">
                                <div className="flex items-center gap-2 rounded-xl bg-white/10 p-2 backdrop-blur-md border border-white/10">
                                    <Users className="h-4 w-4 text-emerald-400" />
                                    <div className="flex flex-col">
                                        <span className="text-[9px] uppercase font-bold text-neutral-400 tracking-wider">Capacity</span>
                                        <span className="text-xs font-bold">{facility.capacity} pax</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 rounded-xl bg-white/10 p-2 backdrop-blur-md border border-white/10">
                                    <Tag className="h-4 w-4 text-blue-400" />
                                    <div className="flex flex-col">
                                        <span className="text-[9px] uppercase font-bold text-neutral-400 tracking-wider">{facility.price_type}</span>
                                        <span className="text-xs font-bold">{formatCurrency(facility.base_price)}</span>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="relative z-20 pt-4 pb-4 mt-auto">
                                <Button 
                                    onClick={() => handleBookClick(facility)}
                                    disabled={facility.status !== 'Active' || hasPendingBooking}
                                    className={cn("w-full rounded-xl bg-white text-black hover:bg-neutral-200 font-bold tracking-wide h-10 text-sm shadow-lg transition-all", hasPendingBooking && "opacity-50 cursor-not-allowed")}
                                >
                                    {facility.status === 'Active' ? (hasPendingBooking ? 'Pending Booking Exists' : 'Book This Space') : 'Currently Unavailable'}
                                </Button>
                            </CardFooter>
                        </Card>
                    )) : (
                        <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 p-20 text-center bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl">
                            <div className="rounded-full bg-neutral-100 dark:bg-neutral-800 p-6 mb-4">
                                <Calendar className="h-10 w-10 text-neutral-400" />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">No Facilities Available</h3>
                            <p className="mt-2 text-neutral-500 max-w-md">There are currently no facilities available for booking. Please check back later.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Booking Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);

                if (!open) {
                    setBookedDates([]);
                    setSelectedFacility(null);
                }
            }}>
                <DialogContent className="sm:max-w-[900px] rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl bg-white dark:bg-neutral-900 grid grid-cols-1 md:grid-cols-5">
                    
                    {/* Left Column: Facility Details */}
                    <div className="md:col-span-2 bg-neutral-900 p-8 text-white relative flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl -ml-10 -mb-10"></div>
                        
                        <div className="relative z-10">
                            <Badge variant="outline" className="mb-4 bg-white/10 text-white border-white/20 px-3 py-1 text-[10px] uppercase tracking-widest font-bold backdrop-blur-md">
                                Reservation
                            </Badge>
                            <DialogHeader>
                                <DialogTitle className="text-3xl font-black tracking-tight text-white leading-tight">
                                    {selectedFacility?.name}
                                </DialogTitle>
                                <DialogDescription className="text-neutral-300 text-sm mt-3 font-medium leading-relaxed">
                                    {selectedFacility?.description}
                                </DialogDescription>
                            </DialogHeader>

                            {selectedFacility && (
                                <div className="mt-8 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-xl bg-white/10 p-2 backdrop-blur-md border border-white/10">
                                            <Users className="h-4 w-4 text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Capacity</p>
                                            <p className="text-sm font-bold">{selectedFacility.capacity} Guests Max</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-xl bg-white/10 p-2 backdrop-blur-md border border-white/10">
                                            <Tag className="h-4 w-4 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Pricing ({selectedFacility.price_type})</p>
                                            <p className="text-sm font-bold">{formatCurrency(selectedFacility.base_price)}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative z-10 mt-8 pt-6 border-t border-white/10">
                            <p className="text-xs text-neutral-400 italic">
                                * Final total fee will be calculated based on your selected schedule upon confirmation. By booking, you agree to our terms of service.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <form onSubmit={submitBooking} className="md:col-span-3 flex flex-col justify-between bg-white dark:bg-[#0c0c0c] max-h-[85vh]" style={{ fontFamily: fontStack }}>
                        {/* ─── HEADER ─── */}
                        <div className="shrink-0 px-8 py-6 border-b border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/30 dark:bg-neutral-900/40">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center size-10 rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20">
                                    <Calendar className="size-5 text-white" strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h1 className="text-[20px] font-black tracking-tight text-[#0A2540] dark:text-white">
                                        New Reservation Request
                                    </h1>
                                    <p className="text-[12px] text-neutral-400 font-bold tracking-wide uppercase mt-0.5">
                                        {selectedFacility?.name}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ─── SCROLLABLE FORM ─── */}
                        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8">
                            {pageErrors.conflict && (
                                <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3">
                                    <AlertCircle className="size-5 text-red-600 shrink-0" />
                                    <p className="text-[12px] font-black text-red-600 tracking-tight">{pageErrors.conflict}</p>
                                </div>
                            )}

                            {Object.keys(errors).length > 0 && (
                                <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex flex-col gap-2">
                                    <p className="text-[12px] font-black text-red-600 tracking-tight uppercase">Please fix the following errors:</p>
                                    <ul className="list-disc pl-5">
                                        {Object.entries(errors).map(([key, error]) => (
                                            <li key={key} className="text-[11px] font-bold text-red-600">{error as string}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* SCHEDULE */}
                            <div className="space-y-6">
                                <div className="flex items-start gap-4 mb-6 relative pl-4">
                                    <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-blue-600 rounded-full" />
                                    <div className="flex items-center justify-center size-8 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                                        <Clock className="size-4.5" />
                                    </div>
                                    <div>
                                        <h2 className="text-[15px] font-black tracking-tight text-[#0A2540] dark:text-white uppercase">Schedule & Details</h2>
                                        <p className="text-[12px] text-neutral-400 font-bold mt-0.5">Define interval and purpose for usage.</p>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 p-4">
                                    <p className="text-[11px] font-black uppercase text-neutral-400 mb-3">Select a date from the calendar below</p>
                                    <BookingCalendar
                                        bookedDates={bookedDates}
                                        selectedDate={data.start_time ? data.start_time.split('T')[0] : undefined}
                                        onDateSelect={(date) => {
                                            const currentStart = data.start_time ? data.start_time.split('T')[1] : '09:00';
                                            const currentEnd = data.end_time ? data.end_time.split('T')[1] : '10:00';
                                            setData('start_time', `${date}T${currentStart}`);
                                            setData('end_time', `${date}T${currentEnd}`);
                                        }}
                                        disabled={isLoadingDates}
                                    />
                                    {isLoadingDates && (
                                        <div className="mt-4 flex items-center justify-center gap-2 text-neutral-500">
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            <span className="text-sm">Loading booked dates...</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Start Date & Time <span className="text-red-500">*</span></Label>
                                        <Input type="datetime-local" value={data.start_time} onChange={e => setData('start_time', e.target.value)} className="h-10 rounded-xl text-[13px] font-black border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900" />
                                        {errors.start_time && <p className="text-[10px] font-bold text-red-500">⚠ {errors.start_time}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">End Date & Time <span className="text-red-500">*</span></Label>
                                        <Input type="datetime-local" value={data.end_time} onChange={e => setData('end_time', e.target.value)} className="h-10 rounded-xl text-[13px] font-black border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900" />
                                        {errors.end_time && <p className="text-[10px] font-bold text-red-500">⚠ {errors.end_time}</p>}
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Purpose / Occasion <span className="text-red-500">*</span></Label>
                                        <Select value={data.purpose} onValueChange={(value) => setData('purpose', value)}>
                                            <SelectTrigger className="h-10 rounded-xl text-[13px] font-black border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                                                <SelectValue placeholder="Select purpose/occasion" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PURPOSE_OPTIONS.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.purpose && <p className="text-[10px] font-bold text-red-500">⚠ {errors.purpose}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-black uppercase text-neutral-400">Attendees <span className="text-red-500">*</span></Label>
                                        <Input type="number" min="1" max={selectedFacility?.capacity} value={data.attendees} onChange={e => setData('attendees', e.target.value)} placeholder={`e.g. 50 (max ${selectedFacility?.capacity ?? '—'})`} className={cn("h-10 rounded-xl text-[13px] font-black border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900", data.attendees && selectedFacility && Number(data.attendees) > selectedFacility.capacity && "border-red-500 focus:ring-red-500/10")} />
                                        {errors.attendees && <p className="text-[10px] font-bold text-red-500">⚠ {errors.attendees}</p>}
                                        {data.attendees && selectedFacility && Number(data.attendees) > selectedFacility.capacity && !errors.attendees && (
                                            <p className="text-[10px] font-bold text-red-500">⚠ Exceeds maximum capacity of {selectedFacility.capacity} guests</p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="space-y-1.5 pt-2">
                                    <Label className="text-[11px] font-black uppercase text-neutral-400">Additional Remarks</Label>
                                    <textarea 
                                        value={data.special_requests} 
                                        onChange={e => setData('special_requests', e.target.value)}
                                        rows={3}
                                        placeholder="Any special requests or notes for the admin..."
                                        className="w-full mt-1.5 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[13px] font-bold dark:bg-neutral-900 dark:border-neutral-800 focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all resize-none"
                                    />
                                    {errors.special_requests && <p className="text-[10px] font-bold text-red-500">⚠ {errors.special_requests}</p>}
                                </div>
                            </div>

                            <div className="mt-8 p-6 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 flex gap-4">
                                <AlertCircle className="size-5 text-amber-600 shrink-0 mt-0.5" />
                                <div className="text-[12px] font-bold text-amber-800 dark:text-amber-500 leading-relaxed">
                                    <p className="uppercase text-[10px] font-black mb-1 tracking-wider">Conflict Notice</p>
                                    The system will automatically check for overlapping schedules upon submission. If the facility is already booked for the selected time, the request will be rejected to prevent double-booking.
                                </div>
                            </div>
                        </div>

                        {/* ─── STICKY FOOTER ─── */}
                        <div className="shrink-0 bg-white dark:bg-[#0c0c0c] border-t border-neutral-100 dark:border-neutral-800/60 px-8 py-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-neutral-400">
                                    <Info className="size-4" />
                                    <p className="text-[12px] font-bold uppercase tracking-wider">Subject to approval</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="h-10 rounded-xl px-6 text-[13px] font-black text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800">
                                        Discard
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing || (data.attendees !== '' && selectedFacility !== null && Number(data.attendees) > selectedFacility.capacity)}
                                        className="h-10 rounded-xl px-8 text-[13px] font-black bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="mr-2 size-4 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            'Secure Booking'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

FacilityBooking.layout = {
    breadcrumbs: [
        {
            title: 'Facility Booking',
            href: '/facilities',
        },
    ],
};
