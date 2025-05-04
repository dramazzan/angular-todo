import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { Case } from "../models/model.case";

@Injectable({
  providedIn: 'root'
})
export class CaseService {
  private apiUrl = 'http://localhost:3000/cases';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  createCase(newCase: Case): Observable<Case> {
    return this.http.post<Case>(`${this.apiUrl}/create`, newCase, {
      headers: this.getAuthHeaders()
    });
  }

  getAllCases(): Observable<Case[]> {
    return this.http.get<Case[]>(`${this.apiUrl}/all`, {
      headers: this.getAuthHeaders()
    });
  }

  updateCase(id: string, updatedCase: Case): Observable<Case> {
    return this.http.put<Case>(`${this.apiUrl}/update/${id}`, updatedCase, {
      headers: this.getAuthHeaders()
    });
  }

  deleteCase(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  getCaseById(id: string): Observable<Case> {
    return this.http.get<Case>(`${this.apiUrl}/case/${id}`);
  }

  searchCases(query: string): Observable<Case[]> {
    return this.http.get<Case[]>(`${this.apiUrl}/search?query=${encodeURIComponent(query)}`);
  }
}
