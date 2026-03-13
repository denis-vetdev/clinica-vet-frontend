import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Consulta } from 'src/app/shared/models/consulta.model';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {
  private apiUrl = `${environment.apiUrl}/consultas`;

  constructor(private http: HttpClient) {}

  listar(search?: string, status?: string): Observable<any> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (status) params = params.set('status', status);
    return this.http.get<any>(this.apiUrl + '/', { params });
  }

  buscarPorId(id: number): Observable<Consulta> {
    return this.http.get<Consulta>(`${this.apiUrl}/${id}/`);
  }

  criar(consulta: Consulta): Observable<Consulta> {
    return this.http.post<Consulta>(this.apiUrl + '/', consulta);
  }

  atualizar(id: number, consulta: Consulta): Observable<Consulta> {
    return this.http.put<Consulta>(`${this.apiUrl}/${id}/`, consulta);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }
}
