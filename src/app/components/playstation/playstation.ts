import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Grid } from "../grid/grid";
import { Game } from "../../services/game-service/game";
import confetti from "canvas-confetti";
import { Celebration } from "../celebration/celebration";
import { FirebaseService } from "../../services/firebase-service/firebase.service";

@Component({
  selector: "app-playstation",
  imports: [Grid, Celebration],
  templateUrl: "./playstation.html",
  styleUrl: "./playstation.css",
})
export class Playstation implements OnInit {
  private readonly gameService = inject(Game);
  public authService = inject(FirebaseService);

  public celebrationAnimationFrameId = 0;

  public bestScore = signal<{ moves: number; time: number }>({
    moves: 0,
    time: 0,
  });

  public movesCount = computed(() => this.gameService.totalMovesTaken());
  public timeCount = computed(() => {
    const totalTimeinSec = this.gameService.totalTimeTaken();
    const minutes = Math.floor(totalTimeinSec / 60);
    const seconds = totalTimeinSec % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  });

  public currentLevel = computed(() => this.gameService.currentLevel());

  public isGameWon = computed(() => this.gameService.isGameWon());

  public currentGameMetaData = computed(() =>
    this.gameService.getCurrentLevelMetaData(),
  );

  public timerToken: number | null = null;

  ngOnInit(): void {
    setTimeout(() => {
      globalThis.alert(
        '"Start Puzzle: Move tiles by sliding them into the empty space. Arrange them from 1 to 8 to win."',
      );
      this.startTimer();
    }, 1000);
  }

  constructor() {
    effect(() => {
      const currentLevel = this.currentLevel();
      this.gameService.setGridData(currentLevel);
    });

    effect(() => {
      const isSuccess = this.gameService.isGameWon();
      if (!isSuccess) return;
      clearInterval(this.timerToken ?? 0);
      this.showCelebration();
    });
  }

  private startTimer(resume = false) {
    clearInterval(this.timerToken ?? 0);
    if (!resume) {
      this.gameService.resetMoveAndTime();
      this.gameService.isGameWon.set(false);
    }
    this.timerToken = globalThis.setInterval(() => {
      this.gameService.totalTimeTaken.update((prev) => prev + 1);
    }, 1000);
  }

  public handleNewGame() {
    if (this.gameService.isGameWon()) {
      this.gameService.currentLevel.update((prev) => prev + 1);
    } else {
      this.gameService.currentLevel.set(1);
    }
    this.gameService.resetMoveAndTime();
    this.gameService.isGameWon.set(false);
    this.startTimer();
  }

  public handleReset() {
    this.gameService.setGridData(this.gameService.currentLevel());
    this.startTimer();
  }

  private showCelebration(durationInSec = 5) {
    const duration = durationInSec * 1000;
    const animationEnd = Date.now() + duration;

    const frame = () => {
      const isGameWon = this.gameService.isGameWon();
      if (!isGameWon) {
        cancelAnimationFrame(this.celebrationAnimationFrameId);
        return;
      }
      confetti({
        particleCount: 3,
        angle: 40,
        spread: 55,
        origin: { x: 0 },
        colors: ["#C9A227", "#E0D5B7", "#FFFFFF"],
      });
      confetti({
        particleCount: 3,
        angle: 140,
        spread: 55,
        origin: { x: 1 },
        colors: ["#C9A227", "#E0D5B7", "#FFFFFF"],
      });

      if (Date.now() < animationEnd) {
        this.celebrationAnimationFrameId = requestAnimationFrame(frame);
      }
    };
    this.celebrationAnimationFrameId = requestAnimationFrame(frame);
  }
}

type Puzzle = {
  difficulty: string;
  moves: number;
  grid: number[];
};

const GOAL = [1, 2, 3, 4, 5, 6, 7, 8, 0];

const directions = {
  up: -3,
  down: 3,
  left: -1,
  right: 1,
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
      difficulty,
      moves,
      grid,
    });
  }

  return puzzles;
}
