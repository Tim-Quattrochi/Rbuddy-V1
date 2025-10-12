import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MoodSelector } from "@/components/daily-ritual/MoodSelector";
import { AffirmationCard } from "@/components/daily-ritual/AffirmationCard";
import { IntentionInput } from "@/components/daily-ritual/IntentionInput";
import { StreakCounter } from "@/components/daily-ritual/StreakCounter";
import type { MoodOption } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Use cookie-based authentication (auth_token cookie set by OAuth)
// No need for Authorization header - cookies are sent automatically with credentials: 'include'

function getAuthHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
  };
}

async function fetchUserStats() {
  const res = await fetch("/api/user/stats", {
    credentials: "include", // Send cookies with request
  });
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
}

async function postMood(variables: { mood: MoodOption }) {
  const { mood } = variables;
  const res = await fetch("/api/daily-ritual/mood", {
    method: "POST",
    credentials: "include", // Send cookies with request
    headers: getAuthHeaders(),
    body: JSON.stringify({ mood }),
  });
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
}

async function postIntention(variables: { sessionId: string; intentionText: string }) {
  const { sessionId, intentionText } = variables;
  const res = await fetch("/api/daily-ritual/intention", {
    method: "POST",
    credentials: "include", // Send cookies with request
    headers: getAuthHeaders(),
    body: JSON.stringify({ sessionId, intentionText }),
  });
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
}

export default function DailyRitualPage() {
  const queryClient = useQueryClient();
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ["userStats"],
    queryFn: fetchUserStats,
  });

  const { toast } = useToast();

  const moodMutation = useMutation({
      mutationFn: postMood,
      onSuccess: (data) => {
        setSessionId(data.sessionId);
        queryClient.setQueryData(['affirmation'], data.affirmation);
        toast({
          title: "Mood recorded",
          description: "Your daily check-in has been saved.",
        });
      },
      // Optimistic update
      onMutate: async (newMood) => {
        await queryClient.cancelQueries({ queryKey: ['userStats'] });
        const previousStats = queryClient.getQueryData(['userStats']);
        // Optimistically update stats
        queryClient.setQueryData(['userStats'], (old: any) => ({
          ...old,
          streakCount: (old?.streakCount || 0) + 1,
        }));
        return { previousStats };
      },
      onError: (err, newMood, context) => {
        // Revert optimistic update on error
        queryClient.setQueryData(['userStats'], context?.previousStats);
        toast({
          variant: "destructive",
          title: "Error recording mood",
          description: "Unable to save your check-in. Please try again.",
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['userStats'] });
      },
    });

  const intentionMutation = useMutation({
    mutationFn: postIntention,
    onSuccess: () => {
      toast({
        title: "Intention saved",
        description: "Your daily intention has been recorded.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error saving intention",
        description: "Unable to save your intention. Please try again.",
      });
    },
  });

  const handleSelectMood = (mood: MoodOption) => {
    setSelectedMood(mood);
    moodMutation.mutate({ mood });
  };

  const handleSaveIntention = (intention: string) => {
    if (!sessionId) return;
    intentionMutation.mutate({ sessionId, intentionText: intention });
  };

  const affirmation = queryClient.getQueryData<string>(['affirmation']);

  const handleRetry = () => {
    setSelectedMood(null);
    setSessionId(null);
    queryClient.invalidateQueries({ queryKey: ['userStats'] });
    moodMutation.reset();
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold">Daily Ritual</h1>
        <p className="text-muted-foreground">Your space for daily reflection.</p>
      </header>

      <div className="space-y-8">
        {isLoadingStats ? (
          <div className="text-center py-4">Loading your stats...</div>
        ) : statsData ? (
          <StreakCounter streak={statsData.streakCount ?? 0} />
        ) : (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Unable to load stats</AlertTitle>
            <AlertDescription>
              We couldn't load your streak data. You can still complete your check-in.
            </AlertDescription>
          </Alert>
        )}

        {moodMutation.isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>We couldn't save your mood selection. Please try again.</p>
              <Button variant="outline" size="sm" onClick={handleRetry}>
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {!selectedMood ? (
          <MoodSelector onSelectMood={handleSelectMood} />
        ) : (
          <div className="space-y-8">
            {moodMutation.isPending ? (
                <div className="text-center py-4">Loading affirmation...</div>
            ) : affirmation ? (
                <AffirmationCard affirmation={affirmation} />
            ) : null}
            <IntentionInput onSaveIntention={handleSaveIntention} />
          </div>
        )}
      </div>
    </div>
  );
}
