// 2D 急診室場景引擎、角色移動、動態生理反應與臨床決策系統
(function () {
  const BED_LAYOUT = [
    { id: "RESUS-1", label: "急救床 Resus 1", zone: "急救復甦區", x: 210, y: 120, w: 125, h: 85, color: "#ef4444" },
    { id: "RESUS-2", label: "急救床 Resus 2", zone: "急救復甦區", x: 375, y: 120, w: 125, h: 85, color: "#ef4444" },
    { id: "OBS-1", label: "留觀床 Obs 1", zone: "急性留觀區", x: 600, y: 120, w: 115, h: 85, color: "#3b82f6" },
    { id: "OBS-2", label: "留觀床 Obs 2", zone: "急性留觀區", x: 745, y: 120, w: 115, h: 85, color: "#3b82f6" },
    { id: "OBS-3", label: "留觀床 Obs 3", zone: "急性留觀區", x: 890, y: 120, w: 115, h: 85, color: "#3b82f6" }
  ];

  const ZONES = [
    { name: "119 救護車與檢傷分類區 (TTAS Triage)", x: 20, y: 65, w: 155, h: 430, bg: "rgba(30, 41, 59, 0.85)", border: "#f59e0b" },
    { name: "急救復甦室 (Resuscitation Zone)", x: 190, y: 65, w: 335, h: 210, bg: "rgba(69, 10, 10, 0.45)", border: "#ef4444" },
    { name: "急診留觀診療區 (Observation Zone)", x: 545, y: 65, w: 485, h: 210, bg: "rgba(15, 23, 42, 0.75)", border: "#3b82f6" },
    { name: "中央護理站與醫囑中心 (Nursing Station)", x: 190, y: 300, w: 510, h: 195, bg: "rgba(15, 23, 42, 0.85)", border: "#10b981" },
    { name: "急診影像與檢驗科 (CT / Stat Lab)", x: 720, y: 300, w: 310, h: 195, bg: "rgba(23, 37, 84, 0.55)", border: "#06b6d4" }
  ];

  const state = {
    currentCaseIndex: 0,
    activePatients: [], // Instances on beds
    selectedPatient: null,
    totalScore: 0,
    casesCompleted: 0,
    shiftMinutes: 480, // 08:00 AM start
    keys: {},
    player: {
      x: 440,
      y: 365,
      targetX: null,
      targetY: null,
      speed: 3.6,
      dir: "up",
      name: "林醫師 (ER R2)"
    },
    npcs: [
      { name: "資深檢傷護理師", x: 95, y: 245, color: "#f472b6", role: "TTAS 檢傷" },
      { name: "陳主治醫師 (VS)", x: 350, y: 395, color: "#fbbf24", role: "臨床指導" },
      { name: "專科護理師 NP", x: 540, y: 395, color: "#34d399", role: "急救支援" },
      { name: "放射師", x: 865, y: 405, color: "#38bdf8", role: "CT 執行" }
    ],
    tick: 0,
    monitorSweepX: 0,
    monitorBufferEcg: new Array(360).fill(0),
    monitorBufferSpo2: new Array(360).fill(0),
    activeTab: "tab_assess"
  };

  // 建立病患執行個體
  function instantiatePatient(caseTemplate, customBedId) {
    const bedId = customBedId || caseTemplate.bedId;
    return {
      caseId: caseTemplate.id,
      template: caseTemplate,
      bedId: bedId,
      vitals: JSON.parse(JSON.stringify(caseTemplate.initialVitals)),
      completedActions: new Set(),
      triggeredPitfalls: new Set(),
      unlockedInfo: {
        history: false,
        physical: false,
        ecg: false,
        pocus: false,
        labs: false,
        bloodCulture: false,
        ctDone: false
      },
      flags: {
        chestTubeDone: false,
        bpControlled: false,
        kclGiven: false,
        roscAchieved: false
      },
      logs: [
        {
          time: formatShiftTime(state.shiftMinutes),
          type: "info",
          text: `【檢傷 TTAS 第 ${caseTemplate.ttas} 級】${caseTemplate.patientName} (${caseTemplate.age}${caseTemplate.sex}) 入住 ${bedId}：${caseTemplate.chiefComplaint}`
        }
      ],
      status: "active" // active | resolved
    };
  }

  function formatShiftTime(mins) {
    const h = Math.floor(mins / 60) % 24;
    const m = Math.floor(mins % 60);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  // 載入指定臨床教案組合至急診室病床
  window.loadScenarioSet = function (primaryIndex = 0) {
    state.activePatients = [];
    const primaryCase = window.ER_CASES[primaryIndex % window.ER_CASES.length];
    const secondaryCase = window.ER_CASES[(primaryIndex + 1) % window.ER_CASES.length];
    const tertiaryCase = window.ER_CASES[(primaryIndex + 4) % window.ER_CASES.length];

    // 分配不重複床位
    const p1 = instantiatePatient(primaryCase, "RESUS-1");
    const p2 = instantiatePatient(secondaryCase, "RESUS-2");
    const p3 = instantiatePatient(tertiaryCase, "OBS-1");

    state.activePatients.push(p1, p2, p3);
    state.currentCaseIndex = primaryIndex;
    updateHud();
    renderPatientQueueBar();
  };

  // 載入單一指定教案並直接開啟或移動過去
  window.selectSpecificCase = function (index, openImmediately = true) {
    const chosen = window.ER_CASES[index];
    if (!chosen) return;
    // Check if already on a bed
    let existing = state.activePatients.find((p) => p.caseId === chosen.id && p.status === "active");
    if (!existing) {
      // Put on its preferred bed or RESUS-1
      const targetBed = chosen.bedId || "RESUS-1";
      state.activePatients = state.activePatients.filter((p) => p.bedId !== targetBed);
      existing = instantiatePatient(chosen, targetBed);
      state.activePatients.unshift(existing);
    }
    const bed = BED_LAYOUT.find((b) => b.id === existing.bedId);
    if (bed) {
      state.player.targetX = bed.x + bed.w / 2;
      state.player.targetY = bed.y + bed.h + 26;
    }
    updateHud();
    renderPatientQueueBar();
    if (openImmediately) {
      openBedsideModal(existing);
    }
  };

  // 更新頂部資訊列
  function updateHud() {
    const scoreEl = document.getElementById("hud-score");
    const clockEl = document.getElementById("hud-clock");
    const countEl = document.getElementById("hud-active-count");
    if (scoreEl) scoreEl.textContent = state.totalScore;
    if (clockEl) clockEl.textContent = formatShiftTime(state.shiftMinutes);
    if (countEl) {
      const activeCount = state.activePatients.filter((p) => p.status === "active").length;
      countEl.textContent = `${activeCount} 床待處置`;
    }
  }

  // 渲染上方病床快速切換卡片列
  function renderPatientQueueBar() {
    const container = document.getElementById("patient-cards-bar");
    if (!container) return;
    container.innerHTML = "";

    state.activePatients.forEach((pt) => {
      const card = document.createElement("div");
      card.className = `pt-mini-card ttas-${pt.template.ttas} ${
        state.selectedPatient && state.selectedPatient.bedId === pt.bedId ? "active-card" : ""
      }`;
      const bpStr = pt.vitals.hr === 0 ? "OHCA 無脈搏" : `BP ${pt.vitals.bpSys}/${pt.vitals.bpDia} | HR ${pt.vitals.hr}`;
      card.innerHTML = `
        <div class="pt-mini-header">
          <span class="bed-badge">${pt.bedId}</span>
          <span class="ttas-badge">TTAS ${pt.template.ttas}級</span>
        </div>
        <div class="pt-mini-name">${pt.template.patientName} (${pt.template.age}${pt.template.sex})</div>
        <div class="pt-mini-cc">${pt.template.chiefComplaint.slice(0, 22)}...</div>
        <div class="pt-mini-vitals">${bpStr} | SpO₂ ${pt.vitals.spo2}%</div>
      `;
      card.addEventListener("click", () => {
        const bed = BED_LAYOUT.find((b) => b.id === pt.bedId);
        if (bed) {
          state.player.targetX = bed.x + bed.w / 2;
          state.player.targetY = bed.y + bed.h + 24;
        }
        openBedsideModal(pt);
      });
      container.appendChild(card);
    });
  }

  // 2D 急診室平面圖繪製
  function renderERMap() {
    const canvas = document.getElementById("er-map-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;

    // 1. 醫院地板網格
    ctx.fillStyle = "#0b1120";
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "rgba(51, 65, 85, 0.35)";
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // 2. 繪製各大醫療分區
    ZONES.forEach((z) => {
      ctx.fillStyle = z.bg;
      ctx.strokeStyle = z.border;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(z.x, z.y, z.w, z.h, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#e2e8f0";
      ctx.font = "bold 13px 'Noto Sans TC', sans-serif";
      ctx.fillText(z.name, z.x + 12, z.y + 24);
    });

    // 3. 119 救護車閃燈特效 (左側入口)
    const flashRed = Math.floor(state.tick / 15) % 2 === 0;
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(35, 110, 120, 68);
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(35, 136, 120, 14);
    ctx.fillStyle = flashRed ? "#ef4444" : "#3b82f6";
    ctx.beginPath();
    ctx.arc(140, 122, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = !flashRed ? "#ef4444" : "#3b82f6";
    ctx.beginPath();
    ctx.arc(140, 164, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("119 救護車入口", 46, 130);

    // 4. 繪製 CT 掃描儀圓環 (右下放射科)
    ctx.save();
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(880, 395, 36, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(862, 395, 36, 65);
    ctx.fillStyle = "#bae6fd";
    ctx.font = "bold 12px monospace";
    ctx.fillText("64-Slice CT", 844, 348);
    ctx.restore();

    // 5. 繪製病床與床位上的病患
    BED_LAYOUT.forEach((bed) => {
      const pt = state.activePatients.find((p) => p.bedId === bed.id && p.status === "active");

      // 病床外框
      ctx.fillStyle = pt ? "rgba(30, 41, 59, 0.95)" : "rgba(15, 23, 42, 0.6)";
      ctx.strokeStyle = pt ? bed.color : "#475569";
      ctx.lineWidth = pt ? 2.5 : 1.5;
      ctx.beginPath();
      ctx.roundRect(bed.x, bed.y, bed.w, bed.h, 8);
      ctx.fill();
      ctx.stroke();

      // 枕頭與床單
      ctx.fillStyle = "#e2e8f0";
      ctx.fillRect(bed.x + 12, bed.y + 10, 32, 16);
      ctx.fillStyle = pt ? "#1e3a8a" : "#1e293b";
      ctx.fillRect(bed.x + 10, bed.y + 30, 40, 44);

      // 床號標題
      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 11px monospace";
      ctx.fillText(bed.id, bed.x + 56, bed.y + 20);

      if (pt) {
        // 病患頭像
        ctx.fillStyle = pt.template.avatarColor;
        ctx.beginPath();
        ctx.arc(bed.x + 28, bed.y + 22, 10, 0, Math.PI * 2);
        ctx.fill();

        // 姓名與主訴狀態
        ctx.fillStyle = "#f8fafc";
        ctx.font = "bold 12px 'Noto Sans TC', sans-serif";
        ctx.fillText(pt.template.patientName, bed.x + 56, bed.y + 38);

        // 即時小生命徵象
        const isCritical =
          pt.vitals.hr === 0 || pt.vitals.bpSys < 90 || pt.vitals.spo2 < 92 || pt.vitals.hr > 125 || pt.vitals.hr < 45;
        ctx.fillStyle = isCritical ? "#f87171" : "#4ade80";
        ctx.font = "bold 11px monospace";
        const vText = pt.vitals.hr === 0 ? "⚡VF/OHCA!" : `HR:${pt.vitals.hr} BP:${pt.vitals.bpSys}`;
        ctx.fillText(vText, bed.x + 54, bed.y + 56);
        ctx.fillText(`SpO2: ${pt.vitals.spo2}%`, bed.x + 54, bed.y + 72);

        // 危急閃爍警示圈
        if (isCritical && Math.floor(state.tick / 18) % 2 === 0) {
          ctx.strokeStyle = "#ef4444";
          ctx.lineWidth = 2;
          ctx.strokeRect(bed.x - 3, bed.y - 3, bed.w + 6, bed.h + 6);
        }
      } else {
        ctx.fillStyle = "#64748b";
        ctx.font = "12px sans-serif";
        ctx.fillText("空床待命", bed.x + 58, bed.y + 48);
      }
    });

    // 6. 繪製 NPC 醫護人員
    state.npcs.forEach((npc) => {
      ctx.fillStyle = npc.color;
      ctx.beginPath();
      ctx.arc(npc.x, npc.y, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(npc.name, npc.x, npc.y - 18);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px sans-serif";
      ctx.fillText(`[${npc.role}]`, npc.x, npc.y + 26);
      ctx.textAlign = "left";
    });

    // 7. 繪製玩家操控的急診醫師角色
    const p = state.player;
    if (p.targetX !== null && p.targetY !== null) {
      ctx.strokeStyle = "rgba(56, 189, 248, 0.55)";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.targetX, p.targetY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 醫師白袍光暈與本體
    ctx.fillStyle = "rgba(56, 189, 248, 0.25)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 22 + Math.sin(state.tick * 0.15) * 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 3;
    ctx.stroke();

    // 聽診器紅十字標誌
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(p.x - 5, p.y - 2, 10, 4);
    ctx.fillRect(p.x - 2, p.y - 5, 4, 10);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 12px 'Noto Sans TC', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`👨‍⚕️ ${p.name}`, p.x, p.y - 22);

    // 檢查玩家是否靠近某張病床
    const nearBed = findNearestOccupiedBed(p.x, p.y);
    if (nearBed) {
      ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(p.x - 95, p.y + 22, 190, 26, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#7dd3fc";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText(`按 [E] 或點擊開啟 ${nearBed.bedId} 處置`, p.x, p.y + 39);
    }
    ctx.textAlign = "left";
  }

  function findNearestOccupiedBed(x, y) {
    for (const bed of BED_LAYOUT) {
      const cx = bed.x + bed.w / 2;
      const cy = bed.y + bed.h / 2;
      const dist = Math.hypot(x - cx, y - cy);
      if (dist < 95) {
        const pt = state.activePatients.find((p) => p.bedId === bed.id && p.status === "active");
        if (pt) return pt;
      }
    }
    return null;
  }

  // 更新角色座標
  function updatePlayerMovement() {
    const p = state.player;
    let dx = 0;
    let dy = 0;
    if (state.keys["ArrowUp"] || state.keys["KeyW"]) dy -= 1;
    if (state.keys["ArrowDown"] || state.keys["KeyS"]) dy += 1;
    if (state.keys["ArrowLeft"] || state.keys["KeyA"]) dx -= 1;
    if (state.keys["ArrowRight"] || state.keys["KeyD"]) dx += 1;

    if (dx !== 0 || dy !== 0) {
      p.targetX = null;
      p.targetY = null;
      const len = Math.hypot(dx, dy);
      p.x += (dx / len) * p.speed;
      p.y += (dy / len) * p.speed;
    } else if (p.targetX !== null && p.targetY !== null) {
      const tdx = p.targetX - p.x;
      const tdy = p.targetY - p.y;
      const dist = Math.hypot(tdx, tdy);
      if (dist > 4) {
        p.x += (tdx / dist) * p.speed;
        p.y += (tdy / dist) * p.speed;
      } else {
        p.targetX = null;
        p.targetY = null;
      }
    }

    // 邊界限制
    p.x = Math.max(30, Math.min(1020, p.x));
    p.y = Math.max(85, Math.min(485, p.y));
  }

  // 開啟床邊臨床處置工作站
  window.openBedsideModal = function (patient) {
    if (!patient) return;
    state.selectedPatient = patient;
    const modal = document.getElementById("bedside-modal");
    if (modal) modal.classList.remove("hidden");

    renderPatientQueueBar();
    refreshBedsideUI();
  };

  window.closeBedsideModal = function () {
    const modal = document.getElementById("bedside-modal");
    if (modal) modal.classList.add("hidden");
  };

  // 更新床邊臨床工作站所有資訊與頁籤
  function refreshBedsideUI() {
    const pt = state.selectedPatient;
    if (!pt) return;
    const tpl = pt.template;
    const v = pt.vitals;

    // 病患基本標題列
    document.getElementById("bs-bed-badge").textContent = `${pt.bedId} | TTAS 第 ${tpl.ttas} 級`;
    document.getElementById("bs-pt-title").textContent = `${tpl.patientName} (${tpl.age}歲 ${tpl.sex}) — ${tpl.title}`;
    document.getElementById("bs-pt-cc").textContent = `【到院主訴】${tpl.chiefComplaint}（${tpl.triageNote}）`;

    // 生理監視器數值更新
    const mapVal = v.hr === 0 ? 0 : Math.round((v.bpSys + 2 * v.bpDia) / 3);
    document.getElementById("mon-hr").textContent = v.hr === 0 ? "---" : v.hr;
    document.getElementById("mon-bp").textContent = v.hr === 0 ? "---/---" : `${v.bpSys}/${v.bpDia}`;
    document.getElementById("mon-map").textContent = v.hr === 0 ? "(MAP --)" : `(MAP ${mapVal})`;
    document.getElementById("mon-spo2").textContent = v.hr === 0 ? "--%" : `${v.spo2}%`;
    document.getElementById("mon-rr").textContent = v.rr;
    document.getElementById("mon-bt").textContent = `${v.bt}°C | GCS ${v.gcs}`;

    // 渲染當前開啟的臨床分頁內容
    renderClinicalTabContent(pt);
    renderActionLogs(pt);
    renderChecklistProgress(pt);
  }

  // 切換臨床工作站分頁
  window.switchClinicalTab = function (tabId) {
    state.activeTab = tabId;
    document.querySelectorAll(".clin-tab-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === tabId);
    });
    if (state.selectedPatient) {
      renderClinicalTabContent(state.selectedPatient);
    }
  };

  // 渲染臨床工作站分頁（問診理學 / 12-Lead ECG & POCUS / 檢驗影像 / 醫囑處置）
  function renderClinicalTabContent(pt) {
    const container = document.getElementById("clin-tab-body");
    if (!container) return;
    const tpl = pt.template;

    if (state.activeTab === "tab_assess") {
      container.innerHTML = `
        <div class="assess-grid">
          <div class="assess-panel">
            <div class="panel-header-row">
              <h4>💬 SAMPLE 病史詢問</h4>
              <button class="action-Trigger-btn" onclick="executeOrder('exam_history')">
                ${pt.unlockedInfo.history ? "✓ 已完成問診" : "🔍 立即詢問病史 (+1m)"}
              </button>
            </div>
            ${
              pt.unlockedInfo.history
                ? `<div class="clinical-data-list">
                    <p><strong>S (主訴與症狀)：</strong><span class="highlight-quote">${tpl.history.S}</span></p>
                    <p><strong>A (過敏史)：</strong>${tpl.history.A}</p>
                    <p><strong>M (目前用藥)：</strong>${tpl.history.M}</p>
                    <p><strong>P (過去病史)：</strong>${tpl.history.P}</p>
                    <p><strong>L (最後進食)：</strong>${tpl.history.L}</p>
                    <p><strong>E (發作經過)：</strong>${tpl.history.E}</p>
                  </div>`
                : `<div class="locked-placeholder">點擊上方「立即詢問病史」向病患、家屬或隨車救護技術員 (EMT) 取得 SAMPLE 病史。</div>`
            }
          </div>

          <div class="assess-panel">
            <div class="panel-header-row">
              <h4>🩺 ABCDE 初級與全身理學檢查</h4>
              <button class="action-Trigger-btn" onclick="executeOrder('exam_physical')">
                ${pt.unlockedInfo.physical ? "✓ 已完成理學檢查" : "🩺 執行理學檢查 (+1m)"}
              </button>
            </div>
            ${
              pt.unlockedInfo.physical
                ? `<div class="clinical-data-list">
                    <p><strong>A (Airway 呼吸道)：</strong>${tpl.physicalExam.airway}</p>
                    <p><strong>B (Breathing 呼吸聽診)：</strong><span class="warn-text">${tpl.physicalExam.breathing}</span></p>
                    <p><strong>C (Circulation 循環與頸靜脈)：</strong>${tpl.physicalExam.circulation}</p>
                    <p><strong>D (Disability 神經學評估)：</strong>${tpl.physicalExam.neuro}</p>
                    <p><strong>E (Exposure / 腹部與四肢)：</strong>${tpl.physicalExam.abdomen}</p>
                  </div>`
                : `<div class="locked-placeholder">點擊上方「執行理學檢查」評估呼吸道、雙側呼吸音、頸靜脈怒張 (JVD)、心音、NIHSS 與腹部徵象。</div>`
            }
          </div>
        </div>
      `;
    } else if (state.activeTab === "tab_ecg_pocus") {
      container.innerHTML = `
        <div class="ecg-pocus-wrapper">
          <div class="ecg-box">
            <div class="panel-header-row">
              <h4>📈 12導程心電圖 (12-Lead ECG + V4R)</h4>
              <button class="action-Trigger-btn" onclick="executeOrder('order_ecg')">
                ${pt.unlockedInfo.ecg ? "✓ 已完成 12-Lead ECG" : "⚡ 立即執行 12導程心電圖 (+2m)"}
              </button>
            </div>
            ${
              pt.unlockedInfo.ecg
                ? `<canvas id="ecg-12lead-canvas" width="680" height="340"></canvas>
                   <div class="ecg-teaching-banner">${tpl.ecgData.teachingNote}</div>`
                : `<div class="locked-placeholder tall-placeholder">尚未執行 12導程心電圖。胸痛、喘、心律不整、高血鉀或意識改變患者建議於 10 分鐘內完成！</div>`
            }
          </div>

          <div class="pocus-box">
            <div class="panel-header-row">
              <h4>🔊 床邊重點超音波 (POCUS / e-FAST)</h4>
              <button class="action-Trigger-btn" onclick="executeOrder('exam_pocus')">
                ${pt.unlockedInfo.pocus ? "✓ 已完成 POCUS" : "🔊 執行床邊超音波 (+3m)"}
              </button>
            </div>
            ${
              pt.unlockedInfo.pocus
                ? `<canvas id="pocus-live-canvas" width="320" height="250"></canvas>
                   <div class="pocus-finding-text">${tpl.pocusData.summary}</div>`
                : `<div class="locked-placeholder tall-placeholder">尚未執行 POCUS 超音波。可快速鑑別右心室擴大、心包膜填塞、IVC 容積狀態、氣胸與腹腔內出血 (e-FAST)。</div>`
            }
          </div>
        </div>
      `;
      if (pt.unlockedInfo.ecg) {
        const ecgCanvas = document.getElementById("ecg-12lead-canvas");
        window.render12LeadECGCanvas(ecgCanvas, tpl);
      }
      if (pt.unlockedInfo.pocus) {
        const pocusCanvas = document.getElementById("pocus-live-canvas");
        window.renderPocusCanvas(pocusCanvas, tpl, state.tick);
      }
    } else if (state.activeTab === "tab_labs") {
      const renderKeyValTable = (obj) =>
        Object.entries(obj)
          .map(([k, val]) => {
            const isCrit = String(val).includes("Critical") || String(val).includes("(H)") || String(val).includes("(L)");
            return `<div class="lab-row"><span class="lab-k">${k}</span><span class="lab-v ${isCrit ? "lab-crit" : ""}">${val}</span></div>`;
          })
          .join("");

      container.innerHTML = `
        <div class="labs-action-bar">
          <button class="action-Trigger-btn" onclick="executeOrder('lab_glucose')">
            ${pt.unlockedInfo.labs ? "✓ 急診抽血與血糖已出爐" : "🩸 抽急診全套血液 + 指尖血糖 (+2m)"}
          </button>
          <button class="action-Trigger-btn" onclick="executeOrder('lab_blood_culture')">
            ${pt.unlockedInfo.bloodCulture ? "✓ 兩套血液培養已採檢" : "🧪 採檢血液培養 x2 + Lactate (+2m)"}
          </button>
          <button class="action-Trigger-btn" onclick="executeOrder('img_ct_brain')">
            ${pt.unlockedInfo.ctDone ? "✓ 電腦斷層 (CT) 已完成" : "☢️ 送電腦斷層室檢查 (CT Scan) (+5m)"}
          </button>
        </div>
        ${
          pt.unlockedInfo.labs || pt.unlockedInfo.ctDone
            ? `<div class="labs-grid">
                <div class="lab-card"><h5>全血球計數 (CBC)</h5>${renderKeyValTable(tpl.labs.cbc)}</div>
                <div class="lab-card"><h5>生化與電解質 (Chem)</h5>${renderKeyValTable(tpl.labs.chem)}</div>
                <div class="lab-card"><h5>心肌/發炎與凝血指標</h5>${renderKeyValTable(tpl.labs.cardiac)}</div>
                <div class="lab-card"><h5>血液氣體分析 (ABG) 與影像</h5>${renderKeyValTable(tpl.labs.abg)}</div>
              </div>`
            : `<div class="locked-placeholder">請點選上方按鈕執行床邊指尖血糖、急診全套抽血檢驗或電腦斷層檢查。</div>`
        }
      `;
    } else if (state.activeTab === "tab_orders") {
      const renderCategoryButtons = (items) =>
        items
          .map((item) => {
            const done = pt.completedActions.has(item.id);
            return `
              <button class="cpoe-order-btn ${done ? "order-done" : ""}" onclick="executeOrder('${item.id}')">
                <div class="cpoe-btn-top">
                  <span class="cpoe-icon">${item.icon}</span>
                  <span class="cpoe-name">${item.name}</span>
                  ${done ? '<span class="done-check">✓ 已執行</span>' : ""}
                </div>
                <div class="cpoe-desc">${item.desc}</div>
              </button>
            `;
          })
          .join("");

      container.innerHTML = `
        <div class="cpoe-sections">
          <div class="cpoe-col">
            <h4>🫀 急救處置、呼吸道與靜脈輸液</h4>
            <div class="cpoe-btn-list">${renderCategoryButtons(window.ER_ACTIONS.procedures_iv)}</div>
          </div>
          <div class="cpoe-col">
            <h4>💊 急診關鍵藥物醫囑 (STAT Medications)</h4>
            <div class="cpoe-btn-list">${renderCategoryButtons(window.ER_ACTIONS.medications)}</div>
          </div>
          <div class="cpoe-col">
            <h4>🏥 專科會診與病人最終動向 (Disposition)</h4>
            <p class="disp-hint">完成必要評估與穩定生命徵象後，請選擇正確的收治動向以完成個案並進行 OSCE 臨床復盤：</p>
            <div class="cpoe-btn-list">${renderCategoryButtons(window.ER_ACTIONS.dispositions)}</div>
          </div>
        </div>
      `;
    }
  }

  // 執行醫囑並計算生理數值變化與臨床陷阱
  window.executeOrder = function (actionId) {
    const pt = state.selectedPatient;
    if (!pt) return;
    const tpl = pt.template;

    // 尋找該醫囑定義
    const allActions = [
      ...window.ER_ACTIONS.exams,
      ...window.ER_ACTIONS.labs_imaging,
      ...window.ER_ACTIONS.procedures_iv,
      ...window.ER_ACTIONS.medications,
      ...window.ER_ACTIONS.dispositions
    ];
    const actionDef = allActions.find((a) => a.id === actionId);
    if (!actionDef) return;

    state.shiftMinutes += actionDef.timeCost || 1;

    // 解鎖對應檢查資訊
    if (actionId === "exam_history") pt.unlockedInfo.history = true;
    if (actionId === "exam_physical") pt.unlockedInfo.physical = true;
    if (actionId === "order_ecg") pt.unlockedInfo.ecg = true;
    if (actionId === "exam_pocus") pt.unlockedInfo.pocus = true;
    if (actionId === "lab_glucose") pt.unlockedInfo.labs = true;
    if (actionId === "lab_blood_culture") {
      pt.unlockedInfo.bloodCulture = true;
      pt.unlockedInfo.labs = true;
    }
    if (actionId === "img_ct_brain") {
      pt.unlockedInfo.ctDone = true;
    }

    // 檢查是否觸發臨床陷阱 (Pitfalls)
    let pitfallTriggered = false;
    if (tpl.pitfalls) {
      for (const pf of tpl.pitfalls) {
        if (pf.actionId === actionId) {
          // 條件式陷阱檢查
          if (pf.condition === "before_chest_tube" && pt.flags.chestTubeDone) continue;
          if (pf.condition === "bp_too_high" && pt.flags.bpControlled) continue;
          if (pf.condition === "before_kcl" && pt.flags.kclGiven) continue;

          pitfallTriggered = true;
          pt.triggeredPitfalls.add(actionId);
          state.totalScore = Math.max(0, state.totalScore - (pf.penalty || 20));

          if (pf.vitalEffect) {
            if (pf.vitalEffect.bpSys) pt.vitals.bpSys = Math.max(40, pt.vitals.bpSys + pf.vitalEffect.bpSys);
            if (pf.vitalEffect.bpDia) pt.vitals.bpDia = Math.max(25, pt.vitals.bpDia + pf.vitalEffect.bpDia);
            if (pf.vitalEffect.hr) pt.vitals.hr = Math.max(0, pt.vitals.hr + pf.vitalEffect.hr);
            if (pf.vitalEffect.spo2) pt.vitals.spo2 = Math.max(50, pt.vitals.spo2 + pf.vitalEffect.spo2);
          }

          pt.logs.unshift({
            time: formatShiftTime(state.shiftMinutes),
            type: "danger",
            text: pf.message
          });
          showClinicalToast(pf.message, "danger");
        }
      }
    }

    // 檢查敗血症打抗生素前是否已抽血液培養
    if (tpl.id === "case_septic_shock" && actionId === "med_antibiotics" && !pt.unlockedInfo.bloodCulture) {
      pt.logs.unshift({
        time: formatShiftTime(state.shiftMinutes),
        type: "warn",
        text: "⚠️ 臨床品質提醒：投予廣效性抗生素前尚未留取兩套血液培養 (Blood Cultures x2)，可能導致病原菌培養偽陰性！"
      });
    }

    // 若未觸發陷阱，更新狀態旗標與模擬真實生命徵象改善
    if (!pitfallTriggered) {
      applyPositivePhysiology(pt, actionId);

      // 計分（首次完成必要處置時加分）
      const req = tpl.requiredActions.find((r) => r.id === actionId);
      if (req && !pt.completedActions.has(actionId)) {
        state.totalScore += req.score;
        pt.logs.unshift({
          time: formatShiftTime(state.shiftMinutes),
          type: "success",
          text: `✅ 關鍵處置完成：${req.label} (+${req.score} 分)`
        });
      } else {
        pt.logs.unshift({
          time: formatShiftTime(state.shiftMinutes),
          type: "info",
          text: `執行醫囑：${actionDef.name}`
        });
      }
    }

    pt.completedActions.add(actionId);

    // 若點選最終動向 (Disposition)，進入 OSCE 臨床復盤結算
    if (actionId.startsWith("disp_")) {
      showDebriefModal(pt, actionId);
    }

    updateHud();
    refreshBedsideUI();
    renderPatientQueueBar();
  };

  // 真實生理參數動態改善邏輯
  function applyPositivePhysiology(pt, actionId) {
    const v = pt.vitals;
    const cid = pt.caseId;

    if (actionId === "proc_o2") {
      if (v.spo2 > 0) v.spo2 = Math.min(99, v.spo2 + 6);
    }
    if (actionId === "iv_ns_bolus") {
      if (v.bpSys > 0) {
        v.bpSys = Math.min(126, v.bpSys + 16);
        v.bpDia = Math.min(78, v.bpDia + 10);
      }
      if (v.hr > 100) v.hr -= 8;
    }
    if (actionId === "proc_chest_tube" && cid === "case_trauma_pneumo") {
      pt.flags.chestTubeDone = true;
      v.spo2 = 96;
      v.bpSys = 96;
      v.bpDia = 60;
      v.rr = 22;
      v.hr = 114;
      showClinicalToast("💨 左側胸廓噴出大量高壓氣體！張力性氣胸解除，血氧與血壓明顯回升！", "success");
    }
    if (actionId === "med_norepi" && v.bpSys > 0) {
      v.bpSys = Math.max(106, v.bpSys + 20);
      v.bpDia = Math.max(66, v.bpDia + 16);
    }
    if (actionId === "proc_defib" && cid === "case_vf_acls") {
      window.medicalAudio.playShockSound();
      showClinicalToast("⚡ 200J 雙相波去顫電擊完成！請繼續高品質 CPR 與給藥！", "info");
    }
    if ((actionId === "med_amiodarone" || actionId === "proc_defib") && cid === "case_vf_acls") {
      if (pt.completedActions.has("proc_cpr") && (pt.completedActions.has("proc_defib") || actionId === "proc_defib")) {
        pt.flags.roscAchieved = true;
        v.hr = 88;
        v.bpSys = 112;
        v.bpDia = 70;
        v.rr = 16;
        v.spo2 = 97;
        v.rhythm = "normal";
        v.gcs = "E2VTM4 (ROSC!)";
        showClinicalToast("🎉 恢復自發性循環 (ROSC Achieved)！頸動脈搏動恢復，監視器轉為竇性心律！", "success");
      }
    }
    if (actionId === "med_labetalol" && cid === "case_stroke_tpa") {
      pt.flags.bpControlled = true;
      v.bpSys = 172;
      v.bpDia = 96;
      showClinicalToast("📉 血壓已平穩降至 172/96 mmHg (< 185/110)，可安全施打靜脈血栓溶解劑 IV rt-PA！", "success");
    }
    if (actionId === "med_calcium" && cid === "case_hyperkalemia") {
      v.rhythm = "normal";
      v.hr = 68;
      v.bpSys = 108;
      v.bpDia = 66;
      showClinicalToast("🛡️ Calcium Gluconate 已穩定心肌細胞膜！寬 QRS 波恢復正常窄波，心率回升至 68 bpm！", "success");
    }
    if (actionId === "med_epi_im" && cid === "case_anaphylaxis") {
      v.bpSys = 114;
      v.bpDia = 72;
      v.hr = 104;
      v.spo2 = 98;
      v.rr = 18;
      showClinicalToast("🦵 大腿肌肉注射 IM Epinephrine 生效！上呼吸道水腫消退，血壓回升至 114/72 mmHg！", "success");
    }
    if (actionId === "iv_kcl" && cid === "case_dka_hypok") {
      pt.flags.kclGiven = true;
      pt.template.labs.chem.K = "3.8 mEq/L (已矯正 > 3.3)";
      showClinicalToast("🧪 靜脈補鉀完成，血鉀回升至 3.8 mEq/L (≥ 3.3)，現在可以安全啟動 Insulin Pump！", "success");
    }
  }

  function renderActionLogs(pt) {
    const logEl = document.getElementById("bs-action-logs");
    if (!logEl) return;
    logEl.innerHTML = pt.logs
      .map(
        (l) => `
        <div class="log-entry log-${l.type}">
          <span class="log-time">[${l.time}]</span>
          <span class="log-msg">${l.text}</span>
        </div>
      `
      )
      .join("");
  }

  function renderChecklistProgress(pt) {
    const el = document.getElementById("bs-checklist-progress");
    if (!el) return;
    const reqs = pt.template.requiredActions;
    const doneCount = reqs.filter((r) => pt.completedActions.has(r.id)).length;
    el.innerHTML = `
      <div class="progress-title">核心指標達成度：${doneCount} / ${reqs.length}</div>
      <div class="progress-bar-bg">
        <div class="progress-bar-fill" style="width: ${Math.round((doneCount / reqs.length) * 100)}%"></div>
      </div>
    `;
  }

  // 主治醫師指導提示彈窗
  window.showAttendingHint = function () {
    const pt = state.selectedPatient || state.activePatients[0];
    if (!pt) return;
    showClinicalToast(pt.template.attendingHint, "hint", 9000);
  };

  function showClinicalToast(msg, type = "info", duration = 5000) {
    const box = document.getElementById("clinical-toast");
    if (!box) return;
    box.className = `clinical-toast toast-${type}`;
    box.innerText = msg;
    box.classList.remove("hidden");
    clearTimeout(box._timer);
    box._timer = setTimeout(() => {
      box.classList.add("hidden");
    }, duration);
  }

  // 顯示 OSCE 考官復盤結算視窗
  function showDebriefModal(pt, chosenDisposition) {
    const modal = document.getElementById("debrief-modal");
    const content = document.getElementById("debrief-content");
    if (!modal || !content) return;

    const tpl = pt.template;
    const isCorrectDisp = chosenDisposition === tpl.correctDisposition;
    const reqListHtml = tpl.requiredActions
      .map((req) => {
        const hit = pt.completedActions.has(req.id);
        return `<li class="${hit ? "debrief-pass" : "debrief-miss"}">
          ${hit ? "✅ [已完成]" : "❌ [未執行]"} ${req.label} (${req.score}分)
        </li>`;
      })
      .join("");

    content.innerHTML = `
      <div class="debrief-header ${isCorrectDisp ? "header-pass" : "header-warn"}">
        <h2>${isCorrectDisp ? "🏆 臨床處置成功！病人安全轉送收治" : "⚠️ 處置動向有誤或尚未穩定病患"}</h2>
        <p>${tpl.title} — ${tpl.patientName} (${tpl.age}${tpl.sex})</p>
      </div>
      <div class="debrief-body">
        <h4>📋 台灣急診醫學會 OSCE 核心能力檢核表</h4>
        <ul class="debrief-checklist">${reqListHtml}</ul>
        <div class="debrief-pearl-box">
          <h4>🎓 主治醫師臨床復盤 (Clinical Debriefing & Take-Home Message)</h4>
          <p>${tpl.debriefText}</p>
        </div>
      </div>
      <div class="debrief-footer">
        <button class="primary-btn" onclick="closeDebriefAndNext()">下一位急診重症個案 ➔</button>
        <button class="secondary-btn" onclick="document.getElementById('debrief-modal').classList.add('hidden')">返回病床繼續研究</button>
      </div>
    `;
    modal.classList.remove("hidden");
  }

  window.closeDebriefAndNext = function () {
    document.getElementById("debrief-modal").classList.add("hidden");
    closeBedsideModal();
    const nextIdx = (state.currentCaseIndex + 1) % window.ER_CASES.length;
    state.currentCaseIndex = nextIdx;
    window.selectSpecificCase(nextIdx, true);
  };

  // 即時繪製床邊多通道生理監視器波形 (ECG Lead II + SpO2 Pleth)
  function renderBedsideMonitorWaveforms() {
    const canvas = document.getElementById("bedside-wave-canvas");
    if (!canvas || !state.selectedPatient) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    const pt = state.selectedPatient;
    const v = pt.vitals;

    // 推进掃描點
    const speed = 2;
    for (let s = 0; s < speed; s++) {
      state.monitorSweepX = (state.monitorSweepX + 1) % w;
      const cycleBeats = v.hr === 0 ? 60 : Math.max(28, Math.round((60 / v.hr) * 65));
      const phase = ((state.tick * speed + s) % cycleBeats) / cycleBeats;

      // 觸發 QRS 音效
      if (v.hr > 0 && Math.abs(phase - 0.3) < 0.018 && Date.now() - window.medicalAudio.lastBeepTime > 320) {
        window.medicalAudio.lastBeepTime = Date.now();
        window.medicalAudio.playQrsBeep(v.spo2, v.bpSys < 85 || v.spo2 < 90);
      }

      // 計算 ECG 與 SpO2 波形高度
      const ecgVal = sampleEcgMorphology(phase, v.rhythm, "II");
      state.monitorBufferEcg[state.monitorSweepX] = ecgVal;

      const spo2Val =
        v.hr === 0
          ? 0
          : Math.exp(-Math.pow((phase - 0.45) / 0.12, 2)) * 0.85 +
            Math.exp(-Math.pow((phase - 0.68) / 0.16, 2)) * 0.35;
      state.monitorBufferSpo2[state.monitorSweepX] = spo2Val;
    }

    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, w, h);

    // 格線
    ctx.strokeStyle = "rgba(30, 41, 59, 0.7)";
    ctx.lineWidth = 1;
    for (let y = 25; y < h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // 1. 綠色 ECG Lead II 通道
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      if (Math.abs(x - state.monitorSweepX) < 8) {
        ctx.stroke();
        ctx.beginPath();
        continue;
      }
      const py = 46 - state.monitorBufferEcg[x] * 28;
      if (x === 0) ctx.moveTo(x, py);
      else ctx.lineTo(x, py);
    }
    ctx.stroke();

    // 2. 青色 SpO2 血氧容積波通道
    ctx.strokeStyle = "#06b6d4";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      if (Math.abs(x - state.monitorSweepX) < 8) {
        ctx.stroke();
        ctx.beginPath();
        continue;
      }
      const py = 112 - state.monitorBufferSpo2[x] * 28;
      if (x === 0) ctx.moveTo(x, py);
      else ctx.lineTo(x, py);
    }
    ctx.stroke();

    ctx.fillStyle = "#22c55e";
    ctx.font = "bold 11px monospace";
    ctx.fillText(`ECG Lead II (${v.rhythm.toUpperCase()})`, 8, 16);
    ctx.fillStyle = "#06b6d4";
    ctx.fillText("SpO2 Plethysmograph", 8, 82);
  }

  // 遊戲主迴圈
  function gameLoop() {
    state.tick++;
    updatePlayerMovement();
    renderERMap();

    const modal = document.getElementById("bedside-modal");
    if (modal && !modal.classList.contains("hidden") && state.selectedPatient) {
      renderBedsideMonitorWaveforms();
      if (state.activeTab === "tab_ecg_pocus" && state.selectedPatient.unlockedInfo.pocus) {
        const pocusCanvas = document.getElementById("pocus-live-canvas");
        if (pocusCanvas) window.renderPocusCanvas(pocusCanvas, state.selectedPatient.template, state.tick);
      }
    }

    requestAnimationFrame(gameLoop);
  }

  // 初始化事件綁定
  window.addEventListener("DOMContentLoaded", () => {
    // 填入所有 8 個臨床教案選擇器
    const selector = document.getElementById("case-selector");
    if (selector) {
      window.ER_CASES.forEach((c, idx) => {
        const opt = document.createElement("option");
        opt.value = idx;
        opt.textContent = `${c.title} (${c.patientName} ${c.age}${c.sex})`;
        selector.appendChild(opt);
      });
      selector.addEventListener("change", (e) => {
        const idx = parseInt(e.target.value, 10);
        window.selectSpecificCase(idx, true);
      });
    }

    // 鍵盤移動與 E 鍵互動
    window.addEventListener("keydown", (e) => {
      state.keys[e.code] = true;
      if (e.code === "KeyE") {
        const nearPt = findNearestOccupiedBed(state.player.x, state.player.y);
        if (nearPt) openBedsideModal(nearPt);
      }
      if (e.code === "Escape") {
        closeBedsideModal();
      }
    });

    window.addEventListener("keyup", (e) => {
      state.keys[e.code] = false;
    });

    // 2D 地圖滑鼠點擊尋路與病床點擊
    const mapCanvas = document.getElementById("er-map-canvas");
    if (mapCanvas) {
      mapCanvas.addEventListener("click", (e) => {
        const rect = mapCanvas.getBoundingClientRect();
        const scaleX = mapCanvas.width / rect.width;
        const scaleY = mapCanvas.height / rect.height;
        const mx = (e.clientX - rect.left) * scaleX;
        const my = (e.clientY - rect.top) * scaleY;

        // 檢查是否點擊在某張病床上
        for (const bed of BED_LAYOUT) {
          if (mx >= bed.x && mx <= bed.x + bed.w && my >= bed.y && my <= bed.y + bed.h) {
            state.player.targetX = bed.x + bed.w / 2;
            state.player.targetY = bed.y + bed.h + 24;
            const pt = state.activePatients.find((p) => p.bedId === bed.id && p.status === "active");
            if (pt) {
              openBedsideModal(pt);
              return;
            }
          }
        }

        // 檢查是否點擊陳主治醫師 (VS)
        const vs = state.npcs[1];
        if (Math.hypot(mx - vs.x, my - vs.y) < 30) {
          window.showAttendingHint();
          return;
        }

        // 一般地板點擊尋路
        state.player.targetX = mx;
        state.player.targetY = my;
      });
    }

    // 音效開關
    const audioBtn = document.getElementById("audio-toggle-btn");
    if (audioBtn) {
      audioBtn.addEventListener("click", () => {
        const on = window.medicalAudio.toggle();
        audioBtn.textContent = on ? "🔊 監視器音效：開" : "🔇 監視器音效：關";
        audioBtn.classList.toggle("btn-active", on);
      });
    }

    // 載入初始教案並啟動迴圈
    window.loadScenarioSet(0);
    requestAnimationFrame(gameLoop);
  });
})();
