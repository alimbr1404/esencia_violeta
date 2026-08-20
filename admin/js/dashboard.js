// ========================================
//  DASHBOARD.JS - ESENCIA VIOLETA
//  Lógica específica del dashboard
// ========================================

import { 
    getProductos,
    getProductosDestacados 
} from '../../js/firebase-config.js';

import {
    mostrarNotificacion,
    formatearPrecio,
    formatearFecha,
    calcularEstadisticas,
    verificarSesion,
    iniciarSesion,
    cerrarSesion,
    ADMIN_CONFIG
} from './admin.js';

// ========================================
//  1. REFERENCIAS DOM
// ========================================

const loginPage = document.getElementById('loginPage');
const adminPanel = document.getElementById('adminPanel');
const loginForm = document.getElementById('loginForm');
const loginUser = document.getElementById('loginUser');
const loginPass = document.getElementById('loginPass');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');

// Stats
const totalProductosEl = document.getElementById('totalProductos');
const totalCategoriasEl = document.getElementById('totalCategorias');
const totalDestacadosEl = document.getElementById('totalDestacados');
const totalBlogEl = document.getElementById('totalBlog');
const ultimosProductosEl = document.getElementById('ultimosProductos');

// ========================================
//  2. AUTENTICACIÓN
// ========================================

// Verificar sesión al cargar
if (verificarSesion()) {
    mostrarAdmin();
    cargarDatos();
}

// Login
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const usuario = loginUser.value.trim();
    const contrasena = loginPass.value.trim();

    if (iniciarSesion(usuario, contrasena)) {
        loginError.style.display = 'none';
        mostrarAdmin();
        cargarDatos();
    } else {
        loginError.style.display = 'block';
        setTimeout(() => {
            loginError.style.display = 'none';
        }, 3000);
    }
});

// Logout
logoutBtn.addEventListener('click', function() {
    cerrarSesion();
    mostrarLogin();
});

function mostrarAdmin() {
    loginPage.style.display = 'none';
    adminPanel.style.display = 'block';
}

function mostrarLogin() {
    adminPanel.style.display = 'none';
    loginPage.style.display = 'flex';
}

// ========================================
//  3. CARGAR DATOS DEL DASHBOARD
// ========================================

async function cargarDatos() {
    try {
        // Mostrar estado de carga
        mostrarLoading();

        // Obtener productos
        const productos = await getProductos();
        
        // Calcular estadísticas
        const stats = calcularEstadisticas(productos);
        
        // Actualizar stats
        actualizarStats(stats);
        
        // Mostrar últimos productos
        mostrarUltimosProductos(productos);
        
        // Ocultar loading
        ocultarLoading();

    } catch (error) {
        console.error('Error al cargar datos:', error);
        mostrarNotificacion('❌ Error al cargar los datos del dashboard', 'error');
        ocultarLoading();
    }
}

// ========================================
//  4. ACTUALIZAR ESTADÍSTICAS
// ========================================

function actualizarStats(stats) {
    totalProductosEl.textContent = stats.total;
    totalCategoriasEl.textContent = stats.totalCategorias;
    totalDestacadosEl.textContent = stats.totalDestacados;
    
    // Blog - por ahora fijo, luego se conectará
    totalBlogEl.textContent = '8';
    
    // Animación de números
    animarNumero(totalProductosEl, 0, stats.total);
    animarNumero(totalCategoriasEl, 0, stats.totalCategorias);
    animarNumero(totalDestacadosEl, 0, stats.totalDestacados);
}

function animarNumero(elemento, inicio, fin) {
    const duracion = 800;
    const inicioTiempo = performance.now();
    
    function actualizar(tiempoActual) {
        const progreso = Math.min((tiempoActual - inicioTiempo) / duracion, 1);
        const valor = Math.round(inicio + (fin - inicio) * progreso);
        elemento.textContent = valor;
        
        if (progreso < 1) {
            requestAnimationFrame(actualizar);
        }
    }
    
    requestAnimationFrame(actualizar);
}

