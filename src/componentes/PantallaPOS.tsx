import { useState } from 'react';
import { TarjetaProducto } from './TarjetaProducto';
import { BarraLateralPedido } from './BarraLateralPedido';
import { ModalModificadores } from './ModalModificadores';
import { Producto, ItemPedido, Modificador } from '../tipos';
import { PRODUCTOS } from '../datos/productos';
import { servicioAlmacenamiento } from './almacenamiento'; // Ruta corregida

export function PantallaPOS() {
  const [itemsPedido, setItemsPedido] = useState<ItemPedido[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  // ========== FUNCIONES ==========
  const manejarAgregarProducto = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setMostrarModal(true);
  };

  const agregarAlPedido = (producto: Producto, modificadores: Modificador[], tamaño?: 'simple' | 'doble') => {
    const nuevoItem: ItemPedido = {
      id: Date.now().toString(),
      producto,
      tamaño,
      modificadores,
      cantidad: 1,
    };
    setItemsPedido([...itemsPedido, nuevoItem]);
    setMostrarModal(false);
    setProductoSeleccionado(null);
  };

  const eliminarItem = (itemId: string) => {
    setItemsPedido(itemsPedido.filter(item => item.id !== itemId));
  };

  const actualizarCantidad = (itemId: string, cambio: number) => {
    setItemsPedido(itemsPedido.map(item => {
      if (item.id === itemId) {
        const nuevaCantidad = Math.max(1, item.cantidad + cambio);
        return { ...item, cantidad: nuevaCantidad };
      }
      return item;
    }));
  };

  const confirmarPedido = () => {
    if (itemsPedido.length === 0) return;

    // Calcular total
    const total = itemsPedido.reduce((suma, item) => {
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

    // Crear objeto
    const nuevoPedido = {
      id: Date.now().toString(),
      numeroPedido: 0, // El servicio asignará el ID real
      items: itemsPedido,
      estado: 'pendiente' as const,
      fecha: new Date(),
      minutosTranscurridos: 0,
      total: total * 1.08,
    };

    // Guardar
    const numeroAsignado = servicioAlmacenamiento.guardarPedido(nuevoPedido);

    alert(`✅ Pedido #${numeroAsignado} confirmado\nEnviado a cocina.`);
    setItemsPedido([]);
  };

  // ========== RENDERIZADO ==========
  return (
    <div className="flex h-[calc(100vh-73px)]">
      {/* Lado Izquierdo - Catálogo */}
      <div className="w-[70%] p-6 overflow-y-auto scrollbar-hide">

        {/* Hamburguesas */}
        <div className="mb-10">
          <h2 className="text-3xl font-brand font-bold mb-6 text-primary drop-shadow-sm flex items-center gap-2">
            🍔 Hamburguesas
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {PRODUCTOS.filter(p => p.categoria === 'hamburguesa').map(producto => (
              <TarjetaProducto key={producto.id} producto={producto} alAgregar={manejarAgregarProducto} />
            ))}
          </div>
        </div>

        {/* Acompañamientos */}
        <div className="mb-10">
          <h2 className="text-3xl font-brand font-bold mb-6 text-primary drop-shadow-sm flex items-center gap-2">
            🍟 Papas y Acompañamientos
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {PRODUCTOS.filter(p => p.categoria === 'acompañamiento').map(producto => (
              <TarjetaProducto key={producto.id} producto={producto} alAgregar={manejarAgregarProducto} />
            ))}
          </div>
        </div>

        {/* Nuggets */}
        <div className="mb-10">
          <h2 className="text-3xl font-brand font-bold mb-6 text-primary drop-shadow-sm flex items-center gap-2">
            🍗 Nuggets
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {PRODUCTOS.filter(p => p.categoria === 'nuggets').map(producto => (
              <TarjetaProducto key={producto.id} producto={producto} alAgregar={manejarAgregarProducto} />
            ))}
          </div>
        </div>
      </div>

      {/* Lado Derecho - Barra Lateral */}
      <BarraLateralPedido
        itemsPedido={itemsPedido}
        alEliminarItem={eliminarItem}
        alActualizarCantidad={actualizarCantidad}
        alConfirmar={confirmarPedido}
      />

      {/* Modal */}
      {mostrarModal && productoSeleccionado && (
        <ModalModificadores
          producto={productoSeleccionado}
          alConfirmar={agregarAlPedido}
          alCerrar={() => { setMostrarModal(false); setProductoSeleccionado(null); }}
        />
      )}
    </div>
  );
}