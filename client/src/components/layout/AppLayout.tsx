import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import { RepairFlow } from "@/components/repair/RepairFlow";
import { FloatingChat } from "@/components/chat/FloatingChat";

export function AppLayout() {
  const [showRepairFlow, setShowRepairFlow] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onOpenRepair={() => setShowRepairFlow(true)} />
      <main className="flex-1">
        <Outlet />
      </main>
      {showRepairFlow && (
        <RepairFlow onClose={() => setShowRepairFlow(false)} />
      )}
      <FloatingChat />
    </div>
  );
}
