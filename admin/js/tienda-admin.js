// ========================================
//  TIENDA-ADMIN.JS - ESENCIA VIOLETA
//  Lógica para gestionar productos
// ========================================

import { 
    getProductos,
    getProducto,
    createProducto,
    updateProducto,
    deleteProducto
} from '../../js/firebase-config.js';

import {
    mostrarNotificacion,
    formatearPrecio,
    validarProducto,
    subirImagenCloudinary,
    CATEGORIAS,
    verificarSesion,
    iniciarSesion,
    cerrarSesion,
    CLOUDINARY_CONFIG
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

// Tabla
const tablaProductos = document.getElementById('tablaProductos');
const searchInput = document.getElementById('searchInput');
const btnBuscar = document.getElementById('btnBuscar');
const btnLimpiar = document.getElementById('btnLimpiar');
const filtroCategoria = document.getElementById('filtroCategoria');

// Modal
const modalProducto = document.getElementById('modalProducto');
const modalTitle = document.getElementById('modalTitle');
const modalSubtitle = document.getElementById('modalSubtitle');
const productoForm = document.getElementById('productoForm');
const productoId = document.getElementById('productoId');
const formNombre = document.getElementById('formNombre');
const formCategoria = document.getElementById('formCategoria');
const formDescripcion = document.getElementById('formDescripcion');
const formPrecio = document.getElementById('formPrecio');
const formStock = document.getElementById('formStock');
const formImagen = document.getElementById('formImagen');
const formImagePreview = document.getElementById('formImagePreview');
const formDestacado = document.getElementById('formDestacado');
const btnGuardarProducto = document.getElementById('btnGuardarProducto');
const btnCancelarModal = document.getElementById('btnCancelarModal');
const btnNuevoProducto = document.getElementById('btnNuevoProducto');

// Modal Eliminar
const modalEliminar = document.getElementById('modalEliminar');
const eliminarMensaje = document.getElementById('eliminarMensaje');
const btnCancelarEliminar = document.getElementById('btnCancelarEliminar');
const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');

// ========================================
//  2. VARIABLES GLOBALES
// ========================================

let productos = [];
let productoEditandoId = null;
let productoEliminarId = null;
let imagenSubidaUrl = '';

// ========================================
//  3. AUTENTICACIÓN
// ========================================

if (verificarSesion()) {
    loginPage.style.display = 'none';
    adminPanel.style.display = 'block';
    cargarProductos();
}

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const usuario = loginUser.value.trim();
    const contrasena = loginPass.value.trim();

    if (iniciarSesion(usuario, contrasena)) {
        loginError.style.display = 'none';
        loginPage.style.display = 'none';
        adminPanel.style.display = 'block';
        cargarProductos();
    } else {
        loginError.style.display = 'block';
        setTimeout(() => {
            loginError.style.display = 'none';
        }, 3000);
    }
});

logoutBtn.addEventListener('click', function() {
    cerrarSesion();
    adminPanel.style.display = 'none';
    loginPage.style.display = 'flex';
});

// ========================================
//  4. CARGAR PRODUCTOS
// ========================================

async function cargarProductos() {
    try {
        tablaProductos.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem; color: #4A4A4E;">
                    <div style="display: inline-block; width: 30px; height: 30px; border: 3px solid rgba(180,138,217,0.1); border-top-color: #B48AD9; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    <p style="margin-top: 0.5rem;">Cargando productos...</p>
                </td>
            </tr>
        `;

        productos = await getProductos();
        renderizarTabla(productos);
    } catch (error) {
        console.error('Error al cargar productos:', error);
        mostrarNotificacion('❌ Error al cargar los productos', 'error');
        tablaProductos.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem; color: #4A4A4E;">
                    ❌ Error al cargar los productos. Por favor, recarga la página.
                </td>
            </tr>
        `;
    }
}

// ========================================
//  5. RENDERIZAR TABLA
// ========================================

function renderizarTabla(data) {
    if (data.length === 0) {
        tablaProductos.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem; color: #4A4A4E;">
                    <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📦</div>
                    <p>No hay productos registrados.</p>
                    <p style="font-size: 0.9rem;">Haz clic en "Nuevo Producto" para comenzar.</p>
                </td>
            </tr>
        `;
        return;
    }

    tablaProductos.innerHTML = data.map(p => `
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
            <td>
                <div class="actions">
                    <button class="btn btn-primary btn-sm btn-editar" data-id="${p.id}">✎ Editar</button>
                    <button class="btn btn-danger btn-sm btn-eliminar" data-id="${p.id}">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');

    // Event listeners para editar
    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            abrirModalEditar(id);
        });
    });

    // Event listeners para eliminar
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const producto = productos.find(p => p.id === id);
            if (producto) {
                abrirModalEliminar(id, producto.nombre);
            }
        });
    });
}

// ========================================
//  6. FILTROS Y BÚSQUEDA
// ========================================

function aplicarFiltros() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const categoria = filtroCategoria.value;

    let filtrados = [...productos];

    if (searchTerm) {
        filtrados = filtrados.filter(p =>
            p.nombre.toLowerCase().includes(searchTerm) ||
            p.descripcion.toLowerCase().includes(searchTerm) ||
            p.categoria.toLowerCase().includes(searchTerm)
        );
    }

    if (categoria !== 'all') {
        filtrados = filtrados.filter(p => p.categoria === categoria);
    }

    renderizarTabla(filtrados);
}

btnBuscar.addEventListener('click', aplicarFiltros);

searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        aplicarFiltros();
    }
});

