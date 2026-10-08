# 台股股息換算

純前端小工具（Vite + Vue 3），資料只存在瀏覽器 localStorage，沒有後端。

- **持股換算**：輸入持有張數／零股，算出單次實領、一年實領、月均實領、殖利率
- **目標月息**：輸入想每月領多少，反推各標的最少要持有多少股、需要多少資金
- **標的資料**：自行修改股價、每股年現金股利、配息頻率（年／半年／季／月配），也能新增自訂標的
- 支援扣除二代健保補充保費（單次股利 ≥ 2 萬扣 2.11%）與每次 10 元匯費，皆可在畫面上調整

> 內建的股價與股利只是範例值，不是即時行情，請自行更新。僅供試算，不構成投資建議。

## 本機預覽

```bash
npm install
npm run dev
```

## 專案結構

```
src/lib/dividend.js     換算邏輯（純函式）
src/data/stocks.js      內建標的資料（未來串 API 只需要換這裡）
src/composables/        狀態與 localStorage 存取
src/components/         各分頁與表單元件
wrangler.jsonc          Cloudflare 靜態網站設定（部署 dist）
```

## 部署到 Cloudflare（Workers 靜態資源）

在 Cloudflare 後台連接此 GitHub repo，建置設定如下：

| 欄位 | 填入 |
| --- | --- |
| 組建命令 | `npm run build` |
| 部署命令 | `npx wrangler deploy` |

`wrangler.jsonc` 已指定部署 `./dist`，專案名稱為 `tw-dividend-calculator`。
