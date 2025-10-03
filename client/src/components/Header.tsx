import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2" data-testid="link-home">
          <Heart className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Reentry Buddy</span>
        </Link>
      </div>
    </header>
  );
}
