import React from "react";
import Row from "./Row";

class BoardView extends React.Component {
  renderRows() {
    const { checkers, movePiece } = this.props;

    return checkers.data.map((row, idx) => {
      return <Row key={idx} movePiece={movePiece} row={row} />;
    });
  }

  render() {
    return (
      <table>
        <tbody>{this.renderRows()}</tbody>
      </table>
    );
  }
}

export default BoardView;
