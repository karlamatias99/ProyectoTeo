import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { VentasComponent } from './ventas/ventas.component';
import { ComprasComponent } from './compras/compras.component';
import { CarritoComprasComponent } from './carrito-compras/carrito-compras.component';
import { AdministradorComponent } from './administrador/administrador.component';

export const routes: Routes = [

    { path: '', pathMatch: 'full', redirectTo: 'login' },
    { path: 'login', component: LoginComponent },
    { path: 'ventas', component: VentasComponent },
    { path: 'compras', component: ComprasComponent },
    {path: 'carrito', component: CarritoComprasComponent },
    {path: 'administracion', component: AdministradorComponent },
];