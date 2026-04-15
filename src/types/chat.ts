export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export type PreferenceChip = {
  label: string;
  emoji: string;
  context: string;
};

export const PREFERENCE_CHIPS: PreferenceChip[] = [
  { label: "Foodie", emoji: "🍜", context: "The user is a food enthusiast. Tailor recommendations to local cuisine, street food, hidden gems, and dining experiences." },
  { label: "Culture", emoji: "🏛️", context: "The user loves culture and history. Recommend museums, temples, historical districts, cultural events, and traditional experiences." },
  { label: "Nature", emoji: "🌿", context: "The user enjoys nature and outdoor activities. Suggest parks, hiking trails, beaches, gardens, and scenic viewpoints." },
];
