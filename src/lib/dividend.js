export const FREQUENCIES = [
  { value: 'year', label: '年配', times: 1 },
  { value: 'half', label: '半年配', times: 2 },
  { value: 'quarter', label: '季配', times: 4 },
  { value: 'month', label: '月配', times: 12 },
]

export const DEFAULT_SETTINGS = {
  applyNhi: true, // 是否扣二代健保補充保費
  nhiRate: 0.0211, // 補充保費費率
  nhiThreshold: 20000, // 單次股利達此金額才扣
  remitFee: 10, // 每次配息的匯費
}

export const SHARES_PER_LOT = 1000

export function timesPerYear(freq) {
  return FREQUENCIES.find((f) => f.value === freq)?.times ?? 1
}

// 券商實務上股利計算到「元」，小數捨去；先收斂浮點誤差再 floor
function floorToDollar(x) {
  return Math.floor(Number(x.toFixed(4)))
}

// 單次配息：股利總額 → 補充保費、匯費、實領
export function payoutBreakdown(gross, settings) {
  if (gross <= 0) return { gross: 0, nhi: 0, fee: 0, net: 0 }
  const nhi =
    settings.applyNhi && gross >= settings.nhiThreshold
      ? Math.round(gross * settings.nhiRate)
      : 0
  const fee = settings.remitFee
  return { gross, nhi, fee, net: Math.max(0, gross - nhi - fee) }
}

// 正算：持有 shares 股，一年實領多少
export function calcHolding({ shares, price, dps, freq }, settings) {
  const times = timesPerYear(freq)
  const gross = floorToDollar((shares * dps) / times)
  const payout = payoutBreakdown(gross, settings)
  return {
    times,
    payout,
    annualGross: payout.gross * times,
    annualNhi: payout.nhi * times,
    annualFee: payout.gross > 0 ? payout.fee * times : 0,
    annualNet: payout.net * times,
    monthlyNet: (payout.net * times) / 12,
    marketValue: shares * price,
    yieldRate: price > 0 ? dps / price : 0,
  }
}

// 反算：想要每月實領 target 元，最少要持有幾股
export function requiredForMonthlyNet(target, { price, dps, freq }, settings) {
  if (!(target > 0) || !(dps > 0)) return null
  const times = timesPerYear(freq)
  const netPerPayout = (target * 12) / times
  const needed = netPerPayout + settings.remitFee
  const grossNeeded =
    settings.applyNhi && needed >= settings.nhiThreshold
      ? needed / (1 - settings.nhiRate)
      : needed

  let shares = Math.ceil((grossNeeded * times) / dps)
  // 捨去與四捨五入會讓估算差幾元，逐股往上補到實領達標
  for (let i = 0; i < 5000; i++) {
    const r = calcHolding({ shares, price, dps, freq }, settings)
    if (r.monthlyNet >= target - 1e-9) break
    shares += 1
  }

  const lots = Math.ceil(shares / SHARES_PER_LOT)
  const wholeShares = lots * SHARES_PER_LOT
  return {
    shares,
    capital: shares * price,
    wholeLots: lots,
    wholeCapital: wholeShares * price,
    actualMonthlyNet: calcHolding({ shares, price, dps, freq }, settings).monthlyNet,
    wholeMonthlyNet: calcHolding({ shares: wholeShares, price, dps, freq }, settings).monthlyNet,
  }
}
