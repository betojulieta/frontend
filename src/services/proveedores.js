const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL; 
export async function fetchProveedorById(id) {
  try {
    const res = await fetch(`${API_URL}/api/suppliers/${id}`);
    if (!res.ok) {
      throw new Error(`Error al obtener el proveedor con ID ${id}: ${res.status}`);
    }
    return await res.json(); 
  } catch (error) {
    throw error; 
  }
}
export async function updateProveedor(id, data) {
  try {
    const res = await fetch(`${API_URL}/api/suppliers/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Error al actualizar el proveedor con ID ${id}: ${res.status}`);
    }
    return await res.json(); 
  } catch (error) {
    throw error;
  }
}
export const fetchProveedores = async (page = 1) => {
  try {
    const res = await fetch(`${API_URL}/api/suppliers?page=${page}`);
    if (!res.ok) {
      throw new Error("Error al obtener la lista de proveedores.");
    }
    const data = await res.json();
    return {
      proveedores: data.proveedores || [], 
      sinPag: data.sinPag || [],          
    };
  } catch (error) {
    throw error;
  }
};

export const deleteProveedor = async (id) => {
  try {
    const res = await fetch(`${API_URL}/api/suppliers/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
    });
    if (res.ok) {
      const data = await res.json();
      return data; 
    }
    return { success: false, message: "No se pudo eliminar el proveedor." }; 
  } catch (error) {
    return { success: false, message: "Error de conexión al servidor." };
  }
};
export const fetchDeletedProveedores = async (page = 1) => {
  try {
    const res = await fetch(`${API_URL}/api/suppliers/deleted?page=${page}`);
    if (!res.ok) {
      throw new Error("Error al obtener los proveedores eliminados.");
    }
    return await res.json(); 
  } catch (error) {
    throw error;
  }
};
export const deleteProveedorPermanently = async (id) => {
  try {
    const res = await fetch(`${API_URL}/api/suppliers/${id}/forceDelete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const data = await res.json();
      return data; 
    }
    return { success: false, message: "No se pudo eliminar el proveedor permanentemente." };
  } catch (error) {
    return { success: false, message: "Error de conexión al servidor." };
  }
};
export const restoreProveedor = async (id) => {
  try {
    const res = await fetch(`${API_URL}/api/suppliers/${id}/restore`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(`Error al restaurar el proveedor con ID ${id}: ${res.status}`);
    }
    return await res.json(); 
  } catch (error) {
    throw error;
  }
};