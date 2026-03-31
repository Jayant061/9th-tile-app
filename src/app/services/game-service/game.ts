import { computed, Injectable, signal } from "@angular/core";
import inputData from "../../../assets/inputs.json";

@Injectable({
  providedIn: "root",
})
export class Game {
  public readonly inputData = inputData;

  public currentLevel = signal<number>(1);

  public totalMovesTaken = signal<number>(0);
  public totalTimeTaken = signal<number>(0);

  public gridData = signal<number[][]>([]);

  public isGameWon = signal<boolean>(false);

  public setGridData(level = 1) {
    const gridSize = 3;
    const puzzleArr = this.inputData.puzzles[level-1];
    const gridData: number[][] = [];
    for (let i = 0; i < gridSize; i++) {
      gridData.push(puzzleArr.grid.slice(i * gridSize, (i + 1) * gridSize));
    }
    this.gridData.set(gridData);
  }

  public getCurrentLevelMetaData = computed(() => {
    const level = this.currentLevel();
    return inputData.puzzles[level];
  });

  public resetMoveAndTime() {
    this.totalMovesTaken.set(0);
    this.totalTimeTaken.set(0);
  }
}
