import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tutor } from 'src/app/shared/models/tutor.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TutorService {
  private apiUrl = `${environment.apiUrl}/tutores`;

  constructor(private http: HttpClient) { }

  listar(search?: string): Observable<any> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    return this.http.get<any>(this.apiUrl + '/', {params});
  }

  buscarPorId(id: number): Observable<Tutor> {
    return this.http.get<Tutor>(`${this.apiUrl}/${id}/`);
  }

  criar(tutor: Tutor): Observable<Tutor> {
    return this.http.post<Tutor>(this.apiUrl + '/', tutor);
  }

  atualizar(id: number, tutor: Tutor): Observable<Tutor> {
    return this.http.put<Tutor>(`${this.apiUrl}/${id}/`, tutor);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }
}
