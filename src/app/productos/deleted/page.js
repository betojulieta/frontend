"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchDeletedProductos, deleteProductoPermanently } from "@/services/productos";
import ProductoDeletedTable from "@/app/components/producto/ProductoDeletedTable";
export default function DeletedProductos() {
  const router = useRouter();
  const [productosEliminados, setProductosEliminados] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const obtenerProductos = async () => {
      setLoading(true);
      try {
        const data = await fetchDeletedProductos(); 
        setProductosEliminados(data.data || []);
      } catch (err) {
        setError("Ocurrió un error al cargar los productos eliminados.");
      } finally {
        setLoading(false); 
      }
    };
    obtenerProductos();
  }, []);
  const handleAction = async (e, productoId, actionType) => {
    e.preventDefault();
    const actionMessage =
      actionType === "delete"
        ? "¿Estás seguro de que quieres eliminar permanentemente este producto?"
        : "¿Estás seguro de que quieres restaurar este producto?";
    const confirmAction = confirm(actionMessage);

    if (!confirmAction) return;

    try {
      if (actionType === "delete") {
        const res = await deleteProductoPermanently(productoId); 
        if (res.success) {
          setProductosEliminados((prev) =>
            prev.filter((producto) => producto.id !== productoId)
          );
          alert(res.message);
          router.push(`/productos?success=${encodeURIComponent(res.message)}`);
        } else {
          setError(res.message || "No se pudo eliminar el producto.");
        }
      } else if (actionType === "restore") {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/productos/${productoId}/restore`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setProductosEliminados((prev) =>
            prev.filter((producto) => producto.id !== productoId)
          );
          alert(data.message);
          router.push(`/productos?success=${encodeURIComponent(data.message)}`);
        } else {
          setError(data.message || "No se pudo restaurar el producto.");
        }
      }
    } catch (err) {
      console.error(
        `Error al ${actionType === "delete" ? "eliminar" : "restaurar"} el producto:`,
        err
      );
      setError(`Ocurrió un error al ${actionType === "delete" ? "eliminar" : "restaurar"} el producto.`);
    }
  };
  if (loading) {
    return <p>Cargando productos eliminados...</p>;
  }
  if (error) {
    return <p className="naranja">{error}</p>;
  }
  return (
    <div>
      <h1>Papelera: eliminar/restaurar productos</h1>
      {productosEliminados.length === 0 ? (
        <p>No hay productos eliminados.</p>
      ) : (
        <ProductoDeletedTable
          productos={productosEliminados}
          onDelete={(e, id) => handleAction(e, id, "delete")} 
          onRestore={(e, id) => handleAction(e, id, "restore")} 
        />
      )}
      <Link href="/productos">Volver a la lista de productos</Link>
    </div>
  );
}