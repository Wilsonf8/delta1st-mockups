"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/lib/types";

type OrderCardProps = {
  order: Order;
};

export function OrderCard({ order }: OrderCardProps) {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(order.amount);

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm">{order.transactionNumber}</span>
          <Badge
            variant={order.status === "OPEN" ? "default" : "secondary"}
            className={
              order.status === "OPEN"
                ? "bg-pos-green hover:bg-pos-green-dark text-white"
                : ""
            }
          >
            {order.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-bold">{formattedAmount}</p>
        <p className="text-sm text-muted-foreground">{order.customerName}</p>
      </CardContent>
    </Card>
  );
}
