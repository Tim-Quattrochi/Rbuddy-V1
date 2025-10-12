import { useMemo } from "react";
import { NotebookPen, RefreshCcw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useJournalHistory } from "@/hooks/useJournalHistory";
import { formatJournalTimestamp } from "@/lib/datetime";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/queryClient";

export default function JournalPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useJournalHistory();

  const entries = useMemo(
    () => data?.pages.flatMap((page) => page.entries) ?? [],
    [data],
  );

  if (isAuthLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-5 w-2/3" />
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <Alert variant="destructive">
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>Please log in to view your journal history.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const errorMessage = error instanceof ApiError ? error.message : (error as Error | undefined)?.message;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Journal History</h1>
        <p className="text-muted-foreground">
          Reflect on your journey and revisit the moments that shaped your growth.
        </p>
      </header>

      {isError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Unable to load journal entries</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-3">
            <span>{errorMessage || "Something went wrong. Please try again."}</span>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="border-muted/40">
              <CardHeader>
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : entries.length === 0 ? (
        <Card className="border-dashed border-muted/60">
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <NotebookPen className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
            <h2 className="text-xl font-semibold">No journal entries yet</h2>
            <p className="max-w-md text-muted-foreground">
              No journal entries yet. Start writing to track your journey and celebrate every victory.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <ScrollArea className="h-[60vh] rounded-md border border-muted/40">
            <div className="space-y-4 p-4">
              {entries.map((entry) => (
                <Card key={entry.id} className="shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {formatJournalTimestamp(entry.createdAt)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line text-base leading-relaxed text-foreground">
                      {entry.body}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>

          {hasNextPage && (
            <div className="flex justify-center">
              <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} variant="secondary">
                {isFetchingNextPage ? "Loading more..." : "Load more entries"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}