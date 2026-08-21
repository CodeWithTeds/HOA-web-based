import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Clock3,
    FileUp,
    Filter,
    History,
    Receipt,
    Wallet,
    ShieldCheck,
    Printer,
    Building2,
    CalendarDays,
    Tag,
    Users,
    ExternalLink,
    CreditCard,
    Banknote,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SweetAlert } from '@/components/ui/sweet-alert';
import { Badge } from '@/components/ui/badge';

const fontStack =
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif';

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
    created_at?: string | null;
    items: { description: string; amount: number; type: string }[];
    payments?: { id: number; amount: number; payment_date: string | null; payment_method: string; reference_number: string | null; status: string; verified_by?: { name: string; email: string } | null; verified_at?: string | null; verified_at_human?: string | null; created_at?: string | null }[];
    booking?: {
        id: number;
        facility?: { id: number; name: string; base_price: number; price_type: string; capacity: number } | null;
        start_time: string | null;
        end_time: string | null;
        total_fee: number;
        status: string;
        purpose?: string;
        attendees?: number;
        special_requests?: string | null;
    } | null;
    is_reservation?: boolean;
};

type Payment = {
    id: number;
    invoice_id?: number;
    invoice_number: string | null;
    period: string | null;
    amount: number;
    payment_date: string | null;
    payment_method: string;
    reference_number: string | null;
    status: string;
    proof_url: string | null;
    invoice_total: number;
    invoice_balance?: number;
    invoice_paid?: number;
    invoice_due_date: string | null;
    invoice_items?: { description: string; amount: number; type: string }[];
    verified_by?: { id: number; name: string; email: string } | null;
    verified_at?: string | null;
    verified_at_human?: string | null;
    rejected_by?: { id: number; name: string; email: string } | null;
    rejected_at?: string | null;
    rejected_at_human?: string | null;
    created_at?: string | null;
    booking?: {
        id: number;
        facility?: { id: number; name: string; base_price: number; price_type: string; capacity: number } | null;
        start_time: string | null;
        end_time: string | null;
        total_fee: number;
        status: string;
        purpose?: string;
        attendees?: number;
    } | null;
};

