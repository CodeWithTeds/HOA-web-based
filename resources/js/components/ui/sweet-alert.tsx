import * as React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface SweetAlertProps {
    type: AlertType;
    title: string;
    message?: string;
    show: boolean;
    onClose: () => void;
    duration?: number;
}

const alertConfig: Record<AlertType, { icon: React.ElementType; bg: string; iconBg: string; iconColor: string; ring: string; bar: string }> = {
    success: {
        icon: CheckCircle2,
        bg: 'bg-white dark:bg-neutral-900 border-green-200 dark:border-green-800/50',
        iconBg: 'bg-green-50 dark:bg-green-900/30',
        iconColor: 'text-green-500',
        ring: 'ring-green-500/20',
        bar: 'bg-green-500',
    },
    error: {
        icon: XCircle,
        bg: 'bg-white dark:bg-neutral-900 border-red-200 dark:border-red-800/50',
        iconBg: 'bg-red-50 dark:bg-red-900/30',
        iconColor: 'text-red-500',
        ring: 'ring-red-500/20',
        bar: 'bg-red-500',
    },
    warning: {
        icon: AlertTriangle,
        bg: 'bg-white dark:bg-neutral-900 border-amber-200 dark:border-amber-800/50',
        iconBg: 'bg-amber-50 dark:bg-amber-900/30',
        iconColor: 'text-amber-500',
        ring: 'ring-amber-500/20',
        bar: 'bg-amber-500',
    },
    info: {
        icon: Info,
        bg: 'bg-white dark:bg-neutral-900 border-blue-200 dark:border-blue-800/50',
        iconBg: 'bg-blue-50 dark:bg-blue-900/30',
        iconColor: 'text-blue-500',
        ring: 'ring-blue-500/20',
        bar: 'bg-blue-500',
    },
};

export function SweetAlert({ type, title, message, show, onClose, duration = 4000 }: SweetAlertProps) {
    const [visible, setVisible] = React.useState(false);
    const [progress, setProgress] = React.useState(100);
    const config = alertConfig[type];
    const Icon = config.icon;

    React.useEffect(() => {
        if (show) {
            setVisible(true);
            setProgress(100);
            const startTime = Date.now();
            const interval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
                setProgress(remaining);
                if (remaining <= 0) {
                    clearInterval(interval);
                    setVisible(false);
                    setTimeout(onClose, 300);
                }
            }, 16);
            return () => clearInterval(interval);
        } else {
            setVisible(false);
        }
    }, [show, duration, onClose]);

    if (!show && !visible) return null;

    return (
        <div className="fixed top-6 right-6 z-[100] pointer-events-none" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif' }}>
            <div
                className={cn(
                    'pointer-events-auto w-[420px] overflow-hidden rounded-2xl border shadow-2xl shadow-black/10 ring-1 transition-all duration-300 ease-out',
                    config.bg,
                    config.ring,
                    visible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-8 opacity-0 scale-95',
                )}
            >
                <div className="flex items-start gap-4 p-5">
                    <div className={cn('flex-shrink-0 rounded-xl p-2.5', config.iconBg)}>
                        <Icon className={cn('size-6', config.iconColor)} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                        <p className="text-[15px] font-bold text-neutral-900 dark:text-white leading-tight">{title}</p>
                        {message && (
                            <p className="text-[13px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">{message}</p>
                        )}
                    </div>
                    <button
                        onClick={() => {
                            setVisible(false);
                            setTimeout(onClose, 300);
                        }}
                        className="flex-shrink-0 rounded-lg p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                        <X className="size-4" />
                    </button>
                </div>
                <div className="h-1 w-full bg-neutral-100 dark:bg-neutral-800">
                    <div
                        className={cn('h-full transition-none rounded-full', config.bar)}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
