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

@Component({
  selector: "app-celebration",
  imports: [],
  templateUrl: "./celebration.html",
  styleUrl: "./celebration.css",
})
export class Celebration implements OnInit {
  private readonly gameService = inject(Game);
  private readonly rustMethodService = inject(RustMethod);

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

    this.rustMethodService
      .getStars(optimalMoves, totalMoves)
      .subscribe((val) => {
        this.stars.set(val);
      });
  }
}
