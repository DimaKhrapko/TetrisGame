"use strict"

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

let board = null;

const KEY = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  SPACE: 32,
}

Object.freeze(KEY);

