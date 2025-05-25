"use strict"

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

function play() {
    board = new Board(ctx);
    draw()
    addEventListener();
}

function draw() {
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);

    board.piece.draw()
}

const moves = {
  [KEY.LEFT]: (p) => ({...p, x: p.x - 1}),
  [KEY.RIGHT]: (p) => ({...p, x: p.x + 1}),
  [KEY.DOWN]: (p) => ({...p, y: p.y + 1}),
  [KEY.UP]: (p) => board.rotate(p),
  [KEY.SPACE]: (p) => ({...p, y: p.y + 1})
};

function handleKeyPress(event) {
    event.preventDefault();

    if (moves[event.keyCode]) {
      let p = moves[event.keyCode](board.piece);

      if (event.keyCode === KEY.SPACE) {
        while (board.valid(p)){
          board.piece.move(p);
          p = moves[KEY.SPACE](board.piece)
        }
      }
      
      if (board.valid(p)) {
        board.piece.move(p);
        draw();
      }
    }
}

function addEventListener() {
    document.removeEventListener('keydown', handleKeyPress);
    document.addEventListener('keydown', handleKeyPress)
}