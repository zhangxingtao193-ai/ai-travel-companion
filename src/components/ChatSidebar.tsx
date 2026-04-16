import { MapPin, Globe, Star } from "lucide-react";
import avatarImg from "@/assets/avatar.png";

export default function ChatSidebar() {
  return (
    <aside className="hidden md:flex w-72 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="flex flex-col items-center pt-8 pb-6 px-4">
        <img
          src={avatarImg}
          alt="Travel Star Avatar"
          className="w-28 h-28 rounded-full border-4 border-sidebar-primary shadow-lg mb-4"
        />
        <h2 className="font-heading font-bold text-lg text-sidebar-primary-foreground">Travel Star</h2>
        <p className="text-sm text-sidebar-foreground/70 text-center mt-1">
          AI-powered travel planning for Hong Kong & Tokyo
        </p>
      </div>
      <div className="px-4 space-y-3 mt-2">
        {[
          { icon: MapPin, text: "Hong Kong & Tokyo expert" },
          { icon: Globe, text: "Multilingual responses" },
          { icon: Star, text: "Personalized itineraries" },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-3 text-sm text-sidebar-foreground/80 bg-sidebar-accent rounded-lg px-3 py-2">
            <Icon className="h-4 w-4 text-sidebar-primary shrink-0" />
            <span>{text}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
