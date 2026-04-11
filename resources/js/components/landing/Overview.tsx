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
                    
                    <div className="mt-20 grid md:grid-cols-3 gap-12 w-full">
                        {[
                            { 
                                title: "Transparency", 
                                desc: "Real-time updates and clear financial reporting for everyone." 
                            },
                            { 
                                title: "Efficiency", 
                                desc: "Automate billing, reservations, and complaint handling." 
                            },
                            { 
                                title: "Security", 
                                desc: "Encrypted data protection for all resident and admin records." 
                            }
                        ].map((item, i) => (
                            <div key={i} className="text-center">
                                <h4 className="text-[20px] font-black text-blue-600 mb-4 uppercase tracking-wider">{item.title}</h4>
                                <p className="text-[17px] text-[#86868B] leading-relaxed font-medium">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
