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
          <td><span class="badge-id">${row.student_id}</span></td>
          <td class="student-name">${row.student_name}</td>
          <td><span class="badge-status">Active</span></td>
        </tr>
      `;
    });

    const html = `
<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Student Information System | Deep Space Portal</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=Prompt:wght@300;400;500;600&display=swap" rel="stylesheet">

<style>
:root {
  --bg-dark: #050814;
  --card-bg: rgba(12, 20, 41, 0.65);
  --card-border: rgba(56, 189, 248, 0.25);
  --cyan-glow: #38bdf8;
  --accent-purple: #818cf8;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --success: #34d399;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Prompt', 'Chakra Petch', sans-serif;
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

/* Background Canvas อวกาศ */
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
  z-index: 2;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ---------- Header ---------- */
header {
  background: rgba(5, 8, 20, 0.7);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(56, 189, 248, 0.2);
  padding: 22px 0;
  text-align: center;
  position: relative;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
}

.title-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.3);
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  color: var(--cyan-glow);
  font-weight: 500;
  letter-spacing: 1px;
  margin-bottom: 8px;
  font-family: 'Chakra Petch', sans-serif;
  text-transform: uppercase;
}

header h1 {
  font-family: 'Chakra Petch', sans-serif;
  font-size: 2.1rem;
  font-weight: 700;
  letter-spacing: 1px;
  background: linear-gradient(135deg, #ffffff 30%, #a5f3fc 70%, var(--cyan-glow) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(56, 189, 248, 0.25);
}

header p {
  color: var(--text-muted);
  font-size: 0.92rem;
  margin-top: 4px;
  font-weight: 300;
}

/* ---------- Container ---------- */
.container {
  width: 90%;
  max-width: 1080px;
  margin: 25px auto;
  flex: 1;
}

/* ---------- Top Bar (Status & Clock) ---------- */
.top-status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  padding: 12px 24px;
  border-radius: 14px;
  margin-bottom: 20px;
  backdrop-filter: blur(16px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  flex-wrap: wrap;
  gap: 12px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.88rem;
  color: var(--text-muted);
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background-color: var(--success);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--success);
  animation: pulse 1.8s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.15); opacity: 1; box-shadow: 0 0 12px var(--success); }
  100% { transform: scale(0.95); opacity: 0.8; }
}

.clock-display {
  font-family: 'Chakra Petch', monospace;
  color: var(--cyan-glow);
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 1px;
}

/* ---------- Dashboard Grid Cards ---------- */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-bottom: 20px;
}

