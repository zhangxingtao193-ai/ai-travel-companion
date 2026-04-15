import { Plane } from "lucide-react";

export default function ChatHeader() {
  return (
    <header className="gradient-sky px-6 py-4 flex items-center gap-3 shadow-md">
      <div className="rounded-full bg-primary-foreground/20 p-2">
        <Plane className="h-6 w-6 text-primary-foreground" />
      </div>
      <div>
        <h1 className="text-xl font-heading font-bold text-primary-foreground tracking-tight">
          Travel Star
        </h1>
        <p className="text-sm text-primary-foreground/80 font-body">
          Your AI Travel Concierge ✨
        </p>
      </div>
    </header>
  );
}
