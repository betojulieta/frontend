"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchProveedorById } from "@/services/proveedores";
export default function ProveedorDetalle({ params }) {
  const [proveedor, setProveedor] = useState(null);
  const [error, setError] = useState(null);
  const [bid, setBid] = useState(null);
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params; 
      setBid(resolvedParams.bid); 
    };
    resolveParams();
  }, [params]);
  useEffect(() => {
    if (!bid) return; 
    const fetchData = async () => {
      try {
        const data = await fetchProveedorById(bid);
        setProveedor(data);
      } catch (err) {
        setError("Error al obtener los datos del proveedor.");
      }
    };
    fetchData();
  }, [bid]);
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  if (!proveedor) {
    return <div>Cargando...</div>;
  }
  return (
    <div className="container">
      <h1>Detalle del Proveedor</h1>
      <table className="detail-table">
        <thead>
          <tr>
            <th>Campo</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {[
            { campo: "ID", valor: proveedor.id },
            { campo: "Fecha", valor: proveedor.fecha },
            { campo: "Proveedor de Carne", valor: proveedor.proveedorCarne },
            { campo: "Costo Carne", valor: proveedor.costoC },
            { campo: "Proveedor de Queso", valor: proveedor.proveedorQueso },
            { campo: "Costo Queso", valor: proveedor.costoQ },
          ].map(({ campo, valor }) => (
            <tr key={campo}>
              <td>{campo}</td>
              <td>{valor}</td>
            </tr>
          ))}
          <tr>
            <td>Acciones</td>
            <td>
              <Link href={`/proveedores/${proveedor.id}/editar`}>
                <button className="btn-edit">Actualizar</button>
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="back-link">
        <Link href="/proveedores">← Volver a la lista de proveedores</Link>
      </div>
    </div>
  );
}