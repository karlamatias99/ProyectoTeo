import { Component, Inject, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MensajeService } from '../servicios/mensajes.service';
import { CookieService } from 'ngx-cookie-service';
import { NgFor } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mensajes',
  standalone: true,
  imports: [FormsModule, NgFor],
  templateUrl: './mensajes.component.html',
  styleUrl: './mensajes.component.css'
})
export class MensajesComponent implements OnDestroy {

  private usuario: number;
  private publicacion_mensaje: number;
  mensaje: string = '';
  mensajes: any[] = [];
  mensajesEnviados: any[] = [];
  mensajesRecibidos: any[] = [];
  minimized: boolean = false;
  subscription: Subscription = new Subscription;

  constructor(
    public dialogRef: MatDialogRef<MensajesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private MensajeService: MensajeService,
    private cookiesService: CookieService
  ) {
    //obtener el id del usuario registrado
    this.usuario = parseInt(this.cookiesService.get('usuario'), 10);
    this.publicacion_mensaje = data.idPublicacion;
    console.log(this.data.destinatario);
    console.log(this.usuario);
    //console.log(this.data.idPublicacion);
  }


  ngOnInit(): void {
    // Reiniciar los mensajes cada vez que se abre el componente
    this.mensajesEnviados = [];
    this.mensajesRecibidos = [];
    this.obtenerMensajes();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  obtenerMensajes(): void {
    console.log(this.data)
    // Obtener los mensajes enviados por el usuario logueado
    this.subscription = this.MensajeService.obtenerMensajesEnviados(this.usuario, this.data.idPublicacion).subscribe(
      (data) => {
        this.mensajesEnviados = data;
      },
      (error) => {
        console.error('Error al obtener los mensajes enviados:', error);
      }
    );

    // Obtener mensajes recibidos del usuario destinatario
    this.subscription.add(this.MensajeService.obtenerMensajesRecibidos(this.data.destinatario, this.usuario, this.data.idPublicacion).subscribe(
      (data) => {
        this.mensajesRecibidos = data;
      },
      (error) => {
        console.error('Error al obtener los mensajes recibidos:', error);
      }
    ));
  }


  enviarMensaje(): void {
    
    const mensajeData = {
      usuario_receptor: this.data.destinatario,
      usuario_emisor: this.usuario,
      mensaje: this.mensaje,
      publicacion_mensaje: this.publicacion_mensaje
    };

    console.log(mensajeData);
    this.MensajeService.enviarMensaje(mensajeData).subscribe(
      (response) => {
        console.log('Mensaje enviado correctamente:', response);
        //this.dialogRef.close();
        this.mensaje = '';
        this.obtenerMensajes();
      },
      (error) => {
        console.error('Error al enviar el mensaje:', error);
      }
    );
  }




  minimize(): void {
    this.minimized = !this.minimized;
  }

  close(): void {

  }
}
