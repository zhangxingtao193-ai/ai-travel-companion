import { useState, useRef, useEffect, useCallback } from "react";
import ChatHeader from "@/components/ChatHeader";
import ChatSidebar from "@/components/ChatSidebar";
import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";
import PreferenceChips from "@/components/PreferenceChips";
import TypingIndicator from "@/components/TypingIndicator";
import DemoButton from "@/components/DemoButton";
import { streamChatMessage } from "@/lib/chatApi";
import { useTheme } from "@/hooks/useTheme";
import type { ChatMessage, PreferenceChip } from "@/types/chat";

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello! 👋 I'm **Travel Star**, your AI travel concierge. I specialize in **Hong Kong** 🇭🇰 and **Tokyo** 🇯🇵 but I'm happy to help with any destination!\n\nTry selecting a preference above, or just ask me anything!",
  timestamp: new Date(),
};

export default function Index() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [isLoading, setIsLoading] = useState(false);
  const [preference, setPreference] = useState<PreferenceChip | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, []);

  useEffect(scrollToBottom, [messages, isLoading, scrollToBottom]);

  const handleSend = async (text: string) => {
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    const assistantId = crypto.randomUUID();
    let assistantContent = "";

    // Add empty assistant message first
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "", timestamp: new Date() },
    ]);

    await streamChatMessage(
      updatedMessages,
      preference?.context ?? null,
      (delta) => {
        assistantContent += delta;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: assistantContent } : m
          )
        );
      },
      () => {
        setIsLoading(false);
      }
    );
  };

  const handleDemo = (demoMessages: ChatMessage[]) => {
    setMessages([WELCOME, ...demoMessages]);
  };

  const handleClear = () => {
    setMessages([WELCOME]);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <ChatSidebar />
      </div>
      <div className="flex flex-1 flex-col min-w-0">
        <ChatHeader
          isDark={theme.isDark}
          onToggleTheme={theme.toggle}
          onToggleSidebar={() => setSidebarOpen((o) => !o)}
          onClear={handleClear}
          messageCount={messages.length}
        />
        <div className="flex items-center justify-between px-4 pt-2">
          <PreferenceChips selected={preference} onSelect={setPreference} />
          <DemoButton onDemo={handleDemo} />
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          {isLoading && messages[messages.length - 1]?.content === "" && <TypingIndicator />}
        </div>
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
}
