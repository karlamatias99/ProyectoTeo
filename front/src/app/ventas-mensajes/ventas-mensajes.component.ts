import { Component, Inject, Input, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MensajeService } from '../../servicios/mensajes.service';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { NgClass, NgFor } from '@angular/common';
import { PublicacionService } from '../../servicios/publicacion.service';

@Component({
  selector: 'app-ventas-mensajes',
  standalone: true,
  imports: [FormsModule, NgClass, NgFor],
  templateUrl: './ventas-mensajes.component.html',
  styleUrls: ['./ventas-mensajes.component.css']
})
export class MensajesVendedorComponent implements OnDestroy {
  @Input() idPublicacion: number | undefined;
  @Input() usuario: string;
  mensaje: string = '';
  mensajes: any[] = [];
  mensajesEnviados: any[] = [];
  mensajesRecibidos: any[] = [];
  subscription: Subscription = new Subscription();
  ultimoRemitente: number | undefined;
  private emisores: number | undefined;

  constructor(
    private mensajeService: MensajeService,
    private cookiesService: CookieService,
    private publicacionService: PublicacionService
  ) {
    this.usuario = this.cookiesService.get('usuario')
    console.log('ID del usuario receptor:', this.usuario);
    //console.log(this.idPublicacion);

  }

  ngOnInit(): void {
    //console.log('Obteniendo mensajes...');
    this.mensajesEnviados = [];
    this.mensajesRecibidos = [];
    this.obtenerIdDeLaPublicacion();
    this.obtenerMensajes();
  }



  obtenerIdDeLaPublicacion(): void {
    this.publicacionService.obtenerIdPublicacion(this.usuario).subscribe(
      (id: number) => {

        this.idPublicacion = id;
        console.log(this.idPublicacion);

        //console.log('ID de la publicación:', id);
      },
      error => {
        console.error('Error al obtener el ID de la publicación:', error);
      }
    );
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  obtenerMensajes(): void {
    // Obtener los mensajes enviados por el usuario
    this.subscription.add(this.mensajeService.obtenerMensajesEnviados(this.usuario, this.idPublicacion).subscribe(
      (mensajesEnviados: any[]) => {
        this.mensajesEnviados = mensajesEnviados;
        // Obtener los emisores de los mensajes enviados
        this.obtenerEmisores(mensajesEnviados);
      },
      (error) => {
        console.error('Error al cargar los mensajes enviados del usuario:', error);
      }
    ));

    // Obtener los mensajes recibidos por el usuario
    this.mensajeService.obtenerMensajesReceptor(this.usuario).subscribe((mensajesRecibidos: any[]) => {
      this.mensajesRecibidos = mensajesRecibidos;
      // Obtener los emisores de los mensajes recibidos
      this.obtenerEmisores(mensajesRecibidos);
    }, error => {
      console.error('Error al cargar los mensajes del usuario receptor:', error);
    });
  }

  // Método para obtener los emisores de los mensajes y almacenarlos
  private obtenerEmisores(mensajes: any[]): void {
    mensajes.forEach(mensaje => {
      // Accede al emisor del mensaje y almacénalo en la variable 'emisores'
      this.emisores = mensaje.usuario_emisor;
      // Aquí puedes acceder al emisor del mensaje y almacenarlo como necesites
      console.log('Emisor del mensaje:', mensaje.usuario_emisor);
      // Puedes almacenar esta información en un array o donde sea necesario para su uso posterior
    });
  }




  enviarMensaje(): void {
    // Verifica si el mensaje está vacío
    if (!this.mensaje.trim()) {
      console.error('El mensaje está vacío.');
      return;
    }

    const emisor = this.emisores;

    // Envía el mensaje
    const mensajeData = {
      usuario_receptor: emisor,
      usuario_emisor: this.usuario,
      mensaje: this.mensaje,
      publicacion_mensaje: this.idPublicacion
    };
    console.log(mensajeData);

    this.mensajeService.enviarMensaje(mensajeData).subscribe(
      (response) => {
        console.log('Mensaje enviado correctamente:', response);
        this.mensaje = ''; // Limpia el campo de mensaje después de enviar
        // Actualiza la lista de mensajes
        this.obtenerMensajes();
      },
      (error) => {
        console.error('Error al enviar el mensaje:', error);
      }
    );
  }


}
