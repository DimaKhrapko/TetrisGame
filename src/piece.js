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
  constructor(ctx, typeID = null){
    this.ctx = ctx

    typeID = typeID !== null ? typeID : this.randomizeTetrominoType(COLORS.length);
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

class BiPriorityQueue {
  constructor() {
    this.items = [];
  }

  enqueue(item, priority) {
    this.items.push({item, priority, time: Date.now()});
    this.items.sort((a, b) => b.priority - a.priority)
  }

  dequeue(mode = 'highest') {
    if (this.items.length === 0) return null;

    switch(mode) {
      case 'highest':
        return this.items.shift().item;
      case 'lowest':
        return this.items.pop().item;
      case 'oldest':
        this.items.sort((a, b) => a.time - b.time);
        return this.items.shift().item;
      case 'newest':
        this.items.sort((a, b) => b.time - a.time);
        return this.items.shift().item;
      default:
        return this.items.shift().item;
    }
  }

  peek(mode = 'highest') {
    if (this.items.length === 0) return null;

    switch (mode) {
      case 'highest':
        return this.items[0].item;
      case 'lowest':
        return this.items[this.items.length - 1].item;
      case 'oldest':
        return [...this.items].sort((a, b) => a.time - b.time)[0].time;
      case 'newest':
        return [...this.items].sort((a, b) => b.time - a.time)[0].item
      default:
        return this.items[0].item;
    }
  }
}