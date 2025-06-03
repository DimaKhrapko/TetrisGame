"use strict"

class Piece {
  constructor(ctx){
    this.ctx = ctx

    const typeID = this.randomizeTetrominoType(COLORS.length);
    this.shape = SHAPES[typeID];
    this.color = colorGen.next().value;

    this.x = 3;
    this.y = 0;
    }

  draw() {
    this.ctx.fillStyle = this.color;
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          const drawX = this.ctx === ctxNext ? x : this.x + x;
          const drawY = this.ctx === ctxNext ? y : this.y + y
          this.ctx.fillRect(drawX, drawY, 1, 1);
        }
      });
    });
  }

  move(p) {
    this.x = p.x;
    this.y = p.y;
    this.shape = p.shape;
  }

  randomizeTetrominoType(noOfTypes) {
    return Math.floor(Math.random() * noOfTypes)
  }


}