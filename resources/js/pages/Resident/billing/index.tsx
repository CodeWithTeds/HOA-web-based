import { Head, useForm, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    Clock3,
    FileUp,
    History,
    Receipt,
    Wallet,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SweetAlert } from '@/components/ui/sweet-alert';

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
    proof_url: string | null;
};

export default function ResidentBilling({
    resident,
    summary,
    invoices,
    payments,
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
                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
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
                                            {payments.map((payment) => (
                                                <div
                                                    key={payment.id}
                                                    className="flex items-center justify-between gap-4 px-5 py-4"
                                                >
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-[13px] font-black">
                                                                {payment.invoice_number ||
                                                                    'Payment'}
                                                            </p>
                                                            <StatusBadge
                                                                status={
                                                                    payment.status
                                                                }
                                                            />
                                                        </div>
                                                        <p className="mt-1 text-[11px] font-bold text-neutral-400">
                                                            {payment.period ||
                                                                'Billing period'}{' '}
                                                            •{' '}
                                                            {
                                                                payment.payment_method
                                                            }
                                                            {payment.reference_number
                                                                ? ` • Ref ${payment.reference_number}`
                                                                : ''}
                                                        </p>
                                                        {payment.proof_url && (
                                                            <a
                                                                href={
                                                                    payment.proof_url
                                                                }
                                                                target="_blank"
                                                                className="mt-1 inline-flex text-[11px] font-black text-blue-600 uppercase"
                                                            >
                                                                View proof
                                                            </a>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[14px] font-black text-emerald-600">
                                                            {formatCurrency(
                                                                payment.amount,
                                                            )}
                                                        </p>
                                                        <p className="mt-1 text-[11px] font-bold text-neutral-400">
                                                            {payment.payment_date
                                                                ? new Date(
                                                                      payment.payment_date,
                                                                  ).toLocaleDateString()
                                                                : 'No date'}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
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
                                            {invoices.map((invoice) => (
                                                <div
                                                    key={invoice.id}
                                                    className="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[1fr_auto]"
                                                >
                                                    <div>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <p className="text-[13px] font-black text-blue-600">
                                                                {
                                                                    invoice.invoice_number
                                                                }
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
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </section>

                            <section className="xl:col-span-2">
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
              : status === 'Rejected' || status === 'Overdue'
                ? 'bg-red-50 text-red-700 border-red-100'
                : 'bg-blue-50 text-blue-700 border-blue-100';

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
