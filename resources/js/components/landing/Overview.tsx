import { PieChart, Zap, Shield } from 'lucide-react';

export default function Overview() {
    return (
        <section className="bg-white py-32 px-6 lg:px-12 border-t border-gray-50">
            <div className="mx-auto max-w-[1440px]">
                <div className="flex flex-col items-center text-center">
                    <span className="text-blue-600 font-bold uppercase tracking-[0.2em] text-xs mb-6">Overview</span>
                    <h2 className="text-4xl font-black text-[#0A2540] lg:text-6xl leading-tight tracking-tighter max-w-4xl">
                        All-in-One HOA <br />
                        Management Solution.
                    </h2>
                    <p className="mt-10 text-2xl text-[#86868B] leading-relaxed max-w-3xl font-medium">
                        Manage your entire homeowners association efficiently with a centralized system built for administrators, staff, and residents.
                    </p>
                    
                    <div className="mt-24 grid md:grid-cols-3 gap-8 w-full">
                        {[
                            { 
                                title: "Transparency", 
                                desc: "Real-time updates and clear financial reporting for everyone.",
                                icon: <PieChart className="h-8 w-8 text-blue-600" />
                            },
                            { 
                                title: "Efficiency", 
                                desc: "Automate billing, reservations, and complaint handling.",
                                icon: <Zap className="h-8 w-8 text-blue-600" />
                            },
                            { 
                                title: "Security", 
                                desc: "Encrypted data protection for all resident and admin records.",
                                icon: <Shield className="h-8 w-8 text-blue-600" />
                            }
                        ].map((item, i) => (
                            <div key={i} className="group relative bg-[#F5F5F7] rounded-[3rem] p-12 transition-all duration-700 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col items-start text-left border border-transparent hover:border-gray-100">
                                <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                                    {item.icon}
                                </div>
                                <h4 className="text-2xl font-black text-[#0A2540] mb-6 uppercase tracking-tighter">{item.title}</h4>
                                <p className="text-lg text-[#86868B] leading-relaxed font-medium">{item.desc}</p>
                                
                                <div className="mt-auto pt-10 w-full">
                                    <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full w-0 bg-blue-600 group-hover:w-full transition-all duration-1000" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
