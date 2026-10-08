<script setup>
import { computed } from 'vue'

// v-model 是「總股數」，畫面拆成「張」與「零股」兩個欄位
const model = defineModel({ type: Number, default: 0 })

const lots = computed({
  get: () => Math.floor(model.value / 1000),
  set: (v) => (model.value = clean(v) * 1000 + (model.value % 1000)),
})
const odd = computed({
  get: () => model.value % 1000,
  set: (v) => (model.value = Math.floor(model.value / 1000) * 1000 + Math.min(999, clean(v))),
})

function clean(v) {
  const n = Math.floor(Number(v))
  return Number.isFinite(n) && n > 0 ? n : 0
}
</script>

<template>
  <span class="shares-input">
    <label><input v-model.number="lots" type="number" min="0" step="1" inputmode="numeric" aria-label="張數" /> 張</label>
    <label><input v-model.number="odd" type="number" min="0" max="999" step="1" inputmode="numeric" aria-label="零股" /> 股</label>
  </span>
</template>
