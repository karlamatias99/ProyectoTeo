import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { VentasComponent } from './ventas/ventas.component';
import { ComprasComponent } from './compras/compras.component';
import { CarritoComprasComponent } from './carrito-compras/carrito-compras.component';
import { AdministradorComponent } from './administrador/administrador.component';
import { VisitanteComponent } from './visitante/visitante.component';
import { VoluntariadoComponent } from './voluntariado/voluntariado.component';

export const routes: Routes = [

    { path: '', pathMatch: 'full', redirectTo: 'login' },
    { path: 'login', component: LoginComponent },
    { path: 'ventas', component: VentasComponent },
    { path: 'compras', component: ComprasComponent },
    {path: 'carrito', component: CarritoComprasComponent },
    {path: 'administracion', component: AdministradorComponent },
    {path: 'visitante', component: VisitanteComponent },
    { path: 'voluntariado/:id/:precio/:usuario_publicador/:fecha_inicio/:fecha_fin', component: VoluntariadoComponent }
    //{path: 'voluntariado', component: VoluntariadoComponent}
];