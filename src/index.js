import React from "react";
import ReactDOM from "react-dom";
import BoardView from "./BoardView";
import Checkers from "./checkers";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { Container, ContainerLeft, PlayerParagraph, ContainerRight } from "./checkers/style";
import { Grid } from "@mui/material";

import "./styles.css";

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      color1:'red',
      color2:'black',
      isReset:false,
      checkers: new Checkers(),
    };
  }

  movePiece = (cell) => {
    const { checkers } = this.state;

    checkers.selectCell(cell);

    this.setState({
      checkers,
    });
  };
  setColor1 = (e) =>{
    this.setState({
      color1: e.target.value
    })
  }
  setColor2 = (e) =>{
    this.setState({
      color2: e.target.value
    })
  }
  reset = () =>{
    this.setState({
      checkers: new Checkers()
    })
   
  }
  render() {
    const { checkers } = this.state;
    console.log(checkers);
    return !this.state.isReset &&(
      <Grid
        container
        p={2}
        columnSpacing={2}
        justifyContent={"center"}
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginLeft:'60px'
        }}
      >
        <ContainerLeft item xs={8}>
          <Container container colorp1={this.state.color1} colorp2={this.state.color2}>
            <div className="checkers">
              <div>
                <PlayerParagraph>
                  JOGADOR <br />
                  BETA
                </PlayerParagraph>
              </div>
              <div style={{backgroundColor:'white', padding:'8px'}}>
                <BoardView movePiece={this.movePiece} checkers={checkers} />
              </div>
              <div>
                <PlayerParagraph>
                  JOGADOR <br />
                  ALPHA
                </PlayerParagraph>
              </div>
            </div>
          </Container>
        </ContainerLeft>
        <Grid item xs={4} style={{height:'100%'}}>
          <Grid container style={{height:'100%'}}>
              <ContainerRight item xs={9} style={{ marginLeft:'20px', flexDirection: 'column'}}>
                  <p style={{margin:'15px 0 0 15px', fontWeight:'bold', fontSize:'30px'}}>Style Configuration</p>
                  <p style={{margin:'25px 0 0 15px', fontWeight:'bold', fontSize:'20px'}}>Player Alpha</p>
                  <div style={{margin:'40px 0 0 30px', fontSize:'17px',width:'200', display:'flex', alignItems:'center', justifyContent:'flex-start'}}>
                    <InputLabel id={1} style={{marginRight:'15px'}}>Piece Color</InputLabel>
                    <Select defaultValue={'red'} onChange={this.setColor1}>
                      <MenuItem value={'green'}>
                        <div style={{width:'25px', height:'25px', backgroundColor:'green', float:'left', marginRight:'5px'}}/> Green
                      </MenuItem>
                      <MenuItem value={'red'}>
                        <div style={{width:'25px', height:'25px', backgroundColor:'red', float:'left', marginRight:'5px'}}/> Red
                      </MenuItem>
                      <MenuItem value={'blue'}>
                        <div style={{width:'25px', height:'25px', backgroundColor:'blue', float:'left', marginRight:'5px'}}/> Blue
                      </MenuItem>
                    </Select>
                  </div>
                   <p style={{margin:'25px 0 0 15px', fontWeight:'bold', fontSize:'20px'}}>Player Beta</p>
                  <div style={{margin:'40px 0 0 30px', fontSize:'17px',width:'200', display:'flex', alignItems:'center', justifyContent:'flex-start'}}>
                    <InputLabel id={1} style={{marginRight:'15px'}}>Piece Color</InputLabel>
                    <Select defaultValue={'black'} onChange={this.setColor2}>
                      <MenuItem value={'black'}>
                        <div style={{width:'25px', height:'25px', backgroundColor:'black', float:'left', marginRight:'5px'}}/> Black
                      </MenuItem>
                      <MenuItem value={'orange'}>
                        <div style={{width:'25px', height:'25px', backgroundColor:'orange', float:'left', marginRight:'5px'}}/> Orange
                      </MenuItem>
                      <MenuItem value={'cyan'}>
                        <div style={{width:'25px', height:'25px', backgroundColor:'cyan', float:'left', marginRight:'5px'}}/> Cyan
                      </MenuItem>
                    </Select>
                  </div>
     
              </ContainerRight>
              <ContainerRight item xs={9} style={{marginTop:'7.5%', marginLeft:'20px'}}>
              <p style={{margin:'15px 0 0 15px', fontWeight:'bold', fontSize:'30px'}}>General</p>
              <Button variant={'contained'} style={{height:'60px', marginTop:'90px'}} onClick={this.reset} >Restart Game</Button>
              </ContainerRight>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
