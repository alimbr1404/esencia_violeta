// ========================================
//  ESENCIA VIOLETA - JavaScript
//  Funcionalidades interactivas
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ========================================
    //  1. CARRITO DE COMPRAS
    // ========================================
    const cart = {
        items: [],
        total: 0,
        badge: document.querySelector('.cart-badge'),

        // Añadir producto al carrito
        addItem(productName, price) {
            // Buscar si el producto ya existe
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
            }
        },

        // Mostrar notificación temporal
        showNotification(message) {
            // Crear elemento de notificación
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #2E1A47;
                color: #FFFFFF;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                font-family: 'Quicksand', sans-serif;
                font-weight: 500;
                box-shadow: 0 8px 30px rgba(42, 26, 61, 0.3);
                z-index: 9999;
                transform: translateY(100px);
                opacity: 0;
                transition: all 0.5s ease;
                border-left: 4px solid #B48AD9;
            `;

            document.body.appendChild(notification);

            // Animar entrada
            requestAnimationFrame(() => {
                notification.style.transform = 'translateY(0)';
                notification.style.opacity = '1';
            });

            // Eliminar después de 3 segundos
            setTimeout(() => {
                notification.style.transform = 'translateY(100px)';
                notification.style.opacity = '0';
                setTimeout(() => {
                    notification.remove();
                }, 500);
            }, 3000);
        },

        // Ver carrito (console log para demo)
        viewCart() {
            console.log('🛒 Carrito de compras:');
            this.items.forEach(item => {
                console.log(`  ${item.name} x${item.quantity} = €${(item.price * item.quantity).toFixed(2)}`);
            });
            console.log(`Total: €${this.total.toFixed(2)}`);
            alert(`🛒 Total: €${this.total.toFixed(2)}\n\n${this.items.map(item => `${item.name} x${item.quantity}`).join('\n')}`);
        }
    };

    // ========================================
    //  2. BOTONES "AÑADIR AL CARRITO"
    // ========================================
    const addToCartButtons = document.querySelectorAll('.product-card .btn--primary, .btn--small');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // Obtener información del producto
            const card = this.closest('.product-card');
            if (!card) return;

            const name = card.querySelector('.product-card__name')?.textContent || 'Producto';
            const priceText = card.querySelector('.product-card__price')?.textContent || '€0,00';
            
            // Convertir precio (ej: "€25,00" -> 25.00)
            const price = parseFloat(priceText.replace('€', '').replace(',', '.')) || 0;

            // Añadir al carrito
            cart.addItem(name, price);
        });
    });

    // ========================================
    //  3. BOTÓN DEL CARRITO (HEADER)
    // ========================================
    const cartButton = document.querySelector('.header__actions .action-btn:last-child');
    if (cartButton) {
        cartButton.addEventListener('click', function(e) {
            e.preventDefault();
            cart.viewCart();
        });
    }

    // ========================================
    //  4. BÚSQUEDA (LUPA)
    // ========================================
    const searchButton = document.querySelector('.header__actions .action-btn:first-child');
    
    if (searchButton) {
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Crear overlay de búsqueda
            const overlay = document.createElement('div');
            overlay.className = 'search-overlay';
            overlay.style.cssText = `
                position: fixed;
                inset: 0;
                background: rgba(42, 26, 61, 0.95);
                z-index: 9998;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            `;

            const searchBox = document.createElement('div');
            searchBox.style.cssText = `
                background: #F8F5FA;
                padding: 2rem;
                border-radius: 16px;
                max-width: 500px;
                width: 90%;
                text-align: center;
            `;

            searchBox.innerHTML = `
                <h3 style="font-family: 'Playfair Display', serif; color: #3B1E54; margin-bottom: 1rem;">Buscar en Esencia Violeta</h3>
                <input type="text" 
                       placeholder="¿Qué buscas?" 
                       style="width: 100%; padding: 0.8rem; border: 2px solid #D6C8E0; border-radius: 12px; font-family: 'Quicksand', sans-serif; font-size: 1rem; margin-bottom: 1rem;" 
                       autofocus />
                <button class="btn btn--primary" style="width: 100%;">Buscar</button>
                <button class="btn btn--secondary" style="width: 100%; margin-top: 0.5rem;" id="closeSearch">Cerrar</button>
            `;

            overlay.appendChild(searchBox);
            document.body.appendChild(overlay);

            // Cerrar al hacer clic en el botón
            overlay.querySelector('#closeSearch').addEventListener('click', function() {
                overlay.remove();
            });

            // Cerrar al hacer clic fuera del cuadro
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) {
                    overlay.remove();
                }
            });

            // Buscar con Enter
            const input = overlay.querySelector('input');
            const searchBtn = overlay.querySelector('.btn--primary');
            
            const performSearch = function() {
                const query = input.value.trim();
                if (query) {
                    alert(`🔍 Buscando: "${query}"\n(Esta funcionalidad estará disponible próximamente)`);
                    overlay.remove();
                } else {
                    alert('Por favor, escribe algo para buscar');
                }
            };

            searchBtn.addEventListener('click', performSearch);
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });
        });
    }

    // ========================================
    //  5. MENÚ MÓVIL (Hamburguesa)
    // ========================================
    // Crear botón hamburguesa para móvil
    const headerNav = document.querySelector('.header__nav');
    const headerInner = document.querySelector('.header__inner');
    
    if (headerNav && window.innerWidth <= 992) {
        const hamburgerBtn = document.createElement('button');
        hamburgerBtn.className = 'hamburger-btn';
        hamburgerBtn.setAttribute('aria-label', 'Abrir menú');
        hamburgerBtn.style.cssText = `
            background: none;
            border: none;
            color: #FFFFFF;
            font-size: 1.8rem;
            cursor: pointer;
            display: block;
            padding: 0.2rem 0.5rem;
        `;
        hamburgerBtn.innerHTML = '☰';
        
        // Insertar antes del nav
        const headerLogo = document.querySelector('.header__logo');
        if (headerLogo) {
            headerLogo.after(hamburgerBtn);
        }

        // Ocultar nav inicialmente en móvil
        headerNav.style.display = 'none';
        headerNav.style.width = '100%';
        headerNav.style.order = '3';

        // Toggle menú
        let menuOpen = false;
        hamburgerBtn.addEventListener('click', function() {
            menuOpen = !menuOpen;
            headerNav.style.display = menuOpen ? 'block' : 'none';
            hamburgerBtn.innerHTML = menuOpen ? '✕' : '☰';
            
            if (menuOpen) {
                headerNav.style.animation = 'slideDown 0.3s ease';
            }
        });

        // Cerrar menú al hacer clic en un enlace
        headerNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                menuOpen = false;
                headerNav.style.display = 'none';
                hamburgerBtn.innerHTML = '☰';
            });
        });
    }

    // ========================================
    //  6. NAVEGACIÓN ACTIVA (SCROLL)
    // ========================================
    const navLinks = document.querySelectorAll('.nav__list a');
    
    // Marcar enlace activo según la URL actual
    const currentPath = window.location.pathname;
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (href === '#' && currentPath === '/')) {
            link.classList.add('active');
        }
    });

    // ========================================
    //  7. SCROLL SUAVE PARA ENLACES INTERNOS
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
    //  8. ANIMACIONES AL HACER SCROLL
    // ========================================
    // Observador para animar elementos al entrar en vista
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.category-card, .product-card, .experience-card, .blog-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Añadir clase con retraso para efecto cascada
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
            observer.observe(el);
        });
    };

    // Ejecutar solo en navegadores que soporten IntersectionObserver
    if ('IntersectionObserver' in window) {
        animateOnScroll();
    } else {
        // Fallback: mostrar todos los elementos
        document.querySelectorAll('.category-card, .product-card, .experience-card, .blog-card')
            .forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
    }

    // ========================================
    //  9. CONTADOR DE CARRITO (Demo)
    // ========================================
    // Inicializar badge
    cart.updateBadge();

    // ========================================
    //  10. EFECTO DE ESTRELLAS (Banner)
    // ========================================
    const createStars = function() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        // Crear estrellas adicionales con JavaScript
        for (let i = 0; i < 30; i++) {
            const star = document.createElement('div');
            const size = Math.random() * 3 + 1;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const duration = Math.random() * 3 + 2;
            const delay = Math.random() * 2;

            star.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${Math.random() > 0.5 ? '#C9A87C' : '#C9A7EB'};
                border-radius: 50%;
                top: ${y}%;
                left: ${x}%;
                opacity: ${Math.random() * 0.5 + 0.3};
                animation: twinkle ${duration}s ease-in-out ${delay}s infinite alternate;
                pointer-events: none;
                z-index: 1;
            `;

            hero.appendChild(star);
        }
    };

    // Crear estrellas en el banner
    createStars();

    // ========================================
    //  11. FORMULARIO DE CONTACTO (Demo)
    // ========================================
    const contactForm = document.querySelector('form');
    if (contactForm && contactForm.action.includes('contacto')) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('nombre') || 'Visitante';
            
            alert(`✨ ¡Gracias ${name}! Tu mensaje ha sido enviado.\n\nPronto recibirás respuesta de Esencia Violeta.`);
            this.reset();
        });
    }

    // ========================================
    //  12. CONSOLA CON MENSAJE BONITO
    // ========================================
    console.log('%c✨ Esencia Violeta ✨', 'font-size: 20px; font-weight: bold; color: #2A1A3D;');
    console.log('%cMazos de tarot y artículos esotéricos con alma', 'font-size: 14px; color: #5B3A7A;');
    console.log('%c🔮 Que la luna guíe tu camino', 'font-size: 12px; color: #B48AD9;');

    console.log('%c🛒 Para ver el carrito, haz clic en el icono del carrito', 'font-size: 12px; color: #4A4A4E;');

}); // Fin DOMContentLoaded

// ========================================
//  ESTILOS ADICIONALES (Keyframes)
// ========================================
// Añadir estilos de animación al documento
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    /* Animaciones */
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes twinkle {
        0% { opacity: 0.2; transform: scale(0.8); }
        100% { opacity: 1; transform: scale(1.2); }
    }

    /* Estilo para el badge del carrito (por defecto oculto) */
    .cart-badge {
        display: none;
    }

    /* Estilo para el botón hamburguesa en móvil */
    .hamburger-btn {
        font-size: 1.8rem;
        background: none;
        border: none;
        color: #FFFFFF;
        cursor: pointer;
        padding: 0.2rem 0.5rem;
        display: none;
    }

    /* Mostrar hamburguesa en móvil */
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
        }
        
        .header__nav .nav__list a {
            font-size: 1.1rem;
        }
    }

    /* Ajuste para móviles muy pequeños */
    @media (max-width: 600px) {
        .hamburger-btn {
            font-size: 1.5rem;
        }
    }
`;

document.head.appendChild(styleSheet);
