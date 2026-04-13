import { Head, Link, router } from '@inertiajs/react';
import {
    Plus,
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownLeft,
    CreditCard,
    Receipt,
    Wallet,
    Calendar,
    ChevronDown,
    MoreVertical,
    CheckCircle2,
    Clock,
    AlertCircle,
    FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const fontStack = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif';

interface Summary {
    total_dues: number;
    total_collections: number;
    outstanding_balance: number;
}

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
    };
    billing_period: {
        name: string;
    };
}

interface BillingPeriod {
    id: number;
    name: string;
}

export default function BillingIndex({ invoices, summaries, periods, filters }: any) {
    const handleFilterChange = (key: string, value: string) => {
        router.get('/admin/billing', { ...filters, [key]: value }, { preserveState: true });
    };

    const statusColors: any = {
        'Paid': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
        'Partially Paid': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
        'Unpaid': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
        'Overdue': 'bg-red-500/10 text-red-600 border-red-500/20',
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
    };

    return (
        <>
            <Head title="Billing & Collections" />

            <div
                className="flex h-full flex-1 flex-col rounded-2xl bg-white dark:bg-[#0c0c0c] text-[#0A2540] dark:text-neutral-100 overflow-hidden"
                style={{ fontFamily: fontStack }}
            >
                {/* ─── HEADER ─── */}
                <div className="shrink-0 px-8 py-6 border-b border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/30 dark:bg-neutral-900/40">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center size-10 rounded-xl bg-emerald-600 shadow-lg shadow-emerald-500/20">
                                <Wallet className="size-5 text-white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-[20px] font-black tracking-tight text-[#0A2540] dark:text-white">
                                    Billing & Collection Overview
                                </h1>
                                <p className="text-[12px] text-neutral-400 font-bold tracking-wide uppercase mt-0.5">
                                    Financial control center and automated dues management
                                </p>
                            </div>
                        </div>
                        <Link href="/admin/billing/create-period">
                            <Button className="h-9 gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-bold shadow-lg shadow-blue-500/20">
                                <Plus className="size-3.5" strokeWidth={3} /> Create Billing Cycle
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* ─── SUMMARIES ─── */}
                <div className="shrink-0 px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-neutral-100 dark:border-neutral-800/60">
                    <SummaryCard 
                        title="Total Dues" 
                        value={formatCurrency(summaries.total_dues)} 
                        icon={FileText} 
                        color="blue" 
                        description="Billed for selected period"
                    />
                    <SummaryCard 
                        title="Total Collections" 
                        value={formatCurrency(summaries.total_collections)} 
                        icon={CheckCircle2} 
                        color="emerald" 
                        description="Verified payments received"
                    />
                    <SummaryCard 
                        title="Outstanding Balance" 
                        value={formatCurrency(summaries.outstanding_balance)} 
                        icon={AlertCircle} 
                        color="amber" 
                        description="Unpaid community accounts"
                    />
                </div>

                {/* ─── FILTERS ─── */}
                <div className="shrink-0 px-8 py-4 border-b border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between bg-neutral-50/50">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                            <Input 
                                placeholder="Search invoice or resident..." 
                                className="h-9 pl-9 rounded-lg text-[13px] font-bold border-neutral-200"
                                value={filters.search}
                                onChange={e => handleFilterChange('search', e.target.value)}
                            />
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <div className="flex items-center h-9 px-3 rounded-lg border border-neutral-200 bg-white gap-2">
                                <Calendar className="size-3.5 text-neutral-400" />
                                <select 
                                    className="text-[12px] font-black uppercase text-neutral-500 focus:outline-none bg-transparent"
                                    value={filters.billing_period_id || ''}
                                    onChange={e => handleFilterChange('billing_period_id', e.target.value)}
                                >
                                    <option value="">All Periods</option>
                                    {periods.map((p: BillingPeriod) => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center h-9 px-3 rounded-lg border border-neutral-200 bg-white gap-2">
                                <Filter className="size-3.5 text-neutral-400" />
                                <select 
                                    className="text-[12px] font-black uppercase text-neutral-500 focus:outline-none bg-transparent"
                                    value={filters.status || ''}
                                    onChange={e => handleFilterChange('status', e.target.value)}
                                >
                                    <option value="">Any Status</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Partially Paid">Partial</option>
                                    <option value="Unpaid">Unpaid</option>
                                    <option value="Overdue">Overdue</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── INVOICE TABLE ─── */}
                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse border-spacing-0">
                        <thead>
                            <tr className="bg-neutral-50/50 dark:bg-neutral-900/40 border-b border-neutral-100 dark:border-neutral-800/60 transition-colors">
                                <th className="px-8 py-3.5 text-[11px] font-black uppercase tracking-wider text-neutral-400">Invoice #</th>
                                <th className="px-8 py-3.5 text-[11px] font-black uppercase tracking-wider text-neutral-400">Resident Name</th>
                                <th className="px-8 py-3.5 text-[11px] font-black uppercase tracking-wider text-neutral-400">Billing Period</th>
                                <th className="px-8 py-3.5 text-[11px] font-black uppercase tracking-wider text-neutral-400 text-right">Amount</th>
                                <th className="px-8 py-3.5 text-[11px] font-black uppercase tracking-wider text-neutral-400 text-center">Status</th>
                                <th className="px-8 py-3.5 text-[11px] font-black uppercase tracking-wider text-neutral-400">Due Date</th>
                                <th className="px-8 py-3.5 text-[11px] font-black uppercase tracking-wider text-neutral-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.data.map((invoice: Invoice) => (
                                <tr key={invoice.id} className="group border-b border-neutral-100 dark:border-neutral-800/40 hover:bg-neutral-50/50 transition-colors">
                                    <td className="px-8 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-[13px] font-black text-blue-600 dark:text-blue-400">#{invoice.invoice_number}</span>
                                            <span className="text-[10px] font-bold text-neutral-400 uppercase">System Generated</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-[13px] font-bold text-[#0A2540] dark:text-white">
                                                {invoice.resident.first_name} {invoice.resident.last_name}
                                            </span>
                                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight">Active Homeowner</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <Badge variant="outline" className="text-[10px] font-black uppercase border-neutral-200">
                                            {invoice.billing_period.name}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-4 text-right whitespace-nowrap">
                                        <div className="flex flex-col items-end">
                                            <span className="text-[13px] font-black text-[#0A2540] dark:text-white uppercase tracking-tight">{formatCurrency(invoice.total_amount)}</span>
                                            {invoice.balance > 0 && (
                                                <span className="text-[10px] font-bold text-red-500">Balance: {formatCurrency(invoice.balance)}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 text-center">
                                        <Badge className={`px-2 py-0.5 rounded-md text-[10px] font-black border uppercase ${statusColors[invoice.status] || ''}`}>
                                            {invoice.status}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-2 text-neutral-500">
                                            <Calendar className="size-3 text-neutral-400" />
                                            <span className="text-[12px] font-bold tracking-tight">{new Date(invoice.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="size-8 rounded-lg text-neutral-400 hover:text-blue-600 hover:bg-blue-50">
                                                <MoreVertical className="size-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ─── FOOTER ─── */}
                <div className="shrink-0 px-8 py-4 border-t border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/30 flex items-center justify-between">
                    <p className="text-[12px] text-neutral-400 font-bold uppercase tracking-wider">
                        Showing {invoices.from} to {invoices.to} of {invoices.total} Registry Invoices
                    </p>
                    <div className="flex items-center gap-2">
                        {/* Pagination placeholders */}
                        <div className="flex gap-1">
                            {invoices.links.map((link: any, i: number) => (
                                <Button 
                                    key={i}
                                    variant="outline" 
                                    size="sm" 
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url, filters)}
                                    className={`h-8 px-3 rounded-md text-[11px] font-black ${link.active ? 'bg-blue-600 text-white border-blue-600' : 'text-neutral-500'}`}
                                >
                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function SummaryCard({ title, value, icon: Icon, color, description }: any) {
    const colorClasses: any = {
        blue: 'bg-blue-600 shadow-blue-500/20 text-blue-600',
        emerald: 'bg-emerald-600 shadow-emerald-500/20 text-emerald-600',
        amber: 'bg-amber-600 shadow-amber-500/20 text-amber-600',
    };

    return (
        <div className="p-6 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-100/50 dark:border-neutral-800/50 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className={`flex items-center justify-center size-10 rounded-xl ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]}`}>
                    <Icon className="size-5 text-white" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[11px] font-black uppercase text-neutral-400 tracking-wider font-bold">{title}</span>
                    <span className="text-[20px] font-black text-[#0A2540] dark:text-white leading-tight mt-0.5">{value}</span>
                </div>
            </div>
            <div className="h-px bg-neutral-200/50 dark:bg-neutral-800/50" />
            <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-wide">{description}</p>
        </div>
    );
}

BillingIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Billing & Collection', href: '/admin/billing' },
    ],
};
