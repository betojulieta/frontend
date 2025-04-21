"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchProductoById } from "@/services/productos";
export default function ProductDetail(props) {
  const [bid, setBid] = useState(null);
  const [producto, setProducto] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const resolveParams = async () => {
      const p = await Promise.resolve(props.params);
      setBid(p.bid);
    };
    resolveParams();
  }, [props.params]);
  useEffect(() => {
    if (!bid) return;
    const fetchData = async () => {
      try {
        const data = await fetchProductoById(bid);
        setProducto(data);
      } catch {
        setError("Error al obtener los datos del producto.");
      }
    };
    fetchData();
  }, [bid]);
  if (error) return <div className="error-message">{error}</div>;
  if (!producto) return <div>Cargando...</div>;
  return (
    <div className="container">
      <h1>Detalle del Producto</h1>
      <table className="detail-table">
        <thead>
          <tr>
            <th>Campo</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {[
            { label: "ID", value: producto.id },
            { label: "Fecha", value: producto.fecha },
            { label: "Cliente", value: producto.cliente },
            { label: "Producto", value: producto.producto },
            { label: "Debe", value: producto.debe },
            { label: "Abono", value: producto.abono },
            { label: "Costo C", value: producto.costoC },
            { label: "Costo P", value: producto.costoP },
          ].map(({ label, value }) => (
            <tr key={label}>
              <td>{label}</td>
              <td>{value}</td>
            </tr>
          ))}
          <tr>
            <td>Acciones</td>
            <td>
              <Link href={`/productos/${producto.id}/editar`}>
                <button className="btn-edit">Actualizar</button>
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="back-link">
        <Link href="/productos">← Volver a la lista de productos</Link>
      </div>
    </div>
  );
}
