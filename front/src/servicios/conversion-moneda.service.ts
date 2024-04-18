// conversion-moneda.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConversionMonedaService {

  private url = 'http://localhost:3000/tarjeta';

  constructor(private http: HttpClient) { }

  public registrarTarjeta(tarjeta: any): Observable<any> {
    return this.http.post<Observable<any>>(this.url + '/registrarTarjeta', tarjeta);
  }
  
  verificarTarjeta(num_tarjeta: any): Observable<any> {
    // Realizar la solicitud al servidor para verificar la tarjeta
    return this.http.post<any>(this.url + '/ver-tarjeta', { num_tarjeta: num_tarjeta });
  }


}