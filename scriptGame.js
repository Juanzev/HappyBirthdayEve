// Configurações do jogo
const GAME_CONFIG = {
    canvas: {
        width: 800,
        height: 600
    },
    player: {
        width: 60,
        height: 40,
        speed: 4,
        startX: 100,
        startY: 300
    },
    obstacles: {
        width: 40,
        height: 40,
        speed: 2.5,
        spawnRate: 0.015
    },
    coins: {
        width: 30,
        height: 30,
        speed: 2,
        spawnRate: 0.02,
        value: 10
    },
    lives: 3
};

// Estado do jogo
let gameState = {
    screen: 'start', // 'start', 'playing', 'gameOver'
    score: 0,
    lives: GAME_CONFIG.lives,
    player: {
        x: GAME_CONFIG.player.startX,
        y: GAME_CONFIG.player.startY,
        width: GAME_CONFIG.player.width,
        height: GAME_CONFIG.player.height
    },
    obstacles: [],
    coins: [],
    keys: {},
    gameSpeed: 1,
    lastTime: 0
};

// Elementos DOM
const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const finalScoreElement = document.getElementById('finalScore');
const gameOverMessageElement = document.getElementById('gameOverMessage');

// Elementos de áudio
const coinSound = document.getElementById('coinSound');
const collisionSound = document.getElementById('collisionSound');

// Botões
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const menuButton = document.getElementById('menuButton');

// Controles móveis
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

// Imagens do jogo
const images = {
    turtle: null,
    coin: null,
    litter: null,
    background: null
};

// Carregar imagens
function loadImages() {
    return new Promise((resolve) => {
        let loadedImages = 0;
        const totalImages = 4;
        
        function imageLoaded() {
            loadedImages++;
            if (loadedImages === totalImages) {
                resolve();
            }
        }
        
        // Criar imagens simples com canvas para garantir que funcionem
        images.turtle = createTurtleImage();
        images.coin = createCoinImage();
        images.litter = createLitterImage();
        images.background = createBackgroundPattern();
        
        // Simular carregamento
        setTimeout(resolve, 100);
    });
}

// Criar imagem da tartaruga
function createTurtleImage() {
    const canvas = document.createElement('canvas');
    canvas.width = GAME_CONFIG.player.width;
    canvas.height = GAME_CONFIG.player.height;
    const ctx = canvas.getContext('2d');
    
    // Corpo da tartaruga
    ctx.fillStyle = '#228B22';
    ctx.fillRect(10, 10, 40, 25);
    
    // Cabeça
    ctx.fillStyle = '#32CD32';
    ctx.fillRect(45, 15, 15, 15);
    
    // Casco
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(15, 12, 30, 20);
    
    // Padrão do casco
    ctx.fillStyle = '#A0522D';
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 2; j++) {
            ctx.fillRect(18 + i * 8, 15 + j * 7, 6, 5);
        }
    }
    
    // Nadadeiras
    ctx.fillStyle = '#228B22';
    ctx.fillRect(5, 8, 8, 12);
    ctx.fillRect(5, 25, 8, 12);
    ctx.fillRect(47, 8, 8, 12);
    ctx.fillRect(47, 25, 8, 12);
    
    return canvas;
}

// Criar imagem da moeda
function createCoinImage() {
    const canvas = document.createElement('canvas');
    canvas.width = GAME_CONFIG.coins.width;
    canvas.height = GAME_CONFIG.coins.height;
    const ctx = canvas.getContext('2d');
    
    // Moeda dourada
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(15, 15, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // Borda da moeda
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Símbolo no centro
    ctx.fillStyle = '#FFA500';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('$', 15, 20);
    
    return canvas;
}

// Criar imagem do lixo
function createLitterImage() {
    const canvas = document.createElement('canvas');
    canvas.width = GAME_CONFIG.obstacles.width;
    canvas.height = GAME_CONFIG.obstacles.height;
    const ctx = canvas.getContext('2d');
    
    // Garrafa plástica
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(8, 5, 12, 25);
    
    // Tampa
    ctx.fillStyle = '#4169E1';
    ctx.fillRect(10, 5, 8, 5);
    
    // Rótulo
    ctx.fillStyle = '#FF6347';
    ctx.fillRect(9, 12, 10, 8);
    
    // Saco plástico
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillRect(22, 8, 15, 20);
    
    // Detalhes do saco
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.strokeRect(22, 8, 15, 20);
    
    return canvas;
}

// Criar padrão de fundo
function createBackgroundPattern() {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    
    // Gradiente oceânico
    const gradient = ctx.createLinearGradient(0, 0, 0, 100);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.5, '#4682B4');
    gradient.addColorStop(1, '#191970');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 100, 100);
    
    // Bolhas
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 10; i++) {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const radius = Math.random() * 3 + 1;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    return canvas;
}

