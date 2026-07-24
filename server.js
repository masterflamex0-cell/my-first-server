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
          <td><span class="badge-status">🟢 Active</span></td>
        </tr>
      `;
    });

    const html = `
<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ฐานข้อมูลนักศึกษา | Space Alien Party Edition</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Kanit:wght@300;400;600;700&display=swap" rel="stylesheet">

<style>
:root {
  --bg-dark: #0d0b26;
  --neon-pink: #ff2a85;
  --neon-cyan: #00f2fe;
  --neon-lime: #00ff87;
  --neon-yellow: #ffdd00;
  --neon-purple: #9d4edd;
  --text-main: #ffffff;
  --text-muted: #c7d2fe;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Kanit', 'Fredoka', sans-serif;
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

/* Background Canvas สำหรับดาวเคลื่อนไหว */
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

/* ---------- ตัวการ์ตูนดุ๊กดิ๊กบนหน้าจอ (Animated Characters) ---------- */
.floating-char {
  position: fixed;
  z-index: 10;
  user-select: none;
  pointer-events: none;
  filter: drop-shadow(0 0 15px rgba(255,255,255,0.4));
}

/* นักบินอวกาศลอยเคลิ้ม */
.astronaut {
  font-size: 4.5rem;
  top: 15%;
  right: 5%;
  animation: floatZeroG 6s ease-in-out infinite alternate, rotateGently 12s ease-in-out infinite;
}

/* เอเลี่ยนกระโดดดุ๊กดิ๊ก */
.alien-jumper {
  font-size: 4rem;
  bottom: 8%;
  left: 4%;
  animation: alienBounce 2s cubic-bezier(0.28, 0.84, 0.42, 1) infinite;
}

/* ยาน UFO บินร่อน */
.ufo-flyer {
  font-size: 3.5rem;
  top: 10%;
  left: 6%;
  animation: ufoPatrol 8s linear infinite alternate;
}

/* เอเลี่ยนตาเดียวจิ๋วแอบข้างตาราง */
.alien-peek {
  font-size: 3.5rem;
  bottom: 25%;
  right: 3%;
  animation: peekAnim 4s ease-in-out infinite alternate;
}

@keyframes floatZeroG {
  0% { transform: translateY(0px) translateX(0px); }
  50% { transform: translateY(-25px) translateX(15px); }
  100% { transform: translateY(10px) translateX(-10px); }
}

@keyframes rotateGently {
  0% { transform: rotate(0deg); }
  50% { transform: rotate(15deg); }
  100% { transform: rotate(-10deg); }
}

@keyframes alienBounce {
  0%, 100% { transform: translateY(0) scale(1, 1); }
  50% { transform: translateY(-40px) scale(0.9, 1.1); }
}

@keyframes ufoPatrol {
  0% { transform: translateX(0) translateY(0) rotate(-5deg); }
  100% { transform: translateX(60px) translateY(20px) rotate(10deg); }
}

@keyframes peekAnim {
  0% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.2) rotate(-15deg); }
  100% { transform: scale(1) rotate(10deg); }
}

/* ---------- Header ---------- */
header {
  background: rgba(13, 11, 38, 0.75);
  backdrop-filter: blur(16px);
  border-bottom: 3px solid transparent;
  border-image: linear-gradient(90deg, var(--neon-pink), var(--neon-lime), var(--neon-cyan)) 1;
  padding: 30px 20px;
  text-align: center;
  position: relative;
  box-shadow: 0 10px 40px rgba(255, 42, 133, 0.2);
}

.title-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, rgba(255, 42, 133, 0.2), rgba(0, 242, 254, 0.2));
  border: 2px solid var(--neon-pink);
  padding: 6px 20px;
  border-radius: 30px;
  font-size: 0.95rem;
  color: var(--neon-yellow);
  font-weight: 600;
  margin-bottom: 12px;
  box-shadow: 0 0 15px rgba(255, 42, 133, 0.4);
}

