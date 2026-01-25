import { useState, useEffect } from 'react';
import { PedidoCocina } from '../tipos';
import { TarjetaPedidoCocina } from './TarjetaPedidoCocina';
import { servicioAlmacenamiento } from './almacenamiento'; // IMPORTADO

export function PantallaCocina() {
  const [pedidos, setPedidos] = useState<PedidoCocina[]>([]);

  // ========== CARGA DE DATOS (POLLING) ==========
  useEffect(() => {
    const cargarPedidos = () => {
      const pedidosGuardados = servicioAlmacenamiento.obtenerPedidos();

      // Actualizamos los minutos transcurridos en tiempo real
      const ahora = new Date().getTime();
      const pedidosActualizados = pedidosGuardados.map(p => {
        const diffMs = ahora - new Date(p.fecha).getTime();
        const minutos = Math.floor(diffMs / 60000); // Convertir ms a minutos
        return { ...p, minutosTranscurridos: minutos };
      });

      setPedidos(pedidosActualizados);
    };

    // 1. Cargar inmediatamente
    cargarPedidos();

    // 2. Recargar cada 5 segundos para ver nuevos pedidos
    const intervalo = setInterval(cargarPedidos, 5000);

    return () => clearInterval(intervalo);
  }, []);

  // ========== FUNCIONES ==========

  // Mover pedido a otro estado
  const moverPedido = (pedidoId: string, nuevoEstado: PedidoCocina['estado']) => {
    // Actualizar en BD local
    servicioAlmacenamiento.actualizarEstado(pedidoId, nuevoEstado);

    // Actualizar estado visual localmente (para feedback instantáneo)
    setPedidos(pedidos.map(pedido =>
      pedido.id === pedidoId ? { ...pedido, estado: nuevoEstado } : pedido
    ));
  };

  // Obtener pedidos por estado
  const obtenerPedidosPorEstado = (estado: PedidoCocina['estado']) => {
    return pedidos.filter(pedido => pedido.estado === estado);
  };

  // ========== RENDERIZADO ==========

  return (
    <div className="h-[calc(100vh-73px)] p-6 overflow-hidden">
      <div className="grid grid-cols-3 gap-6 h-full">

        {/* Columna: Pendientes */}
        <div className="flex flex-col">
          <div className="bg-[#1F2937] rounded-t-lg p-4 border-2 border-yellow-500">
            <h2 className="text-xl font-bold text-yellow-400 text-center flex items-center justify-center gap-2">
              <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
              Pendientes
              <span className="bg-yellow-500 text-black rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold ml-2">
                {obtenerPedidosPorEstado('pendiente').length}
              </span>
            </h2>
          </div>
          <div className="flex-1 bg-[#1F2937] bg-opacity-50 rounded-b-lg border-2 border-t-0 border-yellow-500 p-4 overflow-y-auto space-y-4">
            {obtenerPedidosPorEstado('pendiente').map(pedido => (
              <TarjetaPedidoCocina
                key={pedido.id}
                pedido={pedido}
                alMover={moverPedido}
              />
            ))}
            {obtenerPedidosPorEstado('pendiente').length === 0 && (
              <div className="text-center text-gray-500 mt-12">
                <p>No hay pedidos pendientes</p>
              </div>
            )}
          </div>
        </div>

        {/* Columna: En Preparación */}
        <div className="flex flex-col">
          <div className="bg-[#1F2937] rounded-t-lg p-4 border-2 border-orange-500">
            <h2 className="text-xl font-bold text-orange-400 text-center flex items-center justify-center gap-2">
              <span className="w-3 h-3 bg-orange-400 rounded-full"></span>
              En Preparación
              <span className="bg-orange-500 text-black rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold ml-2">
                {obtenerPedidosPorEstado('preparando').length}
              </span>
            </h2>
          </div>
          <div className="flex-1 bg-[#1F2937] bg-opacity-50 rounded-b-lg border-2 border-t-0 border-orange-500 p-4 overflow-y-auto space-y-4">
            {obtenerPedidosPorEstado('preparando').map(pedido => (
              <TarjetaPedidoCocina
                key={pedido.id}
                pedido={pedido}
                alMover={moverPedido}
              />
            ))}
            {obtenerPedidosPorEstado('preparando').length === 0 && (
              <div className="text-center text-gray-500 mt-12">
                <p>No hay pedidos en preparación</p>
              </div>
            )}
          </div>
        </div>

        {/* Columna: Listos */}
        <div className="flex flex-col">
          <div className="bg-[#1F2937] rounded-t-lg p-4 border-2 border-green-500">
            <h2 className="text-xl font-bold text-green-400 text-center flex items-center justify-center gap-2">
              <span className="w-3 h-3 bg-green-400 rounded-full"></span>
              Listos
              <span className="bg-green-500 text-black rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold ml-2">
                {obtenerPedidosPorEstado('listo').length}
              </span>
            </h2>
          </div>
          <div className="flex-1 bg-[#1F2937] bg-opacity-50 rounded-b-lg border-2 border-t-0 border-green-500 p-4 overflow-y-auto space-y-4">
            {obtenerPedidosPorEstado('listo').map(pedido => (
              <TarjetaPedidoCocina
                key={pedido.id}
                pedido={pedido}
                alMover={moverPedido}
              />
            ))}
            {obtenerPedidosPorEstado('listo').length === 0 && (
              <div className="text-center text-gray-500 mt-12">
                <p>No hay pedidos listos</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}