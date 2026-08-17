import { Head } from '@inertiajs/react';
import {
    Activity,
    BarChart3,
    CheckCircle2,
    CircleDollarSign,
    Home,
    PieChart as PieChartIcon,
    TrendingUp,
    Users,
} from 'lucide-react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const fontStack =
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif';

type TransparencyData = {
    community_stats: {
        active_residents: number;
        total_billing_periods: number;
        overall_collection_rate: number;
    };
    status_breakdown: Array<{
        status: string;
        count: number;
        percentage: number;
    }>;
    period_summaries: Array<{
        id: number;
        name: string;
        invoices_count: number;
        collection_percentage: number;
    }>;
};

const STATUS_COLORS: Record<string, string> = {
    Paid: '#10b981',
    Unpaid: '#f59e0b',
    Overdue: '#ef4444',
    Partial: '#3b82f6',
};

export default function ResidentTransparency({
    data,
}: {
    data: TransparencyData;
}) {
    const collectionPie = data.status_breakdown
        .filter((item) => item.count > 0)
        .map((item) => ({
            name: item.status,
            value: item.count,
            fill: STATUS_COLORS[item.status] ?? '#94a3b8',
        }));

    const visiblePie =
        collectionPie.length > 0
            ? collectionPie
            : [{ name: 'No data yet', value: 1, fill: '#e5e7eb' }];

    const visiblePeriods =
        data.period_summaries.length > 0
            ? data.period_summaries
            : [];

    return (
        <>
            <Head title="Community Transparency" />

            <div
                className="flex h-full flex-1 flex-col overflow-hidden rounded-2xl bg-white text-[#0A2540] dark:bg-[#0c0c0c] dark:text-neutral-100"
                style={{ fontFamily: fontStack }}
            >
                <div className="shrink-0 border-b border-neutral-100 bg-neutral-50/30 px-8 py-6 dark:border-neutral-800/60 dark:bg-neutral-900/40">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20">
                                <BarChart3
                                    className="size-5 text-white"
                                    strokeWidth={2.5}
                                />
                            </div>
                            <div>
                                <h1 className="text-[22px] leading-none font-black tracking-tight">
                                    Community Transparency
                                </h1>
                                <p className="mt-1.5 text-[12px] font-bold tracking-wide text-neutral-400 uppercase">
                                    General community participation overview
                                </p>
                            </div>
                        </div>
                        <div className="rounded-full bg-blue-50 px-4 py-2 text-[11px] font-black tracking-wide text-blue-600 uppercase dark:bg-blue-950/40">
                            Resident View
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-8 py-8">
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                        <SummaryCard
                            title="Active Residents"
                            description="Registered household accounts"
                            value={String(data.community_stats.active_residents)}
                            icon={Users}
                            tone="blue"
                        />
                        <SummaryCard
                            title="Billing Periods"
                            description="Total billing cycles to date"
                            value={String(data.community_stats.total_billing_periods)}
                            icon={Activity}
                            tone="emerald"
                        />
                        <SummaryCard
                            title="Avg. Collection Rate"
                            description="Community payment compliance"
                            value={`${data.community_stats.overall_collection_rate}%`}
                            icon={CircleDollarSign}
                            tone="indigo"
                        />
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-2">
                        <section>
                            <SectionTitle
                                icon={PieChartIcon}
                                title="Payment Status Distribution"
                                description="Invoice breakdown by payment status."
                            />
                            <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                                <div className="h-64">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <PieChart>
                                            <Pie
                                                data={visiblePie}
                                                dataKey="value"
                                                innerRadius={68}
                                                outerRadius={98}
                                                paddingAngle={4}
                                                stroke="none"
                                            >
                                                {visiblePie.map((entry) => (
                                                    <Cell
                                                        key={entry.name}
                                                        fill={entry.fill}
                                                    />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="space-y-3">
                                    {data.status_breakdown.map((item) => (
                                        <div
                                            key={item.status}
                                            className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-3 dark:bg-neutral-950"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className="size-2.5 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            STATUS_COLORS[
                                                                item.status
                                                            ] ?? '#94a3b8',
                                                    }}
                                                />
                                                <span className="text-[12px] font-black tracking-wide uppercase">
                                                    {item.status}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[12px] font-black">
                                                    {item.percentage}%
                                                </p>
                                                <p className="text-[10px] font-bold text-neutral-400">
                                                    {item.count} invoices
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section>
                            <SectionTitle
                                icon={TrendingUp}
                                title="Billing Cycle Performance"
                                description="Collection rate per billing period."
                            />
                            <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                                {visiblePeriods.length === 0 ? (
                                    <div className="flex min-h-36 items-center justify-center px-6 py-10 text-center text-[13px] font-bold text-neutral-400">
                                        No billing cycle data available yet.
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {visiblePeriods.map((period) => (
                                            <div
                                                key={period.id}
                                                className="rounded-xl border border-neutral-100 p-4 dark:border-neutral-800"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-[14px] font-black">
                                                            {period.name}
                                                        </p>
                                                        <p className="mt-1 text-[11px] font-bold text-neutral-400">
                                                            {period.invoices_count}{' '}
                                                            invoices
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[14px] font-black text-blue-600">
                                                            {
                                                                period.collection_percentage
                                                            }
                                                            %
                                                        </p>
                                                        <p className="text-[10px] font-bold text-neutral-400 uppercase">
                                                            Collection rate
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                                                    <div
                                                        className="h-full rounded-full bg-blue-600"
                                                        style={{
                                                            width: `${Math.min(period.collection_percentage, 100)}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}

function SummaryCard({
    title,
    description,
    value,
    icon: Icon,
    tone,
}: {
    title: string;
    description: string;
    value: string;
    icon: React.ElementType;
    tone: 'blue' | 'emerald' | 'indigo';
}) {
    const tones = {
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40',
        emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40',
        indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40',
    };

    return (
        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/5 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between gap-4">
                <div className={`rounded-xl p-2.5 ${tones[tone]}`}>
                    <Icon className="size-5" strokeWidth={2.5} />
                </div>
            </div>
            <p className="mt-5 text-[11px] font-black tracking-[0.1em] text-neutral-400 uppercase">
                {title}
            </p>
            <h3 className="mt-2 text-[24px] leading-none font-black tracking-tight">
                {value}
            </h3>
            <p className="mt-2 text-[12px] font-bold text-neutral-400">
                {description}
            </p>
        </div>
    );
}

function SectionTitle({
    icon: Icon,
    title,
    description,
    className = '',
}: {
    icon: React.ElementType;
    title: string;
    description: string;
    className?: string;
}) {
    return (
        <div className={`mb-4 flex items-center gap-3 ${className}`}>
            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40">
                <Icon className="size-4" strokeWidth={2.5} />
            </div>
            <div>
                <h2 className="text-[14px] font-black tracking-wide uppercase">
                    {title}
                </h2>
                <p className="mt-0.5 text-[12px] font-bold text-neutral-400">
                    {description}
                </p>
            </div>
        </div>
    );
}
