"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useEmployee } from "@/context/employee-context";
import { TimeclockVariant, Employee } from "@/lib/types";
import { Clock, LogIn, LogOut, Coffee, SkipForward, Users } from "lucide-react";

type TimeclockModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: TimeclockVariant;
  employee?: Employee | null;
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatLogTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const actionLabels = {
  CLOCK_IN: "Clocked In",
  CLOCK_OUT: "Clocked Out",
  START_BREAK: "Break Started",
  END_BREAK: "Break Ended",
} as const;

const actionColors = {
  CLOCK_IN: "text-green-600",
  CLOCK_OUT: "text-red-600",
  START_BREAK: "text-blue-600",
  END_BREAK: "text-blue-600",
} as const;

export function TimeclockModal({
  open,
  onOpenChange,
  variant,
  employee: employeeOverride,
}: TimeclockModalProps) {
  const router = useRouter();
  const {
    currentEmployee,
    currentTime,
    clockIn,
    clockOut,
    startBreak,
    endBreak,
    logout,
    getClockedInEmployees,
  } = useEmployee();

  const employee = employeeOverride ?? currentEmployee;
  if (!employee) return null;

  const { clockStatus, displayName, timeLog, id } = employee;
  const clockedInList = getClockedInEmployees();

  const statusMessage = {
    CLOCKED_IN: "You are currently clocked in.",
    CLOCKED_OUT: "You are currently clocked out.",
    ON_BREAK: "You are currently on break.",
  }[clockStatus];

  const close = () => onOpenChange(false);

  // Variant A (hamburger): actions also sign out
  // Variant B (nameBadge): actions do NOT sign out
  // Variant C (pinEntry): clock in options + skip

  const handleClockIn = () => {
    clockIn(id);
    if (variant === "hamburger") {
      close();
      logout();
      router.push("/");
    } else if (variant === "pinEntry") {
      close();
    } else {
      close();
    }
  };

  const handleClockInAndSignOut = () => {
    clockIn(id);
    close();
    logout();
    router.push("/");
  };

  const handleClockOut = () => {
    clockOut(id);
    if (variant === "hamburger") {
      close();
      logout();
      router.push("/");
    } else {
      close();
    }
  };

  const handleStartBreak = () => {
    startBreak(id);
    if (variant === "hamburger") {
      close();
      logout();
      router.push("/");
    } else {
      close();
    }
  };

  const handleEndBreak = () => {
    endBreak(id);
    close();
  };

  const handleEndBreakAndSignOut = () => {
    endBreak(id);
    close();
    logout();
    router.push("/");
  };

  const handleSkip = () => {
    close();
    router.push("/orders");
  };

  const renderButtons = () => {
    if (variant === "pinEntry") {
      if (clockStatus === "CLOCKED_IN") {
        return (
          <div className="flex flex-col gap-2">
            <Button
              onClick={close}
              className="bg-pos-green hover:bg-pos-green-dark text-white"
            >
              Continue
            </Button>
          </div>
        );
      }
      if (clockStatus === "ON_BREAK") {
        return (
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleEndBreak}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Coffee className="w-4 h-4 mr-2" />
              End Break
            </Button>
            <Button
              onClick={handleEndBreakAndSignOut}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <Coffee className="w-4 h-4 mr-2" />
              End Break & Sign Out
            </Button>
          </div>
        );
      }
      // CLOCKED_OUT
      return (
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleClockIn}
            className="bg-pos-green hover:bg-pos-green-dark text-white"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Clock In
          </Button>
          <Button
            onClick={handleClockInAndSignOut}
            variant="outline"
            className="border-pos-green text-pos-green hover:bg-pos-green/10"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Clock In & Sign Out
          </Button>
        </div>
      );
    }

    if (clockStatus === "CLOCKED_IN") {
      return (
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleStartBreak}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Coffee className="w-4 h-4 mr-2" />
            Start Break
            {variant === "hamburger" && " & Sign Out"}
          </Button>
          <Button
            onClick={handleClockOut}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Clock Out
            {variant === "hamburger" && " & Sign Out"}
          </Button>
        </div>
      );
    }

    if (clockStatus === "ON_BREAK") {
      return (
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleEndBreak}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Coffee className="w-4 h-4 mr-2" />
            End Break
          </Button>
        </div>
      );
    }

    // CLOCKED_OUT (for hamburger or nameBadge variant)
    if (variant === "nameBadge") {
      return (
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleClockIn}
            className="bg-pos-green hover:bg-pos-green-dark text-white"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Clock In
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        <Button
          onClick={handleClockInAndSignOut}
          className="bg-pos-green hover:bg-pos-green-dark text-white"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Clock In & Sign Out
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Time Clock
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 flex-1 overflow-hidden">
          {/* Live clock */}
          <div className="text-center">
            <p className="text-3xl font-mono font-bold">
              {formatTime(currentTime)}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatDate(currentTime)}
            </p>
          </div>

          {/* Welcome message */}
          <div className="text-center">
            <p className="text-lg">
              Welcome, <span className="font-bold">{displayName}</span>!
            </p>
            <p className="text-sm text-muted-foreground">{statusMessage}</p>
          </div>

          {/* Action buttons */}
          {renderButtons()}

          <Separator />

          {/* Today's Activity */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <h3 className="font-semibold text-sm mb-2">
              Today&apos;s Activity
            </h3>
            <ScrollArea className="flex-1 max-h-32">
              {timeLog.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No activity today.
                </p>
              ) : (
                <div className="space-y-1">
                  {[...timeLog].reverse().map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className={actionColors[entry.action]}>
                        {actionLabels[entry.action]}
                      </span>
                      <span className="text-muted-foreground">
                        {formatLogTime(entry.timestamp)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          <Separator />

          {/* Who's Clocked In */}
          <div>
            <h3 className="font-semibold text-sm mb-2 flex items-center gap-1">
              <Users className="w-4 h-4" />
              Who&apos;s Clocked In ({clockedInList.length})
            </h3>
            <div className="flex flex-wrap gap-1">
              {clockedInList.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No one is clocked in.
                </p>
              ) : (
                clockedInList.map((emp) => (
                  <span
                    key={emp.id}
                    className="text-xs bg-muted px-2 py-1 rounded-full"
                  >
                    {emp.displayName}
                    {emp.clockStatus === "ON_BREAK" && " (break)"}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
