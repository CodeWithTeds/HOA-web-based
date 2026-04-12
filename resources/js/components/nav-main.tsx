import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

type AccentColor = 'blue' | 'emerald' | 'white';

export function NavMain({
    items = [],
    accentColor = 'blue',
    isLight = false,
}: {
    items: NavItem[];
    accentColor?: AccentColor;
    isLight?: boolean;
}) {
    const { isCurrentUrl } = useCurrentUrl();

    // Active pill style
    const activeClass = accentColor === 'emerald'
        ? 'bg-emerald-600 shadow-lg shadow-emerald-500/20 text-white'
        : accentColor === 'white'
            ? 'bg-white/20 shadow-md text-white'
            : isLight
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                : 'bg-blue-600 shadow-lg shadow-blue-500/20 text-white';

    // Inactive item style
    const inactiveClass = isLight
        ? 'hover:bg-blue-50 text-[#1D1D1F]/70 hover:text-blue-600'
        : 'hover:bg-white/10 text-white/70 hover:text-white';

    // Icon color when inactive
    const iconInactiveClass = accentColor === 'emerald'
        ? 'text-emerald-400'
        : accentColor === 'white'
            ? 'text-blue-200'
            : isLight
                ? 'text-blue-400'
                : 'text-blue-400';

    const groupLabel = accentColor === 'emerald'
        ? 'Staff Console'
        : accentColor === 'white'
            ? 'Resident Portal'
            : isLight
                ? 'My Portal'
                : 'Management Console';

    const labelClass = isLight
        ? 'text-[#86868B] text-[10px] uppercase tracking-widest font-bold mb-4 px-2'
        : 'text-white/40 text-[10px] uppercase tracking-widest font-bold mb-4 px-2';

    return (
        <SidebarGroup className="px-3 py-4">
            <SidebarGroupLabel className={labelClass}>
                {groupLabel}
            </SidebarGroupLabel>
            <SidebarMenu className="gap-1">
                {items.map((item) => {
                    const active = isCurrentUrl(item.href);
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={active}
                                tooltip={{ children: item.title }}
                                className={`
                                    h-11 px-4 rounded-xl transition-all duration-200
                                    ${active ? activeClass : inactiveClass}
                                `}
                            >
                                <Link href={item.href} prefetch className="flex items-center gap-3">
                                    {item.icon && (
                                        <item.icon
                                            className={`size-[18px] ${active ? 'text-white' : iconInactiveClass}`}
                                        />
                                    )}
                                    <span className={`font-semibold tracking-tight text-[13px]`}>
                                        {item.title}
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