header h1 {
  font-family: 'Fredoka', 'Kanit', sans-serif;
  font-size: 2.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #fff 20%, var(--neon-yellow) 50%, var(--neon-lime) 80%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 20px rgba(0, 255, 135, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

header p {
  color: var(--text-muted);
  font-size: 1.1rem;
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
  background: rgba(22, 19, 59, 0.8);
  border: 2px solid var(--neon-cyan);
  padding: 14px 28px;
  border-radius: 20px;
  margin-bottom: 25px;
  backdrop-filter: blur(12px);
  box-shadow: 0 0 20px rgba(0, 242, 254, 0.25);
  flex-wrap: wrap;
  gap: 15px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  font-weight: 500;
}

.pulse-dot {
  width: 12px;
  height: 12px;
  background-color: var(--neon-lime);
  border-radius: 50%;
  box-shadow: 0 0 15px var(--neon-lime);
  animation: pulse 1.2s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(0, 255, 137, 0.8); }
  70% { transform: scale(1.1); box-shadow: 0 0 0 12px rgba(0, 255, 137, 0); }
  100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(0, 255, 137, 0); }
}

.clock-display {
  font-family: 'Fredoka', monospace;
  color: var(--neon-yellow);
  font-size: 1.2rem;
  font-weight: 700;
}

/* ---------- Dashboard Grid Cards ---------- */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.card {
  background: linear-gradient(135deg, rgba(30, 27, 75, 0.85), rgba(15, 23, 42, 0.85));
  backdrop-filter: blur(16px);
  border: 2px solid var(--neon-pink);
  border-radius: 24px;
  padding: 24px;
  position: relative;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 10px 30px rgba(255, 42, 133, 0.25);
}

.card:nth-child(2) {
  border-color: var(--neon-lime);
  box-shadow: 0 10px 30px rgba(0, 255, 137, 0.25);
}

.card:nth-child(3) {
  border-color: var(--neon-yellow);
  box-shadow: 0 10px 30px rgba(255, 221, 0, 0.25);
}

.card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 242, 254, 0.4);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  color: var(--text-muted);
  font-size: 1rem;
  font-weight: 600;
}

.card-icon {
  font-size: 2.2rem;
}

.card-number {
  margin-top: 15px;
  font-family: 'Fredoka', sans-serif;
  font-size: 3.2rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 0 15px var(--neon-pink);
}

/* ---------- Controls & Search ---------- */
.controls-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.search-wrapper {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-input {
  width: 100%;
  padding: 16px 20px 16px 52px;
  background: rgba(22, 19, 59, 0.85);
  border: 2px solid var(--neon-cyan);
  border-radius: 20px;
  color: #fff;
  font-size: 1.05rem;
  outline: none;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(0, 242, 254, 0.2);
}

.search-input:focus {
  border-color: var(--neon-lime);
  box-shadow: 0 0 25px rgba(0, 255, 137, 0.5);
  transform: scale(1.01);
}

.search-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.4rem;
}

.btn-space {
  background: linear-gradient(135deg, var(--neon-pink), var(--neon-purple));
  color: #fff;
  border: none;
  padding: 16px 28px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(255, 42, 133, 0.5);
}

.btn-space:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 0 30px rgba(0, 252, 254, 0.8);
  background: linear-gradient(135deg, var(--neon-cyan), var(--neon-lime));
  color: #000;
}

/* ---------- Colorful Table Box ---------- */
.table-box {
  background: rgba(22, 19, 59, 0.85);
  backdrop-filter: blur(16px);
  border: 2px solid var(--neon-purple);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(157, 78, 221, 0.3);
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

thead {
  background: linear-gradient(90deg, rgba(255, 42, 133, 0.3), rgba(0, 242, 254, 0.3));
  border-bottom: 2px solid var(--neon-cyan);
}

thead th {
  padding: 20px 24px;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--neon-yellow);
  letter-spacing: 1px;
}

tbody tr {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.2s ease;
}

tbody tr:hover {
  background: rgba(0, 242, 254, 0.15);
  transform: scale(1.01);
  box-shadow: inset 6px 0 0 var(--neon-pink);
}

tbody td {
  padding: 18px 24px;
  font-size: 1.05rem;
  font-weight: 500;
}

