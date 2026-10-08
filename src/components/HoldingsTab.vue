<script setup>
import { computed, ref } from 'vue'
import SharesInput from './SharesInput.vue'
import { useHoldings } from '../composables/useHoldings'
import { useSettings } from '../composables/useSettings'
import { useStocks } from '../composables/useStocks'
import { FREQUENCIES, calcHolding } from '../lib/dividend'
import { money, percent } from '../lib/format'

const { stocks, byCode } = useStocks()
const { holdings, add, remove } = useHoldings()
const { settings } = useSettings()

const newCode = ref(stocks.value[0]?.code ?? '')
const newShares = ref(1000)

function addHolding() {
  if (!newCode.value || newShares.value <= 0) return
  add(newCode.value, newShares.value)
  newShares.value = 1000
}

const freqLabel = (v) => FREQUENCIES.find((f) => f.value === v)?.label ?? v

// 查不到標的的持股（例如自訂標的被刪掉）直接略過，不讓整頁壞掉
const rows = computed(() =>
  holdings
    .map((h) => ({ holding: h, stock: byCode(h.code) }))
    .filter((r) => r.stock)
    .map((r) => ({ ...r, calc: calcHolding({ ...r.stock, shares: r.holding.shares }, settings) })),
)

const totals = computed(() => {
  const sum = (key) => rows.value.reduce((acc, r) => acc + r.calc[key], 0)
  const marketValue = sum('marketValue')
  const annualGross = sum('annualGross')
  return {
    annualNet: sum('annualNet'),
    monthlyNet: sum('monthlyNet'),
    annualDeduct: sum('annualNhi') + sum('annualFee'),
    marketValue,
    yieldRate: marketValue > 0 ? annualGross / marketValue : 0,
  }
})
</script>

<template>
  <section>
    <div class="card">
      <h2>新增持股</h2>
      <div class="form-row">
        <label>
          標的
          <select v-model="newCode">
            <option v-for="s in stocks" :key="s.code" :value="s.code">{{ s.code }} {{ s.name }}</option>
          </select>
        </label>
        <div class="field">
          持有數量
          <SharesInput v-model="newShares" />
        </div>
        <button class="primary" type="button" @click="addHolding">加入</button>
      </div>
    </div>

    <div v-if="rows.length" class="summary">
      <div class="stat main">
        <span>每月平均實領</span>
        <strong>{{ money(totals.monthlyNet) }}</strong>
      </div>
      <div class="stat">
        <span>一年實領</span>
        <strong>{{ money(totals.annualNet) }}</strong>
      </div>
      <div class="stat">
        <span>持股市值</span>
        <strong>{{ money(totals.marketValue) }}</strong>
      </div>
      <div class="stat">
        <span>整體殖利率（稅前）</span>
        <strong>{{ percent(totals.yieldRate) }}</strong>
      </div>
      <div class="stat">
        <span>一年扣掉的稅費</span>
        <strong>{{ money(totals.annualDeduct) }}</strong>
      </div>
    </div>

    <div v-if="rows.length" class="card table-wrap">
      <table>
        <thead>
          <tr>
            <th>標的</th>
            <th class="r">股價</th>
            <th class="r">每股年股利</th>
            <th>配息</th>
            <th>持有數量</th>
            <th class="r">單次實領</th>
            <th class="r">一年實領</th>
            <th class="r">月均實領</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.holding.code">
            <td>
              <strong>{{ r.stock.code }}</strong> {{ r.stock.name }}
            </td>
            <td class="r">{{ r.stock.price }}</td>
            <td class="r">{{ r.stock.dps }}</td>
            <td>{{ freqLabel(r.stock.freq) }}</td>
            <td><SharesInput v-model="r.holding.shares" /></td>
            <td class="r">{{ money(r.calc.payout.net) }}</td>
            <td class="r">{{ money(r.calc.annualNet) }}</td>
            <td class="r">{{ money(r.calc.monthlyNet) }}</td>
            <td><button class="link danger" type="button" @click="remove(r.holding.code)">刪除</button></td>
          </tr>
        </tbody>
      </table>
      <p class="hint">
        單次實領 = 股利 − 補充保費 − 匯費。每張 = 1,000 股；每股年股利與股價請到「標的資料」分頁修改。
      </p>
    </div>
    <p v-else class="empty">還沒有持股，先從上面選一檔加入吧。</p>
  </section>
</template>
