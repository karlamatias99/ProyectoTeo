import { NgFor, NgIf } from '@angular/common';
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
  imports: [NgIf, FormsModule, ReactiveFormsModule, NgFor, MensajesVendedorComponent]
})
export class VentasComponent {

  @Input() idPublicacion: number | undefined;
  public formPublicacion: FormGroup;
  public formEditar: FormGroup;
  usuario_publicacion: number;
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
    //obtener el id del usuario registrado
    this.usuario_publicacion = parseInt(this.cookiesService.get('usuario'), 10);
    //inicializamos el formulario
    this.formPublicacion = this.formBuilder.group({

      titulo_publicacion: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      precio_local: ['', [Validators.required]],
      precio_sistema: ['', [Validators.required]],
      fecha_publicacion: ['', [Validators.required]],
      tipo_publicacion: ['', [Validators.required]],
      imagen: ['', [Validators.required]],
      usuario_publicacion: ['', [Validators.required]],
    });

    //inicializamos el formulario para editar
    this.formEditar = this.formBuilder.group({

      titulo_publicacion: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      precio_local: ['', [Validators.required]],
      precio_sistema: ['', [Validators.required]],
      fecha_publicacion: ['', [Validators.required]],
      tipo_publicacion: ['', [Validators.required]],
      imagen: ['', [Validators.required]],
      usuario_publicacion: ['', [Validators.required]],
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
    this.mostrarMensajes = false
  }

  public crearPublicacion(): void {
    //extraer los valores de las propiedades del juego de los componentes del form
    const titulo_publicacion = this.formPublicacion.controls['titulo_publicacion'].value;
    const descripcion = this.formPublicacion.controls['descripcion'].value;
    const precio_local = this.formPublicacion.controls['precio_local'].value;
    const precio_sistema = this.formPublicacion.controls['precio_sistema'].value;
    const tipo_publicacion = this.formPublicacion.controls['tipo_publicacion'].value;
    const imagen = this.formPublicacion.controls['imagen'].value;


    let nuevaPublicacion = new Object({
      usuario_publicacion: this.usuario_publicacion,
      titulo_publicacion: titulo_publicacion,
      descripcion: descripcion,
      precio_local: precio_local,
      precio_sistema: precio_sistema,
      tipo_publicacion: tipo_publicacion,
      imagen: imagen,
    });
    console.log('Datos enviados para crear usuario:', nuevaPublicacion);
    this.publicacionService.crearPublicacion(nuevaPublicacion).subscribe((r) => {
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
