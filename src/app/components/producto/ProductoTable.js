"use client"; 
import BaseTable from "../shared/BaseTable";
export default function ProductoTable({ productos, sinPag ,onDelete, successMessage }) {
  const columns = [
    { key: "id", title: "ID" },
    { key: "fecha", title: "Fecha" },
    { key: "cliente", title: "Cliente" },
    { key: "producto", title: "Producto" },
    { key: "debe", title: "Debe" },
    { key: "abono", title: "Abono" },
    { key: "costoC", title: "CostoC" },
    { key: "costoP", title: "CostoP" },
  ];
  const actions = [
    {
      type: "link",
      label: "Mostrar",
      href: (item) => `/productos/${item.id}`,
    },
    {
      type: "button",
      label: "Eliminar",
      handler: onDelete,
    },
  ];
  return (
<BaseTable
  data={productos}
  sinPag={sinPag}
  columns={columns}
  actions={actions}
  successMessage={successMessage}
  storageKey="productosTable" 
/>
  );
}

