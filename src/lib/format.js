export function money(n) {
  return `NT$ ${Math.round(n).toLocaleString('zh-TW')}`
}

export function num(n) {
  return Math.round(n).toLocaleString('zh-TW')
}

export function percent(rate) {
  return `${(rate * 100).toFixed(2)}%`
}

export function sharesText(shares) {
  const lots = Math.floor(shares / 1000)
  const odd = shares % 1000
  if (lots && odd) return `${lots} 張 ${odd} 股`
  if (lots) return `${lots} 張`
  return `${odd} 股`
}
