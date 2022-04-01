import Board from "./board";
import Player from "./player";

class Checkers {
  constructor(board) {
    this.board = new Board(8, 8);
    this.player1 = new Player("colorP1", 1);
    this.player2 = new Player("colorP2", 2);
    this.selectedCell = null;
    this.previousCell = null;
    this.currentPlayer = this.player1;

    this.data = this.init();

    this.updateAllValidMoves();
  }

  init() {
    let grid = this.board;

    const northPlayer = this.player1.chooseSide("north");
    const southPlayer = this.player2.chooseSide("south");

    return grid.data.map((row, rowIdx) => {
      return row.map((cell, cellIdx) => {
        if (rowIdx <= 2 && (rowIdx + cellIdx) % 2 !== 0) {
          cell.addPiece(northPlayer.getPiece(rowIdx, cellIdx));
        } else if (rowIdx >= 5 && (rowIdx + cellIdx) % 2 !== 0) {
          cell.addPiece(southPlayer.getPiece(rowIdx, cellIdx));
        }

        return cell;
      });
    });
  }

  selectCell(cell) {
    if (cell.occupied && cell.piece.playerId === this.currentPlayer.id) {
      this.selectedCell = this.data[cell.row][cell.col];
      // this.selectedCell.piece.drawPath();
    } else if (this.selectedCell !== null && cell.isEmpty()) {
      this.movePiece(cell.row, cell.col);
    }
  }

  movePiece(row, col) {
    this.previousCell = this.selectedCell;
    this.selectedCell = this.data[row][col];

    const piece = this.previousCell.piece;

    if (piece.isValidPath(row, col)) {
      this.selectedCell.addPiece(piece, this.data);
      this.previousCell.reset();
      this.updateAllValidMoves();
      this.changePlayer();
    } else {
      console.log(`${this.currentPlayer.name}: ILLEGAL MOVE`);
    }
  }

  updateAllValidMoves() {
    this.data.forEach(row => {
      row.forEach(cell => {
        cell.piece && cell.piece.updateValidMoves(this.data);
      });
    });
  }

  changePlayer() {
    const { player1, player2 } = this;

    this.selectedCell = null;
    this.previousCell = null;
    this.currentPlayer = this.currentPlayer === player1 ? player2 : player1;
  }
}

export default Checkers;
