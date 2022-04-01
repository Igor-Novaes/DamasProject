import React from "react";
import Cell from "./Cell";

class Row extends React.Component {
  renderRow() {
    const { row, movePiece } = this.props;

    return row.map((cell, idx) => {
      return (
        <Cell movePiece={movePiece} key={idx} cell={cell} piece={cell.piece} />
      );
    });
  }

  render() {
    return <tr>{this.renderRow()}</tr>;
  }
}

export default Row;
