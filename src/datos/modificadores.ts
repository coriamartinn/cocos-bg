import { Modificador } from '../tipos';

export const MODIFICADORES_DISPONIBLES: { agregar: Modificador[], quitar: Modificador[] } = {
  // Cosas que SUMAN precio
  agregar: [
    { nombre: 'Bacon Extra', tipo: 'agregar', precio: 1500 },
    { nombre: 'Extra Cheddar', tipo: 'agregar', precio: 1200 },
    { nombre: 'Huevo Frito', tipo: 'agregar', precio: 1000 },
    { nombre: 'Cebolla Crispy', tipo: 'agregar', precio: 900 },
    { nombre: 'Pepinillos', tipo: 'agregar', precio: 600 },
    { nombre: 'Salsa BBQ Extra', tipo: 'agregar', precio: 500 },
  ],

  // Cosas que NO cambian el precio (solo para quitar)
  quitar: [
    { nombre: 'Cebolla', tipo: 'quitar' },
    { nombre: 'Tomate', tipo: 'quitar' },
    { nombre: 'Lechuga', tipo: 'quitar' },
    { nombre: 'Pepinillos', tipo: 'quitar' },
    { nombre: 'Mayonesa', tipo: 'quitar' },
    { nombre: 'Mostaza', tipo: 'quitar' },
  ],
};