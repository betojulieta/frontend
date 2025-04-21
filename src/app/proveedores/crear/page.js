"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
const ProveedorCrear = () => {
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
  const validateForm = () => {
    const validationErrors = {};
    if (!formData.fecha.trim()) validationErrors.fecha = "La fecha es obligatoria.";
    if (!formData.proveedorCarne.trim()) validationErrors.proveedorCarne = "El proveedor de carne es obligatorio.";
    if (!formData.costoC.trim()) validationErrors.costoC = "El costo de carne es obligatorio.";
    if (!formData.proveedorQueso.trim()) validationErrors.proveedorQueso = "El proveedor de queso es obligatorio.";
    if (!formData.costoQ.trim()) validationErrors.costoQ = "El costo de queso es obligatorio.";
    return validationErrors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitting(false);
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/suppliers/`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const data = await res.json(); 
        setErrors({});
        setFormData({ fecha: "", proveedorCarne: "", costoC: "", proveedorQueso: "", costoQ: "" }); 
        router.push(`/proveedores?success=${encodeURIComponent(data.message)}`);
      } else {
        const data = await res.json();
        const errorMessage = data.message || "Ocurrió un error al crear el proveedor.";
        setErrors({ general: errorMessage }); 
      }
    } catch (err) {
      setErrors({ general: "Error de conexión con el servidor." });
    } finally {
      setSubmitting(false);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };
  const formFields = [
    { label: "Fecha", name: "fecha" },
    { label: "Proveedor de Carne", name: "proveedorCarne" },
    { label: "Costo Carne", name: "costoC" },
    { label: "Proveedor de Queso", name: "proveedorQueso" },
    { label: "Costo Queso", name: "costoQ" },
  ];
  return (
    <div>
      <h1>Registrar Compra</h1>
      <form className="crear-form" onSubmit={handleSubmit}>
        {formFields.map((field) => (
          <div key={field.name}>
            <label>{field.label}:</label>
            <input
              type="text"
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              disabled={submitting}
            />
            {errors[field.name] && <div className="naranja">{errors[field.name]}</div>}
          </div>
        ))}
        <button type="submit" disabled={submitting}>
          {submitting ? "Enviando..." : "Enviar"}
        </button>
        {errors.general && <div className="error-message">{errors.general}</div>}
      </form>
      <br />
      <Link href="/proveedores">Volver a la lista de proveedores</Link>
    </div>
  );
};
export default ProveedorCrear;