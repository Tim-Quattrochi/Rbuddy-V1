import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MoodSelector } from "@/components/daily-ritual/MoodSelector";
import { AffirmationCard } from "@/components/daily-ritual/AffirmationCard";
import { IntentionInput } from "@/components/daily-ritual/IntentionInput";
import { JournalInput } from "@/components/daily-ritual/JournalInput";
import { StreakCounter } from "@/components/daily-ritual/StreakCounter";
import type { MoodOption } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/queryClient";

// Use cookie-based authentication (auth_token cookie set by OAuth)
// No need for Authorization header - cookies are sent automatically with credentials: 'include'

function isUnauthorizedError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 401;
  }

  if (typeof error === "object" && error !== null && "status" in error) {
    return (error as { status?: number }).status === 401;
  }

  const message = (error as Error | undefined)?.message ?? "";
  return message.includes("401") || message.toLowerCase().includes("unauthorized");
}

function getAuthHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
  };
}

async function parseJsonOrThrow(res: Response) {
  if (!res.ok) {
    const message = res.statusText
      ? `${res.status} ${res.statusText}`
      : `Request failed with status ${res.status}`;
  throw new ApiError({ status: res.status, message });
  }
  return res.json();
}

async function fetchUserStats() {
  const res = await fetch("/api/user/stats", {
    credentials: "include", // Send cookies with request
  });
  return parseJsonOrThrow(res);
}

async function postMood(variables: { mood: MoodOption }) {
  const { mood } = variables;
  const res = await fetch("/api/daily-ritual/mood", {
    method: "POST",
    credentials: "include", // Send cookies with request
    headers: getAuthHeaders(),
    body: JSON.stringify({ mood }),
  });
  return parseJsonOrThrow(res);
}

async function postIntention(variables: { sessionId: string; intentionText: string; type?: "intention" | "journal_entry" }) {
  const { sessionId, intentionText, type } = variables;
  const payload: Record<string, string> = {
    sessionId,
    intentionText,
  };

  if (type) {
    payload.type = type;
  }

  const res = await fetch("/api/daily-ritual/intention", {
    method: "POST",
    credentials: "include", // Send cookies with request
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return parseJsonOrThrow(res);
}

export default function DailyRitualPage() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading: isLoadingAuth } = useAuth();
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const { data: statsData, isLoading: isLoadingStats, error: statsError } = useQuery({
    queryKey: ["userStats"],
    queryFn: fetchUserStats,
    enabled: isAuthenticated, // Only fetch stats when authenticated
    retry: 1
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
      onError: (err: Error, newMood, context) => {
        // Revert optimistic update on error
        queryClient.setQueryData(['userStats'], context?.previousStats);

        // Check if it's an authentication error
        const isAuthError = isUnauthorizedError(err);

        toast({
          variant: "destructive",
          title: isAuthError ? "Session expired" : "Error recording mood",
          description: isAuthError
            ? "Your session has expired. Please log in again."
            : "Unable to save your check-in. Please try again.",
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['userStats'] });
      },
    });

  const intentionMutation = useMutation({
    mutationFn: ({ sessionId, intentionText }: { sessionId: string; intentionText: string }) =>
      postIntention({ sessionId, intentionText, type: "intention" }),
    onSuccess: () => {
      toast({
        title: "Intention saved",
        description: "Your daily intention has been recorded.",
      });
    },
    onError: (err: Error) => {
      // Check if it's an authentication error
      const isAuthError = isUnauthorizedError(err);

      toast({
        variant: "destructive",
        title: isAuthError ? "Session expired" : "Error saving intention",
        description: isAuthError
          ? "Your session has expired. Please log in again."
          : "Unable to save your intention. Please try again.",
      });
    },
  });

  const journalMutation = useMutation({
    mutationFn: ({ sessionId, intentionText }: { sessionId: string; intentionText: string }) =>
      postIntention({ sessionId, intentionText, type: "journal_entry" }),
    onSuccess: () => {
      toast({
        title: "Journal entry saved",
        description: "Your reflection has been added to your ritual.",
      });
    },
    onError: (err: Error) => {
      const isAuthError = isUnauthorizedError(err);

      toast({
        variant: "destructive",
        title: isAuthError ? "Session expired" : "Error saving journal entry",
        description: isAuthError
          ? "Your session has expired. Please log in again."
          : "Unable to save your journal entry. Please try again.",
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

  const handleSaveJournal = async (entry: string) => {
    if (!sessionId) return;
    await journalMutation.mutateAsync({ sessionId, intentionText: entry });
  };

  const affirmation = queryClient.getQueryData<string>(['affirmation']);

  const handleRetry = () => {
    setSelectedMood(null);
    setSessionId(null);
    queryClient.invalidateQueries({ queryKey: ['userStats'] });
    moodMutation.reset();
  };

  // Show loading state while checking authentication
  if (isLoadingAuth) {
    return (
      <div className="container mx-auto p-4 max-w-md">
        <div className="text-center py-12">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Show fallback if not authenticated (belt-and-suspenders - ProtectedRoute should handle this)
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4 max-w-md">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            Please log in to access your Daily Ritual.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold">Daily Ritual</h1>
        <p className="text-muted-foreground">Your space for daily reflection.</p>
        {user && (
          <p className="text-sm text-muted-foreground mt-2">
            Welcome back, {user.username || user.email}
          </p>
        )}
      </header>

      <div className="space-y-8">
        {isLoadingStats ? (
          <div className="text-center py-4">Loading your stats...</div>
        ) : statsError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Unable to load stats</AlertTitle>
            <AlertDescription>
              {statsError.message.includes('401') || statsError.message.includes('Unauthorized')
                ? "Your session has expired. Please refresh the page or log in again."
                : "We couldn't load your streak data. You can still complete your check-in."}
            </AlertDescription>
          </Alert>
        ) : statsData ? (
          <StreakCounter streak={statsData.streakCount ?? 0} />
        ) : null}

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
            {sessionId && (
              <JournalInput onSaveJournal={handleSaveJournal} isSaving={journalMutation.isPending} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
