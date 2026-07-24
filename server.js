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

    // สร้าง HTML ส่วนตารางจากข้อมูลนักศึกษา
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
<title>ฐานข้อมูลนักศึกษา | Space Management System</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&family=Orbitron:wght@600;800;900&display=swap" rel="stylesheet">

<style>
:root {
  --bg-dark: #030712;
  --card-bg: rgba(15, 23, 42, 0.75);
  --card-border: rgba(56, 189, 248, 0.3);
  --neon-cyan: #38bdf8;
  --neon-pink: #f43f5e;
  --neon-purple: #a855f7;
  --neon-gold: #fbbf24;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Kanit', sans-serif;
  /* เคอร์เซอร์จรวดอวกาศ */
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

/* Background Canvas สำหรับระบบสุริยะ */
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
}

/* ---------- Header ---------- */
header {
  background: rgba(3, 7, 18, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--card-border);
  padding: 30px 20px;
  text-align: center;
  position: relative;
  box-shadow: 0 4px 30px rgba(0, 242, 254, 0.15);
}

header::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--neon-pink), var(--neon-cyan), var(--neon-purple));
}

.title-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.3);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  color: var(--neon-cyan);
  margin-bottom: 12px;
  letter-spacing: 1px;
}

header h1 {
  font-size: 2.6rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff 30%, var(--neon-cyan) 70%, var(--neon-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(56, 189, 248, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

header p {
  color: var(--text-muted);
  font-size: 1rem;
  margin-top: 8px;
}

/* ---------- Container ---------- */
.container {
  width: 92%;
  max-width: 1200px;
  margin: 30px auto;
  flex: 1;
}

/* ---------- Top Bar (Clock + Status) ---------- */
.top-status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  padding: 12px 24px;
  border-radius: 16px;
  margin-bottom: 25px;
  backdrop-filter: blur(12px);
  flex-wrap: wrap;
  gap: 15px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
}

.pulse-dot {
  width: 10px;
  height: 10px;
  background-color: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 10px #22c55e;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}

.clock-display {
  font-family: 'Orbitron', monospace;
  color: var(--neon-gold);
  font-weight: 600;
  letter-spacing: 1px;
}

/* ---------- Dashboard Grid Cards ---------- */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.card {
  background: var(--card-bg);
  backdrop-filter: blur(16px);
  border: 1px solid var(--card-border);
  border-radius: 20px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.card::after {
  content: '';
  position: absolute;
  top: -50%; left: -50%;
  width: 200%; height: 200%;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.05) 0%, transparent 70%);
  pointer-events: none;
}

.card:hover {
  transform: translateY(-5px);
  border-color: var(--neon-cyan);
  box-shadow: 0 15px 35px rgba(56, 189, 248, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  color: var(--text-muted);
  font-size: 0.95rem;
}

.card-icon {
  font-size: 2rem;
}

.card-number {
  margin-top: 15px;
  font-family: 'Orbitron', sans-serif;
  font-size: 3rem;
  font-weight: 800;
  color: var(--neon-cyan);
  text-shadow: 0 0 20px rgba(56, 189, 248, 0.5);
}

/* ---------- Controls & Search ---------- */
.controls-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-wrapper {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-input {
  width: 100%;
  padding: 14px 20px 14px 48px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 14px;
  color: #fff;
  font-size: 1rem;
  outline: none;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: var(--neon-cyan);
  box-shadow: 0 0 20px rgba(56, 189, 248, 0.3);
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
}

.btn-space {
  background: linear-gradient(135deg, var(--neon-purple), #6366f1);
  color: #fff;
  border: none;
  padding: 14px 24px;
  border-radius: 14px;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(168, 85, 247, 0.3);
}

.btn-space:hover {
  transform: scale(1.05);
  box-shadow: 0 0 25px rgba(168, 85, 247, 0.6);
}

/* ---------- Table Box ---------- */
.table-box {
  background: var(--card-bg);
  backdrop-filter: blur(16px);
  border: 1px solid var(--card-border);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

thead {
  background: rgba(15, 23, 42, 0.95);
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
}

tbody tr:hover {
  background: rgba(56, 189, 248, 0.1);
  box-shadow: inset 5px 0 0 var(--neon-cyan);
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
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid rgba(74, 222, 128, 0.2);
}

/* Floating Stickers */
.sticker {
  position: absolute;
  pointer-events: none;
  animation: floatAnim 4s ease-in-out infinite alternate;
}

@keyframes floatAnim {
  0% { transform: translateY(0px) rotate(0deg); }
  100% { transform: translateY(-12px) rotate(8deg); }
}

/* ---------- Footer ---------- */
footer {
  text-align: center;
  padding: 30px;
  color: var(--text-muted);
  font-size: 0.9rem;
  border-top: 1px solid var(--card-border);
  background: rgba(3, 7, 18, 0.9);
  margin-top: auto;
}

footer strong {
  color: var(--neon-cyan);
}

/* Responsive */
@media (max-width: 768px) {
  header h1 { font-size: 1.8rem; }
  .container { width: 95%; }
  .top-status-bar { flex-direction: column; align-items: flex-start; }
}
</style>
</head>

<body>

<!-- Background Canvas อวกาศเคลื่อนไหว -->
<canvas id="spaceCanvas"></canvas>

<div class="content-wrapper">

  <header>
    <div class="title-badge">🛰️ ORBITAL DATA CENTER • NODE.JS</div>
    <h1>🌌 ฐานข้อมูลนักศึกษา 🛸</h1>
    <p>ระบบจัดการและค้นหาข้อมูลนักศึกษาอวกาศ | Node.js • PostgreSQL • Railway</p>
    <span class="sticker" style="top: 20px; right: 8%; font-size: 2.5rem;">🪐</span>
    <span class="sticker" style="bottom: 10px; left: 6%; font-size: 2rem; animation-delay: -2s;">☄️</span>
  </header>

  <div class="container">

    <!-- Top Status Bar -->
    <div class="top-status-bar">
      <div class="status-item">
        <div class="pulse-dot"></div>
        <span>สถานะเซิร์ฟเวอร์: <strong>เชื่อมต่อฐานข้อมูลเรียบร้อย</strong></span>
      </div>
      <div class="status-item">
        <span>📡 Latency: <strong style="color:var(--neon-cyan)">24 ms</strong></span>
      </div>
      <div class="status-item">
        <span>🕒 เวลาอวกาศ: <span id="clock" class="clock-display">00:00:00</span></span>
      </div>
    </div>

    <!-- Dashboard Cards -->
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
        <div class="card-number" style="color: #4ade80; text-shadow: 0 0 20px rgba(74, 222, 128, 0.5);">ONLINE</div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">โหนดประมวลผล</span>
          <span class="card-icon">🛸</span>
        </div>
        <div class="card-number" style="color: var(--neon-gold); text-shadow: 0 0 20px rgba(251, 191, 36, 0.5);">RAILWAY</div>
      </div>
    </div>

    <!-- Search & Controls -->
    <div class="controls-box">
      <div class="search-wrapper">
        <span class="search-icon">🔍</span>
        <input type="text" id="searchInput" class="search-input" placeholder="พิมพ์รหัสนักศึกษา หรือ ชื่อเพื่อค้นหา..." onkeyup="filterTable()">
      </div>
      <button class="btn-space" onclick="location.reload()">
        <span>🔄</span> รีเฟรชข้อมูล
      </button>
    </div>

    <!-- Table -->
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
// --- 1. นาฬิกาอวกาศ Realtime ---
function updateClock() {
  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0];
  document.getElementById('clock').textContent = timeStr;
}
setInterval(updateClock, 1000);
updateClock();

// --- 2. ค้นหาข้อมูลนักศึกษา (Client-side Search) ---
function filterTable() {
  const input = document.getElementById('searchInput');
  const filter = input.value.toLowerCase();
  const table = document.getElementById('studentTable');
  const tr = table.getElementsByTagName('tr');

  for (let i = 1; i < tr.length; i++) {
    const tdId = tr[i].getElementsByTagName('td')[0];
    const tdName = tr[i].getElementsByTagName('td')[1];
    
    if (tdId || tdName) {
      const idText = tdId.textContent || tdId.innerText;
      const nameText = tdName.textContent || tdName.innerText;
      
      if (idText.toLowerCase().indexOf(filter) > -1 || nameText.toLowerCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

// --- 3. ระบบสุริยะเเละดวงดาวเคลื่อนไหวด้วย Canvas ---
const canvas = document.getElementById('spaceCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// สร้างดวงดาวแบบสุ่ม
const stars = [];
for (let i = 0; i < 150; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.5,
    alpha: Math.random(),
    speed: Math.random() * 0.02
  });
}

// ข้อมูลดาวเคราะห์ในระบบสุริยะจำลอง
const planets = [
  { name: 'Mercury', distance: 120, radius: 4, speed: 0.015, angle: 0, color: '#a1a1aa' },
  { name: 'Venus', distance: 180, radius: 7, speed: 0.01, angle: 2, color: '#fde047' },
  { name: 'Earth', distance: 260, radius: 8, speed: 0.007, angle: 4, color: '#38bdf8' },
  { name: 'Mars', distance: 340, radius: 6, speed: 0.005, angle: 1, color: '#f43f5e' },
  { name: 'Jupiter', distance: 450, radius: 16, speed: 0.003, angle: 3, color: '#fbbf24' },
  { name: 'Saturn', distance: 580, radius: 12, speed: 0.002, angle: 5, color: '#fef08a', hasRing: true }
];

function animateSpace() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // วาดดวงดาวกะพริบ
  stars.forEach(star => {
    star.alpha += star.speed;
    if (star.alpha > 1 || star.alpha < 0) star.speed = -star.speed;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = \`rgba(255, 255, 255, \${Math.abs(star.alpha)})\`;
    ctx.fill();
  });

  // จุดศูนย์กลางระบบสุริยะ (ดวงอาทิตย์)
  const sunX = canvas.width * 0.85;
  const sunY = canvas.height * 0.5;

  // วาดดวงอาทิตย์เรืองแสง
  const sunGlow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 50);
  sunGlow.addColorStop(0, '#f97316');
  sunGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = sunGlow;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 50, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(sunX, sunY, 25, 0, Math.PI * 2);
  ctx.fillStyle = '#fbbf24';
  ctx.shadowColor = '#f97316';
  ctx.shadowBlur = 30;
  ctx.fill();
  ctx.shadowBlur = 0; // reset

  // วาดและจำลองการโคจรของดาวเคราะห์
  planets.forEach(planet => {
    planet.angle += planet.speed;

    // วาดเส้นวงโคจร
    ctx.beginPath();
    ctx.arc(sunX, sunY, planet.distance, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // คำนวณตำแหน่งดาว
    const px = sunX + Math.cos(planet.angle) * planet.distance;
    const py = sunY + Math.sin(planet.angle) * planet.distance;

    // วาดวงแหวนให้ดาวเสาร์
    if (planet.hasRing) {
      ctx.beginPath();
      ctx.ellipse(px, py, planet.radius * 2, planet.radius * 0.6, Math.PI / 4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // วาดตัวดาวเคราะห์
    ctx.beginPath();
    ctx.arc(px, py, planet.radius, 0, Math.PI * 2);
    ctx.fillStyle = planet.color;
    ctx.fill();
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
  background: #030712;
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
