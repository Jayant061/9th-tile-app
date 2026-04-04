import { CanActivateFn, Router } from "@angular/router";
import { FirebaseService } from "../../services/firebase-service/firebase.service";
import { inject } from "@angular/core";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(FirebaseService);
  const router = inject(Router);
  if (authService.isAuthenticated()) {
    if (state.url.includes("/auth")) {
      return router.createUrlTree([""]);
    }
    return true;
  } else {
    return router.createUrlTree(["/auth"], {
      queryParams: { returnUrl: state.url },
    });
  }
};
