export default function Transparency() {
    return (
        <section className="bg-white py-32 px-6 lg:px-12 border-t border-gray-50">
            <div className="mx-auto max-w-[1440px]">
                <div className="text-center mb-24">
                    <h2 className="text-4xl font-bold text-[#0A2540] lg:text-5xl tracking-tight">Built for Trust.</h2>
                    <p className="mt-6 mx-auto max-w-3xl text-xl text-[#86868B] leading-relaxed">
                        Our system promotes accountability by providing real-time financial summaries, 
                        complaint tracking, and community insights.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {[
                        { 
                            title: "Real-time Financials", 
                            desc: "View where your dues go with detailed breakdown reports." 
                        },
                        { 
                            title: "Public Accountability", 
                            desc: "Status of community projects and resolution timelines." 
                        },
                        { 
                            title: "Secure Verification", 
                            desc: "Every transaction is logged and verified for total peace of mind." 
                        }
                    ].map((item, i) => (
                        <div key={i}>
                            <h3 className="text-[19px] font-bold text-blue-600 mb-4">{item.title}</h3>
                            <p className="text-[17px] text-[#86868B] leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-32 p-16 rounded-[2.5rem] bg-blue-50/50 border border-blue-100 text-center">
                    <h4 className="text-3xl font-bold text-[#0A2540] mb-4">Ready to see it in action?</h4>
                    <p className="text-[#86868B] text-lg mb-10 max-w-xl mx-auto">Experience how transparency can change your community operations.</p>
                    <button className="bg-blue-600 text-white px-10 py-4 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                        Explore Dashboard
                    </button>
                </div>
            </div>
        </section>
    );
}
