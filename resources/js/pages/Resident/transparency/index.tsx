import { Head } from '@inertiajs/react';
import {
    Activity,
    AlertCircle,
    BarChart3,
    CheckCircle2,
    CircleDollarSign,
    PieChart as PieChartIcon,
    TrendingUp,
    Wallet,
} from 'lucide-react';
import {
    Area,
    AreaChart,
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
    stats: {
        total_expected: number;
        total_collected: number;
        total_outstanding: number;
        collection_rate: number;
    };
    trends: Array<{ name: string; amount: number }>;
    distribution: Array<{
        name: string;
        value: number;
        amount: number;
        fill: string;
    }>;
    period_summaries: Array<{
        id: number;
        name: string;
        invoices_count: number;
        total_billed: number;
        total_collected: number;
        balance: number;
        collection_percentage: number;
    }>;
};

export default function ResidentTransparency({
    data,
}: {
    data: TransparencyData;
}) {
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            maximumFractionDigits: 0,
        }).format(amount || 0);

    const collectionPie = [
        {
            name: 'Collected',
            value: data.stats.total_collected,
            fill: '#10b981',
        },
        {
            name: 'Outstanding',
            value: data.stats.total_outstanding,
            fill: '#f59e0b',
        },
    ].filter((item) => item.value > 0);

    const visibleDistribution =
        data.distribution.length > 0
            ? data.distribution
            : [
                  {
                      name: 'No invoices yet',
                      value: 1,
                      amount: 0,
                      fill: '#e5e7eb',
                  },
              ];

    const visibleTrends =
        data.trends.length > 0 ? data.trends : [{ name: 'No data', amount: 0 }];

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
                                    Displays summarized HOA financial data
                                </p>
                            </div>
                        </div>
                        <div className="rounded-full bg-blue-50 px-4 py-2 text-[11px] font-black tracking-wide text-blue-600 uppercase dark:bg-blue-950/40">
                            Resident View
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-8 py-8">
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
                        <SummaryCard
                            title="Projected Revenue"
                            description="Total billed to the community"
                            value={formatCurrency(data.stats.total_expected)}
                            icon={CircleDollarSign}
                            tone="blue"
                        />
                        <SummaryCard
                            title="Actual Collections"
                            description="Verified HOA payments"
                            value={formatCurrency(data.stats.total_collected)}
                            icon={CheckCircle2}
                            tone="emerald"
                        />
                        <SummaryCard
                            title="Outstanding Balance"
                            description="Remaining unpaid dues"
                            value={formatCurrency(data.stats.total_outstanding)}
                            icon={AlertCircle}
                            tone="amber"
                        />
                        <SummaryCard
                            title="Collection Rate"
                            description="Collected against billed amount"
                            value={`${data.stats.collection_rate}%`}
                            icon={Wallet}
                            tone="indigo"
                        />
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-5">
                        <section className="xl:col-span-3">
                            <SectionTitle
                                icon={TrendingUp}
                                title="Monthly Collections"
                                description="Summarized payment movement across recent months."
                            />
                            <div className="h-[360px] rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={visibleTrends}>
                                        <defs>
                                            <linearGradient
                                                id="collectionGradient"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#3b82f6"
                                                    stopOpacity={0.28}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#3b82f6"
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                            stroke="#e5e7eb"
                                        />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fill: '#94a3b8',
                                                fontSize: 11,
                                                fontWeight: 800,
                                            }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fill: '#94a3b8',
                                                fontSize: 11,
                                                fontWeight: 800,
                                            }}
                                            tickFormatter={(value) =>
                                                `PHP ${Number(value) / 1000}k`
                                            }
                                        />
                                        <Tooltip
                                            formatter={(value) =>
                                                formatCurrency(Number(value))
                                            }
                                            contentStyle={{
                                                borderRadius: 16,
                                                border: '0',
                                                boxShadow:
                                                    '0 18px 45px rgba(15, 23, 42, 0.16)',
                                                fontWeight: 800,
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="amount"
                                            stroke="#3b82f6"
                                            strokeWidth={4}
                                            fill="url(#collectionGradient)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </section>

                        <section className="xl:col-span-2">
                            <SectionTitle
                                icon={PieChartIcon}
                                title="Collection Status"
                                description="Community dues grouped by payment status."
                            />
                            <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                                <div className="h-64">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <PieChart>
                                            <Pie
                                                data={
                                                    collectionPie.length > 0
                                                        ? collectionPie
                                                        : visibleDistribution
                                                }
                                                dataKey="value"
                                                innerRadius={68}
                                                outerRadius={98}
                                                paddingAngle={4}
                                                stroke="none"
                                            >
                                                {(collectionPie.length > 0
                                                    ? collectionPie
                                                    : visibleDistribution
                                                ).map((entry) => (
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
                                    {visibleDistribution.map((item) => (
                                        <div
                                            key={item.name}
                                            className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-3 dark:bg-neutral-950"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className="size-2.5 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            item.fill,
                                                    }}
                                                />
                                                <span className="text-[12px] font-black tracking-wide uppercase">
                                                    {item.name}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[12px] font-black">
                                                    {formatCurrency(
                                                        item.amount,
                                                    )}
                                                </p>
                                                <p className="text-[10px] font-bold text-neutral-400">
                                                    {item.value} invoices
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>

                    <SectionTitle
                        icon={Activity}
                        title="Billing Cycle Summary"
                        description="Collected, billed and remaining balance per billing period."
                        className="mt-8"
                    />
                    <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        {data.period_summaries.length === 0 ? (
                            <EmptyState text="No billing cycle summaries available yet." />
                        ) : (
                            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {data.period_summaries.map((period) => (
                                    <div
                                        key={period.id}
                                        className="grid grid-cols-1 gap-5 px-5 py-5 lg:grid-cols-[1.1fr_1fr_auto]"
                                    >
                                        <div>
                                            <p className="text-[14px] font-black">
                                                {period.name}
                                            </p>
                                            <p className="mt-1 text-[11px] font-bold tracking-wide text-neutral-400 uppercase">
                                                {period.invoices_count} invoices
                                                generated
                                            </p>
                                        </div>
                                        <div className="h-20">
                                            <ResponsiveContainer
                                                width="100%"
                                                height="100%"
                                            >
                                                <BarChart
                                                    data={[
                                                        {
                                                            name: period.name,
                                                            billed: period.total_billed,
                                                            collected:
                                                                period.total_collected,
                                                        },
                                                    ]}
                                                >
                                                    <Bar
                                                        dataKey="billed"
                                                        fill="#dbeafe"
                                                        radius={[8, 8, 0, 0]}
                                                    />
                                                    <Bar
                                                        dataKey="collected"
                                                        fill="#3b82f6"
                                                        radius={[8, 8, 0, 0]}
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-left md:grid-cols-4 lg:text-right">
                                            <Metric
                                                label="Billed"
                                                value={formatCurrency(
                                                    period.total_billed,
                                                )}
                                            />
                                            <Metric
                                                label="Collected"
                                                value={formatCurrency(
                                                    period.total_collected,
                                                )}
                                                className="text-emerald-600"
                                            />
                                            <Metric
                                                label="Balance"
                                                value={formatCurrency(
                                                    period.balance,
                                                )}
                                                className="text-amber-600"
                                            />
                                            <Metric
                                                label="Rate"
                                                value={`${period.collection_percentage}%`}
                                                className="text-blue-600"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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
    tone: 'blue' | 'emerald' | 'amber' | 'indigo';
}) {
    const tones = {
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40',
        emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40',
        amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40',
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

function Metric({
    label,
    value,
    className = '',
}: {
    label: string;
    value: string;
    className?: string;
}) {
    return (
        <div>
            <p className="text-[10px] font-black tracking-wide text-neutral-400 uppercase">
                {label}
            </p>
            <p className={`mt-1 text-[12px] font-black ${className}`}>
                {value}
            </p>
        </div>
    );
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="flex min-h-36 items-center justify-center px-6 py-10 text-center text-[13px] font-bold text-neutral-400">
            {text}
        </div>
    );
}
