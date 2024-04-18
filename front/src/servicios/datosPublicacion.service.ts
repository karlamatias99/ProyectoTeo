import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatosPublicacionService {
  private correoPublicacionSource = new BehaviorSubject<string | undefined>(undefined);
  private precioPublicacionSource = new BehaviorSubject<number | undefined>(undefined);

  correoPublicacion$ = this.correoPublicacionSource.asObservable();
  precioPublicacion$ = this.precioPublicacionSource.asObservable();

  constructor() { }

  setCorreoPublicacion(correo: string | undefined) {
    this.correoPublicacionSource.next(correo);
  }

  setPrecioPublicacion(precio: number | undefined) {
    this.precioPublicacionSource.next(precio);
  }
}
