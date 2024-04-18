import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VoluntarioService {
  private url = 'http://localhost:3000/voluntario';

  constructor(private http: HttpClient) {}

  /**
   * Envia un post al backend para la creacion de un voluntario
   * @param voluntario
   * @returns 
   */
  public registrarVoluntario(usuario: any): Observable<any> {
    return this.http.post<Observable<any>>(this.url + '/registrarVoluntario', usuario);
  }

  
}