import { Link } from '@inertiajs/react';

export default function CTA() {
    return (
        <section className="px-6 py-32 lg:px-12 bg-blue-600 border-t border-blue-500">
            <div className="mx-auto max-w-[1440px] text-center">
                <h2 className="text-4xl font-bold text-white lg:text-6xl tracking-tight leading-tight">
                    Simplify Your HOA <br />
                    Management Today.
                </h2>
                
                <p className="mt-8 mx-auto max-w-2xl text-xl text-blue-100 leading-relaxed">
                    Upgrade your community operations with a modern, efficient, and transparent system.
                </p>
                
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link 
                        href="/register"
                        className="rounded-full bg-white px-12 py-4 text-[17px] font-bold text-blue-600 hover:bg-blue-50 transition-all w-full sm:w-auto shadow-xl shadow-blue-900/20"
                    >
                        Start Now
                    </Link>
                    <button className="rounded-full bg-blue-700/50 border border-blue-400 px-12 py-4 text-[17px] font-bold text-white hover:bg-blue-700 transition-all w-full sm:w-auto">
                        Contact Us
                    </button>
                </div>
            </div>
        </section>
    );
}
