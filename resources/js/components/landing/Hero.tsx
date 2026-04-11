import { Link } from '@inertiajs/react';
import { CheckCircle2, Play, Users, Home, Calendar } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] overflow-hidden bg-white px-6 pt-32 lg:px-12 lg:pt-48 pb-24">
            <div className="relative mx-auto max-w-[1440px]">
                <div className="grid lg:grid-cols-2 items-center gap-12 lg:gap-16">
                    
                    {/* Left Side: Brand & Quick Stats */}
                    <div className="z-20 flex flex-col items-center lg:items-start text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 mb-8 whitespace-nowrap">
                            <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                            <span className="text-[12px] font-bold text-[#1D1D1F] uppercase tracking-wider">Community Portal Active</span>
                        </div>

                        <h1 className="text-6xl font-black tracking-tighter text-[#0A2540] lg:text-8xl leading-[0.9] mb-12">
                            HOA <br />
                            <span className="text-blue-600">Management</span>
                        </h1>

                        {/* Feature Card Left: HOA Related */}
                        <div className="bg-white border border-gray-100 p-6 rounded-[2rem] shadow-2xl shadow-gray-200/50 max-w-[280px] animate-bounce-slow">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Complaint #284</p>
                                    <p className="text-[13px] font-bold text-[#1D1D1F]">Status: Resolved</p>
                                </div>
                            </div>
                            <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                                <div className="h-full w-full bg-blue-600" />
                            </div>
                            <p className="mt-4 text-[11px] text-[#86868B] font-medium italic">Fixed: Street light on North Ave</p>
                        </div>

                        <div className="mt-12 flex items-center gap-4">
                             <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-10 w-10 rounded-full border-4 border-white bg-gray-100 overflow-hidden shadow-sm">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 30}`} alt="Resident" />
                                    </div>
                                ))}
                             </div>
                             <div>
                                <p className="text-[14px] font-bold text-[#1D1D1F]">500+ Residents</p>
                                <p className="text-[11px] text-[#86868B] font-medium">Joined the platform this month</p>
                             </div>
                        </div>
                    </div>

                    {/* Right Side: Description & CTA */}
                    <div className="z-20 flex flex-col items-center lg:items-end text-center lg:text-right">
                        <h2 className="text-6xl font-black tracking-tighter text-[#0A2540] lg:text-8xl leading-[0.9] mb-12">
                            System
                        </h2>
                        
                        <p className="max-w-md text-xl text-[#86868B] leading-relaxed mb-12 font-medium">
                            A complete web-based platform designed to streamline community operations and enhance communication.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
                            <Link 
                                href="/register"
                                className="w-full sm:w-auto rounded-full bg-blue-600 px-12 py-5 text-[17px] font-bold text-white hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/25"
                            >
                                Get Started
                            </Link>
                            <button className="group flex items-center gap-2 text-[17px] font-bold text-[#0A2540]">
                                Watch Video <div className="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors"><Play className="h-4 w-4 text-blue-600 fill-current" /></div>
                            </button>
                        </div>

                        {/* Bottom Stats / Items */}
                        <div className="mt-16 grid grid-cols-2 gap-8 border-t border-gray-100 pt-12 w-full">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-blue-600" />
                                <span className="text-sm font-bold text-[#0A2540]">Event Board</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Home className="h-5 w-5 text-blue-600" />
                                <span className="text-sm font-bold text-[#0A2540]">Facility Booking</span>
                            </div>
                        </div>
                    </div>

                    {/* Center Mask / Image Area: Controlled to prevent overlap */}
                    <div className="absolute inset-x-0 bottom-0 top-0 hidden lg:flex items-center justify-center pointer-events-none z-10 overflow-hidden">
                        <div className="relative h-[85%] aspect-[1/2] mt-20">
                            {/* The Phone Image */}
                            <img
                                src="/images/landingpage.png"
                                alt="Dashboard Mobile"
                                className="h-full w-full object-contain animate-float"
                            />
                            

                        </div>
                    </div>

                </div>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-30px); }
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }
                .animate-float { animation: float 8s ease-in-out infinite; }
                .animate-bounce-slow { animation: bounce-slow 5s ease-in-out infinite; }
                .delay-700 { animation-delay: 700ms; }
            `}</style>
        </section>
    );
}
