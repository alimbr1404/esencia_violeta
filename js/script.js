// ========================================
//  ESENCIA VIOLETA - JavaScript
//  Funcionalidades interactivas mejoradas
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ========================================
    //  1. EFECTO DE HUMO AL MOVER EL CURSOR
    // ========================================
    const createSmokeEffect = function() {
        const container = document.createElement('div');
        container.className = 'smoke-effect';
        document.body.appendChild(container);

        let particles = [];
        const maxParticles = 8;
        let isMouseOver = false;
        let mouseX = 0;
        let mouseY = 0;

        // Crear partículas de humo
        for (let i = 0; i < maxParticles; i++) {
            const particle = document.createElement('div');
            particle.className = 'smoke-particle';
            particle.style.width = (150 + Math.random() * 300) + 'px';
            particle.style.height = (150 + Math.random() * 300) + 'px';
            particle.style.opacity = 0;
            particle.style.background = `radial-gradient(circle, rgba(180, 138, 217, ${0.03 + Math.random() * 0.05}), rgba(201, 167, 235, ${0.02 + Math.random() * 0.03}), transparent 70%)`;
            container.appendChild(particle);
            particles.push({
                el: particle,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                speed: 0.3 + Math.random() * 0.5,
                size: 150 + Math.random() * 300,
                phase: Math.random() * Math.PI * 2
            });
        }

        // Actualizar posición de partículas cuando el mouse se mueve
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
                if (isMouseOver) {
                    // Movimiento hacia el mouse con efecto de arrastre
                    const dx = mouseX - p.x;
                    const dy = mouseY - p.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    // Solo mover si está dentro de un rango
                    if (distance < 600) {
                        const moveX = (dx / distance) * p.speed * 2;
                        const moveY = (dy / distance) * p.speed * 2;
                        p.x += moveX;
                        p.y += moveY;
                        
                        // Aumentar opacidad cuando el mouse está cerca
                        const opacity = Math.max(0, 1 - (distance / 600));
                        p.el.style.opacity = opacity * 0.3;
                    } else {
                        // Volver a posición original lentamente
                        p.x += (p.originalX - p.x) * 0.01;
                        p.y += (p.originalY - p.y) * 0.01;
                        p.el.style.opacity = 0;
                    }
                } else {
                    // Movimiento orgánico cuando no hay mouse
                    p.x += Math.sin(time * p.speed + p.phase) * 0.3;
                    p.y += Math.cos(time * p.speed * 0.7 + p.phase) * 0.3;
                    p.el.style.opacity = 0.04;
                }

                // Limitar dentro de la pantalla
                p.x = Math.max(0, Math.min(window.innerWidth, p.x));
                p.y = Math.max(0, Math.min(window.innerHeight, p.y));

                // Aplicar transformación
                p.el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`;
                p.el.style.filter = `blur(${40 + Math.sin(time + p.phase) * 10}px)`;
            });

            requestAnimationFrame(animateParticles);
        }

        // Guardar posiciones originales
        particles.forEach(p => {
            p.originalX = p.x;
            p.originalY = p.y;
        });

        animateParticles();
    };

    // Iniciar efecto de humo
    createSmokeEffect();

    // ========================================
    //  2. ELEMENTOS DECORATIVOS FLOTANTES
    // ========================================
    const createFloatingDecorations = function() {
        const decorElements = [
            '🐈‍⬛',  // Gato negro
            '✧',    // Tetragramatron
            '☿',    // Símbolo zodiacal (Mercurio)
            '♀',    // Símbolo zodiacal (Venus)
            '♃',    // Símbolo zodiacal (Júpiter)
            '🌙',   // Luna
            '⭐',   // Estrella
            '🔮',   // Amuleto
            '🧿',   // Amuleto turco
            '☯'     // Yin-Yang
        ];

        const positions = [
            { top: '8%', left: '3%' },
            { top: '15%', right: '3%' },
            { top: '35%', left: '2%' },
            { bottom: '25%', right: '2%' },
            { bottom: '10%', left: '5%' },
            { top: '55%', left: '50%' },
            { top: '70%', right: '4%' },
            { bottom: '35%', left: '1%' }
        ];

        // Seleccionar elementos aleatorios
        const selectedDecor = decorElements.slice(0, 6);
        
        // Crear elementos flotantes
        selectedDecor.forEach((icon, index) => {
            if (index >= positions.length) return;
            
            const decor = document.createElement('div');
            decor.className = 'floating-decor';
            decor.textContent = icon;
            
            const pos = positions[index];
            if (pos.top) decor.style.top = pos.top;
            if (pos.bottom) decor.style.bottom = pos.bottom;
            if (pos.left) decor.style.left = pos.left;
            if (pos.right) decor.style.right = pos.right;
            
            // Tamaños y opacidades aleatorias
            const size = 2 + Math.random() * 3;
            decor.style.fontSize = size + 'rem';
            decor.style.opacity = 0.03 + Math.random() * 0.05;
            decor.style.animationDelay = (Math.random() * 10) + 's';
            decor.style.animationDuration = (15 + Math.random() * 15) + 's';
            
            document.body.appendChild(decor);
        });
    };

    // Iniciar decoraciones flotantes
    createFloatingDecorations();

    // ========================================
    //  3. CARRITO DE COMPRAS MEJORADO
    // ========================================
    const cart = {
        items: [],
        total: 0,
        badge: document.querySelector('.cart-badge'),

        // Añadir producto al carrito
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
            this.showNotification(`${productName} añadido al carrito ✨`);
        },

        // Actualizar total del carrito
        updateTotal() {
            this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        },

        // Actualizar contador del badge
        updateBadge() {
            const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
            if (this.badge) {
                this.badge.textContent = totalItems;
                this.badge.style.display = totalItems > 0 ? 'flex' : 'none';
                
                // Animación de escala cuando se actualiza
                this.badge.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    this.badge.style.transform = 'scale(1)';
                }, 300);
            }
        },

        // Mostrar notificación elegante
        showNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: linear-gradient(135deg, #2E1A47, #3B1E54);
                color: #FFFFFF;
                padding: 1.2rem 2rem;
                border-radius: 16px;
                font-family: 'Quicksand', sans-serif;
                font-weight: 500;
                box-shadow: 0 12px 50px rgba(42, 26, 61, 0.4);
                z-index: 9999;
                transform: translateX(120px);
                opacity: 0;
                transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                border: 1px solid rgba(201, 167, 235, 0.1);
                backdrop-filter: blur(10px);
                font-size: 1rem;
            `;

            // Icono decorativo
            const icon = document.createElement('span');
            icon.textContent = '🃏 ';
            icon.style.marginRight = '8px';
            notification.prepend(icon);

            document.body.appendChild(notification);

            // Animar entrada
            requestAnimationFrame(() => {
                notification.style.transform = 'translateX(0)';
                notification.style.opacity = '1';
            });

            // Eliminar después de 3.5 segundos
            setTimeout(() => {
                notification.style.transform = 'translateX(120px)';
                notification.style.opacity = '0';
                setTimeout(() => {
                    notification.remove();
                }, 600);
            }, 3500);
        },

        // Ver carrito con modal mejorado
        viewCart() {
            if (this.items.length === 0) {
                this.showNotification('🛒 Tu carrito está vacío');
                return;
            }

            // Crear modal del carrito
            const modal = document.createElement('div');
            modal.className = 'cart-modal';
            modal.style.cssText = `
                position: fixed;
                inset: 0;
                background: rgba(42, 26, 61, 0.85);
                backdrop-filter: blur(10px);
                z-index: 9998;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            `;

            const modalContent = document.createElement('div');
            modalContent.style.cssText = `
                background: linear-gradient(145deg, #FFFFFF, #F8F5FA);
                border-radius: 24px;
                padding: 2.5rem;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 30px 80px rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(214, 200, 224, 0.2);
            `;

            // Título del carrito
            const title = document.createElement('h2');
            title.textContent = '🛒 Tu Carrito';
            title.style.cssText = `
                font-family: 'Playfair Display', serif;
                color: #3B1E54;
                font-size: 1.8rem;
                margin-bottom: 1.5rem;
                text-align: center;
            `;
            modalContent.appendChild(title);

            // Lista de productos
            this.items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.style.cssText = `
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.8rem 0;
                    border-bottom: 1px solid rgba(214, 200, 224, 0.2);
                `;

                const itemInfo = document.createElement('div');
                itemInfo.innerHTML = `
                    <strong style="color: #1C1C1E;">${item.name}</strong>
                    <span style="color: #4A4A4E; font-size: 0.9rem; display: block;">x${item.quantity}</span>
                `;

                const itemPrice = document.createElement('span');
                itemPrice.textContent = `€${(item.price * item.quantity).toFixed(2)}`;
                itemPrice.style.cssText = `
                    font-weight: 600;
                    color: #C9A87C;
                    font-size: 1.1rem;
                `;

                itemDiv.appendChild(itemInfo);
                itemDiv.appendChild(itemPrice);
                modalContent.appendChild(itemDiv);
            });

            // Total
            const totalDiv = document.createElement('div');
            totalDiv.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem 0;
                margin-top: 1rem;
                border-top: 2px solid rgba(201, 167, 235, 0.2);
                font-size: 1.2rem;
            `;
            totalDiv.innerHTML = `
                <strong style="font-family: 'Playfair Display', serif; color: #3B1E54;">Total</strong>
                <span style="font-weight: 700; color: #C9A87C; font-size: 1.4rem;">€${this.total.toFixed(2)}</span>
            `;
            modalContent.appendChild(totalDiv);

            // Botones de acción
            const actionsDiv = document.createElement('div');
            actionsDiv.style.cssText = `
                display: flex;
                gap: 1rem;
                margin-top: 1.5rem;
            `;

            const closeBtn = document.createElement('button');
            closeBtn.textContent = 'Cerrar';
            closeBtn.className = 'btn btn--secondary';
            closeBtn.style.cssText = 'flex: 1;';
            closeBtn.onclick = () => modal.remove();

            const checkoutBtn = document.createElement('button');
            checkoutBtn.textContent = 'Finalizar Compra';
            checkoutBtn.className = 'btn btn--primary';
            checkoutBtn.style.cssText = 'flex: 1;';
            checkoutBtn.onclick = () => {
                this.showNotification('✨ Pedido realizado con éxito');
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

            // Cerrar al hacer clic fuera
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        }
    };

    // ========================================
    //  4. BOTONES "AÑADIR AL CARRITO"
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

            // Efecto de animación al añadir
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);

            cart.addItem(name, price);
        });
    });

    // ========================================
    //  5. BOTÓN DEL CARRITO (HEADER)
    // ========================================
    const cartButton = document.querySelector('.header__actions .action-btn:last-child');
    if (cartButton) {
        cartButton.addEventListener('click', function(e) {
            e.preventDefault();
            cart.viewCart();
        });
    }

    // ========================================
    //  6. BÚSQUEDA MEJORADA
    // ========================================
    const searchButton = document.querySelector('.header__actions .action-btn:first-child');
    
    if (searchButton) {
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            const overlay = document.createElement('div');
            overlay.className = 'search-overlay';
            overlay.style.cssText = `
                position: fixed;
                inset: 0;
                background: rgba(42, 26, 61, 0.92);
                backdrop-filter: blur(12px);
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
                border-radius: 24px;
                max-width: 500px;
                width: 90%;
                text-align: center;
                box-shadow: 0 30px 80px rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(214, 200, 224, 0.2);
            `;

            searchBox.innerHTML = `
                <div style="font-size: 3rem; margin-bottom: 0.5rem;">🔮</div>
                <h3 style="font-family: 'Playfair Display', serif; color: #3B1E54; margin-bottom: 0.5rem; font-size: 1.8rem;">Buscar en Esencia Violeta</h3>
                <p style="color: #4A4A4E; margin-bottom: 1.5rem; font-size: 0.95rem;">Encuentra mazos, amuletos y más</p>
                <input type="text" 
                       placeholder="¿Qué energía buscas?" 
                       style="width: 100%; padding: 0.9rem 1.2rem; border: 2px solid rgba(214, 200, 224, 0.3); border-radius: 12px; font-family: 'Quicksand', sans-serif; font-size: 1rem; margin-bottom: 1rem; transition: border-color 0.3s ease; background: #FFFFFF;" 
                       autofocus 
                       id="searchInput" />
                <button class="btn btn--primary" style="width: 100%;" id="searchBtn">Buscar</button>
                <button class="btn btn--secondary" style="width: 100%; margin-top: 0.5rem;" id="closeSearchBtn">Cerrar</button>
            `;

            overlay.appendChild(searchBox);
            document.body.appendChild(overlay);

            // Efecto de hover en input
            const input = searchBox.querySelector('#searchInput');
            input.addEventListener('focus', function() {
                this.style.borderColor = '#B48AD9';
                this.style.boxShadow = '0 0 30px rgba(180, 138, 217, 0.1)';
            });
            input.addEventListener('blur', function() {
                this.style.borderColor = 'rgba(214, 200, 224, 0.3)';
                this.style.boxShadow = 'none';
            });

            // Cerrar
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
                    cart.showNotification(`🔍 Buscando: "${query}"`);
                    setTimeout(closeSearch, 1500);
                } else {
                    cart.showNotification('Por favor, escribe algo para buscar');
                }
            };

            searchBox.querySelector('#searchBtn').addEventListener('click', performSearch);
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') performSearch();
            });
        });
    }

    // ========================================
    //  7. MENÚ MÓVIL MEJORADO
    // ========================================
    const headerNav = document.querySelector('.header__nav');
    const headerInner = document.querySelector('.header__inner');
    
    if (headerNav && window.innerWidth <= 992) {
        const hamburgerBtn = document.createElement('button');
        hamburgerBtn.className = 'hamburger-btn';
        hamburgerBtn.setAttribute('aria-label', 'Abrir menú');
        hamburgerBtn.style.cssText = `
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(214, 200, 224, 0.1);
            border-radius: 12px;
            color: #FFFFFF;
            font-size: 1.8rem;
            cursor: pointer;
            padding: 0.5rem 1rem;
            transition: all 0.3s ease;
        `;
        hamburgerBtn.textContent = '☰';
        
        const headerLogo = document.querySelector('.header__logo');
        if (headerLogo) {
            headerLogo.after(hamburgerBtn);
        }

        headerNav.style.display = 'none';
        headerNav.style.width = '100%';
        headerNav.style.order = '3';
        headerNav.style.animation = 'slideDown 0.3s ease';

        let menuOpen = false;
        hamburgerBtn.addEventListener('click', function() {
            menuOpen = !menuOpen;
            headerNav.style.display = menuOpen ? 'block' : 'none';
            hamburgerBtn.textContent = menuOpen ? '✕' : '☰';
            hamburgerBtn.style.background = menuOpen ? 'rgba(180, 138, 217, 0.2)' : 'rgba(255, 255, 255, 0.05)';
            hamburgerBtn.style.borderColor = menuOpen ? '#B48AD9' : 'rgba(214, 200, 224, 0.1)';
            
            if (menuOpen) {
                headerNav.style.animation = 'slideDown 0.3s ease';
                // Reordenar elementos
                headerNav.style.display = 'block';
            }
        });

        headerNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                menuOpen = false;
                headerNav.style.display = 'none';
                hamburgerBtn.textContent = '☰';
                hamburgerBtn.style.background = 'rgba(255, 255, 255, 0.05)';
                hamburgerBtn.style.borderColor = 'rgba(214, 200, 224, 0.1)';
            });
        });
    }

    // ========================================
    //  8. NAVEGACIÓN ACTIVA
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
    //  9. SCROLL SUAVE MEJORADO
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ========================================
    //  10. ANIMACIONES AL SCROLL MEJORADAS
    // ========================================
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.category-card, .product-card, .experience-card, .blog-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const delay = index * 80;
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) scale(1)';
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(40px) scale(0.98)';
            el.style.transition = `all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${index * 0.05}s`;
            observer.observe(el);
        });
    };

    if ('IntersectionObserver' in window) {
        animateOnScroll();
    } else {
        document.querySelectorAll('.category-card, .product-card, .experience-card, .blog-card')
            .forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0) scale(1)';
            });
    }

    // ========================================
    //  11. ESTRELLAS ANIMADAS EN EL BANNER
    // ========================================
    const createStars = function() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        for (let i = 0; i < 40; i++) {
            const star = document.createElement('div');
            const size = Math.random() * 4 + 1;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const duration = Math.random() * 4 + 2;
            const delay = Math.random() * 3;

            star.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, ${Math.random() > 0.5 ? '#C9A87C' : '#C9A7EB'}, transparent 70%);
                border-radius: 50%;
                top: ${y}%;
                left: ${x}%;
                opacity: ${Math.random() * 0.6 + 0.2};
                animation: twinkle ${duration}s ease-in-out ${delay}s infinite alternate;
                pointer-events: none;
                z-index: 1;
                box-shadow: 0 0 ${size * 3}px rgba(201, 167, 235, 0.2);
            `;

            hero.appendChild(star);
        }
    };

    createStars();

    // ========================================
    //  12. FORMULARIO DE CONTACTO
    // ========================================
    const contactForm = document.querySelector('form');
    if (contactForm && contactForm.action && contactForm.action.includes('contacto')) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('nombre') || 'Visitante';
            
            cart.showNotification(`✨ ¡Gracias ${name}! Tu mensaje ha sido recibido`);
            this.reset();
        });
    }

    // ========================================
    //  13. INICIALIZAR CARRITO
    // ========================================
    cart.updateBadge();

    // ========================================
    //  14. MENSAJE DE CONSOLA MEJORADO
    // ========================================
    console.log('%c✨ Esencia Violeta ✨', 'font-size: 22px; font-weight: bold; color: #2A1A3D;');
    console.log('%cMazos de tarot y artículos esotéricos con alma', 'font-size: 15px; color: #5B3A7A;');
    console.log('%c🔮 Que la luna guíe tu camino', 'font-size: 13px; color: #B48AD9;');
    console.log('%c🐈‍⬛ El gato negro te observa desde las sombras', 'font-size: 12px; color: #4A4A4E;');
    console.log('%c🛒 Haz clic en el carrito para ver tus compras', 'font-size: 12px; color: #4A4A4E;');

}); // Fin DOMContentLoaded

