import { Head, Link, router } from '@inertiajs/react';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
    const handleFilterChange = (key: string, value: string) => {
        router.get('/admin/billing', { ...filters, [key]: value }, { preserveState: true });
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
                                <h1 className="text-[22px] font-black tracking-tight text-[#0A2540] dark:text-white">
                                    Billing Registry
                                </h1>
                                <p className="text-[12px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
                                    Management of community assessments and dues
                                </p>
                            </div>
                        </div>
                        <Link href="/admin/billing/create-period">
                            <Button className="h-10 gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-black transition-all active:scale-95 shadow-xl shadow-blue-500/10">
                                <Plus className="size-4" strokeWidth={3} /> Initiate Cycle
                            </Button>
                        </Link>
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
                                className="h-9 px-3 rounded-lg border border-neutral-200 text-[11px] font-black uppercase text-neutral-500"
                                value={filters.billing_period_id || ''}
                                onChange={e => handleFilterChange('billing_period_id', e.target.value)}
                            >
                                <option value="">Filter by Period</option>
                                {periods.map((p: any) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>

                            <select 
                                className="h-9 px-3 rounded-lg border border-neutral-200 text-[11px] font-black uppercase text-neutral-500"
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

                {/* ─── 9-COLUMN ADMINISTRATIVE LEDGER ─── */}
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead className="sticky top-0 z-10 bg-white dark:bg-[#0c0c0c] border-b border-neutral-100 shadow-sm">
                            <tr>
                                <th className="pl-8 px-3 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">Bill #</th>
                                <th className="px-3 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">Last Name</th>
                                <th className="px-3 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">First Name</th>
                                <th className="px-3 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">Type</th>
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
                                    <td className="px-3 py-3 whitespace-nowrap">
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
                                        <span className="text-[12px] font-black text-[#0A2540] dark:text-white uppercase tracking-tight">{formatCurrency(invoice.total_amount)}</span>
                                    </td>
                                    <td className="pr-8 pl-3 py-3 text-right whitespace-nowrap">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="size-8 p-0 rounded-lg text-neutral-400 hover:text-blue-600 transition-opacity opacity-0 group-hover:opacity-100">
                                                    <MoreVertical className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-2xl border-neutral-100">
                                                <DropdownMenuItem className="gap-2.5 text-[11px] font-black uppercase text-emerald-600 py-3 cursor-pointer">
                                                    <CreditCard className="size-3.5" /> Record Payment
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2.5 text-[11px] font-black uppercase text-neutral-500 py-3 cursor-pointer">
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
                    <span className="text-[11px] font-black uppercase text-neutral-400 tracking-wider block mb-0.5">{title}</span>
                    <span className={`text-[20px] font-black leading-none ${theme[color].split(' ')[0]}`}>{value}</span>
                </div>
            </div>
            <div className="h-px bg-neutral-100 dark:bg-neutral-800" />
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-tighter">{description}</p>
        </div>
    );
}

BillingIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Billing Registry', href: '#' },
    ],
};
