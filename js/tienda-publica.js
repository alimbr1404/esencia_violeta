// ========================================
//  TIENDA-PUBLICA.JS - ESENCIA VIOLETA
//  Lógica para la tienda pública
// ========================================

import { getProductos } from './firebase-config.js';

// ========================================
//  1. VARIABLES GLOBALES
// ========================================

let productos = [];
let carritoItems = [];
let categoriaActual = 'all';

// ========================================
//  2. REFERENCIAS DOM
// ========================================

const productsGrid = document.getElementById('productsGrid');
const categoryFilters = document.getElementById('categoryFilters');
const cartBtn = document.getElementById('cartBtn');
const cartBadge = document.getElementById('cartBadge');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mainNav = document.getElementById('mainNav');

// ========================================
//  3. CARGAR PRODUCTOS DESDE FIREBASE
// ========================================

export async function cargarProductos() {
    try {
        mostrarLoading();

        productos = await getProductos();
        renderizarCategorias();
        renderizarProductos('all');

    } catch (error) {
        console.error('Error al cargar productos:', error);
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 0; color: #4A4A4E;">
                <p style="font-size: 2rem; margin-bottom: 1rem;">🔮</p>
                <p>Error al cargar los productos. Por favor, recarga la página.</p>
                <button onclick="location.reload()" class="btn btn--primary" style="margin-top: 1rem;">
                    🔄 Recargar
                </button>
            </div>
        `;
        mostrarNotificacion('❌ Error al cargar los productos', 'error');
    }
}

// ========================================
//  4. RENDERIZAR CATEGORÍAS
// ========================================

function renderizarCategorias() {
    const categorias = ['all', ...new Set(productos.map(p => p.categoria))];
    
    const nombresCategorias = {
        'all': '✦ Todas ✦',
        'Tarot': '✦ Tarot ✦',
        'Inciensos': '✦ Inciensos ✦',
        'Velas': '✦ Velas ✦',
        'Piedras': '✦ Piedras ✦',
        'Amuletos': '✦ Amuletos ✦'
    };

    categoryFilters.innerHTML = categorias.map(cat => `
        <button class="shop-category-btn ${cat === categoriaActual ? 'active' : ''}" data-categoria="${cat}">
            ${nombresCategorias[cat] || cat}
        </button>
    `).join('');

    categoryFilters.querySelectorAll('.shop-category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const categoria = this.getAttribute('data-categoria');
            categoriaActual = categoria;
            
            categoryFilters.querySelectorAll('.shop-category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            renderizarProductos(categoria);
        });
    });
}

// ========================================
//  5. RENDERIZAR PRODUCTOS
// ========================================

function renderizarProductos(categoria) {
    let filtrados = categoria === 'all' 
        ? productos 
        : productos.filter(p => p.categoria === categoria);

    if (filtrados.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 0; color: #4A4A4E;">
                <p style="font-size: 2rem; margin-bottom: 1rem;">🔮</p>
                <p>No hay productos en esta categoría.</p>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = filtrados.map(producto => `
        <article class="product-card">
            <div class="product-card__image" 
                 style="background-image: url('${producto.imagen || 'https://via.placeholder.com/300x300/2A1A3D/FFFFFF?text=🔮'}');" 
                 role="img" 
                 aria-label="${producto.nombre}">
            </div>
            <span class="product-card__category">✦ ${producto.categoria} ✦</span>
            <h3 class="product-card__name">${producto.nombre}</h3>
            <p class="product-card__description">${producto.descripcion || ''}</p>
            <span class="product-card__price">₡${(producto.precio || 0).toLocaleString('es-CR')} <span>colones</span></span>
            <button class="btn btn--primary btn--small add-to-cart" data-id="${producto.id}">✦ Añadir al carrito ✦</button>
        </article>
    `).join('');

    // Event listeners para añadir al carrito
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const producto = productos.find(p => p.id === id);
            if (producto) {
                agregarAlCarrito(producto);
                this.textContent = '✦ Añadido ✦';
                this.classList.add('added');
                setTimeout(() => {
                    this.textContent = '✦ Añadir al carrito ✦';
                    this.classList.remove('added');
                }, 2000);
            }
        });
    });
}

// ========================================
//  6. CARRITO DE COMPRAS
// ========================================

function agregarAlCarrito(producto) {
    const existente = carritoItems.find(item => item.id === producto.id);
    if (existente) {
        existente.cantidad += 1;
    } else {
        carritoItems.push({
            ...producto,
            cantidad: 1
        });
    }
    actualizarBadge();
    mostrarNotificacion(`✨ ${producto.nombre} añadido al carrito ✨`, 'success');
}

function eliminarDelCarrito(id) {
    carritoItems = carritoItems.filter(item => item.id !== id);
    actualizarBadge();
    renderizarCarrito();
}

function actualizarCantidad(id, cambio) {
    const item = carritoItems.find(i => i.id === id);
    if (item) {
        item.cantidad += cambio;
        if (item.cantidad <= 0) {
            eliminarDelCarrito(id);
            return;
        }
        renderizarCarrito();
        actualizarBadge();
    }
}

function actualizarBadge() {
    const total = carritoItems.reduce((sum, item) => sum + item.cantidad, 0);
    cartBadge.textContent = total;
    cartBadge.classList.toggle('visible', total > 0);

    if (total > 0) {
        cartBadge.style.transform = 'scale(1.4) rotate(10deg)';
        cartBadge.style.boxShadow = '0 0 40px rgba(255, 0, 255, 0.5)';
        setTimeout(() => {
            cartBadge.style.transform = 'scale(1) rotate(0deg)';
            cartBadge.style.boxShadow = '0 0 30px rgba(255, 0, 255, 0.3)';
        }, 400);
    }
}

function obtenerTotal() {
    return carritoItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
}

// ========================================
//  7. CARRITO MODAL
// ========================================

export function renderizarCarrito() {
    const existingModal = document.querySelector('.cart-modal');
    if (existingModal) existingModal.remove();

    const isMobile = window.innerWidth <= 480;

    const modal = document.createElement('div');
    modal.className = 'cart-modal';

    const content = document.createElement('div');
    content.className = 'cart-modal__content';

    const title = document.createElement('h2');
    title.className = 'cart-modal__title';
    title.innerHTML = '🛒 ✦ Tu Carrito Mágico ✦';
    content.appendChild(title);

    if (carritoItems.length === 0) {
        content.innerHTML += `
            <div class="cart-empty">
                <p>🔮</p>
                <p>Tu carrito está vacío...</p>
                <p style="font-size: 0.9rem;">¡Explora nuestra tienda y encuentra tu tesoro!</p>
            </div>
        `;
    } else {
        carritoItems.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-modal__item';
            itemDiv.innerHTML = `
                <div class="cart-modal__item-info">
                    <div class="cart-modal__item-name">${item.nombre}</div>
                    <div class="cart-modal__item-quantity">
                        Cantidad: 
                        <button class="qty-btn" data-id="${item.id}" data-cambio="-1" style="background: transparent; border: 1px solid rgba(214,200,224,0.3); border-radius: 50%; width: 24px; height: 24px; font-size: 0.8rem; cursor: pointer;">−</button>
                        <span style="font-weight: 600; margin: 0 0.3rem;">${item.cantidad}</span>
                        <button class="qty-btn" data-id="${item.id}" data-cambio="1" style="background: transparent; border: 1px solid rgba(214,200,224,0.3); border-radius: 50%; width: 24px; height: 24px; font-size: 0.8rem; cursor: pointer;">+</button>
                    </div>
                </div>
                <span class="cart-modal__item-price">₡${(item.precio * item.cantidad).toLocaleString('es-CR')}</span>
                <button class="cart-modal__item-remove" data-id="${item.id}">✕</button>
            `;
            content.appendChild(itemDiv);
        });

        // Total
        const totalDiv = document.createElement('div');
        totalDiv.className = 'cart-modal__total';
        totalDiv.innerHTML = `
            <span class="cart-modal__total-label">✦ Total ✦</span>
            <span class="cart-modal__total-amount">₡${obtenerTotal().toLocaleString('es-CR')}</span>
        `;
        content.appendChild(totalDiv);

        // Botones
        const actions = document.createElement('div');
        actions.className = 'cart-modal__actions';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'btn btn--secondary';
        closeBtn.textContent = '✧ Seguir comprando';
        closeBtn.addEventListener('click', () => modal.remove());

        const checkoutBtn = document.createElement('button');
        checkoutBtn.className = 'btn btn--primary';
        checkoutBtn.innerHTML = '✦ Comprar por WhatsApp ✦';
        checkoutBtn.addEventListener('click', () => {
            comprarPorWhatsApp();
            modal.remove();
        });

        actions.appendChild(closeBtn);
        actions.appendChild(checkoutBtn);
        content.appendChild(actions);

        // Event listeners para cantidad
        content.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const cambio = parseInt(this.getAttribute('data-cambio'));
                actualizarCantidad(id, cambio);
            });
        });

        // Event listeners para eliminar
        content.querySelectorAll('.cart-modal__item-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                eliminarDelCarrito(id);
            });
        });
    }

    modal.appendChild(content);
    document.body.appendChild(modal);

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// ========================================
//  8. COMPRAR POR WHATSAPP
// ========================================

function comprarPorWhatsApp() {
    if (carritoItems.length === 0) {
        mostrarNotificacion('🛒 Tu carrito está vacío', 'error');
        return;
    }

    const numeroWhatsApp = '50662613366';
    
    let mensaje = 'Hola quiero adquirir estos productos:\n\n';
    let total = 0;
    
    carritoItems.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        mensaje += `${index + 1}. ${item.nombre} - ${item.cantidad} unidad(es) - ₡${subtotal.toLocaleString('es-CR')}\n`;
    });
    
    mensaje += `\n─────────────────────\n`;
    mensaje += `✨ Total: ₡${total.toLocaleString('es-CR')}\n`;
    mensaje += `\n🌙 ¡Que la luna guíe tu camino! ✨`;

    const mensajeCodificado = encodeURIComponent(mensaje);
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;

    mostrarNotificacion('✨ Abriendo WhatsApp... ✨', 'success');

    setTimeout(() => {
        window.open(urlWhatsApp, '_blank');
        carritoItems = [];
        actualizarBadge();
    }, 1000);
}

// ========================================
//  9. NOTIFICACIONES
// ========================================

function mostrarNotificacion(mensaje, tipo = 'success') {
    const notif = document.createElement('div');
    notif.className = `notification ${tipo}`;
    notif.textContent = mensaje;
    document.body.appendChild(notif);

    setTimeout(() => notif.classList.add('show'), 100);

    setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => notif.remove(), 500);
    }, 3000);
}

// ========================================
//  10. LOADING
// ========================================

function mostrarLoading() {
    productsGrid.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Cargando productos... 🔮</p>
        </div>
    `;
}

// ========================================
//  11. MENÚ HAMBURGUESA
// ========================================

if (hamburgerBtn && mainNav) {
    let menuOpen = false;

    hamburgerBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        menuOpen = !menuOpen;
        mainNav.classList.toggle('open', menuOpen);
        hamburgerBtn.textContent = menuOpen ? '✕' : '☰';
        hamburgerBtn.classList.toggle('active', menuOpen);
        hamburgerBtn.setAttribute('aria-label', menuOpen ? 'Cerrar menú' : 'Abrir menú');
    });

    document.addEventListener('click', function(e) {
        if (menuOpen && window.innerWidth <= 992) {
            const isClickInside = mainNav.contains(e.target) || hamburgerBtn.contains(e.target);
            if (!isClickInside) {
                menuOpen = false;
                mainNav.classList.remove('open');
                hamburgerBtn.textContent = '☰';
                hamburgerBtn.classList.remove('active');
                hamburgerBtn.setAttribute('aria-label', 'Abrir menú');
            }
        }
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 992 && menuOpen) {
            menuOpen = false;
            mainNav.classList.remove('open');
            hamburgerBtn.textContent = '☰';
            hamburgerBtn.classList.remove('active');
            hamburgerBtn.setAttribute('aria-label', 'Abrir menú');
        }
    });
}

