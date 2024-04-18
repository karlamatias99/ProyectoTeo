import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario.service';
import { PublicacionService } from '../../servicios/publicacion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administrador',
  standalone: true,
  imports: [NgFor, NgIf, NgClass],
  templateUrl: './administrador.component.html',
  styleUrl: './administrador.component.css'
})
export class AdministradorComponent {
  usuarios: any[] = [];
  publicaciones: any[] = [];
  showUsers: boolean = false;
  showPublications: boolean = false;

  constructor(
    private userService: UsuarioService,
    private publicationService: PublicacionService,
    private router: Router
  ) { }

  ngOnInit() {
    // Cuando el componente se inicializa, recuperar los datos de la base de datos
    this.getUsers();
    this.getPublications();
  }

  // Método para obtener los usuarios desde la base de datos
  getUsers() {
    this.userService.getUser().subscribe((data: any) => {
      this.usuarios = data;
    });
  }

  // Método para obtener las publicaciones desde la base de datos
  getPublications() {
    this.publicationService.mostrarPublicacion().subscribe((data: any) => {
      this.publicaciones = data;
    });
  }

  // Métodos para mostrar los usuarios y las publicaciones
  showUserSection() {
    this.showUsers = true;
    this.showPublications = false;
  }

  showPublicationSection() {
    this.showUsers = false;
    this.showPublications = true;
  }

  //Metodos para rechazar, aprobar o dejar pendiente los usuarios y las publicaciones 
  rechazarUsuario(correo: string) {
    const publicacion = { id_usuario: correo, estado: 'Rechazado' }; 
    this.userService.editarUsuario(correo, publicacion).subscribe(
      response => {
        console.log('Publicación aprobada exitosamente');
        this.getUsers();
      },
      error => {
        console.error('Error al aprobar publicación:', error);
      }
    );
  }

  aprobarUsuario(correo: string) {
    const publicacion = { id_usuario: correo, estado: 'Aprobado' };
    this.userService.editarUsuario(correo, publicacion).subscribe(
      response => {
        console.log('Publicación aprobada exitosamente');
        this.getUsers();
      },
      error => {
        console.error('Error al aprobar publicación:', error);
      }
    );
  }

  pendienteUsuario(correo: string) {
    const publicacion = { id_usuario: correo, estado: 'Pendiente' }; // Cambiado 'usuario' a 'publicacion' para reflejar el contexto
    this.userService.editarUsuario(correo, publicacion).subscribe(
      response => {
        console.log('Publicación aprobada exitosamente');
        this.getUsers();
      },
      error => {
        console.error('Error al aprobar publicación:', error);
      }
    );
  }

  rechazarPublicacion(id: number) {
    const publicacion = { id_usuario: id, estado: 'Rechazado' };
    this.publicationService.editarPublicacion(id, publicacion).subscribe(
      response => {
        console.log('Usuario rechazado exitosamente');
        this.getPublications();
      },
      error => {
        console.error('Error al rechazar usuario:', error);
      }
    );
  }

  aprobarPublicacion(id: number) {
    const publicacion = { id_usuario: id, estado: 'Aprobado' };
    this.publicationService.editarPublicacion(id, publicacion).subscribe(
      response => {
        console.log('Usuario rechazado exitosamente');
        this.getPublications();
      },
      error => {
        console.error('Error al rechazar usuario:', error);
      }
    );
  }

  pendientePublicacion(id: number) {
    const publicacion = { id_usuario: id, estado: 'Pendiente' };
    this.publicationService.editarPublicacion(id, publicacion).subscribe(
      response => {
        console.log('Usuario rechazado exitosamente');
        this.getPublications();
      },
      error => {
        console.error('Error al rechazar usuario:', error);
      }
    );
  }

  cerrarSesion() {
    this.router.navigate(['/login']);
  }
}
