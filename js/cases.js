// 台灣急診醫學會 (TSEM) / TTAS 五級檢傷 / ACLS / ATLS 擬真臨床教案資料庫
window.ER_CASES = [
  {
    id: "case_stemi_rv",
    title: "個案一：急性下壁心肌梗塞合併右心室梗塞",
    subtitle: "Inferior Wall STEMI with Right Ventricular Infarction",
    patientName: "陳建國",
    age: 62,
    sex: "男",
    ttas: 1,
    arrivalMode: "119 救護車",
    bedId: "RESUS-1",
    avatarColor: "#ef4444",
    chiefComplaint: "突發胸口劇烈壓迫痛2小時，冒冷汗、輻射至左肩與下巴",
    triageNote: "62歲男性，有高血壓、抽菸史(30 pack-years)。2小時前搬貨時突發胸口如大石壓迫，VAS 9/10，伴隨噁心與全身冷汗。",
    initialVitals: {
      hr: 58,
      bpSys: 96,
      bpDia: 62,
      rr: 20,
      spo2: 95,
      bt: 36.4,
      gcs: "E4V5M6 (15)",
      rhythm: "stemi_inferior"
    },
    history: {
      S: "「醫師...我胸口好像被卡車壓住一樣，痛到下巴跟左手臂，一直冒冷汗想吐...」",
      A: "無已知藥物過敏 (NKDA)",
      M: "Amlodipine 5mg QD（不規則服藥）",
      P: "高血壓 10 年、高血脂，無冠心病史",
      L: "3 小時前吃便當，菸齡 30 年（每天一包）",
      E: "2 小時前在倉庫搬重物時突然發作，休息無法緩解"
    },
    physicalExam: {
      airway: "呼吸道暢通，能完整講話但表情痛苦",
      breathing: "雙側肺部呼吸音清澈 (Clear breath sounds bilaterally)，無囉音 (No rales)",
      circulation: "皮膚濕冷 (Cold & clammy)，頸靜脈怒張 (JVD +)，心音規則偏慢、無明顯心雜音",
      neuro: "意識清楚 GCS E4V5M6，雙側瞳孔 3mm/3mm 對光有反應，四肢肌力對稱",
      abdomen: "腹部柔軟無壓痛，周邊無水腫"
    },
    ecgData: {
      summary: "Sinus bradycardia (58 bpm), ST-segment elevation > 2mm in Leads II, III, aVF (Lead III > Lead II); Reciprocal ST depression in Leads I, aVL. Right-sided V4R shows 1.5mm ST elevation!",
      diagnosis: "急性下壁心肌梗塞合併右心室梗塞 (Inferior STEMI + RV Infarction)",
      waveformType: "stemi_inferior",
      v4rPositive: true,
      teachingNote: "【ECG 判讀重點】II, III, aVF 出現 ST 段上升（且 III > II），加上 I, aVL 鏡像 ST 下降，高度指向右冠狀動脈 (RCA) 近端阻塞；加做右側心電圖 V4R 見 ST 上升即可確診合併右心室梗塞！"
    },
    pocusData: {
      summary: "心臟超音波 (Cardiac POCUS)：右心室擴大 (RV dilation) 且游離壁收縮低下，下腔靜脈 (IVC) 飽滿 > 2.2cm，無心包膜積液，肺部超音波為 A-lines（無肺水腫）。",
      type: "rv_strain"
    },
    labs: {
      cbc: { WBC: "11.4 x10³/μL (H)", Hb: "14.6 g/dL", Plt: "235 x10³/μL" },
      chem: { Na: "138 mEq/L", K: "4.1 mEq/L", Cr: "1.1 mg/dL", Glucose: "162 mg/dL (H)" },
      cardiac: { "hs-Troponin I": "1.85 ng/mL (Critical High! <0.04)", "CK-MB": "42 U/L (H)", "BNP": "180 pg/mL" },
      abg: { pH: "7.37", PaCO2: "36 mmHg", PaO2: "82 mmHg", HCO3: "21 mmol/L", Lactate: "2.3 mmol/L (H)" }
    },
    attendingHint: "【主治醫師臨床提示】病人有典型心絞痛，請在 10 分鐘內完成 12導程心電圖 (12-Lead ECG)！注意其特徵：雙肺聽診乾淨但有頸靜脈怒張 (JVD) 且血壓偏低，這是典型的『右心室梗塞』表現！右心室極度依賴前負荷 (Preload)，千萬不可給予 NTG 舌下錠（會導致回心血量驟降而嚴重休克），應先給予生理食鹽水輸液補充前負荷，並立即給予雙抗血小板藥物 (Aspirin + Ticagrelor)、Heparin，啟動心導管室 (Primary PCI)！",
    requiredActions: [
      { id: "order_ecg", label: "10分鐘內完成 12導程心電圖 (含 V4R)", score: 20 },
      { id: "med_aspirin", label: "給予嚼碎 Aspirin 300mg PO", score: 15 },
      { id: "med_ticagrelor", label: "給予第二線抗血小板藥 Ticagrelor 180mg PO", score: 15 },
      { id: "med_heparin", label: "給予抗凝血劑 Heparin IV bolus", score: 10 },
      { id: "iv_ns_bolus", label: "給予 Normal Saline 500mL IV 維持右心室前負荷", score: 15 },
      { id: "disp_cath_lab", label: "緊急啟動心導管室 (Activate Primary PCI / Door-to-Balloon)", score: 25 }
    ],
    pitfalls: [
      {
        actionId: "med_ntg",
        message: "⚠️ 臨床陷阱觸發！患者合併右心室梗塞 (RV Infarction)，給予 NTG 擴張靜脈導致前負荷驟降，血壓崩盤至 58/34 mmHg！請立即給予大量生理食鹽水輸液急救！",
        vitalEffect: { bpSys: -36, bpDia: -26, hr: 15 },
        penalty: 25
      },
      {
        actionId: "disp_discharge",
        message: "❌ 嚴重醫療疏失！將急性 STEMI 病患直接出院，病患於急診大門口發生心室顫動 (VF)！",
        penalty: 60
      }
    ],
    correctDisposition: "disp_cath_lab",
    debriefText: "下壁心肌梗塞（Leads II, III, aVF ST上升）約有 30~50% 合併右心室梗塞。臨床三合一表現為：低血壓、頸靜脈怒張 (JVD)、雙側肺音清澈。處置核心為：絕對禁用硝酸鹽類 (NTG) 與嗎啡等降低前負荷藥物，應先以 Normal Saline 輸液提升右心輸出量，給予 DAPT (Aspirin 300mg + Ticagrelor 180mg) 並在 90 分鐘內完成心導管開通血管。"
  },

  {
    id: "case_septic_shock",
    title: "個案二：泌尿道感染合併敗血性休克",
    subtitle: "Urosepsis with Refractory Septic Shock (Hour-1 Bundle)",
    patientName: "林陳玉蘭",
    age: 78,
    sex: "女",
    ttas: 1,
    arrivalMode: "119 救護車 (安養院轉送)",
    bedId: "RESUS-2",
    avatarColor: "#f59e0b",
    chiefComplaint: "發燒畏寒一天、意識混亂、導尿管尿液混濁且血壓低",
    triageNote: "78歲女性，糖尿病與中風臥床病史，長期留置導尿管。今早照服員發現叫不醒、全身發燙且尿袋僅有少量濃濁血尿。",
    initialVitals: {
      hr: 128,
      bpSys: 76,
      bpDia: 42,
      rr: 26,
      spo2: 91,
      bt: 39.2,
      gcs: "E3V3M5 (11)",
      rhythm: "sinus_tachy"
    },
    history: {
      S: "病患呻吟、答非所問。隨行照服員表示：「阿嬤昨天開始食慾差，尿袋裡面的尿很濁還有點臭味，今天早上量體溫 39.2 度、人叫不太醒。」",
      A: "無藥物過敏",
      M: "Metformin 500mg BID, Aspirin 100mg QD",
      P: "第二型糖尿病、陳舊性腦梗塞長期臥床、神經性膀胱留置導尿管",
      L: "今晨 6 點灌食牛奶 100mL",
      E: "近兩日尿量減少，今日突然意識改變伴隨高燒"
    },
    physicalExam: {
      airway: "呼吸道尚暢通，呼吸急促",
      breathing: "雙側肺底少許粗囉音，RR 26 次/分",
      circulation: "四肢末梢溫暖但微血管充填時間延長 (CRT > 3 sec)，脈搏快而弱 (Bounding/Thready pulse)",
      neuro: "GCS E3V3M5，嗜睡混亂 (Delirium)，無明顯新增單側偏癱",
      abdomen: "恥骨上區壓痛 (Suprapubic tenderness)，右側肋脊角敲擊痛 (Right CVA knocking pain +)，尿袋內見混濁膿尿"
    },
    ecgData: {
      summary: "Sinus tachycardia (128 bpm), normal axis, no acute ST-T dynamic changes.",
      diagnosis: "竇性心搏過速 (Sinus Tachycardia secondary to fever & shock)",
      waveformType: "sinus_tachy",
      v4rPositive: false,
      teachingNote: "【ECG 判讀重點】呈現規律窄 QRS 波心搏過速 (128 bpm)，每一 QRS 前皆有 P 波，為典型敗血症與發燒引起的反應性竇性心搏過速，切勿誤打抗心律不整藥或電擊！"
    },
    pocusData: {
      summary: "床邊超音波 (POCUS)：左心室收縮極度亢進 (Hyperdynamic LV, Kissing papillary muscles)，下腔靜脈塌陷 (IVC < 1.0cm, 呼吸變異 > 50%)，右腎中度水腎 (Hydronephrosis)。",
      type: "septic_hyperdynamic"
    },
    labs: {
      cbc: { WBC: "24.8 x10³/μL (Critical H, Band 12%)", Hb: "11.2 g/dL", Plt: "92 x10³/μL (L)" },
      chem: { Na: "131 mEq/L (L)", K: "4.8 mEq/L", Cr: "2.6 mg/dL (H)", Glucose: "285 mg/dL (H)", Procalcitonin: "18.4 ng/mL (Critical H)" },
      cardiac: { "hs-Troponin I": "0.06 ng/mL", "CRP": "24.5 mg/dL (H)" },
      abg: { pH: "7.26 (Acidemia)", PaCO2: "28 mmHg", PaO2: "64 mmHg", HCO3: "13 mmol/L (L)", Lactate: "5.2 mmol/L (Critical High!)" }
    },
    attendingHint: "【主治醫師臨床提示】這是典型的敗血性休克 (Septic Shock)，請落實 Surviving Sepsis Campaign Hour-1 Bundle：\n1. 給氧改善 SpO2\n2. 抽血檢驗 Lactate 與兩套血液培養 (Blood Cultures x2) — 務必在打抗生素前先抽血培養！\n3. 快速給予晶體輸液 (Normal Saline 30 mL/kg) 復甦\n4. 1小時內投予廣效性靜脈抗生素 (Cefepime / Piperacillin-Tazobactam)\n5. 輸液後若平均動脈壓 (MAP) 仍 < 65 mmHg，立即啟用第一線升壓劑 Norepinephrine (Levophed) 並收治 ICU！",
    requiredActions: [
      { id: "proc_o2", label: "給予氧氣治療維持 SpO2 > 94%", score: 10 },
      { id: "lab_blood_culture", label: "投予抗生素前先抽兩套血液培養 (Blood Culture x2) 與 Lactate", score: 20 },
      { id: "iv_ns_bolus", label: "快速晶體輸液復甦 (30 mL/kg Normal Saline)", score: 20 },
      { id: "med_antibiotics", label: "1小時內給予廣效性抗生素 (Cefepime / Tazocin IV)", score: 20 },
      { id: "med_norepi", label: "啟用第一線升壓劑 Norepinephrine 維持 MAP ≥ 65 mmHg", score: 15 },
      { id: "disp_icu", label: "收治內科加護病房 (MICU Admission)", score: 15 }
    ],
    pitfalls: [
      {
        actionId: "proc_defib",
        message: "⚠️ 嚴重錯誤！病患為竇性心搏過速且有意識，給予非同步去顫電擊造成嚴重心肌損傷與痛苦！",
        vitalEffect: { hr: 20, bpSys: -15 },
        penalty: 35
      }
    ],
    correctDisposition: "disp_icu",
    debriefText: "敗血性休克 Hour-1 Bundle 五大核心：(1) 測量血中乳酸濃度 (Lactate 5.2 mmol/L 代表嚴重組織低灌流)；(2) 給予抗生素前先留取兩套血液培養；(3) 投予廣效性抗生素；(4) 針對低血壓或 Lactate ≥ 4 mmol/L 給予 30 mL/kg 晶體輸液；(5) 若輸液期間或之後仍低血壓，立即使用升壓劑 Norepinephrine 維持 MAP ≥ 65 mmHg。"
  },

  {
    id: "case_trauma_pneumo",
    title: "個案三：重大車禍外傷合併張力性氣胸與腹內出血",
    subtitle: "Blunt Trauma: Tension Pneumothorax + Positive e-FAST",
    patientName: "張宇翔",
    age: 24,
    sex: "男",
    ttas: 1,
    arrivalMode: "119 救護車 (創傷小組啟動)",
    bedId: "RESUS-1",
    avatarColor: "#dc2626",
    chiefComplaint: "機車高速自撞分隔島，呼吸極度窘迫、左側胸壁挫傷、休克",
    triageNote: "24歲男性，騎重機時速約 80 公里自撞水泥護欄，現場安全帽破裂、左胸與左上腹嚴重撞擊把手上。",
    initialVitals: {
      hr: 138,
      bpSys: 78,
      bpDia: 46,
      rr: 32,
      spo2: 83,
      bt: 35.8,
      gcs: "E3V3M5 (11)",
      rhythm: "sinus_tachy"
    },
    history: {
      S: "病患喘不過氣：「我...吸不到氣...左邊胸口跟肚子好痛...」",
      A: "不詳",
      M: "無",
      P: "平素健康年輕男性",
      L: "2 小時前晚餐",
      E: "30 分鐘前高速機車車禍，胸腹部直接撞擊車把"
    },
    physicalExam: {
      airway: "頸圈固定中，呼吸道有血水但尚可發聲，氣管明顯偏向右側 (Tracheal deviation to right)",
      breathing: "左側胸廓起伏消失、左側呼吸音完全消失 (Absent left breath sounds)、叩診呈過度反響音 (Hyperresonance)，皮下氣腫 (+)",
      circulation: "頸靜脈嚴重怒張 (Distended neck veins)，皮膚冰冷蒼白，骨盆擠壓測試穩定",
      neuro: "GCS E3V3M5 (11)，雙側瞳孔 3mm 等大對光有反應",
      abdomen: "左上腹大片安全帶/車把挫傷瘀青，全腹反彈痛與肌肉防衛性收縮 (Rebound tenderness & guarding)"
    },
    ecgData: {
      summary: "Sinus tachycardia (138 bpm), low voltage QRS complexes.",
      diagnosis: "竇性心搏過速合併低電位差 (張力性氣胸壓迫縱膈腔)",
      waveformType: "sinus_tachy",
      v4rPositive: false,
      teachingNote: "【ATLS 提醒】外傷休克病患出現低血壓、頸靜脈怒張、單側呼吸音消失，屬於『張力性氣胸 (Tension Pneumothorax)』臨床診斷，不應等待拍片，須立即針刺減壓！"
    },
    pocusData: {
      summary: "e-FAST 超音波：左胸無肺滑動徵象 (Absent lung sliding + Barcode sign in M-mode)；Morison's pouch 與脾腎空間 (Splenorenal recess) 呈現明顯游離積血 (Free fluid +++ 脾臟破裂出血)！",
      type: "fast_positive"
    },
    labs: {
      cbc: { WBC: "18.2 x10³/μL", Hb: "8.4 g/dL (Critical L)", Plt: "145 x10³/μL" },
      chem: { Na: "140 mEq/L", K: "4.3 mEq/L", Cr: "1.2 mg/dL", Glucose: "198 mg/dL" },
      cardiac: { "PT/INR": "1.35 (H)", "Fibrinogen": "140 mg/dL (L)" },
      abg: { pH: "7.21 (Severe Acidemia)", PaCO2: "48 mmHg", PaO2: "52 mmHg (Critical Hypoxemia)", HCO3: "16 mmol/L", Lactate: "6.4 mmol/L" }
    },
    attendingHint: "【主治醫師臨床提示】遵循 ATLS 初級評估 (ABCDE)！\n1. B (Breathing)：左側呼吸音消失 + 氣管偏右 + 休克 = 張力性氣胸！必須『立即』執行針刺減壓/胸管置放 (Needle Decompression / Chest Tube)，絕對不可在減壓前推去照 CT！\n2. C (Circulation)：執行 e-FAST 超音波確認腹腔內大出血（脾臟破裂），立即啟動大量輸血協定 (MTP: PRBC + FFP) 並給予止血藥 Tranexamic Acid (TXA 1g IV)！\n3. 生命徵象不穩定且 FAST 陽性，直接緊急會診外傷科進開刀房剖腹探查 (Emergent Laparotomy)！",
    requiredActions: [
      { id: "proc_o2", label: "給予高濃度氧氣 (Non-rebreather mask 100% O2)", score: 10 },
      { id: "proc_chest_tube", label: "立即執行左側針刺減壓與胸管置放 (Needle Decompression & Chest Tube)", score: 30 },
      { id: "exam_pocus", label: "執行床邊 e-FAST 超音波檢查偵測腹內出血", score: 15 },
      { id: "med_txa", label: "給予止血劑 Tranexamic Acid (TXA) 1g IV 與啟動大量輸血 (MTP)", score: 20 },
      { id: "disp_or", label: "緊急送開刀房進行剖腹探查止血 (Emergent Trauma Laparotomy)", score: 25 }
    ],
    pitfalls: [
      {
        actionId: "img_ct_brain",
        condition: "before_chest_tube",
        message: "⚠️ 致命陷阱（Death Donuts）！張力性氣胸尚未減壓且休克不穩定，直接將病患推去電腦斷層室導致途中發生無脈性電氣活動 (PEA Arrest)！",
        vitalEffect: { bpSys: -35, spo2: -15, hr: -40 },
        penalty: 40
      }
    ],
    correctDisposition: "disp_or",
    debriefText: "ATLS 外傷急救黃金法則：張力性氣胸為『臨床診斷』，一旦在 Primary Survey 的 B (Breathing) 發現單側呼吸音消失合併阻塞性休克，須立即減壓並置放胸管。減壓後血氧與部分血壓回升，但 e-FAST 顯示腹腔大量游離液體（脾臟撕裂傷出血），此時應給予 TXA 與大量輸血 (MTP)，並直接送開刀房止血，不可延誤於電腦斷層檢查。"
  },

  {
    id: "case_vf_acls",
    title: "個案四：到院前心肺功能停止 — 頑固型心室顫動 (ACLS)",
    subtitle: "OHCA with Refractory Ventricular Fibrillation (VF)",
    patientName: "王大明",
    age: 58,
    sex: "男",
    ttas: 1,
    arrivalMode: "119 救護車 (持續 CPR 中)",
    bedId: "RESUS-2",
    avatarColor: "#9333ea",
    chiefComplaint: "打羽球時突發倒地失去意識，無呼吸無脈搏 (OHCA)",
    triageNote: "58歲男性，20分鐘前於運動中心打羽球時突然倒地抽搐後失去反應。球友立即幫忙壓胸，119 到場 AED 判讀建議電擊 1 次，持續 LUCAS 壓胸送達急救室。",
    initialVitals: {
      hr: 0,
      bpSys: 0,
      bpDia: 0,
      rr: 0,
      spo2: 0,
      bt: 36.1,
      gcs: "E1V1M1 (3 - 無脈搏 OHCA)",
      rhythm: "vfib"
    },
    history: {
      S: "病患無意識、無呼吸、摸不到頸動脈搏動。隨行球友表示：「他打球前說胸口有點悶，結果剛上場五分鐘就突然倒下去沒有呼吸了！」",
      A: "不詳",
      M: "有高血壓與高膽固醇用藥",
      P: "高血壓、高血脂，父親有心肌梗塞病史",
      L: "午餐後 3 小時",
      E: "目擊倒地 (Witnessed arrest)，旁人立即 CPR"
    },
    physicalExam: {
      airway: "置入聲門上呼吸道中，無自主呼吸",
      breathing: "BVM 正壓給氧下雙側胸廓有起伏，ETCO2 18 mmHg",
      circulation: "摸不到頸動脈與股動脈脈搏 (Pulseless)，監視器顯示粗大不規則心室顫動波 (Coarse VF)",
      neuro: "GCS E1V1M1，雙側瞳孔 4.5mm 對光反應微弱",
      abdomen: "柔軟無外傷"
    },
    ecgData: {
      summary: "Chaotic, irregular deflections of varying amplitude without identifiable P waves, QRS complexes, or T waves.",
      diagnosis: "心室顫動 (Ventricular Fibrillation - Shockable Rhythm!)",
      waveformType: "vfib",
      v4rPositive: false,
      teachingNote: "【ACLS 判讀】心室顫動 (VF) 屬於可電擊心律 (Shockable Rhythm)！最高優先級為：高品質 CPR + 去顫電擊 (Biphasic 200J) + Epinephrine 1mg IV + 頑固型 VF 給予 Amiodarone 300mg IV！"
    },
    pocusData: {
      summary: "急救重點超音波 (CASA protocol)：心室呈現無效顫動 (Ventricular fibrillation)，無心包膜填塞 (No tamponade)，無右心室極度擴大。",
      type: "vfib_echo"
    },
    labs: {
      cbc: { WBC: "13.5 x10³/μL", Hb: "15.1 g/dL", Plt: "210 x10³/μL" },
      chem: { Na: "139 mEq/L", K: "4.2 mEq/L", Cr: "1.3 mg/dL", Glucose: "210 mg/dL" },
      cardiac: { "hs-Troponin I": "0.92 ng/mL (H)" },
      abg: { pH: "7.14", PaCO2: "56 mmHg", PaO2: "78 mmHg", HCO3: "17 mmol/L", Lactate: "7.8 mmol/L (Post-arrest)" }
    },
    attendingHint: "【主治醫師臨床提示】這是目擊倒地的 VF OHCA！請立即按照 AHA ACLS 流程執行：\n1. 立即開始高品質 CPR 並建立高級呼吸道 (插管/BVM)\n2. 監視器確認為 VF（可電擊心律）→ 立即執行去顫電擊 (Defibrillation 200J)\n3. 給予 Epinephrine 1mg IV push\n4. 針對持續/頑固型 VF 給予抗心律不整藥 Amiodarone 300mg IV push\n5. 恢復自發性循環 (ROSC) 後，完成 12導程心電圖並啟動心導管室 / 送往加護病房執行目標溫控治療 (TTM)！",
    requiredActions: [
      { id: "proc_cpr", label: "執行高品質心肺復甦術 (High-Quality CPR & Advanced Airway)", score: 20 },
      { id: "proc_defib", label: "立即雙相波去顫電擊 200J (Biphasic Defibrillation)", score: 25 },
      { id: "med_epi_iv", label: "給予 Epinephrine 1mg IV push (每3-5分鐘)", score: 20 },
      { id: "med_amiodarone", label: "給予 Amiodarone 300mg IV push 治療頑固型 VF", score: 20 },
      { id: "disp_cath_lab", label: "ROSC 後安排緊急心導管與加護病房復甦後照護 (Post-ROSC Care)", score: 15 }
    ],
    pitfalls: [
      {
        actionId: "med_ntg",
        message: "⚠️ 錯誤處置！OHCA 無脈搏病患給予舌下 NTG 完全無效且違背 ACLS 流程！",
        penalty: 20
      }
    ],
    correctDisposition: "disp_cath_lab",
    debriefText: "針對 VF / 無脈性 VT (pVT)，最影響存活率與神經學預後的是『高品質胸外按壓』與『早期去顫電擊』。電擊後立即壓胸 2 分鐘，給予 Epinephrine 1mg IV，若仍持續 VF，於第三次電擊後給予 Amiodarone 300mg IV push（或 Lidocaine）。達成 ROSC 後應立即做 12-lead ECG 評估是否需緊急心導管。"
  },

  {
    id: "case_stroke_tpa",
    title: "個案五：超急性期缺血性腦中風（黃金血栓溶解治療窗）",
    subtitle: "Acute Ischemic Stroke (NIHSS 14, Within 4.5-Hour tPA Window)",
    patientName: "趙文山",
    age: 68,
    sex: "男",
    ttas: 2,
    arrivalMode: "家屬開車急送",
    bedId: "OBS-1",
    avatarColor: "#3b82f6",
    chiefComplaint: "45分鐘前突然右側手腳完全無力、講話含糊不清、嘴角左歪",
    triageNote: "68歲男性，最後正常時間 (Last Known Normal) 為 45 分鐘前吃早餐時，突然筷子掉落、右側偏癱、無法完整表達語句。",
    initialVitals: {
      hr: 88,
      bpSys: 198,
      bpDia: 114,
      rr: 18,
      spo2: 97,
      bt: 36.6,
      gcs: "E4V2M6 (12 - 失語症)",
      rhythm: "afib"
    },
    history: {
      S: "家屬焦急表示：「45分鐘前爸爸還在吃燒餅，突然右手拿不住東西、右腳站不起來，講話只會發出單音！」",
      A: "無藥物過敏",
      M: "高血壓藥（未規則服用），無服用抗凝血劑 (No DOAC/Warfarin)",
      P: "高血壓、陣發性心房顫動 (Paroxysmal Afib)，近三個月無手術或出血史",
      L: "45 分鐘前早餐",
      E: "突發性神經學缺損，發作時間明確為 45 分鐘前"
    },
    physicalExam: {
      airway: "呼吸道暢通，有吞嚥困難風險 (NPO)",
      breathing: "雙側呼吸音正常",
      circulation: "心跳絕對不規則 (Irregularly irregular)，BP 198/114 mmHg",
      neuro: "NIHSS 14分：意識清醒但表達性失語、眼球偏左凝視、右側顏面麻痺、右側上下肢肌力 1/5 分、右側 Babinski sign (+)",
      abdomen: "無異常"
    },
    ecgData: {
      summary: "Irregularly irregular rhythm with absent P waves and fibrillatory baseline, ventricular rate ~88 bpm.",
      diagnosis: "心房顫動 (Atrial Fibrillation — 心因性腦栓塞元兇)",
      waveformType: "afib",
      v4rPositive: false,
      teachingNote: "【ECG 判讀重點】R-R 間距不規則且無明顯 P 波，為心房顫動 (Atrial Fibrillation)，容易在左心耳形成血栓打到左側大腦中動脈 (Left MCA occlusion)！"
    },
    pocusData: {
      summary: "床邊超音波：左心房擴大，頸動脈超音波無明顯主動脈剝離內膜瓣 (No intimal flap)。",
      type: "normal_echo"
    },
    labs: {
      cbc: { WBC: "7.8 x10³/μL", Hb: "14.2 g/dL", Plt: "215 x10³/μL" },
      chem: { Na: "139 mEq/L", K: "4.0 mEq/L", Cr: "1.0 mg/dL", "Fingerstick Glucose": "116 mg/dL (排除低血糖!)" },
      cardiac: { "PT/INR": "1.02 (正常)", "aPTT": "28.4 sec" },
      abg: { "Brain CT (無顯影)": "無顱內出血 (No ICH)，左側大腦中動脈高密度徵象 (Hyperdense Left MCA sign)" }
    },
    attendingHint: "【主治醫師臨床提示】急性中風黃金處置流程 (Stroke Code)：\n1. 先測指尖血糖排除低血糖模仿中風 (Stroke mimic)\n2. 緊急安排『腦部無顯影電腦斷層 (Non-contrast Brain CT)』排除腦出血\n3. 關鍵安全細節：病患在發作 4.5 小時內符合靜脈血栓溶解劑 (IV rt-PA / Alteplase) 適應症，但目前血壓高達 198/114 mmHg！施打 rt-PA 前『必須』先給予靜脈降壓藥 (Labetalol / Nicardipine IV) 將血壓降至 < 185/110 mmHg，否則直接打 rt-PA 會引發致命性腦出血！\n4. 降壓達標後給予 IV rt-PA 並會診神經內科 / 評估動脈取栓 (EVT)！",
    requiredActions: [
      { id: "lab_glucose", label: "立即檢測指尖血糖 (POC Glucose) 排除低血糖", score: 15 },
      { id: "img_ct_brain", label: "25分鐘內完成腦部無顯影電腦斷層 (Non-contrast Brain CT)", score: 25 },
      { id: "med_labetalol", label: "給予 Labetalol / Nicardipine IV 將血壓控制在 < 185/110 mmHg", score: 20 },
      { id: "med_tpa", label: "確認無禁忌症且血壓達標後，給予靜脈血栓溶解劑 IV rt-PA (Alteplase)", score: 25 },
      { id: "disp_stroke_icu", label: "啟動腦中風團隊收治中風加護病房 (Stroke ICU / EVT 評估)", score: 15 }
    ],
    pitfalls: [
      {
        actionId: "med_tpa",
        condition: "bp_too_high",
        message: "⚠️ 嚴重用藥安全警報！病患血壓仍高於 185/110 mmHg (目前 198/114)，未先降壓就直接施打 rt-PA 大幅增加症狀性顱內出血 (sICH) 風險！",
        vitalEffect: { bpSys: 10 },
        penalty: 30
      },
      {
        actionId: "med_aspirin",
        message: "⚠️ 臨床指引提醒：擬施打 IV rt-PA 的超急性缺血性中風患者，在打完 rt-PA 後 24 小時內應暫緩給予 Aspirin / Heparin，以免增加腦出血風險！",
        penalty: 15
      }
    ],
    correctDisposition: "disp_stroke_icu",
    debriefText: "急性缺血性腦中風黃金時間窗（< 4.5 小時）評估重點：(1) 立即檢測血糖排除低血糖；(2) 快速完成無顯影腦部 CT 排除腦出血；(3) 嚴格血壓管理：若擬給予 IV rt-PA，給藥前血壓必須控制在 < 185/110 mmHg，給藥後 24 小時維持 < 180/105 mmHg；(4) 24 小時內避免併用抗血小板或抗凝血劑。"
  },

  {
    id: "case_hyperkalemia",
    title: "個案六：致命性高血鉀症合併寬 QRS 波心搏過緩",
    subtitle: "Life-Threatening Hyperkalemia (K+ 7.6 mmol/L) with Sine-Wave Warning",
    patientName: "吳秀琴",
    age: 64,
    sex: "女",
    ttas: 1,
    arrivalMode: "家屬推輪椅衝入檢傷",
    bedId: "OBS-2",
    avatarColor: "#10b981",
    chiefComplaint: "洗腎病患連假未洗腎，今日全身癱軟無力、胸悶、心跳極慢",
    triageNote: "64歲女性，末期腎病變 (ESRD) 規律週一三五血液透析。因出遊漏洗一次且吃大量香蕉與橘子，今早雙下肢無力無法站立、頭暈。",
    initialVitals: {
      hr: 38,
      bpSys: 84,
      bpDia: 48,
      rr: 22,
      spo2: 96,
      bt: 36.3,
      gcs: "E4V5M6 (15)",
      rhythm: "hyperkalemia_wide"
    },
    history: {
      S: "「醫師...我全身一點力氣都沒有，手腳麻麻的，心臟好像快停了一樣...」",
      A: "無藥物過敏",
      M: "鈣片、降血壓藥、EPO",
      P: "末期腎病變 (ESRD on HD)、糖尿病、高血壓",
      L: "昨天吃了兩根香蕉與火鍋湯底",
      E: "已超過 4 天未洗腎，今日出現進行性對稱性四肢無力與心搏過緩"
    },
    physicalExam: {
      airway: "呼吸道暢通",
      breathing: "雙側肺底少許濕囉音 (Mild bibasilar crackles)，呼吸深快代償",
      circulation: "心跳極慢 (38 bpm)，左手臂有動靜脈瘻管 (AV fistula thrill +)",
      neuro: "意識清楚，但雙下肢近端肌力下降至 2/5 分，深部肌腱反射減弱 (Hyporeflexia)",
      abdomen: "無壓痛"
    },
    ecgData: {
      summary: "Severe bradycardia (38 bpm), absent P waves, markedly widened QRS complex (180 ms) merging with tall, narrow, peaked T waves ('Tenting' / pre-sine wave pattern).",
      diagnosis: "嚴重高血鉀心電圖變化 (Peaked T waves + Wide QRS approaching Sine Wave!)",
      waveformType: "hyperkalemia_wide",
      v4rPositive: false,
      teachingNote: "【ECG 救命判讀】高尖 T 波 (Tall peaked T)、P 波消失、QRS 波極度變寬接近正弦波 (Sine wave)！這是嚴重高血鉀隨時會演變成 VF / Asystole 的瀕死警訊！第一動必須立即給予『鈣離子 (Calcium Gluconate)』穩定心肌細胞膜，連等抽血報告都來不及！"
    },
    pocusData: {
      summary: "床邊超音波：下腔靜脈飽滿擴張 (Plethoric IVC)，雙側少量肋膜積水，心收縮速率極慢。",
      type: "normal_echo"
    },
    labs: {
      cbc: { WBC: "8.4 x10³/μL", Hb: "9.6 g/dL (腎性貧血)", Plt: "190 x10³/μL" },
      chem: { Na: "133 mEq/L", K: "7.6 mEq/L (Critical Lethal High!)", Cr: "11.4 mg/dL (H)", BUN: "98 mg/dL (H)", Glucose: "145 mg/dL" },
      cardiac: { "hs-Troponin I": "0.05 ng/mL" },
      abg: { pH: "7.24", PaCO2: "30 mmHg", PaO2: "88 mmHg", HCO3: "13 mmol/L", Lactate: "1.9 mmol/L" }
    },
    attendingHint: "【主治醫師臨床提示】洗腎病患出現四肢無力 + 心電圖高尖 T 波與寬 QRS 波 = 致命性高血鉀症 (K+ 7.6)！\n請依序執行高血鉀急救三部曲：\n1. 【護心（穩定心肌膜電位）】：立即靜脈注射 Calcium Gluconate (或 Calcium Chloride) IV — 這是唯一能立刻防止心室顫動的第一線處置！\n2. 【移鉀（將鉀離子移入細胞內）】：給予 Regular Insulin 10U + D50W IV（搭配 Bicarbonate / Beta-2 agonist 吸入）\n3. 【排鉀（真正移除體內鉀離子）】：緊急會診腎臟科安排緊急血液透析 (Emergent Hemodialysis)！",
    requiredActions: [
      { id: "order_ecg", label: "立即完成 12導程心電圖辨識高尖 T 波與寬 QRS 波", score: 15 },
      { id: "med_calcium", label: "第一時間給予 Calcium Gluconate 10% IV 穩定心肌細胞膜", score: 30 },
      { id: "med_insulin_d50", label: "給予 Regular Insulin 10U + D50W IV 將鉀離子移入細胞內", score: 25 },
      { id: "disp_dialysis", label: "緊急會診腎臟科啟動血液透析 (Emergent Hemodialysis)", score: 30 }
    ],
    pitfalls: [
      {
        actionId: "iv_kcl",
        message: "❌ 致命醫療錯誤！病患血鉀高達 7.6 mEq/L，給予靜脈鉀離子補充 (KCl) 直接導致心室顫動心跳停止！",
        vitalEffect: { hr: -38, bpSys: -84 },
        penalty: 60
      }
    ],
    correctDisposition: "disp_dialysis",
    debriefText: "嚴重高血鉀症合併心電圖寬 QRS 波時，絕不能只等抽血報告才動作！治療口訣『護心、移鉀、排鉀』：(1) Calcium Gluconate IV 在 1~3 分鐘內穩定心肌膜電位（雖不降血鉀但能救命）；(2) Insulin + Glucose 與 B2-agonist 在 15~30 分鐘內將 K+ 轉移進細胞；(3) 對無尿洗腎病患，緊急血液透析是最確實的排鉀手段。"
  },

  {
    id: "case_anaphylaxis",
    title: "個案七：急性過敏性休克合併上呼吸道水腫",
    subtitle: "Anaphylactic Shock with Laryngeal Edema",
    patientName: "陳雅婷",
    age: 29,
    sex: "女",
    ttas: 1,
    arrivalMode: "男友攙扶衝入急診",
    bedId: "OBS-3",
    avatarColor: "#ec4899",
    chiefComplaint: "聚餐吃到泰式海鮮酸辣湯後 15 分鐘，全身起紅疹、嘴唇腫脹、呼吸哮鳴、頭暈快昏倒",
    triageNote: "29歲女性，15分鐘前喝了含蝦醬的湯後全身劇癢、眼皮與嘴唇快速腫脹，隨後聲音變沙啞、呼吸困難、站立時眼前發黑。",
    initialVitals: {
      hr: 136,
      bpSys: 74,
      bpDia: 38,
      rr: 28,
      spo2: 88,
      bt: 36.7,
      gcs: "E4V4M6 (14)",
      rhythm: "sinus_tachy"
    },
    history: {
      S: "病患聲音沙啞微弱：「我...喉嚨好像縮起來了...喘不過氣...頭好暈...」",
      A: "甲殼類海鮮過敏 (曾有輕微蕁麻疹史)",
      M: "無",
      P: "氣喘病史、過敏性鼻炎",
      L: "20 分鐘前泰式餐廳聚餐",
      E: "誤食蝦膏湯底後快速出現皮膚、呼吸道與低血壓多系統過敏反應"
    },
    physicalExam: {
      airway: "嘴唇與懸雍垂明顯血管性水腫 (Angioedema)，吸氣期有喉鳴音 (Inspiratory Stridor)！",
      breathing: "雙側肺部瀰漫性呼氣喘鳴音 (Diffuse expiratory wheezing)",
      circulation: "皮膚潮紅佈滿膨疹 (Generalized urticaria & flushing)，血壓 74/38 mmHg，脈搏細快",
      neuro: "意識焦躁不安，頭暈瀕臨昏厥",
      abdomen: "輕微腹部絞痛"
    },
    ecgData: {
      summary: "Sinus tachycardia (136 bpm), normal QRS duration.",
      diagnosis: "竇性心搏過速 (過敏性休克血管擴張代償)",
      waveformType: "sinus_tachy",
      v4rPositive: false,
      teachingNote: "【ECG 判讀重點】規律窄波心搏過速，反映全身組織胺釋放導致血管擴張與血管通透性大增的分布性休克 (Distributive shock)。"
    },
    pocusData: {
      summary: "床邊超音波：下腔靜脈完全塌陷 (Flat IVC)，左心室高動力收縮（第三空間體液流失與血管擴張）。",
      type: "septic_hyperdynamic"
    },
    labs: {
      cbc: { WBC: "10.8 x10³/μL", Hb: "15.8 g/dL (血液濃縮 Hemoconcentration)", Plt: "260 x10³/μL" },
      chem: { Na: "138 mEq/L", K: "3.9 mEq/L", Cr: "0.8 mg/dL", Glucose: "132 mg/dL" },
      cardiac: { "Serum Tryptase": "46 ng/mL (Elevated)" },
      abg: { pH: "7.31", PaCO2: "42 mmHg", PaO2: "58 mmHg", HCO3: "20 mmol/L", Lactate: "3.4 mmol/L" }
    },
    attendingHint: "【主治醫師臨床提示】皮膚紅疹 + 呼吸道喘鳴/喉頭水腫 + 低血壓 = 典型過敏性休克 (Anaphylactic Shock)！\n最重要的救命關鍵：\n1. 立即給予『大腿外側肌肉注射 IM Epinephrine 0.3~0.5 mg (1:1000)』！千萬別把 OHCA 用的 1mg IV 靜脈直接推注打在還有脈搏的病人身上（會導致致命性心律不整與腦出血）！\n2. 同時給予高流量氧氣、大量生理食鹽水輸液補充血管內容積\n3. 輔助給予抗組織胺 (Diphenhydramine) + 類固醇 (Methylprednisolone) 預防雙相反應 (Biphasic reaction)，並留觀或收治加護病房監測呼吸道！",
    requiredActions: [
      { id: "med_epi_im", label: "立即給予大腿外側肌肉注射 Epinephrine 0.5mg IM (1:1000)", score: 35 },
      { id: "proc_o2", label: "給予高濃度氧氣與支氣管擴張蒸氣治療，備妥插管工具", score: 15 },
      { id: "iv_ns_bolus", label: "快速輸液 Normal Saline 1000mL IV 補充有效循環容積", score: 20 },
      { id: "med_steroid_antihist", label: "給予抗組織胺 Diphenhydramine + 類固醇 Solu-Medrol IV", score: 15 },
      { id: "disp_icu", label: "收治加護病房 / 急救留觀區密切監測呼吸道與雙相過敏反應", score: 15 }
    ],
    pitfalls: [
      {
        actionId: "med_epi_iv",
        message: "⚠️ 嚴重給藥途徑與劑量錯誤！對有脈搏的過敏性休克病患直接靜脈推注 Epinephrine 1mg IV bolus（OHCA 劑量），引發惡性高血壓危機與心室頻脈！過敏性休克第一線應使用 IM 0.3-0.5mg 肌肉注射！",
        vitalEffect: { hr: 45, bpSys: 110, bpDia: 60 },
        penalty: 35
      }
    ],
    correctDisposition: "disp_icu",
    debriefText: "過敏性休克 (Anaphylaxis) 唯一能迅速逆轉喉頭水腫、支氣管痙攣與血管擴張的救命藥物是『肌肉注射腎上腺素 (IM Epinephrine 0.3~0.5 mg 於大腿前外側股外側肌)』。抗組織胺與類固醇僅為第二線輔助藥物，起效太慢，絕不可取代 IM Epinephrine。臨床上最常見的失誤是遲疑不敢打 Epinephrine，或是誤將急救車 1mg IV 劑量直接靜脈推注。"
  },

  {
    id: "case_dka_hypok",
    title: "個案八：糖尿病酮酸中毒合併低血鉀陷阱 (DKA)",
    subtitle: "Severe Diabetic Ketoacidosis with Initial Hypokalemia (K+ 3.0 mmol/L)",
    patientName: "林柏叡",
    age: 22,
    sex: "男",
    ttas: 2,
    arrivalMode: "室友陪同就醫",
    bedId: "OBS-1",
    avatarColor: "#06b6d4",
    chiefComplaint: "劇烈噁心嘔吐、全腹悶痛一天、呼吸深快、極度口渴與嗜睡",
    triageNote: "22歲男大生，第一型糖尿病病史。期末考熬夜加上感冒，自行停打胰島素兩天，今日嘔吐超過 10 次、喘不過氣。",
    initialVitals: {
      hr: 122,
      bpSys: 98,
      bpDia: 58,
      rr: 30,
      spo2: 98,
      bt: 37.1,
      gcs: "E3V4M6 (13)",
      rhythm: "sinus_tachy"
    },
    history: {
      S: "「我肚子好痛、一直吐...嘴巴好乾、喝水也吐...整個人沒力氣...」",
      A: "無藥物過敏",
      M: "Insulin Glargine + Insulin Aspart（近兩日因沒食慾自行停用）",
      P: "第一型糖尿病 (Type 1 DM)",
      L: "24 小時內幾乎無法進食",
      E: "感冒加上停打基礎胰島素，引發嚴重高血糖與酮酸中毒"
    },
    physicalExam: {
      airway: "呼吸道暢通，呼氣帶有明顯爛蘋果/水果甜味 (Fruity acetone breath)",
      breathing: "典型深且快的代償性呼吸 (Kussmaul breathing, RR 30/min)，雙肺聽診清澈",
      circulation: "皮膚與口腔黏膜極度乾燥、眼窩凹陷 (Severe dehydration)，心跳 122 bpm",
      neuro: "嗜睡但可喚醒 (GCS 13)，無局部神經學缺損",
      abdomen: "瀰漫性輕度壓痛，無反彈痛（DKA 常見假性急腹症）"
    },
    ecgData: {
      summary: "Sinus tachycardia (122 bpm), flattened T waves and prominent U waves in precordial leads V2-V4.",
      diagnosis: "竇性心搏過速合併低血鉀 U 波 (Prominent U waves — Hypokalemia!)",
      waveformType: "sinus_tachy",
      v4rPositive: false,
      teachingNote: "【ECG 與電解質警報】雖然患者嚴重酸中毒，但因為嚴重滲透性利尿與嘔吐，體內總鉀量嚴重流失，心電圖已出現平坦 T 波與 U 波（代表低血鉀）！"
    },
    pocusData: {
      summary: "床邊超音波：下腔靜脈極度塌陷 (IVC < 0.8cm)，顯示嚴重容積缺失 (Severe hypovolemia)；腹部無膽囊炎或闌尾炎。",
      type: "septic_hyperdynamic"
    },
    labs: {
      cbc: { WBC: "16.5 x10³/μL (壓力性白血球升高)", Hb: "16.2 g/dL", Plt: "310 x10³/μL" },
      chem: { Na: "128 mEq/L (假性低血鈉)", K: "3.0 mEq/L (Critical Low! <3.3)", Cr: "1.5 mg/dL (腎前性 AKI)", Glucose: "568 mg/dL (Critical High!)" },
      cardiac: { "Serum Beta-Hydroxybutyrate": "6.2 mmol/L (Critical High!)", "Anion Gap": "26 mEq/L (High AG)" },
      abg: { pH: "7.11 (Severe Metabolic Acidosis)", PaCO2: "18 mmHg (呼吸代償)", PaO2: "98 mmHg", HCO3: "6 mmol/L (Critical L)", Lactate: "2.1 mmol/L" }
    },
    attendingHint: "【主治醫師臨床提示】高血糖 (568) + 高陰離子間隙代謝性酸中毒 (pH 7.11, HCO3 6) + 血酮升高 = 嚴重糖尿病酮酸中毒 (DKA)！\n⚠️ 魔鬼藏在細節裡：請看抽血的鉀離子 K+ 只有 3.0 mEq/L（低於 3.3 mEq/L）！\n如果現在直接開立 Insulin，胰島素會把血液中僅存的鉀離子全部趕進細胞內，導致血鉀瞬間跌破 2.0 引發致命心律不整 (VT/VF)！\n正確順序：\n1. 先給予大量生理食鹽水輸液 (Normal Saline)\n2. 先補充靜脈鉀離子 (KCl IV) 將 K+ 拉升至 > 3.3 mEq/L\n3. 補鉀後才開始持續靜脈胰島素滴注 (Regular Insulin IV pump) 並收治 ICU！",
    requiredActions: [
      { id: "lab_glucose", label: "檢測血糖、血酮、ABG 與電解質確認 DKA 診斷", score: 15 },
      { id: "iv_ns_bolus", label: "第一時間給予大量 Normal Saline 1000-1500mL IV 矯正嚴重脫水", score: 25 },
      { id: "iv_kcl", label: "因初始 K+ < 3.3 (3.0 mEq/L)，在給 Insulin 前先給予 KCl IV 補鉀", score: 30 },
      { id: "med_insulin_pump", label: "補鉀後啟用 Regular Insulin 0.1 U/kg/hr IV 持續滴注", score: 15 },
      { id: "disp_icu", label: "收治內科加護病房 (MICU) 每小時監測血糖與電解質", score: 15 }
    ],
    pitfalls: [
      {
        actionId: "med_insulin_pump",
        condition: "before_kcl",
        message: "⚠️ 致命臨床陷阱觸發！患者初始血鉀僅 3.0 mEq/L (< 3.3)，未先補鉀就直接打 Insulin 導致嚴重低血鉀 (K+ 降至 2.1)，誘發多型性心室頻脈 (Torsades de Pointes)！請立即停用 Insulin 並緊急補鉀！",
        vitalEffect: { hr: 48, bpSys: -30 },
        penalty: 35
      }
    ],
    correctDisposition: "disp_icu",
    debriefText: "DKA 治療三大支柱為『補水 (Fluid)、補鉀 (Potassium)、胰島素 (Insulin)』。根據 ADA 國際治療指引，DKA 病患體內總鉀量嚴重虧損，若抽血初始 K+ < 3.3 mEq/L，必須『暫緩給予胰島素』，先給予 Normal Saline 輸液與每小時 20~40 mEq KCl 補充，待 K+ ≥ 3.3 mEq/L 後才能開始靜脈胰島素滴注，否則極易因嚴重低血鉀致死。"
  }
];

