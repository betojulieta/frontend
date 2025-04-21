import BaseTable from './BaseTable';
export default function DeletedTable({
  data,
  columns,
  onDelete,
  onRestore,
  emptyMessage = "No hay registros eliminados."
}) {
  const actions = [
    {
      type: 'button',
      label: 'Eliminar',
      handler: onDelete
    },
    {
      type: 'button',
      label: 'Restaurar',
      handler: onRestore
    }
  ];
  return (
    <BaseTable
      data={data}
      columns={columns}
      actions={actions}
      emptyMessage={emptyMessage}
    />
  );
}