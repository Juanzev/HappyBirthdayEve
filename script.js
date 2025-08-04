// Variáveis globais
let whale = null;
let textBox = null;
let overlay = null;
let closeButton = null;
let saveButton = null;
let whaleMessage = null;
let isWhaleClicked = false;
let animationId = null;

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing whale...');
    initializeElements();
    setupEventListeners();
    startWhaleAnimation();
});

// Inicializar elementos do DOM
function initializeElements() {
    whale = document.getElementById('whale');
    textBox = document.getElementById('text-box');
    overlay = document.getElementById('overlay');
    closeButton = document.getElementById('close-text-box');
    saveButton = document.getElementById('save-message');
    whaleMessage = document.getElementById('whale-message');
    
    console.log('Elements found:', {
        whale: !!whale,
        textBox: !!textBox,
        overlay: !!overlay,
        closeButton: !!closeButton,
        saveButton: !!saveButton,
        whaleMessage: !!whaleMessage
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Clique na baleia
    if (whale) {
        whale.addEventListener('click', handleWhaleClick);
        console.log('Whale click listener added');
    }
    
    // Fechar caixa de texto
    if (closeButton) {
        closeButton.addEventListener('click', closeTextBox);
        console.log('Close button listener added');
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeTextBox);
        console.log('Overlay click listener added');
    }
    
    // Salvar mensagem
    if (saveButton) {
        saveButton.addEventListener('click', saveMessage);
        console.log('Save button listener added');
    }
    
    // Navegação suave
    setupSmoothScrolling();
    
    // Redimensionamento da janela
    window.addEventListener('resize', handleResize);
}

// Configurar navegação suave
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Iniciar animação de movimento da baleia
function startWhaleAnimation() {
    if (!isWhaleClicked) {
        whale.classList.add('swimming');
        
        // Posição inicial aleatória
        const startY = Math.random() * (window.innerHeight - 200) + 30;
        whale.style.top = startY + 'px';
        whale.style.left = '-400px';
    }
}

// Lidar com clique na baleia
function handleWhaleClick() {
    console.log('Whale clicked! Current state:', isWhaleClicked);
    
    if (isWhaleClicked) {
        // Se já está clicada, volta ao movimento normal
        console.log('Returning whale to swimming');
        returnWhaleToSwimming();
    } else {
        // Primeira vez clicando - vai para o canto esquerdo
        console.log('Moving whale to corner');
        moveWhaleToCorner();
    }
}

// Mover baleia para o canto esquerdo
function moveWhaleToCorner() {
    isWhaleClicked = true;
    
    // Parar animação de natação
    whale.classList.remove('swimming');
    whale.classList.add('clicked');
    
    // Mostrar caixa de texto
    showTextBox();
}

// Mostrar caixa de texto
function showTextBox() {
    textBox.classList.remove('hidden');
    overlay.classList.remove('hidden');
    
    // Focar no textarea
    setTimeout(() => {
        whaleMessage.focus();
    }, 300);
}

// Fechar caixa de texto
function closeTextBox() {
    textBox.classList.add('hidden');
    overlay.classList.add('hidden');
    
    // Limpar textarea
    whaleMessage.value = '';
}

// Salvar mensagem
function saveMessage() {
    const message = whaleMessage.value.trim();
    
    if (message) {
        // Aqui você pode implementar a lógica para salvar a mensagem
        // Por exemplo, enviar para um servidor ou salvar no localStorage
        localStorage.setItem('whaleMessage', message);
        
        // Mostrar feedback visual
        saveButton.textContent = 'Salvo!';
        saveButton.style.background = '#28a745';
        
        setTimeout(() => {
            saveButton.textContent = 'Salvar';
            saveButton.style.background = '#667eea';
            closeTextBox();
        }, 1500);
    } else {
        // Shake animation se não há mensagem
        whaleMessage.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            whaleMessage.style.animation = '';
        }, 500);
    }
}

