import { Link } from "react-router-dom";
import { Heart, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { user, isAuthenticated, logout, isLoggingOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2" data-testid="link-home">
          <Heart className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Reentry Buddy</span>
        </Link>
        
        {isAuthenticated && user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground" data-testid="user-email">
              {user.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              disabled={isLoggingOut}
              data-testid="logout-button"
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
