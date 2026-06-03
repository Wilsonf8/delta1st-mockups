"use client";

import { Menu, Search, Filter, MoreVertical } from "lucide-react";
import { NameBadge } from "./name-badge";

type OrdersHeaderProps = {
  onMenuClick: () => void;
  onNameBadgeClick: () => void;
};

export function OrdersHeader({ onMenuClick, onNameBadgeClick }: OrdersHeaderProps) {
  return (
    <header className="bg-pos-green text-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-1 hover:bg-white/10 rounded-md transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">Orders</h1>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-white/10 rounded-md transition-colors">
          <Search className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-white/10 rounded-md transition-colors">
          <Filter className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-white/10 rounded-md transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
        <NameBadge onClick={onNameBadgeClick} />
      </div>
    </header>
  );
}
