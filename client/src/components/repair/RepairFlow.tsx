import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

type TriggerOption = "stress" | "people" | "craving";

interface RepairFlowProps {
  onClose: () => void;
}

interface RepairResponse {
  sessionId: string;
  message: string;
  repairSuggestion: string;
}

const triggerOptions: { trigger: TriggerOption; label: string }[] = [
  { trigger: "stress", label: "Stress" },
  { trigger: "people", label: "People" },
  { trigger: "craving", label: "Craving" },
];

async function postRepairStart(trigger: TriggerOption): Promise<RepairResponse> {
  const res = await fetch("/api/repair/start", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ trigger }),
  });

  if (!res.ok) {
    throw new Error("Network response was not ok");
  }

  return res.json();
}

export function RepairFlow({ onClose }: RepairFlowProps) {
  const [step, setStep] = useState<"trigger" | "suggestion" | "closing">("trigger");
  const [repairData, setRepairData] = useState<RepairResponse | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const repairMutation = useMutation({
    mutationFn: postRepairStart,
    onSuccess: (data) => {
      setRepairData(data);
      setStep("suggestion");
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
    onError: (error) => {
      console.error("Repair flow error:", error);
      toast({
        title: "Error",
        description: "We couldn't save your session. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleTriggerSelect = (trigger: TriggerOption) => {
    repairMutation.mutate(trigger);
  };

  const handleContinue = () => {
    setStep("closing");
  };

  const handleComplete = () => {
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        // Close on backdrop click
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="repair-flow-title"
    >
      <Card className="w-full max-w-md relative">
        {/* Close button in top-right corner */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-10"
          onClick={onClose}
          aria-label="Close support modal"
        >
          <X className="h-4 w-4" />
        </Button>

        {step === "trigger" && (
          <>
            <CardHeader>
              <CardTitle id="repair-flow-title" className="text-center text-foreground">
                Slips happen. What matters is what you do next.
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-muted-foreground">
                What triggered this moment?
              </p>
              <div className="space-y-2">
                {triggerOptions.map(({ trigger, label }) => (
                  <Button
                    key={trigger}
                    className="w-full"
                    onClick={() => handleTriggerSelect(trigger)}
                    disabled={repairMutation.isPending}
                  >
                    {label}
                  </Button>
                ))}
              </div>
              {repairMutation.isPending && (
                <p className="text-center text-sm text-muted-foreground">
                  Loading...
                </p>
              )}
            </CardContent>
          </>
        )}

        {step === "suggestion" && repairData && (
          <>
            <CardHeader>
              <CardTitle id="repair-flow-title" className="text-center text-foreground">Try This</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-lg text-foreground">{repairData.repairSuggestion}</p>
              <Button className="w-full" onClick={handleContinue}>
                Done
              </Button>
            </CardContent>
          </>
        )}

        {step === "closing" && (
          <>
            <CardHeader>
              <CardTitle id="repair-flow-title" className="text-center text-foreground">You've Got This</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-foreground">
                We're here with you. Come back tomorrow for your check-in.
              </p>
              <Button className="w-full" onClick={handleComplete}>
                Close
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
