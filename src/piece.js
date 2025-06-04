"use strict"

function memoizeCreatePiece(fn) {
  const cache = new Map();
  return function(typeID, color) {
    const key = `${typeID} - ${color}`;
    if (cache.has(key)) {
      return structuredClone(cache.get(key));
    }
    const result = fn(typeID, color);
    cache.set(key, structuredClone(result));
    return result;
  }
}

const createPieceData = memoizeCreatePiece((typeID, color) => {
  return {
    shape: SHAPES[typeID],
    color: color,
  }
})

class Piece {
  constructor(ctx){
    this.ctx = ctx

    const typeID = this.randomizeTetrominoType(COLORS.length);
    const color = colorGen.next().value;
    const pieceData = createPieceData(typeID, color);

    this.shape = pieceData.shape;
    this.color = pieceData.color

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