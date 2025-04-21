"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchProductoById, updateProducto } from "@/services/productos";
export default function ProductsEdit(props) {
  const router = useRouter();
  const [bid, setBid] = useState(null);
  const [formData, setFormData] = useState({
    fecha: "",
    cliente: "",
    producto: "",
    debe: "",
    abono: "",
    costoC: "",
    costoP: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    const resolveParams = async () => {
      const p = await Promise.resolve(props.params); 
      setBid(p.bid);
    };

    resolveParams();
  }, [props.params]);
  useEffect(() => {
    if (!bid) return;
    const loadProducto = async () => {
      try {
        const data = await fetchProductoById(bid);
        setFormData(data);
      } catch {
        setErrors({ general: "Error al obtener los datos del producto." });
      }
    };
    loadProducto();
  }, [bid]);

  const handleChange = ({ target: { name, value } }) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  const validateForm = () => {
    const newErrors = {};
    const required = ["fecha", "cliente", "producto", "debe", "abono", "costoC", "costoP"];
    required.forEach(field => {
      if (!formData[field]?.toString().trim()) {
        newErrors[field] = `El campo '${field}' es obligatorio.`;
      }
    });
    return newErrors;
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
      const res = await updateProducto(bid, formData);
      if (!res.success) {
        setErrors({ general: res.message || "Error al actualizar el producto." });
      } else {
        router.push(`/productos?success=${encodeURIComponent(res.message)}`);
      }
    } catch {
      setErrors({ general: "Error de conexión con el servidor." });
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <h1>Editar Producto</h1>
      <form className="crear-form" onSubmit={handleSubmit}>
        {[
          { label: "Fecha", name: "fecha" },
          { label: "Cliente", name: "cliente" },
          { label: "Producto", name: "producto" },
          { label: "Debe", name: "debe" },
          { label: "Abono", name: "abono" },
          { label: "Costo C", name: "costoC" },
          { label: "Costo P", name: "costoP" },
        ].map(({ label, name }) => (
          <div key={name}>
            <label>{label}:</label>
            <input
              type="text"
              name={name}
              value={formData[name]}
              onChange={handleChange}
              disabled={submitting}
            />
            {errors[name] && <div className="error">{errors[name]}</div>}
          </div>
        ))}
        {errors.general && <div className="error general">{errors.general}</div>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </>
  );
}
