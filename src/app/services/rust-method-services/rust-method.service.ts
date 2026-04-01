import { Injectable } from "@angular/core";
import { invoke } from "@tauri-apps/api/core";
import { from } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RustMethod {
  public invoke(message: string) {
    return from(invoke<string>("greet", { message }));
  }

  public isMoveValid(
    rowIndex: number,
    colIndex: number,
    gridData: number[][],
    gridSize: number,
  ) {
    return invoke<boolean>("is_move_valid", {
      gridData,
      rowIndex,
      colIndex,
      gridSize,
    });
  }

  public calculateValidMoves(gridData: number[][], gridSize: number) {
    return from(
      invoke<boolean[][]>("calulate_valid_moves", { gridData, gridSize }),
    );
  }

  public handleMoveNumber(
    gridData: number[][],
    rowIndex: number,
    colIndex: number,
    gridSize: number,
  ) {
    return from(
      invoke<number[][]>("handle_move_number", {
        gridData,
        rowIndex,
        colIndex,
        gridSize,
      }),
    );
  }

  public igGameOver(gridData: number[][], gridSize: number) {
    return from(invoke<boolean>("is_game_over", { gridData, gridSize }));
  }

  public getStars(optimalMoves:number,userMoves:number){
    return from(
      invoke<number>('get_stars',{optimalMoves,userMoves})
    )
  }
}
