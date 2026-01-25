import { PedidoCocina } from '../tipos';
import { Clock, ChevronRight, Check } from 'lucide-react';

interface PropsTarjetaPedidoCocina {
  pedido: PedidoCocina;
  alMover: (pedidoId: string, nuevoEstado: PedidoCocina['estado']) => void;
}

export function TarjetaPedidoCocina({ pedido, alMover }: PropsTarjetaPedidoCocina) {

  // Determinar el siguiente estado
  const obtenerSiguienteEstado = (): PedidoCocina['estado'] | null => {
    if (pedido.estado === 'pendiente') return 'preparando';
    if (pedido.estado === 'preparando') return 'listo';
    return null;
  };

  const siguienteEstado = obtenerSiguienteEstado();

  return (
    <div className="bg-card rounded-xl p-4 border border-border shadow-lg transition-all hover:shadow-xl hover:border-primary/30">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-3 pb-3 border-b border-border">
        <div>
          <h3 className="text-2xl font-brand font-bold text-secondary tracking-wide">
            #{pedido.numeroPedido}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <Clock className="w-4 h-4" />
          <span className="font-mono font-semibold text-sm">
            {pedido.minutosTranscurridos} min
          </span>
        </div>
      </div>

      {/* Items del Pedido */}
      <div className="space-y-3 mb-4">
        {pedido.items.map(item => (
          <div key={item.id} className="text-sm">
            <div className="flex items-start gap-2 text-white">
              <span className="font-brand font-bold text-secondary text-lg leading-none mt-0.5">
                {item.cantidad}x
              </span>
              <div className="font-semibold leading-snug">
                {item.producto.nombre}
                {item.tamaño && (
                  <span className="ml-1 text-gray-400 text-xs font-normal">
                    ({item.tamaño === 'simple' ? 'Simple' : 'Doble'})
                  </span>
                )}
              </div>
            </div>

            {/* Modificadores - resaltados */}
            {item.modificadores.length > 0 && (
              <div className="ml-7 mt-1 space-y-1">
                {item.modificadores.map((mod, idx) => (
                  <div
                    key={idx}
                    className={`text-xs font-bold flex items-center gap-1 ${mod.tipo === 'quitar' ? 'text-destructive' : 'text-accent'
                      }`}
                  >
                    <span>{mod.tipo === 'quitar' ? '🚫' : '➕'}</span>
                    <span>{mod.nombre}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Botón de Acción */}
      {siguienteEstado && (
        <button
          onClick={() => alMover(pedido.id, siguienteEstado)}
          className={`w-full font-brand font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${pedido.estado === 'pendiente'
            ? 'bg-secondary hover:bg-yellow-500 text-secondary-foreground' // Botón Mostaza para iniciar
            : pedido.estado === 'preparando'
              ? 'bg-primary hover:bg-[#3e8e41] text-primary-foreground' // Botón Verde para finalizar
              : 'bg-gray-700 text-gray-400'
            }`}
        >
          {pedido.estado === 'pendiente' && (
            <>
              Empezar a Cocinar
              <ChevronRight className="w-5 h-5" />
            </>
          )}
          {pedido.estado === 'preparando' && (
            <>
              Marcar Listo
              <Check className="w-5 h-5" />
            </>
          )}
        </button>
      )}

      {/* Estado Final */}
      {pedido.estado === 'listo' && (
        <div className="text-center bg-primary/20 text-primary font-bold py-2 rounded-xl flex items-center justify-center gap-2 border border-primary/20">
          <Check className="w-5 h-5" />
          Listo para Entrega
        </div>
      )}
    </div>
  );
}