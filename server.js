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

<title>Node.js Server</title>

<style>

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;
}

body{
    display:flex;
    justify-content:center;
    align-items:center;
    min-height:100vh;
    background:
    radial-gradient(circle at top left,#2563eb,#111827 40%,#020617);
    overflow:hidden;
}

/* วงกลมพื้นหลัง */

body::before,
body::after{
    content:"";
    position:absolute;
    border-radius:50%;
    filter:blur(100px);
    z-index:-1;
}

body::before{
    width:300px;
    height:300px;
    background:#3b82f6;
    top:-80px;
    left:-80px;
}

body::after{
    width:350px;
    height:350px;
    background:#06b6d4;
    bottom:-120px;
    right:-120px;
}

.card{

    width:90%;
    max-width:760px;

    background:rgba(255,255,255,.08);
    backdrop-filter:blur(18px);

    border:1px solid rgba(255,255,255,.15);

    border-radius:25px;

    padding:50px;

    color:white;

    text-align:center;

    box-shadow:
    0 15px 40px rgba(0,0,0,.45);

    animation:fade 1s ease;

}

@keyframes fade{

from{
opacity:0;
transform:translateY(30px);
}

to{
opacity:1;
transform:translateY(0);
}

}

.logo{

font-size:70px;
margin-bottom:15px;

}

h1{

font-size:42px;

margin-bottom:10px;

background:linear-gradient(90deg,#38bdf8,#60a5fa,#818cf8);

-webkit-background-clip:text;
-webkit-text-fill-color:transparent;

}

.subtitle{

font-size:20px;

color:#cbd5e1;

margin-bottom:35px;

}

.info{

display:grid;

grid-template-columns:1fr 1fr;

gap:20px;

margin-top:20px;

}

.box{

background:rgba(255,255,255,.07);

padding:22px;

border-radius:15px;

transition:.3s;

border:1px solid rgba(255,255,255,.08);

}

.box:hover{

transform:translateY(-8px);

background:rgba(255,255,255,.12);

}

.box h3{

font-size:15px;

color:#94a3b8;

margin-bottom:8px;

}

.box p{

font-size:20px;

font-weight:bold;

}

.status{

margin:35px auto;

display:inline-flex;

align-items:center;

gap:10px;

padding:14px 30px;

background:#16a34a;

border-radius:50px;

font-weight:bold;

font-size:18px;

box-shadow:0 0 20px rgba(34,197,94,.5);

}

.dot{

width:12px;

height:12px;

background:#fff;

border-radius:50%;

animation:pulse 1.2s infinite;

}

@keyframes pulse{

0%{transform:scale(1);}
50%{transform:scale(1.6);}
100%{transform:scale(1);}

}

.tech{

margin-top:35px;

display:flex;

justify-content:center;

flex-wrap:wrap;

gap:15px;

}

.tag{

padding:10px 18px;

border-radius:30px;

background:rgba(255,255,255,.08);

border:1px solid rgba(255,255,255,.12);

font-size:15px;

}

footer{

margin-top:40px;

color:#94a3b8;

font-size:14px;

}

@media(max-width:650px){

.info{

grid-template-columns:1fr;

}

.card{

padding:35px 25px;

}

h1{

font-size:33px;

}

}

</style>

</head>

<body>

<div class="card">

<div class="logo">🚀</div>

<h1>Node.js Web Server</h1>

<p class="subtitle">
Professional Web Application
</p>

<div class="info">

<div class="box">

<h3>ชื่อ - นามสกุล</h3>

<p>นายชญานนท์ เนาว์พรม</p>

</div>

<div class="box">

<h3>รหัสนักศึกษา</h3>

<p>69319010224</p>

</div>

</div>

<div class="status">

<div class="dot"></div>

Server Running Successfully

</div>

<div class="tech">

<div class="tag">⚡ Node.js</div>

<div class="tag">🚂 Railway</div>

<div class="tag">🌐 HTTP Server</div>

<div class="tag">💻 Responsive Design</div>

</div>

<footer>

Made with ❤️ using Node.js<br>
Information Technology

</footer>

</div>

</body>
</html>
`);
});

server.listen(port, () => {
    console.log("🚀 Server is running on port " + port);
});
