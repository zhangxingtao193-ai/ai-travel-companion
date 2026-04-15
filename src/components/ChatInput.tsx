import { useState } from "react";
import { Send, Mic, MicOff } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeech";
import { cn } from "@/lib/utils";

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [input, setInput] = useState("");
  const { isListening, startListening, stopListening } = useSpeechRecognition();

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput("");
  };

  const handleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((text) => {
        setInput(text);
        setTimeout(() => {
          onSend(text);
          setInput("");
        }, 300);
      });
    }
  };

  return (
    <div className="border-t border-border bg-card px-4 py-3">
      {isListening && (
        <div className="text-xs text-primary font-medium mb-2 animate-pulse text-center">
          🎙️ Listening...
        </div>
      )}
      <div className="flex items-center gap-2">
        <button
          onClick={handleVoice}
          className={cn(
            "p-2.5 rounded-full transition-all shrink-0",
            isListening
              ? "bg-destructive text-destructive-foreground animate-pulse"
              : "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
          )}
          title={isListening ? "Stop listening" : "Voice input"}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask about Hong Kong, Tokyo, or anywhere..."
          disabled={disabled}
          className="flex-1 bg-muted rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/60 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || disabled}
          className="gradient-sky p-2.5 rounded-full text-primary-foreground disabled:opacity-40 transition-all hover:shadow-md active:scale-95 shrink-0"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
