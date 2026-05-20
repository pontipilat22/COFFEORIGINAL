import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy load Gemini AI Client to avoid crashing on start up if env is missing
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// System instructions containing the complete CoffeeBoom ТКП parameters
const SYSTEM_INSTRUCTION = `
Ты — интеллектуальный ИИ-ассистент разработчика Заруцкого Е.О. Твоя роль — профессионально презентовать ТЕХНИКО-КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ (ТКП) для CoffeeBoom.
Дата предложения: 19 мая 2026 г.
Статус: Черновик для согласования.

Ты должен отвечать на вопросы заказчика вежливо, профессионально и технически грамотно на русском языке. Придерживайся делового, дружелюбного тона.

Справочная информация о коммерческом предложении (ТКП CoffeeBoom):

СТОИМОСТЬ И СРОКИ:
1. Дизайн-адаптация структуры: 3 недели, Результат: UI Kit, цветовая адаптация, 30+ экранов Figma. Стоимость: 975 000 ₸.
2. Разработка Мобильного приложения: 8–9 недель, Результат: iOS/Android на Expo / React Native. Стоимость: 2 925 000 ₸.
3. Серверная часть & Web-панель: 7–8 недель, Результат: API, Supabase БД, админка. Стоимость: 1 950 000 ₸.
4. Тестирование и отладка: 2–3 недели, Результат: проект без багов, нагрузочные тесты. Стоимость: 450 000 ₸.
5. Публикация и запуск: 1 неделя, Результат: App Store и Google Play. Стоимость: 200 000 ₸.
ИТОГО: 17–19 недель, 6 500 000 ₸ под ключ.

ТЕХНОЛОГИЧЕСКИЙ СТЕК:
- Клиент: React Native (Expo) - единый код для iOS и Android.
- БД и Бэкенд: Supabase / PostgreSQL.
- Админка (Web): React.js + Tailwind CSS.
- Карты / Геолокация: 2ГИС Mobile SDK (2GIS).
- Оповещения / Связь: СМС шлюзы СНГ (SMS-центр), Expo Push Notifications.

ФУНКЦИОНАЛ КЛИЕНТА:
- SMS Авторизация: код из 4 цифр.
- Выбор точки на карте 2ГИС (авто или вручную), динамические цены.
- Меню с модификаторами (объем 0.3/0.4/0.5, молоко коровье/миндаль/кокос/безлактозное, сиропы).
- Оплата: Каспи (Deep Link), Visa/Mastercard (Freedom Pay/Cloudpayments), на кассе (Kaspi QR/Наличные), Подписка (списание лимита).
- Выдача: Уникальный QR-код на экране заказа, сканирование бариста, push-уведомления.

ПРОГРАММА ЛОЯЛЬНОСТИ (ПОДПИСКИ & БОНУСЫ):
- Подписки Standard / Silver / Gold на 30 дней.
- Антифрод: Ограничение повторного заказа по абонементу: не чаще 1 раза в 45 минут.
- Неявка: если клиент не забрал заказ по подписке, лимит сгорает.
- Бонусы: кэшбэк % баллами (1 балл = 1 ₸) от оплат живыми деньгами. Баллами нельзя оплатить саму подписку.

РОЛИ В АДМИНКЕ:
- Суперадмин: управление точками, глобальный каталог, тарифы подписок, пуши, отчетность.
- Франчайзи / Точка (Бариста): управление доступными ценами, стоп-лист, планшет бариста (звуковой сигнал, смена статусов Принят -> Готовится -> Готов), валидация QR.

Отвечай кратко, обоснованно. Если пользователь спрашивает о возможности интеграции других систем (например, IIKO или r_keeper), отвечай, что это возможно на этапе согласования серверной части и может корректировать смету. Каспи интеграция выполняется через Kaspi Pay Deep Links по официальной спецификации.
`;

app.post("/api/chat", async (req: Request, res: Response) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: "Invalid messages array" });
    return;
  }

  const ai = getAiClient();
  if (!ai) {
    // Return mock responses that mimic the consultant but add a note about setting the API key
    const mockReplies = [
      "Здравствуйте! Я ваш интерактивный ассистент по предложению CoffeeBoom. В данный момент API ключ не настроен в вашей системе, но я могу предоставить вам базовые ответы.\n\nДанный проект разработан Заруцким Е.О. и оценивается в 6 500 000 ₸ со сроком реализации 17-19 недель.",
      "Мы выбрали связку React Native (Expo) + Supabase, так как это снижает стоимость кроссплатформенной разработки на iOS и Android почти в два раза по сравнению с нативными языками, сохраняя высокую скорость работы и облачную надежность.",
      "Ограничение в 45 минут на повторный заказ по подписке (антифрод-модуль) разработано для предотвращения злоупотреблений, когда одной подпиской пользуется несколько человек одновременно.",
      "Для настройки полноценных умных ответов, пожалуйста, добавьте API-ключ `GEMINI_API_KEY` в панели 'Settings > Secrets' в Google AI Studio."
    ];
    // Return a random or appropriate mock response based on keyword matching
    const lastUserMsg = (messages[messages.length - 1]?.content || "").toLowerCase();
    let reply = "";
    if (lastUserMsg.includes("почему") || lastUserMsg.includes("supabase")) {
      reply = mockReplies[1];
    } else if (lastUserMsg.includes("фрод") || lastUserMsg.includes("минут") || lastUserMsg.includes("подписк")) {
      reply = mockReplies[2];
    } else {
      reply = mockReplies[0];
    }
    
    res.json({ reply });
    return;
  }

  try {
    // Call Gemini 3.5 Flash for rapid smart replies
    // Convert client messages to Gemini content format. Maximize contextual quality
    const geminiContents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: geminiContents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    const reply = response.text || "Извините, не удалось сформировать ответ.";
    res.json({ reply });
  } catch (error: any) {
    console.error("Gemini route error:", error);
    res.status(500).json({ error: error.message || "Internal server error during chat generation." });
  }
});

// Serve frontend assets in production or integrate Vite middleware in dev
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CoffeeBoom Proposal Server in progress on http://0.0.0.0:${PORT}`);
  });
}

start();
