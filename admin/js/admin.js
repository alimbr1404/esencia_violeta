// ========================================
//  ADMIN.JS - ESENCIA VIOLETA
//  Funciones compartidas del panel admin
// ========================================

// ========================================
//  1. NOTIFICACIONES
// ========================================

export function mostrarNotificacion(mensaje, tipo = 'success') {
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
//  2. FORMATEADORES
// ========================================

export function formatearPrecio(precio) {
    return `₡${(precio || 0).toLocaleString('es-CR')}`;
}

export function formatearFecha(timestamp) {
    if (!timestamp) return '—';
    try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('es-CR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return '—';
    }
}

// ========================================
//  3. VALIDACIONES
// ========================================

export function validarProducto(data) {
    const errores = [];

    if (!data.nombre || data.nombre.trim().length < 3) {
        errores.push('El nombre debe tener al menos 3 caracteres');
    }

    if (!data.categoria) {
        errores.push('Debes seleccionar una categoría');
    }

    if (!data.descripcion || data.descripcion.trim().length < 10) {
        errores.push('La descripción debe tener al menos 10 caracteres');
    }

    if (!data.precio || data.precio <= 0) {
        errores.push('El precio debe ser mayor a 0');
    }

    if (data.stock === undefined || data.stock === null || data.stock < 0) {
        errores.push('El stock no puede ser negativo');
    }

    return errores;
}

// ========================================
//  4. CLOUDINARY - SUBIR IMAGEN
// ========================================

const CLOUDINARY_CLOUD_NAME = 'xnt9xngf';
const CLOUDINARY_UPLOAD_PRESET = 'esencia_violeta_products';

export async function subirImagenCloudinary(file) {
    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
        throw new Error('La imagen no puede superar los 5MB');
    }

    // Validar tipo
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
    if (!tiposPermitidos.includes(file.type)) {
        throw new Error('Formato no permitido. Usa JPG, PNG o WEBP');
    }

    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', 'productos');

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData
            }
        );

        const data = await response.json();

        if (data.secure_url) {
            return data.secure_url;
        } else {
            throw new Error(data.error?.message || 'Error al subir la imagen');
        }
    } catch (error) {
        console.error('Error en Cloudinary:', error);
        throw error;
    }
}

// ========================================
//  5. CATEGORÍAS PREDEFINIDAS
// ========================================

export const CATEGORIAS = [
    { valor: 'Tarot', label: '✦ Tarot ✦' },
    { valor: 'Inciensos', label: '✦ Inciensos ✦' },
    { valor: 'Velas', label: '✦ Velas ✦' },
    { valor: 'Piedras', label: '✦ Piedras ✦' },
    { valor: 'Amuletos', label: '✦ Amuletos ✦' }
];

// ========================================
//  6. GENERAR ID CORTO (para uso interno)
// ========================================

export function generarId() {
    return Math.random().toString(36).substring(2, 10);
}

// ========================================
//  7. MANEJO DE ERRORES
// ========================================

export function manejarError(error, contexto = '') {
    console.error(`Error en ${contexto}:`, error);
    
    let mensaje = '❌ Ha ocurrido un error';
    
    if (error.message) {
        mensaje += `: ${error.message}`;
    }
    
    return mensaje;
}

// ========================================
//  8. DEBOUNCE (para búsquedas)
// ========================================

export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========================================
//  9. CONFIGURACIÓN DE AUTENTICACIÓN
// ========================================

export const ADMIN_CONFIG = {
    usuario: 'admin',
    contrasena: 'esencia2026'
};

export function verificarSesion() {
    return sessionStorage.getItem('admin_logged') === 'true';
}

export function iniciarSesion(usuario, contrasena) {
    if (usuario === ADMIN_CONFIG.usuario && contrasena === ADMIN_CONFIG.contrasena) {
        sessionStorage.setItem('admin_logged', 'true');
        return true;
    }
    return false;
}

export function cerrarSesion() {
    sessionStorage.removeItem('admin_logged');
}

// ========================================
//  10. EXPORTAR CONFIGURACIÓN DE CLOUDINARY
// ========================================

export const CLOUDINARY_CONFIG = {
    cloudName: CLOUDINARY_CLOUD_NAME,
    uploadPreset: CLOUDINARY_UPLOAD_PRESET
};

// ========================================
//  11. ESTADÍSTICAS
// ========================================

export function calcularEstadisticas(productos) {
    const total = productos.length;
    
    const categorias = [...new Set(productos.map(p => p.categoria))];
    const totalCategorias = categorias.length;
    
    const destacados = productos.filter(p => p.destacado === true);
    const totalDestacados = destacados.length;
    
    const conStock = productos.filter(p => (p.stock || 0) > 0);
    const sinStock = productos.filter(p => (p.stock || 0) === 0);
    
    const precioPromedio = total > 0 
        ? productos.reduce((sum, p) => sum + (p.precio || 0), 0) / total 
        : 0;
    
    const precioTotal = productos.reduce((sum, p) => sum + (p.precio || 0), 0);
    
    return {
        total,
        totalCategorias,
        totalDestacados,
        conStock: conStock.length,
        sinStock: sinStock.length,
        precioPromedio: Math.round(precioPromedio),
        precioTotal,
        categorias
    };
}

// ========================================
//  12. MENSAJE DE CONSOLA
// ========================================

console.log('%c✨✦✧ Esencia Violeta - Admin Utils ✧✦✨', 
    'font-size: 16px; font-weight: bold; color: #2A1A3D;');
console.log('%c📦 Módulo de utilidades cargado', 'font-size: 12px; color: #5B3A7A;');
console.log('%c🔧 Funciones: notificaciones, validaciones, Cloudinary, estadísticas', 'font-size: 12px; color: #B48AD9;');