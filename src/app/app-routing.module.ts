import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
  { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [authGuard] },
  // { path: 'tutores', loadChildren: () => import('./pages/tutores/tutores.module').then(m => m.TutoresModule), canActivate: [authGuard] },
  // { path: 'animais', loadChildren: () => import('./pages/animais/animais.module').then(m => m.AnimaisModule), canActivate: [authGuard] },
  // { path: 'veterinarios', loadChildren: () => import('./pages/veterinarios/veterinarios.module').then(m => m.VeterinariosModule), canActivate: [authGuard] },
  // { path: 'consultas', loadChildren: () => import('./pages/consultas/consultas.module').then(m => m.ConsultasModule), canActivate: [authGuard] },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
