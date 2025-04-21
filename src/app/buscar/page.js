'use client';

import React, { Suspense } from 'react';
import Buscar from './BuscarContent';

export default function BuscarPage() {
  return (
    <Suspense fallback={<p>Cargando búsqueda...</p>}>
      <Buscar />
    </Suspense>
  );
}
