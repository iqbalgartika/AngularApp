import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';

import { User } from './user.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AppState } from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

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
  // user = new BehaviorSubject<User>(null);
  private tokenExpirationTimeout;

  constructor(private http: HttpClient, private router: Router, private store: Store<AppState>) { }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
    {
      email: email,
      password: password,
      returnSecureToken: true
    })
    .pipe(
      catchError(this.errorHandling),
      tap(resData => {
        this.authHandling(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
      })
    );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
    {
      email: email,
      password: password,
      returnSecureToken: true
    })
    .pipe(
      catchError(this.errorHandling),
      tap(resData => {
        this.authHandling(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
      })
    );
  }

  autoLogin() {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string,
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }
    
    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
    if (loadedUser.token) {
      // this.user.next(loadedUser);
      this.store.dispatch(new AuthActions.Login({
        email: userData.email,
        id: userData.id,
        token: userData._token,
        expirationDate: new Date(userData._tokenExpirationDate)
      }));
      this.autoLogout(new Date(userData._tokenExpirationDate).getTime() - new Date().getTime());
    }
  }

  logout() {
    // this.user.next(null);
    this.store.dispatch(new AuthActions.Logout());
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimeout = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private authHandling(email: string, id: string, token: string, tokenExpire: number) {
    const expirationDate = new Date(new Date().getTime() + tokenExpire*1000);
    const user = new User(email, id, token, expirationDate);
    // this.user.next(user);
    this.store.dispatch(new AuthActions.Login({
      email: email,
      id: id,
      token: token,
      expirationDate: expirationDate
    }));
    this.autoLogout(tokenExpire*1000);
    localStorage.setItem('userData', JSON.stringify(user));
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
