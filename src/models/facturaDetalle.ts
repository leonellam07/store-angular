import { articulo } from './articulo';

export class facturaDetalle {
  constructor() {}
  public noLinea: number = 0;
  public articuloId: number = 0;
  public articulo: articulo;
  public cantidad: number = 0;
  public precio: number = 0.0;
  public impuesto: number = 0.0;
  public total: number = 0.0;
}