// Inicializar o jogo
async function initGame() {
    await loadImages();
    setupEventListeners();
    resizeCanvas();
    showScreen('start');
}

// Configurar event listeners
function setupEventListeners() {
    // Botões
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', restartGame);
    menuButton.addEventListener('click', () => showScreen('start'));
    
    // Teclado
    document.addEventListener('keydown', (e) => {
        gameState.keys[e.key] = true;
        e.preventDefault();
    });
    
    document.addEventListener('keyup', (e) => {
        gameState.keys[e.key] = false;
        e.preventDefault();
    });
    
    // Controles móveis
    setupMobileControls();
    
    // Redimensionamento
    window.addEventListener('resize', resizeCanvas);
}

// Configurar controles móveis
function setupMobileControls() {
    const controls = [
        { btn: upBtn, key: 'ArrowUp' },
        { btn: downBtn, key: 'ArrowDown' },
        { btn: leftBtn, key: 'ArrowLeft' },
        { btn: rightBtn, key: 'ArrowRight' }
    ];
    
    controls.forEach(({ btn, key }) => {
        // Touch events
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            gameState.keys[key] = true;
            btn.style.transform = 'scale(1.1)';
        });
        
        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            gameState.keys[key] = false;
            btn.style.transform = 'scale(1)';
        });
        
        btn.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            gameState.keys[key] = false;
            btn.style.transform = 'scale(1)';
        });
        
        // Mouse events para desktop
        btn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            gameState.keys[key] = true;
            btn.style.transform = 'scale(1.1)';
        });
        
        btn.addEventListener('mouseup', (e) => {
            e.preventDefault();
            gameState.keys[key] = false;
            btn.style.transform = 'scale(1)';
        });
        
        btn.addEventListener('mouseleave', (e) => {
            e.preventDefault();
            gameState.keys[key] = false;
            btn.style.transform = 'scale(1)';
        });
    });
    
    // Prevenir scroll em dispositivos móveis
    document.addEventListener('touchmove', (e) => {
        if (gameState.screen === 'playing') {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Controles por toque no canvas
    canvas.addEventListener('touchstart', handleCanvasTouch);
    canvas.addEventListener('touchmove', handleCanvasTouch);
    canvas.addEventListener('touchend', handleCanvasTouchEnd);
}

// Controle por toque no canvas
function handleCanvasTouch(e) {
    e.preventDefault();
    if (gameState.screen !== 'playing') return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const touch = e.touches[0];
    const touchX = (touch.clientX - rect.left) * scaleX;
    const touchY = (touch.clientY - rect.top) * scaleY;
    
    // Mover jogador em direção ao toque
    const player = gameState.player;
    const centerX = player.x + player.width / 2;
    const centerY = player.y + player.height / 2;
    
    const deltaX = touchX - centerX;
    const deltaY = touchY - centerY;
    
    // Resetar todas as teclas
    gameState.keys = {};
    
    // Definir direção baseada na posição do toque
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 20) gameState.keys['ArrowRight'] = true;
        else if (deltaX < -20) gameState.keys['ArrowLeft'] = true;
    } else {
        if (deltaY > 20) gameState.keys['ArrowDown'] = true;
        else if (deltaY < -20) gameState.keys['ArrowUp'] = true;
    }
}

function handleCanvasTouchEnd(e) {
    e.preventDefault();
    gameState.keys = {};
}

