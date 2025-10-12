import { useState, FormEvent } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface JournalInputProps {
  onSaveJournal: (entry: string) => Promise<void> | void;
  isSaving?: boolean;
}

export function JournalInput({ onSaveJournal, isSaving = false }: JournalInputProps) {
  const [entry, setEntry] = useState("");
  const [showValidationError, setShowValidationError] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedEntry = entry.trim();

    if (!trimmedEntry) {
      setShowValidationError(true);
      return;
    }

    try {
      await onSaveJournal(trimmedEntry);
      setEntry("");
      setShowValidationError(false);
    } catch (error) {
      // Parent component surfaces error state via toast; no-op here to keep UX simple.
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3" aria-label="Daily journal entry">
      <div className="grid w-full gap-1.5">
        <Label htmlFor="journal-entry">Daily Journal (Optional)</Label>
        <Textarea
          id="journal-entry"
          placeholder="Write a short reflection about how you're feeling."
          value={entry}
          onChange={(event) => setEntry(event.target.value)}
          rows={4}
          aria-invalid={showValidationError}
          aria-describedby={showValidationError ? "journal-entry-error" : undefined}
          disabled={isSaving}
        />
        {showValidationError && (
          <p id="journal-entry-error" className="text-sm text-destructive">
            Please enter a journal entry before saving.
          </p>
        )}
      </div>
      <Button type="submit" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Journal"}
      </Button>
    </form>
  );
}