import styled from 'styled-components'
import {Grid} from "@mui/material"

export const Container = styled.div`
    .colorP1{
        background-color: ${(props) => props.colorp1} ;
    }
    .colorP2{
        background-color: ${(props) => props.colorp2} ;
    }
`
export const ContainerLeft = styled(Grid) `
    background-color: #F5F5F5 ;
    height: 100% ;
    display:flex;
    justify-content:center ;
    align-items: center ;
    border: 2px inset #D7D7D7;
    box-shadow: 2px 2px 3px 2px rgba(0,0,0,0.5);
` 
export const PlayerParagraph = styled.p`
    text-align: center ;
`
export const ContainerRight = styled(Grid) `
    background-color: #F5F5F5;
    width: 100%;
    height:47.5%;
    display:flex;

`