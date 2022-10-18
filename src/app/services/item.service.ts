import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { articulo } from 'src/models/articulo';


@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  constructor(private http: HttpClient) { }

  getAll(){
    return this.http.get<articulo[]>(`${environment.API}/Articulo`)
  }

  getById(id:number){
    return this.http.get<articulo>(`${environment.API}/Articulo/search?id=${id}`)
  }


}
