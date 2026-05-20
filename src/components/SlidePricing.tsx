import React, { useState } from "react";
import { INITIAL_PHASES, ProposalPhase } from "../types";
import { HelpCircle, RefreshCw, AlertCircle, TrendingUp, CheckCircle, Clock, Award, DollarSign } from "lucide-react";

export default function SlidePricing() {
  const [phases, setPhases] = useState<ProposalPhase[]>(INITIAL_PHASES);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [expressDelivery, setExpressDelivery] = useState<boolean>(false);

  // Helper to format currency
  const formatKZT = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "KZT",
      maximumFractionDigits: 0
    }).format(amount).replace("KZT", "₸");
  };

  const handleUpdateWeeks = (id: number, delta: number) => {
    setPhases(prev => prev.map(p => {
      if (p.id === id) {
        // Enforce safe limits according to the proposal ranges
        let minW = 1;
        let maxW = 15;
        if (id === 1) { minW = 2; maxW = 5; }
        if (id === 2) { minW = 6; maxW = 12; }
        if (id === 3) { minW = 5; maxW = 10; }
        if (id === 4) { minW = 1; maxW = 4; }
        if (id === 5) { minW = 1; maxW = 2; }
        
        const nextWeeks = Math.max(minW, Math.min(maxW, p.durationWeeks + delta));
        
        // Calculate dynamic cost proportional to weeks, keeping the base rate
        const basePhase = INITIAL_PHASES.find(bp => bp.id === id)!;
        const ratePerWeek = basePhase.costTenge / basePhase.durationWeeks;
        const nextCost = Math.round(ratePerWeek * nextWeeks);

        return {
          ...p,
          durationWeeks: nextWeeks,
          costTenge: nextCost
        };
      }
      return p;
    }));
  };

  const handleReset = () => {
    setPhases(INITIAL_PHASES);
    setDiscountPercent(0);
    setExpressDelivery(false);
  };

  // Calculations
  const totalWeeks = phases.reduce((acc, p) => acc + p.durationWeeks, 0);
  const rawTotalCost = phases.reduce((acc, p) => acc + p.costTenge, 0);
  
  // Apply express multiplier if selected (+20% cost but speeds up presentation)
  const expressMultiplier = expressDelivery ? 1.25 : 1.0;
  const finalTotalCost = Math.round((rawTotalCost * (1 - discountPercent / 100)) * expressMultiplier);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-light text-white uppercase tracking-tight flex items-center gap-2">
            <span className="w-8 h-[1px] bg-[#D4A373]"></span>
            Стоимость и Сметный План
          </h2>
          <p className="text-sm text-[#8A8A8E]">
            Интерактивный симулятор бюджета и графиков. Используйте кнопки для калибровки и моделирования сроков работ.
          </p>
        </div>
        
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A1A1E] hover:bg-[#2A2A2E] text-[#8A8A8E] hover:text-white border border-[#2A2A2E] text-xs font-semibold rounded-lg transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Сбросить к черновику ТКП
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Main interactive Phases Table */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="overflow-hidden bg-[#101012] border border-[#2A2A2E] rounded-2xl shadow-sm">
            <div className="p-4 bg-[#1A1A1E] border-b border-[#2A2A2E] grid grid-cols-12 gap-2 text-xs font-mono font-bold text-[#8A8A8E] uppercase">
              <span className="col-span-5 md:col-span-6">Этап работ</span>
              <span className="col-span-4 md:col-span-3 text-center">Длительность</span>
              <span className="col-span-3 md:col-span-3 text-right">Стоимость</span>
            </div>
            
            <div className="divide-y divide-[#2A2A2E]">
              {phases.map(p => {
                const isModified = p.durationWeeks !== INITIAL_PHASES.find(bp => bp.id === p.id)?.durationWeeks;
                return (
                  <div key={p.id} className="p-4 grid grid-cols-12 gap-2 items-center hover:bg-[#1A1A1E]/40 transition">
                    {/* Phase details */}
                    <div className="col-span-5 md:col-span-6 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-[#D4A373] bg-[#D4A373]/10 rounded-full">
                          {p.id}
                        </span>
                        <h4 className="text-sm font-semibold text-white block leading-tight">
                          {p.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-[#8A8A8E] leading-relaxed max-w-sm line-clamp-1 hover:line-clamp-none transition-all cursor-help" title={p.description}>
                        Конечный результат: {p.result}
                      </p>
                    </div>

                    {/* Weeks controller */}
                    <div className="col-span-4 md:col-span-3 flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleUpdateWeeks(p.id, -1)}
                        className="w-7 h-7 flex items-center justify-center text-xs font-bold text-[#8A8A8E] bg-[#1A1A1E] hover:bg-[#2A2A2E] rounded-lg transition cursor-pointer"
                      >
                        -
                      </button>
                      <div className="text-center min-w-16">
                        <span className="text-sm font-bold text-white block">
                          {p.durationWeeks} {p.durationWeeks === 1 ? 'неделя' : [2,3,4].includes(p.durationWeeks % 10) && ![12,13,14].includes(p.durationWeeks) ? 'недели' : 'недель'}
                        </span>
                        {isModified && (
                          <span className="text-[9px] text-[#D4A373] bg-[#D4A373]/10 px-1 rounded font-medium">изменено</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleUpdateWeeks(p.id, 1)}
                        className="w-7 h-7 flex items-center justify-center text-xs font-bold text-[#8A8A8E] bg-[#1A1A1E] hover:bg-[#2A2A2E] rounded-lg transition cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    {/* Cost */}
                    <div className="col-span-3 md:col-span-3 text-right">
                      <span className="text-sm font-bold font-mono text-white">
                        {formatKZT(p.costTenge * (expressDelivery ? 1.25 : 1))}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Explanatory Sandbox Terms Tip */}
          <div className="bg-[#101012] border border-[#2A2A2E] rounded-xl p-4 flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-[#D4A373] shrink-0 mt-0.5" />
            <div className="text-xs text-[#8A8A8E]">
              <span className="font-bold text-white block mb-1 uppercase tracking-wide">Особенности формирования сметы</span>
              Все этапы взаимосвязаны. Редактируя длительность недели разработки мобильного приложения, сметный модуль пропорционально корректирует затраты на инфраструктурный инжиниринг. Оригинальный сметный черновик составляет <strong>17–19 недель</strong> работ по ставке <strong>6 500 000 ₸</strong> под ключ со сдачей в App Store/Google Play.
            </div>
          </div>
        </div>

        {/* Dynamic Recalculator Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#101012] text-[#E0E0E0] p-6 border border-[#2A2A2E] rounded-3xl space-y-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4A373] opacity-5 rounded-full blur-3xl pointer-events-none"></div>

            <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono border-b border-[#2A2A2E] pb-3">
              Итоговый расчет ТКП
            </h3>

            {/* Calculations metrics */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#8A8A8E] flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Суммарное время
                </span>
                <span className="font-bold text-white">
                  {totalWeeks} {totalWeeks % 10 === 1 && totalWeeks !== 11 ? 'неделя' : [2,3,4].includes(totalWeeks % 10) && ![12,13,14].includes(totalWeeks) ? 'недели' : 'недель'}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-[#8A8A8E] flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> Готовая экосистема
                </span>
                <span className="font-semibold text-emerald-400">ПОЛНЫЙ КЛЮЧ</span>
              </div>

              <hr className="border-[#2A2A2E]" />

              <div className="space-y-2">
                <span className="text-xs text-[#8A8A8E] uppercase block font-mono">Коррекция условий</span>
                
                {/* Promo/Discount slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#D4A373]">Партнерская скидка франшизы</span>
                    <span>{discountPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="5"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full accent-[#D4A373] bg-[#1A1A1E] h-1.5 rounded-lg cursor-pointer"
                  />
                  <span className="text-[10px] text-[#8A8A8E] flex justify-between">
                    <span>0% (Базовая)</span>
                    <span>15% (Спец-предл)</span>
                  </span>
                </div>

                {/* Speed delivery checkbox */}
                <label className="flex items-center gap-2 pt-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={expressDelivery}
                    onChange={(e) => setExpressDelivery(e.target.checked)}
                    className="rounded border-gray-600 accent-[#D4A373] text-[#D4A373] focus:ring-0 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="block font-semibold text-amber-200">Express запуск (+25% к стоимости)</span>
                    <span className="text-[10px] text-[#8A8A8E]">Приоритизация команды, ускорение на 3 недели</span>
                  </div>
                </label>
              </div>

              <hr className="border-[#2A2A2E]" />

              {/* Total display with rich gold color selection */}
              <div>
                <span className="text-xs text-[#8A8A8E] uppercase block font-mono">Общая стоимость внедрения</span>
                <div className="text-3xl font-bold font-mono text-[#D4A373] mt-1">
                  {formatKZT(finalTotalCost)}
                </div>
                <p className="text-[10px] text-[#8A8A8E] mt-1 leading-snug">
                  *Включает налог и НДС. Оплата производится поэтапно (5 траншей согласно закрытию сданных спринтов).
                </p>
              </div>
            </div>
            
            <div className="bg-[#D4A373]/10 border border-[#D4A373]/20 p-3.5 rounded-2xl flex items-center justify-between text-xs text-[#D4A373]">
              <span>Ставка часа команды</span>
              <span className="font-mono font-bold">~14 500 ₸ / час</span>
            </div>
          </div>

          <div className="bg-[#141417] border border-[#2A2A2E] p-5 rounded-3xl space-y-4 shadow-sm">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#D4A373]" />
              График платежей
            </h4>
            
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0"></span>
                <div className="flex-1 flex justify-between font-semibold">
                  <span className="text-[#8A8A8E]">1-й аванс (Дизайн)</span>
                  <span className="font-mono text-white">15% сметы</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shrink-0"></span>
                <div className="flex-1 flex justify-between font-semibold">
                  <span className="text-[#8A8A8E]">Транш 2 (Мобильный фронт)</span>
                  <span className="font-mono text-white">45% сметы</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                <div className="flex-1 flex justify-between font-semibold">
                  <span className="text-[#8A8A8E]">Транш 3 (Бэкенд, БД и Админка)</span>
                  <span className="font-mono text-white">30% сметы</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                <div className="flex-1 flex justify-between font-semibold">
                  <span className="text-[#8A8A8E]">Финальный расчет (Стор)</span>
                  <span className="font-mono text-white">10% сметы</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
