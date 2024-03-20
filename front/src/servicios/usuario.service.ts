import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private url = 'http://localhost:3000/usuario';

  constructor(private http: HttpClient) {}

  /**
   * Envia un post al backend para la creacion de un usuario
   * @param usuario 
   * @returns 
   */
  public crearUsuario(usuario: any): Observable<any> {
    return this.http.post<Observable<any>>(this.url + '/crearUsuario', usuario);
  }

    /**
   * Envia un post al backend para login
   * @param usuario 
   * @returns 
   */
    login(credentials: any): Observable<any> {
      return this.http.post<any>(`${this.url}/ingreso`, credentials)
        .pipe(
          map(response => {
            // Guardar el token de acceso en el almacenamiento local
            localStorage.setItem('accessToken', response.accessToken);
            return response;
          })
        );
    }

    public getUser(): Observable<any[]> {
      return this.http.get<any[]>(this.url + '/getUser');
    }

    editarUsuario(id: number, usuario: any): Observable<any> {
      return this.http.put<Observable<any>>(`${this.url}/editarUsuario/${id}`, usuario);
    }
}