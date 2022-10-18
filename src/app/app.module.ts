import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { CustomerComponent } from './customer/customer.component';
import { ItemComponent } from './item/item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AddInvoiceComponent } from './invoice/add-invoice/add-invoice.component';
import { DetailInvoiceComponent } from './invoice/detail-invoice/detail-invoice.component';
import { EditInvoiceComponent } from './invoice/edit-invoice/edit-invoice.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    InvoiceComponent,
    CustomerComponent,
    ItemComponent,
    AddInvoiceComponent,
    DetailInvoiceComponent,
    EditInvoiceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
