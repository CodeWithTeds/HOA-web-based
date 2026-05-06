import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Tag, CheckCircle2, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Swal from 'sweetalert2';

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

export default function FacilityBooking() {
    const { facilities, flash, errors: pageErrors } = usePage<any>().props;
    const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
                background: '#ffffff',
                customClass: {
                    popup: 'rounded-3xl shadow-2xl',
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

    const submitBooking = (e: React.FormEvent) => {
        e.preventDefault();
        post('/facilities/book', {
            preserveScroll: true,
            onError: (errs) => {
                if (errs.conflict) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Booking Conflict',
                        text: errs.conflict,
                        confirmButtonColor: '#ef4444',
                        background: '#ffffff',
                        customClass: {
                            popup: 'rounded-3xl shadow-2xl',
                        }
                    });
                }
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
                                    disabled={facility.status !== 'Active'}
                                    className="w-full rounded-xl bg-white text-black hover:bg-neutral-200 font-bold tracking-wide h-10 text-sm shadow-lg transition-all"
                                >
                                    {facility.status === 'Active' ? 'Book This Space' : 'Currently Unavailable'}
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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                    <form onSubmit={submitBooking} className="md:col-span-3 p-8 flex flex-col justify-between bg-neutral-50 dark:bg-black/50">
                        <div className="space-y-6">
                            {pageErrors.conflict && (
                                <div className="flex items-start gap-3 rounded-2xl bg-red-50 dark:bg-red-900/20 p-4 border border-red-100 dark:border-red-900/50">
                                    <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                                    <div className="text-sm font-medium text-red-800 dark:text-red-300">
                                        {pageErrors.conflict}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="start_time" className="text-xs uppercase tracking-wider font-bold text-neutral-500 flex items-center gap-2">
                                        <Clock className="h-3 w-3" /> Start Date & Time
                                    </Label>
                                    <Input
                                        id="start_time"
                                        type="datetime-local"
                                        value={data.start_time}
                                        onChange={e => setData('start_time', e.target.value)}
                                        className={cn("h-12 rounded-xl bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 px-4", errors.start_time && "border-red-500")}
                                        required
                                    />
                                    {errors.start_time && <p className="text-xs text-red-500 font-medium px-1">{errors.start_time}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="end_time" className="text-xs uppercase tracking-wider font-bold text-neutral-500 flex items-center gap-2">
                                        <CheckCircle2 className="h-3 w-3" /> End Date & Time
                                    </Label>
                                    <Input
                                        id="end_time"
                                        type="datetime-local"
                                        value={data.end_time}
                                        onChange={e => setData('end_time', e.target.value)}
                                        className={cn("h-12 rounded-xl bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 px-4", errors.end_time && "border-red-500")}
                                        required
                                    />
                                    {errors.end_time && <p className="text-xs text-red-500 font-medium px-1">{errors.end_time}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="purpose" className="text-xs uppercase tracking-wider font-bold text-neutral-500">
                                        Event Purpose
                                    </Label>
                                    <Input
                                        id="purpose"
                                        placeholder="e.g. Birthday Party"
                                        value={data.purpose}
                                        onChange={e => setData('purpose', e.target.value)}
                                        className={cn("h-12 rounded-xl bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 px-4", errors.purpose && "border-red-500")}
                                        required
                                    />
                                    {errors.purpose && <p className="text-xs text-red-500 font-medium px-1">{errors.purpose}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="attendees" className="text-xs uppercase tracking-wider font-bold text-neutral-500">
                                        Expected Attendees
                                    </Label>
                                    <Input
                                        id="attendees"
                                        type="number"
                                        min="1"
                                        placeholder="e.g. 50"
                                        value={data.attendees}
                                        onChange={e => setData('attendees', e.target.value)}
                                        className={cn("h-12 rounded-xl bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 px-4", errors.attendees && "border-red-500")}
                                        required
                                    />
                                    {errors.attendees && <p className="text-xs text-red-500 font-medium px-1">{errors.attendees}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="special_requests" className="text-xs uppercase tracking-wider font-bold text-neutral-500">
                                    Special Requests (Optional)
                                </Label>
                                <textarea
                                    id="special_requests"
                                    placeholder="Any specific layout or setup needed?"
                                    value={data.special_requests}
                                    onChange={e => setData('special_requests', e.target.value)}
                                    className={cn("w-full h-24 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 text-sm focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white outline-none resize-none transition-all", errors.special_requests && "border-red-500 focus:ring-red-500")}
                                />
                                {errors.special_requests && <p className="text-xs text-red-500 font-medium px-1">{errors.special_requests}</p>}
                            </div>
                        </div>

                        <DialogFooter className="mt-8 flex gap-3">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsDialogOpen(false)}
                                className="h-12 rounded-xl font-bold border-neutral-200 dark:border-neutral-700 flex-1"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={processing}
                                className="h-12 rounded-xl font-bold bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 flex-[2] flex items-center justify-center gap-2 shadow-xl"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Submit Reservation'
                                )}
                            </Button>
                        </DialogFooter>
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
