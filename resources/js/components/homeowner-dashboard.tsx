import { Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Bell,
    CalendarDays,
    CheckCircle2,
    FileText,
    Home,
    Megaphone,
    Receipt,
    Settings,
    ShieldCheck,
    Wallet,
} from 'lucide-react';
import {
    Area,
    AreaChart,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
} from 'recharts';

type ResidentSummary = {
    current_balance: number;
    total_billed: number;
    total_paid: number;
    pending_proofs: number;
};

type ResidentInfo = {
    id: number;
    name: string;
    address: string;
} | null;

type Invoice = {
    id: number;
    invoice_number: string;
    period: string | null;
    total_amount: number;
    paid_amount: number;
    balance: number;
    status: string;
    display_status?: string;
    has_pending_payment: boolean;
    due_date: string | null;
};

type Payment = {
    id: number;
    invoice_number: string | null;
    period: string | null;
    amount: number;
    payment_date: string | null;
    payment_method: string;
    reference_number: string | null;
    status: string;
};

type Update = {
    id: number;
    title: string;
    content: string;
    category: string;
    priority: string;
    published_at: string | null;
    created_at: string | null;
};

type HomeownerDashboardProps = {
    auth?: {
        user?: {
            name?: string;
            email?: string;
        };
    };
    resident?: ResidentInfo;
    summary?: ResidentSummary;
    invoices?: Invoice[];
    payments?: Payment[];
    updates?: Update[];
};

const emptySummary: ResidentSummary = {
    current_balance: 0,
    total_billed: 0,
    total_paid: 0,
    pending_proofs: 0,
};

