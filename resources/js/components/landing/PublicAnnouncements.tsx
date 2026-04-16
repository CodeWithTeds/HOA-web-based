import { Megaphone, Calendar, ArrowRight } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function PublicAnnouncements({ announcements }: { announcements: any[] }) {
    if (!announcements || announcements.length === 0) {
        return (
            <section className="bg-[#F5F5F7] py-12 px-6 lg:px-12 border-t border-gray-100/50">
                <div className="mx-auto max-w-[1440px] text-center">
                    <p className="text-[12px] font-bold text-neutral-400 uppercase tracking-widest">No active announcements at this time</p>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-[#F5F5F7] py-24 px-6 lg:px-12 border-t border-gray-100">
            <div className="mx-auto max-w-[1440px]">
                <div className="flex flex-col items-center text-center mb-16">
                    <span className="text-blue-600 font-bold uppercase tracking-[0.2em] text-xs mb-6">Latest Updates</span>
                    <h2 className="text-4xl font-black text-[#0A2540] lg:text-5xl leading-tight tracking-tighter">
                        Community Announcements
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {announcements.map((announcement) => (
                        <div 
                            key={announcement.id} 
                            className="bg-white rounded-[2.5rem] p-10 flex flex-col border border-gray-100 shadow-xl shadow-gray-200/20 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 group"
                        >
                            {announcement.image_url && (
                                <div className="mb-8 -mx-10 -mt-10 overflow-hidden rounded-t-[2.5rem] h-48 border-b border-gray-100">
                                    <img src={announcement.image_url} alt={announcement.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>
                            )}

                            <div className="flex items-center justify-between mb-8">
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                    announcement.priority === 'urgent' 
                                        ? 'bg-red-50 text-red-600' 
                                        : announcement.priority === 'important'
                                            ? 'bg-amber-50 text-amber-600'
                                            : 'bg-blue-50 text-blue-600'
                                }`}>
                                    {announcement.category} • {announcement.priority}
                                </div>
                                <div className="flex items-center gap-1.5 text-neutral-400 text-[11px] font-bold">
                                    <Calendar className="size-3" />
                                    {new Date(announcement.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                            </div>

                            <h3 className="text-2xl font-black text-[#0A2540] mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                                {announcement.title}
                            </h3>
                            
                            <p className="text-[#86868B] text-[15px] leading-relaxed font-medium mb-8 flex-1">
                                {announcement.content.length > 150 
                                    ? announcement.content.substring(0, 150) + '...' 
                                    : announcement.content
                                }
                            </p>

                            <div className="pt-6 border-t border-gray-50 mt-auto">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-[10px]">
                                            {announcement.author?.name[0]}
                                        </div>
                                        <span className="text-[12px] font-bold text-[#0A2540]">{announcement.author?.name}</span>
                                    </div>
                                    <Link 
                                        href={`/announcements/${announcement.id}`} 
                                        className="text-blue-600 font-black text-[12px] flex items-center gap-1 group/btn"
                                    >
                                        Read More <ArrowRight className="size-3 group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link 
                        href="/register" 
                        className="inline-flex items-center gap-2 text-blue-600 font-black text-sm hover:underline"
                    >
                        View all announcements in the portal <ArrowRight className="size-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
