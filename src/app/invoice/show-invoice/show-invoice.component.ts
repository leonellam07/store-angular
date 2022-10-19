import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { InvoicesService } from 'src/app/services/invoices.service';
import { ItemsService } from 'src/app/services/item.service';
import { articulo } from 'src/models/articulo';
import { cliente } from 'src/models/cliente';
import { factura } from 'src/models/factura';
import { facturaDetalle } from 'src/models/facturaDetalle';

@Component({
  selector: 'app-show-invoice',
  templateUrl: './show-invoice.component.html',
  styleUrls: ['./show-invoice.component.scss'],
})
export class ShowInvoiceComponent implements OnInit {
  formAdd: FormGroup;
  public articulosModel: articulo[] = [];
  public facturaModel: factura;

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
      },
      (error) => {
        console.error(error);
      }
    );

    this.activatedRouter.params.subscribe((params: Params) => {
      const id: number = params['id'];
      this.cargarVentana(id);
      this.invoicesService.getById(id).subscribe(
        (response) => {
          this.facturaModel = response;
        },
        (error) => {
          console.error(error);
        }
      );
    });

    this.formAdd = this.fb.group({
      id: new FormControl(0, [Validators.required, , Validators.maxLength(20)]),
      fechaCreacion: new FormControl(new Date(), []),
      primerNombre: new FormControl('', []),
      segundoNombre: new FormControl('', []),
      apellidos: new FormControl('', []),
      nit: new FormControl('', []),
      direccion: new FormControl('', []),
      idTipoCliente: new FormControl(''),
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
          cancelada,
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

  get facturaDetalles() {
    return this.formAdd.controls['facturaDetalles'] as FormArray;
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
        cerrada: new FormControl(true, [Validators.required, ,]),
        total: [det.total, Validators.required, , Validators.maxLength(5)],
      });
      this.facturaDetalles.push(detalle);
    });
  }

  onSubmit(myForm: FormGroup) {}

  regresar() {
    this.router.navigate(['/']);
  }

  anular() {
    this.activatedRouter.params.subscribe((params: Params) => {
      const id: number = params['id'];
      this.invoicesService.cancel(id).subscribe(
        (response) => {
          alert('Factura anulada correctamente');
          this.router.navigate(['/']);
        },
        (error) => {
          console.error(error);
        }
      );
    });
  }
}
