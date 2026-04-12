import { Shield, Smartphone, Home, PieChart, MessageSquare, Zap, CheckCircle2, Calendar } from 'lucide-react';

export default function Features() {
    return (
        <section className="bg-white py-32 px-6 lg:px-12">
            <div className="mx-auto max-w-[1440px]">
                <div className="mb-20">
                    <h2 className="text-5xl font-black text-[#0A2540] tracking-tighter lg:text-7xl mb-6">
                        Designed for <br />
                        <span className="text-blue-600">Modern Living.</span>
                    </h2>
                    <p className="max-w-2xl text-xl text-[#86868B] font-medium leading-relaxed">
                        Experience a suite of tools built with precision and elegance,
                        tailored to make community management effortless.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-[280px]">

                    {/* Card 1: Facility Booking (Apple Style) */}
                    <div className="md:col-span-3 lg:col-span-4 bg-gradient-to-br from-[#0A2540] to-[#1D1D1F] rounded-[2.5rem] p-8 relative overflow-hidden group shadow-2xl">
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <Home className="h-10 w-10 text-white mb-6 opacity-80" />
                                <h3 className="text-2xl font-bold text-white mb-2">Facility Booking</h3>
                                <p className="text-gray-400 text-sm leading-relaxed max-w-[200px]">
                                    Reserve clubhouses, courts, and parks with a single tap.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="h-8 w-20 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-[10px] text-white font-mono lowercase tracking-tighter">confirmed</span>
                                <span className="text-white/40 font-mono text-xs">RES #827</span>
                            </div>
                        </div>
                        {/* Decorative Gradient Glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] -mr-32 -mt-32 group-hover:bg-blue-600/30 transition-all duration-700" />
                    </div>

                    {/* Card 2: The iPhone Style (Mobile Content) */}
                    <div className="md:col-span-3 lg:col-span-4 bg-[#F5F5F7] rounded-[2.5rem] relative overflow-hidden shadow-sm border border-gray-100 group">
                        <div className="p-8 pb-0">
                            <h3 className="text-2xl font-bold text-[#0A2540] mb-2 text-center">Mobile First</h3>
                            <p className="text-[#86868B] text-sm text-center mb-8">Access your community anywhere.</p>
                        </div>

                        {/* iPhone Frame */}
                        <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[220px] h-[400px] bg-white rounded-[3rem] border-[8px] border-gray-900 shadow-2xl relative overflow-hidden group-hover:translate-y-[-20px] transition-transform duration-500">
                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-900 rounded-b-xl z-20" />
                            {/* App Content Preview */}
                            <div className="p-4 pt-8">
                                <div className="h-32 w-full bg-blue-50 rounded-2xl mb-4 animate-pulse" />
                                <div className="space-y-3">
                                    <div className="h-2 w-full bg-gray-100 rounded-full" />
                                    <div className="h-2 w-2/3 bg-gray-100 rounded-full" />
                                    <div className="h-2 w-1/2 bg-gray-100 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Large Analytics Feature */}
                    <div className="md:col-span-6 lg:col-span-4 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
                        <div className="h-full flex flex-col justify-between">
                            <div>
                                <Zap className="h-8 w-8 text-blue-600 mb-6" />
                                <h3 className="text-2xl font-bold text-[#0A2540] mb-3">Live Insights</h3>
                                <p className="text-[#86868B] text-[15px] leading-relaxed">
                                    Track community happiness and facility usage with real-time data visualization.
                                </p>
                            </div>
                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-50">
                                    <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">Active Now</p>
                                    <p className="text-2xl font-bold text-[#0A2540]">128</p>
                                </div>
                                <div className="bg-green-50/50 p-4 rounded-2xl border border-green-50">
                                    <p className="text-[10px] font-bold text-green-600 uppercase mb-1">Satisfaction</p>
                                    <p className="text-2xl font-bold text-[#0A2540]">98%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Communication (Wide) */}
                    <div className="md:col-span-4 lg:col-span-8 bg-[#FBFBFB] rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
                        <div className="flex flex-col lg:flex-row items-center gap-12 h-full">
                            <div className="lg:w-1/2">
                                <MessageSquare className="h-8 w-8 text-blue-600 mb-6" />
                                <h3 className="text-3xl font-bold text-[#0A2540] mb-4">Direct Messaging</h3>
                                <p className="text-[#86868B] text-lg leading-relaxed">
                                    Communicate with HOA staff and neighbors instantly.
                                    Professional, recorded, and secure chat threads for official community matters.
                                </p>
                            </div>
                            <div className="lg:w-1/2 w-full space-y-4">
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex items-center gap-4 group-hover:translate-x-2 transition-transform">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">A</div>
                                    <div>
                                        <p className="text-[13px] font-bold text-[#0A2540]">Admin Support</p>
                                        <p className="text-[11px] text-[#86868B]">Your request #293 is updated.</p>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex items-center gap-4 group-hover:translate-x-4 transition-transform delay-75">
                                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">M</div>
                                    <div>
                                        <p className="text-[13px] font-bold text-[#0A2540]">Maintenance</p>
                                        <p className="text-[11px] text-[#86868B]">Technician arriving at 2:00 PM.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 5: Security (Small) */}
                    <div className="md:col-span-2 lg:col-span-4 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
                        <Shield className="h-10 w-10 text-blue-600 mb-6" />
                        <h3 className="text-2xl font-bold text-[#0A2540] mb-3">Enterprise Security</h3>
                        <p className="text-[#86868B] text-[15px] leading-relaxed">
                            Bank-level encryption for all your community data and financial transactions.
                        </p>
                        <div className="absolute bottom-4 right-4 text-blue-100 opacity-20">
                            <Shield className="h-32 w-32" />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
