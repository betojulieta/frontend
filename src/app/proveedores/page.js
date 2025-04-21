import { Suspense } from "react";
import ProveedoresContent from "./ProveedoresContent";

export default function ProveedoresPage() {
  return (
    <Suspense fallback={<div>Cargando proveedores...</div>}>
      <ProveedoresContent />
    </Suspense>
  );
}
