import React from "react";

class App extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      gameStarted: false,
      whosTurn: 'player1',
      checkGameOver: false,
      gameOver: false,
      gameOverReason: '',
      winner: '',
      player1: {
        color: 'green',
        pieces: 12
      },
      player2: {
        color: 'black',
        pieces: 12
      },
      board: {
        squares: [
          //template for square objects (dummy value)
          {id: 1, col: 1, row: 1, width: 75, height: 75, sqColor: "red", x: 0, y: 0, piece: {id: 1, color: 'red', type: 'pawn'},  isEmpty: 'false'}
        ]
      },
      history: [],
    }
    
    this.startGame = this.startGame.bind(this);
    this.updateGame = this.updateGame.bind(this);
    this.gameOver = this.gameOver.bind(this);
    this.checkPieces = this.checkPieces.bind(this);
    this.canPlayerMove = this.canPlayerMove.bind(this);
    this.canMoveTo = this.canMoveTo.bind(this);
    this.backtrack = this.backtrack.bind(this);
    this.endGame = this.endGame.bind(this);
  }
  
  startGame(e){
    this.setState({
      gameStarted: true
    });
  }
  
  updateGame(board, whosTurn, checkGameOver, player1Pieces, player2Pieces, history){
    this.setState({
      whosTurn: whosTurn,
      board: Object.assign({}, board),
      checkGameOver: checkGameOver,
      player1: {
        color: 'red',
        pieces: player1Pieces
      },
      player2: {
        color: 'black',
        pieces: player2Pieces
      },
      history: history.slice(0)
    });
  }
  
  /** Updates the state to the chosen history that was clicked. **/
  backtrack(e){
    this.setState(Object.assign({}, this.state.history[e.target.value]));
  }
  
  gameOver(reason, winner){
    this.setState({
      gameOver: true,
      winner: winner,
      gameOverReason: reason
    })
  }
  
  /** End game for debugging **/
  endGame(){
    this.setState({
      player2 : {
        pieces : 0
      },
    })
  }
  
  // Checks if player has any pieces left, if not, gave over!
  checkPieces(){
    let winner;
    
    if (this.state.player1.pieces == 0){
      winner = 'Player 2 (Blue)';
      this.gameOver("player 1 has no more pieces left", winner);
    }
    else if (this.state.player2.pieces == 0){
      winner = 'Player 1 (Red)';
      this.gameOver("player 2 has no more pieces left", winner);
    }
  }
  
  // Checks if player can move, if not, game over!
  canPlayerMove(){
    let isGameOver = true;
    let winner = this.state.whosTurn == "player1" ? 'Player 2 (blue)' : 'Player 2 (red)';
    
    for (let i = 0; (i < this.state.board.squares.length); i++){
      if (this.canMoveTo(this.state.board.squares[i], true).length != 0){
        isGameOver = false;
      }
    }
    
    if(isGameOver){
      this.gameOver('No more moves are left', winner);
    }
  }
  
   // returns array of square id objects that the piece can move to
  canMoveTo(currentSquareState, initialCheck){
    let boardState = Object.assign({}, this.state.board);
    let currentSquareObj = Object.assign({}, currentSquareState);
    let canMoveToSquares = [];
    let opponentColor = this.state.whosTurn == 'player1' ? 'black' : 'red';
    let activePlayerColor = this.state.whosTurn == 'player1' ? 'red' : 'black';
    let stopLoop;
    let direction;
    let pawnMovement = {
      red: {
        upLeft: [-1, -1],
        upRight: [-1, 1],
      },
      black: {
        downLeft: [1, -1],
        downRight: [1, 1],
      } 
    };
    let kingMovement = {
        upLeft: [[-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7]],
        upRight: [[-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7]],
        downLeft: [[1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7]],
        downRight: [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7]],
    };
    
    //currentSquareState.piece.type = 'king';
    
    if (currentSquareState.piece.color == activePlayerColor){
      if (currentSquareState.piece.type == 'pawn'){
      for (let props in pawnMovement[currentSquareObj.piece.color]){
        d3.selectAll('.rect').each(function(d, i){
          // if row and column # matches
          if (this.getAttribute('data-row') == (currentSquareObj.row + pawnMovement[currentSquareObj.piece.color][props][0]) && this.getAttribute('data-col') == (currentSquareObj.col + pawnMovement[currentSquareObj.piece.color][props][1])){
            // if square is empty, add square to canMoveToSquares
            if (this.getAttribute('data-isEmpty') == 'true'){
              canMoveToSquares.push({sqId: this.getAttribute('data-id'), jumpedPiece: 'none'});
              
              if (initialCheck){
              }
              else{
                this.classList.add('highlight_sq');
                //this.style.fill = 'lightblue';
                //this.style.opacity = 0.7;
              }
            }
            // if square isn't empty, check if piece can be jumped
            else{ 
              direction = props;
              checkForJumps(this, 'pawn', direction, []);   
            }
          }
        });
      }
    }
    else if (currentSquareState.piece.type == 'king'){
      for (let props in kingMovement){
        stopLoop = 'no';
          
        for (let i = 0; i < kingMovement[props].length; i++){
          if (stopLoop == 'no'){
            d3.selectAll('.rect').each(function(){
              // if row and column # matches
              if (this.getAttribute('data-row') == (currentSquareObj.row + kingMovement[props][i][0]) && this.getAttribute('data-col') == (currentSquareObj.col + kingMovement[props][i][1])){
                // if square is empty
                if (this.getAttribute('data-isEmpty') == 'true'){
                  canMoveToSquares.push({sqId: this.getAttribute('data-id'), jumpedPiece: 'none'});
                  
                  if(initialCheck){
                  }
                  else{
                    this.classList.add('highlight_sq');
                    //this.style.fill = 'lightblue';
                    //this.style.opacity = 0.7;
                  }
                }
                // if square isn't empty, check if piece can be jumped
                else{
                  direction = props;
                  checkForJumps(this, 'king', direction, []);
                  stopLoop = 'yes';
                }
              } 
            })
          }
        }
      }
    }
  }
      
    
      
    

    function checkForJumps(squareToJump, type, direction, _jumpedPieces){
      let moves;
      let addSubCol;
      let upOrDown;
      let nextSqToJump;
      let nextJumpDirection;
      let jumpedPieces = _jumpedPieces.slice(0);
      
      switch(direction){
            case 'upLeft':
              moves = [[-1, 1], [1, -1], [-1, -1]];
              addSubCol = -1;
              upOrDown = -1;
              break;
            case 'upRight': 
              moves = [[1, 1], [-1, 1], [-1, -1]];
              addSubCol = 1;
              upOrDown = -1;
              break;
            case 'downLeft':
              moves = [[1, -1], [1, 1], [-1, -1]];
              addSubCol = -1;
              upOrDown = 1;
              break;
            case 'downRight':
              moves = [[-1, 1], [1, -1], [1, 1]];
              addSubCol = 1;
              upOrDown = 1;
              break;
      }
      
      if (type == 'pawn'){
        if(squareToJump.getAttribute('data-pieceColor') == opponentColor){
          d3.selectAll('.rect[data-row="' + (parseInt(squareToJump.getAttribute('data-row')) + upOrDown) + '"][data-col="' + (parseInt(squareToJump.getAttribute('data-col')) + addSubCol) + '"]')
            .each(function(){
              // if square is empty
              if (this.getAttribute('data-isEmpty') == 'true'){
                jumpedPieces.push(squareToJump.getAttribute('data-pieceId'));
                canMoveToSquares.push({sqId: this.getAttribute('data-id'), jumpedPieceIds: jumpedPieces});
                
                if(initialCheck){
                }
                else{
                  this.classList.add('highlight_sq');
                  //this.style.fill = 'lightblue';
                  //this.style.opacity = 0.7;
                }
                
                for (let i = 0; i < moves.length; i++){
                  nextSqToJump = document.querySelector(`.rect[data-row='${(parseInt(this.getAttribute('data-row')) + moves[i][0])}'][data-col='${(parseInt(this.getAttribute('data-col')) + moves[i][1])}']`);
                  
                  if (nextSqToJump){
                    switch(JSON.stringify(moves[i])){
                      case '[1,1]':
                        nextJumpDirection = 'downRight';
                        break;
                      case '[-1,-1]': 
                        nextJumpDirection = 'upLeft';
                        break;
                      case '[1,-1]':
                        nextJumpDirection = 'downLeft';
                        break;
                      case '[-1,1]':
                        nextJumpDirection = 'upRight';
                        break;
                    }
                    
                    checkForJumps(nextSqToJump, 'pawn', nextJumpDirection, jumpedPieces);
                  }
                }
              }
          });
        }
      }
      else if (type == 'king'){
        if(squareToJump.getAttribute('data-pieceColor') == opponentColor){
          d3.selectAll('.rect[data-row="' + (parseInt(squareToJump.getAttribute('data-row')) + upOrDown) + '"][data-col="' + (parseInt(squareToJump.getAttribute('data-col')) + addSubCol) + '"]')
          .each(function(){
            // if square is empty
            if (this.getAttribute('data-isEmpty') == 'true'){ 

              jumpedPieces.push(squareToJump.getAttribute('data-pieceId'));
              canMoveToSquares.push({sqId: this.getAttribute('data-id'), jumpedPieceIds: jumpedPieces});
              
              if(initialCheck){     
              }
              else{
                this.classList.add('highlight_sq');
                //this.style.fill = 'lightblue';
                //this.style.opacity = 0.7;
              }

              for (let i = 0; i < moves.length; i++){
                nextSqToJump = document.querySelector(`.rect[data-row='${(parseInt(this.getAttribute('data-row')) + moves[i][0])}'][data-col='${(parseInt(this.getAttribute('data-col')) + moves[i][1])}']`);
               
                if (nextSqToJump){
                   switch(JSON.stringify(moves[i])){
                    case '[1,1]':
                      nextJumpDirection = 'downRight';
                      break;
                    case '[-1,-1]': 
                      nextJumpDirection = 'upLeft';
                      break;
                    case '[1,-1]':
                      nextJumpDirection = 'downLeft';
                      break;
                    case '[-1,1]':
                      nextJumpDirection = 'upRight';
                      break;
                   }

                   checkForJumps(nextSqToJump, 'king', nextJumpDirection, jumpedPieces);
                  
                }
              }
            }
          });
        }
      }
    }
    if(initialCheck){              
    }
    else{
      console.log('canMoveToSquares');
      console.log(canMoveToSquares);
    }
 
    return canMoveToSquares;
  }
  
  componentDidUpdate(){
    if (this.state.checkGameOver == true && this.state.gameOver == false){
      this.canPlayerMove();
      this.checkPieces();
    }
  }
  componentDidMount() {}   
  
  render(){
    console.log('this.state');
    console.log(this.state);
    
    return(
      <>
        {this.state.gameStarted 
          ? <UserInterface gameState={this.state} updateGame={this.updateGame} canMoveTo={this.canMoveTo} backtrack={this.backtrack}  endGame={this.endGame}/> 
          : <StartMenu startGame={this.startGame} />}
      </>
    )
  }
}

