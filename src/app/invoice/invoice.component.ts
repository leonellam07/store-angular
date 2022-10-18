import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { factura } from 'src/models/factura';
import { InvoicesService } from '../services/invoices.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {



  formularioBusqueda!: FormGroup;
  facturasModel : factura[] = []
  constructor(
    private fb: FormBuilder,
    private invoicesService : InvoicesService,
    public router                   : Router,
    ) {

    this.formularioBusqueda = this.fb.group({
			searchInput: ['', Validators.required],
		});
  }

  ngOnInit(): void {
    this.invoicesService.getAll().subscribe(
      response => {
        this.facturasModel = response

      },
      error => {
        console.error(error)
      }
    )
  }

  onSubmit(myForm: FormGroup){

    if(myForm.invalid) return alert("Ingrese texto a buscar")

    console.log(myForm);
    console.log(myForm.valid);
  }


  add(){
    this.router.navigate([`/add`])
  }

  edit(id:number){
    this.router.navigate([`/edit/${id}`])
  }

  detail(id:number){
    this.router.navigate([`/detail/${id}`])
  }

  cancel(id:number){
    this.router.navigate([`/cancel/${id}`])
  }

}
