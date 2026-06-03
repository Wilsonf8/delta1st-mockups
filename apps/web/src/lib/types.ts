export type ClockStatus = "CLOCKED_OUT" | "CLOCKED_IN" | "ON_BREAK";

export type TimeLogEntry = {
  id: string;
  action: "CLOCK_IN" | "CLOCK_OUT" | "START_BREAK" | "END_BREAK";
  timestamp: string; // ISO string
};

export type Employee = {
  id: string;
  pin: string;
  firstName: string;
  lastInitial: string;
  displayName: string;
  clockStatus: ClockStatus;
  clockedInSince: string | null; // ISO string
  breakStartedAt: string | null; // ISO string
  timeLog: TimeLogEntry[];
};

export type Order = {
  id: string;
  transactionNumber: string;
  status: "OPEN" | "CLOSED";
  amount: number;
  customerName: string;
  date: string; // ISO string
};

export type TimeclockVariant = "hamburger" | "nameBadge" | "pinEntry";
