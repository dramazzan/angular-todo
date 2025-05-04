import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from '../models/model.user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:3000/admin';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`, {
      headers: this.getAuthHeaders()
    });
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  getUserByLogin(login: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/user/get_by_login`, { login }, {
      headers: this.getAuthHeaders()
    });
  }

  getUserByEmail(email: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/user/get_by_email`, { email }, {
      headers: this.getAuthHeaders()
    });
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
