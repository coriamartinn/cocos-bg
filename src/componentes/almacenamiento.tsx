import { PedidoCocina } from '../tipos.ts';

const CLAVE_PEDIDOS = '814burgers_pedidos';
const CLAVE_FECHA = '814burgers_fecha_sistema';
const CLAVE_CONTADOR = '814burgers_contador_pedidos'; // Nuevo: guarda el último número

const obtenerFechaHoy = () => new Date().toLocaleDateString('es-AR');

export const servicioAlmacenamiento = {
    // Inicializar y verificar si cambió el día (automático)
    inicializar: () => {
        const fechaGuardada = localStorage.getItem(CLAVE_FECHA);
        const fechaHoy = obtenerFechaHoy();

        if (fechaGuardada !== fechaHoy) {
            console.log('🧹 Nuevo día detectado. Limpiando sistema...');
            servicioAlmacenamiento.cerrarDia(false); // Reinicio automático sin reporte
            localStorage.setItem(CLAVE_FECHA, fechaHoy);
        }

        return JSON.parse(localStorage.getItem(CLAVE_PEDIDOS) || '[]');
    },

    // Obtener pedidos
    obtenerPedidos: (): PedidoCocina[] => {
        servicioAlmacenamiento.inicializar();
        const pedidosJson = localStorage.getItem(CLAVE_PEDIDOS);
        const pedidos = JSON.parse(pedidosJson || '[]');
        return pedidos.map((p: any) => ({ ...p, fecha: new Date(p.fecha) }));
    },

    // Obtener el siguiente número de pedido (1, 2, 3...)
    obtenerSiguienteNumero: (): number => {
        const actual = parseInt(localStorage.getItem(CLAVE_CONTADOR) || '0');
        return actual + 1;
    },

    // Guardar pedido (ahora recibe el pedido y le asigna el número correcto)
    guardarPedido: (nuevoPedido: PedidoCocina) => {
        const pedidos = servicioAlmacenamiento.obtenerPedidos();

        // Asignar número secuencial y guardar contador
        const numeroSecuencial = servicioAlmacenamiento.obtenerSiguienteNumero();
        nuevoPedido.numeroPedido = numeroSecuencial;
        localStorage.setItem(CLAVE_CONTADOR, numeroSecuencial.toString());

        pedidos.push(nuevoPedido);
        localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify(pedidos));

        return numeroSecuencial; // Retornamos el número para mostrarlo en el alert
    },

    actualizarEstado: (idPedido: string, nuevoEstado: PedidoCocina['estado']) => {
        const pedidos = servicioAlmacenamiento.obtenerPedidos();
        const pedidosActualizados = pedidos.map(p =>
            p.id === idPedido ? { ...p, estado: nuevoEstado } : p
        );
        localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify(pedidosActualizados));
    },

    // Función Manual para Cerrar el Día
    cerrarDia: (forzarBorrado: boolean = true) => {
        if (forzarBorrado) {
            localStorage.removeItem(CLAVE_PEDIDOS);
            localStorage.setItem(CLAVE_CONTADOR, '0'); // Reiniciamos contador a 0
            localStorage.setItem(CLAVE_FECHA, obtenerFechaHoy()); // Actualizamos fecha
        }
    }
};