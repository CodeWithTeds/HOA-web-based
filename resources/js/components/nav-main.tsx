import { Link, router } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
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
                    const hasSubItems = item.items && item.items.length > 0;
                    const isAnyChildActive = hasSubItems && item.items?.some(sub => isCurrentUrl(sub.href));
                    const active = isCurrentUrl(item.href) || isAnyChildActive;

                    if (!hasSubItems) {
                        const isLogout = item.href === '/logout';

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
                                    {isLogout ? (
                                        <button
                                            onClick={() => router.post('/logout')}
                                            className="flex items-center gap-3 w-full"
                                        >
                                            {item.icon && (
                                                <item.icon
                                                    className={`size-[18px] ${iconInactiveClass}`}
                                                />
                                            )}
                                            <span className="font-semibold tracking-tight text-[13px]">
                                                {item.title}
                                            </span>
                                        </button>
                                    ) : (
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
                                    )}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    }

                    return (
                        <Collapsible key={item.title} asChild defaultOpen={active} className="group/collapsible">
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        tooltip={{ children: item.title }}
                                        className={`
                                            h-11 px-4 rounded-xl transition-all duration-200
                                            ${active ? activeClass : inactiveClass}
                                        `}
                                    >
                                        <div className="flex items-center gap-3 w-full">
                                            {item.icon && (
                                                <item.icon
                                                    className={`size-[18px] ${active ? 'text-white' : iconInactiveClass}`}
                                                />
                                            )}
                                            <span className={`font-semibold tracking-tight text-[13px] flex-1 text-left`}>
                                                {item.title}
                                            </span>
                                            <ChevronRight className={`ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 ${active ? 'text-white' : 'text-white/40'}`} />
                                        </div>
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub className="mt-1 flex flex-col gap-0.5 border-l-0 ml-0 pl-11">
                                        {item.items?.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton asChild isActive={isCurrentUrl(subItem.href)}>
                                                    <Link 
                                                        href={subItem.href}
                                                        className={`
                                                            text-[12px] font-bold h-8 transition-colors
                                                            ${isCurrentUrl(subItem.href) ? 'text-white' : 'text-white/50 hover:text-white'}
                                                        `}
                                                    >
                                                        {subItem.title}
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
