// ========================================
//  ESENCIA VIOLETA - JavaScript Mágico
//  Experiencia espiritual interactiva
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ========================================
    //  1. EFECTO DE HUMO FUCSIA AL MOVER EL CURSOR
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
        const maxParticles = 15;
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let isMouseOver = true;

        // Crear partículas de humo fucsia
        for (let i = 0; i < maxParticles; i++) {
            const particle = document.createElement('div');
            const size = 150 + Math.random() * 400;
            const hue = 280 + Math.random() * 40;
            const intensity = 0.04 + Math.random() * 0.08;
            
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
                transition: opacity 0.3s ease;
            `;
            container.appendChild(particle);
            
            particles.push({
                el: particle,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                speed: 0.3 + Math.random() * 0.6,
                size: size,
                phase: Math.random() * Math.PI * 2,
                hue: hue,
                targetX: 0,
                targetY: 0,
                opacity: 0
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
                // Cada partícula tiene un retraso para crear efecto de estela
                const delay = index * 0.05;
                const effectiveTime = time - delay;

                if (isMouseOver) {
                    // Movimiento hacia el mouse con efecto de arrastre
                    const dx = mouseX - p.x;
                    const dy = mouseY - p.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 1000) {
                        // Velocidad de seguimiento
                        const speed = p.speed * (1 + (1000 - distance) / 1000);
                        const moveX = (dx / distance) * speed * 1.5;
                        const moveY = (dy / distance) * speed * 1.5;
                        p.x += moveX;
                        p.y += moveY;
                        
                        // Opacidad según distancia
                        const opacity = Math.max(0, 1 - (distance / 1000));
                        p.opacity = opacity * 0.45;
                        p.el.style.opacity = p.opacity;
                        
                        // Escala y rotación según distancia
                        const scale = 1 + (1 - distance / 1000) * 0.8;
                        const rotation = (1 - distance / 1000) * 20;
                        p.el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`;
                    } else {
                        // Volver a posición original lentamente
                        p.x += (p.originalX - p.x) * 0.01;
                        p.y += (p.originalY - p.y) * 0.01;
                        p.opacity = 0;
                        p.el.style.opacity = 0;
                        p.el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) scale(1) rotate(0deg)`;
                    }
                } else {
                    // Movimiento orgánico cuando no hay mouse
                    const waveX = Math.sin(effectiveTime * p.speed * 0.3 + p.phase) * 0.8;
                    const waveY = Math.cos(effectiveTime * p.speed * 0.2 + p.phase) * 0.8;
                    p.x += waveX;
                    p.y += waveY;
                    p.el.style.opacity = 0.02;
                    p.el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) scale(1) rotate(0deg)`;
                }

                // Limitar dentro de la pantalla
                p.x = Math.max(-200, Math.min(window.innerWidth + 200, p.x));
                p.y = Math.max(-200, Math.min(window.innerHeight + 200, p.y));

                // Cambiar color sutilmente
                if (isMouseOver && p.opacity > 0.05) {
                    const hueShift = Math.sin(time * 0.1 + p.phase) * 15;
                    const currentHue = p.hue + hueShift;
                    const intensity = 0.04 + Math.sin(time * 0.2 + p.phase) * 0.02 + 0.04;
                    const opacity = p.opacity * 1.5;
                    p.el.style.background = `radial-gradient(circle, hsla(${currentHue}, 100%, 75%, ${intensity * opacity}), hsla(${currentHue + 30}, 100%, 65%, ${intensity * 0.4 * opacity}), transparent 70%)`;
                }
            });

            requestAnimationFrame(animateParticles);
        }

        // Guardar posiciones originales
        particles.forEach((p, index) => {
            p.originalX = p.x;
            p.originalY = p.y;
            // Distribuir partículas en diferentes posiciones iniciales
            p.x = (index / particles.length) * window.innerWidth * 0.8 + window.innerWidth * 0.1;
            p.y = (index / particles.length) * window.innerHeight * 0.8 + window.innerHeight * 0.1;
            p.originalX = p.x;
            p.originalY = p.y;
        });

        animateParticles();
        
        // Ajustar en resize
        window.addEventListener('resize', function() {
            particles.forEach(p => {
                p.x = Math.min(p.x, window.innerWidth);
                p.y = Math.min(p.y, window.innerHeight);
            });
        });
    };

    // Iniciar efecto de humo fucsia
    createSmokeEffect();

    // ========================================
    //  2. POLVO DE HADAS (FAIRY DUST)
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
        const numParticles = 30;

        // Colores mágicos
        const colors = [
            'rgba(255, 182, 193, 0.6)',  // Rosa
            'rgba(176, 224, 230, 0.6)',  // Celeste
            'rgba(216, 191, 216, 0.6)',  // Lila
            'rgba(255, 218, 185, 0.6)',  // Melocotón
            'rgba(255, 228, 196, 0.6)',  // Amarillo
            'rgba(188, 224, 238, 0.6)',  // Azul
            'rgba(255, 192, 203, 0.6)',  // Rosa claro
            'rgba(201, 167, 235, 0.6)',  // Lila claro
            'rgba(255, 215, 0, 0.5)',    // Dorado
            'rgba(255, 105, 180, 0.5)'   // Fucsia
        ];

        for (let i = 0; i < numParticles; i++) {
            const dust = document.createElement('div');
            const size = 3 + Math.random() * 8;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            dust.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: ${color};
                box-shadow: 0 0 ${size * 2}px ${color};
                pointer-events: none;
                opacity: ${0.2 + Math.random() * 0.5};
            `;
            container.appendChild(dust);

            dustParticles.push({
                el: dust,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                size: size,
                color: color,
                phase: Math.random() * Math.PI * 2,
                speed: 0.2 + Math.random() * 0.4
            });
        }

        function animateDust() {
            const time = Date.now() / 1000;

            dustParticles.forEach(p => {
                // Movimiento suave y orgánico
                p.x += p.vx + Math.sin(time * p.speed + p.phase) * 0.3;
                p.y += p.vy + Math.cos(time * p.speed * 0.7 + p.phase) * 0.3;

                // Flotación
                const floatY = Math.sin(time * 0.5 + p.phase) * 0.2;
                p.y += floatY;

                // Rebote en bordes
                if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
                if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;

                // Movimiento en espiral ocasional
                if (Math.random() < 0.001) {
                    p.vx += (Math.random() - 0.5) * 0.2;
                    p.vy += (Math.random() - 0.5) * 0.2;
                }

                // Limitar velocidad
                const maxSpeed = 1.5;
                const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                if (speed > maxSpeed) {
                    p.vx = (p.vx / speed) * maxSpeed;
                    p.vy = (p.vy / speed) * maxSpeed;
                }

                // Brillo pulsante
                const pulse = 0.5 + Math.sin(time * 1.5 + p.phase) * 0.5;
                p.el.style.opacity = (0.3 + Math.random() * 0.2) * pulse;
                p.el.style.transform = `translate(${p.x}px, ${p.y}px) scale(${0.8 + pulse * 0.4})`;
                
                // Cambiar color sutilmente
                const hue = Math.sin(time * 0.2 + p.phase) * 20 + 300;
                const intensity = 0.3 + Math.sin(time * 0.5 + p.phase) * 0.2;
                p.el.style.background = `hsla(${hue}, 100%, 70%, ${intensity * 0.5})`;
                p.el.style.boxShadow = `0 0 ${p.size * 3}px hsla(${hue}, 100%, 70%, ${intensity * 0.3})`;
            });

            requestAnimationFrame(animateDust);
        }

        animateDust();

        // Ajustar en resize
        window.addEventListener('resize', function() {
            dustParticles.forEach(p => {
                p.x = Math.min(p.x, window.innerWidth);
                p.y = Math.min(p.y, window.innerHeight);
            });
        });
    };

    // Iniciar polvo de hadas
    createFairyDust();

    // ========================================
    //  3. ELEMENTOS DECORATIVOS FLOTANTES (NEGRO)
    // ========================================
    const createFloatingDecorations = function() {
        // Elementos esotéricos en color negro
        const decorElements = [
            '🐈‍⬛',  // Gato negro
            '✧',    // Tetragramatron
            '☿',    // Símbolo zodiacal Mercurio
            '♀',    // Símbolo zodiacal Venus
            '♃',    // Símbolo zodiacal Júpiter
            '☽',    // Luna creciente
            '♄',    // Símbolo zodiacal Saturno
            '♅',    // Símbolo zodiacal Urano
            '♆',    // Símbolo zodiacal Neptuno
            '♇',    // Símbolo zodiacal Plutón
            '☯',    // Yin-Yang
            '☥',    // Ankh
            '☸',    // Rueda del Dharma
            '⚛',    // Átomo
            '🜁',    // Alquimia - Aire
            '🜂',    // Alquimia - Fuego
            '🜃',    // Alquimia - Tierra
            '🜄',    // Alquimia - Agua
        ];

        // Seleccionar elementos aleatorios (10-14 elementos)
        const count = 10 + Math.floor(Math.random() * 5);
        const shuffled = decorElements.sort(() => Math.random() - 0.5);
        const selectedDecor = shuffled.slice(0, count);

        // Posiciones estratégicas
        const positions = [
            { top: '3%', left: '2%' },
            { top: '5%', right: '2%' },
            { top: '15%', left: '1%' },
            { bottom: '20%', right: '1%' },
            { bottom: '8%', left: '4%' },
            { top: '28%', left: '2%' },
            { top: '45%', right: '1%' },
            { top: '60%', left: '3%' },
            { bottom: '12%', right: '3%' },
            { top: '38%', left: '50%' },
            { bottom: '30%', left: '1%' },
            { top: '75%', right: '2%' },
            { top: '85%', left: '2%' },
            { bottom: '45%', right: '4%' }
        ];

        selectedDecor.forEach((icon, index) => {
            const decor = document.createElement('div');
            decor.className = 'floating-decor';
            decor.textContent = icon;
            decor.style.color = '#000000';
            
            const pos = positions[index % positions.length];
            if (pos.top) decor.style.top = pos.top;
            if (pos.bottom) decor.style.bottom = pos.bottom;
            if (pos.left) decor.style.left = pos.left;
            if (pos.right) decor.style.right = pos.right;
            
            // Tamaños variados
            const size = 2.5 + Math.random() * 4.5;
            decor.style.fontSize = size + 'rem';
            decor.style.opacity = 0.03 + Math.random() * 0.05;
            decor.style.animationDelay = (Math.random() * 20) + 's';
            decor.style.animationDuration = (20 + Math.random() * 20) + 's';
            decor.style.fontWeight = 'bold';
            decor.style.textShadow = '0 0 20px rgba(0,0,0,0.05)';
            
            document.body.appendChild(decor);
        });
    };

    // Iniciar decoraciones flotantes
    createFloatingDecorations();

    // ========================================
    //  4. PIEDRAS DECORATIVAS (AMATISTA, OJO DE TIGRE, ETC)
    // ========================================
    const createFloatingGems = function() {
        // Piedras y cristales mágicos
        const gemElements = [
            '🔮',   // Amatista / Bola de cristal
            '🧿',   // Ojo de Tigre / Nazar
            '💎',   // Diamante / Cristal
            '💗',   // Cuarzo Rosa
            '🌀',   // Ágata / Espiral
            '⚪',   // Cristal de Cuarzo
            '🟣',   // Amatista
            '🟠',   // Ojo de Tigre
            '🔴',   // Rubí
            '🟢',   // Esmeralda
            '🔵',   // Zafiro
            '🟡',   // Ámbar
            '⚡',   // Cristal de energía
            '💜',   // Amatista
            '💠',   // Cristal
            '🔶',   // Ojo de Tigre
        ];

        // Seleccionar 8-10 piedras
        const count = 8 + Math.floor(Math.random() * 3);
        const shuffled = gemElements.sort(() => Math.random() - 0.5);
        const selectedGems = shuffled.slice(0, count);

        // Posiciones para piedras
        const gemPositions = [
            { top: '8%', left: '10%' },
            { top: '20%', right: '8%' },
            { bottom: '30%', left: '6%' },
            { bottom: '15%', right: '12%' },
            { top: '45%', left: '4%' },
            { top: '35%', right: '4%' },
            { bottom: '40%', left: '15%' },
            { top: '65%', right: '18%' },
            { top: '80%', left: '8%' },
            { bottom: '55%', right: '6%' }
        ];

        selectedGems.forEach((gem, index) => {
            const gemElement = document.createElement('div');
            gemElement.className = 'floating-gem';
            gemElement.textContent = gem;
            
            const pos = gemPositions[index % gemPositions.length];
            if (pos.top) gemElement.style.top = pos.top;
            if (pos.bottom) gemElement.style.bottom = pos.bottom;
            if (pos.left) gemElement.style.left = pos.left;
            if (pos.right) gemElement.style.right = pos.right;
            
            // Tamaños variados
            const size = 2 + Math.random() * 3.5;
            gemElement.style.fontSize = size + 'rem';
            gemElement.style.opacity = 0.05 + Math.random() * 0.06;
            gemElement.style.animationDelay = (Math.random() * 25) + 's';
            gemElement.style.animationDuration = (25 + Math.random() * 25) + 's';
            
            // Colores personalizados según la piedra
            const gemType = gem;
            if (gemType === '🔮' || gemType === '💜' || gemType === '🟣') {
                gemElement.style.filter = 'drop-shadow(0 0 40px rgba(180, 138, 217, 0.2))';
            } else if (gemType === '🧿' || gemType === '🟠' || gemType === '🔶') {
                gemElement.style.filter = 'drop-shadow(0 0 40px rgba(201, 168, 124, 0.2))';
            } else if (gemType === '💗') {
                gemElement.style.filter = 'drop-shadow(0 0 40px rgba(255, 182, 193, 0.2))';
            } else if (gemType === '🔴') {
                gemElement.style.filter = 'drop-shadow(0 0 40px rgba(255, 0, 0, 0.15))';
            } else if (gemType === '🟢') {
                gemElement.style.filter = 'drop-shadow(0 0 40px rgba(0, 255, 0, 0.15))';
            } else if (gemType === '🔵') {
                gemElement.style.filter = 'drop-shadow(0 0 40px rgba(0, 0, 255, 0.15))';
            } else if (gemType === '🟡') {
                gemElement.style.filter = 'drop-shadow(0 0 40px rgba(255, 215, 0, 0.15))';
            } else {
                gemElement.style.filter = 'drop-shadow(0 0 40px rgba(201, 167, 235, 0.15))';
            }
            
            document.body.appendChild(gemElement);
        });
    };

    // Iniciar piedras flotantes
    createFloatingGems();

    // ========================================
    //  5. PUNTITOS PASTEL EN "SOBRE MÍ"
    // ========================================
    const createPastelDots = function() {
        const aboutSection = document.querySelector('.about-brief');
        if (!aboutSection) return;

        // Colores pastel
        const pastelColors = [
            'rgba(255, 182, 193, 0.2)',
            'rgba(176, 224, 230, 0.18)',
            'rgba(255, 218, 185, 0.2)',
            'rgba(216, 191, 216, 0.2)',
            'rgba(255, 228, 196, 0.18)',
            'rgba(188, 224, 238, 0.2)',
            'rgba(255, 192, 203, 0.15)',
            'rgba(169, 204, 227, 0.18)',
            'rgba(255, 235, 205, 0.2)',
            'rgba(221, 160, 221, 0.15)'
        ];

        // Crear 15-20 puntitos
        const dotCount = 15 + Math.floor(Math.random() * 6);
        
        for (let i = 0; i < dotCount; i++) {
            const dot = document.createElement('div');
            dot.className = 'pastel-dot';
            
            // Tamaño aleatorio
            const size = 6 + Math.random() * 20;
            dot.style.width = size + 'px';
            dot.style.height = size + 'px';
            dot.style.borderRadius = '50%';
            dot.style.position = 'absolute';
            dot.style.pointerEvents = 'none';
            
            // Color aleatorio
            const color = pastelColors[i % pastelColors.length];
            dot.style.background = color;
            
            // Posición aleatoria dentro de la sección
            const top = 5 + Math.random() * 90;
            const left = 5 + Math.random() * 90;
            dot.style.top = top + '%';
            dot.style.left = left + '%';
            
            // Animación personalizada
            const duration = 6 + Math.random() * 10;
            const delay = Math.random() * 12;
            dot.style.animationDuration = duration + 's';
            dot.style.animationDelay = delay + 's';
            
            // Crear animación única para cada dot
            const dotId = 'dot-' + i;
            dot.style.animation = `${dotId} ${duration}s ease-in-out ${delay}s infinite`;
            
            const style = document.createElement('style');
            const moveX1 = 10 + Math.random() * 35;
            const moveY1 = -15 - Math.random() * 30;
            const moveX2 = -10 - Math.random() * 25;
            const moveY2 = 10 + Math.random() * 25;
            const moveX3 = 8 + Math.random() * 30;
            const moveY3 = -8 - Math.random() * 20;
            const scale1 = 1.2 + Math.random() * 1.8;
            const scale2 = 0.6 + Math.random() * 0.8;
            const scale3 = 1.0 + Math.random() * 1.4;
            
            style.textContent = `
                @keyframes ${dotId} {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                        opacity: 0.5;
                    }
                    25% {
                        transform: translate(${moveX1}px, ${moveY1}px) scale(${scale1});
                        opacity: 1;
                    }
                    50% {
                        transform: translate(${moveX2}px, ${moveY2}px) scale(${scale2});
                        opacity: 0.2;
                    }
                    75% {
                        transform: translate(${moveX3}px, ${moveY3}px) scale(${scale3});
                        opacity: 0.8;
                    }
                }
            `;
            document.head.appendChild(style);
            
            aboutSection.appendChild(dot);
        }
    };

    // Iniciar puntitos pastel
    setTimeout(createPastelDots, 500);

    // ========================================
    //  6. CARRITO DE COMPRAS MÁGICO
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
                
                // Animación mágica
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

            // Partículas de brillo
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
    //  9. BÚSQUEDA MÁGICA
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
                animation: fadeIn 0.4s ease;
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
            searchBox.querySelector('#closeSearchBtn').onmouseover = function() {
                this.style.borderColor = '#B48AD9';
                this.style.color = '#2E1A47';
            };
            searchBox.querySelector('#closeSearchBtn').onmouseout = function() {
                this.style.borderColor = 'rgba(214, 200, 224, 0.3)';
                this.style.color = '#4A4A4E';
            };

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
    //  10. MENÚ DE NAVEGACIÓN - FUNCIONALIDAD
    // ========================================
    // Hacer que todos los enlaces del menú naveguen correctamente
    const allNavLinks = document.querySelectorAll('.nav__list a, .footer__nav a');
    
    allNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Si es un enlace interno (empieza con #)
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
            } else if (href && href !== '#') {
                // Enlaces externos - permitir navegación
                // No prevenir el comportamiento por defecto
                return true;
            } else if (href === '#') {
                e.preventDefault();
                // Scroll al inicio de la página
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    //  11. MENÚ MÓVIL MÁGICO
    // ========================================
    const headerNav = document.querySelector('.header__nav');
    
    if (headerNav) {
        // Crear botón hamburguesa si no existe
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
            
            // Asegurar que el nav esté oculto en móvil inicialmente
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

            // Cerrar menú al hacer clic en un enlace
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

            // Manejar cambio de tamaño de ventana
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
    //  13. ANIMACIONES AL SCROLL MÁGICAS
    // ========================================
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.category-card, .product-card, .experience-card, .blog-card, .about-brief__content');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const delay = index * 60;
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
            el.style.transform = 'translateY(50px) scale(0.95)';
            el.style.filter = 'blur(5px)';
            el.style.transition = `all 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
            observer.observe(el);
        });
    };

    if ('IntersectionObserver' in window) {
        setTimeout(animateOnScroll, 300);
    } else {
        document.querySelectorAll('.category-card, .product-card, .experience-card, .blog-card, .about-brief__content')
            .forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0) scale(1)';
                el.style.filter = 'blur(0)';
            });
    }

    // ========================================
    //  14. ESTRELLAS MÁGICAS EN EL BANNER
    // ========================================
    const createMagicalStars = function() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const starColors = ['#C9A87C', '#C9A7EB', '#B48AD9', '#FF00FF', '#FFFFFF', '#FF69B4', '#7B68EE'];
        
        for (let i = 0; i < 80; i++) {
            const star = document.createElement('div');
            const size = Math.random() * 6 + 1;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const duration = Math.random() * 5 + 2;
            const delay = Math.random() * 4;
            const color = starColors[Math.floor(Math.random() * starColors.length)];

            star.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, ${color}, transparent 70%);
                border-radius: 50%;
                top: ${y}%;
                left: ${x}%;
                opacity: ${Math.random() * 0.8 + 0.1};
                animation: twinkle ${duration}s ease-in-out ${delay}s infinite alternate;
                pointer-events: none;
                z-index: 1;
                box-shadow: 0 0 ${size * 5}px ${color}44;
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
    //  16. MENSAJE DE CONSOLA MÁGICO
    // ========================================
    console.log('%c✨✦✧ Esencia Violeta ✧✦✨', 'font-size: 24px; font-weight: bold; color: #2A1A3D; text-shadow: 0 0 40px rgba(180, 138, 217, 0.3);');
    console.log('%cMazos de tarot y artículos esotéricos con alma ✨', 'font-size: 16px; color: #5B3A7A;');
    console.log('%c🔮 Que la luna guíe tu camino 🌙', 'font-size: 14px; color: #B48AD9;');
    console.log('%c🐈‍⬛ El gato negro te observa desde las sombras...', 'font-size: 13px; color: #000000;');
    console.log('%c💎 Amatista, Ojo de Tigre y Cuarzo Rosa te acompañan ✨', 'font-size: 13px; color: #4A4A4E;');
    console.log('%c🛒 Haz clic en el carrito para ver tus compras mágicas', 'font-size: 13px; color: #4A4A4E;');
    console.log('%c✧✦✧ Bienvenida a la experiencia mágica ✧✦✧', 'font-size: 14px; color: #C9A7EB;');

}); // Fin DOMContentLoaded

// ========================================
//  ESTILOS DE ANIMACIÓN MÁGICA
// ========================================
const magicalStyles = document.createElement('style');
magicalStyles.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes twinkle {
        0% { 
            opacity: 0.1; 
            transform: scale(0.3);
        }
        100% { 
            opacity: 1; 
            transform: scale(1.8);
        }
    }

    @keyframes gradientShift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
    }

    @keyframes sparkleFloat {
        0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
        }
        50% {
            transform: translate(10px, -15px) scale(1.5);
            opacity: 1;
        }
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
        .hamburger-btn {
            display: block;
        }
        
        .header__nav {
            order: 3;
            width: 100%;
        }
        
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
        .hamburger-btn {
            font-size: 1.5rem;
            padding: 0.4rem 0.8rem;
        }
    }

    /* Scrollbar mágica */
    ::-webkit-scrollbar {
        width: 8px;
    }

    ::-webkit-scrollbar-track {
        background: linear-gradient(180deg, #1C0F2E, #2A1A3D);
    }

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
