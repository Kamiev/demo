import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private apiUrl = 'http://localhost:8080/api';
  private isAuthenticated = false;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const loginPayload = { username, password };

    return this.http.post(`${this.apiUrl}/auth/login`, loginPayload, { withCredentials: true }).pipe(
      tap(() => (this.isAuthenticated = true)),
      catchError(this.handleError)
    );
  }

  getPlaces(): Observable<any> {
    if (!this.isAuthenticated) {
      return throwError('User is not authenticated');
    }

    return this.http.get(`${this.apiUrl}/places`, { withCredentials: true }).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.status === 401) {
      errorMessage = 'Unauthorized request. Please check your credentials.';
    } else if (error.status === 0) {
      errorMessage = 'Network error. Please check your connection.';
    } else {
      errorMessage = `Error: ${error.statusText}`;
    }
    console.error('HTTP Error:', error);
    return throwError(errorMessage);
  }
}
