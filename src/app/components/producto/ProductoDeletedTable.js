import DeletedTable from '../shared/DeletedTable';
export default function ProductoDeletedTable({ productos, onDelete, onRestore }) {
  const columns = [
    { key: "id", title: "ID" },
    { key: "fecha", title: "Fecha" },
    { key: "cliente", title: "Cliente" },
    { key: "producto", title: "Producto" },
    { key: "debe", title: "Debe" },
    { key: "abono", title: "Abono" },
    { key: "costoC", title: "CostoC" },
    { key: "costoP", title: "CostoP" }
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