export default function ResidentBilling({
    resident,
    summary,
    invoices,
    payments,
    available_years,
    filters,
}: {
    resident: { id: number; name: string; address: string } | null;
    summary: {
        current_balance: number;
        total_billed: number;
        total_paid: number;
        pending_proofs: number;
    };
    invoices: Invoice[];
    payments: Payment[];
    available_years: number[];
    filters?: { month?: string; year?: string };
}) {
    const { flash } = usePage<any>().props;
    const flashMessage = flash?.success || flash?.error;
    const [dismissedFlash, setDismissedFlash] = useState<string | null>(null);
    const alert = {
        show: Boolean(flashMessage) && dismissedFlash !== String(flashMessage),
        type: flash?.error ? 'error' : 'success',
        title: flash?.error ? 'Upload Failed' : 'Proof Uploaded',
        message: flashMessage ? String(flashMessage) : undefined,
    } as const;

    const [selectedMonth, setSelectedMonth] = useState(filters?.month || '');
    const [selectedYear, setSelectedYear] = useState(filters?.year || '');
    const [expandedInvoices, setExpandedInvoices] = useState<Set<number>>(new Set());

    const months = [
        { value: '1', label: 'January' },
        { value: '2', label: 'February' },
        { value: '3', label: 'March' },
        { value: '4', label: 'April' },
        { value: '5', label: 'May' },
        { value: '6', label: 'June' },
        { value: '7', label: 'July' },
        { value: '8', label: 'August' },
        { value: '9', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' },
    ];

    const applyFilters = (month: string, year: string) => {
        const params: Record<string, string> = {};

        if (month) {
params.month = month;
}

        if (year) {
params.year = year;
}

        router.get('/billing', params, { preserveState: true, preserveScroll: true });
    };

    const handleMonthChange = (value: string) => {
        setSelectedMonth(value);
        applyFilters(value, selectedYear);
    };

    const handleYearChange = (value: string) => {
        setSelectedYear(value);
        applyFilters(selectedMonth, value);
    };

    const clearFilters = () => {
        setSelectedMonth('');
        setSelectedYear('');
        router.get('/billing', {}, { preserveState: true, preserveScroll: true });
    };

    const toggleInvoice = (id: number) => {
        setExpandedInvoices((prev) => {
            const next = new Set(prev);

            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }

            return next;
        });
    };

    const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);
    const [selectedInvoiceReceipt, setSelectedInvoiceReceipt] = useState<Invoice | null>(null);
    const [isInvoiceReceiptOpen, setIsInvoiceReceiptOpen] = useState(false);

    const openReceipt = (payment: Payment) => {
        setSelectedReceipt(payment);
        setIsReceiptOpen(true);
    };
    const openInvoiceReceipt = (invoice: Invoice) => {
        setSelectedInvoiceReceipt(invoice);
        setIsInvoiceReceiptOpen(true);
    };
    const calculateReservationBreakdown = (invoice: Invoice) => {
        if (!invoice.booking?.facility || !invoice.booking.start_time || !invoice.booking.end_time) return null;
        const start = new Date(invoice.booking.start_time);
        const end = new Date(invoice.booking.end_time);
        const diffMs = end.getTime() - start.getTime();
        const hours = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60)));
        const base = invoice.booking.facility.base_price;
        const priceType = invoice.booking.facility.price_type;
        if (priceType === 'Hourly') {
            return { hours, base, total: hours * base, label: `${hours} hr × ${formatCurrency(base)}` };
        }
        return { hours: 1, base, total: base, label: `Flat rate • ${formatCurrency(base)}` };
    };
    const calculatePaymentBreakdown = (payment: Payment) => {
        if (!payment.booking?.facility || !payment.booking.start_time || !payment.booking.end_time) return null;
        const start = new Date(payment.booking.start_time);
        const end = new Date(payment.booking.end_time);
        const diffMs = end.getTime() - start.getTime();
        const hours = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60)));
        const base = payment.booking.facility.base_price;
        const priceType = payment.booking.facility.price_type;
        if (priceType === 'Hourly') {
            return { hours, base, total: hours * base, label: `${hours} hr × ${formatCurrency(base)}` };
        }
        return { hours: 1, base, total: base, label: `Flat rate • ${formatCurrency(base)}` };
    };

    const payableInvoices = useMemo(
        () =>
            invoices.filter(
                (invoice) =>
                    invoice.balance > 0 && !invoice.has_pending_payment,
            ),
        [invoices],
    );

    const { data, setData, post, processing, errors, reset } = useForm({
        invoice_id: payableInvoices[0]?.id?.toString() || '',
        amount: payableInvoices[0]?.balance?.toString() || '',
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'GCash',
        reference_number: '',
        proof: null as File | null,
    });

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount || 0);

    const selectInvoice = (invoiceId: string) => {
        const invoice = payableInvoices.find(
            (item) => item.id.toString() === invoiceId,
        );

        setData((current) => ({
            ...current,
            invoice_id: invoiceId,
            amount: invoice?.balance?.toString() || current.amount,
        }));
    };

    const submitProof = (event: React.FormEvent) => {
        event.preventDefault();

        const selectedInvoice = payableInvoices.find(
            (invoice) => invoice.id.toString() === data.invoice_id,
        );

        if (!selectedInvoice) {
            return;
        }

        post('/billing/proof', {
            forceFormData: true,
            onSuccess: () => {
                reset('invoice_id', 'amount', 'reference_number', 'proof');
            },
        });
    };

    return (
        <>
            <Head title="My Billing" />
            <SweetAlert
                type={alert.type}
                title={alert.title}
                message={alert.message}
                show={alert.show}
                onClose={() =>
                    flashMessage && setDismissedFlash(String(flashMessage))
                }
            />

            <div
                className="flex h-full flex-1 flex-col overflow-hidden rounded-2xl bg-white text-[#0A2540] dark:bg-[#0c0c0c] dark:text-neutral-100"
                style={{ fontFamily: fontStack }}
            >
                <div className="shrink-0 border-b border-neutral-100 bg-neutral-50/30 px-8 py-6 dark:border-neutral-800/60 dark:bg-neutral-900/40">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20">
                                <Receipt
                                    className="size-5 text-white"
                                    strokeWidth={2.5}
                                />
                            </div>
                            <div>
                                <h1 className="text-[22px] leading-none font-black tracking-tight">
                                    My Billing
                                </h1>
                                <p className="mt-1.5 text-[12px] font-bold tracking-wide text-neutral-400 uppercase">
                                    Current balance, payment history and receipt
                                    uploads
                                </p>
                            </div>
                        </div>
                        {resident && (
                            <div className="hidden text-right md:block">
                                <p className="text-[12px] font-black tracking-wide text-neutral-500 uppercase">
                                    {resident.name}
                                </p>
                                <p className="mt-1 text-[11px] font-bold text-neutral-400">
                                    {resident.address || 'Resident account'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {!resident ? (
                    <div className="flex flex-1 items-center justify-center p-10">
                        <div className="max-w-md text-center">
                            <AlertCircle className="mx-auto mb-4 size-10 text-amber-500" />
                            <h2 className="text-lg font-black">
                                Resident record not found
                            </h2>
                            <p className="mt-2 text-sm font-medium text-neutral-500">
                                Your account is not linked to a resident profile
                                yet. Please contact the HOA office to connect
                                your billing account.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto px-8 py-8">
                        <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
                            <SummaryCard
                                title="Current Balance"
                                description="Displays outstanding dues"
                                value={formatCurrency(summary.current_balance)}
                                icon={Wallet}
                                tone="blue"
                            />
                            <SummaryCard
                                title="Paid to Date"
                                description="Verified payments received"
                                value={formatCurrency(summary.total_paid)}
                                icon={CheckCircle2}
                                tone="emerald"
                            />
                            <SummaryCard
                                title="Pending Proofs"
                                description="Receipts awaiting verification"
                                value={summary.pending_proofs.toString()}
                                icon={Clock3}
                                tone="amber"
                            />
                        </div>

                        {/* ─── FILTER BAR ─── */}
                        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-neutral-100 bg-neutral-50/50 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900/40">
                            <div className="flex items-center gap-2 text-neutral-500">
                                <Filter className="size-4" />
                                <span className="text-[11px] font-black uppercase tracking-widest">View By</span>
                            </div>
                            <select
                                value={selectedMonth}
                                onChange={(e) => handleMonthChange(e.target.value)}
                                className="h-9 rounded-lg border border-neutral-200 bg-white px-3 text-[12px] font-bold dark:border-neutral-700 dark:bg-neutral-900"
                            >
                                <option value="">All Months</option>
                                {months.map((m) => (
                                    <option key={m.value} value={m.value}>{m.label}</option>
                                ))}
                            </select>
                            <select
                                value={selectedYear}
                                onChange={(e) => handleYearChange(e.target.value)}
                                className="h-9 rounded-lg border border-neutral-200 bg-white px-3 text-[12px] font-bold dark:border-neutral-700 dark:bg-neutral-900"
                            >
                                <option value="">All Years</option>
                                {available_years.map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                            {(selectedMonth || selectedYear) && (
                                <Button
                                    variant="ghost"
                                    onClick={clearFilters}
                                    className="h-9 rounded-lg px-3 text-[11px] font-black text-neutral-500 hover:text-red-600"
                                >
                                    Clear
                                </Button>
                            )}
                            {(selectedMonth || selectedYear) && (
                                <span className="ml-auto text-[11px] font-bold text-neutral-400">
                                    Showing {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}
                                    {selectedMonth ? ` for ${months.find(m => m.value === selectedMonth)?.label}` : ''}
                                    {selectedYear ? ` ${selectedYear}` : ''}
                                </span>
                            )}
                        </div>

                        <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-5">
                            <section className="xl:col-span-3">
                                <SectionTitle
                                    icon={History}
                                    title="Payment History"
                                    description="Shows past payment transactions."
                                />
                                <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                                    {payments.length === 0 ? (
                                        <EmptyState text="No payment transactions yet." />
                                    ) : (
                                        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                            {payments.map((payment) => {
                                                const breakdown = calculatePaymentBreakdown(payment);
                                                const isReservation = !!payment.booking;
                                                return (
                                                <div
                                                    key={payment.id}
                                                    className="px-5 py-4"
                                                >
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <p className="text-[13px] font-black">
                                                                    {payment.invoice_number ||
                                                                        'Payment'}
                                                                </p>
                                                                <StatusBadge status={payment.status} />
                                                                {isReservation && (
                                                                    <Badge variant="outline" className="rounded-full border-blue-100 bg-blue-50 px-2 py-0.5 text-[9px] font-black uppercase text-blue-700">Reservation</Badge>
                                                                )}
                                                            </div>
                                                            <p className="mt-1 text-[11px] font-bold text-neutral-400">
                                                                {payment.period || 'Billing period'}
                                                                {isReservation && payment.booking?.facility ? ` • ${payment.booking.facility.name}` : ''}
                                                            </p>
                                                            {isReservation && payment.booking && (
                                                                <div className="mt-2 rounded-xl border border-blue-100 bg-blue-50/50 p-3">
                                                                    <p className="flex items-center gap-1 text-[11px] font-black uppercase text-blue-700"><Building2 className="size-3.5" /> Reservation Breakdown</p>
                                                                    <div className="mt-1.5 space-y-1 text-[11px] font-bold text-neutral-600">
                                                                        <p><span className="font-black text-neutral-500">Facility:</span> {payment.booking.facility?.name} • {payment.booking.facility?.price_type} • {formatCurrency(payment.booking.facility?.base_price || 0)}</p>
                                                                        <p className="flex items-center gap-1"><CalendarDays className="size-3 text-blue-500" /> {payment.booking.start_time ? new Date(payment.booking.start_time).toLocaleString() : '—'} → {payment.booking.end_time ? new Date(payment.booking.end_time).toLocaleString() : '—'}</p>
                                                                        {breakdown && <p><span className="font-black text-neutral-500">Computation:</span> {breakdown.label} = {formatCurrency(breakdown.total)}</p>}
                                                                        <p><span className="font-black text-neutral-500">Total Fee:</span> {formatCurrency(payment.booking.total_fee)} • Invoice {formatCurrency(payment.invoice_total)} {payment.invoice_balance !== undefined ? `• Balance ${formatCurrency(payment.invoice_balance)}` : ''}</p>
                                                                        {payment.booking.purpose && <p>Purpose: {payment.booking.purpose} • {payment.booking.attendees} attendees</p>}
                                                                    </div>
                                                                    {payment.invoice_items && payment.invoice_items.length > 0 && (
                                                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                                                            {payment.invoice_items.map((it, idx) => (
                                                                                <span key={idx} className="inline-flex items-center rounded-lg border bg-white px-2 py-1 text-[10px] font-bold">{it.description} • {formatCurrency(it.amount)}</span>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold text-neutral-500">
                                                                <span className="inline-flex items-center gap-1">
                                                                    <span className="text-neutral-400">Method:</span>
                                                                    {payment.payment_method}
                                                                </span>
                                                                {payment.reference_number && (
                                                                    <span className="inline-flex items-center gap-1">
                                                                        <span className="text-neutral-400">Ref:</span>
                                                                        {payment.reference_number}
                                                                    </span>
                                                                )}
                                                                {payment.invoice_due_date && (
                                                                    <span className="inline-flex items-center gap-1">
                                                                        <span className="text-neutral-400">Due:</span>
                                                                        {new Date(payment.invoice_due_date).toLocaleDateString()}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                                                {payment.proof_url && (
                                                                    <a href={payment.proof_url} target="_blank" className="inline-flex items-center gap-1 text-[11px] font-black text-blue-600 uppercase hover:text-blue-700">
                                                                        <FileUp className="size-3" /> View proof
                                                                    </a>
                                                                )}
                                                                {payment.status === 'Verified' && (
                                                                    <button onClick={() => openReceipt(payment)} className="inline-flex items-center gap-1 rounded-lg border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase text-emerald-700 hover:bg-emerald-100">
                                                                        <Receipt className="size-3" /> View Confirmation Receipt
                                                                    </button>
                                                                )}
                                                            </div>
                                                            {/* Verification log */}
                                                            {payment.status === 'Verified' && (payment.verified_by || payment.verified_at) && (
                                                                <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-2">
                                                                    <ShieldCheck className="size-3.5 text-emerald-600 shrink-0" />
                                                                    <span className="text-[10px] font-black uppercase text-emerald-800">Confirmed by {payment.verified_by?.name || 'Admin'} {payment.verified_by?.email ? `• ${payment.verified_by.email}` : ''}</span>
                                                                    <span className="ml-auto flex items-center gap-1 text-[10px] font-bold text-neutral-500"><Clock3 className="size-3" /> {payment.verified_at_human || (payment.verified_at ? new Date(payment.verified_at).toLocaleString() : '')}</span>
                                                                </div>
                                                            )}
                                                            {payment.status === 'Pending' && (
                                                                <div className="mt-3 flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50/60 px-3 py-2">
                                                                    <Clock3 className="size-3.5 text-amber-600 shrink-0" />
                                                                    <span className="text-[10px] font-bold uppercase text-amber-700">Awaiting verification • Submitted {payment.created_at ? new Date(payment.created_at).toLocaleString() : ''}</span>
                                                                </div>
                                                            )}
                                                            {payment.status === 'Rejected' && (
                                                                <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2">
                                                                    <AlertCircle className="size-3.5 text-red-600 shrink-0" />
                                                                    <span className="text-[10px] font-black uppercase text-red-700">Rejected {payment.rejected_by?.name ? `by ${payment.rejected_by.name}` : ''} {payment.rejected_at_human ? `• ${payment.rejected_at_human}` : ''}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[14px] font-black text-emerald-600">{formatCurrency(payment.amount)}</p>
                                                            <p className="mt-1 text-[11px] font-bold text-neutral-400">{payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : 'No date'}</p>
                                                            {payment.invoice_total > 0 && (
                                                                <p className="mt-0.5 text-[10px] font-bold text-neutral-300">of {formatCurrency(payment.invoice_total)}</p>
                                                            )}
                                                            {payment.status === 'Verified' && (
                                                                <button onClick={() => openReceipt(payment)} className="mt-2 inline-flex items-center gap-1 text-[10px] font-black uppercase text-blue-600 hover:text-blue-700"><Printer className="size-3" /> Print Receipt</button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                <SectionTitle
                                    icon={Receipt}
                                    title="Outstanding Invoices"
                                    description="Open dues and due dates."
                                    className="mt-8"
                                />
                                <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                                    {invoices.length === 0 ? (
                                        <EmptyState text="No billing records found." />
                                    ) : (
                                        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                            {invoices.map((invoice) => {
                                                const isExpanded = expandedInvoices.has(invoice.id);

                                                return (
                                                    <div key={invoice.id}>
                                                        <div
                                                            className="grid cursor-pointer grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[1fr_auto] hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30"
                                                            onClick={() => invoice.items.length > 0 && toggleInvoice(invoice.id)}
                                                        >
                                                            <div>
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    {invoice.items.length > 0 && (
                                                                        <span className="text-neutral-400">
                                                                            {isExpanded ? (
                                                                                <ChevronDown className="size-4" />
                                                                            ) : (
                                                                                <ChevronRight className="size-4" />
                                                                            )}
                                                                        </span>
                                                                    )}
                                                                    <p className="text-[13px] font-black text-blue-600">
                                                                        {invoice.invoice_number}
                                                                    </p>
                                                                    <StatusBadge
                                                                        status={
                                                                            invoice.display_status ||
                                                                            invoice.status
                                                                        }
                                                                    />
                                                                </div>
                                                                <p className="mt-1 text-[11px] font-bold text-neutral-400">
                                                                    {invoice.period ||
                                                                        'Billing period'}{' '}
                                                                    • Due{' '}
                                                                    {invoice.due_date
                                                                        ? new Date(
                                                                              invoice.due_date,
                                                                          ).toLocaleDateString()
                                                                        : 'N/A'}
                                                                    {invoice.has_pending_payment
                                                                        ? ' • Proof pending review'
                                                                        : ''}
                                                                </p>
                                                            </div>
                                                            <div className="text-left md:text-right">
                                                                <p className="text-[13px] font-black">
                                                                    {formatCurrency(
                                                                        invoice.total_amount,
                                                                    )}
                                                                </p>
                                                                <p className="mt-1 text-[11px] font-black text-red-500 uppercase">
                                                                    Balance{' '}
                                                                    {formatCurrency(
                                                                        invoice.balance,
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {isExpanded && (
                                                            <div className="border-t border-neutral-100 bg-neutral-50/30 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900/40 space-y-4">
                                                                {/* Reservation Breakdown if reservation */}
                                                                {invoice.is_reservation && invoice.booking && (() => { const b = calculateReservationBreakdown(invoice); return (
                                                                    <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                                                                        <p className="mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-700"><Building2 className="size-3.5" /> Reservation Payment Breakdown</p>
                                                                        <div className="grid grid-cols-2 gap-3 text-[12px]">
                                                                            <div>
                                                                                <p className="text-[10px] font-black uppercase text-neutral-400">Facility</p>
                                                                                <p className="font-black">{invoice.booking?.facility?.name}</p>
                                                                                <p className="text-[11px] font-bold text-neutral-500">{invoice.booking?.facility?.price_type} • {formatCurrency(invoice.booking?.facility?.base_price || 0)}</p>
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-[10px] font-black uppercase text-neutral-400">Schedule</p>
                                                                                <p className="flex items-center gap-1 font-bold text-neutral-700"><CalendarDays className="size-3 text-blue-500" /> {invoice.booking?.start_time ? new Date(invoice.booking.start_time).toLocaleString() : '—'}</p>
                                                                                <p className="text-[11px] font-bold text-neutral-500">→ {invoice.booking?.end_time ? new Date(invoice.booking.end_time).toLocaleString() : '—'}</p>
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-[10px] font-black uppercase text-neutral-400">Purpose</p>
                                                                                <p className="font-bold">{invoice.booking?.purpose || '—'}</p>
                                                                                <p className="text-[11px] font-bold text-neutral-500 flex items-center gap-1"><Users className="size-3" /> {invoice.booking?.attendees ?? '—'} attendees</p>
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-[10px] font-black uppercase text-neutral-400">Computation</p>
                                                                                <p className="font-bold">{b ? b.label : '—'}</p>
                                                                                <p className="text-[11px] font-black text-blue-700">{b ? formatCurrency(b.total) : formatCurrency(invoice.total_amount)}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="mt-3 grid grid-cols-3 gap-2">
                                                                            <div className="rounded-xl bg-white px-3 py-2.5 border text-center"><p className="text-[9px] font-black uppercase text-neutral-400">Total</p><p className="text-[12px] font-black">{formatCurrency(invoice.total_amount)}</p></div>
                                                                            <div className="rounded-xl bg-emerald-50 px-3 py-2.5 border border-emerald-100 text-center"><p className="text-[9px] font-black uppercase text-emerald-600">Paid</p><p className="text-[12px] font-black text-emerald-700">{formatCurrency(invoice.paid_amount)}</p></div>
                                                                            <div className="rounded-xl bg-red-50 px-3 py-2.5 border border-red-100 text-center"><p className="text-[9px] font-black uppercase text-red-500">Balance</p><p className="text-[12px] font-black text-red-700">{formatCurrency(invoice.balance)}</p></div>
                                                                        </div>
                                                                    </div>
                                                                ); })()}
                                                                {invoice.items.length > 0 && (
                                                                    <>
                                                                    <p className="mb-2 text-[10px] font-black tracking-widest text-neutral-400 uppercase">Line Items</p>
                                                                    <div className="space-y-1.5">
                                                                        {invoice.items.map((item, idx) => (
                                                                            <div key={idx} className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2 dark:bg-neutral-800/60">
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="inline-flex size-5 items-center justify-center rounded-md bg-blue-50 text-[9px] font-black text-blue-600 dark:bg-blue-900/30">{item.type.charAt(0)}</span>
                                                                                    <span className="text-[12px] font-bold text-neutral-600 dark:text-neutral-300">{item.description}</span>
                                                                                </div>
                                                                                <span className="text-[12px] font-black text-neutral-800 dark:text-neutral-200">{formatCurrency(item.amount)}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    </>
                                                                )}
                                                                {/* Invoice Payment Log */}
                                                                {invoice.payments && invoice.payments.length > 0 && (
                                                                    <div>
                                                                        <p className="mb-2 flex items-center gap-1.5 text-[10px] font-black tracking-widest text-neutral-400 uppercase"><ShieldCheck className="size-3.5" /> Payment Log — Confirmation Details</p>
                                                                        <div className="space-y-2">
                                                                            {invoice.payments.map((p) => (
                                                                                <div key={p.id} className={`flex items-center justify-between rounded-xl border px-3 py-2.5 ${p.status === 'Verified' ? 'bg-emerald-50/50 border-emerald-100' : p.status === 'Pending' ? 'bg-amber-50/50 border-amber-100' : 'bg-white'}`}>
                                                                                    <div>
                                                                                        <p className="text-[11px] font-black uppercase">{p.payment_method} • {formatCurrency(p.amount)} • <StatusBadge status={p.status} /></p>
                                                                                        <p className="text-[10px] font-bold text-neutral-500">{p.payment_date ? new Date(p.payment_date).toLocaleDateString() : ''} {p.reference_number ? `• Ref: ${p.reference_number}` : ''}</p>
                                                                                        {p.status === 'Verified' && p.verified_by && (
                                                                                            <p className="mt-1 flex items-center gap-1 text-[10px] font-black uppercase text-emerald-700"><ShieldCheck className="size-3" /> Confirmed by {p.verified_by.name} • {p.verified_at_human || ''}</p>
                                                                                        )}
                                                                                    </div>
                                                                                    {p.status === 'Verified' && (
                                                                                        <button onClick={() => {
                                                                                            const related = payments.find(x => x.id === p.id);
                                                                                            if (related) openReceipt(related);
                                                                                        }} className="rounded-lg border bg-white px-2 py-1 text-[10px] font-black uppercase text-emerald-700 hover:bg-emerald-50 flex items-center gap-1"><Receipt className="size-3" /> Receipt</button>
                                                                                    )}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <div className="flex gap-2">
                                                                    <Button onClick={() => openInvoiceReceipt(invoice)} variant="outline" className="h-9 flex-1 rounded-xl text-[11px] font-black uppercase"><Receipt className="size-3.5 mr-1" /> View Detailed Receipt</Button>
                                                                    {invoice.balance > 0 && !invoice.has_pending_payment && <Button className="h-9 flex-1 rounded-xl bg-blue-600 text-white text-[11px] font-black uppercase" onClick={() => {
                                                                        const el = document.getElementById('upload-proof-section');
                                                                        el?.scrollIntoView({ behavior: 'smooth' });
                                                                        setData('invoice_id', invoice.id.toString());
                                                                        setData('amount', invoice.balance.toString());
                                                                    }}><CreditCard className="size-3.5 mr-1" /> Pay Now</Button>}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </section>

                            <section className="xl:col-span-2" id="upload-proof-section">
                                <SectionTitle
                                    icon={FileUp}
                                    title="Upload Proof of Payment"
                                    description="Allows uploading of payment receipts."
                                />
                                <form
                                    onSubmit={submitProof}
                                    className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                                >
                                    {payableInvoices.length === 0 ? (
                                        <EmptyState text="No invoice available for upload. Please wait until the pending proof is approved or rejected." />
                                    ) : (
                                        <div className="space-y-5">
                                            <div className="space-y-2">
                                                <Label className="text-[11px] font-black text-neutral-400 uppercase">
                                                    Invoice
                                                </Label>
                                                <select
                                                    value={data.invoice_id}
                                                    onChange={(event) =>
                                                        selectInvoice(
                                                            event.target.value,
                                                        )
                                                    }
                                                    className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-[13px] font-bold dark:border-neutral-800 dark:bg-neutral-950"
                                                >
                                                    <option value="">
                                                        Select invoice
                                                    </option>
                                                    {payableInvoices.map(
                                                        (invoice) => (
                                                            <option
                                                                key={invoice.id}
                                                                value={
                                                                    invoice.id
                                                                }
                                                            >
                                                                {
                                                                    invoice.invoice_number
                                                                }{' '}
                                                                -{' '}
                                                                {formatCurrency(
                                                                    invoice.balance,
                                                                )}
                                                            </option>
                                                        ),
                                                    )}
                                                </select>
                                                <InputError
                                                    message={errors.invoice_id}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-[11px] font-black text-neutral-400 uppercase">
                                                        Amount
                                                    </Label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={data.amount}
                                                        onChange={(event) =>
                                                            setData(
                                                                'amount',
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                        className="h-11 rounded-xl text-[13px] font-bold"
                                                    />
                                                    <InputError
                                                        message={errors.amount}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[11px] font-black text-neutral-400 uppercase">
                                                        Payment Date
                                                    </Label>
                                                    <Input
                                                        type="date"
                                                        value={
                                                            data.payment_date
                                                        }
                                                        onChange={(event) =>
                                                            setData(
                                                                'payment_date',
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                        className="h-11 rounded-xl text-[13px] font-bold"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.payment_date
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-[11px] font-black text-neutral-400 uppercase">
                                                        Method
                                                    </Label>
                                                    <select
                                                        value={
                                                            data.payment_method
                                                        }
                                                        onChange={(event) =>
                                                            setData(
                                                                'payment_method',
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                        className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-[13px] font-bold dark:border-neutral-800 dark:bg-neutral-950"
                                                    >
                                                        <option value="GCash">
                                                            GCash
                                                        </option>
                                                        <option value="Bank Transfer">
                                                            Bank Transfer
                                                        </option>
                                                        <option value="Check">
                                                            Check
                                                        </option>
                                                        <option value="Cash">
                                                            Cash
                                                        </option>
                                                    </select>
                                                    <InputError
                                                        message={
                                                            errors.payment_method
                                                        }
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[11px] font-black text-neutral-400 uppercase">
                                                        Reference No.
                                                    </Label>
                                                    <Input
                                                        value={
                                                            data.reference_number
                                                        }
                                                        onChange={(event) =>
                                                            setData(
                                                                'reference_number',
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                        className="h-11 rounded-xl text-[13px] font-bold"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.reference_number
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-[11px] font-black text-neutral-400 uppercase">
                                                    Receipt File
                                                </Label>
                                                <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 px-4 text-center transition hover:border-blue-300 hover:bg-blue-50/40 dark:border-neutral-800 dark:bg-neutral-950">
                                                    <FileUp className="mb-2 size-6 text-blue-600" />
                                                    <span className="text-[13px] font-black">
                                                        {data.proof
                                                            ? data.proof.name
                                                            : 'Choose receipt file'}
                                                    </span>
                                                    <span className="mt-1 text-[10px] font-bold text-neutral-400 uppercase">
                                                        JPG, PNG or PDF up to
                                                        5MB
                                                    </span>
                                                    <input
                                                        type="file"
                                                        accept=".jpg,.jpeg,.png,.pdf"
                                                        className="hidden"
                                                        onChange={(event) =>
                                                            setData(
                                                                'proof',
                                                                event.target
                                                                    .files?.[0] ||
                                                                    null,
                                                            )
                                                        }
                                                    />
                                                </label>
                                                <InputError
                                                    message={errors.proof}
                                                />
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={
                                                    processing ||
                                                    !data.invoice_id
                                                }
                                                className="h-11 w-full rounded-xl bg-blue-600 text-[13px] font-black text-white uppercase shadow-xl shadow-blue-500/20 hover:bg-blue-700"
                                            >
                                                {processing
                                                    ? 'Uploading...'
                                                    : 'Upload Proof'}
                                            </Button>
                                        </div>
                                    )}
                                </form>
                            </section>
                        </div>
                    </div>
                )}
            </div>

            {/* PAYMENT CONFIRMATION RECEIPT MODAL */}
            <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden rounded-[2rem] border-none bg-white p-0 shadow-2xl dark:bg-neutral-900 flex flex-col" style={{ fontFamily: fontStack }}>
                    {selectedReceipt && (
                        <>
                            <div className="shrink-0 bg-gradient-to-br from-emerald-600 to-teal-700 px-8 py-7 text-white text-center">
                                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur"><Receipt className="size-6 text-white" /></div>
                                <h2 className="mt-3 text-[18px] font-black uppercase tracking-tight">Payment Confirmation Receipt</h2>
                                <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-100">Official Receipt • Keep for your records</p>
                                <div className="mt-4 rounded-2xl bg-white/15 backdrop-blur px-4 py-3 border border-white/20 text-left">
                                    <div className="flex justify-between text-[11px]">
                                        <div>
                                            <p className="font-black uppercase tracking-widest text-emerald-100">Receipt #</p>
                                            <p className="font-black text-white">PAY-{selectedReceipt.id} • {selectedReceipt.invoice_number}</p>
                                            <p className="text-emerald-100 font-bold">{selectedReceipt.period || ''}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black uppercase tracking-widest text-emerald-100">Date Confirmed</p>
                                            <p className="font-bold text-white">{selectedReceipt.verified_at_human || (selectedReceipt.verified_at ? new Date(selectedReceipt.verified_at).toLocaleString() : new Date(selectedReceipt.payment_date || '').toLocaleDateString())}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5 text-[13px]">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-neutral-400">Billed To</p>
                                        <p className="font-black text-[#0A2540]">{resident?.name}</p>
                                        <p className="text-[11px] font-bold text-neutral-500">{resident?.address}</p>
                                        {selectedReceipt.booking?.facility && <p className="mt-1 text-[11px] font-bold text-blue-600 flex items-center gap-1"><Building2 className="size-3.5" /> {selectedReceipt.booking.facility.name}</p>}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase text-neutral-400">Payment</p>
                                        <p className="font-black">{selectedReceipt.payment_method} • {formatCurrency(selectedReceipt.amount)}</p>
                                        <p className="text-[11px] font-bold text-neutral-500">Ref: {selectedReceipt.reference_number || '—'} • {selectedReceipt.payment_date ? new Date(selectedReceipt.payment_date).toLocaleDateString() : ''}</p>
                                        <StatusBadge status={selectedReceipt.status} />
                                    </div>
                                </div>
                                {selectedReceipt.booking && (() => { const b = calculatePaymentBreakdown(selectedReceipt); return b ? (
                                    <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-700 mb-2 flex items-center gap-1"><Tag className="size-3.5" /> Reservation Breakdown</p>
                                        <div className="space-y-1 text-[12px] font-bold">
                                            <div className="flex justify-between"><span className="text-neutral-500">Facility</span><span>{selectedReceipt.booking?.facility?.name}</span></div>
                                            <div className="flex justify-between"><span className="text-neutral-500">Pricing</span><span>{selectedReceipt.booking?.facility?.price_type} • {formatCurrency(selectedReceipt.booking?.facility?.base_price || 0)}</span></div>
                                            {selectedReceipt.booking?.facility?.price_type === 'Hourly' && <div className="flex justify-between"><span className="text-neutral-500">Duration</span><span>{b.hours} hour(s)</span></div>}
                                            <div className="flex justify-between"><span className="text-neutral-500">Computation</span><span>{b.label}</span></div>
                                            <div className="flex justify-between rounded-lg bg-white px-3 py-2 border font-black"><span>Total Reservation Fee</span><span className="text-blue-700">{formatCurrency(b.total)}</span></div>
                                            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                                                <div className="rounded-lg bg-white border px-2 py-1.5"><p className="text-[9px] font-black uppercase text-neutral-400">Invoice Total</p><p className="text-[11px] font-black">{formatCurrency(selectedReceipt.invoice_total)}</p></div>
                                                <div className="rounded-lg bg-emerald-50 border border-emerald-100 px-2 py-1.5"><p className="text-[9px] font-black uppercase text-emerald-600">Paid</p><p className="text-[11px] font-black text-emerald-700">{formatCurrency(selectedReceipt.invoice_paid || 0)}</p></div>
                                                <div className="rounded-lg bg-red-50 border border-red-100 px-2 py-1.5"><p className="text-[9px] font-black uppercase text-red-500">Balance</p><p className="text-[11px] font-black text-red-700">{formatCurrency(selectedReceipt.invoice_balance || 0)}</p></div>
                                            </div>
                                            {selectedReceipt.booking?.purpose && <p className="text-[11px] font-bold text-neutral-600">Purpose: {selectedReceipt.booking.purpose} • {selectedReceipt.booking.attendees} attendees</p>}
                                            {selectedReceipt.booking?.start_time && <p className="text-[11px] font-bold text-neutral-600 flex items-center gap-1"><CalendarDays className="size-3 text-blue-500" /> {new Date(selectedReceipt.booking.start_time).toLocaleString()} → {new Date(selectedReceipt.booking.end_time!).toLocaleString()}</p>}
                                        </div>
                                    </div>
                                ) : null; })()}
                                {selectedReceipt.invoice_items && selectedReceipt.invoice_items.length > 0 && (
                                    <div className="rounded-xl border bg-neutral-50 p-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Invoice Line Items</p>
                                        <div className="space-y-1.5">
                                            {selectedReceipt.invoice_items.map((it, idx) => (
                                                <div key={idx} className="flex justify-between bg-white rounded-lg px-3 py-2 border text-[12px] font-bold"><span className="flex items-center gap-1.5"><span className="size-5 flex items-center justify-center rounded-md bg-blue-50 text-[9px] font-black text-blue-600">{it.type.charAt(0)}</span>{it.description}</span><span>{formatCurrency(it.amount)}</span></div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-1 flex items-center gap-1"><ShieldCheck className="size-3.5" /> Payment Confirmation</p>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[13px] font-black text-emerald-800">{formatCurrency(selectedReceipt.amount)} • {selectedReceipt.payment_method}</p>
                                            <p className="text-[11px] font-bold text-emerald-700">Status: {selectedReceipt.status}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black uppercase text-neutral-500">Confirmed By</p>
                                            <p className="text-[12px] font-black text-[#0A2540]">{selectedReceipt.verified_by?.name || 'HOA Admin'}</p>
                                            <p className="text-[10px] font-bold text-neutral-500">{selectedReceipt.verified_by?.email || ''}</p>
                                            <p className="mt-1 text-[11px] font-bold text-neutral-600 flex items-center gap-1 justify-end"><Clock3 className="size-3" /> {selectedReceipt.verified_at_human || ''}</p>
                                        </div>
                                    </div>
                                    {selectedReceipt.proof_url && (
                                        <a href={selectedReceipt.proof_url} target="_blank" className="mt-3 inline-flex items-center gap-1 text-[11px] font-black uppercase text-blue-600 hover:text-blue-700 border bg-white rounded-lg px-3 py-1.5"><ExternalLink className="size-3" /> View Uploaded Proof</a>
                                    )}
                                </div>
                                <p className="text-center text-[10px] font-bold uppercase tracking-widest text-neutral-400 pt-1">This is a computer-generated receipt. Please keep for your records. For inquiries, contact HOA office.</p>
                            </div>
                            <div className="shrink-0 border-t bg-neutral-50/50 px-8 py-4 flex gap-3">
                                <Button variant="outline" className="flex-1 rounded-xl text-[11px] font-black uppercase" onClick={() => setIsReceiptOpen(false)}>Close</Button>
                                <Button className="flex-1 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-[11px] font-black uppercase" onClick={() => window.print()}><Printer className="size-4 mr-1" /> Print / Save PDF</Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* INVOICE DETAILED RECEIPT MODAL */}
            <Dialog open={isInvoiceReceiptOpen} onOpenChange={setIsInvoiceReceiptOpen}>
                <DialogContent className="max-w-xl max-h-[90vh] overflow-hidden rounded-[2rem] border-none bg-white p-0 shadow-2xl dark:bg-neutral-900 flex flex-col" style={{ fontFamily: fontStack }}>
                    {selectedInvoiceReceipt && (
                        <>
                            <div className="shrink-0 px-8 pt-8 pb-6 border-b">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <Badge className={`${selectedInvoiceReceipt.display_status === 'Paid' || selectedInvoiceReceipt.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : selectedInvoiceReceipt.display_status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-red-50 text-red-700 border-red-100'} border text-[9px] font-black uppercase`}>{selectedInvoiceReceipt.display_status || selectedInvoiceReceipt.status}</Badge>
                                        <h2 className="mt-2 text-[20px] font-black uppercase tracking-tight">Detailed Invoice Receipt</h2>
                                        <p className="text-[11px] font-bold tracking-widest uppercase text-blue-600">{selectedInvoiceReceipt.invoice_number} • {selectedInvoiceReceipt.period}</p>
                                        <p className="text-[11px] font-bold text-neutral-400">Due {selectedInvoiceReceipt.due_date ? new Date(selectedInvoiceReceipt.due_date).toLocaleDateString() : '—'} • Created {selectedInvoiceReceipt.created_at ? new Date(selectedInvoiceReceipt.created_at).toLocaleDateString() : ''}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase text-neutral-400">Total Amount</p>
                                        <p className="text-[18px] font-black">{formatCurrency(selectedInvoiceReceipt.total_amount)}</p>
                                        <p className="text-[11px] font-bold text-emerald-600">Paid {formatCurrency(selectedInvoiceReceipt.paid_amount)} • Balance {formatCurrency(selectedInvoiceReceipt.balance)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
                                {selectedInvoiceReceipt.is_reservation && selectedInvoiceReceipt.booking && (() => { const b = calculateReservationBreakdown(selectedInvoiceReceipt); return (
                                    <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-5">
                                        <h3 className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-blue-700 mb-3"><Building2 className="size-3.5" /> Reservation Details & Payment Breakdown</h3>
                                        <div className="grid grid-cols-2 gap-4 text-[12px]">
                                            <div><p className="text-[10px] font-black uppercase text-neutral-400">Facility</p><p className="font-black">{selectedInvoiceReceipt.booking?.facility?.name}</p><p className="text-[11px] font-bold text-neutral-500">{selectedInvoiceReceipt.booking?.facility?.price_type} • {formatCurrency(selectedInvoiceReceipt.booking?.facility?.base_price || 0)} • Capacity {selectedInvoiceReceipt.booking?.facility?.capacity}</p></div>
                                            <div><p className="text-[10px] font-black uppercase text-neutral-400">Schedule</p><p className="font-bold flex items-center gap-1"><CalendarDays className="size-3 text-blue-500" /> {selectedInvoiceReceipt.booking?.start_time ? new Date(selectedInvoiceReceipt.booking.start_time).toLocaleString() : ''}</p><p className="text-[11px] font-bold text-neutral-500">→ {selectedInvoiceReceipt.booking?.end_time ? new Date(selectedInvoiceReceipt.booking.end_time).toLocaleString() : ''}</p></div>
                                            <div><p className="text-[10px] font-black uppercase text-neutral-400">Purpose & Attendees</p><p className="font-bold">{selectedInvoiceReceipt.booking?.purpose || '—'}</p><p className="text-[11px] font-bold text-neutral-500 flex items-center gap-1"><Users className="size-3" /> {selectedInvoiceReceipt.booking?.attendees} guests {selectedInvoiceReceipt.booking?.special_requests ? `• ${selectedInvoiceReceipt.booking.special_requests}` : ''}</p></div>
                                            <div><p className="text-[10px] font-black uppercase text-neutral-400">Computation</p><p className="font-bold">{b ? b.label : '—'}</p><p className="font-black text-blue-700">{b ? formatCurrency(b.total) : ''}</p></div>
                                        </div>
                                    </div>
                                ); })()}
                                <div>
                                    <h3 className="text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-2">Line Items</h3>
                                    <div className="space-y-2">
                                        {selectedInvoiceReceipt.items.map((it, idx) => (
                                            <div key={idx} className="flex justify-between items-center rounded-xl border bg-white px-4 py-3">
                                                <span className="flex items-center gap-2 text-[12px] font-bold"><span className="size-6 flex items-center justify-center rounded-lg bg-blue-50 text-[9px] font-black text-blue-600">{it.type.charAt(0)}</span>{it.description} <Badge variant="outline" className="ml-1 text-[9px]">{it.type}</Badge></span>
                                                <span className="font-black">{formatCurrency(it.amount)}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between rounded-xl bg-neutral-900 text-white px-4 py-3 font-black"><span>Total</span><span>{formatCurrency(selectedInvoiceReceipt.total_amount)}</span></div>
                                    </div>
                                </div>
                                {selectedInvoiceReceipt.payments && selectedInvoiceReceipt.payments.length > 0 && (
                                    <div>
                                        <h3 className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-2"><ShieldCheck className="size-3.5" /> Payment Log — Who Confirmed & When (For Your Records)</h3>
                                        <div className="space-y-2">
                                            {selectedInvoiceReceipt.payments.map((p) => (
                                                <div key={p.id} className={`rounded-xl border px-4 py-3 ${p.status === 'Verified' ? 'bg-emerald-50/50 border-emerald-100' : p.status === 'Pending' ? 'bg-amber-50/50 border-amber-100' : 'bg-white'}`}>
                                                    <div className="flex justify-between">
                                                        <div>
                                                            <p className="text-[12px] font-black uppercase">{p.payment_method} • {formatCurrency(p.amount)} • <StatusBadge status={p.status} /></p>
                                                            <p className="text-[10px] font-bold text-neutral-500">{p.payment_date ? new Date(p.payment_date).toLocaleDateString() : ''} {p.reference_number ? `• Ref ${p.reference_number}` : ''}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            {p.status === 'Verified' && (
                                                                <>
                                                                    <p className="text-[10px] font-black uppercase text-neutral-400">Confirmed By</p>
                                                                    <p className="text-[11px] font-black text-emerald-700">{p.verified_by?.name || 'Admin'}</p>
                                                                    <p className="text-[10px] font-bold text-neutral-500">{p.verified_by?.email || ''}</p>
                                                                    <p className="text-[10px] font-bold text-neutral-600 flex items-center gap-1 justify-end mt-1"><Clock3 className="size-3" /> {p.verified_at_human || ''}</p>
                                                                </>
                                                            )}
                                                            {p.status === 'Pending' && <Badge className="bg-amber-100 text-amber-700 border-amber-200 border text-[9px] font-black uppercase">Awaiting Verification</Badge>}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="rounded-xl bg-neutral-50 border p-4 text-[11px] font-bold text-neutral-500">
                                    <p className="font-black uppercase tracking-widest text-neutral-400 mb-1">Resident Info</p>
                                    <p>{resident?.name} • {resident?.address}</p>
                                    <p className="mt-1 text-[10px] font-medium">Invoice {selectedInvoiceReceipt.invoice_number} • Keep this receipt for your records. For disputes, present this confirmation together with your payment proof.</p>
                                </div>
                            </div>
                            <div className="shrink-0 border-t bg-neutral-50/50 px-8 py-4 flex gap-3">
                                <Button variant="outline" className="flex-1 rounded-xl text-[11px] font-black uppercase" onClick={() => setIsInvoiceReceiptOpen(false)}>Close</Button>
                                <Button className="flex-1 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-[11px] font-black uppercase" onClick={() => window.print()}><Printer className="size-4 mr-1" /> Print Receipt</Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
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
    icon: any;
    tone: 'blue' | 'emerald' | 'amber';
}) {
    const theme = {
        blue: 'text-blue-600 bg-blue-50 border-blue-100',
        emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        amber: 'text-amber-600 bg-amber-50 border-amber-100',
    }[tone];

    return (
        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-[11px] font-black tracking-widest text-neutral-400 uppercase">
                        {title}
                    </p>
                    <p className="mt-2 text-2xl font-black tracking-tight">
                        {value}
                    </p>
                </div>
                <div
                    className={`flex size-11 items-center justify-center rounded-xl border ${theme}`}
                >
                    <Icon className="size-5" />
                </div>
            </div>
            <p className="mt-4 text-[12px] font-bold text-neutral-400">
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
    icon: any;
    title: string;
    description: string;
    className?: string;
}) {
    return (
        <div className={`mb-4 flex items-center gap-3 ${className}`}>
            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Icon className="size-4.5" />
            </div>
            <div>
                <h2 className="text-[15px] font-black tracking-tight uppercase">
                    {title}
                </h2>
                <p className="text-[12px] font-bold text-neutral-400">
                    {description}
                </p>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const color =
        status === 'Verified' || status === 'Paid'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
            : status === 'Pending' || status === 'Unpaid'
              ? 'bg-amber-50 text-amber-700 border-amber-100'
              : status === 'Partially Paid'
                ? 'bg-blue-50 text-blue-700 border-blue-100'
                : status === 'Rejected' || status === 'Overdue'
                  ? 'bg-red-50 text-red-700 border-red-100'
                  : 'bg-neutral-50 text-neutral-700 border-neutral-100';

    return (
        <span
            className={`rounded-full border px-2 py-0.5 text-[9px] font-black tracking-wider uppercase ${color}`}
        >
            {status}
        </span>
    );
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="flex min-h-32 items-center justify-center px-6 py-10 text-center">
            <p className="text-[13px] font-bold text-neutral-400">{text}</p>
        </div>
    );
}

ResidentBilling.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'My Billing', href: '/billing' },
    ],
};
