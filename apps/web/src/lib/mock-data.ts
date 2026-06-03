import { Employee, Order } from "./types";

const now = new Date().toISOString();

export const initialEmployees: Employee[] = [
  {
    id: "emp-1",
    pin: "111111",
    firstName: "John",
    lastInitial: "W",
    displayName: "John W.",
    clockStatus: "CLOCKED_OUT",
    clockedInSince: null,
    breakStartedAt: null,
    timeLog: [],
  },
  {
    id: "emp-2",
    pin: "222222",
    firstName: "Jane",
    lastInitial: "D",
    displayName: "Jane D.",
    clockStatus: "CLOCKED_OUT",
    clockedInSince: null,
    breakStartedAt: null,
    timeLog: [],
  },
  {
    id: "emp-3",
    pin: "333333",
    firstName: "Mike",
    lastInitial: "S",
    displayName: "Mike S.",
    clockStatus: "CLOCKED_OUT",
    clockedInSince: null,
    breakStartedAt: null,
    timeLog: [],
  },
];

export const mockOrders: Order[] = [
  {
    id: "ord-1",
    transactionNumber: "TXN-001",
    status: "OPEN",
    amount: 24.99,
    customerName: "Alice Johnson",
    date: now,
  },
  {
    id: "ord-2",
    transactionNumber: "TXN-002",
    status: "OPEN",
    amount: 57.5,
    customerName: "Bob Smith",
    date: now,
  },
  {
    id: "ord-3",
    transactionNumber: "TXN-003",
    status: "OPEN",
    amount: 12.0,
    customerName: "Carol Williams",
    date: now,
  },
];
