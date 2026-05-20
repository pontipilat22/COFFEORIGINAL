import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, MessageSquare, AlertCircle, HelpCircle, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function SlideAICopilot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Здравствуйте! Я ИИ-консультант, настроенный на технико-коммерческое предложение CoffeeBoom. Могу ответить на любые вопросы о смете, стеке технологий, Kaspi-интеграции, антифроде абонементов или сроках запуска. Задайте свой вопрос или выберите один из подготовленных пресетов ниже!"
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const presets = [
    "Почему выбран Supabase вместо Firebase?",
    "Какие точные этапы сметы и общая стоимость?",
    "Как работает защита от фрода по подпискам кассы на 45 минут?",
    "Возможна ли интеграция с IIKO или r_keeper?"
  ];

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { role: "user", content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error("Не удалось связаться с сервером.");
      }

      const data = await response.json();
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.reply || "Извините, ответ пуст."
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Произошла техническая заминка при связи с ИИ-сервером. Пожалуйста, перезапустите сервер разработки или проверьте настройку `GEMINI_API_KEY` в панели secrets."
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-full justify-between">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 font-sans tracking-tight">
          <Sparkles className="w-5 h-5 text-[#D4A373]" />
          ИИ-Ассистент по Предложению CoffeeBoom
        </h2>
        <p className="text-sm text-[#8A8A8E] text-left">
          Интеллектуальный робот-консультант, обученный по данному техническому заданию и коммерческой смете Заруцкого Е.О.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1">
        
        {/* Chat message thread */}
        <div className="lg:col-span-8 bg-[#141417] border border-[#2A2A2E] rounded-3xl p-4 sm:p-5 flex flex-col justify-between shadow-sm min-h-[360px] max-h-[460px]">
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
            {messages.map((m, idx) => {
              const isAss = m.role === "assistant";
              return (
                <div 
                  key={idx} 
                  className={`flex gap-3 max-w-[85%] ${isAss ? "self-start text-left" : "self-end ml-auto flex-row-reverse text-right"}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs ${
                    isAss ? "bg-[#D4A373]/10 text-[#D4A373] font-bold border border-[#D4A373]/20" : "bg-[#D4A373] text-black font-semibold"
                  }`}>
                    {isAss ? "CB" : <User className="w-4 h-4" />}
                  </div>
                  <div className={`p-3.5 rounded-2xl text-xs leading-relaxed text-left ${
                    isAss ? "bg-black/40 text-[#E0E0E0] border border-[#2A2A2E] rounded-tl-none" : "bg-[#D4A373] text-black font-medium rounded-tr-none"
                  }`}>
                    <p className="whitespace-pre-line">{m.content}</p>
                  </div>
                </div>
              );
            })}
            
            {loading && (
              <div className="flex gap-3 max-w-[85%] self-start text-left">
                <div className="w-8 h-8 rounded-full bg-[#D4A373]/10 text-[#D4A373] flex items-center justify-center border border-[#D4A373]/20 font-bold text-xs shrink-0">
                  CB
                </div>
                <div className="bg-black/40 p-3.5 rounded-2xl rounded-tl-none text-xs text-[#8A8A8E] italic flex items-center gap-2 border border-[#2A2A2E]">
                  <span className="w-1.5 h-1.5 bg-[#D4A373] rounded-full animate-ping"></span>
                  Формулирую экспертный ответ...
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Form input controls */}
          <div className="pt-4 border-t border-[#2A2A2E] flex items-center gap-2">
            <input
              type="text"
              placeholder="Спросите о стеке, Kaspi, тарифах подписок или сметной стоимости..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage(input)}
              className="flex-1 text-xs px-4 py-3 border border-[#2A2A2E] rounded-xl focus:outline-none focus:border-[#D4A373] bg-[#101012] text-white"
            />
            <button
              onClick={() => handleSendMessage(input)}
              disabled={loading || !input.trim()}
              className="p-3 bg-[#D4A373] text-black hover:bg-[#c59868] rounded-xl transition cursor-pointer disabled:opacity-40 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sidebar parameters & Preset chips */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#141417] border border-[#2A2A2E] p-5 rounded-3xl space-y-4 text-left">
            <span className="text-[10px] text-[#D4A373] font-mono block uppercase tracking-wider font-bold">Быстрые пресеты</span>
            <h4 className="text-xs font-bold text-white">Популярные вопросы заказчика:</h4>
            
            <div className="flex flex-col gap-2">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(preset)}
                  className="text-left py-2 px-3 border border-[#2A2A2E] hover:border-[#D4A373] hover:text-white bg-[#101012] text-[11px] font-semibold text-[#8A8A8E] rounded-xl transition cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#1a110a] border border-[#D4A373]/20 text-white p-5 rounded-3xl text-xs space-y-3.5 text-left">
            <span className="text-[10px] text-[#D4A373] font-mono block uppercase tracking-wider font-semibold">Важно</span>
            <p className="text-[#8A8A8E] leading-relaxed">
              Ответы ИИ-ассистента базируются на официальном содержании ТКП от 19 мая 2026 г. Оценки носят точный характер. При необходимости изменений, ИИ сможет составить черновик ТЗ новой интеграции.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
