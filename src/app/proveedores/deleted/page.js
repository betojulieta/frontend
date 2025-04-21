"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  fetchDeletedProveedores,
  deleteProveedorPermanently,
} from "@/services/proveedores";
import ProveedorDeletedTable from "@/app/components/proveedor/ProveedorDeletedTable";
export default function DeletedProveedores() {
  const router = useRouter();
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const loadProveedores = async () => {
      try {
        setLoading(true);
        const { data } = await fetchDeletedProveedores();
        setProveedores(data || []);
      } catch (err) {
        setError("Error al cargar los proveedores eliminados.");
      } finally {
        setLoading(false);
      }
    };
    loadProveedores();
  }, []);
  const handleDelete = async (e, id) => {
    e.preventDefault();
    if (!confirm("¿Eliminar permanentemente este proveedor?")) return;
    try {
      const res = await deleteProveedorPermanently(id);
      if (res.success) {
        setProveedores((prev) => prev.filter((p) => p.id !== id));
        alert(res.message);
        router.push(`/proveedores?success=${encodeURIComponent(res.message)}`);
      } else {
        setError(res.message || "No se pudo eliminar el proveedor.");
      }
    } catch {
      setError("Error al eliminar el proveedor.");
    }
  };
  const handleRestore = async (e, id) => {
    e.preventDefault();
    if (!confirm("¿Restaurar este proveedor?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/suppliers/${id}/restore`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProveedores((prev) => prev.filter((p) => p.id !== id));
        alert(data.message);
        router.push(`/proveedores?success=${encodeURIComponent(data.message)}`);
      } else {
        setError(data.message || "Error al restaurar el proveedor.");
      }
    } catch {
      setError("No se pudo restaurar el proveedor.");
    }
  };
  if (loading) return <p>Cargando proveedores eliminados...</p>;
  if (error) return <p className="naranja">{error}</p>;
  return (
    <div>
      <h1>Papelera: Restaurar/Eliminar Proveedores</h1>
      {proveedores.length === 0 ? (
        <p>No hay proveedores eliminados.</p>
      ) : (
        <ProveedorDeletedTable
          productos={proveedores}
          onDelete={handleDelete}
          onRestore={handleRestore}
        />
      )}
      <Link href="/proveedores">← Volver a la lista de proveedores</Link>
    </div>
  );
}
