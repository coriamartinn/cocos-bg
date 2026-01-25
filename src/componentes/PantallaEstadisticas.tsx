import { useState, useEffect } from 'react';
import { Transaccion } from '../tipos';
import { Package, TrendingUp, Clock, Download } from 'lucide-react';
import { servicioAlmacenamiento } from './almacenamiento';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { formatearDinero } from '../utilidades/formato';

export function PantallaEstadisticas() {
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);

  // Cargar datos
  useEffect(() => {
    const pedidos = servicioAlmacenamiento.obtenerPedidos();
    const pedidosOrdenados = pedidos.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
    setTransacciones(pedidosOrdenados as unknown as Transaccion[]);
  }, []);

  // Cálculos
  const ventasTotales = transacciones.reduce((suma, t) => suma + t.total, 0);
  const totalPedidos = transacciones.length;
  const ticketPromedio = totalPedidos > 0 ? ventasTotales / totalPedidos : 0;

  // Formatos de fecha y hora
  const formatearHora = (fecha: Date | string) => new Date(fecha).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  const formatearFecha = (fecha: Date | string) => new Date(fecha).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });

  // ========== FUNCIÓN EXPORTAR EXCEL (EXCELJS) ==========
  const cerrarCaja = async () => {
    if (transacciones.length === 0) {
      alert("No hay ventas para cerrar hoy.");
      return;
    }

    const confirmar = window.confirm("⚠️ ¿Estás seguro de cerrar el día?\n\nSe generará el reporte y se reiniciará el sistema.");

    if (confirmar) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Cierre de Caja');

      // Definir Columnas
      worksheet.columns = [
        { header: 'Pedido #', key: 'pedido', width: 12 },
        { header: 'Fecha', key: 'fecha', width: 15 },
        { header: 'Hora', key: 'hora', width: 12 },
        { header: 'Items', key: 'items', width: 50 },
        { header: 'Total', key: 'total', width: 20 },
      ];

      // Estilar Encabezado
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }; // Texto blanco
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1E6B1A' } // Fondo Verde Oscuro CoCo's
      };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

      // Agregar Filas de Datos
      transacciones.forEach(t => {
        const fila = worksheet.addRow({
          pedido: t.numeroPedido,
          fecha: new Date(t.fecha).toLocaleDateString(),
          hora: new Date(t.fecha).toLocaleTimeString(),
          items: t.items.map(i => `${i.cantidad}x ${i.producto.nombre}`).join(', '),
          total: t.total
        });

        // Formato de moneda compatible con Excel ($ 1.500,00)
        fila.getCell('total').numFmt = '"$"#,##0.00';
        fila.getCell('pedido').alignment = { horizontal: 'center' };
        fila.getCell('fecha').alignment = { horizontal: 'center' };
        fila.getCell('hora').alignment = { horizontal: 'center' };
      });

      // Agregar Fila de TOTAL FINAL
      const filaTotal = worksheet.addRow({
        pedido: '',
        fecha: '',
        hora: '',
        items: 'TOTAL DEL DÍA:',
        total: ventasTotales
      });

      // Estilo Fila Total
      filaTotal.font = { bold: true, size: 14 };
      filaTotal.getCell('items').alignment = { horizontal: 'right' };
      filaTotal.getCell('total').numFmt = '"$"#,##0.00';
      filaTotal.getCell('total').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4CAF50' } // Verde Medio (Primary)
      };

      // Generar y descargar
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const fechaArchivo = new Date().toLocaleDateString('es-AR').replace(/\//g, '-');

      saveAs(blob, `Cierre_CoCos_${fechaArchivo}.xlsx`);

      // Reiniciar sistema
      servicioAlmacenamiento.cerrarDia(true);
      setTransacciones([]);
      alert("✅ Reporte generado y día cerrado correctamente.");
      window.location.reload();
    }
  };

  return (
    <div className="p-8 font-brand">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-4xl font-black text-white tracking-wide italic">
            Panel de Control
          </h2>
          <p className="text-gray-400 mt-1 font-medium">Resumen de operaciones del día</p>
        </div>

        <button
          onClick={cerrarCaja}
          className="flex items-center gap-2 bg-destructive hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-red-900/40 active:scale-95 border border-red-800"
        >
          <Download className="w-5 h-5" />
          <span>Cerrar Día y Exportar Excel</span>
        </button>
      </div>

      {/* KPIs (Indicadores Clave) */}
      <div className="grid grid-cols-3 gap-6 mb-8">

        {/* Ventas Totales */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-24 h-24 text-primary" />
          </div>
          <div className="flex items-center justify-between mb-3 relative z-10">
            <h3 className="text-gray-300 font-bold uppercase tracking-wider text-sm">Ventas Totales</h3>
            <div className="bg-primary/20 p-2 rounded-lg text-primary">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <p className="text-4xl font-black text-primary relative z-10">
            {formatearDinero(ventasTotales)}
          </p>
          <p className="text-sm text-gray-400 mt-1 relative z-10">Acumulado hoy</p>
        </div>

        {/* Pedidos Totales */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Package className="w-24 h-24 text-secondary" />
          </div>
          <div className="flex items-center justify-between mb-3 relative z-10">
            <h3 className="text-gray-300 font-bold uppercase tracking-wider text-sm">Pedidos</h3>
            <div className="bg-secondary/20 p-2 rounded-lg text-secondary">
              <Package className="w-6 h-6" />
            </div>
          </div>
          <p className="text-4xl font-black text-secondary relative z-10">
            {totalPedidos}
          </p>
          <p className="text-sm text-gray-400 mt-1 relative z-10">Ordenes generadas</p>
        </div>

        {/* Ticket Promedio */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Clock className="w-24 h-24 text-accent" />
          </div>
          <div className="flex items-center justify-between mb-3 relative z-10">
            <h3 className="text-gray-300 font-bold uppercase tracking-wider text-sm">Ticket Promedio</h3>
            <div className="bg-accent/20 p-2 rounded-lg text-accent">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <p className="text-4xl font-black text-accent relative z-10">
            {formatearDinero(ticketPromedio)}
          </p>
          <p className="text-sm text-gray-400 mt-1 relative z-10">Por cliente</p>
        </div>
      </div>

      {/* Tabla de Pedidos */}
      <div className="bg-card rounded-xl shadow-xl overflow-hidden border border-border">
        <div className="p-6 border-b border-border bg-black/20">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            📋 Historial de Ventas
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#154d12]"> {/* Un verde muy oscuro para el header de la tabla */}
              <tr>
                <th className="text-left py-4 px-6 text-gray-200 font-bold uppercase text-sm tracking-wider">Pedido #</th>
                <th className="text-left py-4 px-6 text-gray-200 font-bold uppercase text-sm tracking-wider">Fecha</th>
                <th className="text-left py-4 px-6 text-gray-200 font-bold uppercase text-sm tracking-wider">Hora</th>
                <th className="text-right py-4 px-6 text-gray-200 font-bold uppercase text-sm tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {transacciones.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-500 italic">
                    No hay ventas registradas hoy todavía.
                  </td>
                </tr>
              ) : (
                transacciones.map(transaccion => (
                  <tr key={transaccion.id} className="hover:bg-white/5 transition-colors group">
                    <td className="py-4 px-6">
                      <span className="font-bold text-secondary text-lg group-hover:text-white transition-colors">
                        #{transaccion.numeroPedido}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-300 font-medium">{formatearFecha(transaccion.fecha)}</td>
                    <td className="py-4 px-6 text-gray-300 font-mono">{formatearHora(transaccion.fecha)}</td>
                    <td className="py-4 px-6 text-right">
                      <span className="font-bold text-primary text-lg">
                        {formatearDinero(transaccion.total)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}