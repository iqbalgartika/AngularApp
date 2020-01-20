import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDOY3b0Q4ObAK779JufrX41HWekbfcy97c',
    {
      email: email,
      password: password,
      returnSecureToken: true
    })
    .pipe(catchError(this.errorHandling));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDOY3b0Q4ObAK779JufrX41HWekbfcy97c',
    {
      email: email,
      password: password,
      returnSecureToken: true
    })
    .pipe(catchError(this.errorHandling));
  }

  private errorHandling(errorRes: HttpErrorResponse) {
    let errorMessage = "An unknown error occured!";
        if (!errorRes.error || !errorRes.error.error) {
          return throwError(errorMessage);
        }
        switch (errorRes.error.error.message) {
          case 'EMAIL_EXISTS':
            errorMessage = "This email already exists!";
            break;
          case 'EMAIL_NOT_FOUND':
            errorMessage = "Cannot find username/email!";
            break;
          case 'INVALID_PASSWORD':
            errorMessage = "Invalid password!";
            break;
          
        }
        return throwError(errorMessage);
  }
}
