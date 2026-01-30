import { useState } from 'react';
import { Search, Trash2, CreditCard, Banknote, Smartphone, ChefHat, X, Plus, Minus } from 'lucide-react';
import { PRODUCTOS } from '../datos/productos';
import { MODIFICADORES_DISPONIBLES } from '../datos/modificadores';
import { Producto, ItemPedido, Pedido, Modificador } from '../tipos';

interface PantallaPOSProps {
  agregarPedido: (pedido: Pedido) => void;
}

export function PantallaPOS({ agregarPedido }: PantallaPOSProps) {
  const [carrito, setCarrito] = useState<ItemPedido[]>([]);
  const [cliente, setCliente] = useState('');
  const [notaCocina, setNotaCocina] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todos');

  // Modal
  const [productoAEditar, setProductoAEditar] = useState<Producto | null>(null);
  const [modsSeleccionados, setModsSeleccionados] = useState<Modificador[]>([]);
  const [tamañoSeleccionado, setTamañoSeleccionado] = useState<'simple' | 'doble'>('simple');

  // --- LÓGICA ---

  const abrirModalProducto = (prod: Producto) => {
    setProductoAEditar(prod);
    setModsSeleccionados([]);
    setTamañoSeleccionado('simple');
  };

  const confirmarAgregar = () => {
    if (!productoAEditar) return;

    let precioBase = productoAEditar.precio;
    if (productoAEditar.tamaños) {
      precioBase = productoAEditar.tamaños[tamañoSeleccionado];
    }

    const costoExtras = modsSeleccionados.reduce((acc, mod) => acc + (mod.precio || 0), 0);
    const precioUnitario = precioBase + costoExtras;

    const nuevoItem: ItemPedido = {
      producto: productoAEditar,
      cantidad: 1,
      tamaño: productoAEditar.tamaños ? tamañoSeleccionado : undefined,
      modificadores: modsSeleccionados,
      precioUnitario: precioUnitario,
      subtotal: precioUnitario
    };

    setCarrito([...carrito, nuevoItem]);
    setProductoAEditar(null);
  };

  const quitarDelCarrito = (index: number) => {
    const nuevo = [...carrito];
    nuevo.splice(index, 1);
    setCarrito(nuevo);
  };

  const total = carrito.reduce((acc, item) => acc + item.subtotal, 0);

  const procesarPago = (metodo: 'efectivo' | 'tarjeta' | 'transferencia') => {
    if (carrito.length === 0) return alert('Carrito vacío');

    const nuevoPedido: Pedido = {
      id: Date.now().toString(),
      fecha: new Date().toISOString(),
      cliente: cliente || 'Consumidor Final',
      items: carrito,
      total: total,
      estado: 'pendiente',
      notas: notaCocina,
      metodoPago: metodo
    };

    agregarPedido(nuevoPedido);
    setCarrito([]);
    setCliente('');
    setNotaCocina('');
  };

  // --- RENDER ---
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)] lg:h-[calc(100vh-100px)]">

      {/* IZQUIERDA: CATÁLOGO */}
      <div className="lg:col-span-2 flex flex-col h-full overflow-hidden relative">

        {/* === FILTROS (STICKY PARA MOVIL) === 
            Ahora se queda pegado arriba (sticky) y tiene fondo para que no se pierda
        */}
        <div className="sticky top-0 z-20 bg-neutral-900/95 backdrop-blur-sm py-3 -mx-2 px-2 border-b border-neutral-800 lg:static lg:bg-transparent lg:border-0 lg:p-0 lg:m-0 lg:mb-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {['todos', 'hamburguesa', 'acompañamiento', 'nuggets', 'bebida'].map(cat => (
              <button
                key={cat}
                onClick={() => setFiltroCategoria(cat)}
                className={`flex-none px-5 py-2 rounded-full font-bold capitalize whitespace-nowrap transition-all border text-sm ${filtroCategoria === cat
                    ? 'bg-green-600 text-white border-green-500 shadow-md shadow-green-900/40 scale-105'
                    : 'bg-neutral-800 text-gray-400 border-neutral-700 hover:bg-neutral-700'
                  }`}
              >
                {cat === 'todos' ? '🔥 Todo' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grilla Productos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 overflow-y-auto pr-1 pb-32 lg:pb-0 pt-2">
          {PRODUCTOS.filter(p => filtroCategoria === 'todos' || p.categoria === filtroCategoria).map(prod => (
            <div
              key={prod.id}
              onClick={() => abrirModalProducto(prod)}
              className="bg-neutral-800 border border-neutral-700 rounded-xl p-3 cursor-pointer hover:border-green-500 hover:shadow-lg hover:shadow-green-500/10 transition-all active:scale-95 group flex flex-col justify-between h-full"
            >
              <div className="text-5xl mb-3 self-center group-hover:scale-110 transition-transform drop-shadow-lg">{prod.imagen}</div>
              <div>
                <h3 className="font-bold text-gray-200 text-sm leading-tight mb-1 line-clamp-2">{prod.nombre}</h3>
                <p className="text-green-400 font-black text-lg">
                  ${(prod.tamaños ? prod.tamaños.simple : prod.precio).toLocaleString()}
                </p>
              </div>
            </div>
          ))}

          {/* Espaciador final para que el último producto no quede tapado por el carrito móvil */}
          <div className="h-20 w-full col-span-full lg:hidden"></div>
        </div>
      </div>

      {/* DERECHA: CARRITO (Fijo abajo en móvil, columna en PC) */}
      <div className="fixed bottom-0 left-0 right-0 lg:static bg-neutral-800 border-t lg:border border-neutral-700 lg:rounded-xl h-auto lg:h-full flex flex-col z-40 shadow-[0_-5px_30px_rgba(0,0,0,0.8)] lg:shadow-none">

        {/* Input Cliente Desktop */}
        <div className="p-3 border-b border-neutral-700 bg-neutral-900/50 hidden lg:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Nombre del Cliente..."
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-green-500 text-sm"
              value={cliente}
              onChange={e => setCliente(e.target.value)}
            />
          </div>
        </div>

        {/* Lista Items */}
        <div className="hidden lg:block flex-1 overflow-y-auto p-3 space-y-2">
          {carrito.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-gray-600 gap-2 opacity-50">
              <ChefHat size={40} strokeWidth={1.5} />
              <p className="text-sm font-medium">Carrito vacío</p>
            </div>
          )}
          {carrito.map((item, idx) => (
            <div key={idx} className="flex justify-between items-start p-2 bg-neutral-900/50 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-green-400 text-sm">{item.cantidad}x</span>
                  <span className="text-gray-200 text-sm font-bold">{item.producto.nombre}</span>
                </div>
                {item.tamaño && <span className="text-xs text-gray-500 capitalize ml-6">{item.tamaño}</span>}
                {item.modificadores.length > 0 && (
                  <div className="ml-6 flex flex-wrap gap-1 mt-1">
                    {item.modificadores.map((m, i) => (
                      <span key={i} className={`text-[10px] px-1 rounded border ${m.tipo === 'agregar' ? 'text-green-400 bg-green-900/10 border-green-900/30' : 'text-red-400 bg-red-900/10 border-red-900/30 line-through'}`}>
                        {m.nombre}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-white text-sm font-bold">${item.subtotal.toLocaleString()}</span>
                <button onClick={() => quitarDelCarrito(idx)} className="text-gray-600 hover:text-red-500 p-1"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Checkout (Siempre visible en movil) */}
        <div className="p-3 bg-neutral-900 lg:bg-transparent mt-auto space-y-3 pb-6 lg:pb-3">
          {/* Input Cliente Móvil */}
          <div className="lg:hidden flex gap-2">
            <input
              type="text"
              placeholder="Cliente..."
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-green-500 focus:outline-none"
              value={cliente}
              onChange={e => setCliente(e.target.value)}
            />
            <div className="flex items-center bg-neutral-800 px-3 rounded-lg border border-neutral-700 min-w-[80px] justify-center">
              <span className="text-green-400 font-black text-sm">${total.toLocaleString()}</span>
            </div>
          </div>

          <input
            type="text"
            placeholder="Nota cocina (ej: Sin sal)..."
            className="w-full bg-transparent border-b border-neutral-700 text-sm px-0 py-1 focus:outline-none focus:border-green-500 text-gray-300 placeholder:text-gray-600"
            value={notaCocina}
            onChange={e => setNotaCocina(e.target.value)}
          />

          <div className="hidden lg:flex justify-between items-end">
            <span className="text-gray-400 text-sm font-bold">TOTAL A PAGAR</span>
            <span className="text-3xl font-black text-green-400 tracking-tighter">${total.toLocaleString()}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <BotonPago icon={<Banknote size={20} />} label="Efectivo" onClick={() => procesarPago('efectivo')} disabled={carrito.length === 0} />
            <BotonPago icon={<CreditCard size={20} />} label="Tarjeta" onClick={() => procesarPago('tarjeta')} disabled={carrito.length === 0} />
            <BotonPago icon={<Smartphone size={20} />} label="Alias" onClick={() => procesarPago('transferencia')} disabled={carrito.length === 0} />
          </div>
        </div>
      </div>

      {/* MODAL */}
      {productoAEditar && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-700 w-full max-w-md rounded-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200 shadow-2xl">
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-800/50">
              <h2 className="text-xl font-bold text-white flex gap-3 items-center">
                <span className="text-3xl">{productoAEditar.imagen}</span>
                <div className="flex flex-col">
                  <span>{productoAEditar.nombre}</span>
                  <span className="text-xs text-green-400 font-normal">
                    Base: ${(productoAEditar.tamaños ? productoAEditar.tamaños[tamañoSeleccionado] : productoAEditar.precio).toLocaleString()}
                  </span>
                </div>
              </h2>
              <button onClick={() => setProductoAEditar(null)} className="p-2 bg-neutral-800 rounded-full text-gray-400 hover:text-white"><X size={20} /></button>
            </div>

            <div className="p-5 overflow-y-auto space-y-6">
              {productoAEditar.tamaños && (
                <div className="flex bg-neutral-800 p-1.5 rounded-xl border border-neutral-700">
                  {(['simple', 'doble'] as const).map(t => (
                    <button key={t} onClick={() => setTamañoSeleccionado(t)} className={`flex-1 py-2.5 rounded-lg text-sm font-bold capitalize transition-all ${tamañoSeleccionado === t ? 'bg-neutral-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              )}

              <div>
                <h4 className="font-bold text-gray-200 text-xs uppercase mb-3 flex justify-between">
                  Extras <span className="text-gray-500 font-normal">Opcional</span>
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {MODIFICADORES_DISPONIBLES.agregar.map(mod => {
                    const active = modsSeleccionados.some(m => m.nombre === mod.nombre);
                    return (
                      <button key={mod.nombre} onClick={() => active ? setModsSeleccionados(prev => prev.filter(m => m.nombre !== mod.nombre)) : setModsSeleccionados(prev => [...prev, mod])}
                        className={`p-3 rounded-xl border text-sm text-left transition-all ${active ? 'bg-green-900/20 border-green-500 text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.1)]' : 'bg-neutral-800 border-neutral-700 text-gray-400 hover:bg-neutral-750'}`}>
                        <div className="flex justify-between w-full">
                          <span>{mod.nombre}</span>
                          <span className="opacity-60 text-xs">+${mod.precio}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-200 text-xs uppercase mb-3 flex justify-between">
                  Quitar <span className="text-gray-500 font-normal">Tocar para eliminar</span>
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {MODIFICADORES_DISPONIBLES.quitar.map(mod => {
                    const active = modsSeleccionados.some(m => m.nombre === mod.nombre);
                    return (
                      <button key={mod.nombre} onClick={() => active ? setModsSeleccionados(prev => prev.filter(m => m.nombre !== mod.nombre)) : setModsSeleccionados(prev => [...prev, mod])}
                        className={`p-2 rounded-lg border text-sm text-center transition-all ${active ? 'bg-red-900/20 border-red-500 text-red-400 line-through' : 'bg-neutral-800 border-neutral-700 text-gray-400 hover:bg-neutral-750'}`}>
                        Sin {mod.nombre}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-neutral-800 bg-neutral-900">
              <button onClick={confirmarAgregar} className="w-full bg-green-600 py-4 rounded-xl font-black text-white hover:bg-green-500 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-green-900/20 text-lg tracking-wide">
                AGREGAR AL PEDIDO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BotonPago({ icon, label, onClick, disabled }: any) {
  return (
    <button onClick={onClick} disabled={disabled} className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all active:scale-95 ${disabled ? 'opacity-30 border-neutral-800 bg-neutral-900 cursor-not-allowed' : 'border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-white hover:border-gray-500'}`}>
      {icon} <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">{label}</span>
    </button>
  )
}