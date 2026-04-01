# 🧩 The Ninth Tile Game

A modern desktop implementation of the classic **8-puzzle (sliding puzzle)** built with **Angular + Tauri (Rust)**.
Solve puzzles, optimize your moves, and earn ⭐ stars based on efficiency.

---

## 🚀 Features

* 🎮 Classic **3×3 sliding puzzle gameplay**
* ⭐ **Star rating system** (based on optimal vs user moves)
* 🧠 **Smart difficulty levels** (Beginner → Expert)
* 🎉 **Celebration animations** (stars + confetti)
* ⏱️ Move counter & timer tracking
* 🔄 Reset / New Game functionality
* ⚡ Fast & lightweight desktop app (powered by Tauri)

---

## 🧠 How It Works

* The puzzle starts in a shuffled but **solvable state**
* Player moves tiles to reach the goal:

```
1 2 3
4 5 6
7 8 0
```

* Performance is evaluated using:

  * **User Moves**
  * **Optimal Moves (computed/generated)**

---

## ⭐ Star System

| Performance         | Stars |
| ------------------- | ----- |
| Near optimal        | ⭐⭐⭐   |
| Moderate efficiency | ⭐⭐    |
| Completed           | ⭐     |

---

## 🏗️ Tech Stack

* **Frontend:** Angular
* **Desktop Runtime:** Tauri (Rust)
* **Styling:** CSS / Custom UI
* **State Management:** Angular Services

---

## 📁 Project Structure

```
src/
 ├── app/
 │   ├── components/
 │   │   ├── puzzle-board/
 │   │   ├── tile/
 │   │   ├── celebration/
 │   │
 │   ├── services/
 │   │   ├── game.service.ts
 │   │   ├── solver.service.ts
 │   │   ├── stats.service.ts
 │   │
 │   ├── models/
 │   │   ├── puzzle.model.ts
 │   │   ├── game-state.model.ts

src-tauri/
 ├── src/
 ├── tauri.conf.json
```

---

## ⚙️ Installation

### 1. Clone the repo

```bash
git clone https://github.com/Jayant061/9th-tile-app.git
cd 9th-tile-app
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 4. Run Tauri app

```bash
npm run tauri dev
```

---


## 🎯 Future Improvements

* 🧠 A* Solver for exact optimal moves
* 🎮 Level progression system
* 💾 Save/load game state
* 🏆 Achievements & leaderboard
* 🔊 Sound effects

---

## 🤝 Contributing

Contributions are welcome!
Feel free to open issues or submit PRs.

---

## 📄 License

MIT License

---

## 💡 Author

Built with ❤️ by *Jayant Thakur*

---
