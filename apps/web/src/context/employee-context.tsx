"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Employee, TimeLogEntry } from "@/lib/types";
import { initialEmployees } from "@/lib/mock-data";

const STORAGE_KEY = "pos-employee-state";

type EmployeeContextType = {
  employees: Employee[];
  currentEmployee: Employee | null;
  currentTime: Date;
  login: (pin: string) => Employee | null;
  logout: () => void;
  clockIn: (id: string) => void;
  clockOut: (id: string) => void;
  startBreak: (id: string) => void;
  endBreak: (id: string) => void;
  getClockedInEmployees: () => Employee[];
};

const EmployeeContext = createContext<EmployeeContextType | null>(null);

function loadFromStorage(): Employee[] | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore parse errors
  }
  return null;
}

function saveToStorage(employees: Employee[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  } catch {
    // ignore storage errors
  }
}

function addLogEntry(
  employee: Employee,
  action: TimeLogEntry["action"]
): Employee {
  return {
    ...employee,
    timeLog: [
      ...employee.timeLog,
      {
        id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        action,
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

export function EmployeeProvider({ children }: { children: React.ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    return loadFromStorage() ?? initialEmployees;
  });
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const initialized = useRef(false);

  // Hydrate from localStorage on mount (client only)
  useEffect(() => {
    if (!initialized.current) {
      const saved = loadFromStorage();
      if (saved) setEmployees(saved);
      initialized.current = true;
    }
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    if (initialized.current) {
      saveToStorage(employees);
    }
  }, [employees]);

  // Keep currentEmployee in sync with employees array
  useEffect(() => {
    if (currentEmployee) {
      const updated = employees.find((e) => e.id === currentEmployee.id);
      if (updated && updated !== currentEmployee) {
        setCurrentEmployee(updated);
      }
    }
  }, [employees, currentEmployee]);

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const updateEmployee = useCallback(
    (id: string, updater: (emp: Employee) => Employee) => {
      setEmployees((prev) => prev.map((e) => (e.id === id ? updater(e) : e)));
    },
    []
  );

  const login = useCallback(
    (pin: string): Employee | null => {
      const emp = employees.find((e) => e.pin === pin);
      if (emp) {
        setCurrentEmployee(emp);
        return emp;
      }
      return null;
    },
    [employees]
  );

  const logout = useCallback(() => {
    setCurrentEmployee(null);
  }, []);

  const clockIn = useCallback(
    (id: string) => {
      updateEmployee(id, (emp) => ({
        ...addLogEntry(emp, "CLOCK_IN"),
        clockStatus: "CLOCKED_IN",
        clockedInSince: new Date().toISOString(),
        breakStartedAt: null,
      }));
    },
    [updateEmployee]
  );

  const clockOut = useCallback(
    (id: string) => {
      updateEmployee(id, (emp) => ({
        ...addLogEntry(emp, "CLOCK_OUT"),
        clockStatus: "CLOCKED_OUT",
        clockedInSince: null,
        breakStartedAt: null,
      }));
    },
    [updateEmployee]
  );

  const startBreak = useCallback(
    (id: string) => {
      updateEmployee(id, (emp) => ({
        ...addLogEntry(emp, "START_BREAK"),
        clockStatus: "ON_BREAK",
        breakStartedAt: new Date().toISOString(),
      }));
    },
    [updateEmployee]
  );

  const endBreak = useCallback(
    (id: string) => {
      updateEmployee(id, (emp) => ({
        ...addLogEntry(emp, "END_BREAK"),
        clockStatus: "CLOCKED_IN",
        breakStartedAt: null,
      }));
    },
    [updateEmployee]
  );

  const getClockedInEmployees = useCallback(() => {
    return employees.filter((e) => e.clockStatus !== "CLOCKED_OUT");
  }, [employees]);

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        currentEmployee,
        currentTime,
        login,
        logout,
        clockIn,
        clockOut,
        startBreak,
        endBreak,
        getClockedInEmployees,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployee() {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error("useEmployee must be used within an EmployeeProvider");
  }
  return context;
}
