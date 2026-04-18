import { Head, usePage, Link } from '@inertiajs/react';
import { HomeownerDashboard } from '@/components/homeowner-dashboard';
import { UserRole } from '@/types';
import {
    Users,
    Wallet,
    AlertCircle,
    Calendar,
    TrendingUp,
    ArrowUpRight,
    ReceiptText,
    Clock,
    CheckCircle2,
    ChevronRight,
    MessageSquare
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    description: string;
    trend?: string;
    trendUp?: boolean;
    className?: string;
}

interface MetricCardProps {
    title: string;
    subtitle: string;
    value: string;
    metric: string;
    icon: React.ElementType;
    data: any[];
    dataKey: string;
    color: string;
    isWarning?: boolean;
}

function MetricCard({ title, subtitle, value, metric, icon: Icon, data, dataKey, color, isWarning }: MetricCardProps) {
    return (
        <Card className="border-none shadow-md bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl overflow-hidden transition-all hover:shadow-lg group">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="rounded-xl bg-neutral-100 p-2 dark:bg-neutral-800 transition-colors group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700">
                        <Icon className={cn("h-5 w-5", isWarning ? "text-amber-500" : "text-neutral-600 dark:text-neutral-300")} />
                    </div>
                    <Badge variant="outline" className={cn(
                        "rounded-full px-2 py-0 text-[10px] font-bold border-none",
                        isWarning ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30" : "bg-blue-100 text-blue-600 dark:bg-blue-900/30"
                    )}>
                        {metric}
                    </Badge>
                </div>
                <CardTitle className="mt-4 text-sm font-bold text-neutral-500 uppercase tracking-wider">{title}</CardTitle>
                <CardDescription className="text-[10px] font-medium text-neutral-400">{subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-end justify-between gap-4">
                    <h3 className="text-3xl font-black tracking-tight text-neutral-900 dark:text-white truncate">
                        {value}
                    </h3>
                    <div className="h-12 w-24 shrink-0 opacity-50 transition-opacity group-hover:opacity-100">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <Area type="monotone" dataKey={dataKey} stroke={color} fill={color} fillOpacity={0.1} strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function StatCard({ title, value, icon: Icon, description, trend, trendUp, className }: StatCardProps) {
    return (
        <Card className={cn("overflow-hidden border-none shadow-md bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl transition-all hover:shadow-lg", className)}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{title}</p>
                        <h3 className="mt-1 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">{value}</h3>
                    </div>
                    <div className="rounded-2xl bg-neutral-100 p-3 dark:bg-neutral-800">
                        <Icon className="h-6 w-6 text-neutral-600 dark:text-neutral-300" />
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                    {trend && (
                        <span className={cn(
                            "flex items-center text-xs font-semibold",
                            trendUp ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                        )}>
                            <TrendingUp className={cn("mr-1 h-3 w-3", !trendUp && "rotate-180")} />
                            {trend}
                        </span>
                    )}
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{description}</p>
                </div>
            </CardContent>
        </Card>
    );
}

export default function Dashboard() {
    const { auth, stats, recentPayments, recentComplaints, upcomingBookings, monthlyRevenue, portalType } = usePage<any>().props;
    const { user } = auth || {};

    const role = user?.role as string | undefined;

    if (role === 'homeowner' || role === UserRole.HOMEOWNER) {
        return (
            <>
                <Head title="Resident Portal" />
                <HomeownerDashboard />
            </>
        );
    }

    const formatCurrency = (amt: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amt);
    };

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

    return (
        <>
            <Head title={`Admin Dashboard | HOA 2026`} />
            <div className="flex h-full flex-1 flex-col gap-8 p-4 md:p-8 animate-in fade-in duration-700">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-5xl">
                            Command Center
                        </h1>
                        <p className="text-lg font-medium text-neutral-500 dark:text-neutral-400">
                            Welcome back, <span className="text-neutral-900 dark:text-white">{user?.name}</span>. Here is your community overview.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="rounded-full border-neutral-200 dark:border-neutral-800">
                            <Clock className="mr-2 h-4 w-4" />
                            {format(new Date(), 'MMM dd, yyyy')}
                        </Button>

                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Residents"
                        value={stats?.totalResidents || 0}
                        icon={Users}
                        description="Registered homeowners"
                        trend="+2.1%"
                        trendUp
                    />
                    <StatCard
                        title="Collected Revenue"
                        value={formatCurrency(stats?.totalPaid || 0)}
                        icon={Wallet}
                        description="Total payments received"
                        trend="+12.5%"
                        trendUp
                    />
                    <StatCard
                        title="Pending Complaints"
                        value={stats?.pendingComplaints || 0}
                        icon={AlertCircle}
                        description="Active issues to resolve"
                        trend="-4%"
                        trendUp={false}
                    />
                    <StatCard
                        title="Facility Bookings"
                        value={stats?.pendingBookings || 0}
                        icon={Calendar}
                        description="Upcoming reservations"
                        className="bg-linear-to-br from-neutral-900 to-neutral-700 text-white dark:from-white dark:to-neutral-200 dark:text-neutral-900"
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Projected Revenue */}
                        <MetricCard
                            title="Projected Revenue"
                            subtitle="Accumulated billed amount"
                            value={formatCurrency(stats?.totalInvoiced || 0)}
                            metric="+100%"
                            icon={TrendingUp}
                            data={monthlyRevenue}
                            dataKey="invoiced"
                            color="#3b82f6"
                        />

                        {/* Actual Collections */}
                        <MetricCard
                            title="Actual Collections"
                            subtitle="Verified cash inflow"
                            value={formatCurrency(stats?.totalPaid || 0)}
                            metric={`${stats?.totalInvoiced > 0 ? ((stats.totalPaid / stats.totalInvoiced) * 100).toFixed(1) : 0}%`}
                            icon={CheckCircle2}
                            data={monthlyRevenue}
                            dataKey="collected"
                            color="#10b981"
                        />

                        {/* Total Receivables */}
                        <MetricCard
                            title="Total Receivables"
                            subtitle="Remaining unpaid balance"
                            value={formatCurrency(stats?.outstandingBalance || 0)}
                            metric={`${stats?.totalInvoiced > 0 ? ((stats.outstandingBalance / stats.totalInvoiced) * 100).toFixed(1) : 0}%`}
                            icon={AlertCircle}
                            data={monthlyRevenue}
                            dataKey="invoiced" // Show trend of billing
                            color="#f59e0b"
                            isWarning
                        />

                        {/* Collection Efficacy */}
                        <Card className="border-none shadow-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex flex-col justify-between overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <TrendingUp className="h-32 w-32" />
                            </div>
                            <CardHeader>
                                <CardTitle className="text-xl font-bold">Collection Efficacy</CardTitle>
                                <CardDescription className="text-neutral-400 dark:text-neutral-500 italic">Overall success rate</CardDescription>
                            </CardHeader>
                            <CardContent className="pb-8">
                                <div className="flex items-end justify-between">
                                    <div>
                                        <h3 className="text-5xl font-black tracking-tighter">
                                            {stats?.totalInvoiced > 0 ? ((stats.totalPaid / stats.totalInvoiced) * 100).toFixed(2) : 0}%
                                        </h3>
                                        <p className="mt-2 text-sm font-medium text-neutral-400">Target: 100% efficiency</p>
                                    </div>
                                    <div className="h-16 w-16">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={monthlyRevenue}>
                                                <Area type="monotone" dataKey="collected" stroke="#fff" fill="rgba(255,255,255,0.2)" strokeWidth={2} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className="mt-6 h-3 w-full bg-white/10 dark:bg-black/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 transition-all duration-1000"
                                        style={{ width: `${Math.min((stats?.totalPaid / stats?.totalInvoiced) * 100, 100)}%` }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Upcoming Bookings */}
                    <Card className="border-none shadow-md bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-bold">Facility Reservations</CardTitle>
                            <CardDescription>Scheduled for this week</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-6">
                                {upcomingBookings?.length > 0 ? upcomingBookings.map((booking: any) => (
                                    <div key={booking.id} className="flex items-start gap-4 transition-transform hover:translate-x-1">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                            <Calendar className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-bold leading-none">{booking.facility?.name}</p>
                                            <p className="text-xs text-neutral-500">
                                                {booking.resident ? `${booking.resident.first_name} ${booking.resident.last_name}` : 'Resident'}
                                            </p>
                                            <div className="mt-1 flex items-center gap-2">
                                                <Badge variant="outline" className="h-5 rounded-full px-2 text-[10px] uppercase tracking-wider border-neutral-200 dark:border-neutral-800 font-bold">
                                                    {format(new Date(booking.start_time), 'MMM d, h:mm a')}
                                                </Badge>
                                                <div className={cn(
                                                    "h-2 w-2 rounded-full",
                                                    booking.status === 'confirmed' ? "bg-emerald-500" : "bg-amber-500"
                                                )} />
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="flex flex-col items-center justify-center py-10 text-neutral-400">
                                        <Calendar className="h-10 w-10 opacity-20" />
                                        <p className="mt-2 text-sm">No upcoming bookings</p>
                                    </div>
                                )}
                            </div>
                            <Button asChild variant="secondary" className="mt-6 w-full rounded-xl py-6 font-bold tracking-tight hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors">
                                <Link href="/admin/facilities/calendar">Manage Calendar</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Recent Payments */}
                    <Card className="border-none shadow-md bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-bold">Recent Collections</CardTitle>
                                <CardDescription>Latest financial transactions</CardDescription>
                            </div>
                            <ReceiptText className="h-5 w-5 text-neutral-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-neutral-100 dark:border-neutral-800">
                                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-neutral-400">Resident</th>
                                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-neutral-400">Amount</th>
                                            <th className="pb-3 text-xs font-bold uppercase tracking-wider text-neutral-400 text-right">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                        {recentPayments?.length > 0 ? recentPayments.map((payment: any) => (
                                            <tr key={payment.id} className="group hover:bg-neutral-50/50 dark:hover:bg-neutral-800/10 transition-colors">
                                                <td className="py-4">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8 rounded-lg">
                                                            <AvatarFallback className="rounded-lg bg-neutral-100 text-[10px] dark:bg-neutral-800">
                                                                {payment.invoice?.resident ? getInitials(`${payment.invoice.resident.first_name} ${payment.invoice.resident.last_name}`) : 'R'}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <p className="text-sm font-semibold truncate max-w-[120px]">
                                                            {payment.invoice?.resident ? `${payment.invoice.resident.first_name} ${payment.invoice.resident.last_name}` : 'Resident'}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                                        {formatCurrency(payment.amount)}
                                                    </p>
                                                </td>
                                                <td className="py-4 text-right">
                                                    <p className="text-xs font-medium text-neutral-500">
                                                        {format(new Date(payment.payment_date), 'MMM d')}
                                                    </p>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={3} className="py-8 text-center text-neutral-400 text-sm">No recent payments</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pending Complaints */}
                    <Card className="border-none shadow-md bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-bold">Resident Concerns</CardTitle>
                                <CardDescription>Needs administrative attention</CardDescription>
                            </div>
                            <MessageSquare className="h-5 w-5 text-neutral-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-4">
                                {recentComplaints?.length > 0 ? recentComplaints.map((complaint: any) => (
                                    <div key={complaint.id} className="flex flex-col gap-2 rounded-2xl border border-neutral-100 p-4 transition-all hover:border-neutral-200 dark:border-neutral-800 hover:dark:border-neutral-700">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Badge className={cn(
                                                    "rounded-full px-2 py-0 text-[10px] font-bold uppercase tracking-tight",
                                                    complaint.status === 'pending' ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                                                )}>
                                                    {complaint.status}
                                                </Badge>
                                                <span className="text-[10px] font-bold text-neutral-400">{complaint.resident?.name}</span>
                                            </div>
                                            <p className="text-[10px] font-medium text-neutral-400">
                                                {format(new Date(complaint.created_at), 'MMM d')}
                                            </p>
                                        </div>
                                        <h4 className="text-sm font-bold leading-tight">{complaint.subject}</h4>
                                        <p className="line-clamp-1 text-xs text-neutral-500">{complaint.description}</p>
                                    </div>
                                )) : (
                                    <div className="flex flex-col items-center justify-center py-10 text-neutral-400">
                                        <CheckCircle2 className="h-10 w-10 text-emerald-500/20" />
                                        <p className="mt-2 text-sm">All clear! No pending issues.</p>
                                    </div>
                                )}
                                <Button asChild variant="outline" className="w-full rounded-xl py-6 font-bold tracking-tight border-dashed text-neutral-500 hover:text-neutral-900 dark:hover:white transition-all">
                                    <Link href="/admin/complaints" className="flex items-center justify-center w-full">
                                        View All Complaints
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ],
};
