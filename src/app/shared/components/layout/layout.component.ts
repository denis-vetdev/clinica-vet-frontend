import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  titulo = '';

  private titulos: { [key: string]: string } = {
    '/dashboard': 'Dashboard',
    '/tutores': 'Tutores',
    '/animais': 'Animais',
    '/veterinarios': 'Veterinários',
    '/consultas': 'Consultas'
  };

  constructor(private authService: AuthService, private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.titulo = this.titulos[event.url] || 'Clínica Veterinária';
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