// ========================================
//  12. BOTÓN DEL CARRITO
// ========================================

cartBtn.addEventListener('click', function() {
    this.style.transform = 'scale(1.2) rotate(15deg)';
    this.style.boxShadow = '0 0 60px rgba(255, 0, 255, 0.3)';
    setTimeout(() => {
        this.style.transform = 'scale(1) rotate(0deg)';
        this.style.boxShadow = 'none';
    }, 300);
    renderizarCarrito();
});

// ========================================
//  13. ESTILOS DE LOADING
// ========================================

const style = document.createElement('style');
style.textContent = `
    .loading-spinner {
        grid-column: 1 / -1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem 0;
        color: #4A4A4E;
    }

    .loading-spinner .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(180, 138, 217, 0.1);
        border-top-color: #B48AD9;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 0.8rem;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .product-card .btn.added {
        background: linear-gradient(135deg, #006400, #008800) !important;
        color: #FFFFFF !important;
    }

    .notification {
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #2E1A47, #4A2060);
        color: #FFFFFF;
        padding: 1rem 2rem;
        border-radius: 16px;
        font-family: 'Quicksand', sans-serif;
        font-weight: 500;
        box-shadow: 0 12px 60px rgba(42, 26, 61, 0.4);
        z-index: 3000;
        transform: translateX(150px) scale(0.8);
        opacity: 0;
        transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        border: 1px solid rgba(201, 167, 235, 0.15);
        backdrop-filter: blur(15px);
        max-width: 400px;
    }

    .notification.show {
        transform: translateX(0) scale(1);
        opacity: 1;
    }

    .notification.success {
        background: linear-gradient(135deg, #006400, #008800);
    }

    .notification.error {
        background: linear-gradient(135deg, #8B0000, #CC0000);
    }
`;
document.head.appendChild(style);

// ========================================
//  14. EXPORTAR FUNCIONES (para debug)
// ========================================

window.cargarProductosPublicos = cargarProductos;
window.verCarrito = renderizarCarrito;
window.productosPublicos = productos;

// ========================================
//  15. INICIALIZAR
// ========================================

cargarProductos();
actualizarBadge();

console.log('%c🛒 Tienda pública inicializada', 'font-size: 14px; color: #B48AD9;');
console.log('%c📦 Conectada a Firebase Firestore', 'font-size: 12px; color: #4A4A4E;');
console.log('%c🔮 Productos cargados dinámicamente', 'font-size: 12px; color: #4A4A4E;');