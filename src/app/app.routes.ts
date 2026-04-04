import { Routes } from "@angular/router";
import { authGuard } from "./guards/auth-guard/auth-guard";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/playground/playground.component").then(
        (c) => c.PlaygroundComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: "auth",
    loadComponent: () =>
      import("./pages/auth/auth.component").then((c) => c.AuthComponent),
  },
  {
    path: "**",
    loadComponent: () =>
      import("./pages/playground/playground.component").then(
        (c) => c.PlaygroundComponent,
      ),
  },
];