// ========================================
//  ESTILOS DE ANIMACIÓN ADICIONALES
// ========================================
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-15px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes twinkle {
        0% { opacity: 0.1; transform: scale(0.8); }
        100% { opacity: 1; transform: scale(1.3); }
    }

    @keyframes floatDecor {
        0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
        25% { transform: translate(15px, -25px) rotate(5deg) scale(1.1); }
        50% { transform: translate(-10px, 20px) rotate(-5deg) scale(0.9); }
        75% { transform: translate(8px, -12px) rotate(3deg) scale(1.05); }
    }

    .cart-badge {
        display: none;
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .hamburger-btn {
        display: none;
        font-size: 1.8rem;
        background: none;
        border: none;
        color: #FFFFFF;
        cursor: pointer;
        padding: 0.2rem 0.5rem;
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

    /* Scrollbar personalizada */
    ::-webkit-scrollbar {
        width: 8px;
    }

    ::-webkit-scrollbar-track {
        background: #F8F5FA;
    }

    ::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #B48AD9, #C9A7EB);
        border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #C9A7EB, #B48AD9);
    }

    /* Selección de texto */
    ::selection {
        background: rgba(180, 138, 217, 0.3);
        color: #2A1A3D;
    }

    /* Smooth transitions para todos los elementos */
    * {
        transition: all 0.3s ease;
    }
`;

document.head.appendChild(additionalStyles);
