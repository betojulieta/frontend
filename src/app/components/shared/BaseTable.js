"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function BaseTable({
  data = [],
  sinPag = [],
  columns: initialColumns = [],
  actions = [],
  successMessage,
  emptyMessage = "No hay registros disponibles.",
  storageKey,
}) {
  const [visibleMessage, setVisibleMessage] = useState(successMessage);
  const [columns, setColumns] = useState([]);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    try {
      const savedColumns = localStorage.getItem(`tableColumns_${storageKey}`);
      if (savedColumns) {
        const parsedColumns = JSON.parse(savedColumns);
        if (Array.isArray(parsedColumns)) {
          setColumns(parsedColumns);
          return;
        }
      }
    } catch (error) {
    
    }
    setColumns(initialColumns.map((col) => ({ ...col, visible: true })));
  }, [storageKey, initialColumns]);
  useEffect(() => {
    if (visibleMessage) {
      const timer = setTimeout(() => setVisibleMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [visibleMessage]);
  const toggleColumn = (key) => {
    setColumns((prevColumns) => {
      const updatedColumns = prevColumns.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      );
      localStorage.setItem(`tableColumns_${storageKey}`, JSON.stringify(updatedColumns));
      return updatedColumns;
    });
  };
  const resetColumns = () => {
    const defaultColumns = initialColumns.map((col) => ({ ...col, visible: true }));
    setColumns(defaultColumns);
    localStorage.setItem(`tableColumns_${storageKey}`, JSON.stringify(defaultColumns));
  };
  if (!isClient) return null;
  if (data.length === 0) {
    return <p className="empty-message">{emptyMessage}</p>;
  }
  const isProducto = Array.isArray(sinPag) && sinPag.some((item) => "debe" in item && "abono" in item);
  const isProveedor = Array.isArray(sinPag) && sinPag.some((item) => "costoQ" in item && "costoC" in item);
  const resumenDatos = {
    debe: sinPag.reduce((total, item) => total + (item.debe || 0), 0),
    abono: sinPag.reduce((total, item) => total + (item.abono || 0), 0),
    costoC: sinPag.reduce((total, item) => total + parseFloat(item.costoC || 0), 0),
    costoQ: sinPag.reduce((total, item) => total + parseFloat(item.costoQ || 0), 0),
  };
  resumenDatos.total = resumenDatos.costoC + resumenDatos.costoQ;
  return (
    <div className="table-responsive-container">
      {visibleMessage && <p className="success-message">{visibleMessage}</p>}
      <div className="column-controls">
        {columns.map((col) => (
          <label key={col.key} className="checkbox-label">
            <input
              type="checkbox"
              checked={col.visible ?? true}
              onChange={() => toggleColumn(col.key)}
              className="checkbox"
            />
            <span className="checkbox-custom"></span>
            <span className="column-title">{col.title}</span>
          </label>
        ))}
        <button onClick={resetColumns} className="reset-button">
          <span className="reset-icon">↻</span> Resetear
        </button>
      </div>
      <table className="custom-table">
        <thead>
          <tr>
            {columns.filter((col) => col.visible !== false).map((col) => (
              <th key={col.key} className="table-header">
                {col.title}
              </th>
            ))}
            {actions.map((_, index) => (
              <th key={`action-${index}`} className="table-header">
                Acción
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="table-row">
              {columns
                .filter((col) => col.visible !== false)
                .map((col) => (
                  <td key={`${item.id}-${col.key}`} className="table-cell">
                    {col.render ? col.render(item) : item[col.key]}
                  </td>
                ))}
              {actions.map((action, index) => (
                <td key={`${item.id}-action-${index}`} className="table-cell">
                  {action.type === "link" ? (
                    <button className="link-button">
                    <Link href={action.href(item)} className="link-button">
                      {action.label}
                    </Link>
                    </button>
                  ) : (
                    <button onClick={(e) => action.handler(e, item.id)} className="action-button">
                      {action.label}
                    </button>
                  )}
                </td>
              ))}
            </tr>
          ))}
          {(isProducto || isProveedor) && (
            <tr>
              {isProducto && (
                <>
                  <td colSpan={6} className="summary-cell">
                    {`Debe + Abono = ${resumenDatos.debe} + ${resumenDatos.abono}`}
                  </td>
                  <td colSpan={4} className="summary-cell">
                    {`CostoC = ${resumenDatos.costoC}`}
                  </td>
                </>
              )}
              {isProveedor && (
                <>
                  <td colSpan={8} className="summary-cell">
                    {`CostoC + CostoQ = ${resumenDatos.total}`}
                  </td>
                </>
              )}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}