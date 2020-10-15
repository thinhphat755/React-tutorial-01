import React from 'react';
import Square from '../Square';

function Board(props){
    const renderSquare = (i) => {
        const winLine = props.winLine;
        return (
            <Square
                value={props.squares[i]}
                onClick={() => props.onClick(i)}
                highlight={(winLine && winLine.includes(i))}
            />
        );
    }

    /*using 2 loops to create squares */
    const boardSize = 3;
    let squares = [];
    for (let i = 0; i < boardSize; i++) {
        let row = [];
        for (let j = 0; j < boardSize; j++) {
            row.push(renderSquare(i * boardSize + j));
        }
        squares.push(<div key={i} className="board-row">{row}</div>);
    }
    return (
        <div>
            {squares}
        </div>
    );
}

export default Board;