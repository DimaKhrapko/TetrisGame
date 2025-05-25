"use strict"

class Board {
    constructor(ctx) {
        this.ctx = ctx;
        this.grid = this.getEmptyBoard()
        this.piece = new Piece(ctx)
    }

    getEmptyBoard(){
        return Array.from(
            {length: ROWS}, () => Array(COLS).fill(0)
        );
    }

    rotate(piece) {
      let p = JSON.parse(JSON.stringify(piece));

      for (let y = 0; y < p.shape.length; y++) {
        for (let x = 0; x < y; ++x) {
          [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]];
        }
      }

      p.shape.forEach(row => row.reverse());

    return p
    }

    isInsideWalls(x, y) {
      return (
        x >= 0 && x < COLS && y < ROWS
      )
    }

    isNotOccupied(x, y) {
      return this.grid[y] && this.grid[y][x] === 0;
    }

    valid(p) {
      return p.shape.every((row, dy) => {
        return row.every((value, dx) => {
          let x = p.x + dx;
          let y = p.y + dy;
          return value === 0 || (this.isInsideWalls(x, y) && this.isNotOccupied(x, y))
        }
        )
      })
    }

    drop() {
      let p = moves[KEY.DOWN](this.piece);

      if (this.valid(p)) {
        this.piece.move(p);
      } else {
        this.freeze();
        this.piece = new Piece(this.ctx);
      }
    }

    freeze() {
      this.piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value > 0) {
            this.grid[y + this.piece.y][x + this.piece.x] = value;
          }
        })
      })
    }
    
    draw() {
      // this.ctx.fillStyle = this.color;
      this.grid.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value > 0) {
            this.ctx.fillStyle = COLORS[value - 1];
            this.ctx.fillRect(x, y, 1, 1);
          }
        })
      })
    }
}