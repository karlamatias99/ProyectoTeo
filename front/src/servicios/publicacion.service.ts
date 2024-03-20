import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PublicacionService {
  private url = 'http://localhost:3000/publicacion';

  constructor(private http: HttpClient) {}

  /**
   * Envia un post al backend para la creacion de una publicacion
   * @param publicacion 
   * @returns 
   */
  public crearPublicacion(publicacion: any): Observable<any> {
    return this.http.post<Observable<any>>(this.url + '/crearPublicacion', publicacion);
  }

     /**
   * Envia un post al backend para mostrar publicaciones
   * @param publicacion 
   * @returns 
   */
      public mostrarPublicacion(): Observable<any[]> {
        return this.http.get<any[]>(this.url + '/mostrarPublicacion');
      }

      public mostrarPublicacionPorUsuario(id_usuario: number): Observable<any[]> {
        const url = `${this.url}/mostrarPublicacion/${id_usuario}`;
        return this.http.get<any[]>(url);
      }

      public publicacionesAprobadas(): Observable<any[]> {
        return this.http.get<any[]>(this.url + '/PublicacionesAprobadas');
      }


      /**
   * Envia una solicitud GET al backend para buscar publicaciones por nombre
   * @param titulo_publicacion 
   * @returns 
   */
  public buscarPublicacion(titulo_publicacion: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/buscarProductos?nombreProducto=${titulo_publicacion}`);
  }

  editarPublicacion(id: number, publicacion: any): Observable<any> {
    return this.http.put<Observable<any>>(`${this.url}/editarPublicacion/${id}`, publicacion);
  }


  obtenerIdPublicacion(usuarioReceptor: number): Observable<number> {
    return this.http.get<number>(`${this.url}/publicacion/${usuarioReceptor}`);
  }
}