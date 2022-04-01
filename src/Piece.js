import React from "react";

class Piece extends React.Component {
  render() {
    const { player } = this.props;

    return <div className={`checker-piece ${player.color}`} />;
  }
}

export default Piece;
