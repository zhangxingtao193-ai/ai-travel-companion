import { Volume2 } from "lucide-react";
import avatarImg from "@/assets/avatar.png";
import { speakText } from "@/hooks/useSpeech";
import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "@/types/chat";
import { cn } from "@/lib/utils";

export default function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex animate-fade-in", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <img
          src={avatarImg}
          alt=""
          className="w-8 h-8 rounded-full mr-2 mt-1 shrink-0 hidden sm:block"
        />
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
          isUser
            ? "bg-chat-user text-chat-user-foreground rounded-br-md"
            : "bg-chat-bot text-chat-bot-foreground rounded-bl-md"
        )}
      >
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
        {!isUser && (
          <button
            onClick={() => speakText(message.content)}
            className="mt-2 p-1 rounded hover:bg-foreground/10 transition-colors"
            title="Read aloud"
          >
            <Volume2 className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  );
}
