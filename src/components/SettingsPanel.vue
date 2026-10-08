<script setup>
import { computed } from 'vue'
import { useSettings } from '../composables/useSettings'

const { settings, reset } = useSettings()

// 費率在畫面上用百分比顯示，內部仍存小數
const ratePercent = computed({
  get: () => Number((settings.nhiRate * 100).toFixed(4)),
  set: (v) => (settings.nhiRate = Number(v) / 100),
})
</script>

<template>
  <details class="card settings">
    <summary>稅費設定（預設為目前法規，一般不用改）</summary>
    <div class="settings-grid">
      <label class="check">
        <input v-model="settings.applyNhi" type="checkbox" />
        扣除二代健保補充保費
      </label>
      <label>
        補充保費費率（%）
        <input v-model.number="ratePercent" type="number" min="0" step="0.01" :disabled="!settings.applyNhi" />
      </label>
      <label>
        單次股利達多少元才扣（元）
        <input v-model.number="settings.nhiThreshold" type="number" min="0" step="1000" :disabled="!settings.applyNhi" />
      </label>
      <label>
        每次配息匯費（元）
        <input v-model.number="settings.remitFee" type="number" min="0" step="1" />
      </label>
    </div>
    <button class="link" type="button" @click="reset">還原預設值</button>
  </details>
</template>
