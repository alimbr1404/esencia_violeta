// ========================================
//  ESENCIA VIOLETA - JavaScript Mágico
//  Experiencia espiritual interactiva
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ========================================
    //  1. EFECTO DE HUMO FUCSIA - OPTIMIZADO
    // ========================================
    const createSmokeEffect = function() {
        const container = document.createElement('div');
        container.className = 'smoke-effect';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            overflow: hidden;
        `;
        document.body.appendChild(container);

        let particles = [];
        const maxParticles = 10; // Reducido para mejor rendimiento
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let isMouseOver = false;

        // Crear partículas de humo fucsia
        for (let i = 0; i < maxParticles; i++) {
            const particle = document.createElement('div');
            const size = 150 + Math.random() * 300;
            const hue = 280 + Math.random() * 40;
            const intensity = 0.04 + Math.random() * 0.06;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: radial-gradient(circle, hsla(${hue}, 100%, 70%, ${intensity}), hsla(${hue + 20}, 100%, 60%, ${intensity * 0.4}), transparent 70%);
                pointer-events: none;
                transform: translate(-50%, -50%);
                filter: blur(40px);
                opacity: 0;
                transition: opacity 0.2s ease;
                will-change: transform, opacity;
            `;
            container.appendChild(particle);
            
            particles.push({
                el: particle,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                speed: 0.3 + Math.random() * 0.4,
                size: size,
                phase: Math.random() * Math.PI * 2,
                hue: hue,
                opacity: 0,
                targetX: 0,
                targetY: 0
            });
        }

        // Seguir el mouse
        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            isMouseOver = true;
        });

        document.addEventListener('mouseleave', function() {
            isMouseOver = false;
        });

        // Animar partículas
        function animateParticles() {
            const time = Date.now() / 1000;

            particles.forEach((p, index) => {
                const delay = index * 0.03;
                const effectiveTime = time - delay;

                if (isMouseOver) {
                    const dx = mouseX - p.x;
                    const dy = mouseY - p.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 800) {
                        const speed = p.speed * (1 + (800 - distance) / 800);
                        const moveX = (dx / distance) * speed * 2;
                        const moveY = (dy / distance) * speed * 2;
                        p.x += moveX;
                        p.y += moveY;
                        
                        const opacity = Math.max(0, 1 - (distance / 800));
                        p.opacity = opacity * 0.5;
                        p.el.style.opacity = p.opacity;
                        
                        const scale = 1 + (1 - distance / 800) * 0.6;
                        const rotation = (1 - distance / 800) * 15;
                        p.el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`;
                    } else {
                        p.x += (p.originalX - p.x) * 0.02;
                        p.y += (p.originalY - p.y) * 0.02;
                        p.opacity = 0;
                        p.el.style.opacity = 0;
                        p.el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) scale(1) rotate(0deg)`;
                    }
                } else {
                    // Movimiento orgánico cuando no hay mouse
                    const waveX = Math.sin(effectiveTime * p.speed * 0.3 + p.phase) * 0.5;
                    const waveY = Math.cos(effectiveTime * p.speed * 0.2 + p.phase) * 0.5;
                    p.x += waveX;
                    p.y += waveY;
                    p.el.style.opacity = 0.01;
                    p.el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) scale(1) rotate(0deg)`;
                }

                // Limitar dentro de la pantalla
                p.x = Math.max(-100, Math.min(window.innerWidth + 100, p.x));
                p.y = Math.max(-100, Math.min(window.innerHeight + 100, p.y));

                // Cambiar color sutilmente más rápido
                if (isMouseOver && p.opacity > 0.05) {
                    const hueShift = Math.sin(time * 0.3 + p.phase) * 15;
                    const currentHue = p.hue + hueShift;
                    const intensity = 0.04 + Math.sin(time * 0.4 + p.phase) * 0.02 + 0.04;
                    const opacity = p.opacity * 1.5;
                    p.el.style.background = `radial-gradient(circle, hsla(${currentHue}, 100%, 75%, ${intensity * opacity}), hsla(${currentHue + 30}, 100%, 65%, ${intensity * 0.4 * opacity}), transparent 70%)`;
                }
            });

            requestAnimationFrame(animateParticles);
        }

        // Guardar posiciones originales
        particles.forEach((p, index) => {
            p.originalX = window.innerWidth * (0.1 + (index / particles.length) * 0.8);
            p.originalY = window.innerHeight * (0.1 + (index / particles.length) * 0.8);
            p.x = p.originalX;
            p.y = p.originalY;
        });

        animateParticles();
        
        // Ajustar en resize
        window.addEventListener('resize', function() {
            particles.forEach((p, index) => {
                p.originalX = window.innerWidth * (0.1 + (index / particles.length) * 0.8);
                p.originalY = window.innerHeight * (0.1 + (index / particles.length) * 0.8);
            });
        });
    };

    // Iniciar efecto de humo fucsia
    createSmokeEffect();

    // ========================================
    //  2. POLVO DE HADAS - OPTIMIZADO
    // ========================================
    const createFairyDust = function() {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9998;
            overflow: hidden;
        `;
        document.body.appendChild(container);

        const dustParticles = [];
        const numParticles = 20; // Reducido para mejor rendimiento

        const colors = [
            'rgba(255, 182, 193, 0.6)',
            'rgba(176, 224, 230, 0.6)',
            'rgba(216, 191, 216, 0.6)',
            'rgba(255, 218, 185, 0.6)',
            'rgba(255, 228, 196, 0.6)',
            'rgba(188, 224, 238, 0.6)',
            'rgba(255, 192, 203, 0.6)',
            'rgba(201, 167, 235, 0.6)'
        ];

        for (let i = 0; i < numParticles; i++) {
            const dust = document.createElement('div');
            const size = 3 + Math.random() * 6;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            dust.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: ${color};
                box-shadow: 0 0 ${size * 2}px ${color};
                pointer-events: none;
                opacity: ${0.2 + Math.random() * 0.4};
                will-change: transform, opacity;
            `;
            container.appendChild(dust);

            dustParticles.push({
                el: dust,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: size,
                color: color,
                phase: Math.random() * Math.PI * 2,
                speed: 0.2 + Math.random() * 0.3
            });
        }

        function animateDust() {
            const time = Date.now() / 1000;

            dustParticles.forEach(p => {
                p.x += p.vx + Math.sin(time * p.speed + p.phase) * 0.2;
                p.y += p.vy + Math.cos(time * p.speed * 0.7 + p.phase) * 0.2;

                const floatY = Math.sin(time * 0.5 + p.phase) * 0.15;
                p.y += floatY;

                if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
                if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;

                const maxSpeed = 1;
                const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                if (speed > maxSpeed) {
                    p.vx = (p.vx / speed) * maxSpeed;
                    p.vy = (p.vy / speed) * maxSpeed;
                }

                const pulse = 0.5 + Math.sin(time * 1.5 + p.phase) * 0.5;
                p.el.style.opacity = (0.3 + Math.random() * 0.1) * pulse;
                p.el.style.transform = `translate(${p.x}px, ${p.y}px) scale(${0.8 + pulse * 0.3})`;
                
                const hue = Math.sin(time * 0.3 + p.phase) * 20 + 300;
                const intensity = 0.3 + Math.sin(time * 0.5 + p.phase) * 0.2;
                p.el.style.background = `hsla(${hue}, 100%, 70%, ${intensity * 0.4})`;
                p.el.style.boxShadow = `0 0 ${p.size * 2.5}px hsla(${hue}, 100%, 70%, ${intensity * 0.2})`;
            });

            requestAnimationFrame(animateDust);
        }

        animateDust();

        window.addEventListener('resize', function() {
            dustParticles.forEach(p => {
                p.x = Math.min(p.x, window.innerWidth);
                p.y = Math.min(p.y, window.innerHeight);
            });
        });
    };

    createFairyDust();

    // ========================================
    //  3. ELEMENTOS ESOTÉRICOS EN NEGRO - DISTRIBUIDOS EN EL CONTENIDO
    // ========================================
    const createFloatingDecorations = function() {
        const decorElements = [
            '🐈‍⬛', '✧', '☿', '♀', '♃', '☽', '♄', '♅', '♆', '♇',
            '☯', '☥', '☸', '⚛', '🜁', '🜂', '🜃', '🜄'
        ];

        // Seleccionar elementos aleatorios
        const count = 10 + Math.floor(Math.random() * 5);
        const shuffled = decorElements.sort(() => Math.random() - 0.5);
        const selectedDecor = shuffled.slice(0, count);

        // Obtener todas las secciones principales
        const sections = document.querySelectorAll('section');
        const mainContent = document.querySelector('main') || document.body;

        selectedDecor.forEach((icon, index) => {
            const decor = document.createElement('div');
            decor.className = 'floating-decor';
            decor.textContent = icon;
            decor.style.cssText = `
                position: absolute;
                color: #000000;
                font-size: ${2.5 + Math.random() * 4}rem;
                opacity: ${0.03 + Math.random() * 0.04};
                pointer-events: none;
                z-index: 0;
                font-weight: bold;
                text-shadow: 0 0 20px rgba(0,0,0,0.05);
                animation: floatDecor ${20 + Math.random() * 20}s ease-in-out infinite;
                animation-delay: ${Math.random() * 20}s;
                user-select: none;
            `;

            // Colocar en una sección aleatoria
            let targetSection;
            if (sections.length > 0) {
                targetSection = sections[Math.floor(Math.random() * sections.length)];
            } else {
                targetSection = mainContent;
            }

            // Posición relativa dentro de la sección
            const topPos = 5 + Math.random() * 85;
            const leftPos = 5 + Math.random() * 85;
            
            decor.style.top = topPos + '%';
            decor.style.left = leftPos + '%';

            // Asegurar que el contenedor de la sección tenga position: relative
            if (targetSection) {
                const computedStyle = window.getComputedStyle(targetSection);
                if (computedStyle.position === 'static') {
                    targetSection.style.position = 'relative';
                }
                targetSection.appendChild(decor);
            }
        });
    };

    // Iniciar decoraciones esotéricas después de que el DOM esté listo
    setTimeout(createFloatingDecorations, 100);

    // ========================================
    //  4. PIEDRAS DECORATIVAS - DISTRIBUIDAS EN EL CONTENIDO
    // ========================================
    const createFloatingGems = function() {
        const gemElements = ['🔮', '🧿', '💎', '💗', '🌀', '⚪', '🟣', '🟠', '🔴', '🟢', '🔵', '🟡', '⚡', '💜', '💠', '🔶'];

        const count = 6 + Math.floor(Math.random() * 3);
        const shuffled = gemElements.sort(() => Math.random() - 0.5);
        const selectedGems = shuffled.slice(0, count);

        const sections = document.querySelectorAll('section');

        selectedGems.forEach((gem, index) => {
            const gemElement = document.createElement('div');
            gemElement.className = 'floating-gem';
            gemElement.textContent = gem;
            gemElement.style.cssText = `
                position: absolute;
                font-size: ${2 + Math.random() * 3}rem;
                opacity: ${0.04 + Math.random() * 0.04};
                pointer-events: none;
                z-index: 0;
                animation: floatGem ${25 + Math.random() * 25}s ease-in-out infinite;
                animation-delay: ${Math.random() * 25}s;
                user-select: none;
                filter: drop-shadow(0 0 30px rgba(180, 138, 217, 0.1));
            `;

            // Colocar en una sección aleatoria
            let targetSection;
            if (sections.length > 0) {
                targetSection = sections[Math.floor(Math.random() * sections.length)];
            } else {
                targetSection = document.body;
            }

            const topPos = 10 + Math.random() * 80;
            const leftPos = 10 + Math.random() * 80;
            
            gemElement.style.top = topPos + '%';
            gemElement.style.left = leftPos + '%';

            if (targetSection) {
                const computedStyle = window.getComputedStyle(targetSection);
                if (computedStyle.position === 'static') {
                    targetSection.style.position = 'relative';
                }
                targetSection.appendChild(gemElement);
            }
        });
    };

    setTimeout(createFloatingGems, 200);

    // ========================================
    //  5. PUNTITOS PASTEL EN "SOBRE MÍ"
    // ========================================
    const createPastelDots = function() {
        const aboutSection = document.querySelector('.about-brief');
        if (!aboutSection) return;

        const pastelColors = [
            'rgba(255, 182, 193, 0.2)', 'rgba(176, 224, 230, 0.18)',
            'rgba(255, 218, 185, 0.2)', 'rgba(216, 191, 216, 0.2)',
            'rgba(255, 228, 196, 0.18)', 'rgba(188, 224, 238, 0.2)',
            'rgba(255, 192, 203, 0.15)', 'rgba(169, 204, 227, 0.18)'
        ];

        const dotCount = 12 + Math.floor(Math.random() * 5);
        
        for (let i = 0; i < dotCount; i++) {
            const dot = document.createElement('div');
            const size = 6 + Math.random() * 18;
            const color = pastelColors[i % pastelColors.length];
            const top = 5 + Math.random() * 90;
            const left = 5 + Math.random() * 90;
            const duration = 6 + Math.random() * 8;
            const delay = Math.random() * 10;
            
            dot.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: ${color};
                top: ${top}%;
                left: ${left}%;
                pointer-events: none;
                z-index: 1;
                animation: floatDot ${duration}s ease-in-out ${delay}s infinite;
                will-change: transform, opacity;
            `;
            
            const dotId = 'dot-' + Date.now() + '-' + i;
            const moveX1 = 10 + Math.random() * 30;
            const moveY1 = -15 - Math.random() * 25;
            const moveX2 = -10 - Math.random() * 20;
            const moveY2 = 10 + Math.random() * 20;
            const moveX3 = 8 + Math.random() * 25;
            const moveY3 = -8 - Math.random() * 15;
            const scale1 = 1.2 + Math.random() * 1.5;
            const scale2 = 0.6 + Math.random() * 0.6;
            const scale3 = 1.0 + Math.random() * 1.2;
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes floatDot${i} {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
                    25% { transform: translate(${moveX1}px, ${moveY1}px) scale(${scale1}); opacity: 1; }
                    50% { transform: translate(${moveX2}px, ${moveY2}px) scale(${scale2}); opacity: 0.2; }
                    75% { transform: translate(${moveX3}px, ${moveY3}px) scale(${scale3}); opacity: 0.8; }
                }
            `;
            document.head.appendChild(style);
            
            dot.style.animation = `floatDot${i} ${duration}s ease-in-out ${delay}s infinite`;
            aboutSection.appendChild(dot);
        }
    };

    setTimeout(createPastelDots, 300);

    // ========================================
    //  RESTAURAR FUNCIONALIDADES EXISTENTES
    // ========================================
    
    // ========================================
    //  6. CARRITO DE COMPRAS
    // ========================================
    const cart = {
        items: [],
        total: 0,
        badge: document.querySelector('.cart-badge'),

        addItem(productName, price) {
            const existingItem = this.items.find(item => item.name === productName);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.items.push({
                    name: productName,
                    price: price,
                    quantity: 1
                });
            }

            this.updateTotal();
            this.updateBadge();
            this.showMagicalNotification(`✨ ${productName} añadido al carrito ✨🔮`);
        },

        updateTotal() {
            this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        },

        updateBadge() {
            const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
            if (this.badge) {
                this.badge.textContent = totalItems;
                this.badge.style.display = totalItems > 0 ? 'flex' : 'none';
                
                this.badge.style.transform = 'scale(1.4) rotate(10deg)';
                this.badge.style.boxShadow = '0 0 40px rgba(255, 0, 255, 0.5)';
                setTimeout(() => {
                    this.badge.style.transform = 'scale(1) rotate(0deg)';
                    this.badge.style.boxShadow = '0 0 30px rgba(255, 0, 255, 0.3)';
                }, 400);
            }
        },

        showMagicalNotification(message) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: linear-gradient(135deg, #2E1A47, #4A2060, #2E1A47);
                background-size: 200% 200%;
                color: #FFFFFF;
                padding: 1.2rem 2rem;
                border-radius: 20px;
                font-family: 'Quicksand', sans-serif;
                font-weight: 500;
                box-shadow: 0 12px 60px rgba(42, 26, 61, 0.5), 0 0 40px rgba(180, 138, 217, 0.1);
                z-index: 9999;
                transform: translateX(150px) scale(0.8);
                opacity: 0;
                transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                border: 1px solid rgba(201, 167, 235, 0.15);
                backdrop-filter: blur(15px);
                font-size: 1rem;
                animation: gradientShift 3s ease infinite;
                max-width: 400px;
            `;

            const icon = document.createElement('span');
            icon.textContent = '✨ ';
            icon.style.marginRight = '8px';
            notification.prepend(icon);

            const text = document.createElement('span');
            text.textContent = message;
            notification.appendChild(text);

            for (let i = 0; i < 8; i++) {
                const sparkle = document.createElement('span');
                sparkle.textContent = '✦';
                sparkle.style.cssText = `
                    position: absolute;
                    font-size: ${0.5 + Math.random() * 0.8}rem;
                    color: #C9A7EB;
                    opacity: ${0.3 + Math.random() * 0.5};
                    animation: sparkleFloat ${2 + Math.random() * 3}s ease-in-out infinite;
                    animation-delay: ${Math.random() * 2}s;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    pointer-events: none;
                `;
                notification.appendChild(sparkle);
            }

            document.body.appendChild(notification);

            requestAnimationFrame(() => {
                notification.style.transform = 'translateX(0) scale(1)';
                notification.style.opacity = '1';
            });

            setTimeout(() => {
                notification.style.transform = 'translateX(150px) scale(0.8)';
                notification.style.opacity = '0';
                setTimeout(() => {
                    notification.remove();
                }, 600);
            }, 4000);
        },

        viewCart() {
            if (this.items.length === 0) {
                this.showMagicalNotification('🛒 Tu carrito está vacío... ¡explora la tienda!');
                return;
            }

            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                inset: 0;
                background: rgba(28, 15, 46, 0.88);
                backdrop-filter: blur(15px);
                z-index: 9998;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.4s ease;
            `;

            const modalContent = document.createElement('div');
            modalContent.style.cssText = `
                background: linear-gradient(145deg, #FFFFFF, #F8F5FA);
                border-radius: 30px;
                padding: 2.5rem;
                max-width: 520px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 30px 100px rgba(0, 0, 0, 0.4), 0 0 60px rgba(180, 138, 217, 0.05);
                border: 1px solid rgba(214, 200, 224, 0.15);
                position: relative;
            `;

            const title = document.createElement('h2');
            title.innerHTML = '🛒 ✦ Tu Carrito Mágico ✦';
            title.style.cssText = `
                font-family: 'Playfair Display', serif;
                color: #3B1E54;
                font-size: 1.8rem;
                margin-bottom: 1.5rem;
                text-align: center;
                text-shadow: 0 0 40px rgba(180, 138, 217, 0.1);
            `;
            modalContent.appendChild(title);

            this.items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.style.cssText = `
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.8rem 0;
                    border-bottom: 1px solid rgba(214, 200, 224, 0.1);
                    transition: all 0.3s ease;
                `;

                const itemInfo = document.createElement('div');
                itemInfo.innerHTML = `
                    <strong style="color: #1C1C1E;">${item.name}</strong>
                    <span style="color: #4A4A4E; font-size: 0.9rem; display: block;">✧ x${item.quantity}</span>
                `;

                const itemPrice = document.createElement('span');
                itemPrice.textContent = `€${(item.price * item.quantity).toFixed(2)}`;
                itemPrice.style.cssText = `
                    font-weight: 600;
                    background: linear-gradient(135deg, #C9A87C, #B48AD9);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    font-size: 1.1rem;
                `;

                itemDiv.appendChild(itemInfo);
                itemDiv.appendChild(itemPrice);
                modalContent.appendChild(itemDiv);
            });

            const totalDiv = document.createElement('div');
            totalDiv.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem 0;
                margin-top: 1rem;
                border-top: 2px solid rgba(201, 167, 235, 0.15);
                font-size: 1.2rem;
            `;
            totalDiv.innerHTML = `
                <strong style="font-family: 'Playfair Display', serif; color: #3B1E54;">✦ Total ✦</strong>
                <span style="font-weight: 700; background: linear-gradient(135deg, #C9A87C, #B48AD9); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 1.5rem;">€${this.total.toFixed(2)}</span>
            `;
            modalContent.appendChild(totalDiv);

            const actionsDiv = document.createElement('div');
            actionsDiv.style.cssText = `
                display: flex;
                gap: 1rem;
                margin-top: 1.5rem;
            `;

            const closeBtn = document.createElement('button');
            closeBtn.textContent = '✧ Cerrar';
            closeBtn.style.cssText = `
                flex: 1;
                padding: 0.8rem;
                border: 2px solid #2E1A47;
                border-radius: 50px;
                background: transparent;
                color: #2E1A47;
                font-family: 'Quicksand', sans-serif;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            closeBtn.onmouseover = function() {
                this.style.background = '#2E1A47';
                this.style.color = '#FFFFFF';
            };
            closeBtn.onmouseout = function() {
                this.style.background = 'transparent';
                this.style.color = '#2E1A47';
            };
            closeBtn.onclick = () => modal.remove();

            const checkoutBtn = document.createElement('button');
            checkoutBtn.textContent = '✦ Finalizar Compra ✦';
            checkoutBtn.style.cssText = `
                flex: 1;
                padding: 0.8rem;
                border: none;
                border-radius: 50px;
                background: linear-gradient(135deg, #2E1A47, #4A2060);
                color: #FFFFFF;
                font-family: 'Quicksand', sans-serif;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 25px rgba(42, 26, 61, 0.3);
            `;
            checkoutBtn.onmouseover = function() {
                this.style.background = 'linear-gradient(135deg, #B48AD9, #C9A7EB)';
                this.style.color = '#1C1C1E';
                this.style.transform = 'scale(1.02)';
            };
            checkoutBtn.onmouseout = function() {
                this.style.background = 'linear-gradient(135deg, #2E1A47, #4A2060)';
                this.style.color = '#FFFFFF';
                this.style.transform = 'scale(1)';
            };
            checkoutBtn.onclick = () => {
                this.showMagicalNotification('✨ ¡Pedido realizado con éxito! ✨');
                this.items = [];
                this.total = 0;
                this.updateBadge();
                modal.remove();
            };

            actionsDiv.appendChild(closeBtn);
            actionsDiv.appendChild(checkoutBtn);
            modalContent.appendChild(actionsDiv);

            modal.appendChild(modalContent);
            document.body.appendChild(modal);

            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        }
    };

    // ========================================
    //  7. BOTONES "AÑADIR AL CARRITO"
    // ========================================
    const addToCartButtons = document.querySelectorAll('.product-card .btn--primary, .btn--small');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const card = this.closest('.product-card');
            if (!card) return;

            const name = card.querySelector('.product-card__name')?.textContent || 'Producto';
            const priceText = card.querySelector('.product-card__price')?.textContent || '€0,00';
            
            const price = parseFloat(priceText.replace('€', '').replace(',', '.')) || 0;

            this.style.transform = 'scale(0.85) rotate(-3deg)';
            this.style.boxShadow = '0 0 60px rgba(255, 0, 255, 0.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1) rotate(0deg)';
                this.style.boxShadow = 'none';
            }, 300);

            cart.addItem(name.trim(), price);
        });
    });

    // ========================================
    //  8. BOTÓN DEL CARRITO
    // ========================================
    const cartButton = document.querySelector('.header__actions .action-btn:last-child');
    if (cartButton) {
        cartButton.addEventListener('click', function(e) {
            e.preventDefault();
            this.style.transform = 'scale(1.2) rotate(15deg)';
            this.style.boxShadow = '0 0 60px rgba(255, 0, 255, 0.3)';
            setTimeout(() => {
                this.style.transform = 'scale(1) rotate(0deg)';
                this.style.boxShadow = 'none';
            }, 300);
            cart.viewCart();
        });
    }

    // ========================================
    //  9. BÚSQUEDA
    // ========================================
    const searchButton = document.querySelector('.header__actions .action-btn:first-child');
    
    if (searchButton) {
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                inset: 0;
                background: rgba(28, 15, 46, 0.92);
                backdrop-filter: blur(15px);
                z-index: 9998;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            `;

            const searchBox = document.createElement('div');
            searchBox.style.cssText = `
                background: linear-gradient(145deg, #FFFFFF, #F8F5FA);
                padding: 2.5rem;
                border-radius: 30px;
                max-width: 500px;
                width: 90%;
                text-align: center;
                box-shadow: 0 30px 100px rgba(0, 0, 0, 0.4);
                border: 1px solid rgba(214, 200, 224, 0.15);
                position: relative;
                overflow: hidden;
            `;

            const glow = document.createElement('div');
            glow.style.cssText = `
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                background: linear-gradient(135deg, #B48AD9, #C9A7EB, #B48AD9, #C9A7EB);
                background-size: 300% 300%;
                border-radius: 32px;
                z-index: -1;
                opacity: 0.3;
                animation: gradientShift 3s ease infinite;
            `;
            searchBox.appendChild(glow);

            searchBox.innerHTML += `
                <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">🔮</div>
                <h3 style="font-family: 'Playfair Display', serif; color: #3B1E54; margin-bottom: 0.5rem; font-size: 1.8rem;">✦ Buscar en Esencia Violeta ✦</h3>
                <p style="color: #4A4A4E; margin-bottom: 1.5rem; font-size: 0.95rem;">Encuentra mazos, amuletos y tesoros mágicos</p>
                <input type="text" 
                       placeholder="¿Qué energía buscas?" 
                       style="width: 100%; padding: 0.9rem 1.2rem; border: 2px solid rgba(214, 200, 224, 0.2); border-radius: 16px; font-family: 'Quicksand', sans-serif; font-size: 1rem; margin-bottom: 1rem; transition: all 0.3s ease; background: #FFFFFF;"
                       autofocus 
                       id="searchInput" />
                <button class="btn btn--primary" style="width: 100%;" id="searchBtn">✦ Buscar ✦</button>
                <button style="width: 100%; margin-top: 0.5rem; padding: 0.8rem; border: 2px solid rgba(214, 200, 224, 0.3); border-radius: 50px; background: transparent; color: #4A4A4E; font-family: 'Quicksand', sans-serif; font-weight: 500; cursor: pointer; transition: all 0.3s ease;" id="closeSearchBtn">Cerrar</button>
            `;

            overlay.appendChild(searchBox);
            document.body.appendChild(overlay);

            const input = searchBox.querySelector('#searchInput');
            input.addEventListener('focus', function() {
                this.style.borderColor = '#B48AD9';
                this.style.boxShadow = '0 0 50px rgba(180, 138, 217, 0.1)';
            });
            input.addEventListener('blur', function() {
                this.style.borderColor = 'rgba(214, 200, 224, 0.2)';
                this.style.boxShadow = 'none';
            });

            const closeSearch = function() {
                overlay.remove();
            };

            searchBox.querySelector('#closeSearchBtn').addEventListener('click', closeSearch);
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) closeSearch();
            });

            const performSearch = function() {
                const query = input.value.trim();
                if (query) {
                    cart.showMagicalNotification(`🔍 Buscando: "${query}" ✨`);
                    setTimeout(closeSearch, 1500);
                } else {
                    cart.showMagicalNotification('Por favor, escribe algo para buscar 🔮');
                }
            };

            searchBox.querySelector('#searchBtn').addEventListener('click', performSearch);
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') performSearch();
            });
        });
    }

    // ========================================
    //  10. MENÚ DE NAVEGACIÓN
    // ========================================
    const allNavLinks = document.querySelectorAll('.nav__list a, .footer__nav a');
    
    allNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            } else if (href === '#') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    //  11. MENÚ MÓVIL
    // ========================================
    const headerNav = document.querySelector('.header__nav');
    
    if (headerNav) {
        let hamburgerBtn = document.querySelector('.hamburger-btn');
        if (!hamburgerBtn && window.innerWidth <= 992) {
            hamburgerBtn = document.createElement('button');
            hamburgerBtn.className = 'hamburger-btn';
            hamburgerBtn.setAttribute('aria-label', 'Abrir menú');
            hamburgerBtn.style.cssText = `
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(214, 200, 224, 0.08);
                border-radius: 14px;
                color: #FFFFFF;
                font-size: 1.8rem;
                cursor: pointer;
                padding: 0.5rem 1rem;
                transition: all 0.3s ease;
                font-family: 'Quicksand', sans-serif;
            `;
            hamburgerBtn.textContent = '☰';
            
            const headerLogo = document.querySelector('.header__logo');
            if (headerLogo) {
                headerLogo.after(hamburgerBtn);
            }
        }

        if (hamburgerBtn) {
            let menuOpen = false;
            
            if (window.innerWidth <= 992) {
                headerNav.style.display = 'none';
                headerNav.style.width = '100%';
                headerNav.style.order = '3';
            }

            hamburgerBtn.addEventListener('click', function() {
                menuOpen = !menuOpen;
                headerNav.style.display = menuOpen ? 'block' : 'none';
                hamburgerBtn.textContent = menuOpen ? '✕' : '☰';
                hamburgerBtn.style.background = menuOpen ? 'rgba(180, 138, 217, 0.15)' : 'rgba(255, 255, 255, 0.03)';
                hamburgerBtn.style.borderColor = menuOpen ? '#B48AD9' : 'rgba(214, 200, 224, 0.08)';
                hamburgerBtn.style.boxShadow = menuOpen ? '0 0 40px rgba(180, 138, 217, 0.1)' : 'none';
                
                if (menuOpen) {
                    headerNav.style.animation = 'slideDown 0.3s ease';
                }
            });

            headerNav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', function() {
                    if (window.innerWidth <= 992) {
                        menuOpen = false;
                        headerNav.style.display = 'none';
                        hamburgerBtn.textContent = '☰';
                        hamburgerBtn.style.background = 'rgba(255, 255, 255, 0.03)';
                        hamburgerBtn.style.borderColor = 'rgba(214, 200, 224, 0.08)';
                        hamburgerBtn.style.boxShadow = 'none';
                    }
                });
            });

            window.addEventListener('resize', function() {
                if (window.innerWidth > 992) {
                    headerNav.style.display = 'flex';
                    headerNav.style.width = 'auto';
                    headerNav.style.order = '0';
                    if (hamburgerBtn) {
                        hamburgerBtn.style.display = 'none';
                    }
                } else {
                    if (hamburgerBtn) {
                        hamburgerBtn.style.display = 'block';
                    }
                    if (!menuOpen) {
                        headerNav.style.display = 'none';
                    }
                }
            });
        }
    }

    // ========================================
    //  12. NAVEGACIÓN ACTIVA
    // ========================================
    const navLinks = document.querySelectorAll('.nav__list a');
    const currentPath = window.location.pathname;
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (href === '#' && currentPath === '/')) {
            link.classList.add('active');
        }
    });

    // ========================================
    //  13. ANIMACIONES AL SCROLL
    // ========================================
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.category-card, .product-card, .experience-card, .blog-card, .about-brief__content');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const delay = index * 50;
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) scale(1)';
                        entry.target.style.filter = 'blur(0)';
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach((el) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(40px) scale(0.95)';
            el.style.filter = 'blur(3px)';
            el.style.transition = `all 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
            observer.observe(el);
        });
    };

    if ('IntersectionObserver' in window) {
        setTimeout(animateOnScroll, 200);
    }

    // ========================================
    //  14. ESTRELLAS EN EL BANNER - RÁPIDAS
    // ========================================
    const createMagicalStars = function() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const starColors = ['#C9A87C', '#C9A7EB', '#B48AD9', '#FF00FF', '#FFFFFF', '#FF69B4', '#7B68EE'];
        
        for (let i = 0; i < 60; i++) {
            const star = document.createElement('div');
            const size = Math.random() * 5 + 1;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const duration = 1.5 + Math.random() * 2;
            const delay = Math.random() * 2;
            const color = starColors[Math.floor(Math.random() * starColors.length)];

            star.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, ${color}, transparent 70%);
                border-radius: 50%;
                top: ${y}%;
                left: ${x}%;
                opacity: ${Math.random() * 0.6 + 0.1};
                animation: twinkle ${duration}s ease-in-out ${delay}s infinite alternate;
                pointer-events: none;
                z-index: 1;
                box-shadow: 0 0 ${size * 4}px ${color}44;
                will-change: transform, opacity;
            `;

            hero.appendChild(star);
        }
    };

    createMagicalStars();

    // ========================================
    //  15. INICIALIZAR CARRITO
    // ========================================
    cart.updateBadge();

    // ========================================
    //  16. MENSAJE DE CONSOLA
    // ========================================
    console.log('%c✨✦✧ Esencia Violeta ✧✦✨', 'font-size: 24px; font-weight: bold; color: #2A1A3D; text-shadow: 0 0 40px rgba(180, 138, 217, 0.3);');
    console.log('%cMazos de tarot y artículos esotéricos con alma ✨', 'font-size: 16px; color: #5B3A7A;');
    console.log('%c🔮 Que la luna guíe tu camino 🌙', 'font-size: 14px; color: #B48AD9;');
    console.log('%c🐈‍⬛ El gato negro te observa desde las sombras...', 'font-size: 13px; color: #000000;');
    console.log('%c💎 Amatista, Ojo de Tigre y Cuarzo Rosa te acompañan ✨', 'font-size: 13px; color: #4A4A4E;');

}); // Fin DOMContentLoaded

