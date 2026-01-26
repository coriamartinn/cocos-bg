import { useState } from 'react';
import { PantallaPOS } from './componentes/PantallaPOS';
import { PantallaCocina } from './componentes/PantallaCocina';
import { PantallaEstadisticas } from './componentes/PantallaEstadisticas';
import { LayoutDashboard, UtensilsCrossed, ShoppingCart } from 'lucide-react';

// 1. IMPORTA LA IMAGEN AQUÍ (Asegúrate de que la ruta sea correcta)
import logoMascota from './assets/COCOs-Mascota.png';

type Pantalla = 'pos' | 'cocina' | 'estadisticas';

export default function App() {
  const [pantallaActual, setPantallaActual] = useState<Pantalla>('pos');

  return (
    <div className="min-h-screen bg-background text-foreground font-brand selection:bg-primary selection:text-primary-foreground">

      {/* Barra de Navegación */}
      <nav className="bg-card border-b border-border px-6 py-4 shadow-2xl sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-[1920px] mx-auto">

          {/* Logo CoCo's Burger */}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setPantallaActual('pos')}>

            {/* --- AQUÍ ESTÁ EL CAMBIO --- */}
            {/* Cajita del Logo con la Mascota */}
            {/* Agregué 'overflow-hidden' para que la imagen respete los bordes redondeados */}
            <div className="w-14 h-14 bg-primary rounded-xl shadow-lg shadow-primary/20 transform group-hover:rotate-6 transition-transform duration-300 overflow-hidden border-2 border-primary/50">
              <img
                src={logoMascota}
                alt="Mascota CoCo"
                className="w-full h-full object-cover"
              />
            </div>
            {/* --------------------------- */}

            {/* Texto del Logo */}
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl font-black italic tracking-tight text-white leading-none">
                CoCo's <span className="text-secondary drop-shadow-sm">Burger</span>
              </h1>
            </div>
          </div>

          {/* Botones de Navegación */}
          <div className="flex gap-4">
            <button
              onClick={() => setPantallaActual('pos')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-200 ${pantallaActual === 'pos'
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105'
                : 'bg-black/20 text-gray-300 hover:bg-black/40 hover:text-white border border-transparent hover:border-white/10'
                }`}
            >
              <ShoppingCart className="w-5 h-5" />
              Nuevo Pedido
            </button>

            <button
              onClick={() => setPantallaActual('cocina')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-200 ${pantallaActual === 'cocina'
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105'
                : 'bg-black/20 text-gray-300 hover:bg-black/40 hover:text-white border border-transparent hover:border-white/10'
                }`}
            >
              <UtensilsCrossed className="w-5 h-5" />
              Cocina
            </button>

            <button
              onClick={() => setPantallaActual('estadisticas')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-200 ${pantallaActual === 'estadisticas'
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105'
                : 'bg-black/20 text-gray-300 hover:bg-black/40 hover:text-white border border-transparent hover:border-white/10'
                }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Estadísticas
            </button>
          </div>
        </div>
      </nav>

      {/* Contenido de la Pantalla Activa */}
      <main className="max-w-[1920px] mx-auto">
        {pantallaActual === 'pos' && <PantallaPOS />}
        {pantallaActual === 'cocina' && <PantallaCocina />}
        {pantallaActual === 'estadisticas' && <PantallaEstadisticas />}
      </main>
    </div>
  );
}