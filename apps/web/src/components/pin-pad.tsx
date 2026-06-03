"use client";

import { useState, useCallback } from "react";
import { Delete } from "lucide-react";

const PIN_LENGTH = 6;

type PinPadProps = {
  onSubmit: (pin: string) => void;
  error: string | null;
  shake: boolean;
};

export function PinPad({ onSubmit, error, shake }: PinPadProps) {
  const [pin, setPin] = useState("");

  const handleDigit = useCallback(
    (digit: string) => {
      if (pin.length >= PIN_LENGTH) return;
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === PIN_LENGTH) {
        onSubmit(newPin);
        // Reset after short delay to allow animation
        setTimeout(() => setPin(""), 300);
      }
    },
    [pin, onSubmit]
  );

  const handleBackspace = useCallback(() => {
    setPin((prev) => prev.slice(0, -1));
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* PIN circles */}
      <div className={`flex gap-3 ${shake ? "animate-shake" : ""}`}>
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 transition-colors ${
              i < pin.length
                ? "bg-pos-green border-pos-green"
                : "bg-transparent border-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-red-500 text-sm font-medium">{error}</p>
      )}

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-3">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
          <button
            key={digit}
            onClick={() => handleDigit(digit)}
            className="w-20 h-20 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-2xl font-semibold text-gray-800 transition-colors flex items-center justify-center"
          >
            {digit}
          </button>
        ))}
        <div /> {/* Empty space */}
        <button
          onClick={() => handleDigit("0")}
          className="w-20 h-20 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-2xl font-semibold text-gray-800 transition-colors flex items-center justify-center"
        >
          0
        </button>
        <button
          onClick={handleBackspace}
          className="w-20 h-20 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors flex items-center justify-center"
        >
          <Delete className="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
