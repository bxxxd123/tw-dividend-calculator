import { reactive, watch } from 'vue'
import { load, save } from '../lib/storage'

const KEY = 'twdiv:holdings'

// 只存「代號＋股數」，股價與股利每次從標的資料查，標的資料更新後會即時反映
const holdings = reactive(load(KEY, []))
watch(holdings, () => save(KEY, holdings), { deep: true })

export function useHoldings() {
  function add(code, shares) {
    const existing = holdings.find((h) => h.code === code)
    if (existing) existing.shares += shares
    else holdings.push({ code, shares })
  }

  function remove(code) {
    const i = holdings.findIndex((h) => h.code === code)
    if (i >= 0) holdings.splice(i, 1)
  }

  return { holdings, add, remove }
}
