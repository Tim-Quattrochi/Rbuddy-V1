import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, Calendar, Target, BookOpen } from "lucide-react";

export default function Hero() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-hero-title">
            Next Moment helps formerly incarcerated individuals avoid relapse
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
            Build daily structure and accountability through check-ins, goal setting, and journaling. 
            Take control of your recovery journey, one day at a time.
          </p>
          <Link to="/login" data-testid="link-get-started">
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            Supporting recovery journeys
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4" data-testid="card-feature-checkin">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Daily Check-Ins</h3>
                <p className="text-muted-foreground">
                  Start each day with intention. Track your feelings and stay connected to your progress.
                </p>
              </div>
            </div>

            <div className="flex gap-4" data-testid="card-feature-goals">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Simple Goal Setting</h3>
                <p className="text-muted-foreground">
                  Set achievable daily goals that build momentum and reinforce positive habits.
                </p>
              </div>
            </div>

            <div className="flex gap-4" data-testid="card-feature-journal">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Reflective Journaling</h3>
                <p className="text-muted-foreground">
                  Express your thoughts and emotions in a safe, private space for personal growth.
                </p>
              </div>
            </div>

            <div className="flex gap-4" data-testid="card-feature-support">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Recovery Support</h3>
                <p className="text-muted-foreground">
                  Built specifically for your journey with understanding, empathy, and respect.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
