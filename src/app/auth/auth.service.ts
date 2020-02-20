import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

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
  private tokenExpirationTimeout;

  constructor(private store: Store<AppState>) { }

  setLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimeout = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout());
    }, expirationDuration);
  }

  clearLogoutTimer() {
    clearTimeout(this.tokenExpirationTimeout);
    this.tokenExpirationTimeout = null;
  }

}
