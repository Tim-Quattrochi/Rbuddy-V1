import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StreakCounterProps {
  streak: number;
}

export function StreakCounter({ streak }: StreakCounterProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Daily Streak</CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <path d="M12 2 L12 22 M12 2 L6 8 M12 2 L18 8" />
        </svg>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{streak} Days</div>
        <p className="text-xs text-muted-foreground">Keep it up!</p>
      </CardContent>
    </Card>
  );
}
