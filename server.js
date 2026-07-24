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
        </tr>
      `;
    });

    const html = `
<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Space Student Management System</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600&family=Orbitron:wght@500;700;900&display=swap" rel="stylesheet">

<style>
:root {
  --bg-space: #0b0d19;
  --card-bg: rgba(22, 27, 46, 0.65);
  --card-border: rgba(99, 102, 241, 0.25);
  --neon-cyan: #00f2fe;
  --neon-purple: #9d4edd;
  --text-main: #f1f5f9;
  --text-muted: #94a3b8;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Kanit', sans-serif;
}

body {
  background-color: var(--bg-space);
  background-image: 
    radial-gradient(circle at 15% 20%, rgba(157, 78, 221, 0.15) 0%, transparent 45%),
    radial-gradient(circle at 85% 80%, rgba(0, 242, 254, 0.15) 0%, transparent 45%),
    radial-gradient(2px 2px at 20px 30px, #fff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 40px 70px, #ffffffa0, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 90px 40px, #fff, rgba(0,0,0,0));
  background-repeat: repeat;
  background-size: 100% 100%, 100% 100%, 250px 250px, 300px 300px, 200px 200px;
  color: var(--text-main);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ---------- Header ---------- */
header {
  background: rgba(11, 13, 25, 0.7);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--card-border);
  padding: 25px 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

header::before {
  content: '';
  position: absolute;
  top: 0; left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--neon-cyan), transparent);
}

header h1 {
  font-family: 'Orbitron', 'Kanit', sans-serif;
  font-size: 2rem;
  letter-spacing: 2px;
  background: linear-gradient(135deg, #ffffff 30%, var(--neon-cyan));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

header p {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin-top: 6px;
  font-weight: 300;
}

/* ---------- Container ---------- */
.container {
  width: 90%;
  max-width: 1100px;
  margin: 35px auto;
  flex: 1;
}

/* ---------- Dashboard Card ---------- */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
}

.card {
  background: var(--card-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  border-color: var(--neon-cyan);
}

.card-title {
  color: var(--text-muted);
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-number {
  margin-top: 10px;
  font-family: 'Orbitron', sans-serif;
  font-size: 2.8rem;
  font-weight: 700;
  color: var(--neon-cyan);
  text-shadow: 0 0 15px rgba(0, 242, 254, 0.4);
}

/* ---------- Controls / Search Bar ---------- */
.controls-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 15px;
  flex-wrap: wrap;
}

.search-wrapper {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 42px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  color: #fff;
  font-size: 0.95rem;
  outline: none;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: var(--neon-cyan);
  box-shadow: 0 0 12px rgba(0, 242, 254, 0.3);
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
}

/* ---------- Table ---------- */
.table-box {
  background: var(--card-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--card-border);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

thead {
  background: rgba(30, 41, 59, 0.8);
  border-bottom: 1px solid var(--card-border);
}

thead th {
  padding: 18px 24px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--neon-cyan);
  text-transform: uppercase;
  letter-spacing: 1px;
}

tbody tr {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
}

tbody tr:last-child {
  border-bottom: none;
}

tbody tr:hover {
  background: rgba(99, 102, 241, 0.12);
  box-shadow: inset 4px 0 0 var(--neon-cyan);
}

tbody td {
  padding: 16px 24px;
  font-size: 0.95rem;
}

.badge-id {
  font-family: 'Orbitron', monospace;
  background: rgba(0, 242, 254, 0.1);
  color: var(--neon-cyan);
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid rgba(0, 242, 254, 0.25);
  font-size: 0.88rem;
}

.student-name {
  font-weight: 400;
}

/* ---------- Footer ---------- */
footer {
  text-align: center;
  padding: 30px;
  color: var(--text-muted);
  font-size: 0.85rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(11, 13, 25, 0.9);
  margin-top: auto;
}

footer strong {
  color: var(--neon-cyan);
}

/* ---------- Responsive ---------- */
@media (max-width: 768px) {
  header h1 { font-size: 1.5rem; }
  .container { width: 94%; margin: 20px auto; }
  .card-number { font-size: 2.2rem; }
  thead th, tbody td { padding: 12px 16px; }
  .search-wrapper { max-width: 100%; }
}
</style>
</head>

<body>

<header>
  <h1>🛸 SPACE STUDENT PORTAL</h1>
  <p>ระบบจัดการข้อมูลนักศึกษาแห่งอนาคต | Node.js • PostgreSQL • Railway</p>
</header>

<div class="container">

  <div class="dashboard-grid">
    <div class="card">
      <div class="card-title">
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        จำนวนนักศึกษาทั้งหมดในระบบ
      </div>
      <div class="card-number">${result.rows.length}</div>
    </div>
  </div>

  <div class="controls-box">
    <div class="search-wrapper">
      <span class="search-icon">🔍</span>
      <input type="text" id="searchInput" class="search-input" placeholder="ค้นหาด้วยรหัส หรือ ชื่อนักศึกษา..." onkeyup="filterTable()">
    </div>
  </div>

  <div class="table-box">
    <table id="studentTable">
      <thead>
        <tr>
          <th>รหัสนักศึกษา</th>
          <th>ชื่อ - นามสกุล</th>
        </tr>
      </thead>
      <tbody>
        ${tableRowsHtml.length > 0 ? tableRowsHtml : `<tr><td colspan="2" style="text-align:center; color: var(--text-muted); padding:30px;">🛰️ ไม่พบข้อมูลนักศึกษาในระบบ</td></tr>`}
      </tbody>
    </table>
  </div>

</div>

<footer>
  <p>🚀 <strong>Space Student Management System</strong></p>
  <p style="margin-top: 4px;">Powered by Node.js • PostgreSQL • Railway</p>
  <p style="margin-top: 8px; opacity: 0.6;">© 2026 All Rights Reserved</p>
</footer>

<script>
// ฟังก์ชันค้นหาข้อมูลตาราง (Client-side Search)
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
<title>System Error</title>
<link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500&display=swap" rel="stylesheet">
<style>
body {
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #0b0d19;
  font-family: 'Kanit', sans-serif;
  color: #fff;
}
.box {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.4);
  padding: 40px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  text-align: center;
  max-width: 600px;
  box-shadow: 0 0 30px rgba(239, 68, 68, 0.2);
}
h1 { color: #ef4444; margin-bottom: 10px; font-size: 1.8rem; }
p { color: #cbd5e1; margin-bottom: 20px; }
pre {
  background: #000;
  color: #4ade80;
  padding: 15px;
  border-radius: 10px;
  text-align: left;
  overflow-x: auto;
  font-size: 0.85rem;
}
</style>
</head>
<body>
<div class="box">
  <h1>💥 เกิดข้อผิดพลาดในการเชื่อมต่อ</h1>
  <p>ไม่สามารถดึงข้อมูลจากฐานข้อมูลอวกาศได้ กรุณาตรวจสอบการเชื่อมต่อ</p>
  <pre>${err.message}</pre>
</div>
</body>
</html>
`);
  }
});

server.listen(port, () => {
  console.log(`🌌 Server is warp-speed running on port: ${port}`);
});
