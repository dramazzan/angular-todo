import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { UserRegisterDto  , User} from "../models/model.user";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://todo-node-server-6q0k.onrender.com/users';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  updateUser(updateData: UserRegisterDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, updateData, {
      headers: this.getAuthHeaders()
    });
  }

  deleteUser(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete`, {
      headers: this.getAuthHeaders()
    });
  }

  dashboard(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/dashboard`, {
      headers: this.getAuthHeaders()
    });
  }
}
