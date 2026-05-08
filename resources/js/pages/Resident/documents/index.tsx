import { Head, Link } from '@inertiajs/react';
import {
    BadgeCheck,
    BookOpen,
    CalendarClock,
    ClipboardList,
    Download,
    FileCheck2,
    FileText,
    FolderOpen,
    Landmark,
    Receipt,
    Search,
    ShieldCheck,
} from 'lucide-react';
import { useMemo, useState } from 'react';

const fontStack =
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif';

type DocumentItem = {
    id: number;
    title: string;
    description: string;
    category: string;
    status: 'Available' | 'Updated' | 'Required';
    updatedAt: string;
    owner: string;
    icon: React.ElementType;
    actionLabel: string;
    href: string;
};

const documents: DocumentItem[] = [
    {
        id: 1,
        title: 'HOA Rules and Regulations',
        description:
            'Community standards covering resident conduct, shared spaces, noise, parking, and visitor policies.',
        category: 'Governance',
        status: 'Updated',
        updatedAt: 'May 2026',
        owner: 'HOA Board',
        icon: BookOpen,
        actionLabel: 'Review rules',
        href: '/announcements',
    },
    {
        id: 2,
        title: 'Billing and Payment Guide',
        description:
            'Payment channels, proof upload requirements, verification flow, and common billing reminders.',
        category: 'Billing',
        status: 'Available',
        updatedAt: 'May 2026',
        owner: 'Finance Office',
        icon: Receipt,
        actionLabel: 'Open billing',
        href: '/billing',
    },
    {
        id: 3,
        title: 'Facility Booking Guidelines',
        description:
            'Reservation rules, usage hours, booking approval notes, and resident responsibilities for amenities.',
        category: 'Facilities',
        status: 'Available',
        updatedAt: 'Apr 2026',
        owner: 'Facility Team',
        icon: CalendarClock,
        actionLabel: 'Book facility',
        href: '/facilities',
    },
    {
        id: 4,
        title: 'Complaint Filing Procedure',
        description:
            'A resident guide for submitting complaints, adding supporting details, and tracking resolution status.',
        category: 'Requests',
        status: 'Required',
        updatedAt: 'Apr 2026',
        owner: 'Resident Support',
        icon: ClipboardList,
        actionLabel: 'File complaint',
        href: '/complaints',
    },
    {
        id: 5,
        title: 'Community Financial Summary',
        description:
            'Resident-facing summary of billed dues, verified collections, outstanding balance, and collection rate.',
        category: 'Transparency',
        status: 'Updated',
        updatedAt: 'Live',
        owner: 'Finance Office',
        icon: Landmark,
        actionLabel: 'View summary',
        href: '/transparency',
    },
    {
        id: 6,
        title: 'Resident Account Checklist',
        description:
            'Quick checklist for keeping contact details, billing profile, receipts, and community access up to date.',
        category: 'Profile',
        status: 'Available',
        updatedAt: 'Mar 2026',
        owner: 'Admin Office',
        icon: FileCheck2,
        actionLabel: 'Go dashboard',
        href: '/dashboard',
    },
];

const categories = [
    'All',
    ...Array.from(new Set(documents.map((doc) => doc.category))),
];

