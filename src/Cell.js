import React from "react";
import Piece from "./Piece";
import cs from "classnames";

class Cell extends React.Component {
  constructor() {
    super();

    this.state = {
      selected: false
    };
  }

  handleClick(cell) {
    this.setState({
      selected: !this.state.selected
    });

    this.props.movePiece(cell);
  }

  classNames() {
    const classNames = cs("cell", this.state.selected ? "selected" : null);

    return classNames;
  }

  render() {
    const { piece, cell } = this.props;

    return (
      <td onClick={() => this.handleClick(cell)} className={`cell`}>
        {piece && <Piece player={piece} />}
      </td>
    );
  }
}

export default Cell;
