import { cliente } from './cliente';
import { facturaDetalle } from './facturaDetalle';

export class factura {
  constructor() {}
  public Id: number = 0;
  public IdCliente: number = 0;
  public Cliente: cliente;
  public FechaCreacion: Date = new Date();
  public FacturaDetalles: Array<facturaDetalle>;
  public Impuesto: number = 0.0;
  public Total: number = 0.0;
  public Cancelada: boolean = false;
  public Cerrada: boolean = false;
}
