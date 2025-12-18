const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;

const archer = {
    x: 50,
    y: canvas.height / 2,
    width: 50,
    height: 100,
    angle: 0
};

let arrows = [];
let birds = [];

function drawArcher() {
    ctx.save();
    ctx.translate(archer.x, archer.y);
    ctx.rotate(archer.angle);
    ctx.fillStyle = 'brown';
    ctx.fillRect(-archer.width / 2, -archer.height / 2, archer.width, archer.height);
    ctx.restore();
}

function drawArrows() {
    ctx.fillStyle = 'black';
    for (const arrow of arrows) {
        ctx.fillRect(arrow.x, arrow.y, 20, 5);
    }
}

function drawBirds() {
    ctx.fillStyle = 'blue';
    for (const bird of birds) {
        ctx.beginPath();
        ctx.arc(bird.x, bird.y, 20, 0, Math.PI * 2);
        ctx.fill();
    }
}

function spawnBird() {
    birds.push({
        x: canvas.width,
        y: Math.random() * (canvas.height - 100),
        speed: Math.random() * 2 + 1
    });
}

function update() {
    // Move arrows
    for (let i = arrows.length - 1; i >= 0; i--) {
        const arrow = arrows[i];
        arrow.x += 10 * Math.cos(arrow.angle);
        arrow.y += 10 * Math.sin(arrow.angle);
        if (arrow.x > canvas.width) {
            arrows.splice(i, 1);
        }
    }

    // Move birds
    for (const bird of birds) {
        bird.x -= bird.speed;
    }

    // Collision detection
    for (let i = arrows.length - 1; i >= 0; i--) {
        for (let j = birds.length - 1; j >= 0; j--) {
            const arrow = arrows[i];
            const bird = birds[j];
            const dx = arrow.x - bird.x;
            const dy = arrow.y - bird.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 25) {
                arrows.splice(i, 1);
                birds.splice(j, 1);
                score++;
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawArcher();
    drawArrows();
    drawBirds();
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    const dx = 800 - archer.x;
    const dy = mouseY - archer.y;
    archer.angle = Math.atan2(dy, dx);
});

canvas.addEventListener('click', e => {
    arrows.push({
        x: archer.x,
        y: archer.y,
        angle: archer.angle
    });
});

setInterval(spawnBird, 2000);
gameLoop();