const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");// Canvas ve context nesneleri
// Karakter ve engel görselleri yükleme
const playerImage = new Image();
playerImage.src = "girl.png";
const obstacleImage = new Image();
obstacleImage.src = 'kurt.png';
// Arka plan görselini yükleme
const backgroundImage = new Image();
backgroundImage.src = "yol.jpg";
// Karakter ve engel boyutları, fiziksel sabitler
const playerWidth = 110;
const playerHeight = 120;
const obstacleWidth = 100;
const obstacleHeight = 70;
const gravity = 2;
const jumpStrength = 15;
const obstacleSpeed = 5;
const obstacleSpawnRate = 120; 
const bulletSpeed = 10;
// Oyun içi değişkenlerin tanımlanması
let playerX = 50;
let playerY = canvas.height - playerHeight - 20;
let playerJumping = false;
let playerJumpHeight = 0;
let obstacles = [];
let bullets = [];
let score = 0;
let gameover = false;
let gameStarted = false;
let frameCount = 0;
// Başlangıç ekranını çizen fonksiyon
function startScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    let text = "Başlamak için tıklayın. Jump:Space / Fireball:Enter / Restart:r";
    let textWidth = ctx.measureText(text).width;
    ctx.fillText(text, (canvas.width - textWidth) / 2, canvas.height / 2);
}
// Arka planı çizen fonksiyon
function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}
// Oyuncuyu çizen fonksiyon
function drawPlayer() {
    ctx.drawImage(playerImage, playerX, playerY - playerJumpHeight, playerWidth, playerHeight);
}
// Engel objelerini çizen fonksiyon
function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.drawImage(obstacleImage, obstacle.x, canvas.height - obstacleHeight, obstacleWidth, obstacleHeight);
    });
}
// Ateş toplarını çizen fonksiyon
function drawBullets() {
    ctx.fillStyle = "red";
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, 15, 15);
    });
}
// Oyunun güncel durumunu çizen ve hesaplayan fonksiyon
function updateGame() {
    if (!gameStarted) {
        return;
    }

    if (gameover) {
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("GAME OVER!!!Skorunuz: " + score, canvas.width / 4, canvas.height / 2);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawPlayer();
    drawObstacles();
    drawBullets();
// Oyuncu zıplama durumunda yükseklik hesaplama
    if (playerJumping) {
        playerJumpHeight += jumpStrength;
        if (playerJumpHeight >= 100) {
            playerJumping = false;
        }
    } else if (playerJumpHeight > 0) {
        playerJumpHeight -= gravity;
    }
// Engel hareketi ve çarpışma kontrolleri
    obstacles.forEach((obstacle, index) => {
        obstacle.x -= obstacleSpeed;
        if (obstacle.x + obstacleWidth < 0) {
            score++;
            obstacles.splice(index, 1);
        }

        if (playerX < obstacle.x + obstacleWidth &&
            playerX + playerWidth > obstacle.x &&
            playerY - playerJumpHeight < canvas.height - obstacleHeight &&
            playerY - playerJumpHeight + playerHeight > canvas.height - obstacleHeight) {
            gameover = true;
        }
    });
// Ateş topu hareketi ve çarpışma kontrolleri
    bullets.forEach((bullet, bulletIndex) => {
        bullet.x += bulletSpeed;

        const obstacleIndex = obstacles.findIndex(obstacle => {
            return obstacle.x < bullet.x && bullet.x < obstacle.x + obstacleWidth;
        });

        if (obstacleIndex !== -1) {
            obstacles.splice(obstacleIndex, 1);
            bullets.splice(bulletIndex, 1);
        }
    });
 // Yeni engellerin oluşturulması
    if (frameCount % obstacleSpawnRate === 0) {
        obstacles.push({ x: canvas.width, y: canvas.height });
    }
    frameCount++;
  // Skor bilgisi
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 10, 20);
// Oyun döngüsünü tekrar çağır
    requestAnimationFrame(updateGame);
}
// Hangi tuş hangi işi yapar?
document.addEventListener("keydown", function (event) {
    if (event.key === " " && !playerJumping && !gameover) {
        playerJumping = true;
    }

    if (event.key === "Enter") {
        bullets.push({
            x: playerX + playerWidth,
            y: playerY - playerJumpHeight + playerHeight / 2,
        });
    }

    if (event.key === "r" || event.key === "R") {
        if (gameover) {
            restartGame();
        }
    }
});
// Fare tıklama ile oyun başlatma
canvas.addEventListener("mousedown", function () {
    if (!gameStarted) {
        gameStarted = true;
        updateGame();
    }
});
// Oyunu yeniden başlat
function restartGame() {
    obstacles = [];
    bullets = [];
    score = 0;
    playerJumpHeight = 0;
    gameover = false;
    playerJumping = false;
    frameCount = 0;
    updateGame();
}
// İlk ekranı göster
startScreen();
