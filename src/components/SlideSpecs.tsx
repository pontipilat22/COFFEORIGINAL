import React, { useState } from "react";
import { Smartphone, Database, MapPin, CreditCard, Send, Check } from "lucide-react";

export default function SlideSpecs() {
  const [activeTab, setActiveTab] = useState<"client" | "backend" | "maps" | "payments">("client");

  const techStack = {
    client: {
      title: "Клиентский софт: React Native (Expo)",
      subtitle: "Единая кодовая база для быстрого развертывания",
      icon: <Smartphone className="w-5 h-5 text-amber-600" />,
      bullets: [
        "Expo Application Framework: Бесшовная компиляция нативных модулей Swift/Kotlin.",
        "Кроссплатформенность: Экономия бюджета в 1.8–2 раза по сравнению с раздельной нативной Swift/Kotlin разработкой.",
        "Горячее обновление пакетов (OTA updates): Исправление мелких опечаток в меню или интерфейсе в обход недельной модерации App Store/Google Play.",
        "Expo Push Notifications: Встроенная шина для пуш-уведомлений бариста и клиентов на кассе (трансляция смены статуса 'Готовится ➔ Готов')."
      ],
      details: "Для CoffeeBoom это означает молниеносную реакцию приложения и плавную нативную прокрутку каруселей кофе с десертами даже на бюджетных Android смартфонах."
    },
    backend: {
      title: "Бэкенд и База Данных: Supabase / PostgreSQL",
      subtitle: "Сверхнадежная СУБД с Real-time синхронизацией",
      icon: <Database className="w-5 h-5 text-emerald-600" />,
      bullets: [
        "Управляемый PostgreSQL: Транзакционная целостность заказов, безопасные ACID-транзакции оплаты.",
        "Real-time subscriptions: Мгновенный сигнал на планшете бариста при отправке заказа клиентом.",
        "Row Level Security (RLS): Строгое разграничение прав доступа франчайзи внутри базы данных. Администратор кофейни А не видит выручку филиала Б.",
        "Supabase Auth: Хранение сессий пользователей, безопасный токен авторизации после СМС проверки."
      ],
      details: "Supabase позволяет отказаться от долгого ручного поднятия серверных сокетов. Мы сразу имеем готовые, стабильные инструменты синхронизации с защитой корпоративного уровня."
    },
    maps: {
      title: "Картография и Локатор: 2ГИС Mobile SDK",
      subtitle: "Максимальная точность карт для рынка Казахстана",
      icon: <MapPin className="w-5 h-5 text-indigo-600" />,
      bullets: [
        "Оптимальный выбор для РК: Детализация адресов и подъездов в Бишкеке, Алматы, Астане на уровне выше зарубежных аналогов.",
        "Ближайший филиал по GPS: Автоматический пеленг геопозиции клиента, расчет дистанции до близлежащей кофейни CoffeeBoom.",
        "Ручной выбор филиала: Удобная интерактивная карта с фильтрами по времени работы и наличию парковки.",
        "Динамические цены: Перестроение прайс-листа и стоп-листов ингредиентов в корзине в зависимости от выбранного филиала."
      ],
      details: "Интеграция 2ГИС Mobile SDK дает нативный плавный скроллинг карты внутри приложения без урезания графических ядер, в отличие от простых webview-карт."
    },
    payments: {
      title: "Платёжные Шлюзы и Авторизация",
      subtitle: "Deep-linking в Kaspi и поддержка эквайрингов Visa/MC",
      icon: <CreditCard className="w-5 h-5 text-purple-600" />,
      bullets: [
        "Kaspi Pay Integration: Специфический Deep Link переход в Kaspi.kz по уникальной платежной сигнатуре. Клиент оплачивает в родном приложении Kaspi и возвращается обратно.",
        "Freedom Pay / Cloudpayments: Агрегированные шлюзы приема Visa/Mastercard (Apple Pay, Google Pay) со встроенным подтверждением 3D Secure.",
        "Оплата на кассе / Списание подписки: Мгновенное гашение лимитов абонемента с проверкой антифрода (1 раз в 45 минут на напиток).",
        "SMS-Gate RK: Стыковка с СМС-центром Казахстана для авторизации. Код верификации передается в защищенном HTTPS-пакете за доли секунды."
      ],
      details: "Бесшовный Kaspi эквайринг по ссылкам позволяет экономить до 1.5% комиссии на транзакциях по сравнению со стандартными картами."
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-light text-white uppercase tracking-tight flex items-center gap-2">
          <span className="w-8 h-[1px] bg-[#D4A373]"></span>
          Технологический Стек и Архитектура ТЗ
        </h2>
        <p className="text-sm text-[#8A8A8E]">
          Спецификация технических решений, разработанных под высокую нагрузку и быструю адаптацию. Выберите вкладку для детального анализа модуля.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Navigation Tabs (Vertical/Grid on mobile) */}
        <div className="lg:col-span-4 flex flex-col gap-3 py-1">
          <button
            onClick={() => setActiveTab("client")}
            className={`p-4 rounded-xl text-left border transition flex items-center gap-3 cursor-pointer ${
              activeTab === "client"
                ? "bg-[#D4A373] border-[#D4A373] text-black shadow-sm font-bold"
                : "bg-[#101012] border-[#2A2A2E] text-[#8A8A8E] hover:bg-[#1A1A1E] hover:text-white"
            }`}
          >
            <div className={`p-2 rounded-lg ${activeTab === "client" ? "bg-black/20 text-[#D4A373]" : "bg-[#1A1A1E] text-[#8A8A8E]"}`}>
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-sm">Мобильный Клиент</span>
              <span className="text-[10px] opacity-80 font-mono">React Native / Expo</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("backend")}
            className={`p-4 rounded-xl text-left border transition flex items-center gap-3 cursor-pointer ${
              activeTab === "backend"
                ? "bg-[#D4A373] border-[#D4A373] text-black shadow-sm font-bold"
                : "bg-[#101012] border-[#2A2A2E] text-[#8A8A8E] hover:bg-[#1A1A1E] hover:text-white"
            }`}
          >
            <div className={`p-2 rounded-lg ${activeTab === "backend" ? "bg-black/20 text-[#D4A373]" : "bg-[#1A1A1E] text-[#8A8A8E]"}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-sm">Бэкенд & Сервер</span>
              <span className="text-[10px] opacity-80 font-mono">Supabase / PostgreSQL</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("maps")}
            className={`p-4 rounded-xl text-left border transition flex items-center gap-3 cursor-pointer ${
              activeTab === "maps"
                ? "bg-[#D4A373] border-[#D4A373] text-black shadow-sm font-bold"
                : "bg-[#101012] border-[#2A2A2E] text-[#8A8A8E] hover:bg-[#1A1A1E] hover:text-white"
            }`}
          >
            <div className={`p-2 rounded-lg ${activeTab === "maps" ? "bg-black/20 text-[#D4A373]" : "bg-[#1A1A1E] text-[#8A8A8E]"}`}>
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-sm">Карты и Геолокация</span>
              <span className="text-[10px] opacity-80 font-mono">2ГИС Mobile SDK</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("payments")}
            className={`p-4 rounded-xl text-left border transition flex items-center gap-3 cursor-pointer ${
              activeTab === "payments"
                ? "bg-[#D4A373] border-[#D4A373] text-black shadow-sm font-bold"
                : "bg-[#101012] border-[#2A2A2E] text-[#8A8A8E] hover:bg-[#1A1A1E] hover:text-white"
            }`}
          >
            <div className={`p-2 rounded-lg ${activeTab === "payments" ? "bg-black/20 text-[#D4A373]" : "bg-[#1A1A1E] text-[#8A8A8E]"}`}>
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-sm">Каспи / Freedom Pay</span>
              <span className="text-[10px] opacity-80 font-mono">СМС, Deep Links, Эквайринг</span>
            </div>
          </button>
        </div>

        {/* Tab content panel */}
        <div className="lg:col-span-8 bg-[#101012] border border-[#2A2A2E] p-6 sm:p-8 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#2A2A2E]">
              {techStack[activeTab].icon}
              <div>
                <h3 className="text-lg font-medium text-white">
                  {techStack[activeTab].title}
                </h3>
                <span className="text-xs text-[#8A8A8E]">
                  {techStack[activeTab].subtitle}
                </span>
              </div>
            </div>

            {/* Bullets matrix */}
            <div className="space-y-3">
              {techStack[activeTab].bullets.map((bullet, idx) => {
                const [title, desc] = bullet.split(": ");
                return (
                  <div key={idx} className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#1A1A1E] border border-[#D4A373]/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-[#D4A373]" />
                    </div>
                    <div className="text-xs leading-relaxed text-[#8A8A8E]">
                      <strong className="text-white font-semibold">{title}:</strong> {desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Description highlight */}
          <div className="mt-8 pt-5 border-t border-[#2A2A2E] text-xs text-[#8A8A8E] bg-[#1A1A1E]/50 -mx-6 -mb-6 p-6 sm:-mx-8 sm:-mb-8">
            <span className="font-bold text-white block mb-1 uppercase tracking-wider">Фокус преимущества:</span>
            {techStack[activeTab].details}
          </div>
        </div>

      </div>
    </div>
  );
}
