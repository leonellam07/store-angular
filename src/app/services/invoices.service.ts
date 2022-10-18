import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { factura } from 'src/models/factura';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {

  constructor(private http: HttpClient) { }

  getAll(){
    return this.http.get<factura[]>(`${environment.API}/Factura`)
  }

  getById(id:number){
    return this.http.get<factura>(`${environment.API}/Factura/search?id=${id}`)
  }

  post(factura:factura){
    debugger
    console.log(JSON.stringify(factura))
    return this.http.post<factura>(`${environment.API}/Factura`, JSON.parse(JSON.stringify(factura)))
  }
}
