// 1. เรียกใช้งาน Module 'http'
const http = require('http');

// 2. กำหนด Port
const port = process.env.PORT || 3000;

// 3. สร้าง Web Server
const server = http.createServer((req, res) => {

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    res.end(`
<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>My Node.js Web Server</title>

<style>
*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;
}

body{
    min-height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
    background:linear-gradient(135deg,#0f172a,#020617,#111827);
    overflow:hidden;
    color:white;
}

/* วงกลมเรืองแสง */
body::before,
body::after{
    content:"";
    position:absolute;
    width:350px;
    height:350px;
    border-radius:50%;
    filter:blur(80px);
    opacity:.45;
}

body::before{
    background:#00c6ff;
    top:-100px;
    left:-80px;
}

body::after{
    background:#7c3aed;
    bottom:-100px;
    right:-80px;
}

.card{
    position:relative;
    width:90%;
    max-width:850px;
    padding:50px;
    text-align:center;

    background:rgba(255,255,255,.08);
    border:1px solid rgba(255,255,255,.15);

    border-radius:25px;
    backdrop-filter:blur(18px);

    box-shadow:
    0 0 40px rgba(0,255,255,.15),
    0 0 80px rgba(124,58,237,.18);

    animation:fadeIn 1s ease;
}

.logo{
    font-size:70px;
    margin-bottom:20px;
}

h1{
    font-size:40px;
    margin-bottom:15px;
    color:#38bdf8;
    text-shadow:0 0 15px #38bdf8;
}

h2{
    color:#ffffff;
    margin-bottom:10px;
}

.info{
    margin-top:25px;
    font-size:20px;
    line-height:1.8;
}

.highlight{
    color:#00e5ff;
    font-weight:bold;
}

.status{
    display:inline-block;
    margin-top:30px;
    padding:12px 30px;
    border-radius:50px;
    background:linear-gradient(90deg,#06b6d4,#2563eb);
    color:white;
    font-weight:bold;
    box-shadow:0 0 25px rgba(0,255,255,.45);
}

.footer{
    margin-top:35px;
    color:#d1d5db;
    font-size:15px;
}

.line{
    width:120px;
    height:4px;
    background:#38bdf8;
    margin:20px auto;
    border-radius:20px;
    box-shadow:0 0 20px #38bdf8;
}

@keyframes fadeIn{
    from{
        opacity:0;
        transform:translateY(40px);
    }
    to{
        opacity:1;
        transform:translateY(0);
    }
}
</style>

</head>

<body>

<div class="card">

<div class="logo">🚀</div>

<h1>NODE.JS WEB SERVER</h1>

<div class="line"></div>

<h2>ยินดีต้อนรับสู่เว็บไซต์ของ</h2>

<div class="info">

<p>
<span class="highlight">นายชญานนท์ เนาว์พรม</span>
</p>

<p>
รหัสนักศึกษา :
<span class="highlight">69319010224</span>
</p>

</div>

<div class="status">
✅ Server Running Successfully
</div>

<div class="info">

<p>🌐 ระบบกำลังทำงานบน Railway Cloud</p>

<p>⚡ พัฒนาโดยใช้ Node.js HTTP Module</p>

<p>💻 Information Technology</p>

</div>

<div class="footer">

<p>© 2026 Chonburi Technological College</p>

</div>

</div>

</body>
</html>
    `);
});

// 4. เปิด Server
server.listen(port, () => {
    console.log(\`Server is running! เครื่องแม่ข่ายเปิดทำงานแล้วที่ช่องทาง: \${port}\`);
});