// Retornar baleia ao movimento de natação
function returnWhaleToSwimming() {
    isWhaleClicked = false;
    
    // Fechar caixa de texto se estiver aberta
    closeTextBox();
    
    // Remover classe clicked
    whale.classList.remove('clicked');
    
    // Pequeno delay antes de reiniciar a natação
    setTimeout(() => {
        // Reposicionar para fora da tela
        whale.style.left = '-400px';
        whale.style.top = (Math.random() * (window.innerHeight - 200) + 100) + 'px';
        
        // Reiniciar animação de natação
        setTimeout(() => {
            whale.classList.add('swimming');
        }, 100);
    }, 500);
}

// Lidar com redimensionamento da janela
function handleResize() {
    if (!isWhaleClicked) {
        // Reajustar posição da baleia se necessário
        const currentTop = parseInt(whale.style.top) || 0;
        const maxTop = window.innerHeight - 200;
        
        if (currentTop > maxTop) {
            whale.style.top = maxTop + 'px';
        }
    }
}

// Adicionar animação de shake para feedback
const shakeKeyframes = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;

// Inserir keyframes no documento
const styleSheet = document.createElement('style');
styleSheet.textContent = shakeKeyframes;
document.head.appendChild(styleSheet);

// Função para detectar dispositivos móveis
function isMobileDevice() {
    return window.innerWidth <= 768;
}

// Ajustar comportamento para dispositivos móveis
function adjustForMobile() {
    if (isMobileDevice()) {
        // Ajustar tamanho da baleia para mobile
        whale.style.width = '250px';
        whale.style.height = '125px';
        
        // Ajustar posição da caixa de texto
        textBox.style.left = '20px';
        textBox.style.right = '20px';
        textBox.style.width = 'auto';
    }
}

// Executar ajustes para mobile na inicialização e redimensionamento
window.addEventListener('load', adjustForMobile);
window.addEventListener('resize', adjustForMobile);

// Função para pausar/retomar animação quando a aba não está ativa
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pausar animações quando a aba não está ativa
        whale.style.animationPlayState = 'paused';
    } else {
        // Retomar animações quando a aba volta a ficar ativa
        whale.style.animationPlayState = 'running';
    }
});

// Adicionar efeitos de hover suaves
whale.addEventListener('mouseenter', function() {
    if (!isWhaleClicked) {
        this.style.transform = 'scale(1.1)';
        this.style.filter = 'drop-shadow(0 8px 25px rgba(0, 0, 0, 0.4))';
    }
});

whale.addEventListener('mouseleave', function() {
    if (!isWhaleClicked) {
        this.style.transform = 'scale(1)';
        this.style.filter = 'drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3))';
    }
});

// Função para criar efeito de bolhas (opcional)
function createBubbles() {
    const bubblesContainer = document.createElement('div');
    bubblesContainer.id = 'bubbles-container';
    bubblesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;
    document.body.appendChild(bubblesContainer);
    
    setInterval(() => {
        if (Math.random() < 0.3) { // 30% de chance de criar uma bolha
            createBubble(bubblesContainer);
        }
    }, 2000);
}

function createBubble(container) {
    const bubble = document.createElement('div');
    const size = Math.random() * 20 + 10;
    const left = Math.random() * window.innerWidth;
    
    bubble.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        bottom: -50px;
        left: ${left}px;
        animation: bubbleFloat ${5 + Math.random() * 5}s linear forwards;
    `;
    
    container.appendChild(bubble);
    
    // Remover bolha após a animação
    setTimeout(() => {
        if (bubble.parentNode) {
            bubble.parentNode.removeChild(bubble);
        }
    }, 10000);
}

// Adicionar keyframes para as bolhas
const bubbleKeyframes = `
    @keyframes bubbleFloat {
        0% {
            transform: translateY(0) translateX(0);
            opacity: 0.7;
        }
        50% {
            transform: translateY(-50vh) translateX(${Math.random() * 100 - 50}px);
            opacity: 0.5;
        }
        100% {
            transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px);
            opacity: 0;
        }
    }
`;

styleSheet.textContent += bubbleKeyframes;

// Inicializar efeito de bolhas (opcional - descomente para ativar)
// createBubbles();

// Adicionar suporte para teclado (acessibilidade)
whale.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleWhaleClick();
    }
});

// Tornar a baleia focável para acessibilidade
whale.setAttribute('tabindex', '0');
whale.setAttribute('role', 'button');

whale.setAttribute("aria-label", "Baleia interativa - clique para abrir caixa de mensagem");

