import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface IntentionInputProps {
  onSaveIntention: (intention: string) => void;
}

export function IntentionInput({ onSaveIntention }: IntentionInputProps) {
  const [intention, setIntention] = useState("");

  const handleBlur = () => {
    if (intention.trim()) {
      onSaveIntention(intention.trim());
    }
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="intention">Set Your Intention for Today (Optional)</Label>
      <Input
        type="text"
        id="intention"
        placeholder="e.g., 'I will be patient with myself.'"
        value={intention}
        onChange={(e) => setIntention(e.target.value)}
        onBlur={handleBlur}
      />
    </div>
  );
}
