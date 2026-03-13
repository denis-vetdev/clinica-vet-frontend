import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './shared/components/layout/layout.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'tutores', loadChildren: () => import('./pages/tutores/tutores.module').then(m => m.TutoresModule) },
      { path: 'animais', loadChildren: () => import('./pages/animais/animais.module').then(m => m.AnimaisModule) },
      { path: 'veterinarios', loadChildren: () => import('./pages/veterinarios/veterinarios.module').then(m => m.VeterinariosModule) },
      { path: 'consultas', loadChildren: () => import('./pages/consultas/consultas.module').then(m => m.ConsultasModule) },
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
