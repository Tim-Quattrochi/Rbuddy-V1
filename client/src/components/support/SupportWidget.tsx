import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface SupportWidgetProps {
  onOpenRepair: () => void;
}

export function SupportWidget({ onOpenRepair }: SupportWidgetProps) {
  return (
    <Card
      className="bg-purple-50 border-purple-200"
      role="region"
      aria-labelledby="support-widget-title"
      data-testid="support-widget"
    >
      <CardHeader>
        <CardTitle
          id="support-widget-title"
          className="flex items-center gap-2 text-purple-900"
        >
          <Heart className="h-5 w-5" aria-hidden="true" />
          Need Support?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-purple-800 mb-4">
          Tough moments happen. We're here to help, anytime.
        </p>
        <Button
          onClick={onOpenRepair}
          variant="outline"
          className="border-purple-300 text-purple-700 hover:bg-purple-100"
          aria-label="Access support repair flow"
          data-testid="support-widget-button"
        >
          Access Support
        </Button>
      </CardContent>
    </Card>
  );
}