class StartMenu extends React.Component{
  constructor(props){
    super(props);
  }
  
  render(){
    const btnStyle = {
      border: '2px solid cornflowerblue',
      fontWeight: 'bold',
      letterSpacing: '2px'
    }
    
    return(
      <div id="start_menu" className="row">
        <div className="col">
          <div className="row text-center justify-content-center h-100">
            <div className="col-8 start_menu_bg">
              <h1 className="display-4 text-dark font-weight-bolder"><img className="logo" src="https://tile-tanks.com/resources/checkers_logo.png" alt="logo"/></h1>
              <h3><img className="two-player-text" src="https://tile-tanks.com/resources/twoPlayer.png" alt="2 player"/></h3>
              <br />
              <button className="btn btn-info" id="start_btn" style={btnStyle} onClick={this.props.startGame}>Start Game</button>
            </div>
          </div>
        </div>
      </div>  
    )
  }
}

class UserInterface extends React.Component{
  constructor(props){
    super(props);
  }
  
  render(){
    let gameStatus;
    
    if (this.props.gameState.gameOver == false){
      gameStatus = <span>It is <span className={this.props.gameState.whosTurn == 'player1' ? 'player1Text' : 'player2Text'}>{this.props.gameState.whosTurn == 'player1' ? 'Player 1\'s' : 'Player 2\'s'}</span> turn.</span>;
    }
    else{
      gameStatus = <span>Game Is Over. <span className={this.props.gameState.winner == 'Player 1 (Red)' ? 'player1Text' : 'player2Text'}>{this.props.gameState.winner}</span> is the winner!</span>;
    }
    
    return(
        <div className="row ui h-100">
          <div id="left_menu" className="col-2 bg-dark align-self-start">
            <h2 className="gameStatus">{gameStatus}</h2>
            <hr />
            <div className="piecesLeft">
              <h2 className="piecesLeftHeader"></h2>
              <span className="player1Text">Player 1 pieces: <br />{this.props.gameState.player1.pieces}</span>
              <br />
              <span className="player2Text">Player 2 pieces: <br />{this.props.gameState.player2.pieces}</span>
            </div>
          </div>
          <div className="col-8 text-center align-self-center">
            <Board width="600" height="600" gameState={this.props.gameState} updateGame={this.props.updateGame} canMoveTo={this.props.canMoveTo}/>
          </div>
          <div id="right_menu" className="col-2 bg-dark align-self-start">
            <h2 className="historyText">History</h2>
            {this.props.gameState.history.map((history, i)=>{
              return <button className='historyBtn btn-info' onClick={this.props.backtrack} value={i}>{i == 0 ? `Restart Game` : `Go To Move ${i}`}</button>;
            })}
          </div>
        </div>
    )
  }
}

