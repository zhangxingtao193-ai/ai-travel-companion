import { Plane, Moon, Sun, Menu, Trash2 } from "lucide-react";

interface Props {
  isDark: boolean;
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
  onClear: () => void;
  messageCount: number;
}

export default function ChatHeader({ isDark, onToggleTheme, onToggleSidebar, onClear, messageCount }: Props) {
  return (
    <header className="gradient-sky px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 shadow-md">
      <button
        onClick={onToggleSidebar}
        className="md:hidden p-2 rounded-full bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="rounded-full bg-primary-foreground/20 p-2">
        <Plane className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <h1 className="text-lg sm:text-xl font-heading font-bold text-primary-foreground tracking-tight">
          Travel Star
        </h1>
        <p className="text-xs sm:text-sm text-primary-foreground/80 font-body">
          Your AI Travel Concierge ✨
        </p>
      </div>
      <div className="flex items-center gap-1">
        {messageCount > 1 && (
          <button
            onClick={onClear}
            className="p-2 rounded-full bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 transition-colors"
            title="Clear conversation"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-full bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 transition-colors"
          title={isDark ? "Light mode" : "Dark mode"}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}
