import { useEffect, useState } from 'react';
import { CheckCircle, Clock, Trash2, AlertTriangle, ChefHat, ArrowRight } from 'lucide-react';
import { Pedido } from '../tipos';

interface PantallaCocinaProps {
  pedidos: Pedido[];
  completarPedido: (id: string) => void;
  entregarPedido: (id: string) => void;
  eliminarPedido: (id: string) => void;
}

export function PantallaCocina({ pedidos, completarPedido, entregarPedido, eliminarPedido }: PantallaCocinaProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  const getMinutos = (fechaIso: string) => Math.floor((new Date().getTime() - new Date(fechaIso).getTime()) / 60000);

  // Separamos los pedidos
  const pendientes = pedidos.filter(p => p.estado !== 'listo');
  const listos = pedidos.filter(p => p.estado === 'listo');

  if (pedidos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500 animate-in fade-in">
        <ChefHat className="w-24 h-24 mb-4 opacity-20" />
        <h2 className="text-2xl font-bold text-gray-400">Cocina al día</h2>
        <p>Sin pedidos activos</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)]">
      
      {/* === ZONA PRINCIPAL: PENDIENTES === */}
      <div className="flex-1 overflow-y-auto pr-2 pb-20 lg:pb-0">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-4 sticky top-0 bg-neutral-900 z-10 py-2">
          🔥 En Preparación 
          <span className="bg-orange-600 text-white text-sm px-3 py-1 rounded-full">{pendientes.length}</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {pendientes.length === 0 && (
             <div className="col-span-full py-10 text-center text-gray-500 border-2 border-dashed border-neutral-700 rounded-xl">
                 No hay nada en la parrilla...
             </div>
          )}
          
          {pendientes.map((pedido) => {
            const minutos = getMinutos(pedido.fecha);
            const esTarde = minutos > 15;

            return (
              <div key={pedido.id} className={`flex flex-col bg-neutral-800 border rounded-xl overflow-hidden shadow-xl transition-all ${esTarde ? 'border-red-500/50 shadow-red-900/10' : 'border-neutral-700'}`}>
                <div className={`p-3 flex justify-between items-center border-b ${esTarde ? 'bg-red-900/20 border-red-500/30' : 'bg-neutral-900/50 border-neutral-700'}`}>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xl text-white">#{pedido.numeroPedido}</span>
                    {esTarde && <AlertTriangle className="text-red-500 animate-pulse" size={18} />}
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${esTarde ? 'bg-red-500 text-white' : 'bg-neutral-700 text-gray-300'}`}>
                    <Clock size={12} /> {minutos}m
                  </div>
                </div>

                <div className="p-3 space-y-2 flex-1">
                    <p className="text-xs text-gray-400 uppercase font-bold">{pedido.cliente}</p>
                    {pedido.items.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-start text-sm">
                        <span className="text-green-400 font-bold">{item.cantidad}x</span>
                        <div className="flex-1">
                            <span className="text-gray-200">{item.producto.nombre}</span>
                            {item.tamaño && <span className="text-xs text-gray-500 ml-1">({item.tamaño})</span>}
                            {item.modificadores.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-0.5">
                                {item.modificadores.map((m, i) => (
                                    <span key={i} className={`text-[10px] px-1 rounded ${m.tipo === 'quitar' ? 'text-red-400 line-through bg-red-900/20' : 'text-yellow-400 bg-yellow-900/20'}`}>
                                    {m.nombre}
                                    </span>
                                ))}
                                </div>
                            )}
                        </div>
                    </div>
                    ))}
                    {pedido.notas && <div className="text-xs text-yellow-500 italic bg-yellow-900/10 p-1 rounded border border-yellow-900/30">⚠️ {pedido.notas}</div>}
                </div>

                <div className="p-2 bg-neutral-900/30 border-t border-neutral-700 flex gap-2">
                  <button onClick={() => eliminarPedido(pedido.id)} className="p-2 rounded bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={18} /></button>
                  <button onClick={() => completarPedido(pedido.id)} className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm transition-all shadow-lg shadow-green-900/20">
                    <CheckCircle size={18} /> LISTO
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* === ZONA LATERAL: LISTOS (HISTORIAL) === */}
      <div className="w-full lg:w-80 bg-neutral-800/50 border-t lg:border-t-0 lg:border-l border-neutral-700 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-300 flex items-center gap-2 mb-4 sticky top-0">
          ✅ Listos para Entrega
          <span className="bg-green-900 text-green-400 text-xs px-2 py-0.5 rounded-full border border-green-700">{listos.length}</span>
        </h2>
        
        <div className="space-y-3">
          {listos.length === 0 && (
             <p className="text-sm text-gray-600 italic text-center py-4">No hay pedidos esperando entrega.</p>
          )}

          {listos.map((pedido) => (
            <div key={pedido.id} className="bg-neutral-900 border border-green-900/50 rounded-lg p-3 opacity-80 hover:opacity-100 transition-opacity">
               <div className="flex justify-between items-center mb-2">
                   <span className="font-bold text-lg text-white line-through decoration-green-500 decoration-2">#{pedido.numeroPedido}</span>
                   <span className="text-xs text-gray-500">{new Date(pedido.fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
               </div>
               <p className="text-xs text-gray-400 mb-2 truncate">{pedido.cliente}</p>
               
               <button 
                onClick={() => entregarPedido(pedido.id)}
                className="w-full bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-gray-300 hover:text-white text-xs font-bold py-2 rounded flex items-center justify-center gap-2 transition-colors"
               >
                 Entregado <ArrowRight size={12}/>
               </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}