import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  formularioBusqueda!: FormGroup;
  constructor(private fb: FormBuilder,) {

    this.formularioBusqueda = this.fb.group({
			searchInput: ['', Validators.required],
		});
  }

  ngOnInit(): void {
  }

  onSubmit(myForm: FormGroup){

    if(myForm.invalid) return alert("Ingrese texto a buscar")

    console.log(myForm);
    console.log(myForm.valid);
  }

}
