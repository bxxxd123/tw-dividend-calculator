// 內建標的資料。這是整個網站唯一的資料來源，之後要串 API，
// 只要把這裡換成抓取結果（回傳同樣的欄位），換算邏輯與畫面都不用動。
//
// ⚠️ 以下數字是「範例值」，不是即時行情，請到「標的資料」分頁改成最新數字。
// dps = 每股「年」現金股利（元）；freq = year | half | quarter | month

export const dataNote = '內建數字僅為範例，不代表即時行情或未來配息'

export const builtInStocks = [
  { code: '0050', name: '元大台灣50', price: 60, dps: 2.0, freq: 'half' },
  { code: '0056', name: '元大高股息', price: 35, dps: 2.1, freq: 'quarter' },
  { code: '00878', name: '國泰永續高股息', price: 22, dps: 1.6, freq: 'quarter' },
  { code: '00919', name: '群益台灣精選高息', price: 23, dps: 2.4, freq: 'quarter' },
  { code: '00929', name: '復華台灣科技優息', price: 19, dps: 2.0, freq: 'month' },
  { code: '2330', name: '台積電', price: 1000, dps: 18, freq: 'quarter' },
  { code: '2412', name: '中華電', price: 125, dps: 4.8, freq: 'half' },
  { code: '2884', name: '玉山金', price: 30, dps: 1.2, freq: 'year' },
]
