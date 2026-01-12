// Ink Layer with Gooey SVG Filter Effect
// Creates a liquid ink layer that parts around the cursor using metaball-style rendering

(function () {
    'use strict';

    // Create SVG filter for gooey effect
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('style', 'position: absolute; width: 0; height: 0;');
    svg.innerHTML = `
        <defs>
            <filter id="gooey-filter">
                <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
                <feColorMatrix in="blur" mode="matrix" 
                    values="1 0 0 0 0  
                            0 1 0 0 0  
                            0 0 1 0 0  
                            0 0 0 25 -10" result="gooey" />
                <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
            </filter>
        </defs>
    `;
    document.body.appendChild(svg);

    // Create canvas for ink layer
    const canvas = document.createElement('canvas');
    canvas.id = 'ink-canvas';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        filter: url(#gooey-filter);
        opacity: 0.85;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    let width, height;
    let mouseX = -1000;
    let mouseY = -1000;
    let targetX = -1000;
    let targetY = -1000;

    // Metaball configuration
    const balls = [];
    const BALL_COUNT = 60;
    const CURSOR_RADIUS = 180;
    const PUSH_STRENGTH = 120;

    // Resize handler
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        if (balls.length === 0) {
            initBalls();
        }
    }

    // Initialize metaballs
    function initBalls() {
        balls.length = 0;
        for (let i = 0; i < BALL_COUNT; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            balls.push({
                x: x,
                y: y,
                baseX: x,
                baseY: y,
                radius: 25 + Math.random() * 45,
                phase: Math.random() * Math.PI * 2,
                speedX: 0.2 + Math.random() * 0.4,
                speedY: 0.15 + Math.random() * 0.35,
                displaceX: 0,
                displaceY: 0
            });
        }
    }

    // Track mouse
    document.addEventListener('mousemove', function (e) {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    document.addEventListener('mouseleave', function () {
        targetX = -1000;
        targetY = -1000;
    });

    // Animation loop
    function animate() {
        // Smooth cursor following
        mouseX += (targetX - mouseX) * 0.1;
        mouseY += (targetY - mouseY) * 0.1;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        const time = Date.now() * 0.001;

        // Update and draw metaballs
        ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';

        for (let i = 0; i < balls.length; i++) {
            const ball = balls[i];

            // Organic floating movement
            const wobbleX = Math.sin(time * ball.speedX + ball.phase) * 20;
            const wobbleY = Math.cos(time * ball.speedY + ball.phase * 1.3) * 20;

            // Calculate distance from cursor
            const targetPosX = ball.baseX + wobbleX;
            const targetPosY = ball.baseY + wobbleY;
            const dx = targetPosX - mouseX;
            const dy = targetPosY - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Displacement from cursor
            let targetDisplaceX = 0;
            let targetDisplaceY = 0;

            if (dist < CURSOR_RADIUS && dist > 0) {
                // Smooth falloff using ease-out curve
                const normalizedDist = dist / CURSOR_RADIUS;
                const force = Math.pow(1 - normalizedDist, 2) * PUSH_STRENGTH;
                const angle = Math.atan2(dy, dx);
                targetDisplaceX = Math.cos(angle) * force;
                targetDisplaceY = Math.sin(angle) * force;
            }

            // Smooth displacement with spring physics
            ball.displaceX += (targetDisplaceX - ball.displaceX) * 0.08;
            ball.displaceY += (targetDisplaceY - ball.displaceY) * 0.08;

            // Final position
            ball.x = targetPosX + ball.displaceX;
            ball.y = targetPosY + ball.displaceY;

            // Draw metaball
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        requestAnimationFrame(animate);
    }

    // Initialize
    resize();
    window.addEventListener('resize', resize);
    animate();
})();