// Redimensionar canvas
function resizeCanvas() {
    const container = document.getElementById('gameContainer');
    const rect = container.getBoundingClientRect();
    
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    
    // Manter proporção do jogo
    const scaleX = rect.width / GAME_CONFIG.canvas.width;
    const scaleY = rect.height / GAME_CONFIG.canvas.height;
    const scale = Math.min(scaleX, scaleY);
    
    canvas.width = GAME_CONFIG.canvas.width;
    canvas.height = GAME_CONFIG.canvas.height;
}

// Mostrar tela
function showScreen(screen) {
    gameState.screen = screen;
    
    startScreen.classList.toggle('hidden', screen !== 'start');
    gameScreen.classList.toggle('hidden', screen !== 'playing');
    gameOverScreen.classList.toggle('hidden', screen !== 'gameOver');
}

// Iniciar jogo
function startGame() {
    resetGameState();
    showScreen('playing');
    gameLoop();
}

// Reiniciar jogo
function restartGame() {
    resetGameState();
    showScreen('playing');
    gameLoop();
}

// Resetar estado do jogo
function resetGameState() {
    gameState.score = 0;
    gameState.lives = GAME_CONFIG.lives;
    gameState.player.x = GAME_CONFIG.player.startX;
    gameState.player.y = GAME_CONFIG.player.startY;
    gameState.obstacles = [];
    gameState.coins = [];
    gameState.gameSpeed = 1;
    updateUI();
}

// Atualizar interface
function updateUI() {
    scoreElement.textContent = gameState.score;
    
    const hearts = livesElement.querySelectorAll('.heart');
    hearts.forEach((heart, index) => {
        heart.classList.toggle('lost', index >= gameState.lives);
    });
}

// Loop principal do jogo
function gameLoop(currentTime = 0) {
    if (gameState.screen !== 'playing') return;
    
    const deltaTime = currentTime - gameState.lastTime;
    gameState.lastTime = currentTime;
    
    update(deltaTime);
    render();
    
    requestAnimationFrame(gameLoop);
}

// Atualizar lógica do jogo
function update(deltaTime) {
    updatePlayer();
    updateObstacles();
    updateCoins();
    checkCollisions();
    spawnObjects();
    
    // Aumentar velocidade gradualmente
    gameState.gameSpeed += 0.0001;
}

// Atualizar jogador
function updatePlayer() {
    const player = gameState.player;
    const speed = GAME_CONFIG.player.speed;
    
    if (gameState.keys['ArrowUp'] || gameState.keys['w']) {
        player.y = Math.max(0, player.y - speed);
    }
    if (gameState.keys['ArrowDown'] || gameState.keys['s']) {
        player.y = Math.min(GAME_CONFIG.canvas.height - player.height, player.y + speed);
    }
    if (gameState.keys['ArrowLeft'] || gameState.keys['a']) {
        player.x = Math.max(0, player.x - speed);
    }
    if (gameState.keys['ArrowRight'] || gameState.keys['d']) {
        player.x = Math.min(GAME_CONFIG.canvas.width - player.width, player.x + speed);
    }
}

// Atualizar obstáculos
function updateObstacles() {
    const speed = GAME_CONFIG.obstacles.speed * gameState.gameSpeed;
    
    gameState.obstacles.forEach(obstacle => {
        obstacle.x -= speed;
    });
    
    // Remover obstáculos que saíram da tela
    gameState.obstacles = gameState.obstacles.filter(obstacle => obstacle.x > -obstacle.width);
}

// Atualizar moedas
function updateCoins() {
    const speed = GAME_CONFIG.coins.speed * gameState.gameSpeed;
    
    gameState.coins.forEach(coin => {
        coin.x -= speed;
        coin.rotation += 0.1;
    });
    
    // Remover moedas que saíram da tela
    gameState.coins = gameState.coins.filter(coin => coin.x > -coin.width);
}

// Verificar colisões
function checkCollisions() {
    const player = gameState.player;
    
    // Colisão com obstáculos
    gameState.obstacles.forEach((obstacle, index) => {
        if (isColliding(player, obstacle)) {
            gameState.obstacles.splice(index, 1);
            gameState.lives--;
            playSound(collisionSound);
            
            if (gameState.lives <= 0) {
                gameOver();
            } else {
                updateUI();
            }
        }
    });
    
    // Colisão com moedas
    gameState.coins.forEach((coin, index) => {
        if (isColliding(player, coin)) {
            gameState.coins.splice(index, 1);
            gameState.score += GAME_CONFIG.coins.value;
            playSound(coinSound);
            updateUI();
        }
    });
}

