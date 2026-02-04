// Define las categorías válidas para los filtros
export type Categoria = 'hamburguesa' | 'acompañamiento' | 'nuggets' | 'bebida' | 'promos';

export interface Producto {
  id: string;
  nombre: string;
  categoria: Categoria;
  precio: number;
  imagen: string; // Emoji o URL
  descripcion?: string;
  tamaños?: { simple: number; doble: number }; // Opcional, solo para burgers
}

export interface Modificador {
  nombre: string;
  tipo: 'agregar' | 'quitar';
  precio?: number; // Si es 'agregar', suele tener precio
}

export interface ItemPedido {
  producto: Producto;
  cantidad: number;
  tamaño?: 'simple' | 'doble';
  modificadores: Modificador[];
  precioUnitario: number;
  subtotal: number;
}

export interface Pedido {
  id: string; // ID único interno (timestamp)
  numeroPedido?: number; // Número visible (#1, #2, #3...)
  cliente: string;
  fecha: string; // Guardamos como string ISO para no romper JSON
  items: ItemPedido[];
  total: number;
  estado: 'pendiente' | 'preparando' | 'listo' | 'entregado';
  notas?: string; // Notas de cocina (ej: "Sin sal")
  metodoPago?: 'efectivo' | 'transferencia';
}