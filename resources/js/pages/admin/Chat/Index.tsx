import { Head, usePage, Link } from '@inertiajs/react';
import axios from 'axios';
import { Send, Search, MessageSquare, Archive } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import echo from '@/echo';
import AppLayout from '@/layouts/app-layout';

const VISIBLE_COUNT = 6;

interface Message {
    id: number;
    resident_id: number;
    admin_id: number | null;
    resident_name: string;
    admin_name: string;
    sender_type: 'homeowner' | 'admin' | 'staff';
    content: string;
    is_read: boolean;
    human_time: string;
    created_at: string;
}

interface Thread {
    id: number;
    name: string;
    unread_count: number;
}

export default function AdminChat({ threads }: { threads: Thread[] }) {
    const { auth } = usePage().props as any;
    const [activeResidentId, setActiveResidentId] = useState<number | null>(null);
    const [allMessages, setAllMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredThreads = threads.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Only show the last 6 messages — everything else is in the log
    const visibleMessages = allMessages.slice(-VISIBLE_COUNT);
    const logMessages = allMessages.slice(0, -VISIBLE_COUNT);

    useEffect(() => {
        if (activeResidentId) {
            axios.get(`/admin/chat/${activeResidentId}`).then(res => {
                setAllMessages(res.data.messages);
            });

            const channel = echo.private(`chat.resident.${activeResidentId}`)
                .listen('.App\\Events\\Chat\\MessageSent', (e: { message: Message }) => {
                    setAllMessages(prev => [...prev, e.message]);
                });

            return () => {
                echo.leave(`chat.resident.${activeResidentId}`);
            };
        }
    }, [activeResidentId]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newMessage.trim() || !activeResidentId) {
return;
}

        try {
            const res = await axios.post('/admin/chat', {
                content: newMessage,
                resident_id: activeResidentId,
                is_admin: true
            });
            setAllMessages(prev => [...prev, res.data.message]);
            setNewMessage('');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <Head title="Resident Support Chat" />
            
            <div className="flex h-[calc(100vh-140px)] flex-1 flex-col rounded-2xl bg-white shadow-sm border border-neutral-100 overflow-hidden">
                {/* ─── ENTERPRISE HEADER ─── */}
                <div className="shrink-0 px-8 py-5 border-b border-neutral-100 bg-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center size-10 rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20">
                                <MessageSquare className="size-5 text-white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-[20px] font-black tracking-tight text-[#0A2540]">
                                    Resident Support
                                </h1>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Live Communication</span>
                                    <span className="size-1 rounded-full bg-neutral-300" />
                                    <span className="text-[11px] font-bold text-blue-600">{threads.length} Active Residents</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── CHAT INTERFACE ─── */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar (Resident List) */}
                    <div className="w-80 border-r border-neutral-100 flex flex-col bg-neutral-50/30">
                        <div className="p-4 bg-white border-b border-neutral-100">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                                <Input 
                                    placeholder="Search residents..." 
                                    className="pl-9 h-9 rounded-lg border-neutral-200 bg-neutral-50/50 text-[13px] focus:ring-blue-500/10 focus:border-blue-500/50" 
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <ScrollArea className="flex-1">
                            <div className="p-2 space-y-1">
                                {filteredThreads.map(thread => (
                                    <button
                                        key={thread.id}
                                        onClick={() => setActiveResidentId(thread.id)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                                            activeResidentId === thread.id 
                                            ? 'bg-white shadow-sm ring-1 ring-neutral-200' 
                                            : 'hover:bg-white/50 group'
                                        }`}
                                    >
                                        <Avatar className="h-9 w-9 rounded-lg border border-neutral-100">
                                            <AvatarFallback className="bg-neutral-100 text-neutral-600 font-bold text-[12px]">
                                                {thread.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 text-left min-w-0">
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-[13px] text-[#0A2540] truncate">{thread.name}</span>
                                                {thread.unread_count > 0 && (
                                                    <Badge className="bg-blue-600 hover:bg-blue-700 border-none px-1.5 py-0.5 min-w-[18px] justify-center text-[10px] font-black">
                                                        {thread.unread_count}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-neutral-400 font-medium truncate">Click to view messages</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Chat Window */}
                    <div className="flex-1 flex flex-col bg-white overflow-hidden">
                        {activeResidentId ? (
                            <>
                                {/* ─── Chat Sub-Header ─── */}
                                <div className="shrink-0 px-6 py-3 border-b border-neutral-100 bg-white flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8 rounded-lg border border-neutral-100">
                                            <AvatarFallback className="bg-blue-50 text-blue-600 font-black text-[12px]">
                                                {threads.find(t => t.id === activeResidentId)?.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h2 className="text-[14px] font-black text-[#0A2540]">
                                                {threads.find(t => t.id === activeResidentId)?.name}
                                            </h2>
                                            <div className="flex items-center gap-1.5">
                                                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Active</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Log Button */}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="h-8 px-3 border-neutral-200 rounded-lg font-bold flex gap-2 text-[12px] hover:bg-neutral-50">
                                                <Archive className="size-3.5 text-neutral-400" />
                                                View Log ({logMessages.length})
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-3xl h-[70vh] flex flex-col p-0 overflow-hidden bg-white shadow-2xl">
                                            <DialogHeader className="p-5 border-b border-neutral-100 bg-white shrink-0">
                                                <DialogTitle className="text-lg font-black text-[#0A2540]">
                                                    Message Log — {threads.find(t => t.id === activeResidentId)?.name}
                                                </DialogTitle>
                                            </DialogHeader>
                                            
                                            {/* Scrollable log table */}
                                            <div className="flex-1 overflow-hidden flex flex-col">
                                                <div className="flex-1 overflow-y-auto">
                                                    {allMessages.length === 0 ? (
                                                        <div className="flex items-center justify-center h-full text-neutral-400">
                                                            <p className="text-[13px] font-bold">No messages yet</p>
                                                        </div>
                                                    ) : (
                                                        <table className="w-full border-collapse text-left">
                                                            <thead className="sticky top-0 z-10 bg-white border-b border-neutral-100 shadow-sm">
                                                                <tr>
                                                                    <th className="px-5 py-3 text-[10px] font-black text-neutral-400 uppercase tracking-widest w-36">Time</th>
                                                                    <th className="px-5 py-3 text-[10px] font-black text-neutral-400 uppercase tracking-widest w-24">Sender</th>
                                                                    <th className="px-5 py-3 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Message</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-neutral-50">
                                                                {allMessages.map((msg) => {
                                                                    const isMe = msg.sender_type === 'admin' || msg.sender_type === 'staff';

                                                                    return (
                                                                        <tr key={msg.id} className="hover:bg-neutral-50/50 transition-colors">
                                                                            <td className="px-5 py-3 text-[11px] font-bold text-neutral-400 whitespace-nowrap">{msg.human_time}</td>
                                                                            <td className="px-5 py-3">
                                                                                <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-wider ${isMe ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-neutral-50 text-neutral-600 border-neutral-100'}`}>
                                                                                    {isMe ? 'Admin' : 'Resident'}
                                                                                </Badge>
                                                                            </td>
                                                                            <td className="px-5 py-3 text-[12px] font-medium text-[#0A2540] leading-relaxed">{msg.content}</td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="p-3 bg-neutral-50 border-t border-neutral-100 shrink-0">
                                                <p className="text-[10px] font-bold text-neutral-400 text-center uppercase tracking-widest">
                                                    {allMessages.length} Total Messages
                                                </p>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                {/* ─── Fixed Messages Area (last 6 only, NO scroll) ─── */}
                                <div className="flex-1 flex flex-col justify-end p-6 bg-neutral-50/20 overflow-hidden">
                                    {visibleMessages.length === 0 ? (
                                        <div className="flex-1 flex flex-col items-center justify-center text-neutral-300">
                                            <MessageSquare className="size-10 text-neutral-200 mb-3" strokeWidth={1.5} />
                                            <p className="text-[13px] font-bold text-neutral-400">No messages yet. Start the conversation below.</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-4">
                                            {logMessages.length > 0 && (
                                                <div className="flex justify-center">
                                                    <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest bg-white/80 px-3 py-1 rounded-full border border-neutral-100">
                                                        {logMessages.length} older message{logMessages.length !== 1 ? 's' : ''} in log
                                                    </span>
                                                </div>
                                            )}
                                            {visibleMessages.map((msg) => {
                                                const isMe = msg.sender_type === 'admin' || msg.sender_type === 'staff';

                                                return (
                                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                        <div className={`max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                                            <div className={`
                                                                px-4 py-3 rounded-2xl text-[13px] font-medium leading-relaxed shadow-sm
                                                                ${isMe 
                                                                    ? 'bg-[#0A2540] text-white rounded-br-none' 
                                                                    : 'bg-white border border-neutral-100 text-[#0A2540] rounded-bl-none'}
                                                            `}>
                                                                {msg.content}
                                                            </div>
                                                            <span className="text-[10px] mt-1.5 font-bold text-neutral-400 uppercase tracking-widest px-1">
                                                                {msg.human_time}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Input Area */}
                                <div className="shrink-0 p-4 bg-white border-t border-neutral-100">
                                    <form onSubmit={handleSendMessage} className="flex gap-2 max-w-4xl mx-auto w-full">
                                        <Input 
                                            placeholder="Type a message to the resident..." 
                                            className="flex-1 h-11 bg-neutral-50 border-neutral-200 rounded-xl px-4 text-[14px] focus:ring-blue-500/10 focus:border-blue-500/50" 
                                            value={newMessage}
                                            onChange={e => setNewMessage(e.target.value)}
                                        />
                                        <Button type="submit" className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/10 font-bold transition-all active:scale-95">
                                            <Send className="h-4 w-4 mr-2" /> Send
                                        </Button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-neutral-300">
                                <div className="size-20 bg-neutral-50 rounded-[2rem] flex items-center justify-center mb-6 border border-neutral-100 shadow-sm">
                                    <MessageSquare className="size-10 text-neutral-200" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-[18px] font-black text-[#0A2540]">No Resident Selected</h3>
                                <p className="text-[14px] font-bold text-neutral-400 mt-1 max-w-xs text-center">
                                    Select a resident from the directory list to start communication.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

AdminChat.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Resident Support', href: '/admin/chat' },
    ],
};
