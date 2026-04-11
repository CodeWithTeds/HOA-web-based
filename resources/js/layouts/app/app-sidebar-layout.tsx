import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { ErrorBoundary } from '@/components/error-boundary';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <ErrorBoundary>
                <AppSidebar />
            </ErrorBoundary>
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <ErrorBoundary>
                    <AppSidebarHeader breadcrumbs={breadcrumbs} />
                    {children}
                </ErrorBoundary>
            </AppContent>
        </AppShell>
    );
}
