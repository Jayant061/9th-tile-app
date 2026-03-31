export type direction = "left" | "right" | "down" | "up";

export type Difficulty =
  | "Beginner"
  | "Intermediate"
  | "Advanced"
  | "Expert"
  | "Legend";

export interface IPuzzleData {
  id: number;
  grid: number[];
  moves: number;
  difficulty: Difficulty;
}
