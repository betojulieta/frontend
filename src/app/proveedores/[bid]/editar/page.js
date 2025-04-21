"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchProveedorById, updateProveedor } from "@/services/proveedores";
export default function ProveedorEditar({ params }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fecha: "",
    proveedorCarne: "",
    costoC: "",
    proveedorQueso: "",
    costoQ: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
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
        setFormData({
          fecha: data.fecha || "",
          proveedorCarne: data.proveedorCarne || "",
          costoC: data.costoC || "",
          proveedorQueso: data.proveedorQueso || "",
          costoQ: data.costoQ || "",
        });
      } catch {
        setErrors({ general: "Error al obtener los datos del proveedor." });
      }
    };
    fetchData();
  }, [bid]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const validationErrors = {};
    if (!formData.fecha.trim()) validationErrors.fecha = "La fecha es obligatoria.";
    if (!formData.proveedorCarne.trim()) validationErrors.proveedorCarne = "El proveedor de carne es obligatorio.";
    if (!formData.costoC.trim()) validationErrors.costoC = "El costo de carne es obligatorio.";
    if (!formData.proveedorQueso.trim()) validationErrors.proveedorQueso = "El proveedor de queso es obligatorio.";
    if (!formData.costoQ.trim()) validationErrors.costoQ = "El costo de queso es obligatorio.";
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitting(false);
      return;
    }
    try {
      const res = await updateProveedor(bid, formData);
      if (!res.success) {
        setErrors({ general: res.message || "Error al actualizar el proveedor." });
        setSubmitting(false);
        return;
      }
      router.push(`/proveedores?success=${encodeURIComponent(res.message)}`);
    } catch {
      setErrors({ general: "Error de conexión con el servidor." });
    } finally {
      setSubmitting(false);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };
  return (
    <div>
      <h1>Editar Proveedor</h1>
      <form className="crear-form" onSubmit={handleSubmit}>
        {[
          { label: "Fecha", name: "fecha" },
          { label: "Proveedor de Carne", name: "proveedorCarne" },
          { label: "Costo Carne", name: "costoC" },
          { label: "Proveedor de Queso", name: "proveedorQueso" },
          { label: "Costo Queso", name: "costoQ" },
        ].map((field) => (
          <div key={field.name}>
            <label>{field.label}:</label>
            <input
              type="text"
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              disabled={submitting}
            />
            {errors[field.name] && <div className="error-message">{errors[field.name]}</div>}
          </div>
        ))}
        <button type="submit" disabled={submitting}>
          {submitting ? "Enviando..." : "Enviar"}
        </button>
        {errors.general && <div className="error-message">{errors.general}</div>}
      </form>
    </div>
  );
}