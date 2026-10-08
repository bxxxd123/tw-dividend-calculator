// localStorage 在無痕模式或被封鎖時會丟例外，包起來讓網站仍可使用
export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // 寫入失敗就算了，資料只是不會被記住
  }
}