.card {
  background: var(--card-bg);
  backdrop-filter: blur(16px);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  padding: 18px 22px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.card:hover {
  border-color: var(--cyan-glow);
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(56, 189, 248, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 400;
}

.card-icon {
  font-size: 1.2rem;
  opacity: 0.8;
}

.card-number {
  margin-top: 8px;
  font-family: 'Chakra Petch', sans-serif;
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--text-main);
}

/* ---------- Controls & Search ---------- */
.controls-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-wrapper {
  position: relative;
  flex: 1;
  min-width: 260px;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 44px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  color: var(--text-main);
  font-size: 0.92rem;
  outline: none;
  backdrop-filter: blur(12px);
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: #64748b;
}

.search-input:focus {
  border-color: var(--cyan-glow);
  box-shadow: 0 0 15px rgba(56, 189, 248, 0.2);
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.1rem;
  color: var(--text-muted);
}

.btn-space {
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(129, 140, 248, 0.2));
  border: 1px solid var(--cyan-glow);
  color: var(--cyan-glow);
  padding: 12px 22px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-space:hover {
  background: var(--cyan-glow);
  color: #050814;
  box-shadow: 0 0 20px rgba(56, 189, 248, 0.4);
}

/* ---------- Table Box ---------- */
.table-box {
  background: var(--card-bg);
  backdrop-filter: blur(16px);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

thead {
  background: rgba(15, 23, 42, 0.8);
  border-bottom: 1px solid var(--card-border);
}

thead th {
  padding: 16px 20px;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--cyan-glow);
  letter-spacing: 0.5px;
  font-family: 'Chakra Petch', sans-serif;
  text-transform: uppercase;
}

tbody tr {
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  transition: all 0.2s ease;
}

tbody tr:hover {
  background: rgba(56, 189, 248, 0.06);
}

tbody td {
  padding: 15px 20px;
  font-size: 0.92rem;
  font-weight: 400;
}

.badge-id {
  font-family: 'Chakra Petch', monospace;
  background: rgba(56, 189, 248, 0.1);
  color: var(--cyan-glow);
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid rgba(56, 189, 248, 0.3);
  font-weight: 600;
  font-size: 0.88rem;
}

.badge-status {
  color: var(--success);
  font-size: 0.8rem;
  background: rgba(52, 211, 153, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid rgba(52, 211, 153, 0.3);
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.badge-status::before {
  content: '';
  width: 6px;
  height: 6px;
  background-color: var(--success);
  border-radius: 50%;
}

/* ---------- Footer ---------- */
footer {
  text-align: center;
  padding: 22px;
  color: var(--text-muted);
  font-size: 0.85rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(5, 8, 20, 0.9);
  margin-top: auto;
}

footer strong {
  color: var(--cyan-glow);
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  header h1 { font-size: 1.6rem; }
  .dashboard-grid { grid-template-columns: 1fr; }
  .container { width: 94%; }
  .top-status-bar { flex-direction: column; align-items: flex-start; }
}
</style>
</head>

<body>

<!-- Background Canvas สำหรับอวกาศแบบเรียบหรู -->
<canvas id="spaceCanvas"></canvas>

<div class="content-wrapper">

  <header>
    <div class="title-tag">System Portal • Node.js Engine</div>
    <h1>ระบบสารสนเทศข้อมูลนักศึกษา</h1>
    <p>Enterprise Student Management System | Connected via PostgreSQL</p>
  </header>

  <div class="container">

    <!-- Top Status Bar -->
    <div class="top-status-bar">
      <div class="status-item">
        <div class="pulse-dot"></div>
        <span>Database Status: <strong style="color:var(--success)">Connected (SSL Encrypted)</strong></span>
      </div>
      <div class="status-item">
        <span>Host Platform: <strong style="color:var(--cyan-glow)">Railway Cloud Server</strong></span>
      </div>
      <div class="status-item">
        <span>System Time: <span id="clock" class="clock-display">00:00:00</span></span>
      </div>
    </div>

    <!-- Dashboard Cards -->
    <div class="dashboard-grid">
      <div class="card">
        <div class="card-header">
          <span class="card-title">จำนวนนักศึกษาทั้งหมด</span>
          <span class="card-icon">👥</span>
        </div>
        <div class="card-number" style="color: var(--cyan-glow);">${result.rows.length}</div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">สถานะระบบ</span>
          <span class="card-icon">⚡</span>
        </div>
        <div class="card-number" style="color: var(--success); font-size: 1.8rem; line-height: 2.2rem;">ONLINE</div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">การเชื่อมต่อโหนด</span>
          <span class="card-icon">🌐</span>
        </div>
        <div class="card-number" style="color: var(--accent-purple); font-size: 1.8rem; line-height: 2.2rem;">SECURE</div>
      </div>
    </div>

    <!-- Search & Controls -->
    <div class="controls-box">
      <div class="search-wrapper">
        <span class="search-icon">🔍</span>
        <input type="text" id="searchInput" class="search-input" placeholder="ค้นหาด้วยรหัสนักศึกษา หรือ ชื่อ-นามสกุล..." onkeyup="filterTable()">
      </div>
      <button class="btn-space" onclick="location.reload()">
        🔄 รีเฟรชข้อมูล
      </button>
    </div>

    <!-- Table -->
    <div class="table-box">
      <table id="studentTable">
        <thead>
          <tr>
            <th>รหัสนักศึกษา</th>
            <th>ชื่อ - นามสกุล นักศึกษา</th>
            <th>สถานะการศึกษา</th>
          </tr>
        </thead>
        <tbody>
          ${tableRowsHtml.length > 0 ? tableRowsHtml : `<tr><td colspan="3" style="text-align:center; color: var(--text-muted); padding:30px;">ไม่พบข้อมูลนักศึกษาในระบบ</td></tr>`}
        </tbody>
      </table>
    </div>

  </div>

  <footer>
    <p><strong>Student Information System</strong> — Deep Space Enterprise Edition</p>
    <p style="margin-top: 4px; opacity: 0.7;">Powered by Node.js Engine • PostgreSQL Database • Deployed on Railway</p>
  </footer>

</div>

<script>
// --- 1. Realtime Clock ---
function updateClock() {
  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0];
  document.getElementById('clock').textContent = timeStr + ' UTC';
}
setInterval(updateClock, 1000);
updateClock();

// --- 2. Client-side Search ---
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

// --- 3. Realistic Solar System & Deep Space Canvas ---
const canvas = document.getElementById('spaceCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// สร้างดวงดาวแบบละเอียด
const stars = [];
for (let i = 0; i < 250; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.5,
    alpha: Math.random(),
    speed: Math.random() * 0.015 + 0.005
  });
}

// สร้างดาวเคราะห์ระบบสุริยะ
const planets = [
  { x: canvas.width * 0.15, y: canvas.height * 0.25, radius: 24, color: '#38bdf8', ring: true, angle: 0, orbitSpeed: 0.0003 },
  { x: canvas.width * 0.85, y: canvas.height * 0.75, radius: 35, color: '#818cf8', ring: false, angle: Math.PI, orbitSpeed: 0.0002 }
];

// สร้างดาวตก
let shootingStars = [];
function createShootingStar() {
  if (Math.random() < 0.02) {
    shootingStars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * (canvas.height * 0.5),
      length: Math.random() * 100 + 60,
      speed: Math.random() * 8 + 4,
      alpha: 1
    });
  }
}

