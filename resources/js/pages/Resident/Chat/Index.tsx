import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Send, MessageSquare, Archive } from 'lucide-react';
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
import echo from '@/echo';

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

export default function ResidentChat({ messages: initialMessages }: { messages: { data: Message[] } }) {
    const { auth } = usePage().props as any;
    const [allMessages, setAllMessages] = useState<Message[]>(initialMessages.data || []);
    const [newMessage, setNewMessage] = useState('');

    // Only show the last 6 messages — everything else is in the log
    const visibleMessages = allMessages.slice(-VISIBLE_COUNT);
    const logMessages = allMessages.slice(0, -VISIBLE_COUNT);

    useEffect(() => {
        // Listen for real-time messages sent by admin or Echo reflections
        const channel = echo.private(`chat.resident.${auth.user.id}`)
            .listen('.App\\Events\\Chat\\MessageSent', (e: { message: Message }) => {
                // To avoid duplication
                setAllMessages(prev => {
                    if (prev.find(m => m.id === e.message.id)) {
return prev;
}

                    return [...prev, e.message];
                });
            });

        return () => {
            echo.leave(`chat.resident.${auth.user.id}`);
        };
    }, []);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newMessage.trim()) {
return;
}

        try {
            const res = await axios.post('/chat', {
                content: newMessage
            });
            setAllMessages(prev => [...prev, res.data.message]);
            setNewMessage('');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <Head title="Support Chat" />
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
                                    Support Chat
                                </h1>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Live Communication</span>
                                    <span className="size-1 rounded-full bg-neutral-300" />
                                    <span className="text-[11px] font-bold text-blue-600">Secure Channel</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── CHAT INTERFACE ─── */}
                <div className="flex flex-1 overflow-hidden">
                    <div className="flex-1 flex flex-col bg-white overflow-hidden">
                        {/* ─── Chat Sub-Header ─── */}
                        <div className="shrink-0 px-6 py-3 border-b border-neutral-100 bg-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8 rounded-lg border border-neutral-100">
                                    <AvatarFallback className="bg-blue-50 text-blue-600 font-black text-[12px]">
                                        S
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-[14px] font-black text-[#0A2540]">
                                        HOA Support Team
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
                                            Message Log — Support Conversation
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
                                                            const isMe = msg.sender_type === 'homeowner';

                                                            return (
                                                                <tr key={msg.id} className="hover:bg-neutral-50/50 transition-colors">
                                                                    <td className="px-5 py-3 text-[11px] font-bold text-neutral-400 whitespace-nowrap">{msg.human_time}</td>
                                                                    <td className="px-5 py-3">
                                                                        <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-wider ${isMe ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-neutral-50 text-neutral-600 border-neutral-100'}`}>
                                                                            {isMe ? 'You' : 'Support'}
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
                                        const isMe = msg.sender_type === 'homeowner';

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
                                                    <div className={`flex items-center gap-1 mt-1.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1">
                                                            {msg.human_time}
                                                        </span>
                                                        {isMe && msg.is_read && (
                                                            <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">
                                                                • Read
                                                            </span>
                                                        )}
                                                    </div>
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
                                    placeholder="Type your message to support..." 
                                    className="flex-1 h-11 bg-neutral-50 border-neutral-200 rounded-xl px-4 text-[14px] focus:ring-blue-500/10 focus:border-blue-500/50" 
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                />
                                <Button type="submit" className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/10 font-bold transition-all active:scale-95">
                                    <Send className="h-4 w-4 mr-2" /> Send
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

ResidentChat.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Support Chat', href: '/chat' },
    ],
};
