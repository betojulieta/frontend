// frontend/app/productos/page.js
import React, { Suspense } from "react";
import ProductosContent from "./ProductosContent";

export default function ProductosPage() {
  return (
    <Suspense fallback={<div>Cargando productos...</div>}>
      <ProductosContent />
    </Suspense>
  );
}