function animateSpace() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. วาดดาวระยิบระยับ
  stars.forEach(star => {
    star.alpha += star.speed;
    if (star.alpha > 1 || star.alpha < 0.2) star.speed = -star.speed;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(226, 232, 240, ${Math.abs(star.alpha)})`;
    ctx.fill();
  });

  // 2. วาดดาวเคราะห์พร้อมแสงเงาสมจริง
  planets.forEach(p => {
    p.angle += p.orbitSpeed;
    const currentX = p.x + Math.cos(p.angle) * 30;
    const currentY = p.y + Math.sin(p.angle) * 15;

    // รังสีเรืองแสงรอบดาว
    const glowGradient = ctx.createRadialGradient(currentX, currentY, p.radius * 0.5, currentX, currentY, p.radius * 2.5);
    glowGradient.addColorStop(0, p.color + '44');
    glowGradient.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(currentX, currentY, p.radius * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = glowGradient;
    ctx.fill();

    // ตัวดาวเคราะห์
    const planetGradient = ctx.createRadialGradient(
      currentX - p.radius * 0.3, currentY - p.radius * 0.3, p.radius * 0.1,
      currentX, currentY, p.radius
    );
    planetGradient.addColorStop(0, '#ffffff');
    planetGradient.addColorStop(0.5, p.color);
    planetGradient.addColorStop(1, '#050814');

    ctx.beginPath();
    ctx.arc(currentX, currentY, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = planetGradient;
    ctx.fill();

    // วงแหวน (ถ้ามี)
    if (p.ring) {
      ctx.beginPath();
      ctx.ellipse(currentX, currentY, p.radius * 2.2, p.radius * 0.6, Math.PI / 6, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  });

  // 3. วาดดาวตก
  createShootingStar();
  shootingStars.forEach((ss, index) => {
    const gradient = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.length, ss.y + ss.length);
    gradient.addColorStop(0, 'rgba(56, 189, 248, 0.8)');
    gradient.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.moveTo(ss.x, ss.y);
    ctx.lineTo(ss.x - ss.length, ss.y + ss.length);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ss.x += ss.speed;
    ss.y += ss.speed;
    ss.alpha -= 0.01;

    if (ss.y > canvas.height || ss.x > canvas.width || ss.alpha <= 0) {
      shootingStars.splice(index, 1);
    }
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
<title>Database Connection Error</title>
<link href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;500&display=swap" rel="stylesheet">
<style>
body {
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #050814;
  font-family: 'Prompt', sans-serif;
  color: #fff;
}
.error-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(239, 68, 68, 0.4);
  padding: 35px;
  border-radius: 16px;
  backdrop-filter: blur(12px);
  max-width: 550px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}
h2 { color: #ef4444; margin-bottom: 10px; font-size: 1.4rem; }
p { color: #94a3b8; font-size: 0.95rem; margin-bottom: 15px; }
pre {
  background: #020617;
  color: #f87171;
  padding: 14px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 0.85rem;
  border: 1px solid rgba(239, 68, 68, 0.2);
}
</style>
</head>
<body>
<div class="error-card">
  <h2>⚠️ Database Connection Failure</h2>
  <p>ไม่สามารถเชื่อมต่อกับฐานข้อมูล PostgreSQL ได้ในขณะนี้</p>
  <pre>${err.message}</pre>
</div>
</body>
</html>
`);
  }
});

server.listen(port, () => {
  console.log(`🌌 Professional Space Portal running on port: ${port}`);
});