// Verificar colisão entre dois objetos
function isColliding(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// Gerar objetos
function spawnObjects() {
    // Gerar obstáculos
    if (Math.random() < GAME_CONFIG.obstacles.spawnRate * gameState.gameSpeed) {
        gameState.obstacles.push({
            x: GAME_CONFIG.canvas.width,
            y: Math.random() * (GAME_CONFIG.canvas.height - GAME_CONFIG.obstacles.height),
            width: GAME_CONFIG.obstacles.width,
            height: GAME_CONFIG.obstacles.height
        });
    }
    
    // Gerar moedas
    if (Math.random() < GAME_CONFIG.coins.spawnRate * gameState.gameSpeed) {
        gameState.coins.push({
            x: GAME_CONFIG.canvas.width,
            y: Math.random() * (GAME_CONFIG.canvas.height - GAME_CONFIG.coins.height),
            width: GAME_CONFIG.coins.width,
            height: GAME_CONFIG.coins.height,
            rotation: 0
        });
    }
}

// Renderizar jogo
function render() {
    // Limpar canvas
    ctx.clearRect(0, 0, GAME_CONFIG.canvas.width, GAME_CONFIG.canvas.height);
    
    // Desenhar fundo
    drawBackground();
    
    // Desenhar objetos
    drawPlayer();
    drawObstacles();
    drawCoins();
}

// Desenhar fundo
function drawBackground() {
    // Gradiente oceânico
    const gradient = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.5, '#4682B4');
    gradient.addColorStop(1, '#191970');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GAME_CONFIG.canvas.width, GAME_CONFIG.canvas.height);
    
    // Bolhas animadas
    const time = Date.now() * 0.001;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    
    for (let i = 0; i < 20; i++) {
        const x = (i * 50 + Math.sin(time + i) * 20) % GAME_CONFIG.canvas.width;
        const y = (i * 30 + Math.cos(time + i * 0.5) * 15) % GAME_CONFIG.canvas.height;
        const radius = 2 + Math.sin(time + i) * 1;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Desenhar jogador
function drawPlayer() {
    const player = gameState.player;
    ctx.drawImage(images.turtle, player.x, player.y, player.width, player.height);
}

// Desenhar obstáculos
function drawObstacles() {
    gameState.obstacles.forEach(obstacle => {
        ctx.drawImage(images.litter, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// Desenhar moedas
function drawCoins() {
    gameState.coins.forEach(coin => {
        ctx.save();
        ctx.translate(coin.x + coin.width / 2, coin.y + coin.height / 2);
        ctx.rotate(coin.rotation);
        ctx.drawImage(images.coin, -coin.width / 2, -coin.height / 2, coin.width, coin.height);
        ctx.restore();
    });
}

// Tocar som
function playSound(audio) {
    try {
        audio.currentTime = 0;
        audio.play().catch(e => console.log('Erro ao tocar áudio:', e));
    } catch (e) {
        console.log('Erro ao tocar áudio:', e);
    }
}

// Game Over
function gameOver() {
    gameState.screen = 'gameOver';
    finalScoreElement.textContent = gameState.score;
    
    let message = '';
    if (gameState.score >= 300) {
        message = 'Incrível! Você é um verdadeiro herói dos oceanos! 🌊🏆';
    } else if (gameState.score >= 200) {
        message = 'Fantástico! Você salvou muita vida marinha! 🐠✨';
    } else if (gameState.score >= 100) {
        message = 'Muito bem! Você ajudou bastante a limpar o oceano! 🐢💚';
    } else if (gameState.score >= 50) {
        message = 'Bom trabalho! Continue protegendo a vida marinha! 🌊🐟';
    } else {
        message = 'Continue tentando! Cada moeda coletada faz a diferença! 💪🌊';
    }
    
    gameOverMessageElement.textContent = message;
    showScreen('gameOver');
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', initGame);

