import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { PublicacionService } from '../../servicios/publicacion.service';
import { MensajesComponent } from '../../mensajes/mensajes.component';
import { MatDialog } from '@angular/material/dialog';
import { MensajesVendedorComponent } from '../ventas-mensajes/ventas-mensajes.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ventas',
  standalone: true,
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css',
  imports: [NgIf, FormsModule, ReactiveFormsModule, NgFor, MensajesVendedorComponent, NgClass]
})
export class VentasComponent {

  @Input() idPublicacion: number | undefined;
  public formPublicacion: FormGroup;
  public formEditar: FormGroup;
  usuario_publicacion: string;
  publicaciones: any[] = [];
  public mostrarMensajes: boolean = false;
  public mensajeCreate: any;
  publicacionesUsuario: any[] = [];


  constructor(
    private formBuilder: FormBuilder,
    private cookiesService: CookieService,
    private publicacionService: PublicacionService,
    public dialog: MatDialog,
    private router: Router
  ) {
    //obtener el usuario 

    this.usuario_publicacion = this.cookiesService.get('usuario');
    //inicializamos el formulario
    this.formPublicacion = this.formBuilder.group({

      titulo_publicacion: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      precio_local: [''],
      precio_sistema: [''],
      fecha_publicacion: ['', [Validators.required]],
      tipo_publicacion: ['Venta', Validators.required],
      imagen: ['', [Validators.required]],
      usuario_publicacion: ['', [Validators.required]],
      fecha_inicio: [''], // Campo opcional
      fecha_fin: [''], // Campo opcional
      remuneracion: [''] // Campo opcional
    });

    //inicializamos el formulario para editar
    this.formEditar = this.formBuilder.group({

      titulo_publicacion: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      precio_local: [''],
      precio_sistema: [''],
      fecha_publicacion: ['', [Validators.required]],
      tipo_publicacion: ['', [Validators.required]],
      imagen: ['', [Validators.required]],
      usuario_publicacion: ['', [Validators.required]],
      fecha_inicio: [''], // Campo opcional
      fecha_fin: [''], // Campo opcional
      remuneracion: [''] // Campo opcional
    });
  }

  ngOnInit(): void {
    this.obtenerIdDeLaPublicacion();
  }


  obtenerIdDeLaPublicacion(): void {
    console.log(this.usuario_publicacion);
    this.publicacionService.obtenerIdPublicacion(this.usuario_publicacion).subscribe(
      (id: number) => {
        this.idPublicacion = id;
        //console.log(typeof this.idPublicacion);
        //console.log('ID de la publicación:', id);
      },
      error => {
        console.error('Error al obtener el ID de la publicación:', error);
      }
    );
  }

  mostrarPublicacionesUsuario() {
    console.log(this.usuario_publicacion);
    // Llama al servicio para obtener las publicaciones del usuario logueado
    this.publicacionService.mostrarPublicacionPorUsuario(this.usuario_publicacion).subscribe(
      (data: any[]) => {
        console.log(data);
        // Asigna las publicaciones del usuario al arreglo
        this.publicacionesUsuario = data;
      },
      (error) => {
        console.error('Error al obtener las publicaciones del usuario:', error);
      }
    );
    this.showPublish = false;
    this.showEdit = false;
    this.mostrarMensajes = false;
  }

  crearPublicacion(): void {
    // Obtener los valores del formulario
    const nuevaPublicacion = this.formPublicacion.value;

    // Agregar el usuario de la publicación que está en la sesión
    nuevaPublicacion.usuario_publicacion = this.usuario_publicacion;

    // Crear un nuevo objeto con los campos específicos para voluntariado
    const datosOrdenados = {
      titulo_publicacion: nuevaPublicacion.titulo_publicacion,
      descripcion: nuevaPublicacion.descripcion,
      precio_local: nuevaPublicacion.precio_local, // Mantener campo para venta
      precio_sistema: nuevaPublicacion.precio_sistema, // Mantener campo para venta
      tipo_publicacion: nuevaPublicacion.tipo_publicacion,
      imagen: nuevaPublicacion.imagen,
      usuario_publicacion: nuevaPublicacion.usuario_publicacion,
      fecha_inicio: nuevaPublicacion.fecha_inicio, // Mantener campo para voluntariado
      fecha_fin: nuevaPublicacion.fecha_fin, // Mantener campo para voluntariado
      remuneracion: nuevaPublicacion.remuneracion, // Mantener campo para voluntariado
      
    };

    // Llamar al servicio para crear la publicación
    console.log('Datos enviados para crear la publicación:', datosOrdenados); // Imprimir datos en la consola
    this.publicacionService.crearPublicacion(datosOrdenados).subscribe((response: any) => {
      if (response.estado) {
        window.alert('Publicación creada exitosamente');
        this.formPublicacion.reset();
      } else {
        window.alert('Error al crear publicación: ' + response.respuesta);
      }
      this.mensajeCreate = response.respuesta;
    });
  }








  public editarPublicacion(): void { }

  showPublish: boolean = false;
  showEdit: boolean = false;

  showPublishForm() {
    this.showPublish = true;
    this.showEdit = false;
    this.mostrarMensajes = false;
    this.publicacionesUsuario = [];
  }

  showEditForm() {
    this.showPublish = false;
    this.showEdit = true;
    this.mostrarMensajes = false;
    this.publicacionesUsuario = [];
  }

  showMessages() {

    this.mostrarMensajes = !this.mostrarMensajes;
    this.showPublish = false;
    this.showEdit = false;
    this.publicacionesUsuario = [];
  }

  cerrarSesion() {
    this.router.navigate(['/login']);
  }

}
