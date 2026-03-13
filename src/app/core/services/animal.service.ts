import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Animal } from 'src/app/shared/models/animal.model';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private apiUrl = `${environment.apiUrl}/animais`;

  constructor(private http: HttpClient) {}

  listar(search?: string, especie?: string): Observable<any> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (especie) params = params.set('especie', especie);
    return this.http.get<any>(this.apiUrl + '/', { params });
  }

  buscarPorId(id: number): Observable<Animal> {
    return this.http.get<Animal>(`${this.apiUrl}/${id}/`);
  }

  criar(animal: Animal): Observable<Animal> {
    return this.http.post<Animal>(this.apiUrl + '/', animal);
  }

  atualizar(id: number, animal: Animal): Observable<Animal> {
    return this.http.put<Animal>(`${this.apiUrl}/${id}/`, animal);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }
}
