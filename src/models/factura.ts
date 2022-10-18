import { articulo } from './articulo';
import { cliente } from './cliente';
import { facturaDetalle } from './facturaDetalle';

export class factura {
  constructor() {}
  public id: number = 0;
  public idCliente: number = 0;
  public cliente: cliente;
  public fechaCreacion: Date = new Date();
  public facturaDetalles: Array<facturaDetalle>;
  public impuesto: number = 0.0;
  public total: number = 0.0;
  public cancelada: boolean = false;
  public cerrada: boolean = false;
}
