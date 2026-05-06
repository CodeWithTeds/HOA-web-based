import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
    wide = false,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col justify-end p-10 pb-20 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 overflow-hidden bg-zinc-900">
                    <img
                        src="/images/auth-bg.png"
                        alt="Background"
                        className="pointer-events-none h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-900/40 to-transparent" />
                </div>

                <Link
                    href={home()}
                    className="absolute top-10 left-10 z-20 flex items-center text-lg font-medium"
                >
                    <AppLogoIcon className="mr-2 size-8" />
                    {name}
                </Link>

                <div className="relative z-20 mt-auto flex max-w-md flex-col gap-2">
                    <h1 className="text-4xl font-semibold tracking-tight text-white drop-shadow-sm">
                        Welcome Back
                    </h1>
                    <p className="text-lg text-zinc-200 drop-shadow-sm">
                        Manage your HOA system efficiently
                    </p>
                </div>
            </div>
            <div className="w-full lg:p-8">
                <div
                    className={`mx-auto flex w-full flex-col justify-center space-y-6 ${wide ? 'max-w-5xl px-4 py-8 sm:px-6 lg:px-0' : 'sm:w-[350px]'}`}
                >
                    <Link
                        href={home()}
                        className="relative z-20 flex items-center justify-center lg:hidden"
                    >
                        <AppLogoIcon className="h-10 sm:h-12" />
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {title}
                        </h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
