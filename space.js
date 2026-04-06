// ===========================
// Space Background Animation
// ===========================
(function () {
    const canvas = document.getElementById("spaceCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // --- Static twinkling stars ---
    const STAR_COUNT = 200;
    const stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.8 + 0.3,
            baseAlpha: Math.random() * 0.5 + 0.3,
            twinkleSpeed: Math.random() * 0.02 + 0.005,
            twinkleOffset: Math.random() * Math.PI * 2,
        });
    }

    function drawStars(time) {
        for (const s of stars) {
            const alpha = s.baseAlpha + Math.sin(time * s.twinkleSpeed + s.twinkleOffset) * 0.3;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.05, Math.min(1, alpha))})`;
            ctx.fill();
        }
    }

    // Reposition stars on resize
    window.addEventListener("resize", () => {
        for (const s of stars) {
            s.x = Math.random() * canvas.width;
            s.y = Math.random() * canvas.height;
        }
    });

    // --- Shooting stars ---
    const shootingStars = [];

    function spawnShootingStar() {
        // Random direction: 0=top-left→bottom-right, 1=top-right→bottom-left, 2=left→right, 3=right→left
        const dir = Math.floor(Math.random() * 4);
        let x, y, vx, vy;
        const speed = Math.random() * 4 + 3;

        switch (dir) {
            case 0: // top-left to bottom-right
                x = Math.random() * canvas.width * 0.6;
                y = -10;
                vx = speed * (0.7 + Math.random() * 0.6);
                vy = speed * (0.5 + Math.random() * 0.5);
                break;
            case 1: // top-right to bottom-left
                x = canvas.width * 0.4 + Math.random() * canvas.width * 0.6;
                y = -10;
                vx = -speed * (0.7 + Math.random() * 0.6);
                vy = speed * (0.5 + Math.random() * 0.5);
                break;
            case 2: // left to right
                x = -10;
                y = Math.random() * canvas.height * 0.5;
                vx = speed * (0.8 + Math.random() * 0.5);
                vy = speed * (0.1 + Math.random() * 0.3);
                break;
            case 3: // right to left
                x = canvas.width + 10;
                y = Math.random() * canvas.height * 0.5;
                vx = -speed * (0.8 + Math.random() * 0.5);
                vy = speed * (0.1 + Math.random() * 0.3);
                break;
        }

        shootingStars.push({
            x, y, vx, vy,
            length: Math.random() * 40 + 30,
            alpha: 1,
            decay: Math.random() * 0.006 + 0.004,
            width: Math.random() * 1.5 + 0.5,
        });
    }

    function updateShootingStars() {
        for (let i = shootingStars.length - 1; i >= 0; i--) {
            const ss = shootingStars[i];
            ss.x += ss.vx;
            ss.y += ss.vy;
            ss.alpha -= ss.decay;
            if (ss.alpha <= 0 || ss.x < -100 || ss.x > canvas.width + 100 || ss.y > canvas.height + 100) {
                shootingStars.splice(i, 1);
            }
        }
    }

    function drawShootingStars() {
        for (const ss of shootingStars) {
            const angle = Math.atan2(ss.vy, ss.vx);
            const tailX = ss.x - Math.cos(angle) * ss.length;
            const tailY = ss.y - Math.sin(angle) * ss.length;

            const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
            grad.addColorStop(0, `rgba(255, 255, 255, 0)`);
            grad.addColorStop(1, `rgba(255, 255, 255, ${ss.alpha})`);

            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(ss.x, ss.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = ss.width;
            ctx.lineCap = "round";
            ctx.stroke();

            // Bright head glow
            ctx.beginPath();
            ctx.arc(ss.x, ss.y, ss.width + 1, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 220, 255, ${ss.alpha * 0.6})`;
            ctx.fill();
        }
    }

    // Spawn shooting stars at random intervals
    let nextShoot = 0;
    function maybeSpawnShooting(time) {
        if (time > nextShoot) {
            spawnShootingStar();
            nextShoot = time + 800 + Math.random() * 2500;
        }
    }

    // --- Floating rocket cats ---
    const catImages = [];
    const catSrcs = ["cat-blue.png", "cat-orange.png", "cat-green.png", "cat-purple.png"];
    let catsLoaded = 0;

    for (const src of catSrcs) {
        const img = new Image();
        img.src = src;
        img.onload = () => catsLoaded++;
        catImages.push(img);
    }

    const floatingCats = [];

    function spawnCat() {
        const imgIdx = Math.floor(Math.random() * catImages.length);
        // Depth: 0 = far away, 1 = close
        const depth = Math.random();
        const size = depth * 120 + 80; // 80-200px (far=smaller, close=huge)
        const alpha = 1.0; // fully visible
        const speed = depth * 0.4 + 0.1; // far=slow, close=fast

        // Random edge: 0=left, 1=right, 2=top, 3=bottom
        const edge = Math.floor(Math.random() * 4);
        let x, y, vx, vy;

        switch (edge) {
            case 0: // from left
                x = -size;
                y = Math.random() * canvas.height;
                vx = speed;
                vy = (Math.random() - 0.5) * speed * 0.8;
                break;
            case 1: // from right
                x = canvas.width + size;
                y = Math.random() * canvas.height;
                vx = -speed;
                vy = (Math.random() - 0.5) * speed * 0.8;
                break;
            case 2: // from top
                x = Math.random() * canvas.width;
                y = -size;
                vx = (Math.random() - 0.5) * speed * 0.8;
                vy = speed;
                break;
            case 3: // from bottom
                x = Math.random() * canvas.width;
                y = canvas.height + size;
                vx = (Math.random() - 0.5) * speed * 0.8;
                vy = -speed;
                break;
        }

        floatingCats.push({
            x, y, vx, vy,
            size,
            imgIdx,
            alpha,
            wobbleAmp: Math.random() * 15 + 5,
            wobbleSpeed: Math.random() * 0.002 + 0.001,
            wobbleOffset: Math.random() * Math.PI * 2,
            rotation: Math.atan2(vy, vx),
        });
    }

    // Start with a few cats
    for (let i = 0; i < 6; i++) {
        spawnCat();
        // Scatter initial cats across the screen
        const last = floatingCats[floatingCats.length - 1];
        last.x = Math.random() * canvas.width;
        last.y = Math.random() * canvas.height;
    }

    let nextCatSpawn = 0;

    function updateCats(time) {
        // Spawn new cats periodically
        if (time > nextCatSpawn && floatingCats.length < 10) {
            spawnCat();
            nextCatSpawn = time + 4000 + Math.random() * 6000;
        }

        for (let i = floatingCats.length - 1; i >= 0; i--) {
            const c = floatingCats[i];
            const wobble = Math.sin(time * c.wobbleSpeed + c.wobbleOffset) * c.wobbleAmp * 0.02;
            c.x += c.vx + wobble * -c.vy;
            c.y += c.vy + wobble * c.vx;

            // Remove if far off screen
            const margin = c.size + 50;
            if (c.x < -margin || c.x > canvas.width + margin ||
                c.y < -margin || c.y > canvas.height + margin) {
                floatingCats.splice(i, 1);
            }
        }
    }

    function drawCats() {
        if (catsLoaded < catImages.length) return;
        for (const c of floatingCats) {
            ctx.save();
            ctx.globalAlpha = c.alpha;
            ctx.translate(c.x, c.y);
            ctx.rotate(c.rotation);
            ctx.drawImage(catImages[c.imgIdx], -c.size / 2, -c.size / 2, c.size, c.size);
            ctx.restore();
        }
    }

    // --- Animation loop ---
    function animate(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawStars(time);
        maybeSpawnShooting(time);
        updateShootingStars();
        drawShootingStars();
        updateCats(time);
        drawCats();

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
})();
