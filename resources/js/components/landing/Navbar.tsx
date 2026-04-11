import { Link } from '@inertiajs/react';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4 lg:px-12">
            <div className="mx-auto max-w-[1440px] flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl font-black text-blue-600 tracking-tighter uppercase">Smart HOA</span>
                </Link>

                {/* Navigation Links */}
                <div className="hidden items-center gap-8 lg:flex">
                    <Link href="#" className="text-[13px] font-medium text-[#1D1D1F]/70 hover:text-blue-600 transition-colors">Overview</Link>
                    <Link href="#" className="text-[13px] font-medium text-[#1D1D1F]/70 hover:text-blue-600 transition-colors">Features</Link>
                    <Link href="#" className="text-[13px] font-medium text-[#1D1D1F]/70 hover:text-blue-600 transition-colors">Transparency</Link>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-6">
                    <Link href="/login" className="text-[13px] font-medium text-[#1D1D1F]/70 hover:text-blue-600 transition-colors">Sign In</Link>
                    <Link
                        href="/register"
                        className="rounded-full bg-blue-600 px-5 py-2 text-[13px] font-semibold text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
}
