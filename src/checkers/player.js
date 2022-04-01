import Piece from "./piece";

class Player {
  constructor( color = null, id) {
    this.id = id;
    this.color = color;
    this.pieces = new Array(12).fill(0).map((piece, idx) => {
      return new Piece(idx, this.id, this.color);
    });
    this.capturedPieces = [];
  }

  getPiece(row, col) {
    const piece = this.pieces.shift();

    this.pieces.push(piece);

    return piece;
  }

  chooseSide(side) {
    this.pieces.forEach(piece => {
      piece.side = side;
    });

    return this;
  }
}

export default Player;
