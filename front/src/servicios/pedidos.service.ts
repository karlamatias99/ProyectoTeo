import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PedidosService {
    private url = 'http://localhost:3000/pedidos';

    constructor(private http: HttpClient) { }

    /**
     * Envia un post al backend para la creacion de un pedido
     * @param pedido
     * @returns 
     */
    public HacerPedido(pedido: any): Observable<any> {
        return this.http.post<Observable<any>>(this.url + '/hacerpedido', pedido);
    }
}