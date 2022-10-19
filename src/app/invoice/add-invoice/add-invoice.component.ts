import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { articulo } from 'src/models/articulo';
import { cliente } from 'src/models/cliente';
import { factura } from 'src/models/factura';
import { facturaDetalle } from 'src/models/facturaDetalle';
import { ItemsService } from '../../services/item.service';
import { InvoicesService } from '../../services/invoices.service';

@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.scss'],
})
export class AddInvoiceComponent implements OnInit {
  formAdd: FormGroup;
  public articulosModel: articulo[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private itemsService: ItemsService,
    private invoicesService: InvoicesService
  ) {}

  ngOnInit(): void {
    this.itemsService.getAll().subscribe(
      (response) => {
        this.articulosModel = response;
      },
      (error) => {
        console.error(error);
      }
    );

    this.formAdd = this.fb.group({
      primerNombre: new FormControl('Jorge', [
        Validators.required,
        ,
        Validators.maxLength(20),
      ]),
      segundoNombre: new FormControl('Leonel', [
        Validators.required,
        ,
        Validators.maxLength(50),
      ]),
      apellidos: new FormControl('Lam Pazos', [
        Validators.required,
        ,
        Validators.maxLength(100),
      ]),
      nit: new FormControl('89646541', [
        Validators.required,
        ,
        Validators.maxLength(10),
      ]),
      direccion: new FormControl('Ciudad', [
        Validators.required,
        ,
        Validators.maxLength(100),
      ]),
      cerrada: new FormControl(true, [
        Validators.required,
        ,
      ]),
      idTipoCliente: new FormControl('L'),
      facturaDetalles: this.fb.array([]),
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

    if(newDetalles.length == 0) {
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
      id: 0,
      fechaCreacion: new Date(),
      idCliente: 1,
      cliente: newCliente,
      cancelada: false,
      cerrada: this.formAdd.controls['cerrada'].value,
      impuesto: sumImpuesto,
      total: sumTotal,
      facturaDetalles: newDetalles,
    };

    this.invoicesService.post(newFactura).subscribe(
      (response) => {
        alert('Factura Ingresada');
        this.router.navigate(['/']);
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
