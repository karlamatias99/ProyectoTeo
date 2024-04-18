import { Component, ElementRef, ViewChild } from '@angular/core';
import { PublicacionService } from '../../servicios/publicacion.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { MensajeService } from '../../servicios/mensajes.service';
import { MensajesComponent } from '../../mensajes/mensajes.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DatosPublicacionService } from '../../servicios/datosPublicacion.service';
import { ConversionMonedaService } from '../../servicios/conversion-moneda.service';
import { MonedaService } from '../../servicios/moneda.service';
import { PedidosService } from '../../servicios/pedidos.service';
import { UsuarioService } from '../../servicios/usuario.service';

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, FormsModule],
  templateUrl: './compras.component.html',
  styleUrl: './compras.component.css'
})
export class ComprasComponent {
  @ViewChild('xButton') xButton!: ElementRef;
  public formPublicacion: FormGroup;
  cantidadProductos: number = 0;
  publicaciones: any[] = [];
  compras: any[] = [];
  lista: any[] = [];
  Valor: number = 0;
  valorTotal: number = 0;
  usuario: string;
  usuario_vendedor!: string;
  searchForm: FormGroup;
  tarjetaForm: FormGroup;
  pedidoForm: FormGroup;
  mostrarVentana: boolean = false;

  productosCompra: any;
  total: any;
  numero: any;
  contenedorCompra: any;
  informacionCompra: any;

  mostrarVentanaTarjeta: boolean = false;
  mostrarVentanaPedido: boolean = false;
  totalEnMonedaSistema: number | undefined;

  cantidadLocal: number | undefined;
  cantidadConvertida: number | null = null;

  mostrarQueComprar: boolean = true;
  mostrarPublicaciones: boolean = true; // Variable para mostrar/ocultar las publicaciones
  mostrarFormularioConversion: boolean = false; // Variable para mostrar/ocultar el formulario de conversión de moneda
  mostrarVentanaCompraCacaos: boolean = false;
  cantidadAConvertir!: number; // Variable para almacenar la cantidad a convertir
  public mensajeCreate: any;

  num_tarjeta: string | undefined; // Variable para almacenar el número de tarjeta
  nombre_usuario: string | undefined; // Variable para almacenar el nombre de usuario de la tarjeta
  vencimiento: string | undefined; // Variable para almacenar la fecha de vencimiento de la tarjeta
  cvv: number | undefined; // Variable para almacenar el CVV de la tarjeta

  public banderaErrorCreate: any;
  public banderaAciertoCreate: any;
  MonedasUsuario!: number;
  mostrarMonedasDiv = false;

  showCompra: boolean = false;
  mostrarFormularioPedido: boolean | undefined;

  constructor(private formBuilder: FormBuilder, private publicacionService: PublicacionService,
    private MensajeService: MensajeService, public dialog: MatDialog, private router: Router,
    private cookiesService: CookieService, private datosPublicacionService: DatosPublicacionService,
    private convertirMonedas: ConversionMonedaService,
    private monedaService: MonedaService, private pedidoService: PedidosService, private usuarioService: UsuarioService) {

    this.formPublicacion = this.formBuilder.group({

      titulo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      fecha_publicacion: ['', [Validators.required]],
      tipo_publicacion: ['', [Validators.required]],
      imagen: ['', [Validators.required]],
      usuario_publicacion: ['', [Validators.required]],
    });

    this.searchForm = this.formBuilder.group({
      nombreProducto: ['']
    });

    this.tarjetaForm = this.formBuilder.group({
      num_tarjeta: [''],
      nombre_usuario: [''],
      vencimiento: [''],
      cvv: ['']
    });

    this.pedidoForm = this.formBuilder.group({
      usuario_comprador: [''],
      direccion: [''],
      telefono: [''],
    });

    this.usuario = this.cookiesService.get('usuario');
    console.log(this.usuario);

  }


  ngOnInit(): void {
    // Llama al servicio para obtener las publicaciones cuando el componente se inicializa
    this.obtenerPublicaciones();
    //this.obtenerPublicacionesCompras();
  }

  abrirVentana(): void {
    this.showCompra = false;
    this.mostrarVentanaTarjeta = false; // Cerrar ventana de tarjeta
    this.mostrarVentanaPedido = false; // Cerrar ventana de pedido
    this.mostrarVentana = true; // Abrir ventana de compra
    this.mostrarProductosCarrito();

  }
  cerrarVentana(): void {
    this.mostrarVentanaTarjeta = false;
    this.mostrarVentana = true; // Por ejemplo, establece mostrarVentana a falso
  }


