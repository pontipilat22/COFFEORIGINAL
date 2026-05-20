import React from "react";
import { Coffee, Award, Calendar, FileText, CheckCircle2, Server, Smartphone, Zap } from "lucide-react";

interface SlideIntroProps {
  onNext: () => void;
}

export default function SlideIntro({ onNext }: SlideIntroProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch h-full">
      {/* Visual Title Brand Section */}
      <div className="lg:col-span-7 bg-[#101012] text-[#E0E0E0] p-8 md:p-12 rounded-3xl flex flex-col justify-between relative overflow-hidden shadow-xl border border-[#2A2A2E]">
        {/* Abstract background blobs for premium aesthetic */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4A373] opacity-5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-[#D4A373] opacity-5 rounded-full blur-3xl pointer-events-none"></div>

        <div>
          {/* Header Tag */}
          <div className="inline-flex items-center gap-2 bg-[#D4A373]/10 border border-[#D4A373]/20 text-[#D4A373] px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-8">
            <span className="w-2 h-2 bg-[#D4A373] rounded-full animate-pulse"></span>
            Технико-Коммерческое Предложение
          </div>

          {/* Core Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-light tracking-tight leading-tight mb-6 text-white uppercase">
            Экосистема <br />
            <span className="text-[#D4A373] font-normal">COFFEEBOOM</span>
          </h1>
          
          <p className="text-[#8A8A8E] text-base md:text-lg max-w-xl leading-relaxed mb-8">
            Комплексная разработка современной мобильной платформы заказа под ключ, партнерской панели франчайзи, суперадминистратора и надежной облачной серверной инфраструктуры.
          </p>

          {/* Quick facts list */}
          <div className="grid grid-cols-2 gap-4 max-w-md pt-4 border-t border-[#2A2A2E]">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#D4A373] shrink-0" />
              <div>
                <span className="block text-xs text-[#8A8A8E]">Дата разработки</span>
                <span className="text-sm font-medium text-white">19 мая 2026 г.</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#D4A373] shrink-0" />
              <div>
                <span className="block text-xs text-[#8A8A8E]">Инициатор ТКП</span>
                <span className="text-sm font-medium text-white">Заруцкий Е.О.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info & CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-12 pt-6 border-t border-[#2A2A2E]">
          <div>
            <span className="inline-block bg-[#1A1A1E] text-[#D4A373] border border-[#2A2A2E] text-xs px-3 py-1 rounded-sm font-mono mb-1 uppercase">
              СТАТУС ИЗДАНИЯ
            </span>
            <span className="block text-sm text-[#8A8A8E] font-medium">Черновик для согласования сторон</span>
          </div>

          <button
            onClick={onNext}
            className="w-full sm:w-auto px-8 py-4 bg-[#D4A373] hover:bg-[#c29262] text-black font-semibold text-sm rounded-xl transition duration-200 shadow-lg hover:shadow-xl active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            Изучить условия
            <Zap className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>

      {/* Highlights Checklist Sidebar */}
      <div className="lg:col-span-5 flex flex-col justify-between gap-6">
        {/* Deliverables summary widget */}
        <div className="bg-[#101012] p-6 rounded-3xl border border-[#2A2A2E] shadow-sm flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <Coffee className="w-5 h-5 text-[#D4A373]" />
              Что получает CoffeeBoom?
            </h3>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <Smartphone className="w-5 h-5 text-[#D4A373] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Мобильное приложение (iOS / Android)</h4>
                  <p className="text-xs text-[#8A8A8E] mt-0.5">Личный кабинет клиента, СМС-вход, адаптивное меню под конкретную точку через SDK 2ГИС, моментальная QR-выдача.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Server className="w-5 h-5 text-[#D4A373] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Серверная логика и база Supabase</h4>
                  <p className="text-xs text-[#8A8A8E] mt-0.5">Оптимизированная СМС-оповещения, интеграции Kaspi Pay / Freedom Pay. Бесшовная облачная защита от фрода по купонам.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Award className="w-5 h-5 text-[#D4A373] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Кабинет Франчайзи и Бариста</h4>
                  <p className="text-xs text-[#8A8A8E] mt-0.5">Прямое управление остатками (стоп-лист), редактирование цен в точках, планшет бариста для мгновенного звукового приема заказов.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#2A2A2E] bg-[#1A1A1E]/50 p-3.5 rounded-2xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <p className="text-xs text-[#8A8A8E] leading-tight">
              Разработка на базе <strong>Expo / React Native</strong> существенно ускоряет прохождение модерации в маркетах и экономит бюджет запуска на 40%.
            </p>
          </div>
        </div>

        {/* Developer stats widget */}
        <div className="bg-[#101012] border border-[#2A2A2E] p-6 rounded-3xl shadow-sm flex items-center justify-between">
          <div>
            <span className="block text-xs text-[#8A8A8E] uppercase font-mono tracking-wider">Генеральный Разработчик</span>
            <span className="block font-bold text-lg text-white mt-0.5">Заруцкий Е.О.</span>
            <span className="block text-xs text-[#8A8A8E] mt-0.5">Custom IT Solution Architect</span>
          </div>
          <div className="bg-[#1A1A1E] border border-[#2A2A2E] w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold text-[#D4A373]">
            ZE
          </div>
        </div>
      </div>
    </div>
  );
}
