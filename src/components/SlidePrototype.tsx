import React, { useState } from "react";
import MobileSimulator from "./MobileSimulator";
import AdminSimulator from "./AdminSimulator";
import { COFFEE_BRANCHES, CoffeeBranch, SimulatedOrder } from "../types";
import { Sparkles, HelpCircle, Phone, Award } from "lucide-react";

export default function SlidePrototype() {
  const [activeBranch, setActiveBranch] = useState<CoffeeBranch>(COFFEE_BRANCHES[0]);
  
  // Shared state of simulated active orders
  const [orders, setOrders] = useState<SimulatedOrder[]>([
    {
      id: "CB-7023",
      branchName: "CoffeeBoom Абая",
      items: [
        { name: "Капучино", quantity: 1, price: 850, options: "0.4л, Миндаль. молоко" }
      ],
      totalPrice: 1050,
      paymentMethod: "Kaspi Link",
      status: "delivered",
      pickupCode: "1098",
      timestamp: "10:15"
    },
    {
      id: "CB-8490",
      branchName: "CoffeeBoom Dostyk Plaza",
      items: [
        { name: "Латте Макиато", quantity: 1, price: 950, options: "0.3л, Кор. молоко, сироп" }
      ],
      totalPrice: 1050,
      paymentMethod: "Subscription Limit",
      status: "ready", // Active gold order waiting for pickup
      pickupCode: "2044",
      timestamp: "11:32"
    }
  ]);

  const [activeOrder, setActiveOrder] = useState<SimulatedOrder | null>(null);

  const addOrder = (newOrder: SimulatedOrder) => {
    setOrders(prev => [newOrder, ...prev]);
  };

  const updateOrderStatus = (orderId: string, nextStatus: SimulatedOrder["status"]) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updated = { ...o, status: nextStatus };
        // Sync with active customer device ticket if it's the current active client order
        if (activeOrder && activeOrder.id === orderId) {
          setActiveOrder(updated);
        }
        return updated;
      }
      return o;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-light text-white uppercase tracking-tight flex items-center gap-2">
            <span className="w-8 h-[1px] bg-[#D4A373]"></span>
            Интерактивный Прототип Системы
          </h2>
          <p className="text-sm text-[#8A8A8E]">
            Бесшовная синхронизация: размещайте заказы внутри Мобильного телефона слева, и они мгновенно появятся на Планшете Бариста справа!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Customer Mobile Device Column */}
        <div className="lg:col-span-12 xl:col-span-5 bg-[#101012] border border-[#2A2A2E] p-6 rounded-3xl flex flex-col items-center justify-center relative shadow-sm">
          <div className="absolute top-3 left-3 bg-[#D4A373]/10 text-[#D4A373] text-[10px] font-bold px-2 py-0.5 rounded border border-[#D4A373]/30 uppercase font-mono">
            Экран гостя (iOS / Android)
          </div>
          
          <MobileSimulator
            activeBranch={activeBranch}
            setActiveBranch={setActiveBranch}
            orders={orders}
            addOrder={addOrder}
            activeOrder={activeOrder}
            setActiveOrder={setActiveOrder}
          />
        </div>

        {/* Cafe Point tablet/console Column */}
        <div className="lg:col-span-12 xl:col-span-7 flex flex-col justify-between">
          <AdminSimulator
            activeBranch={activeBranch}
            orders={orders}
            updateOrderStatus={updateOrderStatus}
            activeOrder={activeOrder}
          />
        </div>

      </div>
    </div>
  );
}
