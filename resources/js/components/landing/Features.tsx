const categories = [
    {
        title: 'For Administrators',
        subtitle: 'Powerful tools for management.',
        features: [
            { title: 'Dashboard Overview', desc: 'Monitor system performance and community activity' },
            { title: 'User Management', desc: 'Manage admins, staff, and homeowners' },
            { title: 'Billing & Collections', desc: 'Generate invoices and track payments' },
            { title: 'Reports & Analytics', desc: 'Financial reports and transparency dashboards' },
            { title: 'Facility Management', desc: 'Handle reservations and scheduling' },
            { title: 'Announcements', desc: 'Keep residents informed with updates' },
        ]
    },
    {
        title: 'For HOA Staff',
        subtitle: 'Efficiency at every step.',
        features: [
            { title: 'Resident Management', desc: 'Add and update resident records' },
            { title: 'Payment Processing', desc: 'Verify and record payments' },
            { title: 'Facility Reservations', desc: 'Approve or reject booking requests' },
            { title: 'Complaint Handling', desc: 'Track and update issue resolutions' },
            { title: 'Chat Support', desc: 'Communicate with residents in real-time' },
            { title: 'Daily Reports', desc: 'Monitor collections and activities' },
        ]
    },
    {
        title: 'For Homeowners',
        subtitle: 'Transparency for residents.',
        features: [
            { title: 'Profile Management', desc: 'Update personal and household details' },
            { title: 'Billing & Payments', desc: 'View balances and upload payment proofs' },
            { title: 'Facility Booking', desc: 'Reserve community spaces' },
            { title: 'Complaints System', desc: 'Report and track issues with updates' },
            { title: 'Direct Messaging', desc: 'Chat with HOA staff anytime' },
            { title: 'Transparency Dashboard', desc: 'View financial summaries and stats' },
        ]
    }
];

export default function Features() {
    return (
        <section className="bg-[#FBFBFB] py-32 px-6 lg:px-12">
            <div className="mx-auto max-w-[1440px]">
                <div className="space-y-32">
                    {categories.map((category, idx) => (
                        <div key={idx}>
                            <div className="mb-16">
                                <h3 className="text-3xl font-bold text-[#0A2540] tracking-tight">{category.title}</h3>
                                <p className="text-xl text-blue-600/60 mt-2">{category.subtitle}</p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                                {category.features.map((feature, i) => (
                                    <div key={i} className="group">
                                        <h5 className="text-[17px] font-bold text-blue-600 mb-3 group-hover:text-blue-700 transition-colors uppercase tracking-wide">{feature.title}</h5>
                                        <p className="text-[15px] text-[#86868B] leading-relaxed">{feature.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
