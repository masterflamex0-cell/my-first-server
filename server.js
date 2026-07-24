const http = require("http");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const port = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8"
  });

  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT * FROM students ORDER BY student_id ASC"
    );
    client.release();

    let tableRowsHtml = "";
    result.rows.forEach(row => {
      tableRowsHtml += `
        <tr>
          <td><span class="badge-id">👨‍🎓 ${row.student_id}</span></td>
          <td class="student-name">${row.student_name}</td>
          <td><span class="badge-status">● Active</span></td>
        </tr>
      `;
    });

    const html = `
<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ฐานข้อมูลนักศึกษา | Deep Space Orbit</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&family=Orbitron:wght@600;800;900&display=swap" rel="stylesheet">

<style>
:root {
  --bg-dark: #020617;
  --card-bg: rgba(15, 23, 42, 0.85);
  --card-border: rgba(56, 189, 248, 0.25);
  --neon-cyan: #38bdf8;
  --neon-pink: #f43f5e;
  --neon-purple: #c084fc;
  --neon-gold: #fbbf24;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Kanit', sans-serif;
  cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'><text y='20' font-size='20'>🚀</text></svg>"), auto !important;
}

body {
  background-color: var(--bg-dark);
  color: var(--text-main);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  position: relative;
}

/* Background Canvas */
#spaceCanvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center; /* ช่วยจัดองค์ประกอบให้อยู่ตรงกลางสมมาตร */
}

/* ---------- Header ---------- */
header {
  width: 100%;
  background: rgba(2, 6, 23, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--card-border);
  padding: 35px 20px;
  text-align: center;
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
}

header::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--neon-pink), var(--neon-cyan), var(--neon-purple));
}

.title-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.3);
  padding: 6px 18px;
  border-radius: 20px;
  font-size: 0.85rem;
  color: var(--neon-cyan);
  margin-bottom: 12px;
  letter-spacing: 1.5px;
  box-shadow: 0 0 15px rgba(56, 189, 248, 0.2);
}

header h1 {
  font-size: 2.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff 20%, var(--neon-cyan) 60%, var(--neon-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 40px rgba(56, 189, 248, 0.4);
}

header p {
  color: var(--text-muted);
  font-size: 1rem;
  margin-top: 8px;
}

/* ---------- Main Container ---------- */
.container {
  width: 90%;
  max-width: 1100px;
  margin: 35px auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* ---------- Top Bar ---------- */
.top-status-bar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  padding: 14px 28px;
  border-radius: 16px;
  backdrop-filter: blur(16px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.status-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.92rem;
}

.pulse-dot {
  width: 10px;
  height: 10px;
  background-color: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 12px #22c55e;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.8); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}

.clock-display {
  font-family: 'Orbitron', monospace;
  color: var(--neon-gold);
  font-weight: 700;
  letter-spacing: 2px;
  font-size: 1.1rem;
  text-shadow: 0 0 10px rgba(251, 191, 36, 0.4);
}

/* ---------- Dashboard Grid Cards ---------- */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.card {
  background: var(--card-bg);
  backdrop-filter: blur(16px);
  border: 1px solid var(--card-border);
  border-radius: 20px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card:hover {
  transform: translateY(-5px);
  border-color: var(--neon-cyan);
  box-shadow: 0 15px 35px rgba(56, 189, 248, 0.25);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  color: var(--text-muted);
  font-size: 0.95rem;
  font-weight: 500;
}

.card-icon {
  font-size: 2rem;
}

.card-number {
  margin-top: 15px;
  font-family: 'Orbitron', sans-serif;
  font-size: 2.8rem;
  font-weight: 800;
  color: var(--neon-cyan);
  text-shadow: 0 0 25px rgba(56, 189, 248, 0.5);
}

/* ---------- Search & Controls ---------- */
.controls-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.search-wrapper {
  position: relative;
  flex: 1;
}

.search-input {
  width: 100%;
  padding: 15px 20px 15px 50px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  color: #fff;
  font-size: 1rem;
  outline: none;
  backdrop-filter: blur(12px);
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.search-input:focus {
  border-color: var(--neon-cyan);
  box-shadow: 0 0 25px rgba(56, 189, 248, 0.35);
}

.search-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
}

.btn-space {
  background: linear-gradient(135deg, var(--neon-purple), #4f46e5);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 15px 28px;
  border-radius: 16px;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.35);
  cursor: pointer;
}

.btn-space:hover {
  transform: scale(1.03);
  box-shadow: 0 0 30px rgba(168, 85, 247, 0.6);
}

/* ---------- Table Box ---------- */
.table-box {
  background: var(--card-bg);
  backdrop-filter: blur(16px);
  border: 1px solid var(--card-border);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

thead {
  background: rgba(2, 6, 23, 0.9);
  border-bottom: 2px solid var(--card-border);
}

thead th {
  padding: 20px 24px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--neon-cyan);
  letter-spacing: 1px;
}

tbody tr {
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  transition: all 0.2s ease;
}

tbody tr:hover {
  background: rgba(56, 189, 248, 0.08);
  box-shadow: inset 4px 0 0 var(--neon-cyan);
}

tbody td {
  padding: 18px 24px;
  font-size: 1rem;
}

.badge-id {
  font-family: 'Orbitron', monospace;
  background: rgba(56, 189, 248, 0.12);
  color: var(--neon-cyan);
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid rgba(56, 189, 248, 0.3);
  font-weight: 600;
}

.badge-status {
  color: #4ade80;
  font-size: 0.85rem;
  background: rgba(74, 222, 128, 0.1);
  padding: 5px 12px;
  border-radius: 20px;
  border: 1px solid rgba(74, 222, 128, 0.2);
}

/* ---------- Footer ---------- */
footer {
  width: 100%;
  text-align: center;
  padding: 30px;
  color: var(--text-muted);
  font-size: 0.9rem;
  border-top: 1px solid var(--card-border);
  background: rgba(2, 6, 23, 0.95);
  margin-top: auto;
}

footer strong {
  color: var(--neon-cyan);
}

/* Responsive */
@media (max-width: 900px) {
  .dashboard-grid { grid-template-columns: 1fr; }
  .top-status-bar { grid-template-columns: 1fr; gap: 10px; text-align: center; }
  .controls-box { flex-direction: column; }
  .btn-space { width: 100%; justify-content: center; }
}
</style>
</head>

<body>

<canvas id="spaceCanvas"></canvas>

<div class="content-wrapper">

  <header>
    <div class="title-badge">🛰️ ORBITAL DATA CENTER • NODE.JS</div>
    <h1>🌌 ฐานข้อมูลนักศึกษา 🛸</h1>
    <p>ระบบจัดการและค้นหาข้อมูลนักศึกษาอวกาศ | Node.js • PostgreSQL • Railway</p>
  </header>

  <div class="container">

    <div class="top-status-bar">
      <div class="status-item">
        <div class="pulse-dot"></div>
        <span>สถานะเซิร์ฟเวอร์: <strong>ONLINE</strong></span>
      </div>
      <div class="status-item" style="justify-content: center;">
        <span>🕒 เวลาอวกาศ: <span id="clock" class="clock-display">00:00:00</span></span>
      </div>
      <div class="status-item" style="justify-content: flex-end;">
        <span>📡 Latency: <strong style="color:var(--neon-cyan)">18 ms</strong></span>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="card">
        <div class="card-header">
          <span class="card-title">จำนวนนักศึกษาทั้งหมด</span>
          <span class="card-icon">👨‍🚀</span>
        </div>
        <div class="card-number">${result.rows.length}</div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">สถานะฐานข้อมูล</span>
          <span class="card-icon">⚡</span>
        </div>
        <div class="card-number" style="color: #4ade80; text-shadow: 0 0 25px rgba(74, 222, 128, 0.5);">READY</div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">โหนดประมวลผล</span>
          <span class="card-icon">🛸</span>
        </div>
        <div class="card-number" style="color: var(--neon-gold); text-shadow: 0 0 25px rgba(251, 191, 36, 0.5);">RAILWAY</div>
      </div>
    </div>

    <div class="controls-box">
      <div class="search-wrapper">
        <span class="search-icon">🔍</span>
        <input type="text" id="searchInput" class="search-input" placeholder="พิมพ์รหัสนักศึกษา หรือ ชื่อเพื่อค้นหา..." onkeyup="filterTable()">
      </div>
      <button class="btn-space" onclick="location.reload()">
        <span>🔄</span> รีเฟรชข้อมูล
      </button>
    </div>

    <div class="table-box">
      <table id="studentTable">
        <thead>
          <tr>
            <th>รหัสนักศึกษา 🆔</th>
            <th>ชื่อ - นามสกุล นักศึกษา 👤</th>
            <th>สถานะ 🟢</th>
          </tr>
        </thead>
        <tbody>
          ${tableRowsHtml.length > 0 ? tableRowsHtml : `<tr><td colspan="3" style="text-align:center; color: var(--text-muted); padding:40px;">🛸 ไม่พบข้อมูลนักศึกษาในระบบอวกาศ</td></tr>`}
        </tbody>
      </table>
    </div>

  </div>

  <footer>
    <p>🌌 <strong>Student Management System (Space Edition)</strong></p>
    <p style="margin-top: 6px;">Powered by Node.js • PostgreSQL • Railway Platform</p>
    <p style="margin-top: 8px; opacity: 0.6;">© 2026 All Rights Reserved | Interstellar Space Academy</p>
  </footer>

</div>

<script>
// --- 1. Realtime Clock ---
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toTimeString().split(' ')[0];
}
setInterval(updateClock, 1000);
updateClock();

// --- 2. Client-side Search ---
function filterTable() {
  const filter = document.getElementById('searchInput').value.toLowerCase();
  const trs = document.querySelectorAll('#studentTable tbody tr');

  trs.forEach(tr => {
    const text = tr.textContent.toLowerCase();
    tr.style.display = text.includes(filter) ? "" : "none";
  });
}

// --- 3. Space Engine & Solar System Canvas ---
const canvas = document.getElementById('spaceCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// สร้างดวงดาวหลากสี
const stars = Array.from({ length: 200 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  radius: Math.random() * 1.8 + 0.2,
  alpha: Math.random(),
  speed: Math.random() * 0.015 + 0.005,
  color: ['#ffffff', '#38bdf8', '#c084fc', '#fde047'][Math.floor(Math.random() * 4)]
}));

// ระบบสุริยะที่มีมิติและสีสันสมจริง
const sun = { x: canvas.width * 0.88, y: canvas.height * 0.45, radius: 40 };

const planets = [
  { name: 'Mercury', distance: 110, radius: 4, speed: 0.012, angle: 0, color: '#94a3b8' },
  { name: 'Venus', distance: 160, radius: 7, speed: 0.008, angle: 2, color: '#fde047' },
  { name: 'Earth', distance: 230, radius: 8, speed: 0.006, angle: 4, color: '#38bdf8' },
  { name: 'Mars', distance: 300, radius: 6, speed: 0.004, angle: 1, color: '#f43f5e' },
  { name: 'Jupiter', distance: 410, radius: 15, speed: 0.0025, angle: 3, color: '#fbbf24' },
  { name: 'Saturn', distance: 530, radius: 11, speed: 0.0018, angle: 5, color: '#fef08a', hasRing: true }
];

// นักบินอวกาศและเอเลี่ยนเดินได้ในหน้าจอ
class SpaceWalker {
  constructor(type, yPosition) {
    this.type = type; // 'astronaut' หรือ 'alien'
    this.x = Math.random() * canvas.width;
    this.y = yPosition;
    this.speed = (Math.random() * 0.6 + 0.4) * (Math.random() > 0.5 ? 1 : -1);
    this.step = 0;
  }

  update() {
    this.x += this.speed;
    this.step += 0.1;

    // ข้ามขอบหน้าจอให้กลับมาอีกฝั่ง
    if (this.x > canvas.width + 50) this.x = -50;
    if (this.x < -50) this.x = canvas.width + 50;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y + Math.sin(this.step) * 3); // ขยับขึ้นลงตามการเดิน
    if (this.speed < 0) ctx.scale(-1, 1); // หันหน้าตามทิศทางการเดิน

    if (this.type === 'astronaut') {
      // นักบินอวกาศ
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath(); ctx.arc(0, -15, 10, 0, Math.PI * 2); ctx.fill(); // หัว
      ctx.fillStyle = '#0284c7';
      ctx.beginPath(); ctx.arc(3, -15, 5, 0, Math.PI * 2); ctx.fill(); // หน้ากาก
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(-6, -5, 12, 16); // ตัว
      // แขนขาขยับ
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-4, 11); ctx.lineTo(-4 + Math.sin(this.step) * 5, 22);
      ctx.moveTo(4, 11); ctx.lineTo(4 - Math.sin(this.step) * 5, 22);
      ctx.stroke();
    } else {
      // เอเลี่ยนตัวเขียว
      ctx.fillStyle = '#22c55e';
      ctx.beginPath(); ctx.arc(0, -12, 9, 0, Math.PI * 2); ctx.fill(); // หัว
      ctx.fillStyle = '#000';
      ctx.beginPath(); ctx.arc(-3, -13, 2, 0, Math.PI * 2); ctx.arc(3, -13, 2, 0, Math.PI * 2); ctx.fill(); // ตา
      ctx.fillStyle = '#15803d';
      ctx.fillRect(-5, -3, 10, 14); // ตัว
      // เสาอากาศ
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -21); ctx.lineTo(0, -26);
      ctx.stroke();
      ctx.fillStyle = '#a855f7';
      ctx.beginPath(); ctx.arc(0, -27, 3, 0, Math.PI * 2); ctx.fill();
    }

    ctx.restore();
  }
}

const walkers = [
  new SpaceWalker('astronaut', canvas.height * 0.82),
  new SpaceWalker('alien', canvas.height * 0.88),
  new SpaceWalker('astronaut', canvas.height * 0.2)
];

function animateSpace() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. วาดดวงดาวกะพริบ
  stars.forEach(star => {
    star.alpha += star.speed;
    if (star.alpha > 1 || star.alpha < 0) star.speed = -star.speed;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = star.color;
    ctx.globalAlpha = Math.abs(star.alpha);
    ctx.fill();
    ctx.globalAlpha = 1.0;
  });

  // 2. วาดดวงอาทิตย์พร้อมรัศมีแสง
  const sunX = canvas.width * 0.88;
  const sunY = canvas.height * 0.45;

  const sunGlow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 80);
  sunGlow.addColorStop(0, 'rgba(249, 115, 22, 1)');
  sunGlow.addColorStop(0.5, 'rgba(251, 146, 60, 0.3)');
  sunGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = sunGlow;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 80, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(sunX, sunY, 30, 0, Math.PI * 2);
  ctx.fillStyle = '#fbbf24';
  ctx.fill();

  // 3. วาดและจำลองการโคจรของระบบสุริยะ
  planets.forEach(planet => {
    planet.angle += planet.speed;

    // เส้นวงโคจร
    ctx.beginPath();
    ctx.arc(sunX, sunY, planet.distance, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    ctx.stroke();

    const px = sunX + Math.cos(planet.angle) * planet.distance;
    const py = sunY + Math.sin(planet.angle) * planet.distance;

    // วงแหวนดาวเสาร์
    if (planet.hasRing) {
      ctx.beginPath();
      ctx.ellipse(px, py, planet.radius * 2.2, planet.radius * 0.6, Math.PI / 4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // ดาวเคราะห์
    ctx.beginPath();
    ctx.arc(px, py, planet.radius, 0, Math.PI * 2);
    ctx.fillStyle = planet.color;
    ctx.fill();
  });

  // 4. วาดตัวละครเดินได้
  walkers.forEach(walker => {
    walker.update();
    walker.draw();
  });

  requestAnimationFrame(animateSpace);
}

animateSpace();
</script>

</body>
</html>
`;

    res.end(html);

  } catch (err) {
    console.error(err);

    res.end(`
<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<title>System Error | Space Center</title>
<link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500&display=swap" rel="stylesheet">
<style>
body {
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #020617;
  font-family: 'Kanit', sans-serif;
  color: #fff;
}
.box {
  background: rgba(244, 63, 94, 0.1);
  border: 1px solid rgba(244, 63, 94, 0.4);
  padding: 40px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  text-align: center;
  max-width: 600px;
  box-shadow: 0 0 40px rgba(244, 63, 94, 0.25);
}
h1 { color: #f43f5e; margin-bottom: 12px; font-size: 1.8rem; }
p { color: #94a3b8; margin-bottom: 20px; }
pre {
  background: #000;
  color: #4ade80;
  padding: 15px;
  border-radius: 10px;
  text-align: left;
  overflow-x: auto;
  font-size: 0.85rem;
  border: 1px solid #22c55e44;
}
</style>
</head>
<body>
<div class="box">
  <h1>💥 เกิดข้อผิดพลาดในระบบการเชื่อมต่อ</h1>
  <p>ไม่สามารถเชื่อมต่อสัญญาณกับฐานข้อมูลนักศึกษาในห้วงอวกาศได้</p>
  <pre>${err.message}</pre>
</div>
</body>
</html>
`);
  }
});

server.listen(port, () => {
  console.log(`🌌 Space Database running at port: ${port}`);
});
