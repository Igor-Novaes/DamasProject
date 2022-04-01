import Cell from "./cell";

class Board {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.data = this.generateGrid();
  }

  generateGrid() {
    let cells = [];

    for (let i = 0; i < this.rows; i++) {
      cells[i] = [];
      for (let j = 0; j < this.cols; j++) {
        cells[i][j] = new Cell(i, j);
      }
    }

    return cells;
  }
}

export default Board;
