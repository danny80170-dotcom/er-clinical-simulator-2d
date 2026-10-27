// 生理監視器即時波形、12導程心電圖圖紙繪製、POCUS 床邊超音波模擬與音效引擎
class MedicalAudioEngine {
  constructor() {
    this.enabled = false;
    this.ctx = null;
    this.lastBeepTime = 0;
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.enabled && !this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    return this.enabled;
  }

  playQrsBeep(spo2 = 98, isAlarm = false) {
    if (!this.enabled || !this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    // Pitch correlates with SpO2 just like real Philips/Nihon Kohden monitors!
    const baseFreq = isAlarm ? 880 : Math.max(320, Math.min(820, 420 + (spo2 - 80) * 18));
    osc.type = isAlarm ? "square" : "sine";
    osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.085);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  playShockSound() {
    if (!this.enabled || !this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.35);
    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.36);
  }
}

window.medicalAudio = new MedicalAudioEngine();

// 計算單一導程 ECG 電位高度
function sampleEcgMorphology(phase, type, lead = "II") {
  // phase in [0, 1)
  if (type === "vfib") {
    return (
      Math.sin(phase * Math.PI * 14) * 0.45 +
      Math.cos(phase * Math.PI * 23) * 0.35 +
      Math.sin(phase * Math.PI * 37) * 0.2
    );
  }

  // Gaussian helper
  const gauss = (x, mu, sigma, amp) => amp * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));

  if (type === "hyperkalemia_wide") {
    // Absent P wave, wide bizarre QRS, tall narrow peaked T wave
    const qrs =
      gauss(phase, 0.28, 0.045, -0.35) +
      gauss(phase, 0.36, 0.055, 0.85) +
      gauss(phase, 0.45, 0.05, -0.55);
    const tallT = gauss(phase, 0.66, 0.038, 1.15);
    return qrs + tallT;
  }

  // Standard P-QRS-T components with lead-specific variations
  let pAmp = 0.14;
  let qAmp = -0.12;
  let rAmp = 1.0;
  let sAmp = -0.22;
  let stElev = 0.0;
  let tAmp = 0.28;

  if (lead === "aVR") {
    pAmp = -0.12;
    qAmp = 0.1;
    rAmp = -0.85;
    sAmp = 0.15;
    tAmp = -0.22;
  } else if (lead === "V1") {
    rAmp = 0.3;
    sAmp = -0.8;
  } else if (lead === "I" || lead === "aVL") {
    if (type === "stemi_inferior") {
      stElev = -0.28; // Reciprocal ST depression in I, aVL!
      tAmp = -0.2;
    }
  } else if (lead === "II" || lead === "III" || lead === "aVF" || lead === "V4R") {
    if (type === "stemi_inferior") {
      stElev = lead === "III" ? 0.48 : lead === "V4R" ? 0.32 : 0.4; // Marked ST elevation
      tAmp = 0.45;
    }
  }

  if (type === "afib") {
    pAmp = 0; // No P wave, add fine fibrillatory baseline
  }

  const pWave = gauss(phase, 0.16, 0.025, pAmp);
  const qWave = gauss(phase, 0.27, 0.009, qAmp);
  const rWave = gauss(phase, 0.3, 0.012, rAmp);
  const sWave = gauss(phase, 0.33, 0.011, sAmp);

  // ST segment plateau between 0.34 and 0.56
  let stSeg = 0;
  if (phase > 0.32 && phase < 0.62) {
    const stWindow = Math.sin(((phase - 0.32) / 0.3) * Math.PI);
    stSeg = stElev * stWindow;
  }

  const tWave = gauss(phase, 0.54, 0.042, tAmp);
  const fibNoise =
    type === "afib" ? Math.sin(phase * 95) * 0.04 + Math.cos(phase * 140) * 0.03 : 0;

  return pWave + qWave + rWave + sWave + stSeg + tWave + fibNoise;
}

window.sampleEcgMorphology = sampleEcgMorphology;

