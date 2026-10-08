<script setup>
import { reactive, ref } from 'vue'
import { dataNote } from '../data/stocks'
import { useStocks } from '../composables/useStocks'
import { FREQUENCIES } from '../lib/dividend'

const { stocks, update, addCustom, removeCustom, resetBuiltIn } = useStocks()

const blank = () => ({ code: '', name: '', price: 0, dps: 0, freq: 'quarter' })
const form = reactive(blank())
const error = ref('')

function submit() {
  error.value = addCustom({ ...form })
  if (!error.value) Object.assign(form, blank())
}

// 空欄位會變成 ''，統一當成 0，避免算出 NaN
const asNumber = (v) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : 0)
</script>

<template>
  <section>
    <div class="card notice">
      ⚠️ {{ dataNote }}。請把股價與「每股年現金股利」改成你查到的最新數字，修改會自動存在這個瀏覽器。
    </div>

    <div class="card table-wrap">
      <table>
        <thead>
          <tr>
            <th>代號</th>
            <th>名稱</th>
            <th class="r">股價（元）</th>
            <th class="r">每股年現金股利（元）</th>
            <th>配息頻率</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in stocks" :key="s.code">
            <td>
              <strong>{{ s.code }}</strong>
              <span v-if="!s.builtIn" class="tag">自訂</span>
              <span v-else-if="s.edited" class="tag edited">已修改</span>
            </td>
            <td>{{ s.name }}</td>
            <td class="r">
              <input
                :value="s.price"
                type="number"
                min="0"
                step="0.01"
                inputmode="decimal"
                @input="update(s.code, { price: asNumber($event.target.value) })"
              />
            </td>
            <td class="r">
              <input
                :value="s.dps"
                type="number"
                min="0"
                step="0.01"
                inputmode="decimal"
                @input="update(s.code, { dps: asNumber($event.target.value) })"
              />
            </td>
            <td>
              <select :value="s.freq" @change="update(s.code, { freq: $event.target.value })">
                <option v-for="f in FREQUENCIES" :key="f.value" :value="f.value">{{ f.label }}</option>
              </select>
            </td>
            <td>
              <button v-if="!s.builtIn" class="link danger" type="button" @click="removeCustom(s.code)">刪除</button>
              <button v-else-if="s.edited" class="link" type="button" @click="resetBuiltIn(s.code)">還原範例值</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <form class="card" @submit.prevent="submit">
      <h2>新增自訂標的</h2>
      <div class="form-row">
        <label>代號<input v-model="form.code" required placeholder="例如 2886" /></label>
        <label>名稱<input v-model="form.name" placeholder="例如 兆豐金" /></label>
        <label>股價<input v-model.number="form.price" type="number" min="0" step="0.01" inputmode="decimal" /></label>
        <label>每股年現金股利<input v-model.number="form.dps" type="number" min="0" step="0.01" inputmode="decimal" /></label>
        <label>
          配息頻率
          <select v-model="form.freq">
            <option v-for="f in FREQUENCIES" :key="f.value" :value="f.value">{{ f.label }}</option>
          </select>
        </label>
        <button class="primary" type="submit">新增</button>
      </div>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </section>
</template>
