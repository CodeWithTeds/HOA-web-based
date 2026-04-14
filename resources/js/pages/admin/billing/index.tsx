import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Plus,
    Search,
    Wallet,
    Calendar,
    MoreVertical,
    CheckCircle2,
    AlertCircle,
    FileText,
    Receipt,
    CreditCard,
    ArrowUpRight,
    MapPin,
    Users,
    X,
    Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { useState } from 'react';

const fontStack = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif';

interface Invoice {
    id: number;
    invoice_number: string;
    total_amount: number;
    paid_amount: number;
    balance: number;
    status: string;
    due_date: string;
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

export default function BillingIndex({ invoices, summaries, periods, filters }: any) {
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [invoiceDetails, setInvoiceDetails] = useState<any>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        invoice_id: '',
        amount: '',
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'Cash',
        reference_number: '',
    });

    const handleFilterChange = (key: string, value: string) => {
        router.get('/admin/billing', { ...filters, [key]: value }, { preserveState: true });
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
            const response = await fetch(`/admin/billing/invoices/${invoice.id}`);
            const data = await response.json();
            setInvoiceDetails(data);
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

    const statusColors: any = {
        'Paid': 'bg-emerald-50 text-emerald-700 border-emerald-100',
        'Partially Paid': 'bg-blue-50 text-blue-700 border-blue-100',
        'Unpaid': 'bg-amber-50 text-amber-700 border-amber-100',
        'Overdue': 'bg-red-50 text-red-700 border-red-100',
    };

    const typeColors: any = {
        'Owner': 'text-blue-600 bg-blue-50/50 border-blue-100',
        'Tenant': 'text-amber-600 bg-amber-50/50 border-amber-100',
        'Family Member': 'text-emerald-600 bg-emerald-50/50 border-emerald-100',
        'Helper': 'text-neutral-500 bg-neutral-50/50 border-neutral-100',
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount || 0);
    };

    return (
        <>
            <Head title="Billing & Collections" />

            <div
                className="flex h-full flex-1 flex-col rounded-2xl bg-white dark:bg-[#0c0c0c] text-[#0A2540] dark:text-neutral-100 overflow-hidden"
                style={{ fontFamily: fontStack }}
            >
                {/* ─── HEADER ─── */}
                <div className="shrink-0 px-8 py-6 border-b border-neutral-100 dark:border-neutral-800/60 transition-colors">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center size-10 rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20">
                                <Receipt className="size-5 text-white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-[22px] font-black tracking-tight text-[#0A2540] dark:text-white leading-none">
                                    Billing Registry
                                </h1>
                                <p className="text-[12px] text-neutral-400 font-bold uppercase tracking-wider mt-1.5 leading-none">
                                    Management of community assessments and dues
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <a href={`/admin/billing/export?${new URLSearchParams(filters).toString()}`}>
                                <Button variant="outline" className="h-10 gap-2 rounded-xl text-[13px] font-black border-neutral-200 text-neutral-500 hover:bg-neutral-50 active:scale-95 uppercase tracking-wider">
                                    <FileText className="size-4" /> Export CSV
                                </Button>
                            </a>
                            <Link href="/admin/billing/create-period">
                                <Button className="h-10 gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-black transition-all active:scale-95 shadow-xl shadow-blue-500/10 uppercase">
                                    <Plus className="size-4" strokeWidth={3} /> Initiate Cycle
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ─── COMPACT STATS ─── */}
                <div className="shrink-0 px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/10">
                    <SummaryCard title="Total Dues" value={formatCurrency(summaries.total_dues)} icon={FileText} color="blue" description="Billed community assessment" />
                    <SummaryCard title="Total Collections" value={formatCurrency(summaries.total_collections)} icon={CheckCircle2} color="emerald" description="Verified current payments" />
                    <SummaryCard title="Outstanding" value={formatCurrency(summaries.outstanding_balance)} icon={AlertCircle} color="amber" description="Pending community receivables" />
                </div>

                {/* ─── TOOLBAR ─── */}
                <div className="shrink-0 px-8 py-3.5 border-b border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
                            <Input 
                                placeholder="Search by name or invoice..." 
                                className="h-9 pl-9 rounded-lg text-[12px] font-bold border-neutral-200"
                                value={filters.search}
                                onChange={e => handleFilterChange('search', e.target.value)}
                            />
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <select 
                                className="h-9 px-3 rounded-lg border border-neutral-200 text-[11px] font-black uppercase text-neutral-500 focus:ring-0 focus:outline-none"
                                value={filters.billing_period_id || ''}
                                onChange={e => handleFilterChange('billing_period_id', e.target.value)}
                            >
                                <option value="">Filter by Period</option>
                                {periods.map((p: any) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>

                            <select 
                                className="h-9 px-3 rounded-lg border border-neutral-200 text-[11px] font-black uppercase text-neutral-500 focus:ring-0 focus:outline-none"
                                value={filters.status || ''}
                                onChange={e => handleFilterChange('status', e.target.value)}
                            >
                                <option value="">Status: All</option>
                                <option value="Paid">Paid</option>
                                <option value="Partially Paid">Partial</option>
                                <option value="Unpaid">Unpaid</option>
                                <option value="Overdue">Overdue</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* ─── LEDGER TABLE ─── */}
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead className="sticky top-0 z-10 bg-white dark:bg-[#0c0c0c] border-b border-neutral-100 shadow-sm">
                            <tr>
                                <th className="pl-8 px-3 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">Bill #</th>
                                <th className="px-3 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">Last Name</th>
                                <th className="px-3 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">First Name</th>
                                <th className="px-3 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400 text-center">Type</th>
                                <th className="px-3 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">P-B-L</th>
                                <th className="px-3 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">Period</th>
                                <th className="px-3 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400 text-center">Status</th>
                                <th className="px-3 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400 text-right">Total Amount</th>
                                <th className="pr-8 pl-3 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/40">
                            {invoices.data.map((invoice: Invoice) => (
                                <tr key={invoice.id} className="group hover:bg-neutral-50/40 transition-colors">
                                    <td className="pl-8 px-3 py-3 whitespace-nowrap">
                                        <span className="text-[12px] font-black text-blue-600 tracking-tight">{invoice.invoice_number}</span>
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap">
                                        <span className="text-[12px] font-bold text-[#0A2540] dark:text-neutral-200 uppercase tracking-tight">{invoice.resident.last_name}</span>
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap">
                                        <span className="text-[12px] font-medium text-neutral-600 dark:text-neutral-400">{invoice.resident.first_name}</span>
                                    </td>
                                    <td className="px-3 py-3 text-center whitespace-nowrap">
                                        <Badge variant="outline" className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${typeColors[invoice.resident.resident_type] || 'text-neutral-400 border-neutral-100'}`}>
                                            {invoice.resident.resident_type}
                                        </Badge>
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap">
                                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-500 uppercase tracking-tighter">
                                            <MapPin className="size-2.5" />
                                            <span>P{invoice.resident.phase} B{invoice.resident.block} L{invoice.resident.lot}</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap">
                                        <span className="text-[11px] font-black text-neutral-700 dark:text-neutral-300 uppercase truncate max-w-[120px] block">{invoice.billing_period.name}</span>
                                    </td>
                                    <td className="px-3 py-3 text-center whitespace-nowrap">
                                        <Badge className={`h-5 px-2 rounded-md text-[9px] font-black uppercase border tracking-widest ${statusColors[invoice.status] || ''}`}>
                                            {invoice.status}
                                        </Badge>
                                    </td>
                                    <td className="px-3 py-3 text-right whitespace-nowrap">
                                        <div className="flex flex-col items-end">
                                            <span className="text-[12px] font-black text-[#0A2540] dark:text-white leading-none mb-0.5">{formatCurrency(invoice.total_amount).replace('₱', '')}</span>
                                            {invoice.balance > 0 && <span className="text-[9px] font-bold text-red-500 uppercase leading-none italic">DUE: {formatCurrency(invoice.balance).replace('₱', '')}</span>}
                                        </div>
                                    </td>
                                    <td className="pr-8 pl-3 py-3 text-right whitespace-nowrap">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="size-8 p-0 rounded-lg text-neutral-400 hover:text-blue-600 transition-opacity opacity-0 group-hover:opacity-100">
                                                    <MoreVertical className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-2xl border-neutral-100 p-1">
                                                <DropdownMenuItem 
                                                    onClick={() => handleRecordPayment(invoice)}
                                                    className="gap-2.5 text-[11px] font-black uppercase text-emerald-600 py-3 cursor-pointer rounded-lg px-3 focus:bg-emerald-50 focus:text-emerald-700"
                                                >
                                                    <CreditCard className="size-3.5" /> Record Payment
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    onClick={() => handleViewDetails(invoice)}
                                                    className="gap-2.5 text-[11px] font-black uppercase text-neutral-500 py-3 cursor-pointer rounded-lg px-3"
                                                >
                                                    <FileText className="size-3.5" /> View Statement
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
                <div className="shrink-0 px-8 py-4 border-t border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/10 flex items-center justify-between">
                    <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-widest leading-none">
                        Registry: {invoices.from || 0}-{invoices.to || 0} of {invoices.total} Bills
                    </p>
                    <div className="flex items-center gap-1">
                        {invoices.links.map((link: any, i: number) => (
                            <Button 
                                key={i}
                                variant="outline" 
                                size="sm" 
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, filters)}
                                className={`h-8 min-w-[32px] px-2 rounded-lg text-[10px] font-black transition-all ${link.active ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10' : 'text-neutral-500 border-neutral-200 hover:bg-white hover:border-blue-400 hover:text-blue-600'}`}
                            >
                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── MODALS ─── */}
            
            {/* RECORD PAYMENT MODAL */}
            <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
                <DialogContent className="max-w-md rounded-[2.5rem] bg-white dark:bg-neutral-900 border-none shadow-2xl p-0 overflow-hidden" style={{ fontFamily: fontStack }}>
                    <form onSubmit={submitPayment}>
                        <div className="px-8 pt-8 pb-6 bg-emerald-50/50 dark:bg-emerald-950/20">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="size-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                                    <CreditCard className="size-6" strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h2 className="text-[18px] font-black text-emerald-900 dark:text-emerald-400 uppercase tracking-tight leading-none">Record Payment</h2>
                                    <p className="text-[11px] text-emerald-600/70 font-bold uppercase mt-1 tracking-wider">Confirming collection for {selectedInvoice?.invoice_number}</p>
                                </div>
                            </div>
                            
                            <div className="bg-white/80 dark:bg-neutral-800 p-4 rounded-2xl border border-emerald-100/50 flex justify-between items-center">
                                <div className="space-y-0.5">
                                    <span className="text-[10px] font-bold text-neutral-400 uppercase block tracking-widest">Account Holder</span>
                                    <span className="text-[15px] font-black tracking-tight">{selectedInvoice?.resident.last_name}, {selectedInvoice?.resident.first_name}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-bold text-neutral-400 uppercase block tracking-widest">Balance</span>
                                    <span className="text-[15px] font-black text-red-600">{formatCurrency(selectedInvoice?.balance || 0)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="px-8 py-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Amount Received <span className="text-emerald-600">*</span></Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] font-black text-neutral-400">₱</span>
                                        <Input 
                                            type="number" 
                                            step="0.01"
                                            value={data.amount} 
                                            onChange={e => setData('amount', e.target.value)} 
                                            className="h-11 pl-7 rounded-xl text-[14px] font-black border-neutral-100 bg-neutral-50"
                                        />
                                    </div>
                                    {errors.amount && <p className="text-[9px] font-bold text-red-500 uppercase">{errors.amount}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Payment Date</Label>
                                    <Input 
                                        type="date" 
                                        value={data.payment_date} 
                                        onChange={e => setData('payment_date', e.target.value)} 
                                        className="h-11 rounded-xl text-[13px] font-bold border-neutral-100 bg-neutral-50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Payment Method</Label>
                                <select 
                                    className="w-full h-11 rounded-xl px-4 text-[13px] font-bold border-neutral-100 bg-neutral-50 focus:outline-none"
                                    value={data.payment_method}
                                    onChange={e => setData('payment_method', e.target.value)}
                                >
                                    <option value="Cash">Physical Cash</option>
                                    <option value="GCash">GCash / E-Wallet</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="Check">Manager's Check</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Reference / O.R. Number</Label>
                                <Input 
                                    placeholder="Optional reference identifier..."
                                    value={data.reference_number}
                                    onChange={e => setData('reference_number', e.target.value)}
                                    className="h-11 rounded-xl text-[13px] font-bold border-neutral-100 bg-neutral-50"
                                />
                            </div>
                        </div>

                        <div className="px-8 pb-8 flex items-center gap-3">
                            <Button type="button" variant="ghost" className="flex-1 h-12 rounded-xl text-[13px] font-black uppercase tracking-wider text-neutral-500" onClick={() => setIsPaymentModalOpen(false)}>Discard</Button>
                            <Button 
                                type="submit" 
                                disabled={processing}
                                className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95"
                            >
                                {processing ? <Loader2 className="size-4 animate-spin" /> : 'Confirm Payment'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* INVOICE DETAILS MODAL */}
            <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
                <DialogContent className="max-w-xl rounded-[2.5rem] bg-white dark:bg-neutral-900 border-none shadow-2xl p-0 overflow-hidden" style={{ fontFamily: fontStack }}>
                    {isLoadingDetails ? (
                        <div className="h-96 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="size-8 text-blue-600 animate-spin" />
                            <p className="text-[11px] font-black uppercase text-neutral-400 tracking-widest">Retrieving Ledger...</p>
                        </div>
                    ) : invoiceDetails && (
                        <div className="flex flex-col h-full max-h-[85vh]">
                            <div className="px-10 pt-10 pb-8 border-b border-neutral-100/50 bg-neutral-50/30">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="space-y-1">
                                        <Badge className={`h-5 mb-2 px-2 text-[9px] font-black uppercase tracking-widest ${statusColors[invoiceDetails.status]}`}>
                                            {invoiceDetails.status}
                                        </Badge>
                                        <h2 className="text-[24px] font-black tracking-tighter leading-none mb-1 uppercase">Statement of Account</h2>
                                        <span className="text-[12px] font-bold text-blue-600">{invoiceDetails.invoice_number}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest mb-1">Due Date</p>
                                        <p className="text-[15px] font-black tracking-tight">{new Date(invoiceDetails.due_date).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-10">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Billed To</p>
                                        <p className="text-[15px] font-black text-[#0A2540]">{invoiceDetails.resident.last_name}, {invoiceDetails.resident.first_name}</p>
                                        <p className="text-[11px] font-bold text-neutral-500 uppercase">
                                            Phase {invoiceDetails.resident.phase} Block {invoiceDetails.resident.block} Lot {invoiceDetails.resident.lot}
                                        </p>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Billing Period</p>
                                        <p className="text-[15px] font-black text-[#0A2540]">{invoiceDetails.billing_period.name}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto px-10 py-8 custom-scrollbar">
                                <div className="space-y-8">
                                    {/* ITEMS */}
                                    <section>
                                        <h3 className="text-[11px] font-black uppercase text-neutral-400 tracking-widest mb-4 flex items-center gap-2">
                                            <div className="size-1.5 rounded-full bg-blue-600" /> Assessment Items
                                        </h3>
                                        <div className="space-y-3">
                                            {invoiceDetails.items.map((item: any) => (
                                                <div key={item.id} className="flex justify-between items-center py-1">
                                                    <div className="space-y-0.5">
                                                        <span className="text-[13px] font-bold text-[#0A2540]">{item.description}</span>
                                                        <span className="text-[10px] font-black text-neutral-400 uppercase block tracking-tighter">{item.type}</span>
                                                    </div>
                                                    <span className="text-[14px] font-black">{formatCurrency(item.amount)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {/* PAYMENTS */}
                                    {invoiceDetails.payments.length > 0 && (
                                        <section>
                                            <h3 className="text-[11px] font-black uppercase text-neutral-400 tracking-widest mb-4 flex items-center gap-2 text-emerald-600">
                                                <div className="size-1.5 rounded-full bg-emerald-600" /> Payment History
                                            </h3>
                                            <div className="space-y-3">
                                                {invoiceDetails.payments.map((payment: any) => (
                                                    <div key={payment.id} className="flex justify-between items-center p-3 rounded-xl bg-emerald-50/50 border border-emerald-100/50 transition-all hover:bg-emerald-50">
                                                        <div className="space-y-0.5">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[12px] font-black text-emerald-900 tracking-tight leading-none uppercase">{payment.payment_method}</span>
                                                                {payment.reference_number && <span className="text-[9px] font-black text-emerald-600/60 uppercase italic">Ref: {payment.reference_number}</span>}
                                                            </div>
                                                            <span className="text-[10px] font-bold text-emerald-600/80 uppercase">{new Date(payment.payment_date).toLocaleDateString()}</span>
                                                        </div>
                                                        <span className="text-[13px] font-black text-emerald-700">-{formatCurrency(payment.amount)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    )}
                                </div>
                            </div>

                            <div className="px-10 py-10 border-t border-neutral-100/50 bg-neutral-50/20">
                                <div className="grid grid-cols-3 gap-6">
                                    <div>
                                        <span className="text-[9px] font-black uppercase text-neutral-400 tracking-widest block mb-1">Total Bill</span>
                                        <span className="text-[18px] font-black text-[#0A2540]">{formatCurrency(invoiceDetails.total_amount)}</span>
                                    </div>
                                    <div className="text-center">
                                        <span className="text-[9px] font-black uppercase text-neutral-400 tracking-widest block mb-1 text-emerald-600">Collected</span>
                                        <span className="text-[18px] font-black text-emerald-600">{formatCurrency(invoiceDetails.paid_amount)}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[9px] font-black uppercase text-neutral-400 tracking-widest block mb-1 text-red-600">Balance</span>
                                        <span className="text-[18px] font-black text-red-600">{formatCurrency(invoiceDetails.balance)}</span>
                                    </div>
                                </div>
                                <div className="mt-10 flex gap-3">
                                    <Button onClick={() => setIsDetailsModalOpen(false)} className="flex-1 h-12 rounded-xl bg-[#0A2540] text-white text-[13px] font-black uppercase tracking-widest transition-all active:scale-[0.98]">Close Ledger</Button>
                                    {invoiceDetails.balance > 0 && (
                                        <Button 
                                            onClick={() => {
                                                setIsDetailsModalOpen(false);
                                                handleRecordPayment(invoiceDetails as unknown as Invoice);
                                            }}
                                            className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98]"
                                        >
                                            Record Payment Now
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
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
        amber: 'text-amber-600 bg-amber-50 border-amber-100',
    };

    return (
        <div className="p-6 rounded-[2rem] bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className={`size-10 rounded-2xl flex items-center justify-center border ${theme[color]}`}>
                    <Icon className="size-5" strokeWidth={2.5} />
                </div>
                <div className="text-right">
                    <span className="text-[11px] font-black uppercase text-neutral-400 tracking-wider block mb-0.5 leading-none">{title}</span>
                    <span className={`text-[20px] font-black leading-none tracking-tighter ${theme[color].split(' ')[0]}`}>{value}</span>
                </div>
            </div>
            <div className="h-px bg-neutral-100 dark:bg-neutral-800" />
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-tighter leading-none">{description}</p>
        </div>
    );
}

BillingIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Billing Registry', href: '#' },
    ],
};
