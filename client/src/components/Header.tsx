import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { NavigationMenu } from "@/components/navigation/NavigationMenu";
import { UserMenu } from "@/components/navigation/UserMenu";

interface HeaderProps {
  onOpenRepair?: () => void;
}

export default function Header({ onOpenRepair }: HeaderProps) {
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          {isAuthenticated && onOpenRepair && (
            <NavigationMenu onOpenRepair={onOpenRepair} />
          )}
          
          <Link to="/" className="flex items-center gap-2" data-testid="link-home">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Reentry Buddy</span>
          </Link>

          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-6 ml-6">
              <Link
                to="/daily-ritual"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-link-daily-ritual"
              >
                Daily Ritual
              </Link>
            </nav>
          )}
        </div>
        
        {isAuthenticated && onOpenRepair && (
          <div className="hidden md:block">
            <UserMenu onOpenRepair={onOpenRepair} />
          </div>
        )}
      </div>
    </header>
  );
}
