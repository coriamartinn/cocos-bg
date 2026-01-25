import { Producto } from '../tipos';

// ============================================
// MENÚ DE PRODUCTOS - COCO'S BURGER
// ============================================

export const PRODUCTOS: Producto[] = [
  // ========== LÍNEA JUNIOR (80g) ==========
  // Precio: Simple $5.000 / Doble $10.000
  {
    id: 'jr1',
    nombre: 'Cheese Burger Jr',
    categoria: 'hamburguesa',
    precio: 0,
    imagen: '🍔',
    descripcion: 'Medallón de 80g con cheddar. Incluye papas fritas.',
    tamaños: { simple: 5000, doble: 10000 }
  },

  // ========== LÍNEA MAX (125g) ==========
  // Precio: Simple $6.500 / Doble $12.000
  {
    id: 'max1',
    nombre: 'Cheese Burger MAX',
    categoria: 'hamburguesa',
    precio: 0,
    imagen: '🔥',
    descripcion: 'Medallón de 125g con extra cheddar. Incluye papas fritas.',
    tamaños: { simple: 6500, doble: 12000 }
  },
  {
    id: 'max2',
    nombre: 'Cuarto de Libra',
    categoria: 'hamburguesa',
    precio: 0,
    imagen: '👑',
    descripcion: '125g de carne, cebolla, ketchup y mostaza. Incluye papas fritas.',
    tamaños: { simple: 6500, doble: 12000 }
  },
  {
    id: 'max3',
    nombre: 'Whopper 814',
    categoria: 'hamburguesa',
    precio: 0,
    imagen: '🍅',
    descripcion: 'A la parrilla con lechuga, tomate y mayonesa. Incluye papas fritas.',
    tamaños: { simple: 6500, doble: 12000 }
  },

  // ========== ACOMPAÑAMIENTOS ESPECIALES (Adicionales) ==========
  // Las papas comunes no están aquí porque vienen con la hamburguesa
  {
    id: 's2',
    nombre: 'Papas con Cheddar',
    categoria: 'acompañamiento',
    precio: 6000,
    imagen: '🧀',
    descripcion: 'Porción extra bañada en salsa cheddar.'
  },
  {
    id: 's4',
    nombre: 'Papas CoCo\'s (Cheddar y Bacon)',
    categoria: 'acompañamiento',
    precio: 7500,
    imagen: '🥓',
    descripcion: 'Porción extra con cheddar, panceta crocante y verdeo.'
  },
  {
    id: 's3',
    nombre: 'Aros de Cebolla',
    categoria: 'acompañamiento',
    precio: 5000,
    imagen: '🧅'
  },

  // ========== NUGGETS ==========
  {
    id: 'n1',
    nombre: 'Nuggets (6 pzs)',
    categoria: 'nuggets',
    precio: 4800,
    imagen: '🍗'
  },
  {
    id: 'n2',
    nombre: 'Nuggets (12 pzs)',
    categoria: 'nuggets',
    precio: 8500,
    imagen: '🍗'
  },
  {
    id: 'n3',
    nombre: 'Nuggets (20 pzs)',
    categoria: 'nuggets',
    precio: 13500,
    imagen: '🍗'
  },
];