"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useEmployee } from "@/context/employee-context";
import { OrdersHeader } from "@/components/orders-header";
import { OrderCard } from "@/components/order-card";
import { SideDrawer } from "@/components/side-drawer";
import { TimeclockModal } from "@/components/timeclock-modal";
import { mockOrders } from "@/lib/mock-data";

function OrdersContent() {
  const router = useRouter();
  const { currentEmployee } = useEmployee();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [timeclockOpen, setTimeclockOpen] = useState(false);
  const [timeclockVariant, setTimeclockVariant] = useState<
    "hamburger" | "nameBadge" | "pinEntry"
  >("nameBadge");
  const searchParams = useSearchParams();
  const handledTimeclockParam = useRef(false);

  // Auto-open timeclock modal when arriving from PIN entry while clocked out/on break
  useEffect(() => {
    if (
      !handledTimeclockParam.current &&
      searchParams.get("timeclock") === "pin" &&
      currentEmployee
    ) {
      handledTimeclockParam.current = true;
      router.replace("/orders");
      if (currentEmployee.clockStatus !== "CLOCKED_IN") {
        setTimeclockVariant("pinEntry");
        setTimeclockOpen(true);
      }
    }
  }, [searchParams, currentEmployee, router]);

  // Route guard
  useEffect(() => {
    if (!currentEmployee) {
      router.push("/");
    }
  }, [currentEmployee, router]);

  if (!currentEmployee) return null;

  const openOrders = mockOrders.filter((o) => o.status === "OPEN");
  const closedOrders = mockOrders.filter((o) => o.status === "CLOSED");

  const handleMenuClick = () => setDrawerOpen(true);

  const handleNameBadgeClick = () => {
    setTimeclockVariant("nameBadge");
    setTimeclockOpen(true);
  };

  const handleTimeclockFromDrawer = () => {
    setTimeclockVariant("hamburger");
    setTimeclockOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <OrdersHeader
        onMenuClick={handleMenuClick}
        onNameBadgeClick={handleNameBadgeClick}
      />

      <main className="flex-1 p-4">
        <Tabs defaultValue="open">
          <TabsList className="mb-4">
            <TabsTrigger value="open">OPEN</TabsTrigger>
            <TabsTrigger value="closed">CLOSED</TabsTrigger>
          </TabsList>

          <TabsContent value="open">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {openOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
            {openOrders.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No open orders.
              </p>
            )}
          </TabsContent>

          <TabsContent value="closed">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {closedOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
            {closedOrders.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No closed orders.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* FAB */}
      <Button
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 bg-pos-green hover:bg-pos-green-dark text-white shadow-lg"
        size="icon"
      >
        <Plus className="w-6 h-6" />
        <span className="sr-only">New Order</span>
      </Button>

      {/* Side Drawer */}
      <SideDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onTimeclockClick={handleTimeclockFromDrawer}
      />

      {/* Timeclock Modal */}
      <TimeclockModal
        open={timeclockOpen}
        onOpenChange={setTimeclockOpen}
        variant={timeclockVariant}
      />
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense>
      <OrdersContent />
    </Suspense>
  );
}
