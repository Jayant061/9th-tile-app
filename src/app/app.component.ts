import { Component, inject, OnInit } from "@angular/core";
import { RustMethod } from "./services/rust-method-services/rust-method.service";
import { Router, RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit{
  greetingMessage = "";
  private readonly rustMethodService = inject(RustMethod);
  public router = inject(Router);

  greet(event: SubmitEvent, name: string): void {
    event.preventDefault();

    this.rustMethodService.invoke(name).subscribe(val=>{
      this.greetingMessage = val;
    })
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  }

  ngOnInit(): void {
    globalThis.addEventListener('contextmenu',(event)=>event.preventDefault());
    this.router.navigate([''])
  }
}
