import { useState } from 'react';
import { Producto, Modificador } from '../tipos';
import { MODIFICADORES_DISPONIBLES } from '../datos/modificadores';
import { X } from 'lucide-react';
import { formatearDinero } from '../utilidades/formato';

interface PropsModalModificadores {
  producto: Producto;
  alConfirmar: (producto: Producto, modificadores: Modificador[], tamaño?: 'simple' | 'doble') => void;
  alCerrar: () => void;
}

export function ModalModificadores({ producto, alConfirmar, alCerrar }: PropsModalModificadores) {
  const [modificadoresSeleccionados, setModificadoresSeleccionados] = useState<Modificador[]>([]);
  const [tamañoSeleccionado, setTamañoSeleccionado] = useState<'simple' | 'doble' | null>(
    producto.tamaños ? null : 'simple' // Si no tiene tamaños, default a simple
  );

  // ========== FUNCIONES ==========

  // Agregar o quitar modificador
  const alternarModificador = (modificador: Modificador) => {
    const existe = modificadoresSeleccionados.some(m => m.nombre === modificador.nombre);
    if (existe) {
      setModificadoresSeleccionados(modificadoresSeleccionados.filter(m => m.nombre !== modificador.nombre));
    } else {
      setModificadoresSeleccionados([...modificadoresSeleccionados, modificador]);
    }
  };

  // Verificar si un modificador está seleccionado
  const estaSeleccionado = (nombreModificador: string) => {
    return modificadoresSeleccionados.some(m => m.nombre === nombreModificador);
  };

  // Confirmar y agregar al pedido
  const manejarConfirmacion = () => {
    // Para hamburguesas, el tamaño es obligatorio
    if (producto.tamaños && !tamañoSeleccionado) {
      alert('Por favor selecciona un tamaño');
      return;
    }
    alConfirmar(producto, modificadoresSeleccionados, tamañoSeleccionado || undefined);
  };

  // ========== RENDERIZADO ==========

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-brand">
      <div className="bg-card rounded-2xl max-w-2xl w-full shadow-2xl border border-border max-h-[90vh] overflow-y-auto">

        {/* Encabezado */}
        <div className="flex justify-between items-center p-6 border-b border-border sticky top-0 bg-card z-10">
          <div>
            <h3 className="text-2xl font-bold text-secondary">
              {producto.categoria === 'hamburguesa' ? 'Personaliza tu Hamburguesa' : 'Agregar al Pedido'}
            </h3>
            <p className="text-gray-300 mt-1 font-medium">{producto.nombre}</p>
          </div>
          <button
            onClick={alCerrar}
            className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">

          {/* Selección de Tamaño (solo para hamburguesas) */}
          {producto.tamaños && (
            <div className="mb-8">
              <h4 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                Selecciona el Tamaño <span className="text-destructive text-sm font-normal">(Requerido)</span>
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {/* Tamaño Simple */}
                <button
                  onClick={() => setTamañoSeleccionado('simple')}
                  className={`p-6 rounded-xl border-2 transition-all group ${tamañoSeleccionado === 'simple'
                      ? 'border-secondary bg-secondary/20 text-white shadow-lg shadow-secondary/10'
                      : 'border-border bg-background text-gray-400 hover:border-secondary/50'
                    }`}
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🍔</div>
                  <div className="font-bold text-lg">Simple</div>
                  <div className={`font-bold text-xl mt-1 ${tamañoSeleccionado === 'simple' ? 'text-secondary' : 'text-gray-500'}`}>
                    {formatearDinero(producto.tamaños.simple)}
                  </div>
                </button>

                {/* Tamaño Doble */}
                <button
                  onClick={() => setTamañoSeleccionado('doble')}
                  className={`p-6 rounded-xl border-2 transition-all group ${tamañoSeleccionado === 'doble'
                      ? 'border-secondary bg-secondary/20 text-white shadow-lg shadow-secondary/10'
                      : 'border-border bg-background text-gray-400 hover:border-secondary/50'
                    }`}
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🍔🍔</div>
                  <div className="font-bold text-lg">Doble</div>
                  <div className={`font-bold text-xl mt-1 ${tamañoSeleccionado === 'doble' ? 'text-secondary' : 'text-gray-500'}`}>
                    {formatearDinero(producto.tamaños.doble)}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Modificadores (solo para hamburguesas) */}
          {producto.categoria === 'hamburguesa' && (
            <>
              {/* Quitar Ingredientes */}
              <div className="mb-8">
                <h4 className="text-lg font-bold text-destructive mb-4">Quitar Ingredientes</h4>
                <div className="grid grid-cols-2 gap-3">
                  {MODIFICADORES_DISPONIBLES.quitar.map(modificador => (
                    <button
                      key={modificador.nombre}
                      onClick={() => alternarModificador(modificador)}
                      className={`p-4 rounded-xl border-2 transition-all font-semibold ${estaSeleccionado(modificador.nombre)
                          ? 'border-destructive bg-destructive text-white shadow-lg shadow-destructive/20'
                          : 'border-border bg-background text-gray-400 hover:border-destructive/50 hover:text-white'
                        }`}
                    >
                      {modificador.nombre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Agregar Extras */}
              <div>
                <h4 className="text-lg font-bold text-accent mb-4">Agregar Extras</h4>
                <div className="grid grid-cols-2 gap-3">
                  {MODIFICADORES_DISPONIBLES.agregar.map(modificador => (
                    <button
                      key={modificador.nombre}
                      onClick={() => alternarModificador(modificador)}
                      className={`p-4 rounded-xl border-2 transition-all flex justify-between items-center ${estaSeleccionado(modificador.nombre)
                          ? 'border-accent bg-accent text-background font-bold shadow-lg shadow-accent/20'
                          : 'border-border bg-background text-gray-400 hover:border-accent/50 hover:text-white'
                        }`}
                    >
                      <span>{modificador.nombre}</span>
                      <span className={estaSeleccionado(modificador.nombre) ? 'text-background' : 'text-accent'}>
                        +{formatearDinero(modificador.precio || 0)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Para productos sin modificadores (papas, nuggets) */}
          {producto.categoria !== 'hamburguesa' && (
            <div className="text-center py-8">
              <div className="text-7xl mb-6 drop-shadow-md animate-bounce">{producto.imagen}</div>
              <h3 className="text-3xl font-bold text-white mb-2">{producto.nombre}</h3>
              <p className="text-secondary text-4xl font-black">{formatearDinero(producto.precio)}</p>
            </div>
          )}
        </div>

        {/* Pie de Modal - Botones */}
        <div className="p-6 border-t border-border bg-background/50 flex gap-4 sticky bottom-0 backdrop-blur-md">
          <button
            onClick={alCerrar}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={manejarConfirmacion}
            className="flex-1 bg-primary hover:bg-[#3e8e41] text-primary-foreground font-bold py-4 px-6 rounded-xl transition-all shadow-lg active:scale-95"
          >
            Agregar al Pedido
          </button>
        </div>
      </div>
    </div>
  );
}