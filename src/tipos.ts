// ============================================
// DEFINICIÓN DE TIPOS DE DATOS
// ============================================

export interface Producto {
  id: string;
  nombre: string;
  categoria: 'hamburguesa' | 'acompañamiento' | 'nuggets';
  precio: number;
  imagen: string;
  descripcion?: string; // <--- Agregado para detalles (ej: "Medallón 80g")
  tamaños?: { simple: number; doble: number }; // Solo para hamburguesas
}

export interface Modificador {
  nombre: string;
  tipo: 'quitar' | 'agregar';
  precio?: number; // Solo los extras tienen precio
}

export interface ItemPedido {
  id: string;
  producto: Producto;
  tamaño?: 'simple' | 'doble'; // Solo para hamburguesas
  modificadores: Modificador[];
  cantidad: number;
}

export interface PedidoCocina {
  id: string;
  numeroPedido: number;
  items: ItemPedido[];
  estado: 'pendiente' | 'preparando' | 'listo';
  fecha: Date;
  minutosTranscurridos: number;
  total: number;
}

export interface Transaccion {
  id: string;
  numeroPedido: number;
  total: number;
  fecha: Date;
  items: ItemPedido[];
}