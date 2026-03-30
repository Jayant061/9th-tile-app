import { Component, computed, effect, inject, signal } from "@angular/core";
import { Game } from "../../services/game-service/game";
import { RustMethod } from "../../services/rust-method-services/rust-method.service";

@Component({
  selector: "app-grid",
  imports: [],
  templateUrl: "./grid.html",
  styleUrl: "./grid.css",
})
export class Grid {
  private readonly gameService = inject(Game);
  private readonly rustMethodService = inject(RustMethod);

  public gridData = computed(() => this.gameService.gridData());
  public readonly gridSize = 3;

  public validMove = signal<boolean[][]>([
    [false, false, false],
    [false, false, false],
    [false, false, false],
  ]);

  constructor() {
    effect(() => {
      const gridData = this.gridData();
      this.rustMethodService
        .calculateValidMoves(gridData, this.gridSize)
        .subscribe((val) => {
          this.validMove.set(val);
        });
        this.rustMethodService.igGameOver(gridData,this.gridSize).subscribe(val=>{
          this.gameService.isGameOver.set(val);
        })
    });
  }

  public isMoveValid(rowIndex: number, colIndex: number): boolean {
    return this.validMove()[rowIndex][colIndex];
  }

  public handleMove(event: Event, rowIndex: number, colIndex: number) {
    if (!this.isMoveValid(rowIndex, colIndex)) {
      const btnEl = event.target as HTMLButtonElement;
      btnEl.style.cursor = "not-allowed";
      return;
    }
    const gridData = this.gridData();
    this.rustMethodService
      .handleMoveNumber(gridData, rowIndex, colIndex, this.gridSize)
      .subscribe((val) => {
        this.gameService.gridData.set(val);
        this.gameService.totalMovesTaken.update((prev) => prev + 1);
      });
  }


}
