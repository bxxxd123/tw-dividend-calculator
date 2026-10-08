import { computed, reactive, watch } from 'vue'
import { builtInStocks } from '../data/stocks'
import { load, save } from '../lib/storage'

const KEY = 'twdiv:stocks'

// overrides：使用者改過的內建標的（以代號為 key）；custom：使用者自己新增的標的
const state = reactive({ overrides: {}, custom: [], ...load(KEY, {}) })
watch(state, () => save(KEY, { overrides: state.overrides, custom: state.custom }), { deep: true })

const stocks = computed(() => [
  ...builtInStocks.map((s) => ({
    ...s,
    ...state.overrides[s.code],
    builtIn: true,
    edited: Boolean(state.overrides[s.code]),
  })),
  ...state.custom.map((s) => ({ ...s, builtIn: false, edited: false })),
])

export function useStocks() {
  const byCode = (code) => stocks.value.find((s) => s.code === code)

  function update(code, patch) {
    const custom = state.custom.find((s) => s.code === code)
    if (custom) Object.assign(custom, patch)
    else state.overrides[code] = { ...state.overrides[code], ...patch }
  }

  function addCustom(stock) {
    const code = stock.code.trim().toUpperCase()
    if (!code) return '請輸入代號'
    if (byCode(code)) return `代號 ${code} 已經存在`
    state.custom.push({ ...stock, code, name: stock.name.trim() || code })
    return ''
  }

  function removeCustom(code) {
    state.custom = state.custom.filter((s) => s.code !== code)
  }

  function resetBuiltIn(code) {
    delete state.overrides[code]
  }

  return { stocks, byCode, update, addCustom, removeCustom, resetBuiltIn }
}
