import { fetchWithAuth } from './api';

export async function sendMessage(userId: string, message: string, conversationId?: string) {
    const res = await fetchWithAuth(`/${userId}/chat`, {
        method: "POST",
        body: JSON.stringify({ message, conversation_id: conversationId }),
    });
    
    if (!res.ok) {
        throw new Error("Failed to send message");
    }
    
    return res.json();
}