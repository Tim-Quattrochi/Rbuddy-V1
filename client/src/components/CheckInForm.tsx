import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function CheckInForm() {
  const [feeling, setFeeling] = useState("");
  const [goal, setGoal] = useState("");
  const [journal, setJournal] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", { feeling, goal, journal });
  };

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="feeling" className="text-sm font-medium">
            How are you feeling today?
          </Label>
          <Input
            id="feeling"
            type="text"
            value={feeling}
            onChange={(e) => setFeeling(e.target.value)}
            placeholder="Describe your mood..."
            className="w-full"
            data-testid="input-feeling"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="goal" className="text-sm font-medium">
            My simple goal today is...
          </Label>
          <Input
            id="goal"
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="What do you want to accomplish?"
            className="w-full"
            data-testid="input-goal"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="journal" className="text-sm font-medium">
            Minimal journaling box
          </Label>
          <Textarea
            id="journal"
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            placeholder="Write your thoughts..."
            className="w-full min-h-32 resize-none"
            data-testid="textarea-journal"
          />
        </div>

        <Button 
          type="submit" 
          size="lg" 
          className="w-full"
          data-testid="button-submit"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