class Board extends React.Component{
  constructor(props){
    super(props);
  }
  
  componentWillMount() {
    const squaresAmount = 64;
    const sqWidth = 75;
    const sqHeight = 75;
    let sqX = 0;
    let sqY = 0;
    let sqColor = '';
    let sqPieceColor;
    let sqPieceId = -1;
    let isEmpty;
    let boardState = {squares: []};
    let row = 1;
    let col = 1;
    let colorCounter = 0;
    
    for (let i = 1; i <= squaresAmount; i++){
      colorCounter % 2 == 0 ? (sqColor = 'red') : (sqColor = 'black');
      
      if(sqColor == 'black' && i <= 24){
        sqPieceColor = 'black';
        isEmpty = 'false';
        sqPieceId++;
      }
      else if(sqColor == 'black' && i > 40){
        sqPieceColor = 'red';
        isEmpty = 'false';
        sqPieceId++;
      }
      else{
        sqPieceColor = 'none';
        isEmpty = 'true';
      }
      
      boardState.squares.push({id: i, row: row, col: col, x: sqX, y: sqY, width: sqWidth, height: sqHeight, sqColor: sqColor, piece: isEmpty == 'true' ? {} : {id: sqPieceId, color: sqPieceColor, type: 'pawn'}, isEmpty: isEmpty});
      
      sqX += sqWidth;
      
      if (i % 8 == 0){
        sqX = 0;
        sqY += sqHeight;
        col = 1;
        row++;
      }
      else{
        colorCounter += 1;
        col++;
      }
    }
    
    this.props.updateGame(Object.assign({}, boardState), 'player1', this.props.gameState.checkGameOver, this.props.gameState.player1.pieces, this.props.gameState.player2.pieces, this.props.gameState.history.slice(0));
    
  }
  