export default function ResidentDocuments() {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('All');

    const filteredDocuments = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        return documents.filter((document) => {
            const matchesCategory =
                category === 'All' || document.category === category;
            const matchesQuery =
                normalizedQuery.length === 0 ||
                [document.title, document.description, document.category]
                    .join(' ')
                    .toLowerCase()
                    .includes(normalizedQuery);

            return matchesCategory && matchesQuery;
        });
    }, [category, query]);

    return (
        <>
            <Head title="Documents | Resident Portal" />

            <div
                className="flex h-full flex-1 flex-col overflow-hidden rounded-2xl bg-white text-[#0A2540] dark:bg-[#0c0c0c] dark:text-neutral-100"
                style={{ fontFamily: fontStack }}
            >
                <div className="shrink-0 border-b border-neutral-100 bg-neutral-50/30 px-8 py-6 dark:border-neutral-800/60 dark:bg-neutral-900/40">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20">
                                <FolderOpen
                                    className="size-5 text-white"
                                    strokeWidth={2.5}
                                />
                            </div>
                            <div>
                                <h1 className="text-[22px] leading-none font-black tracking-tight">
                                    Documents
                                </h1>
                                <p className="mt-1.5 text-[12px] font-bold tracking-wide text-neutral-400 uppercase">
                                    Resident forms, guides, policies, and HOA
                                    references
                                </p>
                            </div>
                        </div>

                        <div className="relative w-full lg:w-80">
                            <Search className="absolute top-3 left-3 size-4 text-neutral-400" />
                            <input
                                value={query}
                                onChange={(event) =>
                                    setQuery(event.target.value)
                                }
                                placeholder="Search documents..."
                                className="h-10 w-full rounded-xl border border-neutral-200 bg-white pr-4 pl-10 text-[13px] font-bold transition outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50 dark:border-neutral-800 dark:bg-neutral-950"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-8 py-8">
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
                        <SummaryCard
                            title="Available Documents"
                            value={documents.length.toString()}
                            description="Resident-facing references"
                            icon={FileText}
                            tone="blue"
                        />
                        <SummaryCard
                            title="Updated Guides"
                            value={documents
                                .filter((doc) => doc.status === 'Updated')
                                .length.toString()}
                            description="Recently refreshed items"
                            icon={BadgeCheck}
                            tone="emerald"
                        />
                        <SummaryCard
                            title="Required Reading"
                            value={documents
                                .filter((doc) => doc.status === 'Required')
                                .length.toString()}
                            description="Important resident procedures"
                            icon={ShieldCheck}
                            tone="amber"
                        />
                        <SummaryCard
                            title="Categories"
                            value={(categories.length - 1).toString()}
                            description="Grouped for quick browsing"
                            icon={FolderOpen}
                            tone="indigo"
                        />
                    </div>

                    <div className="mt-8 flex flex-wrap gap-2">
                        {categories.map((item) => (
                            <button
                                key={item}
                                onClick={() => setCategory(item)}
                                className={`rounded-xl px-4 py-2 text-[11px] font-black tracking-wide uppercase transition ${
                                    category === item
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                        : 'bg-neutral-100 text-neutral-500 hover:bg-blue-50 hover:text-blue-600 dark:bg-neutral-900'
                                }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
                        {filteredDocuments.length > 0 ? (
                            filteredDocuments.map((document) => (
                                <DocumentCard
                                    key={document.id}
                                    document={document}
                                />
                            ))
                        ) : (
                            <div className="xl:col-span-2">
                                <EmptyState text="No documents match your search." />
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
    value,
    description,
    icon: Icon,
    tone,
}: {
    title: string;
    value: string;
    description: string;
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
            <div className={`mb-5 w-max rounded-xl p-2.5 ${tones[tone]}`}>
                <Icon className="size-5" strokeWidth={2.5} />
            </div>
            <p className="text-[11px] font-black tracking-[0.1em] text-neutral-400 uppercase">
                {title}
            </p>
            <h3 className="mt-2 text-[26px] leading-none font-black tracking-tight">
                {value}
            </h3>
            <p className="mt-2 text-[12px] font-bold text-neutral-400">
                {description}
            </p>
        </div>
    );
}

function DocumentCard({ document }: { document: DocumentItem }) {
    const Icon = document.icon;

    return (
        <article className="group rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/5 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-start justify-between gap-5">
                <div className="flex min-w-0 gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40">
                        <Icon className="size-5" strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[9px] font-black tracking-widest text-neutral-500 uppercase dark:bg-neutral-950">
                                {document.category}
                            </span>
                            <StatusBadge status={document.status} />
                        </div>
                        <h2 className="mt-3 text-[16px] leading-snug font-black tracking-tight text-[#0A2540] dark:text-white">
                            {document.title}
                        </h2>
                        <p className="mt-2 text-[12px] leading-relaxed font-semibold text-neutral-500">
                            {document.description}
                        </p>
                    </div>
                </div>
                <Download className="mt-1 size-4 shrink-0 text-neutral-300 transition group-hover:text-blue-500" />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-neutral-100 pt-5 dark:border-neutral-800">
                <DocumentMetric label="Owner" value={document.owner} />
                <DocumentMetric label="Updated" value={document.updatedAt} />
            </div>

            <Link
                href={document.href}
                className="mt-5 flex h-10 items-center justify-center rounded-xl bg-blue-600 px-4 text-[11px] font-black tracking-wide text-white uppercase shadow-lg shadow-blue-500/10 transition hover:bg-blue-700"
            >
                {document.actionLabel}
            </Link>
        </article>
    );
}

function StatusBadge({ status }: { status: DocumentItem['status'] }) {
    const classes = {
        Available: 'bg-blue-50 text-blue-600',
        Updated: 'bg-emerald-50 text-emerald-600',
        Required: 'bg-amber-50 text-amber-600',
    };

    return (
        <span
            className={`rounded-full px-2.5 py-1 text-[9px] font-black tracking-widest uppercase ${classes[status]}`}
        >
            {status}
        </span>
    );
}

function DocumentMetric({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-[10px] font-black tracking-wide text-neutral-400 uppercase">
                {label}
            </p>
            <p className="mt-1 text-[12px] font-black text-[#0A2540] dark:text-white">
                {value}
            </p>
        </div>
    );
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="flex min-h-44 items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-10 text-center text-[13px] font-bold text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900">
            {text}
        </div>
    );
}
