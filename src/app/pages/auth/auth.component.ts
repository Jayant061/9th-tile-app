import { Component, effect, inject, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { FirebaseService } from "../../services/firebase-service/firebase.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-auth",
  imports: [ReactiveFormsModule],
  templateUrl: "./auth.component.html",
  styleUrl: "./auth.component.css",
})
export class AuthComponent {
  private readonly authService = inject(FirebaseService);
  private readonly router = inject(Router);
  public isLogin = signal<boolean>(true);

  public authForm = new FormGroup({
    username: new FormControl<string>("", {
      validators: [Validators.required],
    }),
    email: new FormControl<string>("", {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>("", {
      validators: [Validators.required],
    }),
  });

  constructor() {
    effect(() => {
      const isLogin = this.isLogin();
      if (isLogin) {
        this.authForm.controls.username.disable();
      }
    });
  }
  public toggleMode() {
    this.isLogin.update((prev) => !prev);
  }

  public get isFormValid() {
    const status = this.authForm.status;
    return status === "INVALID";
  }

  public onSubmit() {
    const formData = this.authForm.getRawValue();
    const isLogin = this.isLogin();
    if (isLogin) {
      this.authService
        .signIn(formData.email ?? "", formData.password ?? "")
        .then(() => {
          this.router.navigate([""]);
        });
      return;
    }
    this.authService
      .signUp(formData.email ?? "", formData.password ?? "", {
        name: formData.username ?? "",
        email: formData.email ?? "",
      })
      .then(() => {
        this.router.navigate([""]);
      });
  }
}
