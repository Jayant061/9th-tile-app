import {
  Component,
  computed,
  inject,
  OnInit,
  output,
  signal,
} from "@angular/core";
import { Game } from "../../services/game-service/game";
import { RustMethod } from "../../services/rust-method-services/rust-method.service";
import { IEachLevelBest, IPlayerData } from "../../shared/interface";
import { FirebaseService } from "../../services/firebase-service/firebase.service";

@Component({
  selector: "app-celebration",
  imports: [],
  templateUrl: "./celebration.html",
  styleUrl: "./celebration.css",
})
export class Celebration implements OnInit {
  private readonly gameService = inject(Game);
  private readonly rustMethodService = inject(RustMethod);
  public apiService = inject(FirebaseService);

  public newGame = output<void>();
  public playAgain = output<void>();

  public stars = signal<number>(0);
  public moves = computed(() => this.gameService.totalMovesTaken());
  public time = computed(() => {
    const totalSeconds = this.gameService.totalTimeTaken();
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  });

  ngOnInit(): void {
    const totalMoves = this.gameService.totalMovesTaken();
    const optimalMoves = this.gameService.getCurrentLevelMetaData().moves;
    const currentLevel = this.gameService.currentLevel();
    this.rustMethodService
      .getStars(optimalMoves, totalMoves)
      .subscribe((stars) => {
        this.stars.set(stars);
        this.setPlayerData(
          this.gameService.totalTimeTaken(),
          totalMoves,
          stars,
          currentLevel,
        );
      });
  }

  public setPlayerData(time: number, move: number, star: number, level: number) {
  const playerData = this.gameService.playerGameData();

  if (playerData) {

    const index = playerData.eachLevelData.findIndex(
      (data) => data.level === level
    );

    const newData: IEachLevelBest = {
      level,
      move,
      time,
      star
    };

    if (index === -1) {
      // ✅ First time playing this level
      playerData.eachLevelData.push(newData);
    } else {
      const current = playerData.eachLevelData[index];

      const isBetter =
        current.move > move ||
        (current.move === move && current.time > time);

      if (!isBetter) return;

      // ✅ Replace directly
      playerData.eachLevelData[index] = newData;

    }

    this.apiService.setPlayerData({
      level: level + 1,
      eachLevelData: playerData.eachLevelData
    });

  } else {

    const newPlayerData: IPlayerData = {
      level: level + 1,
      eachLevelData: [{
        level,
        move,
        time,
        star
      }]
    };

    this.apiService.setPlayerData(newPlayerData).then(() => {
      this.apiService.getPlayerData().then((data) => {
        this.gameService.playerGameData.set(data ?? null);
      });
    });
  }
}
}
