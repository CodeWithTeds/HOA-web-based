export default function Footer() {
    return (
        <footer className="bg-white px-6 py-20 lg:px-12 border-t border-gray-100">
            <div className="mx-auto max-w-[1440px]">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-2">
                        <span className="text-2xl font-black text-blue-600 tracking-tighter uppercase">Smart HOA</span>
                        <p className="mt-4 max-w-sm text-[#86868B] text-[15px] leading-relaxed">
                            Built for smarter, more connected communities using modern technology.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-[13px] font-bold text-[#0A2540] uppercase tracking-wider mb-6">Platform</h4>
                        <ul className="space-y-3 text-[14px]">
                            <li><a href="#" className="text-[#86868B] hover:text-blue-600 transition-colors">Features</a></li>
                            <li><a href="#" className="text-[#86868B] hover:text-blue-600 transition-colors">Transparency</a></li>
                            <li><a href="#" className="text-[#86868B] hover:text-blue-600 transition-colors">Security</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[13px] font-bold text-[#0A2540] uppercase tracking-wider mb-6">Company</h4>
                        <ul className="space-y-3 text-[14px]">
                            <li><a href="#" className="text-[#86868B] hover:text-blue-600 transition-colors">About</a></li>
                            <li><a href="#" className="text-[#86868B] hover:text-blue-600 transition-colors">Contact</a></li>
                            <li><a href="#" className="text-[#86868B] hover:text-blue-600 transition-colors">Privacy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-blue-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[13px] text-[#86868B]">© 2026 Smart HOA Management System. All rights reserved.</p>
                    <div className="flex gap-8">
                        <a href="#" className="text-[13px] text-[#86868B] hover:text-blue-600">Privacy Policy</a>
                        <a href="#" className="text-[13px] text-[#86868B] hover:text-blue-600">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
