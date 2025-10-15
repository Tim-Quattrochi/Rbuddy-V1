import { useMemo, useState, useDeferredValue } from "react";
import { NotebookPen, RefreshCcw, Search, X, Calendar as CalendarIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useJournalHistory } from "@/hooks/useJournalHistory";
import { formatJournalTimestamp } from "@/lib/datetime";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ApiError } from "@/lib/queryClient";
import { format } from "date-fns";

type DatePreset = "today" | "week" | "month" | "all" | "custom";

export default function JournalPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [datePreset, setDatePreset] = useState<DatePreset>("all");
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>();
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>();
  
  // Use deferred value for search to debounce
  const deferredSearch = useDeferredValue(searchInput);

  // Calculate date range based on preset
  const dateRange = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (datePreset) {
      case "today":
        return { startDate: today.toISOString(), endDate: undefined };
      case "week":
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return { startDate: weekAgo.toISOString(), endDate: undefined };
      case "month":
        const monthAgo = new Date(today);
        monthAgo.setDate(monthAgo.getDate() - 30);
        return { startDate: monthAgo.toISOString(), endDate: undefined };
      case "custom":
        return {
          startDate: customStartDate?.toISOString(),
          endDate: customEndDate?.toISOString(),
        };
      case "all":
      default:
        return { startDate: undefined, endDate: undefined };
    }
  }, [datePreset, customStartDate, customEndDate]);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useJournalHistory({
    search: deferredSearch.trim() || undefined,
    dateRange: dateRange.startDate || dateRange.endDate ? dateRange : undefined,
  });

  const entries = useMemo(
    () => data?.pages.flatMap((page) => page.entries) ?? [],
    [data],
  );

  const hasActiveFilters = deferredSearch.trim().length > 0 || datePreset !== "all";

  const clearFilters = () => {
    setSearchInput("");
    setDatePreset("all");
    setCustomStartDate(undefined);
    setCustomEndDate(undefined);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (deferredSearch.trim()) count++;
    if (datePreset !== "all") count++;
    return count;
  }, [deferredSearch, datePreset]);

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

      {/* Filter Section */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search journal entries..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 pr-9"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Date Range Select */}
          <Select value={datePreset} onValueChange={(value) => setDatePreset(value as DatePreset)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>

          {/* Custom Date Picker */}
          {datePreset === "custom" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {customStartDate || customEndDate
                    ? `${customStartDate ? format(customStartDate, "MMM d") : "Start"} - ${customEndDate ? format(customEndDate, "MMM d") : "End"}`
                    : "Select dates"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" align="start">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Start Date</label>
                    <Calendar
                      mode="single"
                      selected={customStartDate}
                      onSelect={setCustomStartDate}
                      disabled={(date) => date > new Date()}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">End Date</label>
                    <Calendar
                      mode="single"
                      selected={customEndDate}
                      onSelect={setCustomEndDate}
                      disabled={(date) => date > new Date() || (customStartDate ? date < customStartDate : false)}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
              <X className="h-4 w-4" />
              Clear filters
            </Button>
          )}
        </div>

        {/* Active Filter Indicators */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {deferredSearch.trim() && (
              <Badge variant="secondary" className="gap-1">
                Search: {deferredSearch}
                <button onClick={() => setSearchInput("")} className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {datePreset !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {datePreset === "today" && "Today"}
                {datePreset === "week" && "Last 7 days"}
                {datePreset === "month" && "Last 30 days"}
                {datePreset === "custom" &&
                  `${customStartDate ? format(customStartDate, "MMM d") : "Start"} - ${customEndDate ? format(customEndDate, "MMM d") : "End"}`}
                <button onClick={() => {
                  setDatePreset("all");
                  setCustomStartDate(undefined);
                  setCustomEndDate(undefined);
                }} className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            <Badge variant="outline">{activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""}</Badge>
          </div>
        )}
      </div>

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
            <h2 className="text-xl font-semibold">
              {hasActiveFilters ? "No matching entries found" : "No journal entries yet"}
            </h2>
            <p className="max-w-md text-muted-foreground">
              {hasActiveFilters
                ? "Try adjusting your filters to find more entries, or clear all filters to see your full journal history."
                : "No journal entries yet. Start writing to track your journey and celebrate every victory."}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="mt-2">
                Clear all filters
              </Button>
            )}
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