import { NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [NgIf],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent {
  showPublish: boolean = false;
  showEdit: boolean = false;

  showPublishForm() {
    this.showPublish = true;
    this.showEdit = false;
  }

  showEditForm() {
    this.showPublish = false;
    this.showEdit = true;
  }
}
