import { articulo } from './articulo';

export class facturaDetalle {
  constructor() {}
  public NoLinea: number = 0;
  public ArticuloId: number = 0;
  public Articulo: articulo;
  public Cantidad: number = 0;
  public Precio: number = 0.0;
  public Impuesto: number = 0.0;
  public Total: number = 0.0;
}