  componentDidMount() {

  }      
  
  render(){
    let boardStyle = {
      maxWidth: '600px',
      maxHeight: '600px'
    }
    
    return(
      <div id="board">
        <svg className="board" viewBox={`0 0 ${this.props.width} ${this.props.height}`} preserveAspectRatio="none meet" style={boardStyle}>
          {this.props.gameState.board.squares.map((sq, i) => {
            return <Square id={sq.id} colorClass={sq.sqColor} x={sq.x} y={sq.y} width={sq.width} height={sq.height} sqPiece={sq.piece} isEmpty={sq.isEmpty} gameState={this.props.gameState} updateGame={this.props.updateGame} canMoveTo={this.props.canMoveTo}/>
          })}
        </svg>
      </div>
    )
  }
}

class Square extends React.Component{
   componentDidUpdate() {
    // increase z-index of all checker pieces and text
    d3.selectAll('.checkerPiece').raise();
   }   

  render(){
    const sqCenterX = this.props.x + (this.props.width / 2);
    const sqCenterY = this.props.y + (this.props.height / 2);
    let sqContent = '';
    
    if (this.props.sqPiece.color == "black")
      sqContent = <CheckerPiece id={this.props.sqPiece.id} sqId={this.props.id} sqCenterX={sqCenterX} sqCenterY={sqCenterY} fillColor='steelblue' stroke='cadetblue' gameState={this.props.gameState} color={this.props.sqPiece.color} type={this.props.sqPiece.type} updateGame={this.props.updateGame} canMoveTo={this.props.canMoveTo}/>;
    else if (this.props.sqPiece.color == "red")
      sqContent = <CheckerPiece id={this.props.sqPiece.id} sqId={this.props.id} sqCenterX={sqCenterX} sqCenterY={sqCenterY} fillColor='#ff3333' stroke='brown' gameState={this.props.gameState} color={this.props.sqPiece.color} type={this.props.sqPiece.type} updateGame={this.props.updateGame} canMoveTo={this.props.canMoveTo}/>;
    
    return(
      <>
        <rect data-id={this.props.id} className={'rect ' + this.props.colorClass} width={this.props.width} height={this.props.height} x={this.props.x} y={this.props.y} centerX={sqCenterX} centerY={sqCenterY} data-piece={this.props.sqPiece} data-pieceId={this.props.sqPiece.id} data-color={this.props.colorClass} data-pieceColor={this.props.sqPiece.color} data-row={this.props.gameState.board.squares[this.props.id -1].row} data-col={this.props.gameState.board.squares[this.props.id -1].col} data-isEmpty={this.props.isEmpty} />
        {sqContent}
      </>
    )
  }
}

