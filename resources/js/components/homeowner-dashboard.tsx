import {
    Calendar,
    Home,
    FileText,
    MessageSquare,
    Bell,
    Settings,
    Edit3,
    CheckCircle2,
    CalendarDays,
    Sun,
    TreePine,
    Droplet,
    MoreHorizontal,
    Plus
} from 'lucide-react';
import { usePage } from '@inertiajs/react';
import {
    AreaChart, Area,
    LineChart, Line,
    PieChart, Pie, Cell,
    ResponsiveContainer,
} from 'recharts';

export function HomeownerDashboard() {
    const { auth } = usePage<any>().props;
    const { user } = auth || {};

    const currentDate = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
    
    const currentTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });

    const billsPie = [{ name: 'Paid', value: 100, color: '#10B981' }, { name: 'Unpaid', value: 0, color: '#E5E7EB' }];
    const requestsPie = [{ name: 'Pending', value: 2, color: '#3B82F6' }, { name: 'Resolved', value: 8, color: '#EFF6FF' }];
    const eventsPie = [{ name: 'Upcoming', value: 4, color: '#8B5CF6' }, { name: 'Past', value: 12, color: '#F3E8FF' }];
    
    const pieData = [
        { name: 'Amenities', value: 25, color: '#3B82F6' },
        { name: 'Requests', value: 10, color: '#8B5CF6' },
        { name: 'Events', value: 3, color: '#F43F5E' },
    ];

    return (
        <div className="w-full max-w-[1440px] mx-auto p-4 md:p-8 space-y-6 text-[#1D1D1F] font-sans bg-[#F5F5F7] min-h-screen">
            
            {/* Top Toolbar (Search, Notifications, Settings) */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Search for rules, facilities, neighbors..."
                        className="w-full pl-5 pr-10 py-3 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-blue-500 bg-white text-sm outline-none"
                    />
                    <div className="absolute right-3 top-3 text-blue-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center justify-center w-11 h-11 bg-white rounded-2xl shadow-sm hover:shadow text-blue-500 relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                    </button>
                    <button className="flex items-center justify-center w-11 h-11 bg-white rounded-2xl shadow-sm hover:shadow text-blue-500">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* ─── LEFT MAIN COLUMN (Spans 8 cols) ─── */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    
                    {/* BANNER */}
                    <div className="bg-[#3B82F6] rounded-[2rem] p-8 shadow-xl shadow-blue-500/20 relative overflow-hidden flex flex-col justify-between min-h-[240px]">
                        {/* Decorative Background Elements */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path d="M0,50 Q25,20 50,50 T100,50 L100,100 L0,100 Z" fill="#ffffff" />
                            </svg>
                            <Sun className="absolute top-8 left-1/4 w-16 h-16 text-white rotate-45" />
                            <TreePine className="absolute bottom-4 right-1/3 w-24 h-24 text-white -rotate-12" />
                            <Home className="absolute top-12 right-12 w-20 h-20 text-white" />
                        </div>

                        <div className="relative z-10 flex items-center justify-between w-max bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-semibold tracking-wide border border-white/10 mb-8">
                            <CalendarDays className="w-4 h-4 mr-2" />
                            {currentDate} • {currentTime}
                        </div>
                        
                        <div className="relative z-10">
                            <h1 className="text-4xl text-white font-black tracking-tight mb-2">Good Day, {user?.name.split(' ')[0] || 'Neighbor'}!</h1>
                            <p className="text-blue-100 font-medium">Have a fantastic day in our community!</p>
                        </div>
                    </div>

                    {/* 3 STAT CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Stat Card 1 */}
                        <div className="bg-white rounded-[20px] py-3 px-4 shadow-sm border border-gray-100 flex flex-col items-center relative h-fit">
                            <div className="absolute top-3 right-3">
                                <MoreHorizontal className="w-3.5 h-3.5 text-gray-300" />
                            </div>
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">Pending Bills</span>
                            
                            <div className="w-14 h-14 mb-2.5 relative flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%" className="absolute inset-0">
                                    <PieChart>
                                        <Pie data={billsPie} innerRadius={18} outerRadius={28} dataKey="value" stroke="none">
                                            {billsPie.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <span className="text-base font-black tracking-tighter text-[#0A2540] relative z-10 leading-none">$0</span>
                            </div>
                            
                            <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> All clear
                            </span>
                        </div>

                        {/* Stat Card 2 */}
                        <div className="bg-white rounded-[20px] py-3 px-4 shadow-sm border border-gray-100 flex flex-col items-center relative h-fit">
                            <div className="absolute top-3 right-3">
                                <MoreHorizontal className="w-3.5 h-3.5 text-gray-300" />
                            </div>
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">Active Requests</span>
                            
                            <div className="w-14 h-14 mb-2.5 relative flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%" className="absolute inset-0">
                                    <PieChart>
                                        <Pie data={requestsPie} innerRadius={18} outerRadius={28} dataKey="value" stroke="none" startAngle={90} endAngle={450}>
                                            {requestsPie.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <span className="text-base font-black tracking-tighter text-[#0A2540] relative z-10 leading-none">2</span>
                            </div>
                            
                            <span className="text-[9px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full flex items-center">
                                +1 this week
                            </span>
                        </div>

                        {/* Stat Card 3 */}
                        <div className="bg-white rounded-[20px] py-3 px-4 shadow-sm border border-gray-100 flex flex-col items-center relative h-fit">
                            <div className="absolute top-3 right-3">
                                <MoreHorizontal className="w-3.5 h-3.5 text-gray-300" />
                            </div>
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">Upcoming Events</span>
                            
                            <div className="w-14 h-14 mb-2.5 relative flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%" className="absolute inset-0">
                                    <PieChart>
                                        <Pie data={eventsPie} innerRadius={18} outerRadius={28} dataKey="value" stroke="none" startAngle={90} endAngle={450}>
                                            {eventsPie.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <span className="text-base font-black tracking-tighter text-[#0A2540] relative z-10 leading-none">4</span>
                            </div>
                            
                            <span className="text-[9px] font-bold text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full flex items-center">
                                In April
                            </span>
                        </div>
                    </div>

                    {/* TWO MODULES: COMMUNITY ACTIVITY & MY PLANS DONE */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                        
                        {/* DONUT CHART */}
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col">
                            <div className="flex justify-between items-center mb-8">
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Community Activity</span>
                                <div className="bg-blue-50 text-blue-600 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer hover:bg-blue-100 transition-colors">
                                    Today
                                    <svg className="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center flex-1">
                                <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                                    <ResponsiveContainer width="100%" height="100%" className="-ml-1 absolute inset-0 z-0">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                innerRadius={45}
                                                outerRadius={60}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                                startAngle={90}
                                                endAngle={-270}
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="relative z-10 flex flex-col items-center">
                                        <span className="text-3xl font-black tracking-tighter text-[#0A2540] leading-none mb-1">95<span className="text-lg text-gray-400">%</span></span>
                                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Active</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-5 pl-4">
                                    <div>
                                        <span className="text-xl font-black text-[#0A2540] block mb-0.5">25</span>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase">Amenities</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xl font-black text-[#0A2540] block mb-0.5">10</span>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase">Requests</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xl font-black text-[#0A2540] block mb-0.5">3</span>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase">Events</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PROGRESS BARS */}
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col">
                            <div className="flex justify-between items-center mb-8">
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">My Plans Done</span>
                                <div className="bg-blue-50 text-blue-600 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer hover:bg-blue-100 transition-colors">
                                    Today
                                    <svg className="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>

                            <div className="space-y-6 flex-1">
                                <div>
                                    <div className="flex justify-between text-[11px] font-bold mb-2">
                                        <span className="text-[#0A2540]">Payments</span>
                                        <span className="text-[#0A2540]">100%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#3B82F6] rounded-full w-full"></div>
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="flex justify-between text-[11px] font-bold mb-2">
                                        <span className="text-[#0A2540]">Maintenance Fixes</span>
                                        <span className="text-[#0A2540]">50%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-orange-400 rounded-full w-1/2"></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-[11px] font-bold mb-2">
                                        <span className="text-[#0A2540]">Meetings Attended</span>
                                        <span className="text-[#0A2540]">33%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-pink-400 rounded-full w-1/3"></div>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full mt-6 py-3 border-2 border-dashed border-blue-200 text-blue-600 hover:bg-blue-50 rounded-2xl text-[13px] font-bold transition-colors flex items-center justify-center gap-2">
                                <span>Add plan</span>
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ─── RIGHT SIDEBAR COLUMN (Spans 4 cols) ─── */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    
                    {/* PROFILE CARD */}
                    <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden flex flex-col relative border border-gray-100">
                        <div className="bg-[#3B82F6] px-6 py-4 flex justify-between items-center h-16">
                            <span className="text-white text-xs font-bold tracking-widest uppercase">My Profile</span>
                            <button className="w-7 h-7 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white transition-colors">
                                <Edit3 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        
                        <div className="p-6 flex flex-col items-center flex-1">
                            <img 
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'HOA')}&background=E0F2FE&color=0284C7&size=128`}
                                alt="Profile" 
                                className="w-20 h-20 rounded-full border-4 border-white shadow-lg -mt-16 mb-4 bg-white"
                            />
                            <h2 className="text-xl font-bold tracking-tight text-[#0A2540]">{user?.name}</h2>
                            <p className="text-xs font-bold text-[#86868B] uppercase tracking-widest mt-1 mb-2">Resident</p>
                            
                            <div className="flex items-center gap-1 text-[11px] text-[#86868B] font-semibold mb-6">
                                <Home className="w-3.5 h-3.5 text-blue-500" />
                                Block 4, Lot 12
                            </div>

                            <div className="grid grid-cols-3 w-full gap-4 pt-6 border-t border-gray-100 mt-auto">
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Status</span>
                                    <span className="text-xs font-bold text-[#0A2540]">Active</span>
                                </div>
                                <div className="flex flex-col items-center border-l border-r border-gray-100">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Move In</span>
                                    <span className="text-xs font-bold text-[#0A2540]">12.04.22</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Dues</span>
                                    <span className="text-xs font-bold text-emerald-500">Paid</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CALENDAR CARD */}
                    <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden flex flex-col border border-gray-100 relative">
                        <div className="bg-[#3B82F6] px-6 py-4 flex justify-between items-center">
                            <span className="text-white text-xs font-bold tracking-widest uppercase">My Calendar</span>
                            <div className="bg-white/20 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer hover:bg-white/30 transition-colors">
                                April
                                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                        <div className="p-6 flex-1">
                            <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">
                                <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                            </div>
                            <div className="flex justify-between items-center font-bold text-sm text-[#0A2540]">
                                <span className="w-8 h-8 flex items-center justify-center">12</span>
                                <span className="w-10 h-10 flex items-center justify-center bg-[#3B82F6] text-white rounded-xl shadow-lg shadow-blue-500/30 -translate-y-1">13</span>
                                <span className="w-8 h-8 flex items-center justify-center">14</span>
                                <span className="w-8 h-8 flex items-center justify-center">15</span>
                                <span className="w-8 h-8 flex items-center justify-center">16</span>
                                <span className="w-8 h-8 flex items-center justify-center">17</span>
                                <span className="w-8 h-8 flex items-center justify-center">18</span>
                            </div>

                            <div className="mt-8">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[10px] tracking-widest text-[#86868B] font-bold uppercase">April, 13</span>
                                    <MoreHorizontal className="w-4 h-4 text-gray-300" />
                                </div>
                                <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-3 before:w-px before:bg-gray-100">
                                    {/* Event 1 */}
                                    <div className="flex items-start gap-4 relative z-10">
                                        <div className="text-[10px] font-bold text-gray-400 w-12 pt-1 text-right">2:00 pm</div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-rose-400 mt-1.5 ring-4 ring-white shrink-0"></div>
                                        <div className="text-[13px] font-semibold text-[#0A2540] flex-1 leading-snug">Meeting with HOA President Mr. Williams</div>
                                    </div>
                                    {/* Event 2 */}
                                    <div className="flex items-start gap-4 relative z-10">
                                        <div className="text-[10px] font-bold text-gray-400 w-12 pt-1 text-right">2:30 pm</div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5 ring-4 ring-white shrink-0"></div>
                                        <div className="text-[13px] font-semibold text-[#0A2540] flex-1 leading-snug">Clubhouse Reservation</div>
                                    </div>
                                    {/* Event 3 */}
                                    <div className="flex items-start gap-4 relative z-10 opacity-60">
                                        <div className="text-[10px] font-bold text-gray-400 w-12 pt-1 text-right">3:00 pm</div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 ring-4 ring-white shrink-0"></div>
                                        <div className="text-[13px] font-semibold text-[#0A2540] flex-1 leading-snug">Plumbing Maintenance Visit</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
