import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UsuarioComponent } from './usuario/usuario.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, UsuarioComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
 
})
export class AppComponent {
  title = 'front';
}