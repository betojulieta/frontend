import BaseTable from '../shared/BaseTable';
export default function ProveedorTable({ proveedores,sinPag,   onDelete, successMessage }) {
  const columns = [
    { key: "id", title: "ID" },
    { key: "fecha", title: "Fecha" },
    { key: "proveedorCarne", title: "ProvCarne" },
    { key: "costoC", title: "CostoC" },
    { key: "proveedorQueso", title: "ProvQueso" },
    { key: "costoQ", title: "CostoQ" }
  ];
  const actions = [
    {
      type: 'link',
      label: 'Mostrar',
      href: (item) => `/proveedores/${item.id}`
    },
    {
      type: 'button',
      label: 'Eliminar',
      handler: onDelete
    }
  ];
  return (
<BaseTable
  data={proveedores}
  sinPag={sinPag}
  columns={columns}
  actions={actions}
  successMessage={successMessage}
  storageKey="proveedoresTable" 
/>
  );
}