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

export interface IPlayerData{
  level:number;
  eachLevelData: IEachLevelBest[]
}

export interface IEachLevelBest {
  level:number;
  time:number;
  move:number
  star:number
}
