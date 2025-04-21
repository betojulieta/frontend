import DeletedTable from '../shared/DeletedTable';
export default function ProveedorDeletedTable({ productos, onDelete, onRestore }) {
  const columns = [
    { key: "id", title: "ID" },
    { key: "fecha", title: "Fecha" },
    { key: "proveedorCarne", title: "ProveedorCarne" },
    { key: "costoC", title: "CostoC" },
    { key: "proveedorQueso", title: "ProveedorQueso" },
    { key: "costoQ", title: "CostoQ" }
  ];
  return (
    <DeletedTable
      data={productos}
      columns={columns}
      onDelete={onDelete}
      onRestore={onRestore}
    />
  );
}