// 醫囑與處置資料庫 (CPOE Actions Catalog)
window.ER_ACTIONS = {
  exams: [
    { id: "exam_history", name: "詳細病史詢問 (SAMPLE)", category: "評估與理學檢查", timeCost: 1, icon: "💬", desc: "詢問症狀、過敏史、用藥、過去病史與發作經過" },
    { id: "exam_physical", name: "全身理學檢查 (ABCDE)", category: "評估與理學檢查", timeCost: 1, icon: "🩺", desc: "呼吸道、呼吸音聽診、頸靜脈、心音、神經學 NIHSS 與腹部檢查" },
    { id: "order_ecg", name: "12導程心電圖 (含右側 V4R)", category: "評估與理學檢查", timeCost: 2, icon: "📈", desc: "床邊立即執行 12-Lead ECG 與 V4R 判讀 ST 段與心律變化" },
    { id: "exam_pocus", name: "床邊重點超音波 (POCUS / e-FAST)", category: "評估與理學檢查", timeCost: 3, icon: "🔊", desc: "探查心包膜、右心室應變、IVC 飽滿度、肺滑動與腹腔游離積血" }
  ],
  labs_imaging: [
    { id: "lab_glucose", name: "床邊指尖血糖 + 急診全套抽血 (CBC/生化/Troponin/ABG)", category: "檢驗與影像", timeCost: 2, icon: "🩸", desc: "立即檢測血糖、電解質 (Na/K)、腎功能、Troponin I、動脈血氣體與血酮" },
    { id: "lab_blood_culture", name: "兩套血液培養 + 乳酸 (Blood Culture x2 & Lactate)", category: "檢驗與影像", timeCost: 2, icon: "🧪", desc: "敗血症 Hour-1 Bundle 必備，須於抗生素給藥前採檢" },
    { id: "img_ct_brain", name: "緊急無顯影腦部/胸腹電腦斷層 (Emergent CT)", category: "檢驗與影像", timeCost: 5, icon: "☢️", desc: "需將病患推至放射科 CT 室，注意生命徵象不穩定者有運送風險！" }
  ],
  procedures_iv: [
    { id: "proc_o2", name: "高流量氧氣 / 呼吸道處置 (O2 / BVM)", category: "急救處置與輸液", timeCost: 1, icon: "😷", desc: "提供非再吸入型面罩 100% O2 或正壓通氣改善低血氧" },
    { id: "proc_cpr", name: "高品質心肺復甦術 + 插管 (CPR & Intubation)", category: "急救處置與輸液", timeCost: 2, icon: "🫀", desc: "針對 OHCA 病患執行持續壓胸與建立高級呼吸道" },
    { id: "proc_defib", name: "雙相波去顫電擊 200J (Biphasic Defibrillation)", category: "急救處置與輸液", timeCost: 1, icon: "⚡", desc: "針對 VF / 無脈性 VT 執行去顫電擊" },
    { id: "proc_chest_tube", name: "針刺減壓與胸管置放 (Needle Decompression / Chest Tube)", category: "急救處置與輸液", timeCost: 3, icon: "🪡", desc: "針對張力性氣胸立即排出胸廓高壓氣體，解除阻塞性休克" },
    { id: "iv_ns_bolus", name: "大量生理食鹽水輸液 (0.9% Normal Saline Bolus)", category: "急救處置與輸液", timeCost: 2, icon: "💧", desc: "快速輸注晶體溶液 500~1500mL 擴充有效循環容積" },
    { id: "iv_kcl", name: "靜脈氯化鉀補充 (KCl IV Infusion)", category: "急救處置與輸液", timeCost: 2, icon: "🧪", desc: "針對嚴重低血鉀 (K+ < 3.3) 進行靜脈補鉀" }
  ],
  medications: [
    { id: "med_aspirin", name: "Aspirin 300mg PO (嚼碎吞服)", category: "急診關鍵藥物", timeCost: 1, icon: "💊", desc: "ACS / STEMI 第一線抗血小板藥物" },
    { id: "med_ticagrelor", name: "Ticagrelor (Brilinta) 180mg PO", category: "急診關鍵藥物", timeCost: 1, icon: "💊", desc: "ACS 雙重抗血小板 (DAPT) P2Y12 抑制劑" },
    { id: "med_heparin", name: "Unfractionated Heparin IV Bolus", category: "急診關鍵藥物", timeCost: 1, icon: "💉", desc: "急性冠心症抗凝血治療" },
    { id: "med_ntg", name: "NTG (Nitroglycerin) 0.6mg 舌下錠", category: "急診關鍵藥物", timeCost: 1, icon: "⚠️", desc: "擴張靜脈降低前負荷緩解胸痛（右心室梗塞或低血壓絕對禁用！）" },
    { id: "med_antibiotics", name: "廣效性抗生素 (Cefepime / Tazocin IV)", category: "急診關鍵藥物", timeCost: 2, icon: "💉", desc: "敗血性休克黃金一小時經驗性抗生素" },
    { id: "med_norepi", name: "Norepinephrine (Levophed) IV Pump", category: "急診關鍵藥物", timeCost: 2, icon: "📈", desc: "敗血性與休克第一線升壓劑，目標維持 MAP ≥ 65 mmHg" },
    { id: "med_epi_iv", name: "Epinephrine 1mg IV Push (1:10000)", category: "急診關鍵藥物", timeCost: 1, icon: "🚨", desc: "ACLS 心跳停止 (OHCA) 專用靜脈強心升壓藥（有脈搏者禁用 IV Bolus！）" },
    { id: "med_epi_im", name: "Epinephrine 0.5mg IM 大腿肌肉注射 (1:1000)", category: "急診關鍵藥物", timeCost: 1, icon: "🦵", desc: "過敏性休克 (Anaphylaxis) 唯一第一線救命給藥途徑" },
    { id: "med_amiodarone", name: "Amiodarone 300mg IV Push", category: "急診關鍵藥物", timeCost: 1, icon: "💉", desc: "ACLS 頑固型 VF / pVT 抗心律不整首選" },
    { id: "med_txa", name: "Tranexamic Acid (TXA) 1g IV + 大量輸血協定 (MTP)", category: "急診關鍵藥物", timeCost: 2, icon: "🩸", desc: "重大外傷出血 3 小時內抗纖溶止血與 1:1:1 輸血" },
    { id: "med_labetalol", name: "Labetalol 20mg IV / Nicardipine Pump", category: "急診關鍵藥物", timeCost: 2, icon: "📉", desc: "急性腦中風施打 rt-PA 前將血壓平穩降至 < 185/110 mmHg" },
    { id: "med_tpa", name: "IV Alteplase (rt-PA) 0.9 mg/kg 血栓溶解劑", category: "急診關鍵藥物", timeCost: 3, icon: "🧠", desc: "發作 4.5 小時內缺血性腦中風靜脈溶栓治療（須先排除腦出血並控制血壓）" },
    { id: "med_calcium", name: "Calcium Gluconate 10% 30mL IV", category: "急診關鍵藥物", timeCost: 1, icon: "🛡️", desc: "嚴重高血鉀症第一線穩定心肌細胞膜，預防 VF/Asystole" },
    { id: "med_insulin_d50", name: "Regular Insulin 10U + D50W 50mL IV", category: "急診關鍵藥物", timeCost: 2, icon: "⬇️", desc: "高血鉀症將鉀離子快速驅入細胞內" },
    { id: "med_insulin_pump", name: "Regular Insulin 0.1 U/kg/hr IV Pump", category: "急診關鍵藥物", timeCost: 2, icon: "📟", desc: "DKA 持續靜脈胰島素滴注（注意：K+ < 3.3 時必須先補鉀！）" },
    { id: "med_steroid_antihist", name: "Diphenhydramine + Solu-Medrol IV", category: "急診關鍵藥物", timeCost: 1, icon: "💉", desc: "過敏性休克第二線抗組織胺與類固醇輔助治療" }
  ],
  dispositions: [
    { id: "disp_cath_lab", name: "啟動心導管室 (Primary PCI / Cath Lab)", icon: "❤️‍🔥", desc: "STEMI 或心因性 OHCA ROSC 後緊急冠狀動脈介入治療" },
    { id: "disp_icu", name: "收治內科加護病房 (MICU Admission)", icon: "🏥", desc: "敗血性休克、DKA、嚴重過敏性休克重症監護" },
    { id: "disp_or", name: "會診外傷科直送開刀房 (Emergent Trauma OR)", icon: "🔪", desc: "外傷腹內大出血 (FAST 陽性且不穩定) 緊急剖腹止血" },
    { id: "disp_stroke_icu", name: "會診神經內科收治腦中風加護病房 (Stroke ICU / EVT)", icon: "🧠", desc: "急性缺血性中風溶栓後監護與評估機械取栓" },
    { id: "disp_dialysis", name: "會診腎臟科緊急血液透析 (Emergent Hemodialysis)", icon: "🩸", desc: "頑固性或致命性高血鉀、尿毒症緊急洗腎" },
    { id: "disp_discharge", name: "開立口服藥直接出院 (Discharge Home)", icon: "🚪", desc: "確認無危急病況後讓病患返家休養（危急個案切勿誤選！）" }
  ]
};