// 繪製擬真 12導程 + V4R 心電圖紙
window.render12LeadECGCanvas = function (canvas, caseObj) {
  if (!canvas || !caseObj) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  // 1. 醫療心電圖粉紅方格紙背景
  ctx.fillStyle = "#fff9f9";
  ctx.fillRect(0, 0, w, h);

  // 細格 (1mm)
  ctx.strokeStyle = "#f9dada";
  ctx.lineWidth = 0.5;
  for (let x = 0; x < w; x += 6) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += 6) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // 粗格 (5mm)
  ctx.strokeStyle = "#f0b4b4";
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 30) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += 30) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // 標題列資訊
  ctx.fillStyle = "#1e293b";
  ctx.font = "bold 13px 'JetBrains Mono', monospace";
  const hrText = caseObj.initialVitals.hr || 0;
  ctx.fillText(
    `PATIENT: ${caseObj.patientName} (${caseObj.age}${caseObj.sex})   25mm/s  10mm/mV   HR: ${hrText} bpm   DX: ${caseObj.ecgData.diagnosis}`,
    16,
    22
  );

  // 4欄 x 3列 標準 12 導程配置 + 底部 Lead II 節律條與 V4R
  const leadsGrid = [
    ["I", "aVR", "V1", "V4"],
    ["II", "aVL", "V2", "V5"],
    ["III", "aVF", "V3", "V6"]
  ];

  const colW = (w - 30) / 4;
  const rowH = 82;
  const startY = 38;
  const wfType = caseObj.ecgData.waveformType;

  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 1.6;

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 4; c++) {
      const leadName = leadsGrid[r][c];
      const x0 = 15 + c * colW;
      const yMid = startY + r * rowH + 45;

      // 導程名稱標籤
      ctx.fillStyle =
        wfType === "stemi_inferior" && ["II", "III", "aVF"].includes(leadName)
          ? "#dc2626"
          : "#0f172a";
      ctx.font = "bold 13px monospace";
      ctx.fillText(leadName, x0 + 6, yMid - 24);

      // 繪製該導程 2.5 個心跳週期
      ctx.beginPath();
      for (let px = 0; px < colW - 14; px++) {
        const cycle = ((px / (colW - 14)) * 2.4) % 1;
        const val = sampleEcgMorphology(cycle, wfType, leadName);
        const py = yMid - val * 26;
        if (px === 0) ctx.moveTo(x0 + px, py);
        else ctx.lineTo(x0 + px, py);
      }
      ctx.stroke();
    }
  }

  // 底部第 4 列：左側為長條 Lead II Rhythm Strip，右側為 V4R 右側心電圖導程
  const rhythmY = startY + 3 * rowH + 48;
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 13px monospace";
  ctx.fillText("II (Rhythm Strip)", 21, rhythmY - 24);

  const stripW = colW * 3 - 15;
  ctx.beginPath();
  for (let px = 0; px < stripW; px++) {
    let cycleLen = 75;
    if (wfType === "afib") {
      // Irregularly irregular R-R intervals
      cycleLen = 68 + Math.sin(px * 0.05) * 18;
    }
    const cycle = (px % cycleLen) / cycleLen;
    const val = sampleEcgMorphology(cycle, wfType, "II");
    const py = rhythmY - val * 26;
    if (px === 0) ctx.moveTo(15 + px, py);
    else ctx.lineTo(15 + px, py);
  }
  ctx.stroke();

  // 右下角 V4R 導程
  const v4rX = 15 + colW * 3;
  ctx.fillStyle = caseObj.ecgData.v4rPositive ? "#dc2626" : "#0f172a";
  ctx.fillText(
    caseObj.ecgData.v4rPositive ? "V4R (Right-Sided: ST Elevation +!)" : "V4R (Right-Sided)",
    v4rX + 6,
    rhythmY - 24
  );

  ctx.beginPath();
  for (let px = 0; px < colW - 14; px++) {
    const cycle = ((px / (colW - 14)) * 2.4) % 1;
    const val = sampleEcgMorphology(cycle, wfType, "V4R");
    const py = rhythmY - val * 26;
    if (px === 0) ctx.moveTo(v4rX + px, py);
    else ctx.lineTo(v4rX + px, py);
  }
  ctx.stroke();
};

