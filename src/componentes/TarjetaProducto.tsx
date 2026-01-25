import { Producto } from '../tipos';
import { Plus } from 'lucide-react';
import { formatearDinero } from '../utilidades/formato';

interface PropsTarjetaProducto {
  producto: Producto;
  alAgregar: (producto: Producto) => void;
}

export function TarjetaProducto({ producto, alAgregar }: PropsTarjetaProducto) {
  return (
    <div className="bg-card rounded-xl p-4 shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all hover:scale-105 border border-border group h-full flex flex-col justify-between">

      {/* Información del Producto */}
      <div className="text-center mb-3">
        <div className="text-5xl mb-2 drop-shadow-md">{producto.imagen}</div>
        <h3 className="font-brand font-bold text-lg text-card-foreground mb-1 tracking-wide leading-tight">
          {producto.nombre}
        </h3>

        {/* Precios */}
        {producto.tamaños ? (
          <div className="text-sm space-y-1 mt-2">
            <p className="text-muted-foreground font-medium flex justify-center gap-2">
              <span>Simple:</span>
              <span className="text-secondary font-bold text-base">{formatearDinero(producto.tamaños.simple)}</span>
            </p>
            <p className="text-muted-foreground font-medium flex justify-center gap-2">
              <span>Doble:</span>
              <span className="text-secondary font-bold text-base">{formatearDinero(producto.tamaños.doble)}</span>
            </p>
          </div>
        ) : (
          <p className="text-secondary text-xl font-bold mt-2">{formatearDinero(producto.precio)}</p>
        )}
      </div>

      {/* Botón Agregar */}
      <button
        onClick={() => alAgregar(producto)}
        className="w-full bg-primary hover:bg-[#3e8e41] text-primary-foreground font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 mt-auto"
      >
        <Plus className="w-5 h-5" />
        Agregar
      </button>
    </div>
  );
}