// ========================================
//  ESTILOS DE ANIMACIÓN
// ========================================
const magicalStyles = document.createElement('style');
magicalStyles.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }

    @keyframes slideDown {
        from { opacity: 0; transform: translateY(-15px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes twinkle {
        0% { opacity: 0.1; transform: scale(0.3); }
        100% { opacity: 1; transform: scale(1.5); }
    }

    @keyframes gradientShift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
    }

    @keyframes sparkleFloat {
        0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
        50% { transform: translate(8px, -12px) scale(1.4); opacity: 1; }
    }

    @keyframes floatDecor {
        0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
        20% { transform: translate(20px, -25px) rotate(8deg) scale(1.1); }
        40% { transform: translate(-15px, 20px) rotate(-6deg) scale(0.9); }
        60% { transform: translate(12px, -18px) rotate(4deg) scale(1.05); }
        80% { transform: translate(-12px, 25px) rotate(-7deg) scale(0.95); }
    }

    @keyframes floatGem {
        0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
        15% { transform: translate(25px, -30px) rotate(10deg) scale(1.15); }
        30% { transform: translate(-20px, 25px) rotate(-8deg) scale(0.85); }
        45% { transform: translate(18px, -20px) rotate(6deg) scale(1.1); }
        60% { transform: translate(-15px, 28px) rotate(-9deg) scale(0.9); }
        75% { transform: translate(12px, -25px) rotate(7deg) scale(1.12); }
        90% { transform: translate(-12px, 18px) rotate(-5deg) scale(0.88); }
    }

    .cart-badge {
        display: none;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .hamburger-btn {
        display: none;
        transition: all 0.3s ease;
    }

    @media (max-width: 992px) {
        .hamburger-btn { display: block; }
        .header__nav { order: 3; width: 100%; }
        .header__nav .nav__list {
            flex-direction: column;
            gap: 0.8rem;
            padding: 1rem 0;
            align-items: center;
        }
        .header__nav .nav__list a {
            font-size: 1.1rem;
            padding: 0.4rem 0;
        }
    }

    @media (max-width: 600px) {
        .hamburger-btn { font-size: 1.5rem; padding: 0.4rem 0.8rem; }
    }

    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: linear-gradient(180deg, #1C0F2E, #2A1A3D); }
    ::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #B48AD9, #C9A7EB, #B48AD9);
        border-radius: 10px;
        box-shadow: 0 0 30px rgba(180, 138, 217, 0.2);
    }
    ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #C9A7EB, #FF00FF, #C9A7EB);
        box-shadow: 0 0 50px rgba(255, 0, 255, 0.2);
    }

    ::selection {
        background: rgba(255, 0, 255, 0.15);
        color: #2A1A3D;
        text-shadow: 0 0 30px rgba(180, 138, 217, 0.2);
    }
`;

document.head.appendChild(magicalStyles);