  mostrarComprar(): void {
    this.mostrarFormularioConversion = false;
    this.mostrarPublicaciones = false;
    this.mostrarQueComprar = true;
    this.showCompra = true;

  }

  mostrarCuenta() {
    this.mostrarMonedas()
  }

  abrirVentanaTarjeta(): void {
    this.showCompra = false;
    this.mostrarVentanaTarjeta = true; // Cerrar ventana de tarjeta
    this.mostrarVentanaPedido = false; // Cerrar ventana de pedido
    this.mostrarVentana = false; // Abrir ventana de compra

  }

  abrirVentanaPedido(): void {

    this.mostrarVentanaPedido = true;
    // Realizar la conversión del total a cacaos (si aún no se ha hecho)
    this.total;
    // Realizar la conversión del total en cacaos a la moneda del sistema
    this.totalEnMonedaSistema = this.convertirCacaosAMonedaSistema(this.total);
    console.log(this.totalEnMonedaSistema);
    // Mostrar la ventana de pedido
    this.mostrarVentanaPedido = true;
    this.mostrarVentana = false;
    this.showCompra = false;

  }

  // Método para mostrar el formulario de conversión de moneda
  mostrarFormConversion() {
    this.mostrarQueComprar = false;
    this.mostrarFormularioConversion = true;
    this.mostrarPublicaciones = false;
    this.showCompra = false;
    this.mostrarMonedasDiv = false;
  }

  comprarCacaos() {
    this.mostrarVentanaCompraCacaos = true;

  }

  comprarMonedas() {
    // Volver banderas de confirmación a false
    this.banderaAciertoCreate = false;
    this.showCompra = false;
    this.banderaErrorCreate = false;

    // Obtener el número de tarjeta ingresado por el usuario
    const num_tarjeta = this.num_tarjeta;

    // Verificar si existe una tarjeta almacenada en la base de datos que coincida con la ingresada por el usuario
    this.convertirMonedas.verificarTarjeta(num_tarjeta).subscribe((respuesta) => {
      if (respuesta && respuesta.estado) {
        // Si la tarjeta existe, realizar la compra de monedas
        // Obtener la cantidad de monedas a comprar
        const cantidadAConvertir = this.cantidadAConvertir;

        // Multiplicar la cantidad de monedas por 5
        const cantidad_moneda = cantidadAConvertir * 5;

        // Crear el objeto con los datos de la compra de monedas
        const compraMonedas = {
          usuario_monedas: this.usuario,
          cantidad_moneda: cantidad_moneda,
          tarjeta: num_tarjeta
        };

        console.log('Datos enviados para almacenar Tarjeta:', compraMonedas);
        // Utilizar el servicio para realizar la compra de monedas
        this.monedaService.comprarMonedas(compraMonedas).subscribe((respuestaCompra) => {
          if (respuestaCompra && respuestaCompra.estado) {
            // Si la compra se realizó correctamente, establecer la bandera de éxito
            this.banderaAciertoCreate = true;
            window.alert('Monedas compradas exitosamente');
            this.num_tarjeta = ''; // Limpiar el campo de número de tarjeta
            this.cantidadAConvertir = NaN;
          } else {
            // Si hubo un error en la transacción, establecer la bandera de error
            this.banderaErrorCreate = true;
            window.alert('Error al realizar la transacción: ' + respuestaCompra.respuesta);
          }
        });
      } else {
        // Si no se encontró la tarjeta en la base de datos, mostrar un mensaje de error
        window.alert('La tarjeta ingresada no existe en la base de datos');
      }
    });

  }


  cerrarVentanaCompraCacaos() {
    this.mostrarVentanaCompraCacaos = false;
    this.mostrarFormularioConversion = true;
  }

  // Método para mostrar las publicaciones y ocultar el formulario de conversión de moneda
  mostrarPublish() {
    this.mostrarQueComprar = false;
    this.mostrarPublicaciones = true;
    this.showCompra = false;
    this.mostrarFormularioConversion = false;
    this.mostrarMonedasDiv = false;
  }

  // Método para convertir cacaos a la moneda del sistema
  convertirCacaosAMonedaSistema(totalEnCacaos: number): number {
    return totalEnCacaos;
  }



