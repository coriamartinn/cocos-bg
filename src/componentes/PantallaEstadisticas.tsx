import { TrendingUp, Package, Clock, Download, AlertCircle } from 'lucide-react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Pedido } from '../tipos';
import { servicioAlmacenamiento } from './almacenamiento';

// Ahora recibe los pedidos como Propiedades (Props)
interface PantallaEstadisticasProps {
  pedidos: Pedido[];
}

export function PantallaEstadisticas({ pedidos }: PantallaEstadisticasProps) {

  // Ordenamos para mostrar los más recientes arriba
  const transacciones = [...pedidos].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  // Cálculos en tiempo real
  const ventasTotales = transacciones.reduce((total, p) => total + p.total, 0);
  const totalPedidos = transacciones.length;
  const ticketPromedio = totalPedidos > 0 ? ventasTotales / totalPedidos : 0;

  // Formato
  const fmtDinero = (m: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(m);
  const fmtHora = (f: string) => new Date(f).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

  // EXCEL (Igual que antes)
  const cerrarCaja = async () => {
    if (transacciones.length === 0) return alert("No hay ventas para cerrar.");
    if (!window.confirm("⚠️ ¿CERRAR DÍA Y BORRAR DATOS?\nSe descargará el Excel y se reiniciará el sistema.")) return;

    try {
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet('Cierre');
      ws.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Hora', key: 'hora', width: 10 },
        { header: 'Cliente', key: 'cliente', width: 20 },
        { header: 'Items', key: 'items', width: 40 },
        { header: 'Total', key: 'total', width: 15 },
      ];
      ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
      ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF15803d' } };

      transacciones.forEach(t => {
        ws.addRow({
          id: t.numeroPedido,
          hora: fmtHora(t.fecha),
          cliente: t.cliente,
          items: t.items.map(i => `${i.cantidad}x ${i.producto.nombre}`).join(', '),
          total: t.total
        });
      });
      ws.addRow([]);
      const rowTotal = ws.addRow({ items: 'TOTAL DÍA:', total: ventasTotales });
      rowTotal.font = { bold: true, size: 14 };
      rowTotal.getCell('total').numFmt = '"$"#,##0';

      const buf = await wb.xlsx.writeBuffer();
      saveAs(new Blob([buf]), `Cierre_CoCos_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`);

      servicioAlmacenamiento.limpiarTodo();
      window.location.reload();
    } catch (e) {
      alert("Error al exportar");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tight">Caja y Reportes</h2>
          <p className="text-gray-400 text-sm">Actualizado en tiempo real</p>
        </div>
        <button onClick={cerrarCaja} className="w-full md:w-auto flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-bold py-3 px-6 rounded-xl border border-red-500/20 transition-all">
          <Download size={20} /> Cerrar Caja
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPIItem icon={<TrendingUp />} title="Ventas Totales" value={fmtDinero(ventasTotales)} color="text-green-400" />
        <KPIItem icon={<Package />} title="Pedidos" value={totalPedidos} color="text-blue-400" />
        <KPIItem icon={<Clock />} title="Ticket Promedio" value={fmtDinero(ticketPromedio)} color="text-yellow-400" />
      </div>

      <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
        <div className="p-4 border-b border-neutral-700 bg-neutral-900/50">
          <h3 className="font-bold text-white">Movimientos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-900 text-gray-400 uppercase text-xs">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">Hora</th>
                <th className="p-4">Cliente</th>
                <th className="p-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700">
              {transacciones.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500 flex flex-col items-center"><AlertCircle className="mb-2" />Sin movimientos</td></tr>
              ) : (
                transacciones.map(t => (
                  <tr key={t.id} className="hover:bg-neutral-700/50 transition-colors">
                    <td className="p-4 font-bold text-white">#{t.numeroPedido}</td>
                    <td className="p-4 text-gray-400">{fmtHora(t.fecha)}</td>
                    <td className="p-4 text-gray-300 capitalize">{t.cliente}</td>
                    <td className="p-4 text-right font-bold text-green-400">{fmtDinero(t.total)}</td>
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

function KPIItem({ icon, title, value, color }: any) {
  return (
    <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700 shadow-lg">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-gray-400 text-xs uppercase font-bold tracking-wider">{title}</h3>
        <div className={`${color} opacity-80`}>{icon}</div>
      </div>
      <p className={`text-3xl font-black ${color}`}>{value}</p>
    </div>
  )
}