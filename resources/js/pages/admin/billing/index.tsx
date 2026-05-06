import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    Plus,
    Search,
    MoreVertical,
    CheckCircle2,
    AlertCircle,
    FileText,
    Receipt,
    CreditCard,
    MapPin,
    Loader2,
    ExternalLink,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SweetAlert } from '@/components/ui/sweet-alert';

const fontStack =
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif';

interface Payment {
    id: number;
    amount: number;
    payment_date: string;
    payment_method: string;
    reference_number: string | null;
    status: string;
    proof_url?: string | null;
    payment_proof_path?: string | null;
}

interface Invoice {
    id: number;
    invoice_number: string;
    total_amount: number;
    paid_amount: number;
    balance: number;
    status: string;
    display_status?: string;
    due_date: string;
    payments?: Payment[];
    resident: {
        first_name: string;
        last_name: string;
        phase: string;
        block: string;
        lot: string;
        resident_type: string;
    };
    billing_period: {
        name: string;
    };
}

export default function BillingIndex({
    invoices,
    summaries,
    periods,
    filters,
}: any) {
    const { flash } = usePage<any>().props;
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(
        null,
    );
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [invoiceDetails, setInvoiceDetails] = useState<any>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    const [alert, setAlert] = useState<{
        show: boolean;
        type: 'success' | 'error' | 'warning' | 'info';
        title: string;
        message?: string;
    }>({ show: false, type: 'success', title: '' });

    useEffect(() => {
        if (flash?.success) {
            setAlert({
                show: true,
                type: 'success',
                title: 'Operation Successful',
                message: String(flash.success),
            });
        }

        if (flash?.error) {
            setAlert({
                show: true,
                type: 'error',
                title: 'Operation Failed',
                message: String(flash.error),
            });
        }
    }, [flash?.success, flash?.error]);

    const { data, setData, post, processing, reset, errors } = useForm({
        invoice_id: '',
        amount: '',
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'Cash',
        reference_number: '',
    });

    const handleFilterChange = (key: string, value: string) => {
        router.get(
            '/admin/billing',
            { ...filters, [key]: value },
            { preserveState: true },
        );
    };

    const handleRecordPayment = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setData({
            invoice_id: invoice.id.toString(),
            amount: invoice.balance.toString(),
            payment_date: new Date().toISOString().split('T')[0],
            payment_method: 'Cash',
            reference_number: '',
        });
        setIsPaymentModalOpen(true);
    };

    const handleViewDetails = async (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setIsDetailsModalOpen(true);
        setIsLoadingDetails(true);

        try {
            const response = await fetch(
                `/admin/billing/invoices/${invoice.id}`,
            );
            const result = await response.json();
            // Handle InvoiceResource wrapper which nests data inside a 'data' key
            setInvoiceDetails(result.data || result);
        } catch (error) {
            console.error('Failed to fetch invoice details', error);
        } finally {
            setIsLoadingDetails(false);
        }
    };

    const submitPayment = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/billing/payments', {
            onSuccess: () => {
                setIsPaymentModalOpen(false);
                reset();
            },
        });
    };

    const verifyProof = (paymentId: number) => {
        router.patch(
            `/admin/billing/payments/${paymentId}/verify`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    if (selectedInvoice) {
                        void handleViewDetails(selectedInvoice);
                    }
                },
            },
        );
    };

    const hasPendingPayment = (invoice: Invoice) =>
        invoice.payments?.some((payment) => payment.status === 'Pending') ||
        false;

    const getDisplayStatus = (invoice: Invoice) =>
        invoice.display_status ||
        (hasPendingPayment(invoice) ? 'Pending' : invoice.status);

    const statusColors: any = {
        Paid: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        'Partially Paid': 'bg-blue-50 text-blue-700 border-blue-100',
        Unpaid: 'bg-amber-50 text-amber-700 border-amber-100',
        Pending: 'bg-violet-50 text-violet-700 border-violet-100',
        Overdue: 'bg-red-50 text-red-700 border-red-100',
    };

    const typeColors: any = {
        Owner: 'text-blue-600 bg-blue-50/50 border-blue-100',
        Tenant: 'text-amber-600 bg-amber-50/50 border-amber-100',
        'Family Member': 'text-emerald-600 bg-emerald-50/50 border-emerald-100',
        Helper: 'text-neutral-500 bg-neutral-50/50 border-neutral-100',
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount || 0);
    };

    return (
        <>
            <Head title="Billing & Collections" />
            <SweetAlert
                type={alert.type}
                title={alert.title}
                message={alert.message}
                show={alert.show}
                onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
            />

            <div
                className="flex h-full flex-1 flex-col overflow-hidden rounded-2xl bg-white text-[#0A2540] dark:bg-[#0c0c0c] dark:text-neutral-100"
                style={{ fontFamily: fontStack }}
            >
                {/* ─── HEADER ─── */}
                <div className="shrink-0 border-b border-neutral-100 px-8 py-6 transition-colors dark:border-neutral-800/60">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20">
                                <Receipt
                                    className="size-5 text-white"
                                    strokeWidth={2.5}
                                />
                            </div>
                            <div>
                                <h1 className="text-[22px] leading-none font-black tracking-tight text-[#0A2540] dark:text-white">
                                    Billing Registry
                                </h1>
                                <p className="mt-1.5 text-[12px] leading-none font-bold tracking-wider text-neutral-400 uppercase">
                                    Management of community assessments and dues
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <a
                                href={`/admin/billing/export?${new URLSearchParams(filters).toString()}`}
                            >
                                <Button
                                    variant="outline"
                                    className="h-10 gap-2 rounded-xl border-neutral-200 text-[13px] font-black tracking-wider text-neutral-500 uppercase hover:bg-neutral-50 active:scale-95"
                                >
                                    <FileText className="size-4" /> Export CSV
                                </Button>
                            </a>
                            <Link href="/admin/billing/create-period">
                                <Button className="h-10 gap-2 rounded-xl bg-blue-600 text-[13px] font-black text-white uppercase shadow-xl shadow-blue-500/10 transition-all hover:bg-blue-700 active:scale-95">
                                    <Plus className="size-4" strokeWidth={3} />{' '}
                                    Initiate Cycle
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ─── COMPACT STATS ─── */}
                <div className="grid shrink-0 grid-cols-1 gap-6 border-b border-neutral-100 bg-neutral-50/10 px-8 py-6 md:grid-cols-4 dark:border-neutral-800/60">
                    <SummaryCard
                        title="Total Dues"
                        value={formatCurrency(summaries.total_dues)}
                        icon={FileText}
                        color="blue"
                        description="Billed community assessment"
                    />
                    <SummaryCard
                        title="Total Collections"
                        value={formatCurrency(summaries.total_collections)}
                        icon={CheckCircle2}
                        color="emerald"
                        description="Verified current payments"
                    />
                    <SummaryCard
                        title="Pending Proofs"
                        value={String(summaries.pending_proofs || 0)}
                        icon={Receipt}
                        color="violet"
                        description="Homeowner uploads to review"
                    />
                    <SummaryCard
                        title="Outstanding"
                        value={formatCurrency(summaries.outstanding_balance)}
                        icon={AlertCircle}
                        color="amber"
                        description="Pending community receivables"
                    />
                </div>

                {/* ─── TOOLBAR ─── */}
                <div className="flex shrink-0 items-center justify-between border-b border-neutral-100 bg-white px-8 py-3.5 dark:border-neutral-800/60">
                    <div className="flex flex-1 items-center gap-3">
                        <div className="relative max-w-sm flex-1">
                            <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-neutral-400" />
                            <Input
                                placeholder="Search by name or invoice..."
                                className="h-9 rounded-lg border-neutral-200 pl-9 text-[12px] font-bold"
                                value={filters.search}
                                onChange={(e) =>
                                    handleFilterChange('search', e.target.value)
                                }
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <select
                                className="h-9 rounded-lg border border-neutral-200 px-3 text-[11px] font-black text-neutral-500 uppercase focus:ring-0 focus:outline-none"
                                value={filters.billing_period_id || ''}
                                onChange={(e) =>
                                    handleFilterChange(
                                        'billing_period_id',
                                        e.target.value,
                                    )
                                }
                            >
                                <option value="">Filter by Period</option>
                                {periods.map((p: any) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="h-9 rounded-lg border border-neutral-200 px-3 text-[11px] font-black text-neutral-500 uppercase focus:ring-0 focus:outline-none"
                                value={filters.status || ''}
                                onChange={(e) =>
                                    handleFilterChange('status', e.target.value)
                                }
                            >
                                <option value="">Status: All</option>
                                <option value="Paid">Paid</option>
                                <option value="Partially Paid">Partial</option>
                                <option value="Pending">Pending Proof</option>
                                <option value="Unpaid">Unpaid</option>
                                <option value="Overdue">Overdue</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* ─── LEDGER TABLE ─── */}
                <div className="flex-1 overflow-auto">
                    <table className="w-full border-separate border-spacing-0 text-left">
                        <thead className="sticky top-0 z-10 border-b border-neutral-100 bg-white shadow-sm dark:bg-[#0c0c0c]">
                            <tr>
                                <th className="px-3 py-3 pl-8 text-[10px] font-black tracking-wider text-neutral-400 uppercase">
                                    Bill #
                                </th>
                                <th className="px-3 py-3 text-[10px] font-black tracking-wider text-neutral-400 uppercase">
                                    Last Name
                                </th>
                                <th className="px-3 py-3 text-[10px] font-black tracking-wider text-neutral-400 uppercase">
                                    First Name
                                </th>
                                <th className="px-3 py-3 text-center text-[10px] font-black tracking-wider text-neutral-400 uppercase">
                                    Type
                                </th>
                                <th className="px-3 py-3 text-[10px] font-black tracking-wider text-neutral-400 uppercase">
                                    P-B-L
                                </th>
                                <th className="px-3 py-3 text-[10px] font-black tracking-wider text-neutral-400 uppercase">
                                    Period
                                </th>
                                <th className="px-3 py-3 text-center text-[10px] font-black tracking-wider text-neutral-400 uppercase">
                                    Status
                                </th>
                                <th className="px-3 py-3 text-right text-[10px] font-black tracking-wider text-neutral-400 uppercase">
                                    Total Amount
                                </th>
                                <th className="py-3 pr-8 pl-3 text-right text-[10px] font-black tracking-wider text-neutral-400 uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/40">
                            {invoices.data.map((invoice: Invoice) => (
                                <tr
                                    key={invoice.id}
                                    className="group transition-colors hover:bg-neutral-50/40"
                                >
                                    <td className="px-3 py-3 pl-8 whitespace-nowrap">
                                        <span className="text-[12px] font-black tracking-tight text-blue-600">
                                            {invoice.invoice_number}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap">
                                        <span className="text-[12px] font-bold tracking-tight text-[#0A2540] uppercase dark:text-neutral-200">
                                            {invoice.resident.last_name}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap">
                                        <span className="text-[12px] font-medium text-neutral-600 dark:text-neutral-400">
                                            {invoice.resident.first_name}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3 text-center whitespace-nowrap">
                                        <Badge
                                            variant="outline"
                                            className={`rounded-full border px-2 py-0.5 text-[9px] font-black uppercase ${typeColors[invoice.resident.resident_type] || 'border-neutral-100 text-neutral-400'}`}
                                        >
                                            {invoice.resident.resident_type}
                                        </Badge>
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap">
                                        <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-tighter text-neutral-500 uppercase">
                                            <MapPin className="size-2.5" />
                                            <span>
                                                P{invoice.resident.phase} B
                                                {invoice.resident.block} L
                                                {invoice.resident.lot}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap">
                                        <span className="block max-w-[120px] truncate text-[11px] font-black text-neutral-700 uppercase dark:text-neutral-300">
                                            {invoice.billing_period.name}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3 text-center whitespace-nowrap">
                                        <Badge
                                            className={`h-5 rounded-md border px-2 text-[9px] font-black tracking-widest uppercase ${statusColors[getDisplayStatus(invoice)] || ''}`}
                                        >
                                            {getDisplayStatus(invoice)}
                                        </Badge>
                                    </td>
                                    <td className="px-3 py-3 text-right whitespace-nowrap">
                                        <div className="flex flex-col items-end">
                                            <span className="mb-0.5 text-[12px] leading-none font-black text-[#0A2540] dark:text-white">
                                                {formatCurrency(
                                                    invoice.total_amount,
                                                ).replace('₱', '')}
                                            </span>
                                            {invoice.balance > 0 && (
                                                <span className="text-[9px] leading-none font-bold text-red-500 uppercase italic">
                                                    DUE:{' '}
                                                    {formatCurrency(
                                                        invoice.balance,
                                                    ).replace('₱', '')}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3 pr-8 pl-3 text-right whitespace-nowrap">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="size-8 rounded-lg p-0 text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-blue-600"
                                                >
                                                    <MoreVertical className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="w-44 rounded-xl border-neutral-100 p-1 shadow-2xl"
                                            >
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleRecordPayment(
                                                            invoice,
                                                        )
                                                    }
                                                    className="cursor-pointer gap-2.5 rounded-lg px-3 py-3 text-[11px] font-black text-emerald-600 uppercase focus:bg-emerald-50 focus:text-emerald-700"
                                                >
                                                    <CreditCard className="size-3.5" />{' '}
                                                    Record Payment
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleViewDetails(
                                                            invoice,
                                                        )
                                                    }
                                                    className={`cursor-pointer gap-2.5 rounded-lg px-3 py-3 text-[11px] font-black uppercase ${hasPendingPayment(invoice) ? 'text-violet-600 focus:bg-violet-50 focus:text-violet-700' : 'text-neutral-500'}`}
                                                >
                                                    <FileText className="size-3.5" />{' '}
                                                    {hasPendingPayment(invoice)
                                                        ? 'Review Proof'
                                                        : 'View Statement'}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ─── FOOTER ─── */}
                <div className="flex shrink-0 items-center justify-between border-t border-neutral-100 bg-neutral-50/10 px-8 py-4 dark:border-neutral-800/60">
                    <p className="text-[11px] leading-none font-bold tracking-widest text-neutral-400 uppercase">
                        Registry: {invoices.from || 0}-{invoices.to || 0} of{' '}
                        {invoices.total} Bills
                    </p>
                    <div className="flex items-center gap-1">
                        {invoices.links.map((link: any, i: number) => (
                            <Button
                                key={i}
                                variant="outline"
                                size="sm"
                                disabled={!link.url}
                                onClick={() =>
                                    link.url && router.get(link.url, filters)
                                }
                                className={`h-8 min-w-[32px] rounded-lg px-2 text-[10px] font-black transition-all ${link.active ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/10' : 'border-neutral-200 text-neutral-500 hover:border-blue-400 hover:bg-white hover:text-blue-600'}`}
                            >
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── MODALS ─── */}

            {/* RECORD PAYMENT MODAL */}
            <Dialog
                open={isPaymentModalOpen}
                onOpenChange={setIsPaymentModalOpen}
            >
                <DialogContent
                    className="max-w-md overflow-hidden rounded-[2.5rem] border-none bg-white p-0 shadow-2xl dark:bg-neutral-900"
                    style={{ fontFamily: fontStack }}
                >
                    <form onSubmit={submitPayment}>
                        <div className="bg-emerald-50/50 px-8 pt-8 pb-6 dark:bg-emerald-950/20">
                            <div className="mb-6 flex items-center gap-4">
                                <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-500/20">
                                    <CreditCard
                                        className="size-6"
                                        strokeWidth={2.5}
                                    />
                                </div>
                                <div>
                                    <h2 className="text-[18px] leading-none font-black tracking-tight text-emerald-900 uppercase dark:text-emerald-400">
                                        Record Payment
                                    </h2>
                                    <p className="mt-1 text-[11px] font-bold tracking-wider text-emerald-600/70 uppercase">
                                        Confirming collection for{' '}
                                        {selectedInvoice?.invoice_number}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between rounded-2xl border border-emerald-100/50 bg-white/80 p-4 dark:bg-neutral-800">
                                <div className="space-y-0.5">
                                    <span className="block text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                                        Account Holder
                                    </span>
                                    <span className="text-[15px] font-black tracking-tight">
                                        {selectedInvoice?.resident.last_name},{' '}
                                        {selectedInvoice?.resident.first_name}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="block text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                                        Balance
                                    </span>
                                    <span className="text-[15px] font-black text-red-600">
                                        {formatCurrency(
                                            selectedInvoice?.balance || 0,
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 px-8 py-8">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black tracking-wider text-neutral-400 uppercase">
                                        Amount Received{' '}
                                        <span className="text-emerald-600">
                                            *
                                        </span>
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-[13px] font-black text-neutral-400">
                                            ₱
                                        </span>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={data.amount}
                                            onChange={(e) =>
                                                setData(
                                                    'amount',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-11 rounded-xl border-neutral-100 bg-neutral-50 pl-7 text-[14px] font-black"
                                        />
                                    </div>
                                    {errors.amount && (
                                        <p className="text-[9px] font-bold text-red-500 uppercase">
                                            {errors.amount}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black tracking-wider text-neutral-400 uppercase">
                                        Payment Date
                                    </Label>
                                    <Input
                                        type="date"
                                        value={data.payment_date}
                                        onChange={(e) =>
                                            setData(
                                                'payment_date',
                                                e.target.value,
                                            )
                                        }
                                        className="h-11 rounded-xl border-neutral-100 bg-neutral-50 text-[13px] font-bold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black tracking-wider text-neutral-400 uppercase">
                                    Payment Method
                                </Label>
                                <select
                                    className="h-11 w-full rounded-xl border-neutral-100 bg-neutral-50 px-4 text-[13px] font-bold focus:outline-none"
                                    value={data.payment_method}
                                    onChange={(e) =>
                                        setData(
                                            'payment_method',
                                            e.target.value,
                                        )
                                    }
                                >
                                    <option value="Cash">Physical Cash</option>
                                    <option value="GCash">
                                        GCash / E-Wallet
                                    </option>
                                    <option value="Bank Transfer">
                                        Bank Transfer
                                    </option>
                                    <option value="Check">
                                        Manager's Check
                                    </option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black tracking-wider text-neutral-400 uppercase">
                                    Reference / O.R. Number
                                </Label>
                                <Input
                                    placeholder="Optional reference identifier..."
                                    value={data.reference_number}
                                    onChange={(e) =>
                                        setData(
                                            'reference_number',
                                            e.target.value,
                                        )
                                    }
                                    className="h-11 rounded-xl border-neutral-100 bg-neutral-50 text-[13px] font-bold"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-8 pb-8">
                            <Button
                                type="button"
                                variant="ghost"
                                className="h-12 flex-1 rounded-xl text-[13px] font-black tracking-wider text-neutral-500 uppercase"
                                onClick={() => setIsPaymentModalOpen(false)}
                            >
                                Discard
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="h-12 flex-1 rounded-xl bg-emerald-600 text-[13px] font-black tracking-widest text-white uppercase shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 active:scale-95"
                            >
                                {processing ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    'Confirm Payment'
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* INVOICE DETAILS MODAL */}
            <Dialog
                open={isDetailsModalOpen}
                onOpenChange={setIsDetailsModalOpen}
            >
                <DialogContent
                    className="max-w-xl overflow-hidden rounded-[2.5rem] border-none bg-white p-0 shadow-2xl dark:bg-neutral-900"
                    style={{ fontFamily: fontStack }}
                >
                    {isLoadingDetails ? (
                        <div className="flex h-96 flex-col items-center justify-center gap-4">
                            <Loader2 className="size-8 animate-spin text-blue-600" />
                            <p className="text-[11px] font-black tracking-widest text-neutral-400 uppercase">
                                Retrieving Ledger...
                            </p>
                        </div>
                    ) : (
                        invoiceDetails && (
                            <div className="flex h-full max-h-[85vh] flex-col">
                                <div className="border-b border-neutral-100/50 bg-neutral-50/30 px-10 pt-10 pb-8">
                                    <div className="mb-8 flex items-start justify-between">
                                        <div className="space-y-1">
                                            <Badge
                                                className={`mb-2 h-5 px-2 text-[9px] font-black tracking-widest uppercase ${statusColors[invoiceDetails.display_status || invoiceDetails.status]}`}
                                            >
                                                {invoiceDetails.display_status ||
                                                    invoiceDetails.status}
                                            </Badge>
                                            <h2 className="mb-1 text-[24px] leading-none font-black tracking-tighter uppercase">
                                                Statement of Account
                                            </h2>
                                            <span className="text-[12px] font-bold text-blue-600">
                                                {invoiceDetails.invoice_number}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <p className="mb-1 text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                                                Due Date
                                            </p>
                                            <p className="text-[15px] font-black tracking-tight">
                                                {new Date(
                                                    invoiceDetails.due_date,
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-10">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                                                Billed To
                                            </p>
                                            <p className="text-[15px] font-black text-[#0A2540]">
                                                {
                                                    invoiceDetails.resident
                                                        .last_name
                                                }
                                                ,{' '}
                                                {
                                                    invoiceDetails.resident
                                                        .first_name
                                                }
                                            </p>
                                            <p className="text-[11px] font-bold text-neutral-500 uppercase">
                                                Phase{' '}
                                                {invoiceDetails.resident.phase}{' '}
                                                Block{' '}
                                                {invoiceDetails.resident.block}{' '}
                                                Lot{' '}
                                                {invoiceDetails.resident.lot}
                                            </p>
                                        </div>
                                        <div className="space-y-1 text-right">
                                            <p className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                                                Billing Period
                                            </p>
                                            <p className="text-[15px] font-black text-[#0A2540]">
                                                {
                                                    invoiceDetails
                                                        .billing_period.name
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="custom-scrollbar flex-1 overflow-y-auto px-10 py-8">
                                    <div className="space-y-8">
                                        {/* ITEMS */}
                                        <section>
                                            <h3 className="mb-4 flex items-center gap-2 text-[11px] font-black tracking-widest text-neutral-400 uppercase">
                                                <div className="size-1.5 rounded-full bg-blue-600" />{' '}
                                                Assessment Items
                                            </h3>
                                            <div className="space-y-3">
                                                {invoiceDetails.items.map(
                                                    (item: any) => (
                                                        <div
                                                            key={item.id}
                                                            className="flex items-center justify-between py-1"
                                                        >
                                                            <div className="space-y-0.5">
                                                                <span className="text-[13px] font-bold text-[#0A2540]">
                                                                    {
                                                                        item.description
                                                                    }
                                                                </span>
                                                                <span className="block text-[10px] font-black tracking-tighter text-neutral-400 uppercase">
                                                                    {item.type}
                                                                </span>
                                                            </div>
                                                            <span className="text-[14px] font-black">
                                                                {formatCurrency(
                                                                    item.amount,
                                                                )}
                                                            </span>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </section>

                                        {/* PAYMENTS */}
                                        {invoiceDetails.payments.length > 0 && (
                                            <section>
                                                <h3 className="mb-4 flex items-center gap-2 text-[11px] font-black tracking-widest text-emerald-600 text-neutral-400 uppercase">
                                                    <div className="size-1.5 rounded-full bg-emerald-600" />{' '}
                                                    Payment History
                                                </h3>
                                                <div className="space-y-3">
                                                    {invoiceDetails.payments.map(
                                                        (payment: any) => (
                                                            <div
                                                                key={payment.id}
                                                                className={`flex items-center justify-between gap-4 rounded-xl border p-3 transition-all ${payment.status === 'Pending' ? 'border-violet-100/70 bg-violet-50/50 hover:bg-violet-50' : 'border-emerald-100/50 bg-emerald-50/50 hover:bg-emerald-50'}`}
                                                            >
                                                                <div className="space-y-0.5">
                                                                    <div className="flex items-center gap-2">
                                                                        <span
                                                                            className={`text-[12px] leading-none font-black tracking-tight uppercase ${payment.status === 'Pending' ? 'text-violet-900' : 'text-emerald-900'}`}
                                                                        >
                                                                            {
                                                                                payment.payment_method
                                                                            }
                                                                        </span>
                                                                        <Badge
                                                                            className={`h-4 border px-1.5 text-[8px] font-black uppercase ${statusColors[payment.status] || ''}`}
                                                                        >
                                                                            {
                                                                                payment.status
                                                                            }
                                                                        </Badge>
                                                                        {payment.reference_number && (
                                                                            <span
                                                                                className={`text-[9px] font-black uppercase italic ${payment.status === 'Pending' ? 'text-violet-600/60' : 'text-emerald-600/60'}`}
                                                                            >
                                                                                Ref:{' '}
                                                                                {
                                                                                    payment.reference_number
                                                                                }
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <span
                                                                            className={`text-[10px] font-bold uppercase ${payment.status === 'Pending' ? 'text-violet-600/80' : 'text-emerald-600/80'}`}
                                                                        >
                                                                            {new Date(
                                                                                payment.payment_date,
                                                                            ).toLocaleDateString()}
                                                                        </span>
                                                                        {payment.proof_url && (
                                                                            <a
                                                                                href={
                                                                                    payment.proof_url
                                                                                }
                                                                                target="_blank"
                                                                                className="inline-flex items-center gap-1 text-[9px] font-black text-blue-600 uppercase hover:text-blue-700"
                                                                            >
                                                                                <ExternalLink className="size-3" />{' '}
                                                                                View
                                                                                Proof
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    <span
                                                                        className={`text-[13px] font-black ${payment.status === 'Pending' ? 'text-violet-700' : 'text-emerald-700'}`}
                                                                    >
                                                                        -
                                                                        {formatCurrency(
                                                                            payment.amount,
                                                                        )}
                                                                    </span>
                                                                    {payment.status ===
                                                                        'Pending' && (
                                                                        <Button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                verifyProof(
                                                                                    payment.id,
                                                                                )
                                                                            }
                                                                            className="h-8 rounded-lg bg-violet-600 px-3 text-[10px] font-black text-white uppercase hover:bg-violet-700"
                                                                        >
                                                                            Verify
                                                                            Proof
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </section>
                                        )}
                                    </div>
                                </div>

                                <div className="border-t border-neutral-100/50 bg-neutral-50/20 px-10 py-10">
                                    <div className="grid grid-cols-3 gap-6">
                                        <div>
                                            <span className="mb-1 block text-[9px] font-black tracking-widest text-neutral-400 uppercase">
                                                Total Bill
                                            </span>
                                            <span className="text-[18px] font-black text-[#0A2540]">
                                                {formatCurrency(
                                                    invoiceDetails.total_amount,
                                                )}
                                            </span>
                                        </div>
                                        <div className="text-center">
                                            <span className="mb-1 block text-[9px] font-black tracking-widest text-emerald-600 text-neutral-400 uppercase">
                                                Collected
                                            </span>
                                            <span className="text-[18px] font-black text-emerald-600">
                                                {formatCurrency(
                                                    invoiceDetails.paid_amount,
                                                )}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="mb-1 block text-[9px] font-black tracking-widest text-neutral-400 text-red-600 uppercase">
                                                Balance
                                            </span>
                                            <span className="text-[18px] font-black text-red-600">
                                                {formatCurrency(
                                                    invoiceDetails.balance,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-10 flex gap-3">
                                        <Button
                                            onClick={() =>
                                                setIsDetailsModalOpen(false)
                                            }
                                            className="h-12 flex-1 rounded-xl bg-[#0A2540] text-[13px] font-black tracking-widest text-white uppercase transition-all active:scale-[0.98]"
                                        >
                                            Close Ledger
                                        </Button>
                                        {invoiceDetails.balance > 0 && (
                                            <Button
                                                onClick={() => {
                                                    setIsDetailsModalOpen(
                                                        false,
                                                    );
                                                    handleRecordPayment(
                                                        invoiceDetails as unknown as Invoice,
                                                    );
                                                }}
                                                className="h-12 flex-1 rounded-xl bg-emerald-600 text-[13px] font-black tracking-widest text-white uppercase shadow-xl shadow-emerald-500/20 transition-all hover:bg-emerald-700 active:scale-[0.98]"
                                            >
                                                Record Payment Now
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

function SummaryCard({ title, value, icon: Icon, color, description }: any) {
    const theme: any = {
        blue: 'text-blue-600 bg-blue-50 border-blue-100',
        emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        violet: 'text-violet-600 bg-violet-50 border-violet-100',
        amber: 'text-amber-600 bg-amber-50 border-amber-100',
    };

    return (
        <div className="flex flex-col gap-4 rounded-[2rem] border border-neutral-100 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between">
                <div
                    className={`flex size-10 items-center justify-center rounded-2xl border ${theme[color]}`}
                >
                    <Icon className="size-5" strokeWidth={2.5} />
                </div>
                <div className="text-right">
                    <span className="mb-0.5 block text-[11px] leading-none font-black tracking-wider text-neutral-400 uppercase">
                        {title}
                    </span>
                    <span
                        className={`text-[20px] leading-none font-black tracking-tighter ${theme[color].split(' ')[0]}`}
                    >
                        {value}
                    </span>
                </div>
            </div>
            <div className="h-px bg-neutral-100 dark:bg-neutral-800" />
            <p className="text-[11px] leading-none font-bold tracking-tighter text-neutral-400 uppercase">
                {description}
            </p>
        </div>
    );
}

BillingIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Billing Registry', href: '#' },
    ],
};
