class Cell {
  constructor(row, col, piece = null) {
    this.row = row;
    this.col = col;
    this.piece = piece;
    this.occupied = false;
  }

  isEmpty() {
    return !this.occupied;
  }

  reset() {
    this.piece = null;
    this.occupied = false;
  }

  addPiece(piece, data) {
    this.piece = piece;
    this.occupied = true;
    piece.updatePosition(this.row, this.col, data);
  }
}

export default Cell;
