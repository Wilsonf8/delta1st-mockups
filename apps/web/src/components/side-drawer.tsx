"use client";

import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEmployee } from "@/context/employee-context";
import {
  LayoutDashboard,
  ShoppingCart,
  UsersRound,
  Settings,
  LogOut,
  Clock,
} from "lucide-react";

type SideDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTimeclockClick: () => void;
};

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", disabled: true },
  { icon: ShoppingCart, label: "Orders", disabled: false },
  { icon: UsersRound, label: "Customers", disabled: true },
  { icon: Settings, label: "Settings", disabled: true },
];

export function SideDrawer({
  open,
  onOpenChange,
  onTimeclockClick,
}: SideDrawerProps) {
  const router = useRouter();
  const { logout } = useEmployee();

  const handleSignOut = () => {
    onOpenChange(false);
    logout();
    router.push("/");
  };

  const handleTimeclock = () => {
    onOpenChange(false);
    onTimeclockClick();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-pos-green font-bold">
            Crest POS
          </SheetTitle>
        </SheetHeader>

        <nav className="flex-1 mt-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.label}>
                <button
                  disabled={item.disabled}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  onClick={() => {
                    if (item.label === "Orders") {
                      onOpenChange(false);
                      router.push("/orders");
                    }
                  }}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <Separator />

        <div className="space-y-2 pb-4 pt-2">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleTimeclock}
          >
            <Clock className="w-5 h-5" />
            Timeclock
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
