import { Difficulty, IPuzzleData } from "../../shared/interface";

export class GameFeasibilityChecked{
     public getDifficulty(moves: number): Difficulty {
      if (moves <= 6) return "Beginner";
      if (moves <= 10) return "Intermediate";
      if (moves <= 15) return "Advanced";
      if (moves <= 22) return "Expert";
      return "Legend";
    }
    public sortAndRateDifficulty(puzzleData:IPuzzleData[]) {
      
      const movesFOrEachId: number[] = [];
      puzzleData.forEach((puzzle) => {
        const moves = this.minMoves(puzzle.grid);
        movesFOrEachId[puzzle.id] = moves;
        console.log(moves);
      });
      const data = puzzleData;
      data.sort((a, b) => movesFOrEachId[a.id] - movesFOrEachId[b.id]);

      const updatedData = data.map((d) => {
        const minMoves = movesFOrEachId[d.id];
        d.moves = minMoves;
        d.difficulty = this.getDifficulty(minMoves);
        return d;
      });
      console.log(updatedData);
    }

    public isSolvable(arr: number[]): boolean {
    const nums = arr.filter((n) => n !== 0);

    let inv = 0;
    for (let i = 0; i < nums.length; i++) {
      for (let j = i + 1; j < nums.length; j++) {
        if (nums[i] > nums[j]) inv++;
      }
    }

    return inv % 2 === 0;
  }

  public minMoves(start: number[]): number {
    const goal = "123456780";

    if (!this.isSolvable(start)) return -1;

    const neighbors: number[][] = [
      [1, 3], // 0
      [0, 2, 4], // 1
      [1, 5], // 2
      [0, 4, 6], // 3
      [1, 3, 5, 7], // 4
      [2, 4, 8], // 5
      [3, 7], // 6
      [4, 6, 8], // 7
      [5, 7], // 8
    ];

    const queue: [number[], number][] = [[start, 0]];
    const visited = new Set<string>();
    visited.add(start.join(""));

    while (queue.length) {
      const [curr, moves] = queue.shift()!;

      const key = curr.join("");
      if (key === goal) return moves;

      const zeroIndex = curr.indexOf(0);

      for (const nextIndex of neighbors[zeroIndex]) {
        const next = [...curr];
        [next[zeroIndex], next[nextIndex]] = [next[nextIndex], next[zeroIndex]];

        const nextKey = next.join("");
        if (!visited.has(nextKey)) {
          visited.add(nextKey);
          queue.push([next, moves + 1]);
        }
      }
    }

    return -1;
  }
}