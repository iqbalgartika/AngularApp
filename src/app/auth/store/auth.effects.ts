import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { User } from '../user.model';
import { AuthService } from '../auth.service';
import * as AuthActions from './auth.actions'

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

const handleAuth = (resData: AuthResponseData) => {
    const expirationDate = new Date(new Date().getTime() + +resData.expiresIn*1000);
    const user = new User(resData.email, resData.localId, resData.idToken, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    return new AuthActions.AuthSuccess({ 
        email: resData.email, 
        id: resData.localId, 
        token: resData.idToken, 
        expirationDate: expirationDate
    });
}

const handleError = (errorRes) => {
    let errorMessage = "An unknown error occured!";
    if (!errorRes.error || !errorRes.error.error) {
        return of(new AuthActions.AuthFail(errorMessage));
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
    return of(new AuthActions.AuthFail(errorMessage));
}

@Injectable()
export class AuthEffects {

    @Effect()
    authSignup = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((authData: AuthActions.SignupStart) => {
            return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
            {
                email: authData.payload.email,
                password: authData.payload.password,
                returnSecureToken: true
            })
            .pipe(
                map(resData => {
                    this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                    return handleAuth(resData);
                }),
                catchError(errorRes => {
                    return handleError(errorRes);
                }),
            );
        })
    );

    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {
            return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
            {
                email: authData.payload.email,
                password: authData.payload.password,
                returnSecureToken: true
            })
            .pipe(
                map(resData => {
                    this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                    return handleAuth(resData);
                }),
                catchError(errorRes => {
                    return handleError(errorRes);
                }),
            );
        })
    );

    @Effect({ dispatch: false })
    authRedirect = this.actions$.pipe(
        ofType(AuthActions.AUTH_SUCCESS),
        tap(() => {
            this.router.navigate(['/']);
        })
    )
    
    @Effect({ dispatch: false })
    authLogout = this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
            this.authService.clearLogoutTimer();
            localStorage.removeItem('userData');
            this.router.navigate(['/auth']);
        })
    )

    @Effect()
    autoLogin = this.actions$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map(() => {
            const userData: {
                email: string,
                id: string,
                _token: string,
                _tokenExpirationDate: string,
              } = JSON.parse(localStorage.getItem('userData'));
          
              if (!userData) {
                return { type: 'NOTHING' };
              }
              
              const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
              if (loadedUser.token) {
                this.authService.setLogoutTimer(new Date(userData._tokenExpirationDate).getTime() - new Date().getTime());
                return new AuthActions.AuthSuccess({
                  email: userData.email,
                  id: userData.id,
                  token: userData._token,
                  expirationDate: new Date(userData._tokenExpirationDate)
                });
              }
              return { type: 'NOTHING' };
        })
    )
    

    constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) {}
}