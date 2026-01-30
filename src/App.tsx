import { useState, useEffect } from 'react';
import { PantallaPOS } from './componentes/PantallaPOS';
import { PantallaCocina } from './componentes/PantallaCocina';
import { PantallaEstadisticas } from './componentes/PantallaEstadisticas';
import { LayoutDashboard, UtensilsCrossed, ShoppingCart } from 'lucide-react';
import { Pedido } from './tipos';
import { servicioAlmacenamiento } from './componentes/almacenamiento';

import logoMascota from './assets/COCOs-Mascota.png';

type Pantalla = 'pos' | 'cocina' | 'estadisticas';

export default function App() {
  const [pantallaActual, setPantallaActual] = useState<Pantalla>('pos');

  const [pedidos, setPedidos] = useState<Pedido[]>(() => {
    return servicioAlmacenamiento.obtenerPedidos();
  });

  useEffect(() => {
    servicioAlmacenamiento.guardarPedidos(pedidos);
  }, [pedidos]);

  // --- FUNCIONES ---

  const agregarPedido = (nuevoPedido: Pedido) => {
    const numero = servicioAlmacenamiento.obtenerSiguienteNumero();
    const pedidoNumerado = { ...nuevoPedido, numeroPedido: numero };
    setPedidos((prev) => [...prev, pedidoNumerado]);
  };

  // 1. COMPLETAR: Mueve de "Pendiente" a "Listo" (No borra)
  const completarPedido = (id: string) => {
    setPedidos((prev) => prev.map((p) =>
      p.id === id ? { ...p, estado: 'listo' } : p
    ));
  };

  // 2. ENTREGAR: Borra definitivamente (Cuando el cliente se lo lleva)
  const entregarPedido = (id: string) => {
    setPedidos((prev) => prev.filter((p) => p.id !== id));
  };

  // 3. ELIMINAR: Borra por error
  const eliminarPedido = (id: string) => {
    if (window.confirm('⚠️ ¿Seguro que quieres cancelar este pedido?')) {
      setPedidos((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 font-sans selection:bg-green-500 selection:text-white pb-24 md:pb-0">

      <nav className="bg-neutral-800 border-b border-neutral-700 px-4 py-3 sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setPantallaActual('pos')}>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-600 rounded-lg overflow-hidden border-2 border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.3)]">
              <img src={logoMascota} alt="CoCo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-black italic tracking-tighter text-white leading-none">
                CoCo's <span className="text-green-400">Burger</span>
              </h1>
            </div>
          </div>

          <div className="hidden md:flex gap-2">
            <BotonNavDesktop activo={pantallaActual === 'pos'} onClick={() => setPantallaActual('pos')} icon={<ShoppingCart size={18} />} label="Nuevo Pedido" />
            <BotonNavDesktop activo={pantallaActual === 'cocina'} onClick={() => setPantallaActual('cocina')} icon={<UtensilsCrossed size={18} />} label={`Cocina (${pedidos.filter(p => p.estado !== 'listo').length})`} />
            <BotonNavDesktop activo={pantallaActual === 'estadisticas'} onClick={() => setPantallaActual('estadisticas')} icon={<LayoutDashboard size={18} />} label="Caja" />
          </div>
        </div>
      </nav>

      <div className="md:hidden fixed bottom-4 left-4 right-4 bg-neutral-800/90 backdrop-blur-md border border-white/10 p-2 rounded-2xl shadow-2xl flex justify-around z-50">
        <BotonNavMovil activo={pantallaActual === 'pos'} onClick={() => setPantallaActual('pos')} icon={<ShoppingCart />} label="Pedido" />
        <BotonNavMovil activo={pantallaActual === 'cocina'} onClick={() => setPantallaActual('cocina')} icon={<UtensilsCrossed />} label="Cocina" badge={pedidos.filter(p => p.estado !== 'listo').length} />
        <BotonNavMovil activo={pantallaActual === 'estadisticas'} onClick={() => setPantallaActual('estadisticas')} icon={<LayoutDashboard />} label="Caja" />
      </div>

      <main className="max-w-[1920px] mx-auto p-2 md:p-6">
        {pantallaActual === 'pos' && <PantallaPOS agregarPedido={agregarPedido} />}

        {pantallaActual === 'cocina' && (
          <PantallaCocina
            pedidos={pedidos}
            completarPedido={completarPedido}
            entregarPedido={entregarPedido} // Nueva función
            eliminarPedido={eliminarPedido}
          />
        )}

        {/* AHORA PASAMOS LOS PEDIDOS COMO PROP PARA TIEMPO REAL */}
        {pantallaActual === 'estadisticas' && <PantallaEstadisticas pedidos={pedidos} />}
      </main>

    </div>
  );
}

function BotonNavDesktop({ activo, onClick, icon, label }: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${activo ? 'bg-green-600 text-white shadow-lg' : 'hover:bg-white/5 text-gray-400'}`}>
      {icon} <span>{label}</span>
    </button>
  );
}

function BotonNavMovil({ activo, onClick, icon, label, badge }: any) {
  return (
    <button onClick={onClick} className={`relative flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all ${activo ? 'bg-green-600 text-white -translate-y-2 shadow-lg shadow-green-600/30' : 'text-gray-400'}`}>
      {icon}
      <span className="text-[10px] font-bold mt-1">{label}</span>
      {badge > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">{badge}</span>}
    </button>
  );
}