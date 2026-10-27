# 急診住院醫師臨床模擬遊戲 2D (ER Resident Clinical Simulator)

結合**台灣急診醫學會 (TSEM) OSCE 教案標準**、**台灣五級檢傷分類 (TTAS)**、**AHA ACLS**、**ATLS 外傷初級評估**與 **Surviving Sepsis Campaign (敗血症黃金一小時指引)** 的 2D 俯視角急診臨床決策模擬遊戲。

## 特色功能
- **2D 俯視角急診室探索**：支援 `W/A/S/D`、方向鍵或滑鼠點擊尋路移動，包含救護車檢傷區、急救復甦室 (Resus 1-2)、急性留觀區 (Obs 1-3)、中央護理站與放射 CT 室。
- **擬真生理監視器 (IntelliVue Style)**：即時繪製 Lead II 心電圖波形（VF、寬 QRS 高血鉀波、下壁 STEMI、心房顫動、竇性心搏過速）與 SpO₂ 血氧容積波。
- **12導程心電圖 (含 V4R) 與床邊超音波 (POCUS / e-FAST)**：內建粉紅方格紙 12-Lead ECG 判讀與動態扇形超音波掃描（Morison's pouch 游離積血、右心室擴大、IVC 塌陷等）。
- **8 大經典急重症臨床教案與臨床陷阱 (Pitfalls)**：
  1. 急性下壁心肌梗塞合併右心室梗塞（Inferior STEMI + RV Infarction — 禁用 NTG 陷阱）
  2. 泌尿道感染合併敗血性休克（Urosepsis — Hour-1 Bundle）
  3. 重大車禍外傷：張力性氣胸合併腹內出血（ATLS Primary Survey & e-FAST — 減壓前禁送 CT 陷阱）
  4. 運動中心目擊倒地 OHCA：頑固型心室顫動（Refractory VF — ACLS 流程）
  5. 超急性期缺血性腦中風（Acute Ischemic Stroke — 施打 rt-PA 前血壓控制 `< 185/110 mmHg`）
  6. 致命性高血鉀症瀕臨正弦波（Severe Hyperkalemia `K+ 7.6` — 護心、移鉀、排鉀三部曲）
  7. 急性過敏性休克合併上呼吸道水腫（Anaphylactic Shock — 大腿外側 IM Epinephrine vs IV 陷阱）
  8. 嚴重糖尿病酮酸中毒合併低血鉀陷阱（Severe DKA with Initial `K+ 3.0` — 補鉀前禁給 Insulin 陷阱）

## 開始遊玩
直接以瀏覽器開啟 `index.html`，或透過 GitHub Pages 線上遊玩。
