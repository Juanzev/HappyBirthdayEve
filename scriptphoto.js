// Efeitos interativos para a galeria oceânica

document.addEventListener('DOMContentLoaded', function() {
    // Adicionar efeito de clique nas fotos
    const photoCards = document.querySelectorAll('.photo-card');
    
    photoCards.forEach(card => {
        card.addEventListener('click', function() {
            // Efeito de ondulação ao clicar
            createRippleEffect(this, event);
            
            // Adicionar classe de destaque temporário
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 600);
        });
        
        // Efeito de hover com partículas
        card.addEventListener('mouseenter', function() {
            createBubbleEffect(this);
        });
    });
    
    // Função para criar efeito de ondulação
    function createRippleEffect(element, event) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 10;
        `;
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Função para criar efeito de bolhas no hover
    function createBubbleEffect(element) {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const bubble = document.createElement('div');
                const rect = element.getBoundingClientRect();
                const x = Math.random() * rect.width;
                const y = rect.height;
                
                bubble.style.cssText = `
                    position: absolute;
                    width: ${Math.random() * 10 + 5}px;
                    height: ${Math.random() * 10 + 5}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.4);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 5;
                    animation: bubbleUp 2s ease-out forwards;
                `;
                
                element.appendChild(bubble);
                
                setTimeout(() => {
                    bubble.remove();
                }, 2000);
            }, i * 200);
        }
    }
    
    // Adicionar animação de entrada para os cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInFromOcean 0.8s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    photoCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        observer.observe(card);
    });
    
    // Efeito de paralaxe suave para elementos decorativos
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.fish, .bubble');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform += ` translateY(${scrolled * speed}px)`;
        });
    });
    
    // Adicionar efeito de cursor personalizado
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(255,255,255,0.8), rgba(56,189,248,0.4));
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        display: none;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        cursor.style.display = 'block';
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.display = 'none';
    });
    
    // Efeito especial para o título
    const title = document.querySelector('.title-main');
    if (title) {
        title.addEventListener('mouseenter', () => {
            title.style.animation = 'shimmer 1s ease-in-out';
        });
    }
});

// Adicionar estilos CSS via JavaScript para animações dinâmicas
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes bubbleUp {
        0% {
            transform: translateY(0) scale(1);
            opacity: 0.7;
        }
        100% {
            transform: translateY(-100px) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes slideInFromOcean {
        0% {
            opacity: 0;
            transform: translateY(50px) rotateX(10deg);
        }
        100% {
            opacity: 1;
            transform: translateY(0) rotateX(0deg);
        }
    }
    
    .photo-card.clicked {
        transform: scale(0.95) !important;
        filter: brightness(1.2);
    }
    
    .photo-card:hover .coral-decoration,
    .photo-card:hover .seaweed-decoration {
        animation-duration: 2s;
    }
    
    .photo-card:hover .shell-decoration,
    .photo-card:hover .starfish-decoration,
    .photo-card:hover .pearl-decoration,
    .photo-card:hover .seahorse-decoration {
        animation-duration: 1s;
        transform: scale(1.2) rotate(10deg);
    }
`;
document.head.appendChild(style);

