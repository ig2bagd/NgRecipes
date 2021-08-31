import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder.directive';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;

  private closeSub: Subscription;

  constructor(private authService: AuthService, 
              private router: Router,
              private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit(): void {
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;
    if (this.isLoginMode) {
      this.authService.logIn(email, password)
        .subscribe(data => {
          console.log(data);
          this.isLoading = false;
          this.router.navigate(['/recipes']);
        },
          errorRes => {
            console.log(errorRes);
            this.error = errorRes;
            this.showErrorAlert(errorRes);
            this.isLoading = false;
          }
        );
    } else {
      this.authService.signUp(email, password)
        .subscribe(data => {
          console.log(data);
          this.isLoading = false;
          this.router.navigate(['/recipes']);
        },
          errorRes => {
            console.log(errorRes);
            this.error = errorRes;
            this.showErrorAlert(errorRes);
            this.isLoading = false;
          }
        );
    }

    form.reset();
  }

  onHandleError() {
    this.error = null;
  }

  ngOnDestroy(): void {
    if(this.closeSub) {
      this.closeSub.unsubscribe();
    }
  }

  private showErrorAlert(message: string) {
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);

    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();

    })
  }
}