.badge-id {
  font-family: 'Fredoka', monospace;
  background: linear-gradient(135deg, rgba(0, 242, 254, 0.2), rgba(0, 255, 137, 0.2));
  color: var(--neon-cyan);
  padding: 6px 16px;
  border-radius: 12px;
  border: 1px solid var(--neon-cyan);
  font-weight: 700;
}

.badge-status {
  color: var(--neon-lime);
  font-size: 0.9rem;
  background: rgba(0, 255, 137, 0.15);
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid var(--neon-lime);
  font-weight: 600;
}

/* Click Spawn Alien Effect */
.click-alien {
  position: fixed;
  font-size: 2.5rem;
  pointer-events: none;
  z-index: 999;
  animation: spawnFloat 1s ease-out forwards;
}

@keyframes spawnFloat {
  0% { opacity: 1; transform: scale(0.5) translateY(0); }
  100% { opacity: 0; transform: scale(1.5) translateY(-60px); }
}

/* ---------- Footer ---------- */
footer {
  text-align: center;
  padding: 30px;
  color: var(--text-muted);
  font-size: 0.95rem;
  border-top: 2px solid var(--neon-pink);
  background: rgba(13, 11, 38, 0.95);
  margin-top: auto;
}

footer strong {
  color: var(--neon-yellow);
}

/* Responsive */
@media (max-width: 768px) {
  header h1 { font-size: 2rem; }
  .container { width: 95%; }
  .astronaut, .alien-jumper, .alien-peek { font-size: 2.8rem; }
  .top-status-bar { flex-direction: column; align-items: flex-start; }
}
</style>
</head>

<body>

<!-- Background Canvas อวกาศเคลื่อนไหว -->
<canvas id="spaceCanvas"></canvas>

<!-- ตัวการ์ตูนเคลื่อนไหวลอยในหน้าจอ -->
<div class="floating-char astronaut">👨‍🚀</div>
<div class="floating-char alien-jumper">👾</div>
<div class="floating-char ufo-flyer">🛸</div>
<div class="floating-char alien-peek">👽</div>

<div class="content-wrapper">

  <header>
    <div class="title-badge">👾 ALIEN PARTY • STUDENT PORTAL 🛸</div>
    <h1>🌌 ฐานข้อมูลนักศึกษา 👨‍🚀</h1>
    <p>ระบบจัดการข้อมูลนักศึกษาฉบับอวกาศสดใส | Node.js • PostgreSQL • Railway</p>
  </header>

  <div class="container">

    <!-- Top Status Bar -->
    <div class="top-status-bar">
      <div class="status-item">
        <div class="pulse-dot"></div>
        <span>สถานะเซิร์ฟเวอร์: <strong style="color:var(--neon-lime)">เชื่อมต่อฐานข้อมูลเรียบร้อย</strong></span>
      </div>
      <div class="status-item">
        <span>📡 Latency: <strong style="color:var(--neon-cyan)">18 ms</strong></span>
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
          <span class="card-icon">👨‍🎓</span>
        </div>
        <div class="card-number" style="color: var(--neon-pink);">${result.rows.length}</div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">สถานะฐานข้อมูล</span>
          <span class="card-icon">⚡</span>
        </div>
        <div class="card-number" style="color: var(--neon-lime);">ONLINE</div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">โหนดประมวลผล</span>
          <span class="card-icon">🪐</span>
        </div>
        <div class="card-number" style="color: var(--neon-yellow);">RAILWAY</div>
      </div>
    </div>

    <!-- Search & Controls -->
    <div class="controls-box">
      <div class="search-wrapper">
        <span class="search-icon">🔎</span>
        <input type="text" id="searchInput" class="search-input" placeholder="พิมพ์รหัสนักศึกษา หรือ ชื่อเพื่อค้นหา..." onkeyup="filterTable()">
      </div>
      <button class="btn-space" onclick="location.reload()">
        <span>🎉</span> รีเฟรชข้อมูล
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
          ${tableRowsHtml.length > 0 ? tableRowsHtml : `<tr><td colspan="3" style="text-align:center; color: var(--text-muted); padding:40px;">👾 ไม่พบข้อมูลนักศึกษาในระบบอวกาศ</td></tr>`}
        </tbody>
      </table>
    </div>

  </div>

  <footer>
    <p>🚀 <strong>Student Database (Alien Party Edition)</strong></p>
    <p style="margin-top: 6px;">Powered by Node.js • PostgreSQL • Railway Platform</p>
    <p style="margin-top: 8px; opacity: 0.7;">© 2026 All Rights Reserved | Interstellar Space Academy 🪐</p>
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

