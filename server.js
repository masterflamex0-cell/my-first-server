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

    // สร้าง HTML ส่วนตารางจากแถวข้อมูลในฐานข้อมูลก่อน
    let tableRowsHtml = "";
    result.rows.forEach(row => {
      tableRowsHtml += `
        <tr>
          <td>${row.student_id}</td>
          <td>${row.student_name}</td>
        </tr>
      `;
    });

    // ประกอบร่างโครงสร้าง HTML ทั้งหมด
    const html = `
<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Student Management System</title>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
body {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  min-height: 100vh;
}
header {
  background: white;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}
header h1 {
  color: #1e3a8a;
  font-size: 34px;
}
header p {
  color: #666;
  margin-top: 6px;
}
.container {
  width: 95%;
  max-width: 1200px;
  margin: 40px auto;
}
.card {
  background: white;
  border-radius: 18px;
  padding: 25px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.18);
  margin-bottom: 30px;
}
.card-title {
  color: #444;
  font-size: 20px;
}
.card-number {
  margin-top: 12px;
  color: #2563eb;
  font-size: 42px;
  font-weight: bold;
}
.table-box {
  background: white;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.18);
}
table {
  width: 100%;
  border-collapse: collapse;
}
thead {
  background: #2563eb;
  color: white;
}
thead th {
  padding: 18px;
  font-size: 17px;
  text-align: left;
}
tbody td {
  padding: 16px;
  border-bottom: 1px solid #eee;
}
tbody tr:nth-child(even) {
  background: #f8fbff;
}
tbody tr:hover {
  background: #dbeafe;
  transition: .3s;
}
footer {
  text-align: center;
  color: white;
  margin: 40px;
  font-size: 15px;
}
@media(max-width: 700px) {
  header h1 {
    font-size: 24px;
  }
  .card-number {
    font-size: 30px;
  }
  table {
    font-size: 14px;
  }
  thead th, tbody td {
    padding: 10px;
  }
}
</style>
</head>
<body>

<header>
  <h1>🎓 Student Management System</h1>
  <p>ระบบจัดการข้อมูลนักศึกษา | Node.js + PostgreSQL + Railway</p>
</header>

<div class="container">
  <div class="card">
    <div class="card-title">จำนวนข้อมูลนักศึกษาทั้งหมด</div>
    <div class="card-number">${result.rows.length}</div>
  </div>

  <div class="table-box">
    <table>
      <thead>
        <tr>
          <th>รหัสนักศึกษา</th>
          <th>ชื่อนักศึกษา</th>
        </tr>
      </thead>
      <tbody>
        ${tableRowsHtml}
      </tbody>
    </table>
  </div>
</div>

<footer>
  <p>🎓 Student Management System</p>
  <p>Powered by Node.js • PostgreSQL • Railway</p>
  <p style="margin-top: 8px;">© 2026 All Rights Reserved</p>
</footer>

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
<title>Error</title>
<style>
body {
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  font-family: 'Segoe UI', sans-serif;
  color: white;
  text-align: center;
}
.box {
  background: rgba(255, 255, 255, 0.12);
  padding: 40px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}
h1 {
  font-size: 38px;
  margin-bottom: 15px;
}
pre {
  margin-top: 20px;
  background: #111827;
  color: #22c55e;
  padding: 15px;
  border-radius: 10px;
  text-align: left;
  overflow: auto;
  max-width: 700px;
}
</style>
</head>
<body>
<div class="box">
  <h1>⚠ เกิดข้อผิดพลาด</h1>
  <p>ไม่สามารถดึงข้อมูลจากฐานข้อมูลได้</p>
  <pre>${err.message}</pre>
</div>
</body>
</html>
`);
  }
});

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