btnLimpiar.addEventListener('click', function() {
    searchInput.value = '';
    filtroCategoria.value = 'all';
    renderizarTabla(productos);
});

filtroCategoria.addEventListener('change', aplicarFiltros);

// ========================================
//  7. MODAL - NUEVO PRODUCTO
// ========================================

btnNuevoProducto.addEventListener('click', function() {
    abrirModalNuevo();
});

function abrirModalNuevo() {
    productoEditandoId = null;
    imagenSubidaUrl = '';
    modalTitle.textContent = '✦ Nuevo Producto ✦';
    modalSubtitle.textContent = 'Completa los datos del producto';
    productoForm.reset();
    productoId.value = '';
    formImagePreview.classList.remove('active');
    formImagePreview.src = '';
    btnGuardarProducto.textContent = '✦ Guardar ✦';
    formCategoria.value = '';
    modalProducto.classList.add('active');
    
    // Limpiar input file
    formImagen.value = '';
}

function abrirModalEditar(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    productoEditandoId = id;
    imagenSubidaUrl = producto.imagen || '';
    
    modalTitle.textContent = '✦ Editar Producto ✦';
    modalSubtitle.textContent = 'Modifica los datos del producto';
    productoId.value = id;
    formNombre.value = producto.nombre || '';
    formCategoria.value = producto.categoria || '';
    formDescripcion.value = producto.descripcion || '';
    formPrecio.value = producto.precio || '';
    formStock.value = producto.stock || '';
    formDestacado.checked = producto.destacado || false;
    
    if (producto.imagen) {
        formImagePreview.src = producto.imagen;
        formImagePreview.classList.add('active');
    } else {
        formImagePreview.classList.remove('active');
    }

    btnGuardarProducto.textContent = '✦ Actualizar ✦';
    modalProducto.classList.add('active');
}

// ========================================
//  8. MODAL - ELIMINAR
// ========================================

function abrirModalEliminar(id, nombre) {
    productoEliminarId = id;
    eliminarMensaje.textContent = 
        `¿Estás seguro de que deseas eliminar "${nombre}"? Esta acción no se puede deshacer.`;
    modalEliminar.classList.add('active');
}

btnCancelarEliminar.addEventListener('click', function() {
    modalEliminar.classList.remove('active');
    productoEliminarId = null;
});

btnConfirmarEliminar.addEventListener('click', async function() {
    if (!productoEliminarId) return;
    
    try {
        await deleteProducto(productoEliminarId);
        mostrarNotificacion('✅ Producto eliminado correctamente', 'success');
        modalEliminar.classList.remove('active');
        productoEliminarId = null;
        await cargarProductos();
    } catch (error) {
        console.error('Error al eliminar:', error);
        mostrarNotificacion('❌ Error al eliminar el producto', 'error');
    }
});

// ========================================
//  9. CERRAR MODAL
// ========================================

btnCancelarModal.addEventListener('click', function() {
    modalProducto.classList.remove('active');
});

modalProducto.addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.remove('active');
    }
});

// ========================================
//  10. SUBIR IMAGEN A CLOUDINARY
// ========================================

formImagen.addEventListener('change', async function(e) {
    const file = this.files[0];
    if (!file) return;

    try {
        mostrarNotificacion('📤 Subiendo imagen...', 'success');
        
        const url = await subirImagenCloudinary(file);
        
        if (url) {
            imagenSubidaUrl = url;
            formImagePreview.src = url;
            formImagePreview.classList.add('active');
            mostrarNotificacion('✅ Imagen subida correctamente', 'success');
        }
    } catch (error) {
        console.error('Error al subir imagen:', error);
        mostrarNotificacion(`❌ ${error.message}`, 'error');
        this.value = '';
    }
});

// ========================================
//  11. GUARDAR PRODUCTO
// ========================================

productoForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const data = {
        nombre: formNombre.value.trim(),
        categoria: formCategoria.value,
        descripcion: formDescripcion.value.trim(),
        precio: parseFloat(formPrecio.value),
        stock: parseInt(formStock.value) || 0,
        destacado: formDestacado.checked,
        imagen: imagenSubidaUrl || formImagePreview.src || ''
    };

    // Validar
    const errores = validarProducto(data);
    if (errores.length > 0) {
        mostrarNotificacion(`❌ ${errores.join(', ')}`, 'error');
        return;
    }

    try {
        const editandoId = productoId.value;
        
        if (editandoId) {
            // Editar
            await updateProducto(editandoId, data);
            mostrarNotificacion('✅ Producto actualizado correctamente', 'success');
        } else {
            // Crear
            await createProducto(data);
            mostrarNotificacion('✅ Producto creado correctamente', 'success');
        }

        modalProducto.classList.remove('active');
        await cargarProductos();
        
        // Limpiar formulario
        productoForm.reset();
        formImagePreview.classList.remove('active');
        formImagePreview.src = '';
        imagenSubidaUrl = '';

    } catch (error) {
        console.error('Error al guardar:', error);
        mostrarNotificacion('❌ Error al guardar el producto', 'error');
    }
});

// ========================================
//  12. ESTILO DE LOADING
// ========================================

const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ========================================
//  13. EXPORTAR FUNCIONES (para debug)
// ========================================

window.cargarProductosAdmin = cargarProductos;
window.productos = productos;

// ========================================
//  14. MENSAJE DE CONSOLA
// ========================================

console.log('%c🛒 Gestión de productos cargada', 'font-size: 14px; color: #B48AD9;');
console.log('%c📦 CRUD completo con Firebase + Cloudinary', 'font-size: 12px; color: #4A4A4E;');