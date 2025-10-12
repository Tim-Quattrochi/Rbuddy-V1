import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import Landing from "@/pages/Landing";
import CheckIn from "@/pages/CheckIn";
import DailyRitual from "@/pages/DailyRitual";
import Journal from "@/pages/Journal";
import LoginPage from "@/pages/Login";
import NotFound from "@/pages/not-found";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function App() {
  return (
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/check-in" element={<CheckIn />} />
            <Route 
              path="/daily-ritual" 
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DailyRitual />} />
            </Route>
            <Route 
              path="/journal" 
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Journal />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </TooltipProvider>
  );
}

export default App;
