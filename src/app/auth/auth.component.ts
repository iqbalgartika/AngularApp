import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { AuthService, AuthResponseData } from './auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder.directive';

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

  constructor(private authService: AuthService, private router: Router, private cmpFacResolver: ComponentFactoryResolver) { }

  ngOnInit() {
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

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;
    if(this.isLoginMode) {
      authObs = this.authService.login(email, password);
    }
    else {
      authObs = this.authService.signup(email, password);
    }
    
    authObs.subscribe(
      responseData => {
        console.log(responseData);
        this.router.navigate(['/recipes']);        
      }, 
      errorMessage => {
        this.error = errorMessage;
        this.showErrorAlert(errorMessage);
        this.isLoading = false;
      } 
    );
    form.reset();
  }

  onCloseAlert() {
    this.error = null;
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
  }
}
