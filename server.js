const http = require("http");

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {

    res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8"
    });

    res.end(`
<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>My First Server</title>

<style>
*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:Arial,Helvetica,sans-serif;
}

body{
    display:flex;
    justify-content:center;
    align-items:center;
    min-height:100vh;
    background:linear-gradient(135deg,#0f172a,#111827,#1e3a8a);
    color:white;
}

.container{
    width:90%;
    max-width:700px;
    background:rgba(255,255,255,.08);
    backdrop-filter:blur(10px);
    border-radius:20px;
    padding:40px;
    text-align:center;
    border:1px solid rgba(255,255,255,.15);
    box-shadow:0 10px 30px rgba(0,0,0,.4);
}

h1{
    font-size:38px;
    color:#38bdf8;
    margin-bottom:20px;
}

h2{
    margin-bottom:10px;
}

p{
    font-size:18px;
    margin:10px 0;
}

.badge{
    display:inline-block;
    margin-top:25px;
    padding:12px 25px;
    background:#22c55e;
    border-radius:50px;
    font-weight:bold;
}

.footer{
    margin-top:30px;
    color:#cbd5e1;
    font-size:15px;
}
</style>

</head>

<body>

<div class="container">

<h1>🚀 Node.js Web Server</h1>

<h2>ยินดีต้อนรับ</h2>

<p><strong>นายชญานนท์ เนาว์พรม</strong></p>

<p>รหัสนักศึกษา : <strong>69319010224</strong></p>

<div class="badge">
✅ Server Running Successfully
</div>

<p style="margin-top:25px;">
เว็บไซต์นี้กำลังทำงานบน Railway
</p>

<div class="footer">
Information Technology | Node.js | Railway
</div>

</div>

</body>
</html>
`);
});

server.listen(port, () => {
    console.log("Server is running on port " + port);
});