// 繪製 POCUS 床邊重點超音波動畫畫面
window.renderPocusCanvas = function (canvas, caseObj, tick) {
  if (!canvas || !caseObj) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, w, h);

  // 超音波扇形探頭掃描區 (Sector Probe Cone)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(w / 2, 18);
  ctx.arc(w / 2, 18, h - 32, Math.PI * 0.28, Math.PI * 0.72);
  ctx.closePath();
  ctx.clip();

  // 背景組織灰階漸層
  const grad = ctx.createRadialGradient(w / 2, 18, 20, w / 2, 18, h - 30);
  grad.addColorStop(0, "#334155");
  grad.addColorStop(0.5, "#1e293b");
  grad.addColorStop(1, "#0f172a");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  const pType = caseObj.pocusData.type;
  const beat = Math.sin(tick * 0.15);

  if (pType === "fast_positive") {
    // 肝臟 (Liver) 與腎臟 (Kidney) 之間 Morison's pouch 黑色無回音游離積血 (Anechoic Free Fluid)
    ctx.fillStyle = "#64748b";
    ctx.beginPath();
    ctx.ellipse(w / 2 - 45, 130, 80, 42, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // 黑色游離血水帶 (Free Fluid Wedge!)
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 60, 155);
    ctx.quadraticCurveTo(w / 2 + 10, 135 + beat * 3, w / 2 + 75, 175);
    ctx.quadraticCurveTo(w / 2, 195, w / 2 - 60, 155);
    ctx.fill();
    ctx.stroke();

    // 右腎皮質
    ctx.fillStyle = "#94a3b8";
    ctx.beginPath();
    ctx.ellipse(w / 2 + 30, 205, 52, 30, 0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f87171";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("★ Free Fluid in Morison's Pouch (Positive FAST!)", w / 2 - 140, 162);
  } else if (pType === "rv_strain") {
    // 擴大右心室壓迫左心室 (D-shaped LV)
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 6;
    ctx.fillStyle = "#020617";
    // Huge dilated RV
    ctx.beginPath();
    ctx.ellipse(w / 2 - 35, 145, 58 + beat * 2, 46, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Compressed LV
    ctx.beginPath();
    ctx.ellipse(w / 2 + 45, 165, 34 - beat * 4, 42, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 12px monospace";
    ctx.fillText("Dilated RV (RV Strain)", w / 2 - 90, 145);
    ctx.fillText("LV", w / 2 + 38, 168);
  } else if (pType === "septic_hyperdynamic") {
    // Hyperdynamic LV ("Kissing" walls) & Collapsible IVC
    const radius = Math.max(10, 32 + beat * 20);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 10;
    ctx.fillStyle = "#020617";
    ctx.beginPath();
    ctx.arc(w / 2, 160, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 12px monospace";
    ctx.fillText("Hyperdynamic LV + Flat IVC (<1cm)", w / 2 - 110, 225);
  } else {
    // VF or Normal Echo
    const jitter = pType === "vfib_echo" ? Math.sin(tick * 1.4) * 4 : beat * 10;
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 7;
    ctx.fillStyle = "#020617";
    ctx.beginPath();
    ctx.arc(w / 2, 160, 42 + jitter, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // 超音波斑點雜訊 (Speckle noise)
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  for (let i = 0; i < 90; i++) {
    const rx = ((i * 73 + tick * 7) % (w - 80)) + 40;
    const ry = ((i * 41 + tick * 3) % (h - 60)) + 30;
    ctx.fillRect(rx, ry, 2, 2);
  }

  ctx.restore();

  // 深度刻度尺與探頭標記
  ctx.fillStyle = "#38bdf8";
  ctx.font = "11px monospace";
  ctx.fillText("POCUS 3.5MHz Phased Array", 14, 20);
  for (let d = 1; d <= 5; d++) {
    const dy = 20 + d * 45;
    ctx.fillText(`${d * 3}cm`, w - 42, dy);
  }
};
