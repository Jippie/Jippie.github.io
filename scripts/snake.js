const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");
const controlsElement = document.getElementById("gameControls");

const highScoreKey = "snakeHighScore";
let highScore = Number(localStorage.getItem(highScoreKey)) || 0;

function updateScoreDisplay() {
    scoreElement.textContent = "Score: " + score;
    highScoreElement.textContent = "High score: " + highScore;
}
    
// Game instellingen
const gridSize = 17.5; // Grootte van elk blok
const canvasSize = 525; // Canvas breedte/hoogte
const gridCount = canvasSize / gridSize;

// Slang en voedsel
let snake = [{ x: 10, y: 10 }]; // Startpositie van de slang
let food = spawnFood();
let direction = { x: 0, y: 0 }; // Geen beweging bij start
let score = 0;
    
// Game status
let gameStarted = false; // Wacht op eerste beweging
let gameOverMessage = "";
let gameOverTimer = null;
    
var pending = false;
    
// Spawn voedsel op een willekeurige locatie
function spawnFood() {
    const availableCells = [];

    for (let row = 0; row < gridCount; row++) {
        for (let column = 0; column < gridCount; column++) {
            if (!snake.some((segment) => segment.x === column && segment.y === row)) {
                availableCells.push({ x: column, y: row });
            }
        }
    }

    if (availableCells.length === 0) {
        return null;
    }

    return availableCells[Math.floor(Math.random() * availableCells.length)];
}
    
// Teken een vakje
function drawBox(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
}
    
// Update de slang en controleer op botsingen
function updateGame() {
    if (!gameStarted) return; // Update alleen als het spel gestart is
    
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    const eatingFood = food && head.x === food.x && head.y === food.y;
    const collisionSegments = eatingFood ? snake : snake.slice(0, -1);
    
    // Controleer botsingen met randen of jezelf
    if (
        head.x < 0 || 
        head.y < 0 || 
        head.x >= gridCount || 
        head.y >= gridCount ||
        collisionSegments.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        gameOverMessage = `Game over! Your score is ${score}`;
        gameStarted = false;
        direction = { x: 0, y: 0 };
        pending = false;

        if (gameOverTimer) {
            clearTimeout(gameOverTimer);
        }

        gameOverTimer = setTimeout(() => {
            resetGame();
        }, 1500);
        return;
    }
    
    if (eatingFood) {
        score++;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem(highScoreKey, highScore);
        }
    } else {
        snake.pop(); // Verwijder de staart
    }
    
    snake.unshift(head); // Voeg nieuwe kop toe

    if (eatingFood) {
        food = spawnFood();
        if (!food) {
            gameOverMessage = "You win!";
            gameStarted = false;
            direction = { x: 0, y: 0 };
            gameOverTimer = setTimeout(resetGame, 1500);
        }
    }
}
    
// Reset het spel na Game Over
function resetGame() {
    if (gameOverTimer) {
        clearTimeout(gameOverTimer);
        gameOverTimer = null;
    }

    snake = [{ x: 10, y: 10 }];
    food = spawnFood();
    direction = { x: 0, y: 0 };
    score = 0;
    gameStarted = false; // Wacht opnieuw op eerste beweging
    gameOverMessage = "";
    pending = false;
    updateScoreDisplay();
}
    
// Teken het speelveld
function drawGame() {
    pending = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let row = 0; row < gridCount; row++) {
        for (let column = 0; column < gridCount; column++) {
            if (row % 2 === column % 2) drawBox(column, row, "#105010");
        }
    }

    // Teken voedsel
    if (food) drawBox(food.x, food.y, "red");
    
    // Teken slang
    snake.forEach(segment => drawBox(segment.x, segment.y, "green"));

    if (gameOverMessage) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#ffffff";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.fillText(gameOverMessage, canvas.width / 2, canvas.height / 2);
    }
}
    
// Besturing van de slang
const directions = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 }
};

function changeDirection(nextDirection) {
    if (pending || gameOverMessage) return;
    if (
        (nextDirection.x !== 0 && direction.x !== 0) ||
        (nextDirection.y !== 0 && direction.y !== 0)
    ) return;

    direction = nextDirection;
    pending = true;
    gameStarted = true;
}

document.addEventListener("keydown", event => {
    const nextDirection = directions[event.key];
    if (!nextDirection) return;

    event.preventDefault();
    changeDirection(nextDirection);
});

controlsElement.addEventListener("click", event => {
    const button = event.target.closest("[data-direction]");
    if (button) changeDirection(directions[button.dataset.direction]);
});
    
// Game loop
function gameLoop() {
    updateGame();
    drawGame();
    updateScoreDisplay();
    setTimeout(gameLoop, 100); // Stel snelheid in
}

updateScoreDisplay();

// Start de game loop
gameLoop();
