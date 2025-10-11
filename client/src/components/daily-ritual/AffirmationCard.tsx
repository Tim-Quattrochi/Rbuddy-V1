import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AffirmationCardProps {
  affirmation: string;
}

export function AffirmationCard({ affirmation }: AffirmationCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>A Thought for Today</CardTitle>
        <CardDescription>Your daily affirmation</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-lg text-center p-4">{affirmation}</p>
      </CardContent>
    </Card>
  );
}
