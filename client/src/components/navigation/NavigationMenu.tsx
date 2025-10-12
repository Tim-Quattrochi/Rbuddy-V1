import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Menu, Home, Heart, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface NavigationMenuProps {
  onOpenRepair: () => void;
}

export function NavigationMenu({ onOpenRepair }: NavigationMenuProps) {
  const [open, setOpen] = useState(false);
  const { user, logout, isLoggingOut, isAuthenticated} = useAuth();
  const location = useLocation();




  const handleNavigate = () => {
    setOpen(false);
  };

  const handleSupport = () => {
    setOpen(false);
    onOpenRepair();
  };

  const handleLogout = async () => {
    // The navigation and state clearing is handled by the useAuth hook's mutation.
    setOpen(false);
    logout(); 
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open navigation menu"
          data-testid="hamburger-menu-button"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
                <img
            src="/nm-logo.png"
            decoding="async"
            width={210}
            height={29}
    
            alt="Next Moment Logo"
            className="h-12 w-20 object-contain"
          />
          </SheetTitle>
          {user && (
            <p className="text-sm text-muted-foreground text-left" data-testid="nav-user-email">
              {user.email}
            </p>
          )}
        </SheetHeader>

        <nav className="mt-6 space-y-1" data-testid="mobile-navigation">
          <Link
            to="/daily-ritual"
            onClick={handleNavigate}
            data-testid="nav-daily-ritual"
            className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent ${
              location.pathname === "/daily-ritual"
                ? "bg-accent text-accent-foreground"
                : ""
            }`}
          >
            <Home className="h-5 w-5" />
            <span>Daily Ritual</span>
          </Link>

          <Separator className="my-4" />

          <button
            onClick={handleSupport}
            data-testid="nav-need-support"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-purple-50 text-purple-700 w-full text-left"
          >
            <Heart className="h-5 w-5" />
            <span>Need Support</span>
          </button>

          <Separator className="my-4" />

          <button
            disabled
            data-testid="nav-settings"
            className="flex items-center gap-3 px-3 py-2 rounded-md opacity-50 cursor-not-allowed w-full text-left"
            title="Coming soon"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            data-testid="nav-logout"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-destructive w-full text-left"
          >
            <LogOut className="h-5 w-5" />
            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
          </button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
