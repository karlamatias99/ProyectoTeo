import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MensajeService {

    private url = 'http://localhost:3000/mensajes';

    constructor(private http: HttpClient) { }

    enviarMensaje(mensajeData: any): Observable<any> {
        return this.http.post<Observable<any>>(this.url + '/enviar-mensaje', mensajeData);
    }

    obtenerMensajesEnviados(idUsuario: number, idPublicacion: any): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}/enviados/${idUsuario}/${idPublicacion}`);
    }

    /*obtenerMensajesRecibidos(idUsuario: number, idDestinatario: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}/recibidos/${idUsuario}/${idDestinatario}`);
    }*/

    obtenerUsuarioEmisor(idPublicacion: number): Observable<any[]> {
        const url = `${this.url}/emisor/${idPublicacion}`;
        return this.http.get<any[]>(url);

    }

    obtenerMensajesRecibidos(idDestinatario: number, usuario: number, idPublicacion: any): Observable<any[]> {
        const url = `${this.url}/mensajes/${idDestinatario}/${usuario}/${idPublicacion}`;
        return this.http.get<any[]>(url);
    }

    obtenerMensajesReceptor(idDestinatario: number): Observable<any[]> {
        const url = `${this.url}/receptor/${idDestinatario}`;
        return this.http.get<any[]>(url);
    }

}