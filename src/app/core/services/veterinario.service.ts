import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Veterinario } from 'src/app/shared/models/veterinario.model';

@Injectable({
  providedIn: 'root'
})
export class VeterinarioService {
  private apiUrl = `${environment.apiUrl}/veterinarios`;

  constructor(private http: HttpClient) {}

  listar(search?: string): Observable<any> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    return this.http.get<any>(this.apiUrl + '/', { params });
  }

  buscarPorId(id: number): Observable<Veterinario> {
    return this.http.get<Veterinario>(`${this.apiUrl}/${id}/`);
  }

  criar(veterinario: Veterinario): Observable<Veterinario> {
    return this.http.post<Veterinario>(this.apiUrl + '/', veterinario);
  }

  atualizar(id: number, veterinario: Veterinario): Observable<Veterinario> {
    return this.http.put<Veterinario>(`${this.apiUrl}/${id}/`, veterinario);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }
}