// ========================================
//  5. MOSTRAR ÚLTIMOS PRODUCTOS
// ========================================

function mostrarUltimosProductos(productos) {
    const ultimos = productos
        .sort((a, b) => {
            const dateA = a.creado ? new Date(a.creado.seconds * 1000) : new Date(0);
            const dateB = b.creado ? new Date(b.creado.seconds * 1000) : new Date(0);
            return dateB - dateA;
        })
        .slice(0, 5);

    if (ultimos.length === 0) {
        ultimosProductosEl.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem; color: #4A4A4E;">
                    <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📦</div>
                    <p>No hay productos aún.</p>
                    <p style="font-size: 0.9rem;">¡Comienza agregando tu primer producto!</p>
                </td>
            </tr>
        `;
        return;
    }

    ultimosProductosEl.innerHTML = ultimos.map(p => `
        <tr>
            <td>
                <img src="${p.imagen || 'https://via.placeholder.com/50x50/2A1A3D/FFFFFF?text=🔮'}" 
                     alt="${p.nombre}" 
                     class="product-image"
                     onerror="this.src='https://via.placeholder.com/50x50/2A1A3D/FFFFFF?text=🔮'"
                />
            </td>
            <td><strong>${p.nombre}</strong></td>
            <td><span class="badge badge-primary">✦ ${p.categoria} ✦</span></td>
            <td>${formatearPrecio(p.precio)}</td>
            <td>
                ${(p.stock || 0) > 5 ? 
                    `<span class="badge badge-success">${p.stock}</span>` :
                    (p.stock || 0) > 0 ?
                    `<span class="badge badge-warning">${p.stock}</span>` :
                    `<span class="badge badge-danger">Sin stock</span>`
                }
            </td>
            <td>${p.destacado ? '⭐' : '—'}</td>
        </tr>
    `).join('');
}

// ========================================
//  6. LOADING
// ========================================

function mostrarLoading() {
    const placeholder = `
        <tr>
            <td colspan="6" style="text-align: center; padding: 2rem; color: #4A4A4E;">
                <div style="display: inline-block; width: 30px; height: 30px; border: 3px solid rgba(180,138,217,0.1); border-top-color: #B48AD9; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <p style="margin-top: 0.5rem;">Cargando productos...</p>
            </td>
        </tr>
    `;
    ultimosProductosEl.innerHTML = placeholder;
}

function ocultarLoading() {
    // El loading se oculta automáticamente al renderizar
}

// ========================================
//  7. ACTUALIZAR DATOS CADA 30 SEGUNDOS
// ========================================

let intervaloActualizacion = null;

function iniciarActualizacionAutomatica() {
    if (intervaloActualizacion) {
        clearInterval(intervaloActualizacion);
    }
    
    intervaloActualizacion = setInterval(() => {
        if (verificarSesion()) {
            cargarDatos();
        }
    }, 30000); // 30 segundos
}

function detenerActualizacionAutomatica() {
    if (intervaloActualizacion) {
        clearInterval(intervaloActualizacion);
        intervaloActualizacion = null;
    }
}

// Iniciar si está logueado
if (verificarSesion()) {
    iniciarActualizacionAutomatica();
}

// Detener al cerrar sesión
logoutBtn.addEventListener('click', function() {
    detenerActualizacionAutomatica();
});

// ========================================
//  8. EXPORTAR FUNCIONES (para debug)
// ========================================

window.cargarDatosDashboard = cargarDatos;
window.actualizarStats = actualizarStats;

// ========================================
//  9. MENSAJE DE CONSOLA
// ========================================

console.log('%c📊 Dashboard cargado correctamente', 'font-size: 14px; color: #B48AD9;');
console.log('%c🔄 Actualización automática cada 30 segundos', 'font-size: 12px; color: #4A4A4E;');

// Estilo para animación de loading
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);