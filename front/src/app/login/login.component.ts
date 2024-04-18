import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UsuarioService } from '../../servicios/usuario.service';
import { CommonModule, NgIf } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']

})

export class LoginComponent implements OnInit {
  public formLogin: FormGroup;
  public formRegistro: FormGroup;


  public mensajeLogin: any;
  public mensajeCreate: any;

  public banderaErrorLogin: any;
  public banderaAciertoLogin: any;

  public banderaErrorCreate: any;
  public banderaAciertoCreate: any;
  contenedor: HTMLElement = {} as HTMLElement; // Inicialización con un objeto vacío
  formulario_login: HTMLElement = {} as HTMLElement;
  formulario_registro: HTMLElement = {} as HTMLElement;
  parteFijaLogin: HTMLElement = {} as HTMLElement;
  parteFijaRegistro: HTMLElement = {} as HTMLElement;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private cookiesService: CookieService
  ) {
    this.formLogin = this.formBuilder.group({
      correo: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.minLength(1),
          Validators.maxLength(256),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100),
        ],
      ],
    });

    //iniciando el formulario de registro
    this.formRegistro = this.formBuilder.group({
      nombre_usuario: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(256),
        ],
      ],
      correo: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.minLength(1),
          Validators.maxLength(256),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100),
        ],
      ],
      password2: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100),
        ],
      ],
      rol: ['', [Validators.required]],
    });
  }

  public login(): void {
    // Restablecer las banderas de confirmación
    this.banderaAciertoLogin = false;
    this.banderaErrorLogin = false;

    // Utilizar el servicio para iniciar sesión
    this.usuarioService.login(this.formLogin.value).subscribe((respuesta) => {
      if (respuesta.estado) {
        // Si el estado es true, el usuario está autenticado correctamente
        let usuario = respuesta.respuesta.correo;
        //console.log('Correo del usuario:', usuario);
        this.cookiesService.set('usuario', usuario);
        // Redirigir a la página correspondiente según el rol del usuario
        if (respuesta.respuesta.rol == 'Vendedor') {
          this.router.navigate(['/ventas']);
        } else if (respuesta.respuesta.rol == 'Comprador') {
          this.router.navigate(['/compras']);
        } else if (respuesta.respuesta.rol == 'Administrador') {
          this.router.navigate(['/administracion']);
        }
      } else {
        // Si el estado es false, hubo un error al iniciar sesión
        if (respuesta.respuesta === 'No tiene permiso para iniciar sesión. Su cuenta está pendiente o bloqueada.') {
          // Si el mensaje indica que el usuario está pendiente o bloqueado, mostrar un mensaje especial
          this.banderaErrorLogin = true;
          this.mensajeLogin = 'Su cuenta está pendiente o bloqueada. Por favor, espere a que sea aprobada o contacte al administrador.';
        } else {
          // Si no, mostrar el mensaje de error recibido del servidor
          this.banderaErrorLogin = true;
          this.mensajeLogin = respuesta.respuesta;
        }
      }
    }, (error: HttpErrorResponse) => {
      // Manejo de errores HTTP
      if (error.status === 401) {
        this.banderaErrorLogin = true;
        this.mensajeLogin = 'Credenciales incorrectas.';
      } else if (error.status === 403) {
        // Si el servidor devuelve un 403 Forbidden
        this.banderaErrorLogin = true;
        this.mensajeLogin = 'No tiene permiso para iniciar sesión. Su cuenta está pendiente o bloqueada.';

      } else {
        this.banderaErrorLogin = true;
        this.mensajeLogin = 'Error del servidor al autenticar al usuario.';
      }
    });
  }



  public crearUsuario(): void {
    // Volver banderas de confirmación a false
    this.banderaAciertoCreate = false;
    this.banderaErrorCreate = false;

    // Obtener los valores del formulario
    const nombre_usuario = this.formRegistro.controls['nombre_usuario'].value;
    const correo = this.formRegistro.controls['correo'].value;
    const password1 = this.formRegistro.controls['password'].value;
    const password2 = this.formRegistro.controls['password2'].value;
    const rol = this.formRegistro.controls['rol'].value;

    // Verificar si las dos contraseñas son iguales
    if (password1 !== password2) {
      this.banderaErrorCreate = true;
      this.mensajeCreate = 'Las contraseñas no coinciden.';
      return;
    }

    // Crear un objeto con los campos relevantes para crear un usuario
    const nuevoUsuario = {
      nombre_usuario: nombre_usuario,
      correo: correo,
      password: password1,
      rol: rol
    };

    console.log('Datos enviados para crear usuario:', nuevoUsuario);
    // Utilizar el servicio para la creación de un usuario
    this.usuarioService.crearUsuario(nuevoUsuario).subscribe((r) => {
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

  ngOnInit(): void {
    this.contenedor = document.querySelector('.Login_Registro') as HTMLElement;
    this.formulario_login = document.querySelector(
      '.FormularioLogin'
    ) as HTMLElement;
    this.formulario_registro = document.querySelector(
      '.FormularioRegistro'
    ) as HTMLElement;
    this.parteFijaLogin = document.querySelector('.login') as HTMLElement;
    this.parteFijaRegistro = document.querySelector('.registro') as HTMLElement;
  }

  cambioARegistro() {
    this.formulario_registro.style.display = 'block';
    this.contenedor.style.left = '410px';
    this.formulario_login.style.display = 'none';
    this.parteFijaRegistro.style.opacity = '0';
    this.parteFijaLogin.style.opacity = '1';
  }

  cambioAInciarSesion() {
    this.formulario_login.style.display = 'block';
    this.contenedor.style.left = '10px';
    this.formulario_registro.style.display = 'none';
    this.parteFijaRegistro.style.opacity = '1';
    this.parteFijaLogin.style.opacity = '0';
  }



  ingresarComoVisitante(){
    this.router.navigate(['/visitante']);
  }
}