import { Component, inject, OnInit } from "@angular/core";
import { Playstation } from "../../components/playstation/playstation";
import { Game } from "../../services/game-service/game";
import { FirebaseService } from "../../services/firebase-service/firebase.service";

@Component({
  selector: "app-playground",
  imports: [Playstation],
  templateUrl: "./playground.component.html",
  styleUrl: "./playground.component.css",
})
export class PlaygroundComponent implements OnInit {
  private readonly gameService = inject(Game);
  private readonly firebaseService = inject(FirebaseService);
  ngOnInit(): void {
    this.firebaseService.getPlayerData().then((data) => {
      this.gameService.playerGameData.set(data ?? null);
      this.gameService.currentLevel.set(data?.level??1)
    });
  }
}
