import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VoluntarioService } from '../../servicios/voluntario.service';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatosPublicacionService } from '../../servicios/datosPublicacion.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-voluntariado',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './voluntariado.component.html',
  styleUrl: './voluntariado.component.css'
})
export class VoluntariadoComponent{
  public formVoluntariado: FormGroup;
  usuario_logueado: string;
  public mensajeCreate: any;
  id_publicacion: number | undefined;
  usuario_publicador: string | undefined;
  monto_devolver: number | undefined;
  fecha_inicio: any;
  fecha_fin: any;

  constructor(
    private formBuilder: FormBuilder,
    private voluntarioService: VoluntarioService,
    private router: Router,
    private cookiesService: CookieService,
    private route: ActivatedRoute
  ) {
    this.usuario_logueado = this.cookiesService.get('usuario');
    //iniciando el formulario de registro
    this.formVoluntariado = this.formBuilder.group({
      nombre_voluntario: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(256),
        ],
      ],
      apellido_voluntario: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(256),
        ],
      ],
      edad_voluntario: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(3), // O ajusta según el rango de edades
          Validators.pattern(/^\d+$/) // Asegura que sea un número
        ],
      ],
      genero: ['', [Validators.required]],
      fecha_nacimiento: [
        '',
        [
          Validators.required
        ]
      ],
      telefono: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d+$/), // Asegura que sea un número
          Validators.minLength(10),
          Validators.maxLength(15)
        ],
      ],
    });


  }


  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id_publicacion = params['id'];
      this.monto_devolver = params['precio'];
      this.usuario_publicador = params['usuario_publicador'];
      this.fecha_inicio = params['fecha_inicio'];
      this.fecha_fin = params['fecha_fin'];
      console.log(this.fecha_inicio);
      console.log(this.fecha_fin);
      console.log(this.id_publicacion);
      console.log(this.monto_devolver);
      //console.log(this.usuario_publicador);
      
    });
  }

  public RegistrarVoluntario(): void {

    // Obtener los valores del formulario
    const nombre_voluntario = this.formVoluntariado.controls['nombre_voluntario'].value;
    const apellido_voluntario = this.formVoluntariado.controls['apellido_voluntario'].value;
    const edad_voluntario = this.formVoluntariado.controls['edad_voluntario'].value;
    const genero = this.formVoluntariado.controls['genero'].value;
    const fecha_nacimiento = this.formVoluntariado.controls['fecha_nacimiento'].value;
    const telefono = this.formVoluntariado.controls['telefono'].value;
    const correo_electronico = this.usuario_logueado;
    const usuario_publicador = this.usuario_publicador;
    const monto_devolver = this.monto_devolver;
    const publicacion_voluntariado = this.id_publicacion;
    const fecha_inicio = this.fecha_inicio;
    const fecha_fin = this.fecha_fin;

    // Crear un objeto con los campos relevantes para crear un usuario
    const nuevoVoluntario = {
      nombre_voluntario: nombre_voluntario,
      apellido_voluntario: apellido_voluntario,
      edad_voluntario: edad_voluntario,
      genero: genero,
      fecha_nacimiento: fecha_nacimiento,
      telefono: telefono,
      correo_electronico: correo_electronico,
      usuario_publicador: usuario_publicador,
      monto_devolver: monto_devolver,
      publicacion_voluntariado: publicacion_voluntariado,
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin

    };

    console.log('Datos enviados para crear voluntariado:', nuevoVoluntario);
    this.voluntarioService.registrarVoluntario(nuevoVoluntario).subscribe((r) => {
      if (r.estado) {
        console.log(nuevoVoluntario);
        window.alert('Se a registrado exitosamente en el Voluntariado!');
        //alert(r.respuesta + '\nEl código de la publicación es ' + r.id_publicacion); //mostramos el mensaje de confirmacion
        // Borramos los campos del formulario después de que la publicación se haya creado con éxito
        this.formVoluntariado.reset();
      } else {
        window.alert('Error al crear Voluntariado' + r.respuesta);
      }
      this.mensajeCreate = r.respuesta;
    });
  }

  Regresar(){
    this.router.navigate(['/compras']);
  }
}
