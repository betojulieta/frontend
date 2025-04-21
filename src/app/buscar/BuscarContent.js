'use client';

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ResultadosBusqueda from "@/app/components/ResultadosBusqueda";
import { fetchProductos, deleteProducto } from "@/services/productos";

const Buscar = () => {
  const [productos, setProductos] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const { productos } = await fetchProductos(1);
        setProductos(productos.data || []);
      } catch (err) {
        console.error(err);
        setError("Error al obtener productos.");
      }
    };
    obtenerProductos();
  }, []);

  useEffect(() => {
    const realizarBusqueda = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const res = await fetch("http://127.0.0.1:8000/api/buscador", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });
        if (!res.ok) throw new Error("Error al obtener los resultados");
        const data = await res.json();
        if (data.success) {
          setResultados(data.data);
          setError(null);
        } else {
          setError(data.message || "No se encontraron resultados");
        }
      } catch (err) {
        setError("Error al realizar la búsqueda: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    realizarBusqueda();
  }, [query]);

  const handleDelete = async (e, productoId) => {
    e.preventDefault();
    if (!confirm("¿Estás seguro de que quieres eliminar este producto?")) return;
    try {
      const { success: deleteSuccess, message } = await deleteProducto(productoId);
      if (deleteSuccess) {
        setResultados((prev) => prev.filter((p) => p.id !== productoId));
        setProductos((prev) => prev.filter((p) => p.id !== productoId));
        setSuccess(message || "Producto eliminado correctamente");
        setError(null);
      } else {
        setError(message || "No se pudo eliminar el producto");
        setSuccess(null);
      }
    } catch (err) {
      setError("Error de conexión al eliminar el producto");
      setSuccess(null);
    }
  };

  return (
    <div>
      <h1>Resultados de la búsqueda</h1>
      {loading && <p>Cargando...</p>}
      {error && <p className="naranja">{error}</p>}
      {success && <p className="verde">{success}</p>}
      {!loading && !error && (
        <ResultadosBusqueda resultados={resultados} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default Buscar;
