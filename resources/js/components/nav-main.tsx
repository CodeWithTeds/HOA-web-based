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

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-3 py-4">
            <SidebarGroupLabel className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-4 px-2">
                Management Console
            </SidebarGroupLabel>
            <SidebarMenu className="gap-2">
                {items.map((item) => {
                    const active = isCurrentUrl(item.href);
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={active}
                                tooltip={{ children: item.title }}
                                className={`
                                    h-12 px-4 rounded-xl transition-all duration-300
                                    ${active 
                                        ? 'bg-blue-600 shadow-lg shadow-blue-500/20 text-white' 
                                        : 'hover:bg-white/10 text-white/70 hover:text-white'
                                    }
                                `}
                            >
                                <Link href={item.href} prefetch className="flex items-center gap-4">
                                    {item.icon && <item.icon className={`size-5 ${active ? 'text-white' : 'text-blue-400'}`} />}
                                    <span className="font-bold tracking-tight text-[13px]">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
