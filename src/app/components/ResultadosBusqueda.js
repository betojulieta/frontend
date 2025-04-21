import Link from "next/link";
const ResultadosBusqueda = ({ resultados, onDelete}) => {
  if (!resultados || resultados.length === 0) {
    return <p>No se encontraron resultados.</p>;
  }
 let debe=0;
 let abono=0;
 let costoC=0;
   resultados.forEach(element => {
           debe+=element.debe;
           abono+=element.abono;
           costoC+=element.costoC*1;     
   });
  return (
    <div className="table-responsive-container">
      <h2>Resultados:</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Producto</th>
            <th>Debe</th>
            <th>Abono</th>
            <th>CostoC</th>
            <th>CostoP</th>
            <th>Acción</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {resultados.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.id}</td>
              <td>{producto.fecha}</td>
              <td>{producto.cliente}</td>
              <td>{producto.producto}</td>
              <td>{producto.debe}</td>
              <td>{producto.abono}</td>
              <td>{producto.costoC}</td>
              <td>{producto.costoP}</td>
              <td>
                <button>
                  <Link href={`/productos/${producto.id}`}>Mostrar</Link>
                </button>
              </td>
              <td>
                <button onClick={(e) => onDelete(e, producto.id)}>Eliminar</button>
              </td>  
            </tr>
          ))}   
             <tr>
               <td colSpan={6}>
                <div className="con-td1">
                   <span  className="sp-1">{debe+abono}</span>
                   <span  className="sp-2">=</span> 
                   <span  className="sp-3">{debe} </span> 
                   <span  className="sp-4">+ </span>
                   <span  className="sp-5">{abono}</span> 
                </div>
               </td>
               <td colSpan={4} >
                 <div className="con-td2">
                  <span className="sp-a">{costoC}</span>
                  <span className="sp-b">-</span>
                  <span className="sp-c">{debe+abono}</span>
                  <span className="sp-d">=</span>
                  <span className="sp-e">{(debe+abono)-costoC}</span>
                 </div>
               </td>
             </tr>      
        </tbody>
      </table>
    </div>
  );
};
export default ResultadosBusqueda;