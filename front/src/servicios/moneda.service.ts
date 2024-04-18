// conversion-moneda.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MonedaService {

  private url = 'http://localhost:3000/monedas';

  constructor(private http: HttpClient) { }

  public comprarMonedas(moneda: any): Observable<any> {
    return this.http.post<Observable<any>>(this.url + '/comprarMonedas', moneda);
  }
  
  public mostrarMonedas(id_usuario: string): Observable<any[]> {
    const url = `${this.url}/monedasSistema/${id_usuario}`;
    return this.http.get<any[]>(url);
  }

  public actualizarMonedas(usuario: string, cantidadMonedas: number) {
    const body = { usuario_monedas: usuario, cantidad_moneda: cantidadMonedas };
    return this.http.post(this.url + '/actualizar-monedas', body);
  }


}