import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService, private router: Router) {
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
            this.isLoading = false;
          }
        );
    }

    form.reset();
  }
}
