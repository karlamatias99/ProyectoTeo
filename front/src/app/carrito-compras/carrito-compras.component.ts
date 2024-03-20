import { Component } from '@angular/core';
import { PublicacionService } from '../../servicios/publicacion.service';

@Component({
  selector: 'app-carrito-compras',
  standalone: true,
  imports: [],
  templateUrl: './carrito-compras.component.html',
  styleUrl: './carrito-compras.component.css'
})
export class CarritoComprasComponent {
  
  publicacion: any[] = [];
  constructor(private publicacionService: PublicacionService) {

  }

  buscarProducto() {
    const input = (document.getElementById('busqueda') as HTMLInputElement).value;
    this.publicacionService.buscarPublicacion(input)
      .subscribe(
        data => {
          // Llama a la función para mostrar productos con los datos obtenidos
          this.mostrarProductos(data);
        },
        error => {
          console.error('Error:', error);
          alert('No se encontró el producto');
        }
      );
  }

   // Función para mostrar productos
   mostrarProductos(publicacion: any[]) {
    this.publicacion = publicacion; // Asigna los productos obtenidos al array de productos del componente
  }

  eliminarCarrito() {
    // Implementa la lógica para eliminar todos los productos del carrito
  }

  abrirVentana() {
    // Implementa la lógica para abrir la ventana emergente de ingreso de tarjeta
  }

  abrirVentanaPedido() {
    // Implementa la lógica para abrir la ventana emergente de finalizar compra
  }

  cerrarVentana() {
    // Implementa la lógica para cerrar la ventana emergente
  }

  guardarTarjeta() {
    // Implementa la lógica para guardar la tarjeta de crédito/débito
  }

  realizarPedido() {
    // Implementa la lógica para realizar el pedido
  }

  cerrarVentanaPedido() {
    // Implementa la lógica para cerrar la ventana emergente de pedido
  }
}
