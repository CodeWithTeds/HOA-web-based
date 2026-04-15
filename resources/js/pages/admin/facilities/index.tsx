import { Head, Link, usePage, router } from '@inertiajs/react';
import {
    Search,
    Filter,
    Plus,
    MoreHorizontal,
    Pencil,
    Trash2,
    Home,
    Users,
    DollarSign,
    Box,
    LayoutGrid,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SweetAlert } from '@/components/ui/sweet-alert';
import { useState, useEffect } from 'react';

const fontStack = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif';

export default function FacilityIndex({ facilities }: { facilities: any[] }) {
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

    const filteredFacilities = facilities.filter(f => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Head title="Facility Management" />
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
                            <div className="flex items-center justify-center size-10 rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20">
                                <Box className="size-5 text-white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-[22px] font-black tracking-tight text-[#0A2540] dark:text-white">
                                    Community Facilities
                                </h1>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[12px] font-bold text-neutral-400 uppercase tracking-wider">Asset Management</span>
                                    <span className="size-1 rounded-full bg-neutral-300" />
                                    <span className="text-[12px] font-bold text-blue-600">{facilities.length} Total Facilities</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link href="/admin/bookings">
                                <Button variant="outline" className="h-10 rounded-xl border-neutral-200 font-bold text-[13px] gap-2 px-4 hover:bg-neutral-50 active:scale-95 transition-all">
                                    View Bookings
                                </Button>
                            </Link>
                            <Link href="/admin/facilities/create">
                                <Button className="h-10 gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 shadow-lg shadow-blue-600/10 active:scale-95 transition-all">
                                    <Plus className="size-4" strokeWidth={3} /> Add Facility
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ─── COMPACT TOOLBAR ─── */}
                <div className="shrink-0 px-8 py-3.5 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/40 border-b border-neutral-100 dark:border-neutral-800/60">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search facilities..."
                                className="h-9 w-[300px] rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 pl-9 pr-4 text-[13px] font-medium placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* ─── FACILITY GRID ─── */}
                <div className="flex-1 overflow-auto p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredFacilities.map((facility) => (
                            <div key={facility.id} className="group relative flex flex-col rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden hover:shadow-xl hover:shadow-neutral-200/40 dark:hover:shadow-none transition-all duration-300">
                                <div className="aspect-video bg-neutral-100 dark:bg-neutral-800 relative">
                                    {facility.image_path ? (
                                        <img src={facility.image_path} alt={facility.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <Box className="size-12 text-neutral-300 dark:text-neutral-700" strokeWidth={1} />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4">
                                        <Badge className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                            facility.status === 'Active'
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : facility.status === 'Under Maintenance'
                                                    ? 'bg-amber-50 text-amber-700'
                                                    : 'bg-rose-50 text-rose-700'
                                        }`}>
                                            {facility.status}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-[17px] font-black tracking-tight text-[#0A2540] dark:text-white group-hover:text-blue-600 transition-colors">
                                        {facility.name}
                                    </h3>
                                    <p className="text-[13px] text-neutral-400 mt-1 line-clamp-2 font-medium leading-relaxed">
                                        {facility.description || 'No description provided.'}
                                    </p>
                                    
                                    <div className="mt-6 flex items-center justify-between border-t border-neutral-50 dark:border-neutral-800/60 pt-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase font-black tracking-widest text-neutral-400">Capacity</span>
                                                <span className="text-[14px] font-bold text-[#0A2540] dark:text-neutral-200">{facility.capacity} pax</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase font-black tracking-widest text-neutral-400">Rate</span>
                                                <span className="text-[14px] font-bold text-blue-600">₱{facility.base_price} <span className="text-[10px] text-neutral-400 font-medium">/{facility.price_type}</span></span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" className="size-8 p-0 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl">
                                                <Pencil className="size-3.5 text-neutral-400" />
                                            </Button>
                                            <Button variant="ghost" className="size-8 p-0 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl group/del">
                                                <Trash2 className="size-3.5 text-neutral-400 group-hover/del:text-rose-600 transition-colors" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {filteredFacilities.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <div className="size-20 rounded-[2rem] bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 flex items-center justify-center shadow-sm">
                                <Box className="size-10 text-neutral-200 dark:text-neutral-700" strokeWidth={1.5} />
                            </div>
                            <div className="text-center max-w-[400px]">
                                <p className="text-[16px] font-black tracking-tight text-[#0A2540] dark:text-neutral-200">No facilities found</p>
                                <p className="text-[13px] text-neutral-400 mt-2 font-bold leading-relaxed">
                                    Start by adding a new community facility like a Clubhouse, Pool, or Basketball Court.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

FacilityIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Facility Management', href: '/admin/facilities' },
    ],
};
