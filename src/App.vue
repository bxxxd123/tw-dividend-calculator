<script setup>
import { ref, watch } from 'vue'
import GoalTab from './components/GoalTab.vue'
import HoldingsTab from './components/HoldingsTab.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import StocksTab from './components/StocksTab.vue'
import { load, save } from './lib/storage'

const tabs = [
  { id: 'holdings', label: '持股換算', desc: '我有這些股票，能領多少？' },
  { id: 'goal', label: '目標月息', desc: '我想每月領多少，要買多少？' },
  { id: 'stocks', label: '標的資料', desc: '股價與股利' },
]
const components = { holdings: HoldingsTab, goal: GoalTab, stocks: StocksTab }

const stored = load('twdiv:tab', 'holdings')
const tab = ref(components[stored] ? stored : 'holdings')
watch(tab, (v) => save('twdiv:tab', v))
</script>

<template>
  <div class="app">
    <header>
      <h1>台股股息換算</h1>
      <p>算出持股每年、每月實領多少股息，或反推想領多少需要多少本金。</p>
    </header>

    <nav class="tabs" role="tablist">
      <button
        v-for="t in tabs"
        :key="t.id"
        role="tab"
        type="button"
        :aria-selected="tab === t.id"
        :class="{ on: tab === t.id }"
        @click="tab = t.id"
      >
        <span>{{ t.label }}</span>
        <small>{{ t.desc }}</small>
      </button>
    </nav>

    <SettingsPanel />
    <component :is="components[tab]" />

    <footer>
      資料只存在你的瀏覽器，不會上傳。僅供試算參考，不構成投資建議；實際金額以公司公告與券商入帳為準。
    </footer>
  </div>
</template>
