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

<!-- Import Google Fonts: Plus Jakarta Sans & Sarabun -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Sarabun:wght@400;600;700&display=swap" rel="stylesheet">

<style>

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Plus Jakarta Sans', 'Sarabun', -apple-system, BlinkMacSystemFont, sans-serif;
}

body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #030712;
    background-image: 
        radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.18) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(14, 165, 233, 0.15) 0px, transparent 50%),
        radial-gradient(at 50% 50%, rgba(99, 102, 241, 0.1) 0px, transparent 50%);
    overflow-x: hidden;
    color: #f8fafc;
}

/* วงกลมแสง Background Glows */
body::before,
body::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    filter: blur(120px);
    z-index: -1;
    pointer-events: none;
}

body::before {
    width: 380px;
    height: 380px;
    background: linear-gradient(135deg, #2563eb, #3b82f6);
    top: -100px;
    left: -100px;
    opacity: 0.6;
}

body::after {
    width: 420px;
    height: 420px;
    background: linear-gradient(135deg, #0284c7, #06b6d4);
    bottom: -140px;
    right: -140px;
    opacity: 0.5;
}

.card {
    width: 90%;
    max-width: 720px;
    background: rgba(15, 23, 42, 0.65);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 32px;
    padding: 48px 40px;
    text-align: center;
    box-shadow: 
        0 25px 50px -12px rgba(0, 0, 0, 0.5),
        inset 0 1px 1px 0 rgba(255, 255, 255, 0.1);
    animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px) scale(0.98);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.logo-wrapper {
    width: 84px;
    height: 84px;
    margin: 0 auto 20px auto;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 42px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

h1 {
    font-size: 38px;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 8px;
    background: linear-gradient(135deg, #ffffff 0%, #38bdf8 50%, #818cf8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.subtitle {
    font-size: 16px;
    color: #94a3b8;
    margin-bottom: 32px;
    font-weight: 400;
    letter-spacing: 0.02em;
}

.info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 28px;
}

.box {
    background: rgba(255, 255, 255, 0.03);
    padding: 20px;
    border-radius: 20px;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    border: 1px solid rgba(255, 255, 255, 0.06);
    text-align: left;
}

.box:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(56, 189, 248, 0.3);
    box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.3);
}

.box h3 {
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #64748b;
    margin-bottom: 6px;
    font-weight: 600;
}

.box p {
    font-size: 18px;
    font-weight: 600;
    color: #f1f5f9;
}

.status-wrapper {
    margin: 10px 0 32px 0;
}

.status {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 22px;
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.25);
    border-radius: 100px;
    font-weight: 600;
    font-size: 14px;
    color: #4ade80;
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.15);
}

.dot {
    width: 8px;
    height: 8px;
    background: #4ade80;
    border-radius: 50%;
    position: relative;
}

.dot::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: #4ade80;
    border-radius: 50%;
    animation: ping 1.8s infinite cubic-bezier(0, 0, 0.2, 1);
}

@keyframes ping {
    75%, 100% {
        transform: scale(2.4);
        opacity: 0;
    }
}

.tech {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 32px;
}

.tag {
    padding: 8px 16px;
    border-radius: 100px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    font-size: 13px;
    font-weight: 500;
    color: #cbd5e1;
    transition: all 0.2s ease;
}

.tag:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
    border-color: rgba(255, 255, 255, 0.2);
}

footer {
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding-top: 24px;
    color: #64748b;
    font-size: 13px;
    line-height: 1.6;
}

footer span {
    color: #f43f5e;
}

@media(max-width: 640px) {
    .card {
        padding: 32px 20px;
    }

    .info {
        grid-template-columns: 1fr;
    }

    h1 {
        font-size: 30px;
    }
    
    .logo-wrapper {
        width: 70px;
        height: 70px;
        font-size: 36px;
    }
}

</style>

</head>

<body>

<div class="card">

<div class="logo-wrapper">🚀</div>

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

<div class="status-wrapper">
    <div class="status">
        <div class="dot"></div>
        Server Running Successfully
    </div>
</div>

<div class="tech">

<div class="tag">⚡ Node.js</div>

<div class="tag">🚂 Railway</div>

<div class="tag">🌐 HTTP Server</div>

<div class="tag">💻 Responsive Design</div>

</div>

<footer>

Made with <span>❤️</span> using Node.js<br>
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