export function HomeownerDashboard() {
    const {
        auth,
        resident = null,
        summary = emptySummary,
        invoices = [],
        payments = [],
        updates = [],
    } = usePage<HomeownerDashboardProps>().props;
    const { user } = auth || {};

    const currentDate = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    const currentTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });

    const firstName = user?.name?.split(' ')[0] || 'Neighbor';
    const nextInvoice = [...invoices]
        .filter((invoice) => invoice.balance > 0)
        .sort((a, b) => {
            if (!a.due_date) {
                return 1;
            }

            if (!b.due_date) {
                return -1;
            }

            return (
                new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
            );
        })[0];
    const recentPayments = payments.slice(0, 3);
    const paymentRate =
        summary.total_billed > 0
            ? Math.round((summary.total_paid / summary.total_billed) * 100)
            : summary.current_balance > 0
              ? 0
              : 100;
    const paidSlice = Math.max(Math.min(paymentRate, 100), 0);
    const balancePie = [
        { name: 'Paid', value: paidSlice, color: '#10B981' },
        {
            name: 'Balance',
            value: Math.max(100 - paidSlice, 0),
            color: '#F59E0B',
        },
    ].filter((item) => item.value > 0);
    const paymentTrend = buildPaymentTrend(payments);

    return (
        <div className="min-h-screen w-full bg-[#F5F5F7] p-4 font-sans text-[#1D1D1F] md:p-8">
            <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search billing, updates, facilities..."
                            className="w-full rounded-2xl border-none bg-white py-3 pr-10 pl-5 text-sm shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <FileText className="absolute top-3 right-3 size-5 text-blue-400" />
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative flex size-11 items-center justify-center rounded-2xl bg-white text-blue-500 shadow-sm hover:shadow">
                            <Bell className="size-5" />
                            {updates.length > 0 && (
                                <span className="absolute top-3 right-3 size-2 rounded-full border-2 border-white bg-rose-500" />
                            )}
                        </button>
                        <button className="flex size-11 items-center justify-center rounded-2xl bg-white text-blue-500 shadow-sm hover:shadow">
                            <Settings className="size-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                    <div className="flex flex-col gap-6 lg:col-span-8">
                        <section className="relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-[2rem] bg-[#3B82F6] p-8 shadow-xl shadow-blue-500/20">
                            <div className="pointer-events-none absolute inset-0 opacity-10">
                                <ShieldCheck className="absolute top-10 right-10 size-28 text-white" />
                                <Home className="absolute right-44 bottom-8 size-20 -rotate-12 text-white" />
                                <Wallet className="absolute top-20 left-1/3 size-20 rotate-12 text-white" />
                            </div>

                            <div className="relative z-10 flex w-max items-center rounded-full border border-white/10 bg-white/20 px-4 py-2 text-xs font-semibold tracking-wide text-white backdrop-blur-md">
                                <CalendarDays className="mr-2 size-4" />
                                {currentDate} • {currentTime}
                            </div>

                            <div className="relative z-10 mt-8 grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto] md:items-end">
                                <div>
                                    <p className="mb-3 text-xs font-black tracking-[0.2em] text-blue-100 uppercase">
                                        Personal Overview
                                    </p>
                                    <h1 className="text-4xl font-black tracking-tight text-white">
                                        Good Day, {firstName}!
                                    </h1>
                                    <p className="mt-2 max-w-xl font-medium text-blue-100">
                                        Your balance, latest notices, payment
                                        progress, and HOA account updates are
                                        gathered here.
                                    </p>
                                </div>
                                <div className="rounded-3xl bg-white/15 p-5 text-white backdrop-blur-md">
                                    <p className="text-[11px] font-black tracking-widest text-blue-100 uppercase">
                                        Current Balance
                                    </p>
                                    <p className="mt-2 text-4xl font-black tracking-tight">
                                        {formatCurrency(
                                            summary.current_balance,
                                        )}
                                    </p>
                                    <p className="mt-2 text-xs font-bold text-blue-100">
                                        {nextInvoice
                                            ? `Next due: ${formatDate(nextInvoice.due_date)}`
                                            : 'No open invoice due'}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <OverviewCard
                                title="Outstanding Balance"
                                value={formatCurrency(summary.current_balance)}
                                description={
                                    nextInvoice
                                        ? `${nextInvoice.invoice_number} due ${formatDate(nextInvoice.due_date)}`
                                        : 'All invoices are settled'
                                }
                                icon={Wallet}
                                tone="blue"
                            />
                            <OverviewCard
                                title="Paid to Date"
                                value={formatCurrency(summary.total_paid)}
                                description={`${paymentRate}% of billed amount paid`}
                                icon={CheckCircle2}
                                tone="emerald"
                            />
                            <OverviewCard
                                title="Pending Updates"
                                value={`${summary.pending_proofs + updates.length}`}
                                description={`${summary.pending_proofs} proof review, ${updates.length} notices`}
                                icon={Bell}
                                tone="amber"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <section className="flex flex-col rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
                                <CardHeader
                                    title="Payment Progress"
                                    action={`${paymentRate}%`}
                                />
                                <div className="flex flex-1 items-center justify-between gap-6">
                                    <div className="relative flex size-36 shrink-0 items-center justify-center">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                            className="absolute inset-0"
                                        >
                                            <PieChart>
                                                <Pie
                                                    data={balancePie}
                                                    innerRadius={48}
                                                    outerRadius={66}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                    stroke="none"
                                                >
                                                    {balancePie.map((entry) => (
                                                        <Cell
                                                            key={entry.name}
                                                            fill={entry.color}
                                                        />
                                                    ))}
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="relative z-10 text-center">
                                            <span className="block text-3xl leading-none font-black tracking-tighter text-[#0A2540]">
                                                {paymentRate}%
                                            </span>
                                            <span className="text-[8px] font-bold tracking-widest text-gray-400 uppercase">
                                                Paid
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full space-y-4">
                                        <ProgressRow
                                            label="Total billed"
                                            value={formatCurrency(
                                                summary.total_billed,
                                            )}
                                            width="100%"
                                            color="bg-blue-500"
                                        />
                                        <ProgressRow
                                            label="Paid amount"
                                            value={formatCurrency(
                                                summary.total_paid,
                                            )}
                                            width={`${paidSlice}%`}
                                            color="bg-emerald-500"
                                        />
                                        <ProgressRow
                                            label="Remaining"
                                            value={formatCurrency(
                                                summary.current_balance,
                                            )}
                                            width={`${Math.max(100 - paidSlice, 4)}%`}
                                            color="bg-amber-400"
                                        />
                                    </div>
                                </div>
                                <Link
                                    href="/billing"
                                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-blue-200 py-3 text-[13px] font-bold text-blue-600 transition-colors hover:bg-blue-50"
                                >
                                    View billing details
                                    <ArrowRight className="size-4" />
                                </Link>
                            </section>

                            <section className="flex flex-col rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
                                <CardHeader
                                    title="Payment Activity"
                                    action="Recent"
                                />
                                <div className="h-36">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <AreaChart data={paymentTrend}>
                                            <Area
                                                type="monotone"
                                                dataKey="amount"
                                                stroke="#3B82F6"
                                                strokeWidth={4}
                                                fill="#DBEAFE"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-4 space-y-3">
                                    {recentPayments.length > 0 ? (
                                        recentPayments.map((payment) => (
                                            <ActivityItem
                                                key={payment.id}
                                                title={
                                                    payment.invoice_number ||
                                                    'Payment received'
                                                }
                                                meta={`${payment.payment_method} • ${formatDate(payment.payment_date)}`}
                                                value={formatCurrency(
                                                    payment.amount,
                                                )}
                                            />
                                        ))
                                    ) : (
                                        <EmptyState text="No payment activity yet." />
                                    )}
                                </div>
                            </section>
                        </div>

                        <section className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
                            <CardHeader
                                title="Open Invoices"
                                action={`${invoices.length} records`}
                            />
                            <div className="space-y-3">
                                {invoices.length > 0 ? (
                                    invoices
                                        .slice(0, 4)
                                        .map((invoice) => (
                                            <InvoiceRow
                                                key={invoice.id}
                                                invoice={invoice}
                                            />
                                        ))
                                ) : (
                                    <EmptyState text="No billing records found." />
                                )}
                            </div>
                        </section>
                    </div>

                    <aside className="flex flex-col gap-6 lg:col-span-4">
                        <section className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm">
                            <div className="flex h-16 items-center justify-between bg-[#3B82F6] px-6 py-4">
                                <span className="text-xs font-bold tracking-widest text-white uppercase">
                                    My Profile
                                </span>
                                <span className="rounded-lg bg-white/20 px-3 py-1 text-[10px] font-black tracking-wide text-white uppercase">
                                    Active
                                </span>
                            </div>

                            <div className="flex flex-col items-center p-6">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'HOA')}&background=E0F2FE&color=0284C7&size=128`}
                                    alt="Profile"
                                    className="-mt-16 mb-4 size-20 rounded-full border-4 border-white bg-white shadow-lg"
                                />
                                <h2 className="text-xl font-bold tracking-tight text-[#0A2540]">
                                    {resident?.name || user?.name || 'Resident'}
                                </h2>
                                <p className="mt-1 mb-3 text-xs font-bold tracking-widest text-[#86868B] uppercase">
                                    Resident
                                </p>
                                <div className="mb-6 flex items-center gap-1 text-center text-[11px] font-semibold text-[#86868B]">
                                    <Home className="size-3.5 text-blue-500" />
                                    {resident?.address ||
                                        'Resident profile pending'}
                                </div>

                                <div className="grid w-full grid-cols-3 gap-4 border-t border-gray-100 pt-6">
                                    <ProfileMetric
                                        label="Balance"
                                        value={formatCurrency(
                                            summary.current_balance,
                                        )}
                                        tone={
                                            summary.current_balance > 0
                                                ? 'text-amber-500'
                                                : 'text-emerald-500'
                                        }
                                    />
                                    <ProfileMetric
                                        label="Proofs"
                                        value={`${summary.pending_proofs}`}
                                    />
                                    <ProfileMetric
                                        label="Invoices"
                                        value={`${invoices.length}`}
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm">
                            <div className="flex items-center justify-between bg-[#3B82F6] px-6 py-4">
                                <span className="text-xs font-bold tracking-widest text-white uppercase">
                                    Community Updates
                                </span>
                                <Megaphone className="size-4 text-white" />
                            </div>
                            <div className="space-y-4 p-6">
                                {updates.length > 0 ? (
                                    updates.map((update) => (
                                        <UpdateItem
                                            key={update.id}
                                            update={update}
                                        />
                                    ))
                                ) : (
                                    <EmptyState text="No community updates yet." />
                                )}
                            </div>
                            <div className="border-t border-gray-100 px-6 py-4">
                                <Link
                                    href="/announcements"
                                    className="flex items-center justify-between text-[12px] font-black tracking-wide text-blue-600 uppercase"
                                >
                                    View all updates
                                    <ArrowRight className="size-4" />
                                </Link>
                            </div>
                        </section>
                    </aside>
                </div>
            </div>
        </div>
    );
}

function OverviewCard({
    title,
    value,
    description,
    icon: Icon,
    tone,
}: {
    title: string;
    value: string;
    description: string;
    icon: React.ElementType;
    tone: 'blue' | 'emerald' | 'amber';
}) {
    const tones = {
        blue: 'bg-blue-50 text-blue-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        amber: 'bg-amber-50 text-amber-600',
    };

    return (
        <div className="relative flex min-h-36 flex-col rounded-[20px] border border-gray-100 bg-white px-5 py-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <span className="mb-2 block text-[9px] font-bold tracking-widest text-gray-400 uppercase">
                        {title}
                    </span>
                    <span className="block text-2xl font-black tracking-tight text-[#0A2540]">
                        {value}
                    </span>
                </div>
                <div className={`rounded-xl p-2.5 ${tones[tone]}`}>
                    <Icon className="size-5" />
                </div>
            </div>
            <p className="mt-auto pt-5 text-[11px] font-bold text-gray-400">
                {description}
            </p>
        </div>
    );
}

function CardHeader({ title, action }: { title: string; action: string }) {
    return (
        <div className="mb-6 flex items-center justify-between gap-4">
            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                {title}
            </span>
            <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-[10px] font-bold text-blue-600">
                {action}
            </span>
        </div>
    );
}

function ProgressRow({
    label,
    value,
    width,
    color,
}: {
    label: string;
    value: string;
    width: string;
    color: string;
}) {
    return (
        <div>
            <div className="mb-2 flex justify-between gap-3 text-[11px] font-bold">
                <span className="text-[#0A2540]">{label}</span>
                <span className="text-[#0A2540]">{value}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                    className={`h-full rounded-full ${color}`}
                    style={{ width }}
                />
            </div>
        </div>
    );
}

function ActivityItem({
    title,
    meta,
    value,
}: {
    title: string;
    meta: string;
    value: string;
}) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-gray-50 px-4 py-3">
            <div>
                <p className="text-[13px] font-black text-[#0A2540]">{title}</p>
                <p className="mt-1 text-[11px] font-bold text-gray-400">
                    {meta}
                </p>
            </div>
            <p className="text-[13px] font-black text-emerald-600">{value}</p>
        </div>
    );
}

function InvoiceRow({ invoice }: { invoice: Invoice }) {
    const isPaid = invoice.balance <= 0;
    const status = invoice.display_status || invoice.status;

    return (
        <div className="grid grid-cols-1 gap-4 rounded-2xl bg-gray-50 px-5 py-4 md:grid-cols-[1fr_auto]">
            <div>
                <div className="flex flex-wrap items-center gap-2">
                    <Receipt className="size-4 text-blue-500" />
                    <p className="text-[13px] font-black text-[#0A2540]">
                        {invoice.invoice_number}
                    </p>
                    <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-black tracking-wide uppercase ${
                            isPaid
                                ? 'bg-emerald-50 text-emerald-600'
                                : invoice.has_pending_payment
                                  ? 'bg-blue-50 text-blue-600'
                                  : 'bg-amber-50 text-amber-600'
                        }`}
                    >
                        {status}
                    </span>
                </div>
                <p className="mt-1 text-[11px] font-bold text-gray-400">
                    {invoice.period || 'Billing period'} • Due{' '}
                    {formatDate(invoice.due_date)}
                </p>
            </div>
            <div className="text-left md:text-right">
                <p className="text-[13px] font-black text-[#0A2540]">
                    {formatCurrency(invoice.total_amount)}
                </p>
                <p
                    className={`mt-1 text-[11px] font-black uppercase ${
                        isPaid ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                >
                    Balance {formatCurrency(invoice.balance)}
                </p>
            </div>
        </div>
    );
}

function ProfileMetric({
    label,
    value,
    tone = 'text-[#0A2540]',
}: {
    label: string;
    value: string;
    tone?: string;
}) {
    return (
        <div className="flex flex-col items-center text-center">
            <span className="mb-1 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                {label}
            </span>
            <span className={`text-xs font-bold ${tone}`}>{value}</span>
        </div>
    );
}

function UpdateItem({ update }: { update: Update }) {
    return (
        <div className="relative pl-5">
            <span className="absolute top-1.5 left-0 size-2.5 rounded-full bg-blue-500 ring-4 ring-blue-50" />
            <div className="flex flex-wrap items-center gap-2">
                <p className="text-[13px] leading-snug font-black text-[#0A2540]">
                    {update.title}
                </p>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[8px] font-black tracking-wide text-blue-600 uppercase">
                    {update.category}
                </span>
            </div>
            <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed font-semibold text-gray-400">
                {stripHtml(update.content)}
            </p>
            <p className="mt-2 text-[10px] font-bold tracking-wide text-gray-300 uppercase">
                {formatDate(update.published_at || update.created_at)}
            </p>
        </div>
    );
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="flex min-h-24 items-center justify-center rounded-2xl bg-gray-50 px-4 py-6 text-center text-[12px] font-bold text-gray-400">
            {text}
        </div>
    );
}

function buildPaymentTrend(payments: Payment[]) {
    const recent = [...payments].slice(0, 6).reverse();

    if (recent.length === 0) {
        return [
            { name: 'Start', amount: 0 },
            { name: 'Now', amount: 0 },
        ];
    }

    return recent.map((payment) => ({
        name: payment.payment_date
            ? new Date(payment.payment_date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
              })
            : payment.invoice_number || 'Payment',
        amount: payment.amount,
    }));
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        maximumFractionDigits: 0,
    }).format(amount || 0);
}

function formatDate(date: string | null) {
    if (!date) {
        return 'N/A';
    }

    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function stripHtml(value: string) {
    return value.replace(/<[^>]*>/g, '').trim();
}
