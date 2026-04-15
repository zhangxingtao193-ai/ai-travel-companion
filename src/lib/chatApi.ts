import { supabase } from "@/integrations/supabase/client";
import type { ChatMessage } from "@/types/chat";

const FALLBACK_RESPONSES = [
  "I'd love to help with your travel plans! However, I'm having trouble connecting right now. Try again in a moment! 🌏",
  "Hmm, it seems the connection is a bit shaky. In the meantime — Hong Kong's Victoria Peak and Tokyo's Shibuya Crossing are absolute must-sees! 🗼",
];

export async function sendChatMessage(
  messages: ChatMessage[],
  preferenceContext: string | null
): Promise<string> {
  try {
    const apiMessages = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    if (preferenceContext) {
      apiMessages.unshift({ role: "user", content: preferenceContext });
    }

    const { data, error } = await supabase.functions.invoke("travel-chat", {
      body: { messages: apiMessages },
    });

    if (error) {
      console.error("Edge function error:", error);
      return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
    }

    if (data?.error) {
      console.error("API error:", data.error);
      return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
    }

    return data?.choices?.[0]?.message?.content ?? data?.content ?? FALLBACK_RESPONSES[0];
  } catch (e) {
    console.error("Chat error:", e);
    return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
  }
}
