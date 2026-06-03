"use client";

import { useEmployee } from "@/context/employee-context";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

type NameBadgeProps = {
  onClick: () => void;
};

export function NameBadge({ onClick }: NameBadgeProps) {
  const { currentEmployee } = useEmployee();

  if (!currentEmployee) return null;

  return (
    <button onClick={onClick} className="flex items-center gap-2">
      <Badge
        variant="secondary"
        className="bg-white/20 text-white hover:bg-white/30 cursor-pointer px-3 py-1 text-sm font-medium"
      >
        <User className="w-4 h-4 mr-1" />
        {currentEmployee.displayName}
      </Badge>
    </button>
  );
}
