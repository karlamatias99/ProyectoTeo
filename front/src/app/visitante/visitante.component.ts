import { NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PublicacionService } from '../../servicios/publicacion.service';
import { MensajeService } from '../../servicios/mensajes.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { MensajesComponent } from '../../mensajes/mensajes.component';

@Component({
  selector: 'app-visitante',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './visitante.component.html',
  styleUrl: './visitante.component.css'
})
export class VisitanteComponent {
  @ViewChild('xButton') xButton!: ElementRef;
  cantidadProductos: number = 0;
  publicaciones: any[] = [];
  lista: any[] = [];
  Valor: number = 0;
  valorTotal: number = 0;
  private usuario: number;
  searchForm: FormGroup;
  tarjetaForm: FormGroup;
  pedidoForm: FormGroup;
  mostrarVentana: boolean = false;
  productosCompra: any;
  total: any;
  numero: any;
  contenedorCompra: any;
  informacionCompra: any;

  // En el componente Angular
  mostrarVentanaTarjeta: boolean = false;
  mostrarVentanaPedido: boolean = false;
  tituloPublicacion: any;


  constructor(private formBuilder: FormBuilder, private publicacionService: PublicacionService,
    private MensajeService: MensajeService, public dialog: MatDialog, private router: Router,
    private cookiesService: CookieService) {

    this.searchForm = this.formBuilder.group({
      nombreProducto: ['']
    });

    this.tarjetaForm = this.formBuilder.group({
      numeroTarjeta: [''],
      nombreUsuario: [''],
      vencimiento: [''],
      CVV: ['']
    });

    this.pedidoForm = this.formBuilder.group({
      usuarioPedido: [''],
      direccion: [''],
      telefono: [''],
      Tarjeta: ['']
    });

    this.usuario = parseInt(this.cookiesService.get('usuario'), 10);
    console.log(this.usuario);

  }


  ngOnInit(): void {
    // Llama al servicio para obtener las publicaciones cuando el componente se inicializa
    this.obtenerPublicaciones();
  }

  abrirVentana(): void {
    this.mostrarVentanaTarjeta = false; // Cerrar ventana de tarjeta
    this.mostrarVentanaPedido = false; // Cerrar ventana de pedido
    this.mostrarVentana = true; // Abrir ventana de compra
    this.mostrarProductosCarrito();
  }
  cerrarVentana(): void {
    this.mostrarVentanaTarjeta = false;
    this.mostrarVentana = true; // Por ejemplo, establece mostrarVentana a falso
  }

  abrirVentanaTarjeta(): void {
    this.mostrarVentanaTarjeta = true; // Cerrar ventana de tarjeta
    this.mostrarVentanaPedido = false; // Cerrar ventana de pedido
    this.mostrarVentana = false; // Abrir ventana de compra

  }

  abrirVentanaPedido(): void {
    this.mostrarVentanaPedido = true;
  }

  cerrarVentanaPedido(): void {
    this.mostrarVentanaPedido = false;
  }

  cerrarVentanaCompra(): void {
    this.mostrarVentana = false;
  }

  obtenerPublicaciones(): void {
    this.publicacionService.publicacionesAprobadas().subscribe(
      (data) => {
        this.publicaciones = data;
      },
      (error) => {
        console.error('Error al obtener las publicaciones:', error);
      }
    );
  }

  // Función para aplicar a un voluntariado
  aplicar(publicacion: any) {
    console.log('Aplicar a voluntariado:', publicacion);

  }

  // Función para agregar al carrito
  comprar(titulo_publicacion: string, imagen: Blob, precio_local: number): void {
    const productoCompra = { titulo_publicacion, imagen, precio_local };
    this.lista.push(productoCompra);
    this.cantidadProductos = this.lista.length; // Actualizar la cantidad de productos en el carrito
  }

  // Función para mostrar productos
  mostrarProductos(publicacion: any[]) {
    this.publicaciones = publicacion; // Asigna los productos obtenidos al array de productos del componente
  }

  mostrarProductosCarrito(): void {
    this.valorTotal = 0;
  }

  eliminar(indice: number): void {
    this.lista.splice(indice, 1);
    if (this.numero) {
      this.numero.innerHTML = this.lista.length.toString();
      if (this.lista.length === 0) {
        this.numero.classList.remove('diseñoNumero');
      }
    }
    this.cantidadProductos = this.lista.length;
    this.mostrarProductosCarrito();
  }

  eliminarCarrito(): void {
    this.lista = [];
    if (this.numero) {
      this.numero.classList.remove('diseñoNumero');
    }
    this.cantidadProductos = this.lista.length;
    this.mostrarProductosCarrito();
  }


  actualizarValorTotal(): void {
    if (this.total) {
      this.total.textContent = ' Q' + this.Valor;
    }
  }

  registrarPedido() {
    throw new Error('Method not implemented.');
  }
  registrarTarjeta() {
    console.log("Ingresando tarjeta nueva");
  }

  vaciarCarrito(): void {
    this.lista = []; // Vaciar el carrito
    this.cantidadProductos = 0; // Reiniciar la cantidad de productos en el carrito
  }

  abrirVentanaEmergente(publicacion: any): void {
    const destinatario = publicacion.usuario_publicacion;
    const idPublicacion = publicacion.id_publicacion;
    const dialogRef = this.dialog.open(MensajesComponent, {
      width: '400px',
      data: { destinatario, idPublicacion }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  cerrarSesion() {
    this.router.navigate(['/login']);
  }


  buscarProducto(): void {
    const nombreProducto = this.searchForm.value.nombreProducto;
    if (nombreProducto.trim() !== '') {
      this.publicacionService.buscarPublicacion(nombreProducto).subscribe(
        (resultados) => {
          // Manejo de los resultados de la búsqueda3
          this.publicaciones = resultados;
          //console.log('Resultados de búsqueda:', resultados);
          
        },
        (error) => {
          console.error('Error al buscar:', error);
        }
      );
    } else {
      // Si el campo está vacío, puedes mostrar un mensaje o tomar alguna otra acción
      console.log('Por favor ingrese un título de publicación');
    }
  }
}

