import { Component, computed, effect, inject, OnInit } from "@angular/core";
import { Grid } from "../grid/grid";
import { Game } from "../../services/game-service/game";
import confetti from 'canvas-confetti';

@Component({
  selector: "app-playstation",
  imports: [Grid],
  templateUrl: "./playstation.html",
  styleUrl: "./playstation.css",
})
export class Playstation implements OnInit {
  private readonly gameService = inject(Game);

  public movesCount = computed(() => this.gameService.totalMovesTaken());
  public timeCount = computed(() => {
    const totalTimeinSec = this.gameService.totalTimeTaken();
    const minutes = Math.floor(totalTimeinSec / 60);
    const seconds = totalTimeinSec % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  });

  public currentLevel = computed(()=>this.gameService.currentLevel());

  public currentGameMetaData = computed(()=>this.gameService.getCurrentLevelMetaData())

  public timerToken: number | null = null;

  ngOnInit(): void {
    const level = JSON.parse(localStorage.getItem('level')??'');
    this.gameService.currentLevel.set(level??0);

    // const puzzles = generatePuzzles(100);
    // console.log(puzzles);
  }

  constructor() {
    effect(() => {
      const currentLevel = this.currentLevel();
      this.gameService.setGridData(currentLevel);
    });
    effect((cleanup) => {
      this.gameService.currentLevel();
      this.gameService.totalMovesTaken.set(0);
      this.gameService.totalTimeTaken.set(0);
      this.startTimer();

      cleanup(() => {
        clearInterval(this.timerToken ?? 0);
      });
    });

    effect(() => {
      const isSuccess = this.gameService.isGameOver();
      if (!isSuccess) return;
      clearInterval(this.timerToken??0);

      this.showCelebration()
      localStorage.setItem('level',JSON.stringify(this.currentLevel()));
    });
  }

  private startTimer(){
    clearInterval(this.timerToken??0);
    this.timerToken = globalThis.setInterval(() => {
        this.gameService.totalTimeTaken.update((prev) => prev + 1);
      }, 1000);
  }

  public handleNewGame() {
    this.gameService.currentLevel.update(prev=> prev+1);
    this.gameService.isGameOver.set(false);
  }

  public handleReset() {
    this.gameService.setGridData(this.gameService.currentLevel());
    this.gameService.totalMovesTaken.set(0);
    this.gameService.totalTimeTaken.set(0);
    this.startTimer();
  }

  private showCelebration() {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 40,
      spread: 55,
      origin: { x: 0 },
      colors: ['#C9A227', '#E0D5B7', '#FFFFFF']
    });
    confetti({
      particleCount: 3,
      angle: 140,
      spread: 55,
      origin: { x: 1 },
      colors: ['#C9A227', '#E0D5B7', '#FFFFFF']
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  };
  frame();
}
}

type Puzzle = {
  difficulty:string, moves:number, grid:number[]};

const GOAL = [1,2,3,4,5,6,7,8,0];

const directions = {
  up: -3,
  down: 3,
  left: -1,
  right: 1
};

function getValidMoves(index: number): number[] {
  const moves: number[] = [];

  const row = Math.floor(index / 3);
  const col = index % 3;

  if (row > 0) moves.push(directions.up);
  if (row < 2) moves.push(directions.down);
  if (col > 0) moves.push(directions.left);
  if (col < 2) moves.push(directions.right);

  return moves;
}

function shufflePuzzle(movesCount: number): number[] {
  let grid = [...GOAL];
  let zeroIndex = 8;

  for (let i = 0; i < movesCount; i++) {
    const validMoves = getValidMoves(zeroIndex);
    const move = validMoves[Math.floor(Math.random() * validMoves.length)];

    const newIndex = zeroIndex + move;

    // swap
    [grid[zeroIndex], grid[newIndex]] = [grid[newIndex], grid[zeroIndex]];
    zeroIndex = newIndex;
  }

  return grid;
}

function getDifficulty(moves: number): string {
  if (moves <= 5) return "easy";
  if (moves <= 15) return "medium";
  if (moves <= 25) return "hard";
  return "expert";
}

export function generatePuzzles(count: number): Puzzle[] {
  const puzzles: Puzzle[] = [];

  for (let i = 0; i < count; i++) {
    const moves = Math.floor(Math.random() * 30) + 1; // 1–30 moves
    const grid = shufflePuzzle(moves);
    const difficulty = getDifficulty(moves);

    puzzles.push({
      difficulty,moves,grid
    });
  }

  return puzzles;
}

