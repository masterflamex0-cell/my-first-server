const http = require('http');

const PORT = process.env.PORT || 3000;

// โค้ดหน้าเว็บ HTML + CSS + JS (Canvas) สำหรับส่งให้ Browser
const htmlContent = `
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Node.js Server</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background-color: #0f172a;
            color: #ffffff;
            font-family: system-ui, -apple-system, sans-serif;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
        }
        .card {
            position: relative;
            z-index: 2;
            text-align: center;
            background: rgba(30, 41, 59, 0.85);
            padding: 2.5rem 3rem;
            border-radius: 16px;
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
        }
        h1 { margin-bottom: 0.75rem; font-size: 1.8rem; color: #38bdf8; }
        p { color: #94a3b8; font-size: 1rem; }
    </style>
</head>
<body>
    <canvas id="starCanvas"></canvas>
    
    <div class="card">
        <h1>Server Running Successfully! 🎉</h1>
        <p>เซิร์ฟเวอร์ทำงานถูกต้องและพร้อมใช้งานแล้วครับ</p>
    </div>

    <script>
        const canvas = document.getElementById('starCanvas');
        const ctx = canvas.getContext('2d');

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const stars = Array.from({ length: 150 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5 + 0.5,
            alpha: Math.random(),
            speed: Math.random() * 0.01 + 0.005
        }));

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            stars.forEach(star => {
                star.alpha += star.speed;
                if (star.alpha > 1 || star.alpha < 0) {
                    star.speed = -star.speed;
                }

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = \`rgba(226, 232, 240, \${Math.abs(star.alpha)})\`;
                ctx.fill();
            });

            requestAnimationFrame(animate);
        }

        animate();
    </script>
</body>
</html>
`;

// สร้าง HTTP Server
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(htmlContent);
});

// เริ่มทำงาน
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
