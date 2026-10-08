<script setup>
import { computed, ref, watch } from 'vue'
import { load, save } from '../lib/storage'
import { useSettings } from '../composables/useSettings'
import { useStocks } from '../composables/useStocks'
import { FREQUENCIES, requiredForMonthlyNet } from '../lib/dividend'
import { money, num, percent, sharesText } from '../lib/format'

const { stocks } = useStocks()
const { settings } = useSettings()

const KEY = 'twdiv:goal'
const target = ref(load(KEY, 30000))
watch(target, (v) => save(KEY, v))

const presets = [10000, 20000, 30000, 50000, 100000]
const freqLabel = (v) => FREQUENCIES.find((f) => f.value === v)?.label ?? v

// 依「整張資金」由少到多排序，最容易達成的標的排最上面
const rows = computed(() =>
  stocks.value
    .map((s) => ({ stock: s, need: requiredForMonthlyNet(target.value, s, settings) }))
    .filter((r) => r.need)
    .sort((a, b) => a.need.wholeCapital - b.need.wholeCapital),
)
</script>

<template>
  <section>
    <div class="card">
      <h2>我想每個月領多少？</h2>
      <div class="form-row">
        <label>
          目標月領（實領，元）
          <input v-model.number="target" type="number" min="0" step="1000" inputmode="numeric" />
        </label>
        <div class="chips">
          <button v-for="p in presets" :key="p" type="button" :class="{ on: target === p }" @click="target = p">
            {{ num(p) }}
          </button>
        </div>
      </div>
      <p class="hint">
        月領是「扣掉補充保費與匯費後」每月平均進口袋的錢；季配、半年配、年配則是把一年領到的錢除以 12。
      </p>
    </div>

    <div v-if="rows.length" class="card table-wrap">
      <table>
        <thead>
          <tr>
            <th>標的</th>
            <th class="r">殖利率（稅前）</th>
            <th>配息</th>
            <th class="r">最少需持有</th>
            <th class="r">所需資金</th>
            <th class="r">買整張（進位）</th>
            <th class="r">整張資金</th>
            <th class="r">整張後月領</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.stock.code">
            <td>
              <strong>{{ r.stock.code }}</strong> {{ r.stock.name }}
            </td>
            <td class="r">{{ percent(r.stock.dps / r.stock.price) }}</td>
            <td>{{ freqLabel(r.stock.freq) }}</td>
            <td class="r">{{ sharesText(r.need.shares) }}</td>
            <td class="r">{{ money(r.need.capital) }}</td>
            <td class="r">{{ num(r.need.wholeLots) }} 張</td>
            <td class="r">{{ money(r.need.wholeCapital) }}</td>
            <td class="r">{{ money(r.need.wholeMonthlyNet) }}</td>
          </tr>
        </tbody>
      </table>
      <p class="hint">依整張資金由少到多排序。假設股價與每股股利都不變，實際配息每年都可能不同。</p>
    </div>
    <p v-else class="empty">請輸入大於 0 的目標月領，並確認「標的資料」有股利大於 0 的標的。</p>
  </section>
</template>