class CheckerPiece extends React.Component{
  constructor(props){
    super(props);
    
    this.dragended = this.dragended.bind(this);
    this.dragstarted = this.dragstarted.bind(this);
  }
  
  playerTurnEnd(board, whosTurn, checkGameOver, redPieces, blackPieces, history) {
    this.props.updateGame(board, whosTurn, checkGameOver, redPieces, blackPieces, history);
  }
  
  
  dragstarted(piece) {
    piece.style.cursor = 'grabbing';
    piece.setAttribute('data-prev-CenterX', piece.firstChild.getAttribute('cx'));
    piece.setAttribute('data-prev-CenterY', piece.firstChild.getAttribute('cy'));
    
    // if text 'K' exist
    if(piece.children[1]){
      piece.setAttribute('data-prev-TextX', piece.children[1].getAttribute('x'));
      piece.setAttribute('data-prev-TextY', piece.children[1].getAttribute('y'));
    }
    
    let currentSquareState = Object.assign({}, this.props.gameState.board.squares[piece.getAttribute('data-sqId') - 1]);
    this.props.canMoveTo(currentSquareState);
  }

  drag() {
    d3.select(this.firstChild).attr("cx", parseInt(this.firstChild.getAttribute('cx')) + parseInt(d3.event.dx)).attr("cy", parseInt(this.firstChild.getAttribute('cy')) + parseInt(d3.event.dy));
    
    // if text 'K' exist
    if(this.children[1]){
      d3.select(this.children[1]).attr('x', parseInt(this.children[1].getAttribute('x'))  + parseInt(d3.event.dx)).attr("y", parseInt(this.children[1].getAttribute('y')) + parseInt(d3.event.dy));
    }
  }

