import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckInButton from "@/components/CheckInButton";
import CheckInForm from "@/components/CheckInForm";

export default function CheckIn() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center mb-12" data-testid="text-page-title">
            Next Moment
          </h1>
          
          {!showForm ? (
            <CheckInButton onClick={() => setShowForm(true)} />
          ) : (
            <div className="space-y-8">
              <CheckInForm />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
