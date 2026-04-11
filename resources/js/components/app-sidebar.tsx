import { Link, usePage } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid, Users, Home, CreditCard, BarChart3, Settings2, Megaphone, AlertCircle, MessageSquare, ShieldCheck } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';
import { UserRole } from '@/types';

export function AppSidebar() {
    const { auth } = usePage<any>().props;
    let dashLink = '/dashboard';
    if (auth?.user?.role === UserRole.ADMIN) dashLink = '/admin/dashboard';
    if (auth?.user?.role === UserRole.STAFF) dashLink = '/staff/dashboard';


    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashLink,
            icon: LayoutGrid,
        },
    ];

    if (auth?.user?.role === UserRole.ADMIN) {
        mainNavItems.push(
            {
                title: 'User Management',
                href: '/admin/users',
                icon: Users,
            },
            {
                title: 'Resident Management',
                href: '/admin/residents',
                icon: Home,
            },
            {
                title: 'Billing and Collection',
                href: '/admin/billing',
                icon: CreditCard,
            },
            {
                title: 'Reports and Analytics',
                href: '/admin/reports',
                icon: BarChart3,
            },
            {
                title: 'Facility Management',
                href: '/admin/facilities',
                icon: Settings2,
            },
            {
                title: 'Announcements',
                href: '/admin/announcements',
                icon: Megaphone,
            },
            {
                title: 'Complaints Management',
                href: '/admin/complaints',
                icon: AlertCircle,
            },
            {
                title: 'Chat Support',
                href: '/admin/chat',
                icon: MessageSquare,
            },
            {
                title: 'System Settings',
                href: '/admin/settings',
                icon: ShieldCheck,
            },
        );
    }


    return (
        <Sidebar collapsible="icon" variant="inset" className="border-none">
            <SidebarHeader className="pt-10 px-6 pb-6">
                <Link href={dashLink} prefetch className="flex items-center gap-4 group">
                    <div className="h-11 w-11 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-black/20 group-hover:scale-110 transition-all duration-500">
                        <AppLogoIcon className="size-7 text-blue-600 fill-blue-600" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-black text-base tracking-tighter leading-none">Smart HOA</span>
                        <span className="text-white/60 text-[10px] uppercase font-bold tracking-widest mt-1.5">Management Pro</span>
                    </div>
                </Link>
            </SidebarHeader>

            <SidebarContent className="mt-2">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="p-4 mt-auto border-t border-white/10 bg-black/5">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
