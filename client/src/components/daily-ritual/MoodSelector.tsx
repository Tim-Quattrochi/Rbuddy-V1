import { Button } from "@/components/ui/button";
import type { MoodOption } from "@shared/schema";

interface MoodSelectorProps {
  onSelectMood: (mood: MoodOption) => void;
}

const moodOptions: { mood: MoodOption; label: string; emoji: string }[] = [
  { mood: "calm", label: "Calm", emoji: "😌" },
  { mood: "stressed", label: "Stressed", emoji: "😰" },
  { mood: "tempted", label: "Tempted", emoji: "😣" },
  { mood: "hopeful", label: "Hopeful", emoji: "🌟" },
];

export function MoodSelector({ onSelectMood }: MoodSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {moodOptions.map(({ mood, label, emoji }) => (
        <Button
          key={mood}
          variant="outline"
          className="h-24 text-lg border-2 hover:bg-accent hover:border-primary transition-colors"
          onClick={() => onSelectMood(mood)}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-3xl leading-none">{emoji}</span>
            <span className="text-sm font-medium">{label}</span>
          </div>
        </Button>
      ))}
    </div>
  );
}