// --- 3. Click Spawn Alien Effect (คลิกตรงไหนมีเอเลี่ยนโผล่) ---
const alienEmojis = ['👾', '👽', '🛸', '🌟', '🤖', '👾'];
document.addEventListener('click', (e) => {
  const spawn = document.createElement('div');
  spawn.className = 'click-alien';
  spawn.innerText = alienEmojis[Math.floor(Math.random() * alienEmojis.length)];
  spawn.style.left = (e.clientX - 20) + 'px';
  spawn.style.top = (e.clientY - 20) + 'px';
  document.body.appendChild(spawn);

  setTimeout(() => {
    spawn.remove();
  }, 1000);
});

// --- 4. ระบบสุริยะเเละดาวตกสีสดใสด้วย Canvas ---
const canvas = document.getElementById('spaceCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// สร้างดวงดาวหลากสี
const stars = [];
const colors = ['#ff2a85', '#00f2fe', '#00ff87', '#ffdd00', '#ffffff'];

for (let i = 0; i < 180; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    alpha: Math.random(),
    speed: Math.random() * 0.03
  });
}

// ระบบดาวตก (Shooting Stars)
let shootingStars = [];
function createShootingStar() {
  if (Math.random() < 0.05) {
    shootingStars.push({
      x: Math.random() * canvas.width,
      y: 0,
      length: Math.random() * 80 + 40,
      speed: Math.random() * 10 + 6,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
}

function animateSpace() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // วาดดาวกะพริบ
  stars.forEach(star => {
    star.alpha += star.speed;
    if (star.alpha > 1 || star.alpha < 0) star.speed = -star.speed;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = star.color;
    ctx.globalAlpha = Math.abs(star.alpha);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  // วาดดาวตก
  createShootingStar();
  shootingStars.forEach((ss, index) => {
    ctx.beginPath();
    ctx.moveTo(ss.x, ss.y);
    ctx.lineTo(ss.x - ss.length, ss.y + ss.length);
    ctx.strokeStyle = ss.color;
    ctx.lineWidth = 2;
    ctx.stroke();

    ss.x += ss.speed;
    ss.y += ss.speed;

    if (ss.y > canvas.height || ss.x > canvas.width) {
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
<title>System Error | Alien Space</title>
<link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500&display=swap" rel="stylesheet">
<style>
body {
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #0d0b26;
  font-family: 'Kanit', sans-serif;
  color: #fff;
}
.box {
  background: rgba(255, 42, 133, 0.15);
  border: 2px solid #ff2a85;
  padding: 40px;
  border-radius: 24px;
  backdrop-filter: blur(10px);
  text-align: center;
  max-width: 600px;
  box-shadow: 0 0 50px rgba(255, 42, 133, 0.4);
}
h1 { color: #ff2a85; margin-bottom: 12px; font-size: 2rem; }
p { color: #c7d2fe; margin-bottom: 20px; }
pre {
  background: #000;
  color: #00ff87;
  padding: 16px;
  border-radius: 12px;
  text-align: left;
  overflow-x: auto;
  font-size: 0.9rem;
  border: 1px solid #00ff8766;
}
</style>
</head>
<body>
<div class="box">
  <h1>💥 สัญญาณฐานข้อมูลขัดข้อง!</h1>
  <p>เกิดข้อผิดพลาดในการเชื่อมต่อกับยานแม่ในห้วงอวกาศ</p>
  <pre>${err.message}</pre>
</div>
</body>
</html>
`);
  }
});

server.listen(port, () => {
  console.log(`🌌 Alien Party Database running on port: ${port}`);
});
