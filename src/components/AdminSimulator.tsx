import React, { useState } from "react";
import { CoffeeBranch, SimulatedOrder } from "../types";
import { 
  Bell, Volume2, Shield, Settings, Table, Check, Send, Sparkles, 
  MapPin, ShoppingBag, CheckSquare, Award, PlayCircle, BarChart3, TrendingUp
} from "lucide-react";

interface AdminSimulatorProps {
  activeBranch: CoffeeBranch;
  orders: SimulatedOrder[];
  updateOrderStatus: (id: string, nextStatus: SimulatedOrder["status"]) => void;
  activeOrder: SimulatedOrder | null;
}

export interface SubscriptionTariff {
  id: string;
  name: string;
  priceKZT: number;
  cupLimit: number;
  benefits: string;
}

export default function AdminSimulator({ 
  activeBranch, 
  orders, 
  updateOrderStatus, 
  activeOrder 
}: AdminSimulatorProps) {
  // Toggle between barista terminal ('barista') or franchise stats ('superadmin')
  const [roleMode, setRoleMode] = useState<"barista" | "superadmin">("barista");
  
  // Custom interactive sound alert state
  const [incomingSound, setIncomingSound] = useState(false);
  const [verificationCodeInput, setVerificationCodeInput] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("");

  const [tariffs, setTariffs] = useState<SubscriptionTariff[]>([
    { id: "sub-standard", name: "Standard Абонемент", priceKZT: 15000, cupLimit: 15, benefits: "Чашка классического кофе в день" },
    { id: "sub-silver", name: "Silver Абонемент", priceKZT: 24000, cupLimit: 30, benefits: "Альтернатива и классика без доплаты" },
    { id: "sub-gold", name: "Gold Премиум", priceKZT: 35000, cupLimit: 45, benefits: "Любой кофе + спешл десерты без лимитов" }
  ]);

  const handleSoundAlert = () => {
    setIncomingSound(true);
    setTimeout(() => setIncomingSound(false), 2000);
  };

  const activeOrdersForThisPoint = orders.filter(
    o => o.branchName === activeBranch.name && o.status !== "delivered"
  );

  const handleVerifyQR = () => {
    const matchedOrder = orders.find(o => o.pickupCode === verificationCodeInput);
    if (matchedOrder) {
      updateOrderStatus(matchedOrder.id, "delivered");
      setVerificationStatus(`Успешно! Заказ ${matchedOrder.id} выдан клиенту.`);
      setVerificationCodeInput("");
    } else {
      setVerificationStatus("Код не найден. Попробуйте ввести код с экрана смартфона.");
    }
    setTimeout(() => setVerificationStatus(""), 4000);
  };

  const handleUpdateTariffPrice = (id: string, delta: number) => {
    setTariffs(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, priceKZT: Math.max(5000, t.priceKZT + delta) };
      }
      return t;
    }));
  };

  return (
    <div className="bg-[#141417] border border-[#2A2A2E] rounded-3xl p-6 shadow-sm h-full flex flex-col justify-between">
      
      {/* Header and Toggle Dashboard Roles */}
      <div className="space-y-4 pb-4 border-b border-[#2A2A2E]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-[#D4A373]/10 text-[#D4A373] rounded-xl border border-[#D4A373]/20">
              <Shield className="w-5 h-5 text-[#D4A373]" />
            </span>
            <div className="text-left">
              <h3 className="text-base font-bold text-white font-sans">
                Панель Управления CoffeeBoom
              </h3>
              <p className="text-xs text-[#8A8A8E]">
                Филиал: <strong className="text-[#D4A373] font-bold">{activeBranch.name}</strong>
              </p>
            </div>
          </div>

          <div className="flex bg-[#0A0A0B] p-0.5 rounded-lg text-xs font-semibold self-start sm:self-auto border border-[#2A2A2E]">
            <button
              onClick={() => setRoleMode("barista")}
              className={`px-4 py-1.5 rounded-md transition cursor-pointer ${
                roleMode === "barista" ? "bg-[#D4A373] text-black shadow-sm" : "text-[#8A8A8E] hover:text-white"
              }`}
            >
              Планшет Бариста (Точка)
            </button>
            <button
              onClick={() => setRoleMode("superadmin")}
              className={`px-4 py-1.5 rounded-md transition cursor-pointer ${
                roleMode === "superadmin" ? "bg-[#D4A373] text-black shadow-sm" : "text-[#8A8A8E] hover:text-white"
              }`}
            >
              Суперадмин (Франшиза)
            </button>
          </div>
        </div>

        {/* Info alerts */}
        {roleMode === "barista" && (
          <div className="bg-[#101012] px-4 py-2.5 rounded-xl border border-[#2A2A2E] flex items-center justify-between text-xs text-[#8A8A8E]">
            <span className="flex items-center gap-1.5">
              <Volume2 className={`w-4 h-4 text-[#D4A373] ${incomingSound ? "animate-bounce" : ""}`} />
              Тест звукового оповещения планшета (звонок при заказе):
            </span>
            <button
              onClick={handleSoundAlert}
              className="px-2.5 py-1 bg-black hover:bg-[#1c1c1e] rounded border border-[#2A2A2E] text-[10px] font-bold font-mono text-[#D4A373] transition"
            >
              {incomingSound ? "🔊 ЗВОНОК..." : "▶ ТЕСТ ЗВУКА"}
            </button>
          </div>
        )}
      </div>

      {/* VIEW A: BARISTA TERMINAL */}
      {roleMode === "barista" && (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 mt-4 items-stretch">
          
          {/* Live Queue list */}
          <div className="md:col-span-7 space-y-3">
            <h4 className="text-xs font-mono uppercase text-[#8A8A8E] tracking-wider font-bold text-left">
              Активная очередь заказов ({activeOrdersForThisPoint.length})
            </h4>

            {activeOrdersForThisPoint.length === 0 ? (
              <div className="border border-dashed border-[#2A2A2E] p-6 text-center text-xs text-[#8A8A8E] rounded-2xl bg-[#101012]">
                <ShoppingBag className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                Очередь филиала пуста. Сделайте заказ на симуляторе смартфона слева!
              </div>
            ) : (
              <div className="space-y-3.5 max-h-[340px] overflow-y-auto pr-1">
                {activeOrdersForThisPoint.map(order => (
                  <div 
                    key={order.id} 
                    className={`p-4 border rounded-2xl text-left relative shadow-xs transition ${
                      order.status === "new" ? "border-[#D4A373] bg-[#D4A373]/10" : "border-[#2A2A2E] bg-[#101012]"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-mono text-xs font-bold text-white block">{order.id}</span>
                        <span className="text-[10px] text-[#8A8A8E] font-medium block">Время приема: {order.timestamp}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs font-bold text-[#D4A373]">{order.paymentMethod}</span>
                        <span className="block font-mono text-xs font-semibold text-white">{order.totalPrice > 0 ? `${order.totalPrice} ₸` : "Списание подписки"}</span>
                      </div>
                    </div>

                    <div className="space-y-1 bg-black/40 p-2 rounded-lg border border-[#2A2A2E] text-xs">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="font-medium text-white">{it.name} x{it.quantity}</span>
                          <span className="text-[10px] text-[#8A8A8E]">{it.options}</span>
                        </div>
                      ))}
                    </div>

                    {/* State Transitions button actions */}
                    <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-[#2A2A2E]">
                      <span className="text-[10px] text-[#8A8A8E] uppercase font-bold shrink-0">Статус: </span>
                      
                      <div className="flex-1 flex gap-1 justify-end">
                        {order.status === "new" && (
                          <button
                            onClick={() => updateOrderStatus(order.id, "accepted")}
                            className="px-2.5 py-1.5 bg-[#D4A373] hover:bg-[#c59868] text-black rounded-lg text-[10px] font-bold cursor-pointer"
                          >
                            Принять в работу
                          </button>
                        )}
                        {order.status === "accepted" && (
                          <button
                            onClick={() => updateOrderStatus(order.id, "preparing")}
                            className="px-2.5 py-1.5 bg-[#D4A373] hover:bg-[#c59868] text-black rounded-lg text-[10px] font-bold cursor-pointer"
                          >
                            Начать готовить
                          </button>
                        )}
                        {order.status === "preparing" && (
                          <button
                            onClick={() => updateOrderStatus(order.id, "ready")}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold animate-pulse cursor-pointer"
                          >
                            Готов к выдаче!
                          </button>
                        )}
                        {order.status === "ready" && (
                          <div className="text-[10px] bg-emerald-950/55 text-emerald-400 border border-emerald-900 font-bold p-1 rounded">
                            Ожидает QR на кассе
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick QR Validation Scanner Section */}
          <div className="md:col-span-5 space-y-4 text-left">
            <div className="bg-[#101012] p-5 rounded-2xl border border-[#2A2A2E] space-y-3">
              <span className="text-[9px] uppercase font-mono text-[#8A8A8E] block font-bold">Сканирование QR Клиента</span>
              <h4 className="text-xs font-bold leading-tight text-[#D4A373]">Генератор и валидатор QR чеков</h4>
              <p className="text-[10px] text-[#8A8A8E]">
                Имитирует считывание QR-кода со смартфона клиента лазерным сканером кассы или фронтальной камерой планшета.
              </p>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Введите 4-значный код клиента"
                  value={verificationCodeInput}
                  onChange={(e) => setVerificationCodeInput(e.target.value)}
                  className="w-full text-center tracking-[0.2em] font-mono text-sm border border-[#2A2A2E] p-2 bg-black text-[#D4A373] rounded-lg focus:outline-none focus:border-[#D4A373]"
                />
                <button
                  onClick={handleVerifyQR}
                  className="w-full py-2 bg-[#D4A373] text-black text-xs font-bold rounded-lg hover:bg-[#c59868] transition cursor-pointer"
                >
                  Проверить и закрыть заказ
                </button>
              </div>

              {verificationStatus && (
                <div className={`text-center p-2 rounded-lg text-[11px] font-semibold ${
                  verificationStatus.includes("Успешно") ? "bg-emerald-950/40 border border-emerald-900 text-emerald-400" : "bg-rose-950/40 border border-rose-900 text-rose-400"
                }`}>
                  {verificationStatus}
                </div>
              )}
            </div>

            <div className="bg-[#D4A373]/5 p-4 rounded-2xl border border-[#D4A373]/20 text-[11px] text-[#8A8A8E]">
              <span className="font-bold flex items-center gap-1.5 mb-1 text-xs text-white">
                <Sparkles className="w-3.5 h-3.5 text-[#D4A373] shrink-0" />
                Логика антифрода подписок
              </span>
              Если гость заказал напиток по подписке Gold/Silver, бариста может просканировать его только 1 раз в 45 минут; система автоматически заблокирует повторные запросы по данному ID. При неявке клиента лимит списывается безвозвратно.
            </div>
          </div>

        </div>
      )}

      {/* VIEW B: SUPERADMIN PORTAL AND SUBSCRIPTIONS */}
      {roleMode === "superadmin" && (
        <div className="flex-1 mt-4 space-y-6 text-left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Quick Metrics Cards */}
            <div className="bg-[#101012] border border-[#2A2A2E] p-4 rounded-2xl shadow-xs">
              <span className="text-[10px] text-[#8A8A8E] font-mono block">ПОДКЛЮЧЕНО ТОЧЕК</span>
              <div className="text-2xl font-bold mt-1 text-white">42 кофейни</div>
              <span className="text-[9px] text-emerald-400 font-semibold block mt-1">▲ +3 за последний месяц</span>
            </div>
            <div className="bg-[#101012] border border-[#2A2A2E] p-4 rounded-2xl shadow-xs">
              <span className="text-[10px] text-[#8A8A8E] font-mono block">КЛИЕНТСКАЯ БАЗА</span>
              <div className="text-2xl font-bold mt-1 text-white">24 190 пользователей</div>
              <span className="text-[9px] text-emerald-400 font-semibold block mt-1">▲ Конверсия визита 78%</span>
            </div>
            <div className="bg-[#101012] border border-[#2A2A2E] p-4 rounded-2xl shadow-xs">
              <span className="text-[10px] text-[#8A8A8E] font-mono block">АКТИВНЫЕ ПОДПИСКИ</span>
              <div className="text-2xl font-bold mt-1 text-white">1 428 пакетов</div>
              <span className="text-[9px] text-[#D4A373] font-semibold block mt-1">● Выручка с абонементов: 4.2M ₸</span>
            </div>
          </div>

          {/* Interactive Tariffs Controls */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold font-mono tracking-wider uppercase text-[#8A8A8E]">
              Глобальное управление тарифами подписок
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tariffs.map(tariff => (
                <div key={tariff.id} className="p-4 border border-[#2A2A2E] rounded-2xl bg-[#101012] space-y-4 shadow-xs relative">
                  <div className="space-y-1">
                    <span className="inline-block px-2 py-0.5 rounded bg-[#D4A373]/10 border border-[#D4A373]/20 text-[#D4A373] text-[10px] font-bold">
                      {tariff.cupLimit} чашек / 30 дн
                    </span>
                    <h5 className="font-bold text-sm text-white">{tariff.name}</h5>
                    <p className="text-[10px] text-[#8A8A8E] leading-snug">{tariff.benefits}</p>
                  </div>

                  <hr className="border-[#2A2A2E]" />

                  {/* Interactive adjustments to value simulating global changes */}
                  <div className="flex justify-between items-center bg-black/40 p-2 rounded-xl border border-[#2A2A2E]">
                    <div>
                      <span className="text-[9px] text-[#8A8A8E] uppercase block">Стоимость абонемента</span>
                      <span className="font-bold font-mono text-xs text-white">{tariff.priceKZT} ₸</span>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleUpdateTariffPrice(tariff.id, -1000)}
                        className="p-1.5 bg-[#101012] border border-[#2A2A2E] hover:bg-[#1C1C20] rounded text-xs leading-none font-bold text-[#D4A373] cursor-pointer"
                      >
                        -1К
                      </button>
                      <button
                        onClick={() => handleUpdateTariffPrice(tariff.id, 1000)}
                        className="p-1.5 bg-[#101012] border border-[#2A2A2E] hover:bg-[#1C1C20] rounded text-xs leading-none font-bold text-[#D4A373] cursor-pointer"
                      >
                        +1К
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#D4A373]/5 p-4 rounded-2xl border border-dashed border-[#D4A373]/20 flex items-center gap-3">
            <Settings className="w-5 h-5 text-[#D4A373] shrink-0" />
            <p className="text-xs text-[#8A8A8E]">
              <strong>Масштабируемый модуль франчайзинга:</strong> Изменение тарифов подписок в кабинете автоматически транслируется во всю сеть CoffeeBoom, с лету обновляя кассовые интерфейсы и цены в мобильном приложении.
            </p>
          </div>
        </div>
      )}

      {/* Shared Footer statistic summary */}
      <div className="mt-6 pt-4 border-t border-[#2A2A2E] text-[10px] text-[#8A8A8E] flex justify-between items-center text-left">
        <span>Экосистема CoffeeBoom ТКП</span>
        <span>Разработчик: Заруцкий Е.О. © 2026</span>
      </div>
    </div>
  );
}
