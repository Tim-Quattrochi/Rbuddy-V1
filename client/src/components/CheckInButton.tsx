import { Button } from "@/components/ui/button";

interface CheckInButtonProps {
  onClick: () => void;
}

export default function CheckInButton({ onClick }: CheckInButtonProps) {
  return (
    <div className="w-full max-w-md mx-auto px-4">
      <Button 
        size="lg" 
        className="w-full py-8 text-xl"
        onClick={onClick}
        data-testid="button-check-in-today"
      >
        Check-In for Today
      </Button>
    </div>
  );
}
