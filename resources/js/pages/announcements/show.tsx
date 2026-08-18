import { Head, Link } from '@inertiajs/react';
import { Calendar, User, ArrowLeft, Tag, Clock } from 'lucide-react';
import Footer from '@/components/landing/Footer';
import Navbar from '@/components/landing/Navbar';

export default function AnnouncementShow({ announcement }: { announcement: { data: any } }) {
    const res = announcement.data;
    const fontStack = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif';

    return (
        <div className="font-sans antialiased text-[#0A2540] bg-white" style={{ fontFamily: fontStack }}>
            <Head title={`${res.title} - Smart HOA`} />
            
            <Navbar />
            
            <main className="pt-32 pb-24 px-6 lg:px-12">
                <div className="mx-auto max-w-[900px]">
                    {/* BACK BUTTON */}
                    <Link 
                        href="/" 
                        className="inline-flex items-center gap-2 text-blue-600 font-black text-sm mb-12 hover:translate-x-[-4px] transition-transform"
                    >
                        <ArrowLeft className="size-4" /> Back to Home
                    </Link>

                    {/* HERO HEADER */}
                    <div className="space-y-6 mb-12">
                        <div className="flex items-center gap-3">
                            <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                                res.priority === 'urgent' 
                                    ? 'bg-red-50 text-red-600' 
                                    : res.priority === 'important'
                                        ? 'bg-amber-50 text-amber-600'
                                        : 'bg-blue-50 text-blue-600'
                            }`}>
                                {res.category}
                            </span>
                            <span className="text-neutral-300">•</span>
                            <div className="flex items-center gap-1.5 text-neutral-400 text-[12px] font-bold">
                                <Calendar className="size-3.5" />
                                {new Date(res.published_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                            </div>
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-[#0A2540] leading-[1.1]">
                            {res.title}
                        </h1>

                        <div className="flex items-center gap-4 pt-4 border-t border-gray-50 uppercase tracking-widest text-[11px] font-black text-neutral-400">
                            <div className="flex items-center gap-2">
                                <div className="size-8 rounded-full bg-neutral-100 flex items-center justify-center text-[#0A2540]">
                                    <User className="size-4" />
                                </div>
                                <span>Posted by {res.author?.name}</span>
                            </div>
                            <span className="text-neutral-200">|</span>
                            <div className="flex items-center gap-2">
                                <Tag className="size-4" />
                                <span>{res.priority} Priority</span>
                            </div>
                        </div>
                    </div>

                    {/* FEATURED IMAGE */}
                    {res.image_url && (
                        <div className="mb-16 rounded-[3rem] overflow-hidden shadow-2xl shadow-blue-500/10 border border-gray-100">
                            <img 
                                src={res.image_url} 
                                alt={res.title} 
                                className="w-full h-auto object-cover max-h-[600px]"
                            />
                        </div>
                    )}

                    {/* CONTENT */}
                    <div className="prose prose-lg max-w-none">
                        <div className="text-xl text-[#0A2540] leading-relaxed font-medium whitespace-pre-wrap">
                            {res.content}
                        </div>
                    </div>

                    {/* FOOTER ACTIONS */}
                    <div className="mt-20 p-12 rounded-[3rem] bg-[#F5F5F7] text-center border border-gray-100">
                        <h3 className="text-2xl font-black text-[#0A2540] mb-4">Want to stay updated?</h3>
                        <p className="text-[#86868B] font-medium mb-8 max-w-md mx-auto">
                            Join our community portal to receive real-time notifications, bill updates, and facility booking access.
                        </p>
                        <Link 
                            href="/register" 
                            className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-full font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
                        >
                            Register Now
                        </Link>
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    );
}
