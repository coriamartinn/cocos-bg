import { ItemPedido } from '../tipos';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { formatearDinero } from '../utilidades/formato';

interface PropsBarraLateralPedido {
  itemsPedido: ItemPedido[];
  alEliminarItem: (itemId: string) => void;
  alActualizarCantidad: (itemId: string, cambio: number) => void;
  alConfirmar: () => void;
}

export function BarraLateralPedido({
  itemsPedido,
  alEliminarItem,
  alActualizarCantidad,
  alConfirmar
}: PropsBarraLateralPedido) {

  const subtotal = itemsPedido.reduce((suma, item) => {
    let precioItem = item.producto.precio;
    if (item.producto.tamaños && item.tamaño) {
      precioItem = item.producto.tamaños[item.tamaño];
    }
    const precioModificadores = item.modificadores.reduce(
      (sumaMod, mod) => sumaMod + (mod.precio || 0),
      0
    );
    return suma + (precioItem + precioModificadores) * item.cantidad;
  }, 0);

  // En Argentina a veces el precio ya incluye IVA, si quieres mostrarlo desglosado:
  const total = subtotal;
  // O si agregas impuestos aparte: const total = subtotal * 1.21;

  return (
    <div className="w-[30%] bg-[#121212] border-l border-border flex flex-col font-brand shadow-2xl z-40 h-full">
      {/* Encabezado */}
      <div className="p-6 border-b border-border bg-card">
        <h2 className="text-2xl font-bold text-secondary flex items-center gap-2">
          <ShoppingBag className="w-6 h-6" />
          Pedido Actual
        </h2>
      </div>

      {/* Lista de Items */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {itemsPedido.length === 0 ? (
          <div className="text-center text-gray-500 mt-20 flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 opacity-50 text-gray-400" />
            </div>
            <p className="text-lg font-bold">Tu carrito está vacío</p>
            <p className="text-sm">¡Agrega algo delicioso!</p>
          </div>
        ) : (
          itemsPedido.map(item => (
            <div key={item.id} className="bg-card rounded-xl p-4 border border-border shadow-sm group hover:border-primary/40 transition-colors">
              {/* Header Item */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 pr-2">
                  <h4 className="font-bold text-white text-lg leading-tight">
                    {item.producto.nombre}
                    {item.tamaño && (
                      <span className="ml-2 text-secondary text-sm font-normal bg-secondary/10 px-2 py-0.5 rounded-md">
                        {item.tamaño === 'simple' ? 'Simple' : 'Doble'}
                      </span>
                    )}
                  </h4>
                  <p className="text-primary font-bold mt-1">
                    {formatearDinero(
                      item.producto.tamaños && item.tamaño
                        ? item.producto.tamaños[item.tamaño]
                        : item.producto.precio
                    )}
                  </p>
                </div>

                <button
                  onClick={() => alEliminarItem(item.id)}
                  className="text-gray-500 hover:text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Modificadores */}
              {item.modificadores.length > 0 && (
                <div className="text-xs text-gray-400 mb-3 pl-3 border-l-2 border-gray-700 space-y-1">
                  {item.modificadores.map((mod, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>• {mod.nombre}</span>
                      {mod.precio && (
                        <span className="text-accent font-bold">+{formatearDinero(mod.precio)}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Controles */}
              <div className="flex items-center justify-between bg-black/20 rounded-lg p-1">
                <button
                  onClick={() => alActualizarCantidad(item.id, -1)}
                  className="p-2 hover:text-white text-gray-400 hover:bg-white/10 rounded-md transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-white w-8 text-center">{item.cantidad}</span>
                <button
                  onClick={() => alActualizarCantidad(item.id, 1)}
                  className="p-2 hover:text-primary text-gray-400 hover:bg-primary/10 rounded-md transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Total */}
      <div className="p-6 border-t border-border bg-card shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-2xl font-black text-secondary">
            <span>Total</span>
            <span>{formatearDinero(total)}</span>
          </div>
        </div>

        <button
          onClick={alConfirmar}
          disabled={itemsPedido.length === 0}
          className="w-full bg-primary hover:bg-[#3e8e41] disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-primary-foreground font-black py-4 px-6 rounded-xl text-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
        >
          <span>Confirmar Pedido</span>
        </button>
      </div>
    </div>
  );
}