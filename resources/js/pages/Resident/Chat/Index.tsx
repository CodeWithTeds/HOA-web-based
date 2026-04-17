import { useState, useEffect, useRef } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MoreVertical, MessageCircle, MessageSquare } from 'lucide-react';
import echo from '@/echo';
import axios from 'axios';

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
    const [messages, setMessages] = useState<Message[]>(initialMessages.data || []);
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollToBottom();

        // Listen for real-time messages sent by admin or Echo reflections
        const channel = echo.private(`chat.resident.${auth.user.id}`)
            .listen('.App\\Events\\Chat\\MessageSent', (e: { message: Message }) => {
                // To avoid duplication
                setMessages(prev => {
                    if (prev.find(m => m.id === e.message.id)) return prev;
                    return [...prev, e.message];
                });
                scrollToBottom();
            });

        return () => {
            echo.leave(`chat.resident.${auth.user.id}`);
        };
    }, []);

    const scrollToBottom = () => {
        setTimeout(() => {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const res = await axios.post('/chat', {
                content: newMessage
            });
            setMessages(prev => [...prev, res.data.message]);
            setNewMessage('');
            scrollToBottom();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <Head title="Admin Support Chat" />
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
                                    <span className="text-[11px] font-bold text-blue-600">Secure Channel</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── CHAT INTERFACE ─── */}
                <div className="flex flex-1 overflow-hidden">
                    <div className="flex-1 flex flex-col bg-white">
                        {/* Messages Area */}
                        <ScrollArea className="flex-1 p-6 bg-neutral-50/20">
                            <div className="space-y-6">
                                {messages.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
                                        <div className="size-20 bg-neutral-50 rounded-[2rem] flex items-center justify-center mb-6 border border-neutral-100 shadow-sm">
                                            <MessageCircle className="size-10 text-neutral-200" strokeWidth={1.5} />
                                        </div>
                                        <h3 className="text-[18px] font-black text-[#0A2540]">No Messages Yet</h3>
                                        <p className="text-[14px] font-bold text-neutral-400 mt-1 max-w-xs text-center">
                                            Start a conversation with community support below.
                                        </p>
                                    </div>
                                )}
                                {messages.map((msg) => {
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
                                <div ref={scrollRef} />
                            </div>
                        </ScrollArea>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-neutral-100">
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
