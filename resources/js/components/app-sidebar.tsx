import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    Users,
    Home,
    CreditCard,
    BarChart3,
    Settings2,
    Megaphone,
    AlertCircle,
    MessageSquare,
    ShieldCheck,
    CalendarCheck,
    BookUser,
    LogOut,
    Receipt,
    FileText,
} from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';

// ─── Theme palettes ───────────────────────────────────────────────────────────

// Admin: deep navy blue (original)
const adminSidebarStyle = {} as React.CSSProperties; // uses global CSS vars (#0A2540)

// Staff: deep emerald / teal
const staffSidebarStyle = {
    '--sidebar': '#0B3D2E',
    '--sidebar-foreground': '#FFFFFF',
    '--sidebar-primary': '#10B981',
    '--sidebar-primary-foreground': '#FFFFFF',
    '--sidebar-accent': '#134D39',
    '--sidebar-accent-foreground': '#FFFFFF',
    '--sidebar-border': '#1A5C44',
    '--sidebar-ring': '#10B981',
} as React.CSSProperties;

// Homeowner: clean white — landing page aesthetic, no background
const homeownerSidebarStyle = {
    '--sidebar': '#2563EB',
    '--sidebar-foreground': '#FFFFFF',
    '--sidebar-primary': '#FFFFFF',
    '--sidebar-primary-foreground': '#2563EB',
    '--sidebar-accent': '#1D4ED8',
    '--sidebar-accent-foreground': '#FFFFFF',
    '--sidebar-border': '#1E40AF',
    '--sidebar-ring': '#FFFFFF',
} as React.CSSProperties;

// ─── Component ────────────────────────────────────────────────────────────────

export function AppSidebar() {
    const { auth } = usePage<any>().props;
    const role = auth?.user?.role as UserRole | undefined;

    let dashLink = '/dashboard';
    if (role === UserRole.ADMIN) dashLink = '/admin/dashboard';
    if (role === UserRole.STAFF) dashLink = '/staff/dashboard';

    // ── Nav items ──────────────────────────────────────────────────────────────

    const mainNavItems: NavItem[] = [
        { title: 'Dashboard', href: dashLink, icon: LayoutGrid },
    ];

    if (role === UserRole.ADMIN) {
        mainNavItems.push(
            { title: 'User Management',        href: '/admin/users',         icon: Users },
            { title: 'Resident Management',    href: '/admin/residents',     icon: Home },
            { title: 'Billing and Collection', href: '/admin/billing',       icon: CreditCard },
            { title: 'Reports and Analytics',  href: '/admin/reports',       icon: BarChart3 },
            { title: 'Facility Management',    href: '/admin/facilities',    icon: Settings2 },
            { title: 'Announcements',          href: '/admin/announcements', icon: Megaphone },
            { title: 'Complaints Management',  href: '/admin/complaints',    icon: AlertCircle },
            { title: 'Chat Support',           href: '/admin/chat',          icon: MessageSquare },
            { title: 'System Settings',        href: '/admin/settings',      icon: ShieldCheck },
        );
    }

    if (role === UserRole.STAFF) {
        mainNavItems.push(
            { title: 'Resident Management',   href: '/staff/residents',     icon: BookUser },
            { title: 'Billing and Payments',  href: '/staff/billing',       icon: CreditCard },
            { title: 'Facility Reservations', href: '/staff/facilities',    icon: CalendarCheck },
            { title: 'Complaints',            href: '/staff/complaints',    icon: AlertCircle },
            { title: 'Chat Support',          href: '/staff/chat',          icon: MessageSquare },
            { title: 'Reports',               href: '/staff/reports',       icon: BarChart3 },
            { title: 'Announcements',         href: '/staff/announcements', icon: Megaphone },
            { title: 'Logout',                href: '/logout',              icon: LogOut },
        );
    }

    if (role === UserRole.HOMEOWNER) {
        mainNavItems.push(
            { title: 'My Bills',              href: '/billing',             icon: Receipt },
            { title: 'Facility Booking',      href: '/facilities',          icon: CalendarCheck },
            { title: 'Complaints',            href: '/complaints',          icon: AlertCircle },
            { title: 'Announcements',         href: '/announcements',       icon: Megaphone },
            { title: 'Documents',             href: '/documents',           icon: FileText },
            { title: 'Chat Support',          href: '/chat',                icon: MessageSquare },
            { title: 'Logout',                href: '/logout',              icon: LogOut },
        );
    }

    // ── Role-specific appearance ───────────────────────────────────────────────

    const isStaff     = role === UserRole.STAFF;
    const isHomeowner = role === UserRole.HOMEOWNER;

    const sidebarStyle = isStaff
        ? staffSidebarStyle
        : isHomeowner
            ? homeownerSidebarStyle
            : adminSidebarStyle;

    const accentColor = isStaff ? 'emerald' : isHomeowner ? 'white' : 'blue';

    // Logo icon & header text color differ per role
    const logoIconClass = isStaff
        ? 'text-emerald-600'
        : 'text-blue-600';

    const brandNameClass = 'text-white';
    const brandSubClass  = 'text-white/60';
    const footerClass    = 'p-4 mt-auto border-t border-white/10 bg-black/5';

    const logoBoxClass = 'h-11 w-11 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-black/20 group-hover:scale-110 transition-all duration-500';

    const portalLabel = isStaff
        ? 'Staff Portal'
        : isHomeowner
            ? 'Resident Portal'
            : 'Management Pro';

    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            className={cn(
                "border-none transition-colors duration-300",
                isHomeowner && "bg-[#2563EB] [&_[data-sidebar=sidebar]]:bg-[#2563EB]"
            )}
            style={sidebarStyle}
        >
            <SidebarHeader className="pt-10 px-6 pb-6">
                <Link href={dashLink} prefetch className="flex items-center gap-4 group">
                    <div className={logoBoxClass}>
                        <AppLogoIcon className={`size-7 fill-current ${logoIconClass}`} />
                    </div>
                    <div className="flex flex-col">
                        <span className={`font-black text-base tracking-tighter leading-none ${brandNameClass}`}>
                            Smart HOA
                        </span>
                        <span className={`text-[10px] uppercase font-bold tracking-widest mt-1.5 ${brandSubClass}`}>
                            {portalLabel}
                        </span>
                    </div>
                </Link>
            </SidebarHeader>

            <SidebarContent className="mt-2">
                <NavMain items={mainNavItems} accentColor={accentColor} isLight={false} />
            </SidebarContent>

            <SidebarFooter className={footerClass}>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