  cerrarVentanaPedido(): void {
    this.mostrarFormularioPedido = false;
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
    const id = publicacion.id_publicacion; 
    const remuneracion = publicacion.remuneracion;
    const usuario_publicador = publicacion.usuario_publicacion;
    const fecha_inicio = publicacion.fecha_inicio;
    const fecha_fin = publicacion.fecha_fin;
    this.router.navigate(['/voluntariado', id, remuneracion, usuario_publicador, fecha_inicio, fecha_fin]);
    //this.router.navigate(['/voluntariado']);
    console.log('Aplicar a voluntariado:', publicacion);

  }

  // Función para agregar al carrito
  comprar(id_publicacion: number, titulo_publicacion: string, imagen: Blob, precio_local: number, precio_sistema: number, usuario_publicacion: string): void {
    const productoCompra = { titulo_publicacion, imagen, precio_local, precio_sistema };
    this.lista.push(productoCompra);
    this.cantidadProductos = this.lista.length; // Actualizar la cantidad de productos en el carrito
    this.usuario_vendedor = usuario_publicacion;
    console.log(this.usuario_vendedor);
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

  registrarPedido(): void {
    // Extraer los valores del formulario
    const direccion = this.pedidoForm.controls['direccion'].value;
    const telefono = this.pedidoForm.controls['telefono'].value;

    // Verificar si el usuario comprador tiene suficiente saldo para realizar el pedido
    if (this.total <= this.MonedasUsuario) {
      // Realizar el pedido
      let nuevoPedido = {
        monto_sistema: this.total,
        usuario_comprador: this.usuario,
        direccion: direccion,
        telefono: telefono
      };

      // Llamar al servicio para registrar el pedido
      this.pedidoService.HacerPedido(nuevoPedido).subscribe(
        (respuesta) => {
          // Manejar la respuesta del servidor si es necesario
          console.log(respuesta);
        },
        (error) => {
          // Manejar cualquier error que ocurra durante la solicitud
          console.error('Error al registrar pedido:', error);
        }
      );
    } else {
      window.alert('No tienes suficientes cacaos para realizar el pedido');
    }
  }


  registrarTarjeta(): void {
    // Volver banderas de confirmación a false
    this.banderaAciertoCreate = false;
    this.banderaErrorCreate = false;

    // Obtener los valores del formulario
    const num_tarjeta = this.tarjetaForm.controls['num_tarjeta'].value;
    const nombre_usuario = this.tarjetaForm.controls['nombre_usuario'].value;
    const vencimiento = this.tarjetaForm.controls['vencimiento'].value;
    const cvv = this.tarjetaForm.controls['cvv'].value;


    // Crear un objeto con los campos relevantes para crear un usuario
    const nuevaTarjeta = {
      num_tarjeta: num_tarjeta,
      nombre_usuario: nombre_usuario,
      vencimiento: vencimiento,
      cvv: cvv,
      usuario: this.usuario
    };

    console.log('Datos enviados para almacenar Tarjeta:', nuevaTarjeta);
    // Utilizar el servicio para la creación de un usuario
    this.convertirMonedas.registrarTarjeta(nuevaTarjeta).subscribe((r) => {
      console.log('Respuesta del servidor:', r); // Agrega esta línea
      if (r && r.estado) {
        this.banderaAciertoCreate = true;
        window.alert('Usuario creado exitosamente');
      } else {
        this.banderaErrorCreate = true;
        window.alert('Error al crear usuario' + r.respuesta);
        //this.mensajeCreate = 'Error al crear usuario: ' + r.respuesta;
      }

      this.mensajeCreate = r.respuesta;
    });
  }


  calcularTotalCarrito(): number {
    this.total = 0;
    this.lista.forEach(producto => {
      this.total += producto.precio_sistema; // Suma el precio de cada producto
    });
    return this.total;
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



  public crearPublicacion(): void {
    //extraer los valores de las propiedades del juego de los componentes del form
    const titulo = this.formPublicacion.controls['titulo'].value;
    const descripcion = this.formPublicacion.controls['descripcion'].value;
    const tipo_publicacion = this.formPublicacion.controls['tipo_publicacion'].value;
    const imagen = this.formPublicacion.controls['imagen'].value;


    let nuevaPublicacion = new Object({
      usuario_publicacion: this.usuario,
      titulo: titulo,
      descripcion: descripcion,
      tipo_publicacion: tipo_publicacion,
      imagen: imagen,
    });
    console.log('Datos enviados para crear compra:', nuevaPublicacion);
    this.publicacionService.crearPublicacionCompra(nuevaPublicacion).subscribe((r) => {
      if (r.estado) {
        window.alert('Publicacion creada exitosamente');
        //alert(r.respuesta + '\nEl código de la publicación es ' + r.id_publicacion); //mostramos el mensaje de confirmacion
        // Borramos los campos del formulario después de que la publicación se haya creado con éxito
        this.formPublicacion.reset();
      } else {
        window.alert('Error al crear publicacion' + r.respuesta);
      }
      this.mensajeCreate = r.respuesta;
    });
    this.obtenerPublicacionesCompras();
  }


  obtenerPublicacionesCompras(): void {
    this.publicacionService.mostrarPublicacionCompras().subscribe(
      (data) => {
        this.compras = data;
      },
      (error) => {
        console.error('Error al obtener las publicaciones:', error);
      }
    );
    this.mostrarQueComprar = true;
    this.mostrarFormularioConversion = false;
    this.mostrarPublicaciones = false;
    this.showCompra = true;
    this.mostrarMonedasDiv = false;

  }

  mostrarMonedas() {
    console.log(this.usuario);
    // Llama al servicio para obtener las monedas del usuario logueado
    this.monedaService.mostrarMonedas(this.usuario).subscribe(
      (data: any[]) => {
        console.log(data);
        // Asigna las monedas del usuario al arreglo
        this.MonedasUsuario = data[0].cantidad_total_monedas;

        this.mostrarMonedasDiv = true;
      },
      (error) => {
        console.error('Error al obtener las monedas del usuario:', error);
      }
    );
    this.mostrarQueComprar = false;
    this.mostrarFormularioConversion = false;
    this.mostrarPublicaciones = false;
    this.showCompra = false;
  }


  abrirFormularioPedido(): void {
    this.mostrarFormularioPedido = true;
  }

  finalizarCompra() {
    console.log('Valor de this.totalEnMonedaSistema:', this.total);
    console.log('Valor monedas usuario:', this.MonedasUsuario);
    // Verificar si this.totalEnMonedaSistema es un número
    if (typeof this.total === 'number') {
      // Verificar si el usuario tiene suficientes cacaos para realizar la compra
      if (this.total <= this.MonedasUsuario) { // Acceder al primer elemento del array
        // Realizar la compra de la publicación
        this.registrarPedido();
        // Actualizar la cantidad de cacaos del usuario restando el total de la compra
        const cantidadRestante = this.MonedasUsuario - this.total;
        const cantidadSumada = this.MonedasUsuario - this.total;// Acceder al primer elemento del array
        // Llamar al servicio para actualizar la cantidad de cacaos del usuario en la base de datos
        this.usuarioService.editarSaldo(this.usuario, cantidadRestante).subscribe(
          (respuesta) => {
            if (respuesta) {
              // Si la actualización fue exitosa, mostrar un mensaje de éxito
              window.alert('Compra realizada exitosamente');
              // Vaciar el carrito después de realizar la compra
              this.vaciarCarrito();
              // Cerrar la ventana de compra
              this.cerrarVentanaCompra();
            } else {
              // Si hubo un error en la actualización, mostrar un mensaje de error
              window.alert('Error al actualizar la cantidad de cacaos');
            }
          },
          (error) => {
            console.error('Error al actualizar la cantidad de cacaos del usuario:', error);
            window.alert('Error al actualizar la cantidad de cacaos');
          }
        );
        this.usuarioService.getSaldo(this.usuario_vendedor).subscribe((saldoActual) => {
          console.log(saldoActual);
          // Sumar el monto del pedido al saldo actual
          const nuevoSaldo = saldoActual + this.total;

          // Actualizar el saldo del usuario de la publicación en la base de datos
          this.usuarioService.editarSaldo(this.usuario_vendedor, nuevoSaldo).subscribe(() => {
            // Aquí puedes continuar con el proceso de realizar el pedido
            // ...
          }, (error) => {
            console.error('Error al actualizar el saldo del usuario de la publicación:', error);
            window.alert('Error al actualizar el saldo del usuario de la publicación');
          });
        }, (error) => {
          console.error('Error al obtener el saldo del usuario de la publicación:', error);
          window.alert('Error al obtener el saldo del usuario de la publicación');
        });
      } else {
        // Si el usuario no tiene suficientes cacaos para realizar la compra, mostrar un mensaje de error
        window.alert('No tienes suficientes cacaos para realizar la compra');
      }
    } else {
      // Si this.totalEnMonedaSistema no es un número, mostrar un mensaje de error
      window.alert('El total en moneda del sistema no está definido o no es un número');
    }
  }


  cerrarSesion() {
    this.router.navigate(['/login']);
  }

}