/**
 * Types and static structures for CoffeeBoom Technical & Commercial Proposal
 */

export interface ProposalPhase {
  id: number;
  title: string;
  durationWeeks: number;
  costTenge: number;
  result: string;
  description: string;
}

export const INITIAL_PHASES: ProposalPhase[] = [
  {
    id: 1,
    title: "Дизайн-адаптация структуры",
    durationWeeks: 3,
    costTenge: 975000,
    result: "Отрисовка UI Kit, адаптация под брендбук, 30+ экранов в Figma",
    description: "На этом этапе мы берем готовую спроектированную структуру приложения и адаптируем её под фирменный стиль CoffeeBoom. Создаем дизайн-систему (UI Kit) для переиспользования элементов, детально отрисовываем светлую и темную темы всех экранов от регистрации до экрана бариста и суперадмина."
  },
  {
    id: 2,
    title: "Мобильное приложение (iOS / Android)",
    durationWeeks: 8,
    costTenge: 2925000,
    result: "Кроссплатформенное приложение на Expo / React Native",
    description: "Разработка клиентской части приложения. Один код для iOS и Android повышает скорость реализации и снижает издержки в 2 раза. Реализуем авторизацию по СМС, интеграцию карт 2ГИС, каталог с модификаторами, корзину, интеграцию платежей (Kaspi Pay по диплинкам, Freedom Pay) и генератор QR-кодов заказов."
  },
  {
    id: 3,
    title: "Серверная часть & Web-панель",
    durationWeeks: 7,
    costTenge: 1950000,
    result: "Бэкенд-инфраструктура, БД Supabase, Web-админка для франчайзи",
    description: "Проектирование базы данных PostgreSQL на базе Supabase. Создание защищенного API авторизации и транзакционных модулей. Разработка веб-консоли суперадмина для контроля сети и планшетной панели бариста (интерактивный экран заказов со звуком и отслеживанием статусов приготовления)."
  },
  {
    id: 4,
    title: "Тестирование и отладка",
    durationWeeks: 2,
    costTenge: 450000,
    result: "Протестированные модули, отчет о нагрузочных испытаниях",
    description: "Интеграционное тестирование всех узлов. Эмуляция пиковой нагрузки (наплыв клиентов во время утренней кофейной лихорадки), проверка безопасности списания бонусов и абонементов, исправление минорных багов, тестирование пуш-нотификаций на реальных девайсах."
  },
  {
    id: 5,
    title: "Публикация и запуск",
    durationWeeks: 1,
    costTenge: 200000,
    result: "Релизы в Apple App Store и Google Play Console",
    description: "Подготовка графических ассетов и метаданных для сторов. Прохождение модерации Apple и Google. Консультация по выпуску обновлений и первичному сопровождению проекта."
  }
];

export interface CoffeeBranch {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  menuModifier: number; // Смещение цен например (+0%, -10%, +15%)
}

export const COFFEE_BRANCHES: CoffeeBranch[] = [
  {
    id: "branch-almaty-1",
    name: "CoffeeBoom Абая",
    address: "г. Алматы, пр. Абая, 44 (ст. метро Байконур)",
    latitude: 43.2405,
    longitude: 76.9295,
    phone: "+7 (707) 123-45-67",
    menuModifier: 1.0 // Базовые цены
  },
  {
    id: "branch-almaty-2",
    name: "CoffeeBoom Dostyk Plaza",
    address: "г. Алматы, Самал-2, 111 (Dostyk Plaza)",
    latitude: 43.2321,
    longitude: 76.9556,
    phone: "+7 (707) 987-65-43",
    menuModifier: 1.15 // Премиум надбавка 15%
  },
  {
    id: "branch-astana-1",
    name: "CoffeeBoom Мангилик Ел",
    address: "г. Астана, пр. Мангилик Ел, 28",
    latitude: 51.1278,
    longitude: 71.4302,
    phone: "+7 (701) 555-44-33",
    menuModifier: 1.05 // Надбавка 5%
  }
];

export interface MenuItem {
  id: string;
  name: string;
  basePrice: number;
  category: "coffee" | "alternative" | "tea" | "dessert" | "bakery" | "sandwich";
  image: string;
  description: string;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "latte",
    name: "Латте Макиато",
    basePrice: 950,
    category: "coffee",
    image: "☕",
    description: "Нежный молочный кофейный напиток с плотной кофейной пенкой."
  },
  {
    id: "cappuccino",
    name: "Капучино",
    basePrice: 850,
    category: "coffee",
    image: "☕",
    description: "Классический кофейный напиток с идеальным балансом эспрессо и молока."
  },
  {
    id: "flatwhite",
    name: "Флэт Уайт",
    basePrice: 1100,
    category: "coffee",
    image: "☕",
    description: "Крепкий молочный напиток с двойным эспрессо для ценителей вкуса."
  },
  {
    id: "matcha",
    name: "Матча Латте",
    basePrice: 1200,
    category: "alternative",
    image: "🍵",
    description: "Японский тертый зеленый чай Matcha высокого качества, заваренный на молоке."
  },
  {
    id: "sencha",
    name: "Чай Сенча",
    basePrice: 700,
    category: "tea",
    image: "🫖",
    description: "Классический зеленый листовой чай с освежающим вкусом."
  },
  {
    id: "croissant",
    name: "Круассан классический",
    basePrice: 650,
    category: "bakery",
    image: "🥐",
    description: "Воздушное хрустящее французское тесто на сливочном масле."
  },
  {
    id: "cheesecake",
    name: "Нью-Йорк шоколадный",
    basePrice: 1300,
    category: "dessert",
    image: "🍰",
    description: "Классический запеченный сырный десерт с тающей шоколадной основой."
  },
  {
    id: "sandwich",
    name: "Клаб-сэндвич с курицей",
    basePrice: 1450,
    category: "sandwich",
    image: "🥪",
    description: "Обжаренный тостовый хлеб, сочная грудка гриль, свежие томаты и соус."
  }
];

export interface SimulatedOrder {
  id: string;
  branchName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    options: string;
  }>;
  totalPrice: number;
  paymentMethod: "Kaspi Link" | "Freedom Pay" | "On Checkout" | "Subscription Limit";
  status: "new" | "accepted" | "preparing" | "ready" | "delivered";
  pickupCode: string; // 4-digit code
  timestamp: string;
}
