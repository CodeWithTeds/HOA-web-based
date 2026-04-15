import { Head, Link } from '@inertiajs/react';
import {
    LayoutDashboard,
    Download,
    TrendingUp,
    Wallet,
    AlertCircle,
    CheckCircle2,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    PieChart as PieChartIcon,
    BarChart3,
    FileSpreadsheet,
    Zap,
    Target,
    Activity,
    Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { useState } from 'react';

const fontStack = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif';

interface ReportData {
    stats: {
        total_expected: number;
        total_collected: number;
        total_outstanding: number;
        collection_rate: number;
    };
    trends: Array<{ name: string; amount: number }>;
    distribution: Array<{ name: string; value: number; amount: number; fill: string }>;
    period_summaries: Array<{
        id: number;
        name: string;
        invoices_count: number;
        total_billed: number;
        total_collected: number;
        balance: number;
        collection_percentage: number;
    }>;
}

export default function ReportIndex({ data }: { data: ReportData }) {
    const [timeRange, setTimeRange] = useState('12_months');

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            maximumFractionDigits: 0
        }).format(val);
    };

    const SummaryCard = ({ title, value, subValue, icon: Icon, colorClass, trend }: any) => (
        <div className="flex flex-col p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-sm relative overflow-hidden group transition-all hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1">
            <div className={`absolute top-0 left-0 w-1 h-full ${colorClass}`} />
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${colorClass.replace('bg-', 'bg-').replace('600', '50')} dark:${colorClass.replace('bg-', 'bg-').replace('600', '900/40')} ${colorClass.replace('bg-', 'text-')}`}>
                    <Icon className="size-5" strokeWidth={2.5} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {trend > 0 ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <p className="text-[11px] font-black uppercase tracking-[0.1em] text-neutral-400 mb-1">{title}</p>
            <h3 className="text-[24px] font-black tracking-tight text-[#0A2540] dark:text-white leading-none">
                {value}
            </h3>
            <p className="text-[12px] font-bold text-neutral-400 mt-2 flex items-center gap-1.5">
                {subValue}
            </p>
        </div>
    );

    return (
        <>
            <Head title="Financial Reports & Analytics" />

            <div
                className="flex h-full flex-1 flex-col rounded-2xl bg-white dark:bg-[#0c0c0c] text-[#0A2540] dark:text-neutral-100 overflow-hidden"
                style={{ fontFamily: fontStack }}
            >
                {/* ─── ENTERPRISE HEADER ─── */}
                <div className="shrink-0 px-8 py-6 border-b border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/30 dark:bg-neutral-900/40">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center size-10 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/20">
                                <TrendingUp className="size-5 text-white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-[22px] font-black tracking-tight text-[#0A2540] dark:text-white uppercase leading-none">
                                    Financial Intelligence
                                </h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[11px] font-black text-neutral-400 uppercase tracking-widest">HOA Performance Metrics</span>
                                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-tighter">Live Real-time Feed</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <a href="/admin/reports/export" id="export-csv-data" target="_blank" rel="noopener noreferrer">
                                <Button className="h-10 gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 shadow-lg shadow-indigo-600/10 active:scale-95 transition-all uppercase text-[11px] tracking-tight">
                                    <FileSpreadsheet className="size-3.5" /> Export CSV
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-neutral-50/30 dark:bg-transparent">
                    <div className="px-8 py-8 space-y-8">

                        {/* ─── SUMMARY GRID ─── */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <SummaryCard
                                title="Projected Revenue"
                                value={formatCurrency(data.stats.total_expected)}
                                subValue="Accumulated billed amount"
                                icon={LayoutDashboard}
                                colorClass="bg-blue-600"
                            />
                            <SummaryCard
                                title="Actual Collections"
                                value={formatCurrency(data.stats.total_collected)}
                                subValue="Verified cash inflow"
                                icon={CheckCircle2}
                                colorClass="bg-emerald-600"
                                trend={+12}
                            />
                            <SummaryCard
                                title="Total Receivables"
                                value={formatCurrency(data.stats.total_outstanding)}
                                subValue="Remaining unpaid balance"
                                icon={AlertCircle}
                                colorClass="bg-red-600"
                            />
                            <SummaryCard
                                title="Collection Efficacy"
                                value={`${data.stats.collection_rate}%`}
                                subValue="Overall success rate"
                                icon={Wallet}
                                colorClass="bg-indigo-600"
                            />
                        </div>

                        {/* ─── CHARTS SECTION ─── */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Revenue Trajectory Pie Chart */}
                            <div className="lg:col-span-2 p-7 rounded-[2rem] bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-xl shadow-black/5 flex flex-col h-[480px] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Activity className="size-32 text-indigo-600" />
                                </div>

                                <div className="flex items-start justify-between mb-10 relative z-10">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <div className="size-2 rounded-full bg-indigo-500" />
                                            <h3 className="text-[15px] font-black uppercase tracking-[0.15em] text-[#0A2540] dark:text-white">Revenue Trajectory</h3>
                                        </div>
                                        <p className="text-[12px] font-bold text-neutral-400 uppercase tracking-tight flex items-center gap-2">
                                            Monthly payment velocity index <span className="size-1 rounded-full bg-neutral-300" /> <span className="text-indigo-600">Actual Breakdown</span>
                                        </p>
                                    </div>
                                    <div className="flex gap-4 text-right">
                                        <div>
                                            <p className="text-[10px] font-black text-neutral-400 uppercase leading-none mb-1">Peak Velocity</p>
                                            <p className="text-[14px] font-black text-emerald-600 tracking-tighter">{formatCurrency(Math.max(...data.trends.map(t => t.amount)))}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 w-full -ml-4 relative z-10">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={data.trends}>
                                            <defs>
                                                <linearGradient id="cryptoGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.1} />
                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }}
                                                tickFormatter={(val) => `₱${val / 1000}k`}
                                            />
                                            <Tooltip
                                                content={({ active, payload, label }) => {
                                                    if (active && payload && payload.length) {
                                                        const p = payload[0];
                                                        return (
                                                            <div className="bg-[#0f172a] p-4 rounded-xl shadow-2xl border border-white/10 min-w-[150px]">
                                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2 mb-2">{label}</p>
                                                                <div className="flex items-center justify-between">
                                                                    <p className="text-[18px] font-black text-white tracking-tighter">
                                                                        {formatCurrency(p.value as number)}
                                                                    </p>
                                                                    <TrendingUp className="size-4 text-indigo-400" />
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="amount"
                                                stroke="#4f46e5"
                                                strokeWidth={4}
                                                fillOpacity={1}
                                                fill="url(#cryptoGradient)"
                                                animationDuration={2000}
                                                activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="mt-6 flex items-center justify-between pt-6 border-t border-neutral-50 dark:border-neutral-800 z-10">
                                    <div className="flex items-center gap-8">
                                        <div className="flex items-center gap-2">
                                            <div className="size-2 rounded-full bg-indigo-500" />
                                            <span className="text-[10px] font-black uppercase text-neutral-500 tracking-wider">Gross Revenue</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Zap className="size-3.5 text-indigo-400" />
                                            <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">Velocity Index</span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-black text-neutral-300 uppercase tracking-[0.2em] italic">Real-time sync active</p>
                                </div>
                            </div>

                            {/* Collection Distribution Pie Chart */}
                            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-sm flex flex-col h-[400px]">
                                <div className="mb-4">
                                    <h3 className="text-[14px] font-black uppercase tracking-wider text-[#0A2540] dark:text-white">Portfolio Distribution</h3>
                                    <p className="text-[11px] font-bold text-neutral-400 mt-0.5 uppercase tracking-tight italic">Status segmentation</p>
                                </div>
                                <div className="flex-1 w-full relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={data.distribution}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={65}
                                                outerRadius={95}
                                                paddingAngle={8}
                                                dataKey="value"
                                                animationBegin={200}
                                                animationDuration={1200}
                                            >
                                                {data.distribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend
                                                verticalAlign="bottom"
                                                align="center"
                                                iconType="circle"
                                                wrapperStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', paddingTop: '20px' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute top-[41%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                        <p className="text-[10px] font-black text-neutral-400 uppercase leading-none mb-1">Success</p>
                                        <p className="text-[20px] font-black text-[#0A2540] dark:text-white leading-none tracking-tighter">{data.stats.collection_rate}%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ─── BILLING PERIODS TABLE ─── */}
                        <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-neutral-50 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/20 dark:bg-transparent">
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600">
                                        <BarChart3 className="size-4" strokeWidth={2.5} />
                                    </div>
                                    <h3 className="text-[14px] font-black uppercase tracking-wider text-[#0A2540] dark:text-white">Cycle Performance Summary</h3>
                                </div>
                                <Calendar className="size-4 text-neutral-300" />
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left table-fixed">
                                    <thead className="bg-neutral-50/50 dark:bg-neutral-800/40 border-b border-neutral-100 dark:border-neutral-800">
                                        <tr>
                                            <th className="px-6 py-3 text-[10px] font-black uppercase text-neutral-400 tracking-widest">Billing Cycle</th>
                                            <th className="px-6 py-3 text-[10px] font-black uppercase text-neutral-400 tracking-widest text-center">Invoices</th>
                                            <th className="px-6 py-3 text-[10px] font-black uppercase text-neutral-400 tracking-widest text-right">Total Billed</th>
                                            <th className="px-6 py-3 text-[10px] font-black uppercase text-neutral-400 tracking-widest text-right">Collected</th>
                                            <th className="px-6 py-3 text-[10px] font-black uppercase text-neutral-400 tracking-widest text-right text-emerald-600">Performance</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800/40">
                                        {data.period_summaries.map((period) => (
                                            <tr key={period.id} className="hover:bg-neutral-50/50 dark:hover:bg-white/5 transition-colors cursor-default">
                                                <td className="px-6 py-4">
                                                    <span className="text-[13px] font-black text-[#0A2540] dark:text-neutral-200">{period.name}</span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-[11px] font-black text-neutral-500">{period.invoices_count}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right italic">
                                                    <span className="text-[12px] font-bold text-neutral-600 dark:text-neutral-400">{formatCurrency(period.total_billed)}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="text-[13px] font-black text-[#0A2540] dark:text-neutral-200">{formatCurrency(period.total_collected)}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span className={`text-[12px] font-black ${period.collection_percentage > 90 ? 'text-emerald-500' : 'text-indigo-500'}`}>
                                                            {period.collection_percentage}%
                                                        </span>
                                                        <div className="w-16 h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full ${period.collection_percentage > 90 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                                                                style={{ width: `${period.collection_percentage}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

ReportIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Intelligence & Analytics', href: '#' },
    ],
};
