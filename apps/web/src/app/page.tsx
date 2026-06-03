"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PinPad } from "@/components/pin-pad";
import { useEmployee } from "@/context/employee-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useEmployee();
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const handlePinSubmit = useCallback(
    (pin: string) => {
      setError(null);
      const employee = login(pin);

      if (!employee) {
        setShake(true);
        setError("Invalid PIN. Please try again.");
        setTimeout(() => setShake(false), 500);
        return;
      }

      if (employee.clockStatus === "CLOCKED_OUT") {
        // Go to orders, then show timeclock modal (Variant C)
        router.push("/orders?timeclock=pin");
      } else {
        // CLOCKED_IN or ON_BREAK → go to orders
        router.push("/orders");
      }
    },
    [login, router]
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-pos-green text-white px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center font-bold text-lg">
            C
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight">Crest test</h1>
            <p className="text-xs text-white/80 tracking-wider uppercase">
              A Woodforest POS Solution
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          <PinPad onSubmit={handlePinSubmit} error={error} shake={shake} />
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-sm text-gray-400 space-y-1">
        <button className="text-pos-green hover:underline text-sm">
          Need Help?
        </button>
        <p>APS, LTD. 2026</p>
      </footer>

    </div>
  );
}
