import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormControl,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { InvoicesService } from 'src/app/services/invoices.service';
import { ItemsService } from 'src/app/services/item.service';
import { articulo } from 'src/models/articulo';
import { cliente } from 'src/models/cliente';
import { factura } from 'src/models/factura';
import { facturaDetalle } from 'src/models/facturaDetalle';

@Component({
  selector: 'app-edit-invoice',
  templateUrl: './edit-invoice.component.html',
  styleUrls: ['./edit-invoice.component.scss'],
})
export class EditInvoiceComponent implements OnInit {
  formAdd: FormGroup;
  public articulosModel: articulo[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private itemsService: ItemsService,
    private invoicesService: InvoicesService,
    private activatedRouter: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.itemsService.getAll().subscribe(
      (response) => {
        this.articulosModel = response;
        this.activatedRouter.params.subscribe((params: Params) => {
          const id: number = params['id'];
          this.cargarVentana(id);
        });
      },
      (error) => {
        console.error(error);
      }
    );

    this.formAdd = this.fb.group({
      id: new FormControl(0, [Validators.required, , Validators.maxLength(20)]),
      fechaCreacion: new FormControl(new Date(), []),
      primerNombre: new FormControl('Jorge', []),
      segundoNombre: new FormControl('Leonel', []),
      apellidos: new FormControl('Lam Pazos', []),
      nit: new FormControl('89646541', []),
      direccion: new FormControl('Ciudad', []),
      idTipoCliente: new FormControl('L'),
      cerrada: new FormControl(true, [Validators.required, ,]),
      facturaDetalles: this.fb.array([]),
    });
  }

  cargarVentana(id: number) {
    this.invoicesService.getById(id).subscribe(
      (response: factura) => {
        let {
          id,
          idCliente,
          cliente,
          fechaCreacion,
          impuesto,
          total,
          cerrada,
          facturaDetalles,
        } = response;

        let { primerNombre, segundoNombre, apellidos, direccion, nit } =
          cliente;

        this.formAdd.controls['id'].setValue(id);
        this.formAdd.controls['fechaCreacion'].setValue(fechaCreacion);
        this.formAdd.controls['primerNombre'].setValue(primerNombre);
        this.formAdd.controls['segundoNombre'].setValue(segundoNombre);
        this.formAdd.controls['apellidos'].setValue(apellidos);
        this.formAdd.controls['direccion'].setValue(direccion);
        this.formAdd.controls['nit'].setValue(nit);
        this.agregarDetalleAnteriores(facturaDetalles);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  eliminar(){
    this.activatedRouter.params.subscribe((params: Params) => {
      const id: number = params['id'];
      this.invoicesService.delete(id).subscribe(
        (response) => {
          alert("Factura eliminada correctamente")
          this.router.navigate(['/']);
        },
        (error) => {
          console.error(error);
        }
      );
    });

  }

  get facturaDetalles() {
    return this.formAdd.controls['facturaDetalles'] as FormArray;
  }

  eliminarLinea(index: number) {
    this.facturaDetalles.removeAt(index);
  }

  agregarDetalle() {
    const detalle = this.fb.group({
      articuloId: [0, Validators.required, ,],
      cantidad: [1, Validators.required, , Validators.maxLength(5)],
      precio: [0, Validators.required, , Validators.maxLength(5)],
      impuesto: [0, Validators.required, , Validators.maxLength(5)],
      total: [0, Validators.required, , Validators.maxLength(5)],
    });
    this.facturaDetalles.push(detalle);
  }

  agregarDetalleAnteriores(detalles: facturaDetalle[]) {
    detalles.forEach((det) => {
      const detalle = this.fb.group({
        articuloId: [det.articuloId, Validators.required, ,],
        cantidad: [
          det.cantidad,
          Validators.required,
          ,
          Validators.maxLength(5),
        ],
        precio: [det.precio, Validators.required, , Validators.maxLength(5)],
        impuesto: [
          det.impuesto,
          Validators.required,
          ,
          Validators.maxLength(5),
        ],

        total: [det.total, Validators.required, , Validators.maxLength(5)],
      });
      this.facturaDetalles.push(detalle);
    });
  }

  onSubmit(myForm: FormGroup) {}

  regresar() {
    this.router.navigate(['/']);
  }

  guardar() {
    if (this.formAdd.invalid) {
      alert('Debe ingresar correctamente la informacion');
      return;
    }

    const newCliente: cliente = {
      apellidos: this.formAdd.controls['apellidos'].value,
      direccion: this.formAdd.controls['direccion'].value,
      idTipoCliente: 'L',
      nit: this.formAdd.controls['nit'].value,
      primerNombre: this.formAdd.controls['primerNombre'].value,
      segundoNombre: this.formAdd.controls['segundoNombre'].value,
      id: 0,
    };

    let newDetalles: facturaDetalle[] = [];
    let formauxarray: FormArray = <FormArray>(
      this.formAdd.controls['facturaDetalles']
    );
    for (let control of formauxarray.controls) {
      let item: facturaDetalle = control.value;
      item.articulo = {
        id: 0,
        cancelado: false,
        codigo: '',
        cantidad: 0,
        costo: 0,
        descripcion: '',
        precio: 0,
      };
      newDetalles.push(item);
    }

    if (newDetalles.length == 0) {
      alert('Ingrese detalles antes de guardar la factura');
      return;
    }

    let sumImpuesto = 0;
    let sumTotal = 0;
    for (const item of newDetalles) {
      sumImpuesto += item.impuesto;
      sumTotal += item.total;
    }
    const newFactura: factura = {
      id: this.formAdd.controls['id'].value,
      fechaCreacion: new Date(),
      idCliente: 1,
      cliente: newCliente,
      cancelada: false,
      cerrada: this.formAdd.controls['cerrada'].value,
      impuesto: sumImpuesto,
      total: sumTotal,
      facturaDetalles: newDetalles,
    };

    this.invoicesService.put(newFactura).subscribe(
      (response) => {
        alert('Factura Ingresada');
      },
      (error) => {
        console.error(error);
      }
    );
  }

  cambiarPrecioSelect(event, index) {
    let formauxarray: FormArray = <FormArray>(
      this.formAdd.controls['facturaDetalles']
    );
    let formgroup = formauxarray.controls[index] as FormGroup;

    let value = formgroup.controls['articuloId'].value;
    if (!value) return alert('Seleccione un articulo');

    let [articulo] = this.articulosModel.filter((w) => w.id == value);
    let { precio } = articulo;

    formgroup.controls['precio'].setValue(precio);
    let cantidad = formgroup.controls['cantidad'].value;
    let impuesto = precio * 0.12 * cantidad;
    let subtotal = precio * cantidad;
    let total = impuesto + subtotal;

    formgroup.controls['impuesto'].setValue(impuesto);
    formgroup.controls['total'].setValue(total);
  }

  cambiarPrecioText(event, index) {
    let formauxarray: FormArray = <FormArray>(
      this.formAdd.controls['facturaDetalles']
    );
    let formgroup = formauxarray.controls[index] as FormGroup;

    let value = formgroup.controls['articuloId'].value;
    if (!value) return alert('Seleccione un articulo');

    let [articulo] = this.articulosModel.filter((w) => w.id == value);
    let { precio } = articulo;

    formgroup.controls['precio'].setValue(precio);
    let cantidad = formgroup.controls['cantidad'].value;
    let impuesto = precio * 0.12 * cantidad;
    let subtotal = precio * cantidad;
    let total = impuesto + subtotal;

    formgroup.controls['impuesto'].setValue(impuesto);
    formgroup.controls['total'].setValue(total);
  }
}
