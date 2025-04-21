'use client';

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProductoTable from "@/app/components/producto/ProductoTable";
import { fetchProductos, deleteProducto } from "@/services/productos";

export default function ProductosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1"); 

  const [productos, setProductos] = useState([]);
  const [sinPag, setSinPag] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const loadProductos = async () => {
      try {
        const { productos, sinPag } = await fetchProductos(page); 
        setProductos(productos || []); 
        setSinPag(sinPag || []);
      } catch {
        setError("Error al obtener productos.");
      }
    };
    loadProductos();
  }, [page]); 

  const handleDelete = async (e, id) => {
    e.preventDefault();
    if (!confirm("¿Estás seguro de que quieres eliminar este producto?")) return;
    try {
      const { success: wasDeleted, message } = await deleteProducto(id);
      if (wasDeleted) {
        setProductos((prev) => ({
          ...prev,
          data: prev.data.filter((p) => p.id !== id),
        }));
        setSuccess(message || "Producto eliminado correctamente");
        setError(null);
      } else {
        setError(message || "No se pudo eliminar el producto");
        setSuccess(null);
      }
    } catch {
      setError("Error de conexión al eliminar el producto");
      setSuccess(null);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(null);
      setError(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [success, error]);

  return (
    <div className="container">
      <h1 className="page-title">Ventas</h1>
      <nav className="button-container">
        <button className="nav-button">
          <Link href="/productos/crear">Crear Producto</Link>
        </button>
        <button className="nav-button">
          <Link href="/">Inicio</Link>
        </button>
        <Link href="/productos/deleted" passHref>
          <button className="icon-button" title="Papelera">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </Link>
      </nav>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      <ProductoTable
        productos={productos.data || []}
        sinPag={sinPag}
        onDelete={handleDelete}
        storageKey="productosTable"
      />

      <div className="pagination">
        {productos?.prev_page_url && (
          <Link href={`/productos?page=${productos.current_page - 1}`}>
            <button className="pagination-button">Anterior</button>
          </Link>
        )}
        {productos?.next_page_url && (
          <Link href={`/productos?page=${productos.current_page + 1}`}>
            <button className="pagination-button">Siguiente</button>
          </Link>
        )}
      </div>
    </div>
  );
}
