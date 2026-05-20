import React, { useState } from "react";
import { CoffeeBranch, MenuItem, MENU_ITEMS, COFFEE_BRANCHES, SimulatedOrder } from "../types";
import { 
  Phone, Smartphone, Check, ArrowRight, MapPin, Coffee, ShoppingCart, 
  Trash2, CreditCard, Sparkles, CheckCircle, RefreshCcw, Bell
} from "lucide-react";

interface MobileSimulatorProps {
  activeBranch: CoffeeBranch;
  setActiveBranch: (branch: CoffeeBranch) => void;
  orders: SimulatedOrder[];
  addOrder: (order: SimulatedOrder) => void;
  activeOrder: SimulatedOrder | null;
  setActiveOrder: (order: SimulatedOrder | null) => void;
}

export default function MobileSimulator({ 
  activeBranch, 
  setActiveBranch, 
  orders, 
  addOrder,
  activeOrder,
  setActiveOrder
}: MobileSimulatorProps) {
  // Mobile app navigation state: 'auth' | 'branchSec' | 'menu' | 'cart' | 'status'
  const [screen, setScreen] = useState<"auth" | "branchSec" | "menu" | "cart" | "status">("auth");
  
  // Auth Form State
  const [phone, setPhone] = useState<string>("+7 (707) 500-20-26");
  const [smsSent, setSmsSent] = useState(false);
  const [smsCode, setSmsCode] = useState("");
  const [authError, setAuthError] = useState("");

  // Cart / Menu State
  const [selectedCategory, setSelectedCategory] = useState<string>("coffee");
  const [activeItemForModifiers, setActiveItemForModifiers] = useState<MenuItem | null>(null);
  
  // Modifiers State
  const [modSize, setModSize] = useState<"0.3" | "0.4" | "0.5">("0.4");
  const [modMilk, setModMilk] = useState<"cow" | "almond" | "coconut" | "lactose-free">("cow");
  const [modSyrup, setModSyrup] = useState<boolean>(false);

  // Cart storage
  const [cartItems, setCartItems] = useState<Array<{
    item: MenuItem;
    quantity: number;
    optionsText: string;
    calculatedPrice: number;
  }>>([]);

  const [paymentMethod, setPaymentMethod] = useState<"Kaspi Link" | "Freedom Pay" | "On Checkout" | "Subscription Limit">("Kaspi Link");
  const [pickupTime, setPickupTime] = useState<string>("10 минут");

  // Loyalty Sub Limit
  const [subLimit, setSubLimit] = useState<number>(4);

  // Handle Auth
  const handleSendSMS = () => {
    if (phone.length < 10) {
      setAuthError("Неверный формат номера телефона");
      return;
    }
    setSmsSent(true);
    setAuthError("");
  };

  const handleVerifySMS = () => {
    if (smsCode === "4025") {
      setScreen("branchSec");
      setAuthError("");
    } else {
      setAuthError("Неверный код (введите подсказку 4025)");
    }
  };

  // Menu pricing customized by selected branch pricing rate
  const getBranchPrice = (base: number) => {
    return Math.round(base * activeBranch.menuModifier);
  };

  // Add Item with Modifiers to Cart
  const handleAddToCart = () => {
    if (!activeItemForModifiers) return;
    
    // Size impact: 0.3 (base), 0.4 (+150₸), 0.5 (+250₸)
    let sizeCharge = 0;
    if (modSize === "0.4") sizeCharge = 150;
    if (modSize === "0.5") sizeCharge = 250;
    
    // Milk impact: almond (+200 KZT), coconut (+200 KZT), standard cow (0 KZT)
    let milkCharge = 0;
    if (["almond", "coconut"].includes(modMilk)) milkCharge = 200;

    // Syrup impact (+100 KZT)
    const syrupCharge = modSyrup ? 100 : 0;

    const price = getBranchPrice(activeItemForModifiers.basePrice) + sizeCharge + milkCharge + syrupCharge;
    
    const milkLabels = { cow: "Кор. молоко", almond: "Миндаль. молоко", coconut: "Кокос. молоко", "lactose-free": "Безлактоз." };
    const optionsText = `${modSize}л, ${milkLabels[modMilk]}${modSyrup ? ", сироп" : ""}`;

    setCartItems(prev => [
      ...prev,
      {
        item: activeItemForModifiers,
        quantity: 1,
        optionsText,
        calculatedPrice: price
      }
    ]);

    setActiveItemForModifiers(null);
  };

  const getCartTotal = () => {
    return cartItems.reduce((acc, c) => acc + (c.calculatedPrice * c.quantity), 0);
  };

  // Checkout and Trigger live order State
  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    if (paymentMethod === "Subscription Limit") {
      if (subLimit <= 0) {
        alert("Лимит по подписке исчерпан!");
        return;
      }
      setSubLimit(prev => prev - 1);
    }

    const orderId = `CB-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: SimulatedOrder = {
      id: orderId,
      branchName: activeBranch.name,
      items: cartItems.map(c => ({
        name: c.item.name,
        quantity: c.quantity,
        price: c.calculatedPrice,
        options: c.optionsText
      })),
      totalPrice: paymentMethod === "Subscription Limit" ? 0 : getCartTotal(),
      paymentMethod: paymentMethod,
      status: "new",
      pickupCode: String(Math.floor(1000 + Math.random() * 9000)),
      timestamp: new Date().toLocaleTimeString("ru-RU", { hour: '2-digit', minute: '2-digit' })
    };

    addOrder(newOrder);
    setActiveOrder(newOrder);
    setCartItems([]);
    setScreen("status");
  };

  return (
    <div className="relative mx-auto w-full max-w-[340px] h-[670px] bg-black rounded-[42px] p-3.5 shadow-2xl border-4 border-[#2A2A2E] flex flex-col overflow-hidden select-none">
      
      {/* Smartphone hardware accents */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-[#101012] rounded-full z-40 flex items-center justify-center gap-1">
        <div className="w-12 h-1 bg-[#2A2A2E] rounded-full"></div>
        <div className="w-2 h-2 bg-black rounded-full"></div>
      </div>

      {/* Screen Interface */}
      <div className="flex-1 bg-[#0A0A0B] rounded-[32px] overflow-hidden flex flex-col relative text-[#E0E0E0] font-sans pt-6">
        
        {/* Live Notification Indicator */}
        {activeOrder && activeOrder.status === "ready" && (
          <div className="p-2 border-b border-emerald-900 bg-emerald-950/40 text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5 animate-bounce">
            <Bell className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            Ваш латте готов! Код QR активен
          </div>
        )}

        {/* Dynamic header depending on state */}
        <div className="px-4 py-3 bg-[#101012] border-b border-[#2A2A2E] flex items-center justify-between">
          <span className="text-xs font-bold tracking-tight text-white font-mono">COFFEEBOOM</span>
          {screen !== "auth" && (
            <div className="flex items-center gap-1 text-[10px] bg-[#D4A373]/10 text-[#D4A373] px-2.5 py-1 rounded-full font-semibold border border-[#D4A373]/30">
              <span className="w-1.5 h-1.5 bg-[#D4A373] rounded-full animate-ping"></span>
              {activeBranch.name.split(" ")[1] || "Главная"}
            </div>
          )}
        </div>

        {/* Dynamic Screen View routing inside phone frame */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          
          {/* SCR 1: AUTHENTICATION */}
          {screen === "auth" && (
            <div className="py-4 space-y-4">
              <div className="text-center pt-2">
                <span className="inline-flex p-3 rounded-full bg-[#D4A373]/10 text-[#D4A373] mb-2">
                  <Smartphone className="w-6 h-6" />
                </span>
                <h3 className="text-base font-bold text-white">Вход по номеру</h3>
                <p className="text-[11px] text-[#8A8A8E] mt-1 max-w-[200px] mx-auto">
                  Регистрация франчайзи-клиента CoffeeBoom в Республике Казахстан.
                </p>
              </div>

              {!smsSent ? (
                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-[#8A8A8E]">Моб. телефон (РФ/РК)</label>
                    <input
                      type="text"
                      className="w-full text-xs p-2.5 border border-[#2A2A2E] bg-[#101012] rounded-lg focus:outline-none focus:border-[#D4A373] text-white"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={handleSendSMS}
                    className="w-full py-2.5 bg-[#D4A373] text-black font-bold text-xs rounded-lg transition hover:bg-[#c59868]"
                  >
                    Получить СМС код →
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-emerald-400 font-bold">СМС код выслан</label>
                    <input
                      type="text"
                      placeholder="Подсказка: 4025"
                      className="w-full text-center text-sm tracking-[0.5em] font-mono p-2.5 border border-emerald-900 bg-[#101012] rounded-lg focus:outline-none focus:border-emerald-600 text-white"
                      value={smsCode}
                      onChange={(e) => setSmsCode(e.target.value)}
                    />
                    <span className="text-[9px] text-emerald-400 block text-center mt-1">Используйте секретный код 4025</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSmsSent(false)}
                      className="flex-1 py-2 border border-[#2A2A2E] bg-[#101012] text-xs rounded-lg font-medium text-[#8A8A8E]"
                    >
                      Назад
                    </button>
                    <button
                      onClick={handleVerifySMS}
                      className="flex-1 py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg"
                    >
                      Войти
                    </button>
                  </div>
                </div>
              )}

              {authError && <p className="text-[10px] text-rose-500 text-center font-bold">{authError}</p>}
            </div>
          )}

          {/* SCR 2: BRANCH LOCATOR */}
          {screen === "branchSec" && (
            <div className="space-y-3 py-1 text-left">
              <div>
                <span className="text-[9px] uppercase font-mono text-[#8A8A8E] tracking-wider font-bold">Выбор филиала 2ГИС</span>
                <h3 className="text-sm font-bold mt-0.5 text-white">Где заберете кофе?</h3>
              </div>

              {/* Mock 2GIS Map Selector Grid */}
              <div className="bg-[#101012] h-[130px] rounded-xl border border-[#2A2A2E] relative overflow-hidden flex items-end p-2 shadow-inner">
                {/* Visual points on map */}
                <span className="absolute top-[35%] left-[25%] p-1 bg-black text-white rounded-full animate-bounce shadow border border-[#D4A373]/30">
                  <MapPin className="w-3.5 h-3.5 text-[#D4A373]" />
                </span>
                <span className="absolute bottom-[20%] right-[30%] p-1 bg-black text-white rounded-full shadow border border-[#2A2A2E]">
                  <MapPin className="w-3.5 h-3.5 text-[#D4A373]" />
                </span>
                <div className="absolute top-2 left-2 bg-[#1A1A1E] text-[9px] text-[#D4A373] px-2 py-0.5 rounded shadow font-bold border border-[#2A2A2E] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  2GIS SDK Live
                </div>
                
                <p className="text-[9px] font-semibold text-[#8A8A8E] bg-black/80 px-2 py-1 rounded w-full text-center truncate shadow">
                  Текущая GPS геопозиция: Алматы
                </p>
              </div>

              {/* Branch listing selection */}
              <div className="space-y-2">
                {COFFEE_BRANCHES.map(branch => {
                  const isCur = activeBranch.id === branch.id;
                  return (
                    <button
                      key={branch.id}
                      onClick={() => {
                        setActiveBranch(branch);
                        setScreen("menu");
                      }}
                      className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between cursor-pointer ${
                        isCur ? "bg-[#D4A373]/10 border-[#D4A373]" : "bg-[#101012] border-[#2A2A2E]"
                      }`}
                    >
                      <div className="space-y-0.5 max-w-[210px]">
                        <span className="block text-xs font-bold text-white">{branch.name}</span>
                        <span className="block text-[10px] text-[#8A8A8E] truncate">{branch.address}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-mono block text-[#8A8A8E]">Коэф. цен</span>
                        <span className="text-xs font-bold text-[#D4A373] font-mono">x{branch.menuModifier}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SCR 3: MENU BROWSING & MODIFIERS */}
          {screen === "menu" && (
            <div className="space-y-4 pb-4">
              {/* Profile Bar */}
              <div className="flex items-center justify-between bg-[#101012] p-2 rounded-xl border border-[#2A2A2E]">
                <div className="text-left">
                  <span className="block text-[9px] text-[#8A8A8E]">Клиент</span>
                  <span className="block text-xs font-bold text-white">Абонент</span>
                </div>
                {/* Subscription Gold limit state feedback */}
                <div className="bg-[#D4A373]/10 text-[#D4A373] border border-[#D4A373]/30 text-[9px] px-2 py-0.5 rounded-full font-bold">
                  Абонемент: {subLimit} чаш.
                </div>
              </div>

              {/* Sub-Category Slider Filters */}
              <div className="flex gap-1.5 overflow-x-auto pb-1.5">
                {[
                  { id: "coffee", label: "Кофе" },
                  { id: "alternative", label: "Альтернатива" },
                  { id: "tea", label: "Чай" },
                  { id: "bakery", label: "Пекарня" }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1 rounded-full text-[10px] font-semibold tracking-tight transition shrink-0 cursor-pointer ${
                      selectedCategory === cat.id 
                        ? "bg-[#D4A373] text-black" 
                        : "bg-[#1A1A1E] text-[#8A8A8E] hover:text-white"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Customized item grid */}
              <div className="grid grid-cols-2 gap-2.5 text-left">
                {MENU_ITEMS.filter(i => i.category === selectedCategory).map(item => {
                  const finalPrice = getBranchPrice(item.basePrice);
                  return (
                    <div 
                      key={item.id} 
                      onClick={() => setActiveItemForModifiers(item)}
                      className="bg-[#101012] border border-[#2A2A2E] p-2.5 rounded-xl hover:border-[#D4A373]/40 transition flex flex-col justify-between cursor-pointer"
                    >
                      <div>
                        <span className="text-2xl block mb-1">{item.image}</span>
                        <h4 className="text-xs font-bold text-white leading-snug truncate">{item.name}</h4>
                        <p className="text-[9px] text-[#8A8A8E] line-clamp-2 mt-0.5 leading-tight">{item.description}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#2A2A2E]">
                        <span className="text-xs font-bold font-mono text-[#D4A373]">{finalPrice} ₸</span>
                        <span className="text-[10px] bg-[#1A1A1E] text-[#D4A373] border border-[#2A2A2E] rounded-md px-1.5 font-bold">+</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cart floating CTA */}
              {cartItems.length > 0 && (
                <button
                  onClick={() => setScreen("cart")}
                  className="w-full py-2.5 bg-[#D4A373] text-black text-xs font-bold rounded-xl flex items-center justify-between px-3"
                >
                  <span className="flex items-center gap-1.5">
                    <ShoppingCart className="w-4 h-4 text-black" /> В корзине ({cartItems.length})
                  </span>
                  <span className="font-mono bg-black text-[#D4A373] px-2 py-0.5 rounded-md">{getCartTotal()} ₸</span>
                </button>
              )}

              {/* Map Back Button */}
              <button
                onClick={() => setScreen("branchSec")}
                className="w-full text-center text-[10px] font-semibold text-[#D4A373] py-1 underline cursor-pointer"
              >
                Сменить филиал 2ГИС
              </button>
            </div>
          )}

          {/* SCR 4: SHOPPING CART & PAYMENT SELECTION */}
          {screen === "cart" && (
            <div className="space-y-4 pb-4 text-left">
              <h3 className="text-sm font-bold flex items-center gap-1 text-white">
                <ShoppingCart className="w-4 h-4 text-[#D4A373]" /> Корзина
              </h3>

              {cartItems.length === 0 ? (
                <p className="text-xs text-[#8A8A8E] text-center py-6">В корзине пусто. Вернитесь в меню.</p>
              ) : (
                <div className="space-y-3">
                  <div className="divide-y divide-[#2A2A2E]">
                    {cartItems.map((c, index) => (
                      <div key={index} className="py-2 flex justify-between items-start text-xs">
                        <div>
                          <span className="font-bold text-white">{c.item.name}</span>
                          <span className="block text-[9px] text-[#8A8A8E]">{c.optionsText}</span>
                        </div>
                        <div className="text-right shrink-0 font-mono">
                          <span className="font-bold block text-white">{c.calculatedPrice} ₸</span>
                          <button 
                            onClick={() => setCartItems(prev => prev.filter((_, i) => i !== index))}
                            className="text-[10px] text-rose-500 font-bold hover:underline"
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <hr className="border-[#2A2A2E]" />

                  {/* Pickup timing inputs */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#8A8A8E] uppercase font-mono">Время самовывоза</label>
                    <select
                      className="w-full text-xs p-2 border border-[#2A2A2E] bg-[#101012] text-white rounded-lg"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                    >
                      <option value="10 минут">Через 10 минут</option>
                      <option value="20 минут">Через 20 минут</option>
                      <option value="30 минут">Через 30 минут</option>
                      <option value="На кассе">Заберу на месте</option>
                    </select>
                  </div>

                  {/* Payment integrations picker */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#8A8A8E] uppercase font-mono">Синхронизированные шлюзы</label>
                    
                    <div className="space-y-1.5 text-xs">
                      {/* Kaspi Direct Deep link */}
                      <label className="flex items-center gap-2 p-2 rounded-lg border border-[#2A2A2E] bg-[#101012] hover:border-[#D4A373] transition cursor-pointer">
                        <input
                          type="radio"
                          name="pay"
                          checked={paymentMethod === "Kaspi Link"}
                          onChange={() => setPaymentMethod("Kaspi Link")}
                          className="accent-[#D4A373]"
                        />
                        <div>
                          <span className="font-bold block text-red-500">Kaspi Pay (Дип-линк)</span>
                          <span className="text-[9px] text-[#8A8A8E]">Запуск Каспи приложения по ссылке</span>
                        </div>
                      </label>

                      {/* Freedom Pay / Cards */}
                      <label className="flex items-center gap-2 p-2 rounded-lg border border-[#2A2A2E] bg-[#101012] hover:border-[#D4A373] transition cursor-pointer">
                        <input
                          type="radio"
                          name="pay"
                          checked={paymentMethod === "Freedom Pay"}
                          onChange={() => setPaymentMethod("Freedom Pay")}
                          className="accent-[#D4A373]"
                        />
                        <div>
                          <span className="font-bold block text-white">Картами Visa / Mastercard</span>
                          <span className="text-[9px] text-[#8A8A8E]">Через процессинг Freedom Pay</span>
                        </div>
                      </label>

                      {/* Loyalty Subscriptions option */}
                      <label className={`flex items-center gap-2 p-2 rounded-lg border border-[#2A2A2E] bg-[#101012] hover:border-[#D4A373] transition cursor-pointer ${subLimit <= 0 ? "opacity-50" : ""}`}>
                        <input
                          type="radio"
                          name="pay"
                          disabled={subLimit <= 0}
                          checked={paymentMethod === "Subscription Limit"}
                          onChange={() => setPaymentMethod("Subscription Limit")}
                          className="accent-[#D4A373]"
                        />
                        <div>
                          <span className="font-bold block text-[#D4A373]">Абонемент Standard/Silver</span>
                          <span className="text-[9px] text-[#8A8A8E]">Остаток лимита чашек: {subLimit} шт</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Pricing line breakdown */}
                  <div className="pt-2 bg-[#101012] p-2.5 rounded-lg border border-[#2A2A2E] text-xs space-y-1 font-semibold">
                    <div className="flex justify-between">
                      <span className="text-[#8A8A8E]">Сumma к оплате:</span>
                      <span className="font-mono text-white">{paymentMethod === "Subscription Limit" ? "0 ₸" : `${getCartTotal()} ₸`}</span>
                    </div>
                    {paymentMethod !== "Subscription Limit" && (
                      <div className="flex justify-between text-emerald-400 text-[10px]">
                        <span>Начислится бонусов (+5%):</span>
                        <span>+{Math.round(getCartTotal() * 0.05)} баллов</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full py-2.5 bg-[#D4A373] text-black font-bold text-xs rounded-xl shadow transition text-center"
                  >
                    Оплатить и отправить заказ
                  </button>
                </div>
              )}

              <button
                onClick={() => setScreen("menu")}
                className="w-full text-center text-xs font-bold text-[#D4A373] mt-2 block"
              >
                ← Назад в каталог
              </button>
            </div>
          )}

          {/* SCR 5: LIVE ORDER STATE WITH INTEGRATED PICKUP QR */}
          {screen === "status" && activeOrder && (
            <div className="py-2 text-center space-y-4">
              <div className="space-y-1">
                <span className="inline-flex p-2 bg-emerald-950/40 text-emerald-400 border border-emerald-900 text-[10px] font-bold rounded-lg uppercase">
                  Оплата успешна
                </span>
                <h3 className="text-sm font-bold pt-1 text-white">Ваш заказ принят в работу!</h3>
                <p className="text-[10px] text-[#8A8A8E]">
                  Покажите этот QR-код на кассе для сканирования бариста.
                </p>
              </div>

              {/* Unique Generated Order ticket pickup QR Code frame styling */}
              <div className="p-4 bg-black border-2 border-dashed border-[#D4A373] rounded-2xl w-36 h-36 mx-auto flex flex-col justify-between shadow-sm relative overflow-hidden">
                <span className="absolute top-0 right-0 text-[8px] bg-[#D4A373] text-black px-1 font-bold">QR ORDER</span>
                <div className="grid grid-cols-4 gap-1 p-2 bg-[#101012] rounded border border-[#2A2A2E] mt-1">
                  {/* Procedural QR visual matrix */}
                  {[
                    1,1,0,1,
                    0,1,1,0,
                    1,0,1,1,
                    1,0,0,1
                  ].map((cell, idx) => (
                    <div key={idx} className={`w-5 h-5 ${cell === 1 ? 'bg-white' : 'bg-transparent'} rounded-[2px]`}></div>
                  ))}
                </div>
                <div className="text-[11px] font-bold tracking-widest text-[#D4A373] font-mono">
                  #{activeOrder.pickupCode}
                </div>
              </div>

              {/* Dynamic status progress steps */}
              <div className="bg-[#101012] p-3 rounded-xl border border-[#2A2A2E] space-y-2 text-left text-[11px]">
                <div className="flex justify-between font-bold border-b border-[#2A2A2E] pb-1.5 mb-1.5">
                  <span className="text-[#8A8A8E]">ID Заказа:</span>
                  <span className="font-mono text-[#D4A373]">{activeOrder.id}</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className={`w-2 h-2 rounded-full ${["new", "accepted", "preparing", "ready"].includes(activeOrder.status) ? "bg-emerald-500 animate-pulse" : "bg-gray-600"}`}></span>
                    <span className="text-white">Оформлен</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className={`w-2 h-2 rounded-full ${["accepted", "preparing", "ready"].includes(activeOrder.status) ? "bg-emerald-500 animate-pulse" : "bg-gray-600"}`}></span>
                    <span className="text-white">Принят кофейней</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className={`w-2 h-2 rounded-full ${["preparing", "ready"].includes(activeOrder.status) ? "bg-emerald-500 animate-pulse" : "bg-gray-600"}`}></span>
                    <span className="text-white">Готовится бариста</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className={`w-2 h-2 rounded-full ${activeOrder.status === "ready" ? "bg-emerald-500 animate-pulse" : "bg-gray-600"}`}></span>
                    <span className={`${activeOrder.status === "ready" ? "text-emerald-400 font-extrabold animate-bounce" : "text-[#8A8A8E]"}`}>
                      Готов к выдаче!
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setScreen("menu")}
                  className="flex-1 py-1.5 bg-[#101012] hover:bg-[#1A1A1E] text-white font-bold text-[10px] rounded-lg border border-[#2A2A2E] transition"
                >
                  Новый заказ
                </button>
                <button
                  onClick={() => setActiveOrder(null)}
                  className="flex-1 py-1.5 bg-rose-950/25 hover:bg-rose-950/45 text-rose-400 font-bold text-[10px] rounded-lg border border-rose-900/60 transition"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}

        </div>

        {/* MODIFIERS MODAL SCREEN OVERLAY inside device container screen limit */}
        {activeItemForModifiers && (
          <div className="absolute inset-x-0 bottom-0 bg-[#101012] border-t-2 border-[#D4A373] p-4 rounded-t-3xl shadow-xl space-y-4 z-40 text-left">
            <div>
              <h4 className="text-sm font-bold text-white">{activeItemForModifiers.name}</h4>
              <p className="text-[10px] text-[#8A8A8E]">Настройте вкус и объем любимого напитка.</p>
            </div>

            {/* Options size */}
            <div className="space-y-1">
              <span className="block text-[9px] uppercase font-mono text-[#8A8A8E]">Объем</span>
              <div className="grid grid-cols-3 gap-1.5 text-xs font-bold text-center">
                {(["0.3", "0.4", "0.5"] as const).map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setModSize(size)}
                    className={`py-1.5 border rounded-lg transition ${
                      modSize === size ? "bg-[#D4A373] text-black border-[#D4A373]" : "bg-[#1A1A1E] border-[#2A2A2E] text-[#8A8A8E]"
                    }`}
                  >
                    {size}л
                  </button>
                ))}
              </div>
            </div>

            {/* Options Milk config */}
            <div className="space-y-1">
              <span className="block text-[9px] uppercase font-mono text-[#8A8A8E]">Тип молока</span>
              <div className="grid grid-cols-2 gap-1 text-xs">
                {[
                  { id: "cow", label: "Коровье (+0₸)" },
                  { id: "almond", label: "Миндаль (+200₸)" },
                  { id: "coconut", label: "Кокос (+200₸)" },
                  { id: "lactose-free", label: "Безлакт (+0₸)" }
                ].map(milk => (
                  <button
                    key={milk.id}
                    type="button"
                    onClick={() => setModMilk(milk.id as any)}
                    className={`p-1.5 border rounded-lg font-semibold text-center truncate tracking-tight transition ${
                      modMilk === milk.id ? "bg-[#D4A373] text-black border-[#D4A373]" : "bg-[#1A1A1E] border-[#2A2A2E] text-[#8A8A8E]"
                    }`}
                  >
                    {milk.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Syrups */}
            <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={modSyrup}
                onChange={(e) => setModSyrup(e.target.checked)}
                className="rounded border-[#2A2A2E] bg-[#101012] text-[#D4A373] focus:ring-0 accent-[#D4A373]" 
              />
              <span className="text-[#8A8A8E]">Добавить кофейный сироп (+100 ₸)</span>
            </label>

            <div className="flex gap-2 pt-1 border-t border-[#2A2A2E]">
              <button
                onClick={() => setActiveItemForModifiers(null)}
                className="flex-1 py-2 text-xs font-bold text-[#8A8A8E] hover:bg-[#1A1A1E] rounded-lg text-center"
              >
                Отмена
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-[2] py-2 bg-[#D4A373] text-black text-xs font-bold rounded-lg text-center font-mono"
              >
                Добавить {getBranchPrice(activeItemForModifiers.basePrice) + (modSize === "0.4" ? 150 : modSize === "0.5" ? 250 : 0) + (["almond", "coconut"].includes(modMilk) ? 200 : 0) + (modSyrup ? 100 : 0)} ₸
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
