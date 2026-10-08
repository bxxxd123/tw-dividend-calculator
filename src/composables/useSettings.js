import { reactive, watch } from 'vue'
import { DEFAULT_SETTINGS } from '../lib/dividend'
import { load, save } from '../lib/storage'

const KEY = 'twdiv:settings'

// 模組層級的單例：所有元件共用同一份設定
const settings = reactive({ ...DEFAULT_SETTINGS, ...load(KEY, {}) })
watch(settings, () => save(KEY, { ...settings }), { deep: true })

export function useSettings() {
  function reset() {
    Object.assign(settings, DEFAULT_SETTINGS)
  }
  return { settings, reset }
}
