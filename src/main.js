"use strict"

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const canvasNext = document.getElementById('next');
const ctxNext = canvasNext.getContext('2d');

ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

ctxNext.canvas.width = 4 * BLOCK_SIZE;
ctxNext.canvas.height = 4 * BLOCK_SIZE;

ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE)

const moves = {
  [KEY.LEFT]: (p) => ({...p, x: p.x - 1}),
  [KEY.RIGHT]: (p) => ({...p, x: p.x + 1}),
  [KEY.DOWN]: (p) => ({...p, y: p.y + 1}),
  [KEY.UP]: (p) => board.rotate(p),
  [KEY.SPACE]: (p) => ({...p, y: p.y + 1})
};

const colorGen = colorCycleGenerator(COLORS);

let requestID, board;

let time = {start: 0, elapsed: 0, level: 1000};

let accountValues = {
  score: 0,
  lines: 0,
  level: 0
};

const highScoreList = document.getElementById(HIGH_SCORES);

showHighScores();

const pieceQueue = new BiPriorityQueue();
let lastTypeID = null;

function initPieceQueue() {
  for(let i = 0; i < 5; i++){
    enqueuePieceWithPriority()
  }
}

function updateAccount(key, value) {
  let element = document.getElementById(key);
  if (element) {
    element.textContent = value;
  }
}

let account = new Proxy(accountValues, {
  set: (target, key, value) => {
    target[key] = value;
    updateAccount(key, value);
    return true;
  }
})



function play() {
  resetGame();
  initPieceQueue();
  addEventListener();

  if(requestID) {
    cancelAnimationFrame(requestID);
  }
  time.start = performance.now();
  animate();
}

function resetGame() {
  account.score = 0;
  account.lines = 0;
  account.level = 0;
  board = new Board(ctx, ctxNext);
  time = {start: performance.now(), elapsed: 0, level:LEVEL[0]}
}

function draw() {
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);

    board.draw();
    board.piece.draw()
}

function handleKeyPress(event) {
    event.preventDefault();

    if (moves[event.keyCode]) {
      let p = moves[event.keyCode](board.piece);

      if (event.keyCode === KEY.SPACE) {
        while (board.valid(p)){
          board.piece.move(p);
          account.score += POINTS.HARD_DROP;
          p = moves[KEY.SPACE](board.piece)
        }
      }
      else if (board.valid(p)) {
        board.piece.move(p);
        if (event.keyCode === KEY.DOWN){
          account.score += POINTS.SOFT_DROP;
        }
      }
}}

function addEventListener() {
    document.removeEventListener('keydown', handleKeyPress);
    document.addEventListener('keydown', handleKeyPress)
}

function animate(now = 0) {
  time.elapsed = now - time.start
  
  if(time.elapsed > time.level) {
    time.start = now;

    if (!board.drop()){
      gameOver();
      return;
    }
  }

  draw()
  requestID = requestAnimationFrame(animate)
}

function gameOver() {
  cancelAnimationFrame(requestID);

  ctx.fillStyle = 'black';
  ctx.fillRect(1, 3, 8, 1.2);
  ctx.font = '1px Arial';
  ctx.fillStyle = 'red';
  ctx.fillText('GAME OVER', 1.8, 4);

  checkHighScore(account.score)
}

function checkHighScore(score) {
  const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) || [];

  const lowestScore = highScores[NO_OF_HIGH_SCORES - 1]?.score ?? 0;

  if (score > lowestScore) {
    saveHighScore(score, highScores);
    showHighScores();
  }
}

function saveHighScore(score, highScores) {
  const name = prompt('You git a highscore! Enter name:');
  const newScore = {score, name};

  highScores.push(newScore);
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(NO_OF_HIGH_SCORES);
  localStorage.setItem(HIGH_SCORES, JSON.stringify(highScores));
}

function showHighScores() {
  const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) || [];
  const highScoreList = document.getElementById(HIGH_SCORES);
  highScoreList.innerHTML = highScores
  .map((score) => `<li> ${score.score} - ${score.name}`)
  .join('')
}

function* colorCycleGenerator(COLORS) {
  let index = 0;
  while (true) {
    yield COLORS[index % COLORS.length];
    index++;
  }
}

function enqueuePieceWithPriority() {
  const available = [...Array(SHAPES.length).keys()];
  const typeID = Math.floor(Math.random() * available.length);
  const priority = (typeID === lastTypeID) ? Math.random() * 0.3 : Math.random()
  pieceQueue.enqueue(typeID, priority);
}

function getNextPieceType() {
  const typeID = pieceQueue.dequeue('highest');
  lastTypeID = typeID;
  enqueuePieceWithPriority();
  return typeID;
}