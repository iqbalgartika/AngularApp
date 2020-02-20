import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder.directive';
import { AppState } from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceholderDirective, {static: true}) alertHost: PlaceholderDirective;
  private closeAlertSub: Subscription;
  private storeSub: Subscription;

  constructor(private cmpFacResolver: ComponentFactoryResolver, private store: Store<AppState>) { }

  ngOnInit() {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if (this.error) {
        this.showErrorAlert(this.error);
      }
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if(!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;


    this.isLoading = true;
    if(this.isLoginMode) {
      this.store.dispatch(new AuthActions.LoginStart({ email, password }));
    }
    else {
      this.store.dispatch(new AuthActions.SignupStart({ email, password }));
    }

    form.reset();
  }

  onCloseAlert() {
    this.store.dispatch(new AuthActions.ClearError());
  }

  private showErrorAlert(message: string) {
    const alertCmpFactory = this.cmpFacResolver.resolveComponentFactory(AlertComponent);

    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const alertCmpRef = hostViewContainerRef.createComponent(alertCmpFactory);
    alertCmpRef.instance.message = message;
    this.closeAlertSub = alertCmpRef.instance.close.subscribe(() => {
      this.closeAlertSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }

  ngOnDestroy() {
    if (this.closeAlertSub) {
      this.closeAlertSub.unsubscribe();
    }
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }
}
