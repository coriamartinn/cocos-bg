import { Pedido } from '../tipos';

// Claves para guardar en el navegador
const CLAVE_PEDIDOS = 'cocos_pedidos_data';
const CLAVE_CONTADOR = 'cocos_contador_dia';
const CLAVE_FECHA = 'cocos_fecha_sistema';

// Función auxiliar para saber la fecha de hoy (DD/MM/AAAA)
const obtenerFechaHoy = () => new Date().toLocaleDateString('es-AR');

export const servicioAlmacenamiento = {

    // 1. Validar si es un nuevo día (Reset automático)
    validarSesion: () => {
        const ultimaFecha = localStorage.getItem(CLAVE_FECHA);
        const hoy = obtenerFechaHoy();

        // Si la fecha guardada es distinta a hoy, borramos todo
        if (ultimaFecha !== hoy) {
            console.log("🧹 Nuevo día detectado: Reiniciando contador y pedidos...");
            localStorage.removeItem(CLAVE_PEDIDOS);
            localStorage.setItem(CLAVE_CONTADOR, '0');
            localStorage.setItem(CLAVE_FECHA, hoy);
        }
    },

    // 2. Cargar pedidos al iniciar la App
    obtenerPedidos: (): Pedido[] => {
        servicioAlmacenamiento.validarSesion(); // Primero chequeamos la fecha
        try {
            const data = localStorage.getItem(CLAVE_PEDIDOS);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error("Error leyendo pedidos", error);
            return [];
        }
    },

    // 3. Guardar la lista completa (Se llama cada vez que agregas/borras algo)
    guardarPedidos: (pedidos: Pedido[]) => {
        localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify(pedidos));
    },

    // 4. Obtener el número para el ticket (#1, #2...)
    obtenerSiguienteNumero: (): number => {
        const actual = parseInt(localStorage.getItem(CLAVE_CONTADOR) || '0');
        const siguiente = actual + 1;
        localStorage.setItem(CLAVE_CONTADOR, siguiente.toString());
        return siguiente;
    },

    // 5. Cierre de Caja Manual (Exportar Excel y borrar)
    limpiarTodo: () => {
        localStorage.removeItem(CLAVE_PEDIDOS);
        localStorage.setItem(CLAVE_CONTADOR, '0');
        localStorage.setItem(CLAVE_FECHA, obtenerFechaHoy());
    }
};