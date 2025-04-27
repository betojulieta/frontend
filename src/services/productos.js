const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL; // Centraliza la URL base

console.log(API_URL);
export async function fetchProductoById(id) {
  try {
    const res = await fetch(`${API_URL}/api/productos/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(`Error al obtener el producto con ID ${id}: ${res.status}`);
    }
    return await res.json(); 
  } catch (error) {
    console.error("Error en fetchProductoById:", error);
    throw error; 
  }
}
export async function updateProducto(id, data) {
  try {
    const res = await fetch(`${API_URL}/api/productos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error(`Error al actualizar el producto con ID ${id}: ${res.status}`);
    }
    return await res.json(); 
  } catch (error) {
    throw error;
  }
}
export async function fetchProductos(page = 1) {
  try {
    const res = await fetch(`${API_URL}/api/productos?page=${page}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(`Error al obtener productos de la página ${page}`);
    }
    const data = await res.json();
    return {
      productos: data.productos, 
      sinPag: data.sinPag,      
    };
  } catch (error) {
    throw error;
  }
}

export async function deleteProducto(id) {
  try {
    const res = await fetch(`${API_URL}/api/productos/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
    });

    if (res.ok) {
      return await res.json(); 
    }
    return { success: false, message: "No se pudo eliminar el producto." };
  } catch (error) {
    return { success: false, message: "Error de conexión al servidor." };
  }
}
export async function fetchDeletedProductos(page = 1) {
  try {
    const res = await fetch(`${API_URL}/api/productos/deleted?page=${page}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Error al obtener los registros eliminados");
    }
    return await res.json();
  } catch (error) {
    throw error;
  }
}
export async function deleteProductoPermanently(id) {
  try {
    const res = await fetch(`${API_URL}/api/productos/${id}/forceDelete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      return await res.json(); 
    }
    return { success: false, message: "No se pudo eliminar el producto permanentemente." };
  } catch (error) {
    return { success: false, message: "Error de conexión al servidor." };
  }
}
export async function restoreProducto(id) {
  try {
    const res = await fetch(`${API_URL}/api/productos/${id}/restore`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Error al restaurar el producto");
    }
    return await res.json(); 
  } catch (error) {
    throw error;
  }
}