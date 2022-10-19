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
    return this.http.post<factura>(`${environment.API}/Factura`, JSON.parse(JSON.stringify(factura)))
  }

  put(factura:factura){
    return this.http.put<factura>(`${environment.API}/Factura`, JSON.parse(JSON.stringify(factura)))
  }

  cancel(id:number){
    return this.http.post(`${environment.API}/Factura/cancel?id=${id}`,{})
  }

  delete(id:number){
    return this.http.delete(`${environment.API}/Factura?id=${id}`,{})
  }
}
