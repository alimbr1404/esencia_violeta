// ========================================
//  FIREBASE CONFIGURATION
//  Esencia Violeta
// ========================================

// Importar Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    doc, 
    getDocs, 
    getDoc, 
    addDoc, 
    updateDoc, 
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ========================================
//  CONFIGURACIÓN DE FIREBASE
// ========================================
const firebaseConfig = {
    apiKey: "AIzaSyDmDwskwW_9Mtmw0rMoeXx6Yqwyh2ZkFSg",
    authDomain: "esencia-violeta.firebaseapp.com",
    projectId: "esencia-violeta",
    storageBucket: "esencia-violeta.firebasestorage.app",
    messagingSenderId: "1025302401875",
    appId: "1:1025302401875:web:bc8399c00d2e37e7c787a6"
};

// ========================================
//  INICIALIZAR FIREBASE
// ========================================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ========================================
//  REFERENCIAS A COLECCIONES
// ========================================
const productosCollection = collection(db, "productos");

// ========================================
//  EXPORTAR FUNCIONES
// ========================================

// Obtener todos los productos
export async function getProductos() {
    try {
        const snapshot = await getDocs(productosCollection);
        const productos = [];
        snapshot.forEach(doc => {
            productos.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return productos;
    } catch (error) {
        console.error("Error al obtener productos:", error);
        throw error;
    }
}

// Obtener un producto por ID
export async function getProducto(id) {
    try {
        const docRef = doc(db, "productos", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data()
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error al obtener producto:", error);
        throw error;
    }
}

// Crear un nuevo producto
export async function createProducto(data) {
    try {
        const docRef = await addDoc(productosCollection, {
            ...data,
            creado: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error al crear producto:", error);
        throw error;
    }
}

// Actualizar un producto
export async function updateProducto(id, data) {
    try {
        const docRef = doc(db, "productos", id);
        await updateDoc(docRef, {
            ...data,
            actualizado: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        throw error;
    }
}

// Eliminar un producto
export async function deleteProducto(id) {
    try {
        const docRef = doc(db, "productos", id);
        await deleteDoc(docRef);
        return true;
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        throw error;
    }
}

// Obtener productos por categoría
export async function getProductosByCategoria(categoria) {
    try {
        const q = query(productosCollection, where("categoria", "==", categoria));
        const snapshot = await getDocs(q);
        const productos = [];
        snapshot.forEach(doc => {
            productos.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return productos;
    } catch (error) {
        console.error("Error al obtener productos por categoría:", error);
        throw error;
    }
}

// Obtener productos destacados
export async function getProductosDestacados() {
    try {
        const q = query(productosCollection, where("destacado", "==", true));
        const snapshot = await getDocs(q);
        const productos = [];
        snapshot.forEach(doc => {
            productos.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return productos;
    } catch (error) {
        console.error("Error al obtener productos destacados:", error);
        throw error;
    }
}

export { db, productosCollection };