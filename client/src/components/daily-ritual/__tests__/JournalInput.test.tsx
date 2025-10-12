import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { JournalInput } from "../JournalInput";

describe("JournalInput", () => {
  it("renders textarea and button", () => {
    render(<JournalInput onSaveJournal={vi.fn()} />);

    expect(screen.getByLabelText(/daily journal/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save journal/i })).toBeInTheDocument();
  });

  it("prevents submission when entry is empty", async () => {
    render(<JournalInput onSaveJournal={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /save journal/i }));

    expect(await screen.findByText(/please enter a journal entry/i)).toBeInTheDocument();
  });

  it("trims input and calls onSaveJournal", async () => {
    const handleSave = vi.fn().mockResolvedValue(undefined);
    render(<JournalInput onSaveJournal={handleSave} />);

    fireEvent.change(screen.getByLabelText(/daily journal/i), {
      target: { value: "  Reflecting on my progress  " },
    });

    fireEvent.submit(screen.getByRole("button", { name: /save journal/i }).closest("form")!);

    await waitFor(() => {
      expect(handleSave).toHaveBeenCalledWith("Reflecting on my progress");
    });

    await waitFor(() => {
      expect(screen.getByLabelText(/daily journal/i)).toHaveValue("");
    });
  });

  it("disables controls while saving", () => {
    render(<JournalInput onSaveJournal={vi.fn()} isSaving />);

    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();
    expect(screen.getByLabelText(/daily journal/i)).toBeDisabled();
  });
});