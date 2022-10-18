import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InvoicesService } from 'src/app/services/invoices.service';

@Component({
  selector: 'app-edit-invoice',
  templateUrl: './edit-invoice.component.html',
  styleUrls: ['./edit-invoice.component.sass']
})
export class EditInvoiceComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private invoicesService : InvoicesService,
    ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.invoicesService.getById(+id).subscribe(
      response => {

      },
      error =>{

      }
      )
  }

}
