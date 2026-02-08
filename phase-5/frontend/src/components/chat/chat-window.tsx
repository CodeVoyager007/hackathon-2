"use client";

import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Send, Bot, User } from "lucide-react";
import { sendMessage } from "@/lib/chat-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export function ChatWindow() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [conversationId, setConversationId] = useState<string | undefined>(undefined);
    const scrollRef = useRef<HTMLDivElement>(null);
    
    const queryClient = useQueryClient();
    const { data: session } = authClient.useSession();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (messageText = input) => {
        if (!messageText.trim() || !session?.user) return;
        
        const userMsg: Message = { role: "user", content: messageText };
        setMessages(prev => [...prev, userMsg]);
        if (messageText === input) {
            setInput("");
        }
        setLoading(true);
        
        try {
            const res = await sendMessage(session.user.id, userMsg.content, conversationId);
            
            // Invalidate the tasks query to refresh the dashboard list
            if (res.tool_calls && res.tool_calls.length > 0) {
                queryClient.invalidateQueries({ queryKey: ["tasks"] });
            }

            const assistantMsg: Message = { role: "assistant", content: res.response };
            setMessages(prev => [...prev, assistantMsg]);
            setConversationId(res.conversation_id);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: "assistant", content: "Error: Could not connect to the assistant." }]);
        } finally {
            setLoading(false);
        }
    };
    
    const QuickActionButton = ({ text }: { text: string }) => (
        <Button variant="outline" size="sm" className="h-8" onClick={() => handleSend(text)}>
            {text}
        </Button>
    )

    return (
        <div className="flex flex-col h-[70vh] max-h-[800px] w-full max-w-3xl mx-auto bg-card border rounded-2xl shadow-xl overflow-hidden">
            <div className="p-4 border-b">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary"/> AI Assistant
                </h2>
            </div>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 && (
                    <div className="text-center text-muted-foreground mt-10">
                        <p className="mb-4">How can I help you manage your tasks today?</p>
                        <div className="flex justify-center gap-2 flex-wrap">
                            <QuickActionButton text="What are my pending tasks?" />
                            <QuickActionButton text="Mark 'deploy to production' as complete" />
                            <QuickActionButton text="Delete the 'old prototype' task" />
                        </div>
                    </div>
                )}
                {messages.map((m, i) => (
                    <div key={i} className={cn("flex items-end gap-3", m.role === 'user' ? "justify-end" : "justify-start")}>
                        {m.role === 'assistant' && (
                            <Avatar className="h-8 w-8 bg-primary/10 text-primary">
                                <AvatarFallback><Bot className="h-4 w-4"/></AvatarFallback>
                            </Avatar>
                        )}
                        <div className={cn(
                            "max-w-[75%] p-3 rounded-2xl",
                            m.role === 'user' 
                                ? "bg-primary text-primary-foreground rounded-br-none" 
                                : "bg-muted rounded-bl-none"
                        )}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                        </div>
                        {m.role === 'user' && (
                            <Avatar className="h-8 w-8">
                                <AvatarFallback><User className="h-4 w-4"/></AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="flex items-end gap-3 justify-start">
                        <Avatar className="h-8 w-8 bg-primary/10 text-primary">
                            <AvatarFallback><Bot className="h-4 w-4"/></AvatarFallback>
                        </Avatar>
                        <div className="bg-muted p-3 rounded-2xl rounded-bl-none">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 bg-primary rounded-full animate-bounce delay-0" />
                                <span className="h-2 w-2 bg-primary rounded-full animate-bounce delay-150" />
                                <span className="h-2 w-2 bg-primary rounded-full animate-bounce delay-300" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t bg-background/80">
                <div className="relative">
                    <Input 
                        value={input} 
                        onChange={(e) => setInput(e.target.value)} 
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask me to add, find, or complete a task..." 
                        disabled={loading}
                        className="pr-12 h-12 rounded-full pl-6"
                    />
                    <Button 
                        onClick={() => handleSend()} 
                        disabled={loading || !input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
                        size="icon"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}