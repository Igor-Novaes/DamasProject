class Piece {
  constructor(id, playerId, color = null) {
    this.id = id;
    this.row = null;
    this.col = null;
    this.playerId = playerId;
    this.color = color;
    this.side = null;
    this.validMoves = { east: [], west: [] };
  }

  updatePosition(row, col) {
    this.row = row;
    this.col = col;
  }

  isValidPath(newRow, newCol) {
    const { east, west } = this.validMoves;

    // Could use lodash isEqual to compare arrays ex. [1,0] === [1,0] returns true
    return (
      (newRow === east[0] && newCol === east[1]) ||
      (newRow === west[0] && newCol === west[1])
    );
  }

  jumpMove(eastCell, westCell, east, west) {
    if (
      eastCell &&
      eastCell.occupied &&
      eastCell.piece.playerId !== this.playerId
    ) {
      east[0] = this.row - 2;
      east[1] = this.col + 2;
    } else if (
      westCell &&
      westCell.occupied &&
      westCell.piece.playerId !== this.playerId
    ) {
      west[0] = this.row - 2;
      west[1] = this.col - 2;
    }
  }

  updateValidMoves(data) {
    const moves = {};

    if (this.side === "south") {
      let east = [this.row - 1, this.col + 1];
      let west = [this.row - 1, this.col - 1];

      let eastCell = data[east[0]][east[1]];
      let westCell = data[west[0]][west[1]];

      this.jumpMove(eastCell, westCell, east, west);

      moves.east = east;
      moves.west = west;
    } else if (this.side === "north") {
      let east = [this.row + 1, this.col + 1];
      let west = [this.row + 1, this.col - 1];

      let eastCell = data[east[0]][east[1]];
      let westCell = data[west[0]][west[1]];

      if (
        eastCell &&
        eastCell.occupied &&
        eastCell.piece.playerId !== this.playerId
      ) {
        east = [this.row + 2, this.col + 2];
      } else if (
        westCell &&
        westCell.occupied &&
        westCell.piece.playerId !== this.playerId
      ) {
        west = [this.row + 2, this.col - 2];
      }

      moves.east = east;
      moves.west = west;
    }

    this.validMoves = moves;
  }
}

export default Piece;
