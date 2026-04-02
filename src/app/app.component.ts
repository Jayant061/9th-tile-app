import { Component, inject, OnInit } from "@angular/core";
import { RustMethod } from "./services/rust-method-services/rust-method.service";
import { Playstation } from "./components/playstation/playstation";

@Component({
  selector: "app-root",
  imports: [ Playstation],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit{
  greetingMessage = "";
  private readonly rustMethodService = inject(RustMethod);

  greet(event: SubmitEvent, name: string): void {
    event.preventDefault();

    this.rustMethodService.invoke(name).subscribe(val=>{
      this.greetingMessage = val;
    })
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  }

  ngOnInit(): void {
    globalThis.addEventListener('contextmenu',(event)=>event.preventDefault());
  }
}
