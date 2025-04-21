"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import ProveedorTable from "@/app/components/proveedor/ProveedorTable";
import { fetchProveedores, deleteProveedor } from "@/services/proveedores";

export default function ProveedoresContent() {
  const [proveedores, setProveedores] = useState([]);
  const [sinPag, setSinPag] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { proveedores, sinPag } = await fetchProveedores(page);
        setProveedores(proveedores || []);
        setSinPag(sinPag || []);
      } catch (err) {
        setError("Error al obtener proveedores.");
      }
    };
    fetchData();
  }, [page]);

  const handleDelete = async (e, proveedorId) => {
    e.preventDefault();
    const confirmDelete = confirm("¿Estás seguro de que quieres eliminar este proveedor?");
    if (!confirmDelete) return;
    try {
      const { success: deleteSuccess, message } = await deleteProveedor(proveedorId);
      if (deleteSuccess) {
        setProveedores((prev) => ({
          ...prev,
          data: prev.data.filter((p) => p.id !== proveedorId),
        }));
        setSuccess(message || "Proveedor eliminado correctamente");
        setError(null);
      } else {
        setError(message || "No se pudo eliminar el proveedor");
        setSuccess(null);
      }
    } catch (err) {
      setError("Error de conexión al eliminar el proveedor");
      setSuccess(null);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (success) setSuccess(null);
      if (error) setError(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [success, error]);

  return (
    <div className="container">
      <h1 className="page-title">Proveedores</h1>
      <nav className="button-container">
        <button className="nav-button">
          <Link href="/proveedores/crear">Crear Proveedor</Link>
        </button>
        <button className="nav-button">
          <Link href="/">Inicio</Link>
        </button>
        <Link href="/proveedores/deleted">
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
      <div className="message-container">
        {success && <div className="success-message">{success}</div>}
        {error && <div className="error-message">{error}</div>}
      </div>
      <ProveedorTable
        proveedores={proveedores.data || []}
        sinPag={sinPag}
        onDelete={handleDelete}
        storageKey="proveedoresTable"
      />
      <div className="pagination">
        {proveedores?.prev_page_url && (
          <Link href={`/proveedores?page=${proveedores.current_page - 1}`}>
            <button className="pagination-button">Anterior</button>
          </Link>
        )}
        {proveedores?.next_page_url && (
          <Link href={`/proveedores?page=${proveedores.current_page + 1}`}>
            <button className="pagination-button">Siguiente</button>
          </Link>
        )}
      </div>
    </div>
  );
}