  dragended(piece) {
    let gameState = Object.assign({}, this.props.gameState); 
    let currentPiece = d3.select(piece);
    let currentPieceCircle = d3.select(piece.firstChild);
    let currentPieceText = piece.children[1] ? d3.select(piece.children[1]) : 'none';
    let pieceCenterX = currentPieceCircle.attr('cx');
    let pieceCenterY = currentPieceCircle.attr('cy');
    let overallDistance = 999999999999;
    let chosenSq;
    let updatedBoard = Object.assign({}, {squares: []});
    let whosTurn = this.props.gameState.whosTurn;
    let currentSquareState = Object.assign({}, this.props.gameState.board.squares[piece.getAttribute('data-sqId') - 1]);
    let redPieces = this.props.gameState.player1.pieces;
    let blackPieces = this.props.gameState.player2.pieces;
    let redPiecesJumped = 0;
    let blackPiecesJumped = 0;
    let stopLoop = false;
    let history = gameState.history.slice(0);
    
    piece.style.cursor = 'grab';
    
    d3.selectAll('.rect').each(function(){
      let distanceX = this.getAttribute('centerX') - pieceCenterX;
      let distanceY = this.getAttribute('centerY') - pieceCenterY;
      distanceX = Math.abs(distanceX);
      distanceY = Math.abs(distanceY);
      let distance = distanceX + distanceY;
      
      if (distance < overallDistance){
        overallDistance = distance;
        chosenSq = this;
      }
    });

    // if there are no squares to move to
    if(this.props.canMoveTo(currentSquareState).length == 0){
      currentPieceCircle.attr('cx', currentPiece.attr('data-prev-CenterX')).attr('cy', currentPiece.attr('data-prev-CenterY'));
      // if text 'King' exist
      if(currentPieceText != 'none'){
        currentPieceText.attr('x', currentPiece.attr('data-prev-TextX')).attr('y', currentPiece.attr('data-prev-TextY'));
      }
    }

    // loops through squares available to move to
    this.props.canMoveTo(currentSquareState).forEach((obj, i)=>{
      // if you dropped a piece on an available square, then start updating the state of the board.
      if (chosenSq.getAttribute('data-id') == obj.sqId && stopLoop == false){
        stopLoop = true;

        updatedBoard.squares = this.props.gameState.board.squares.map((s)=>{
          let sq = Object.assign({}, s);
          let sqPiece = Object.assign({}, sq.piece);
          
          // set items for the new square
          if(sq.id == chosenSq.getAttribute('data-id')){
            sqPiece.id = currentPiece.attr('data-id');
            sqPiece.color = currentPiece.attr('data-color');
            sq.isEmpty = 'false';

            // KING ME
            if ((sqPiece.color == 'red' &&  chosenSq.getAttribute('data-row') == '1') || (sqPiece.color == 'black' &&  chosenSq.getAttribute('data-row') == '8')){
              sqPiece.type = 'king';
            }
            else{
              sqPiece.type = currentPiece.attr('data-type');
            }
          }
          // set items for the previous square
          if(sq.id == currentPiece.attr('data-sqId')){
            sqPiece = {};
            sq.isEmpty = 'true';
          }
          // set items for the jumped square/piece
          if(obj.jumpedPieceIds){
            for (let j = 0; j <= i; j++){
              if(sqPiece.id == parseInt(obj.jumpedPieceIds[j])){
                sqPiece = {};
                sq.isEmpty = 'true';
                currentPiece.attr('data-color') == 'red' ? blackPiecesJumped++ : redPiecesJumped++;
              }
            }
          }
          
          sq.piece = sqPiece;
          return sq;
        })

        whosTurn = whosTurn == 'player1' ? 'player2' : 'player1';
        history.push(gameState);
        this.playerTurnEnd(updatedBoard, whosTurn, true, redPieces - redPiecesJumped, blackPieces - blackPiecesJumped, history);
      }
      else{
        currentPieceCircle.attr('cx', currentPiece.attr('data-prev-CenterX')).attr('cy', currentPiece.attr('data-prev-CenterY'));
        // if text 'King' exist
        if(currentPieceText != 'none'){
          currentPieceText.attr('x', currentPiece.attr('data-prev-TextX')).attr('y', currentPiece.attr('data-prev-TextY'));
        }
      }
    });
    
    d3.selectAll('.rect').each(function(){
      //this.style.opacity = 1;
      this.classList.remove('highlight_sq');
    });
  } 
  
  componentDidMount(){
    // remove drag listeners
    d3.selectAll('.checkerPiece[data-active=false]')
      .call(d3.drag()
            .on('start', null)
            .on('drag', null)
            .on('end', null)
      );
    
    // add drag listeners to active pieces only
    d3.selectAll('.checkerPiece[data-active=true]')
      .call(d3.drag()
            .on('start', (d, i, nodes)=>this.dragstarted(nodes[i]))
            .on('drag', this.drag)
            .on('end', (d, i, nodes)=>this.dragended(nodes[i]))
       );
   }
  
  render(){
    let active;
    
    if (this.props.gameState.whosTurn == 'player1'){
      this.props.color == 'red' ? active = true : active = false;
    }
    else {
      this.props.color == 'black' ? active = true : active = false;
    }
      
    
    return(
      <g data-id={this.props.id} className='checkerPiece' data-type={this.props.type} data-color={this.props.color} data-sqId={this.props.sqId} data-active={active}>
        <circle cx={this.props.sqCenterX} cy={this.props.sqCenterY} r='20' stroke={this.props.stroke} stroke-width='3' fill={this.props.fillColor} />
        {this.props.type == 'king' ? <text data-piece-id={this.props.id}  x={this.props.sqCenterX - 5} y={this.props.sqCenterY + 5} fill="white">K</text> : ''}

      </g>
    )
  }
}

//debugging click
window.addEventListener('click', (e)=>{
  console.log(`x: ${e.clientX} , y: ${e.clientY}`);
});

ReactDOM.render(
  <App />,
  document.getElementById('app'));