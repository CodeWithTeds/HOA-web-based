import { Head, usePage } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

export default function Dashboard() {
    const { auth } = usePage<any>().props;
    const { user } = auth || {};
    
    let roleTitle = 'Homeowner';
    if (user?.role === 'admin') roleTitle = 'Admin';
    if (user?.role === 'staff') roleTitle = 'Staff';

    return (
        <>
            <Head title={`Dashboard - ${roleTitle}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6 bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 font-sans">
                <div className="flex flex-col gap-2 tracking-tight">
                    <h1 className="text-4xl font-semibold tracking-[-0.02em] text-neutral-900 dark:text-white">
                        Welcome back, {roleTitle}
                    </h1>
                    <p className="text-lg text-neutral-500 dark:text-neutral-400 font-medium">
                        Here's an overview of your community portal.
                    </p>
                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-3 mt-4">
                    <div className="relative aspect-video overflow-hidden rounded-2xl border border-neutral-200/60 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 shadow-sm transition-all hover:shadow-md">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-2xl border border-neutral-200/60 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 shadow-sm transition-all hover:shadow-md">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-2xl border border-neutral-200/60 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 shadow-sm transition-all hover:shadow-md">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />
                    </div>
                </div>
                <div className="relative min-h-[50vh] flex-1 overflow-hidden rounded-2xl border border-neutral-200/60 md:min-h-min dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 shadow-sm mt-2">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ],
};
