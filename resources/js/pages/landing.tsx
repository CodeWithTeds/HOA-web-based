import { Head } from '@inertiajs/react';
import CTA from '@/components/landing/CTA';
import Features from '@/components/landing/Features';
import Footer from '@/components/landing/Footer';
import Hero from '@/components/landing/Hero';
import Navbar from '@/components/landing/Navbar';
import Overview from '@/components/landing/Overview';
import PublicAnnouncements from '@/components/landing/PublicAnnouncements';
import Transparency from '@/components/landing/Transparency';

export default function Landing({ announcements }: { announcements: any }) {
    return (
        <div className="font-sans antialiased text-[#0A2540] bg-white selection:bg-blue-600/10 selection:text-blue-600">
            <Head title="Smart HOA - Modern Community Management" />
            
            <Navbar />
            
            <main>
                <Hero />
                <Overview />
                <PublicAnnouncements announcements={announcements || []} />
                <Features />
                <Transparency />
                <CTA />
            </main>
            
            <Footer />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                
                :root {
                    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif;
                }
            `}</style>
        </div>
    );
}
