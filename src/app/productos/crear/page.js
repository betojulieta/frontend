"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
const ProductsCrear = () => {
  const router = useRouter();
  const initialFormData = {
    fecha: "",
    cliente: "",
    producto: "",
    debe: "",
    abono: "",
    costoC: "",
    costoP: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({}); 
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({}); 
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitting(false);
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/productos/`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const data = await res.json(); 
        const successMessage = data.message || "Producto creado exitosamente."; 
        setFormData(initialFormData); 
        setErrors({});
        alert(successMessage); 
        return router.push(`/productos?success=${encodeURIComponent(successMessage)}`);
      }
      const data = await res.json();
      const errorMessage = data.message || "Ocurrió un error al crear el producto.";
      setErrors({ general: errorMessage }); 
    } catch (err) {
      setErrors({ general: "Error de conexión con el servidor." });
    } finally {
      setSubmitting(false);
    }
  };
  const validateForm = (fields) => {
    const errors = {};
    if (!fields.fecha.trim()) errors.fecha = "La fecha es obligatoria.";
    if (!fields.cliente.trim()) errors.cliente = "El cliente es obligatorio.";
    if (!fields.producto.trim()) errors.producto = "El producto es obligatorio.";
    if (!fields.debe.trim()) errors.debe = "El campo 'Debe' es obligatorio.";
    if (!fields.abono.trim()) errors.abono = "El campo 'Abono' es obligatorio.";
    if (!fields.costoC.trim()) errors.costoC = "El costoC es obligatorio.";
    if (!fields.costoP.trim()) errors.costoP = "El costoP es obligatorio.";
    return errors;
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
      <h1>Registrar venta</h1>
      <form className="crear-form" onSubmit={handleSubmit}>
        {Object.entries(formData).map(([fieldName, fieldValue]) => (
          <div key={fieldName} className="form-field">
            <label htmlFor={fieldName}>
              {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}:
            </label>
            <input
              type="text"
              id={fieldName}
              name={fieldName}
              value={fieldValue}
              onChange={handleChange}
              disabled={submitting}
            />
            {errors[fieldName] && <div className="naranja">{errors[fieldName]}</div>}
          </div>
        ))}
        <button type="submit" disabled={submitting}>
          {submitting ? "Enviando..." : "Enviar"}
        </button>

        {errors.general && (
          <span style={{ color: "red", display: "block", marginTop: "10px" }}>
            {errors.general}
          </span>
        )}
      </form>
      <br />
      <Link href="/productos">Volver a la lista de productos</Link>
    </div>
  );
};

export default ProductsCrear;